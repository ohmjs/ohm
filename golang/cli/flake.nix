{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachSystem [ "aarch64-darwin" "x86_64-linux" ] (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        adl = pkgs.callPackage (
          {
            stdenv,
            fetchurl,
            unzip,
          }:
          let
            version = "1.2.3";
            src = fetchurl (
              if stdenv.isDarwin && stdenv.hostPlatform.isAarch64 then
                {
                  url = "https://github.com/adl-lang/adl/releases/download/v${version}/adl-bindist-${version}-macos-arm64.zip";
                  sha256 = "sha256-IAdm+tWqRwkoCWfMn69KIdG6rAztRU+aZDQTGGWfZJY=";
                }
              else if stdenv.isLinux && stdenv.hostPlatform.isx86_64 then
                {
                  url = "https://github.com/adl-lang/adl/releases/download/v${version}/adl-bindist-${version}-linux-x64.zip";
                  sha256 = "sha256-5V/RU8LV78NkcE3pu9fkMvbjb184QYO33MjqRtlQPJE=";
                }
              else
                throw "adl: unsupported platform ${stdenv.hostPlatform.system}, only macos-arm64 and linux-x64 are available"
            );
          in
          stdenv.mkDerivation {
            pname = "adl";
            inherit version src;

            nativeBuildInputs = [ unzip ];
            sourceRoot = ".";

            installPhase = ''
              mkdir -p $out/bin $out/lib
              cp bin/adlc $out/bin/
              cp -r lib/* $out/lib/
              chmod +x $out/bin/*
            '';

            meta = {
              description = "Helix ADL tool";
              platforms = [
                "aarch64-darwin"
                "x86_64-linux"
              ];
            };
          }
        ) { };
        devPackages = with pkgs; [
          adl
          go
        ];
      in
      {
        devShells = {
          default = pkgs.mkShell {
            buildInputs = devPackages;
          };
          ci = pkgs.mkShell {
            buildInputs = devPackages;
            SHELLOPTS = "errexit:pipefail";
          };
        };
      }
    );
}
