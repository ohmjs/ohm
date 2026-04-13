package goohm_test

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/ohmjs/goohm"
)

func compileAndLoad(source string) (*goohm.Grammar, error) {
	// 1. create a temporary directory
	tmpDir, err := os.MkdirTemp("", "goohm-test-*")
	if err != nil {
		return nil, fmt.Errorf("creating temp dir: %w", err)
	}
	defer os.RemoveAll(tmpDir)
	// 2. write the source to the file source.ohm in the temporary directory
	ohmFile := filepath.Join(tmpDir, "source.ohm")
	if err := os.WriteFile(ohmFile, []byte(source), 0644); err != nil {
		return nil, fmt.Errorf("writing source.ohm: %w", err)
	}
	// 3. use `docker run --rm -v "$PWD:/local" ohm:latest compile source.ohm` to create source.wasm file
	// TODO: see if it would be better to use https://github.com/docker/go-sdk/tree/main/container or https://github.com/ory/dockertest
	cmd := exec.Command("docker", "run", "--rm",
		"-v", tmpDir+":/local",
		"ohm:latest", "compile", "source.ohm")
	if out, err := cmd.CombinedOutput(); err != nil {
		return nil, fmt.Errorf("compiling source.ohm: %w\n%s", err, out)
	}
	// 4. read the .wasm file into memory
	wasmFile := filepath.Join(tmpDir, "source.wasm")
	wasmBytes, err := os.ReadFile(wasmFile)
	if err != nil {
		return nil, fmt.Errorf("reading source.wasm: %w", err)
	}
	// 5. create a Grammar from the .wasm bytes and return it
	ctx := context.Background()
	gmr, err := goohm.NewGrammar(ctx, wasmBytes)
	if err != nil {
		return nil, fmt.Errorf("creating grammar: %w", err)
	}
	return gmr, nil
}
