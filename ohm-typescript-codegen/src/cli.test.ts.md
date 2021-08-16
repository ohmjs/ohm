# Snapshot report for `src/cli.test.ts`

The actual snapshot is saved in `cli.test.ts.snap`.

Generated by [AVA](https://avajs.dev).

## arithmetic grammar

> Snapshot 1

    `// AUTOGENERATED FILE␊
    // This file was generated from arithmetic.ohm by 'generate-ohm-declarations'.␊
    ␊
    import {ActionDict, Grammar, IterationNode, Node, NonterminalNode, Semantics, TerminalNode} from 'ohm-js';␊
    ␊
    declare interface ArithmeticActionDict<T> extends ActionDict {␊
      Exp?(arg0: NonterminalNode): T;␊
      AddExp_plus?(arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode): T;␊
      AddExp_minus?(arg0: NonterminalNode, arg1: TerminalNode, arg2: NonterminalNode): T;␊
      AddExp?(arg0: NonterminalNode): T;␊
      PriExp_paren?(arg0: TerminalNode, arg1: NonterminalNode, arg2: TerminalNode): T;␊
      PriExp?(arg0: NonterminalNode): T;␊
      number?(arg0: IterationNode): T;␊
      alnum?(arg0: NonterminalNode): T;␊
      letter?(arg0: NonterminalNode): T;␊
      digit?(arg0: TerminalNode): T;␊
      hexDigit?(arg0: NonterminalNode | TerminalNode): T;␊
      ListOf?(arg0: NonterminalNode): T;␊
      NonemptyListOf?(arg0: Node, arg1: IterationNode, arg2: IterationNode): T;␊
      EmptyListOf?(): T;␊
      listOf?(arg0: NonterminalNode): T;␊
      nonemptyListOf?(arg0: Node, arg1: IterationNode, arg2: IterationNode): T;␊
      emptyListOf?(): T;␊
      any?(arg0: TerminalNode): T;␊
      end?(arg0: TerminalNode): T;␊
      caseInsensitive?(arg0: TerminalNode): T;␊
      lower?(arg0: TerminalNode): T;␊
      upper?(arg0: TerminalNode): T;␊
      unicodeLtmo?(arg0: TerminalNode): T;␊
      spaces?(arg0: IterationNode): T;␊
      space?(arg0: TerminalNode): T;␊
    }␊
    ␊
    declare interface ArithmeticSemantics extends Semantics {␊
      addOperation<T=any>(name: string, actionDict: ArithmeticActionDict<T>): this;␊
      // TODO: extendOperation, addAttribute, extendAttribute␊
    }␊
    ␊
    declare interface ArithmeticGrammar extends Grammar {␊
      createSemantics(): ArithmeticSemantics;␊
      // TODO: extendSemantics␊
    }␊
    `