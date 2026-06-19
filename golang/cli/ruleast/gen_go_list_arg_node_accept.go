package ruleast

import "fmt"

func (n NodeArgNode) GenGoListArgNodeAccept(vc *genAcceptsCmd, gmr_name string, name string) {
	vc.outf(`	{
		if v, ok := visitor.(goohm.BuiltinVisitor); ok {
			v.BuiltInRule(n)
		}
	}
`,
	)
}
func (n RuleArgNode) GenGoListArgNodeAccept(vc *genAcceptsCmd, gmr_name string, name string) {
	gmr, ok := vc.gmrsAst.Grammars[gmr_name]
	if !ok {
		panic(fmt.Errorf("unknown grammar %[1]s", gmr_name))
	}
	rule, ok := gmr.Rules[name]
	if !ok {
		vc.outf(`		// "unknown rule %[1]s"
		if v, ok := visitor.(goohm.BuiltinVisitor); ok {
			v.BuiltInRule(n)
		}
`,
			name,
		)
		return
	}
	Handle_RuleNode[any](
		rule,
		func(bare_rule BareRuleNode) any {
			vc.outf(`		kids := n.Children()
			result, err = (&%[1]s[P, R]{
	`,
				bare_rule.TypeName(),
			)
			bare_rule.GenGoLeafInstAccepts(vc, 3)
			vc.outf(`		}).Accept(n, visitor, payload)
	`,
			// upper1st(name),
			)
			return nil
		},
		func(virt_rule VirtRuleNode) any {
			panic("shouldn't get here")
		},
		func(case_rule CasesRuleNode) any {
			vc.outf(`		result, err = (&%[1]s[P, R]{
				Node: n,
					}).Accept(n, visitor, payload)
	`,
				upper1st(case_rule.Name),
			)
			return nil
		},
		nil,
	)
}
func (n TermArgNode) GenGoListArgNodeAccept(vc *genAcceptsCmd, gmr_name string, name string) {
	vc.outf(`	if v, ok := visitor.(goohm.TerminalVisitor); ok {
		v.Terminal(n)
	}
`,
	)
}
func (n ListArgNode) GenGoListArgNodeAccept(vc *genAcceptsCmd, gmr_name string, name string) {
	panic("should not be possible. Would mean a**, a*+ would be valid") // try (a*)*
}
func (n OptArgNode) GenGoListArgNodeAccept(vc *genAcceptsCmd, gmr_name string, name string) {
	panic("should not be possible. Would mean a?* or a?+ would be valid") // try (a?)*
}
func (n BuiltinHorArgNode) GenGoListArgNodeAccept(vc *genAcceptsCmd, gmr_name string, name string) {
	vc.outf(`	panic("not implemented - why would you do this?")
`,
	)
}
