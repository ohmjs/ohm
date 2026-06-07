package goohm

import (
	"fmt"
	"os"
	"reflect"
	"runtime"
	"strings"
)

// type TerminalVisitor[P, R any] interface {
// 	Terminal(payload P, node *TerminalNode) (result R)
// }

type TerminalVisitor interface {
	Terminal(node TerminalNode)
}

type Acceptor[P, R any] interface {
	Accept(visitor any, payload P) (result R)
}

type BuiltinVisitor interface {
	BuiltInRule(node Node)
}

// SkipCheckName is a marker interface that opts a visitor type out of the
// runtime method-signature validation performed by [CheckName].
//
// Implement this interface on a visitor struct when you want to bypass the
// check — for example, while prototyping a visitor whose Visit* methods are
// not yet in their final form, or when a visitor intentionally deviates from
// the expected signature conventions.
//
// Usage:
//
//	var _ goohm.SkipCheckName = MyVisitor{}
//
//	func (MyVisitor) SkipCheckName() {}
type SkipCheckName interface {
	SkipCheckName()
}

// Extract elements from a NonemptyListOf/EmptyListOf/ListOf CST node.
// see packages/compiler/src/buildGrammar.ts:46
func ListOfElement(node Node) []Node {
	// fmt.Printf("\n\n")
	name := node.CtorName()
	idx := strings.Index(name, "<")
	name = name[:idx]
	switch name {
	case "EmptyListOf":
		fallthrough
	case "emptyListOf":
		return []Node{}
	case "NonemptyListOf":
		fallthrough
	case "nonemptyListOf":
		first := node.Children()[0]
		restList := node.Children()[1] // (sep elem)*
		kids := make([]Node, 0, len(restList.Children())+1)
		kids = append(kids, first)
		// fmt.Printf("!%v\n", first)
		// TODO implement using i % 2 != 0
		for i, seqNode := range restList.Children() {
			ctor := seqNode.CtorName()
			if ctor == "_list" {
				panic("????")
			}
			if ctor[:1] != "_" {
				_ = i
				// fmt.Printf("* %d %v\n", i, seqNode)
				kids = append(kids, seqNode)
			}
			// fmt.Printf("!!%d %d %v\n", i, len(seqNode.Children()), seqNode)
			// if seqNode.Children() == nil || len(seqNode.Children()) == 0 {
			// 	continue
			// }
			// fmt.Printf("*%v\n", seqNode.Children()[0])
			// kids = append(kids, seqNode.Children()[0])
		}
		return kids
	case "ListOf":
		fallthrough
	case "listOf":
		// fmt.Printf("!!!%v\n", node.Children()[0])
		return ListOfElement(node.Children()[0])
	}
	panic(fmt.Sprintf("Expected ListOf node, got %s", name))
}

func AcceptBuiltinHOR[R any](node Node, fn_elem func(Node) R, fn_sep func(Node) R) {
	name := node.CtorName()
	idx := strings.Index(name, "<")
	name = name[:idx]
	switch name {
	case "EmptyListOf":
		fallthrough
	case "emptyListOf":
		return
	case "NonemptyListOf":
		fallthrough
	case "nonemptyListOf":
		first := node.Children()[0]
		fn_elem(first)
		restList := node.Children()[1] // (sep elem)*
		kids := make([]Node, 0, len(restList.Children())+1)
		kids = append(kids, first)
		// fmt.Printf("!%v\n", first)
		// TODO implement using i % 2 != 0
		for i, n := range restList.Children() {
			if i%2 == 0 {
				fn_sep(n)
			} else {
				fn_elem(n)
			}
			// ctor := n.CtorName()
			// if ctor == "_list" {
			// 	panic("????")
			// }
			// if ctor[:1] != "_" {
			// 	_ = i
			// 	// fmt.Printf("* %d %v\n", i, seqNode)
			// 	kids = append(kids, n)
			// }
			// // fmt.Printf("!!%d %d %v\n", i, len(seqNode.Children()), seqNode)
			// // if seqNode.Children() == nil || len(seqNode.Children()) == 0 {
			// // 	continue
			// // }
			// // fmt.Printf("*%v\n", seqNode.Children()[0])
			// // kids = append(kids, seqNode.Children()[0])
		}
		return
	case "ListOf":
		fallthrough
	case "listOf":
		// fmt.Printf("!!!%v\n", node.Children()[0])
		AcceptBuiltinHOR(node.Children()[0], fn_elem, fn_sep)
		return
	}
	panic(fmt.Sprintf("Expected ListOf node, got %s", name))
}

func AssertRule(node Node, rule string) {
	if node.CtorName() != rule {
		s, f := node.Source()
		panic(fmt.Errorf("excepted %s, got %s. %d-%d", rule, node.CtorName(), s, f))
	}
}

func CheckName[T any](v any) {
	if _, skip := v.(SkipCheckName); skip {
		return
	}
	if v == nil {
		return
	}
	typeStr := fmt.Sprintf("%v", reflect.TypeFor[T]())
	dotIdx := strings.Index(typeStr, ".")
	osbIdx := strings.Index(typeStr, "[")
	csbIdx := strings.LastIndex(typeStr, "]")
	var (
		methodName string
	)
	if dotIdx > -1 && osbIdx > -1 && csbIdx > -1 {
		methodName = "Visit" + typeStr[dotIdx+1+len("Visitor"):osbIdx]
	} else {
		panic("unable to extract method name a signature from type. " + typeStr)
	}
	fmt.Fprintf(os.Stderr, "methodName '%s' typeStr '%s'\n", methodName, typeStr)
	if meth, exist := reflect.TypeOf(v).MethodByName(methodName); exist {
		var (
			signature string
			payload   string
			result    string
		)
		signature = typeStr[osbIdx+1 : csbIdx]
		payload, result = getTypeNames(signature)
		rule := methodName[len("Visit"):]
		received := fmt.Sprintf("%v", meth.Type)
		// get the stack trace and add the 4th frame to the error message to help debugging
		_, file, line, _ := runtime.Caller(3)
		see := fmt.Sprintf("%s:%d", file, line)
		panic(fmt.Sprintf(`%[1]s. Found method by name match, but incompatibles types.
  expected func(<visitor>, %[3]s, %[5]s[%[3]s,%[4]s]) %[4]s
  received %[2]s
  For the likely call sight see:
    %[6]s

  Note:
  **For advanced use-cases** with a heterogeneous set of visitor methods a cast of the node can be useful.
  Note that the cast is generally on the parent node in the CST, and a specific Accept<specific-child> method will be called.
  eg from the collect_vast visitor code:
    ((*RuleDefine[any, string])(unsafe.Pointer(node))).AcceptRuleDescr(c, payload)

  **To skip this check**, which is not advised, the visitor can implement the SkipCheckName interface.
  ie implement the method SkipCheckName().
  `, methodName, received, payload, result, rule, see))
	}
}

func TypeCheckMethod[P, R any](v any, type_name string) {
	if _, skip := v.(SkipCheckName); skip {
		return
	}
	if v == nil {
		return
	}
	methodName := "Visit" + type_name
	if meth, exist := reflect.TypeOf(v).MethodByName(methodName); exist {
		// signature = typeStr[osbIdx+1 : csbIdx]
		// payload, result = getTypeNames(signature)
		payload_type := fmt.Sprintf("%v", reflect.TypeFor[P]())
		result_type := fmt.Sprintf("%v", reflect.TypeFor[R]())
		received := fmt.Sprintf("%v", meth.Type)
		// get the stack trace and add the 4th frame to the error message to help debugging
		_, file, line, _ := runtime.Caller(3)
		see := fmt.Sprintf("%s:%d", file, line)
		panic(fmt.Sprintf(`%[1]s. Found method by name match, but incompatibles types.
  expected func(<visitor>, %[5]s[%[3]s,%[4]s], %[3]s) %[4]s
  received %[2]s
  For the likely call sight see:
    %[6]s

  Note:
  **For advanced use-cases** with a heterogeneous set of visitor methods a cast of the node can be useful.
  Note that the cast is generally on the parent node in the CST, and a specific Accept<specific-child> method will be called.
  eg from the collect_vast visitor code:
    ((*RuleDefine[any, string])(unsafe.Pointer(node))).AcceptRuleDescr(c, payload)

  **To skip this check**, which is not advised, the visitor can implement the SkipCheckName interface.
  ie implement the method SkipCheckName().
  `, methodName, received, payload_type, result_type, type_name, see))
	}
}

func AssertName(this Node, name string) {
	if this.CtorName() != name {
		panic(fmt.Errorf(`name didn't name.
expected '%s'
received '%s'
`, name, this.CtorName()))
	}
}

// parse "type, type" into two strings, where type could contain generics ie "name[*,*]"
func getTypeNames(inner string) (string, string) {
	depth := 0
	for i, c := range inner {
		switch c {
		case '[':
			depth++
		case ']':
			depth--
		case ',':
			if depth == 0 {
				return strings.TrimSpace(inner[:i]), strings.TrimSpace(inner[i+1:])
			}
		}
	}
	panic("getTypeNames: could not find comma separator in: " + inner)
}
