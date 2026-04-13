package goohm_test

import "testing"

func AssertEqual[T comparable](t *testing.T, got, want T) {
	t.Helper() // Marks this func as a helper for better line reporting
	if got != want {
		t.Errorf("got %v, want %v", got, want)
	}
}

func AssertTrue(t *testing.T, got bool) {
	t.Helper() // Marks this func as a helper for better line reporting
	if !got {
		t.Errorf("expected true, got false")
	}
}

func TestCstReturns01(t *testing.T) {
	gmr, err := compileAndLoad(`G { start = "a" | "b" }`)
	if err != nil {
		t.Fatalf("compiling and loading grammar: %v", err)
	}
	defer gmr.Close()
	result, err := gmr.Match("a")
	if err != nil {
		t.Fatalf("matching: %v", err)
	}
	defer result.Close()
	AssertTrue(t, result.Succeeded())
	root, err := result.GetCstRoot()
	if err != nil {
		t.Fatalf("getting CST root: %v", err)
	}
	// start
	AssertEqual(t, root.NumChildren(), 1)
	AssertEqual(t, root.MatchLength(), 1)
	AssertEqual(t, root.CtorName(), "start")
	// "a"
	term := root.Children()[0]
	AssertEqual(t, term.NumChildren(), 0)
	AssertEqual(t, term.MatchLength(), 1)
	AssertTrue(t, term.IsTerminal())
}

func TestCstReturns02(t *testing.T) {
	gmr, err := compileAndLoad(`
G {
  start = "a" b
  b = "b"
}`)
	if err != nil {
		t.Fatalf("compiling and loading grammar: %v", err)
	}
	defer gmr.Close()
	result, err := gmr.Match("ab")
	if err != nil {
		t.Fatalf("matching: %v", err)
	}
	defer result.Close()
	AssertTrue(t, result.Succeeded())
	root, err := result.GetCstRoot()
	if err != nil {
		t.Fatalf("getting CST root: %v", err)
	}
	// start
	AssertEqual(t, root.NumChildren(), 2)
	AssertEqual(t, root.MatchLength(), 2)
	AssertEqual(t, root.CtorName(), "start")
	// "a"
	childA := root.Children()[0]
	AssertEqual(t, childA.NumChildren(), 0)
	AssertEqual(t, childA.MatchLength(), 1)
	AssertTrue(t, childA.IsTerminal())
	// NonterminalNode for b
	childB := root.Children()[1]
	AssertEqual(t, childB.NumChildren(), 1)
	AssertEqual(t, childB.MatchLength(), 1)
	AssertEqual(t, childB.CtorName(), "b")
	// TerminalNode for "b"
	term := childB.Children()[0]
	AssertEqual(t, term.NumChildren(), 0)
	AssertEqual(t, term.MatchLength(), 1)
	AssertTrue(t, term.IsTerminal())
	AssertEqual(t, term.CtorName(), "_terminal")
}
