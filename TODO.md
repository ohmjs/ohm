# Ohm TODO

## Alpha Release Blockers

### Refactorings

### Documentation

* Write it.

## Things we've already done

* Applying a `Semantics` to a `Failure` should throw an exception.
 
### Unit Tests

* Improve error message when calling makeGrammar() on a source that has multiple grammars defined.
  * Use Grammars and not Grammar as the start rule, and throw an error if != 1 grammar is produced.

### Instantiating grammars from script elements

```
var g = ohm.grammarFromScriptElement(/* optional element */);
var ns = ohm.grammarsFromScriptElements(/* optional element or node list */);
```

When you don't pass in the optional element / node list argument, these methods are sugars for:

`ohm.grammar(document.querySelector(... script tag w/ language = text/ohm-js ...))`

and

`ohm.grammars(document.querySelectorAll(... script tags w/ language = text/ohm-js ...))`

respectively.

### No more "throw mode" for `Grammar.prototype.match`

* Get rid of the 3rd argument to `Grammar.prototype.match`.

* `match`'s return value will be a CST node (for successful matches) or a `Failure` object (for failed matches).

* Both `Node`s and `Failure`s will support an `isFailure()` method. (The former will always return `false`, the latter `true`.)

* `Failures` will hold on to the `State` object so that we can lazily re-parse the input to collect "expected" strings / perps, etc. This should be done if / when the programmer asks for this information.

* Failure objects should only doing the second parse (to generate error info) on demand.

* (We'll need to design the API of `Failure`s. Let's try to think about this while Pat's still in town.)

```
var s = g.createSemantics()...;
var ans = g.match('...');
if (ans.isFailure()) {
  // deal with it
} else {
  s(ans).doIt();
}
```

* The unit tests are a mess right now. They were pretty good early on, but the language has been changed a lot since then. **We should spend a couple of days cleaning up the unit tests.** E.g.,
    * Now that we have CSTs, there's no reason to check acceptance and semantic actions separately for each kind of `PExpr`. We should just compare the result of `Grammar.prototype.match` with the expected CST. (We may have to do some work to get `Node.equals(anotherNode)` to work.)
    * ...

* Check for superfluous properties in action dicts, i.e., properties that do not correspond to a rule in the grammar. This will have to be done in methods like `addOperation`, `addAttribute`, `extendOperation`, and `extendAttribute`.

### Start rules

* When you declare a new grammar that doesn't explicitly inherit from another, the first rule of that grammar is its start rule.

* Once we have start rules, you should be able to omit the 2nd argument to `Grammar.prototype.match`.

### Error conditions for Semantics

`Grammar.prototype.createSemantics(parentSemantics)` creates a new instance of `Semantics` that inherits all of the operations and attributes from `parentSemantics`. **Note that all of the inherited operations and attributes that haven't been `extend`ed explicitly must go through the *arity* and *superfluous method* checks the first time any of the operations or attributes of the "child" `Semantics` is used.**

`Semantics.prototype.extend(name, dict)` should throw an error if:

* (I've thought about this, and decided it wouldn't be very nice to use. So let's not worry about it for now. -- Alex) The operation / attribute was created with the optional second argument `{ exhaustive: true}` and it's not exhaustive, i.e., it doesn't have a case for each type of CST.
* The receiver did not inherit an operation or attribute called `name` from its parent.
* The operation or attribute called `name` has already been `extend`ed in the receiver.

`Semantics.prototype.addOperation(name, dict)`,
`Semantics.prototype.addSynthesizedAttribute(name, dict)`, and
`Semantics.prototype.addInheritedAttribute(name, dict)` should throw an error if:

* The receiver already has an operation or attribute with the same name.
* One or more of `dict`'s methods are *superfluous* (i.e., do not correspond to a rule in the receiver's grammar) or have the wrong arity.
* It should also be an error to try to declare a new operation or attribute whose name is `node` (see below).


### Inheriting from Operations and Attributes

To enable extensibilty, operations and attributes should always belong to an instance of `Semantics`. Here's how this will work:

```
var g1 = ohm.grammar(...);
var s1 = g1.createSemantics()
  .addOperation('eval', {
    AddExp_plus: function(x, _, y) {
      return x.eval() + y.eval();
    },
    ...
  });
```

Note that `Semantics.prototype.addOperation(name, dict)` returns the receiver to allow chaining. (The same goes for `Semantics.prototype.addSynthesizedAttribute` and `Semantics.prototype.addInheritedAttribute`.)

The `Semantics` objects act as a family of operations and attributes. Recursive (even mutually-recursive) uses of operations / attributes go through "wrapper objects" that hold a reference to an instance of `Semantics` as well as a CST node, which may be accessed via the wrapper's `node` property. (This avoids the problems I was having with early-binding in recursive calls, which were getting in the way of extensibility.) Operations are called as methods of the wrapper objects, while synthesized attributes are accessed as properties.

* Here's how you access / use the operations and attributes defined by a `Semantics`:

```
  var s = g.createSemantics()...;
  var cst = g.match(...);
  // Now we "wrap" the CST and access the functionality that's defined in the Semantics obj.
  s(cst).value;  // attribute
  s(cst).doIt();  // operation
  ...
```

To extend an operation or an attribute, you create a new `Semantics` object that  extends the `Semantics` the the operation or attribute in question belongs to. You do this by passing the `Semantics` that you want to extend as an argument to *your grammar*'s `createSemantics` method. Then you call `extend(operationOrAttributeName, dict)` on that. E.g.,

```
var g2 = ... // some grammar that extends g1
var s2 = g2.createSemantics(s1)
  .extend("eval", {
    AddExp_foo: function(x, _, y) { ... }
  });
```

A *derived* `Semantics` instance -- i.e., one that is created by passing an existing `Semantics` to `Grammar.prototype.createSemantics()` -- automatically inherits all of the operations and attributes from the parent `Semantics`.

### Parameterized rules

E.g.,

```
G {
  ListOf<elem, sep>
    = elem (sep elem)*  -- some
    |                   -- none

  PriExp
    = ...
    | ListOf<Exp, ','>
}
```

Notes:

* Using `<>`s instead of `()`s so that we don't have to make whitespace significant, e.g., in OMeta, `foo(bar)` was a rule application and `foo (bar)` was just a `foo` followed by a `bar` -- this was very confusing to some people.
* The things inside the `<>`s -- i.e., the arguments passed to parameterized rules -- are unevaluated parsing expressions. The arity of a parameter expression must be equal to 1. They are evaluated when they're used inside the parameterized rule. So in some sense the lexical scope of the body of a parameterized rule is different than that of a non-parametrized rule in the same grammar. We could implement this by
    * using a specialized version of the grammar where the argument names correspond to rule that when called will evaluate those parsing expressions, or 
    * keeping track of the names of the arguments so that we can do something special about them in code generation.
* You have to write semantic actions / attribute definitions for parameterized rules, just like any other rules.

### "Namespaces"

Maybe now the stuff that's done in `src/bootstrap.js` can be done for any grammar? That would enable people to share grammar as "binaries". (A while ago I had an `ohm` command, but I removed it b/c it didn't support inheritance properly. That command turned into the less general but essential `src/bootstrap.js`.)



## Things that should be included in future releases

### Operations and Semantics

#### Operations with arguments

* We should be able to (optionally) specify the number of arguments that are required by an operation.
* We'll have to take these into account when doing the arity checks.	

#### Inherited attributes

* Add support for inherited attributes.
* A couple of changes: (i) get rid of the `$idx` syntax and use arrays instead, and (ii) get rid of the attribute's `set` method, just use return values instead. E.g.,

```
var s = g.createSemantics().addInheritedAttribute('foo', {
  _base: function(child) { ... },
  AddExpr_plus: [
    function(x) {
      return this.childAfter(x).foo() + 1;
    },
    ohm.actions.notSupported,  // this is for the + or - operator
    function(y) {
      return 123;
    }
  ],
  _nonterminal: function(child) { ... }
});

// Client-side:
var node = g.match(...);
s(node).foo();
```

### Other stuff

* A refactoring that makes `parent` a synthesized attribute (right now it's just a semantic action that side-effects the CST nodes)

* Pat's visualizer / omniscient debugger
* An IDE for Ohm
    * Integrate Pat's visualizer
    * Built-in support for unit testing grammars (re-run unit tests while programmer changes the grammar, show coverage, etc.)
    * Automatic generation of random valid inputs
* Better support for attribute grammars
    * Take another pass at the API for writing inherited attributes
    * Akira's editor?
* Using persistent data structures (ImmutableJS?) for parsing contexts, so that adding that extra key to the memo table won't be so expensive.
* Incremental parsing ala [Papa Carlo](http://lakhin.com/projects/papa-carlo/)?

### Better error messages

Implement Alex's de-spockification idea.

#### Unit tests

In the following unit tests, I've added suffixes to each rule application so that each one can be written unambiguously in the "stacks". This matters b/c we want to know what the "continuation" of a recorded failure would have been -- which means that we must know which application of a rule `r` caused the failure, if there is more than one.

##### Unit test #1

```
start = addExp#1
addExp = addExp#2 "+" mulExp#1 | mulExp#2
mulExp = mulExp#3 "*" priExp#1 | priExp#2
priExp = number
```

If the input is `"1-"`, the failed primitives recorded at position `1` should be:

* `"*"`, with stack `start > addExp#1 > mulExp#2`
* `"+"`, with stack `start > addExp#1`

The expected set should be {`"*"`, `"+"`}.

For more info, memo @ `0`:

* `start` -> FAIL, w/ failures@`1`:
    * `"+"`, `addExp#1`
    * `"*"`, `addExp#1 > mulExp#2`
* `addExp` -> SUCCESS@`1` w/ failures@`1`:
    * `"+"`, (empty stack)
    * `"*"`, `mulExp#2`
* `mulExp` -> SUCCESS@`1` w/ failures@`1`:
    * `"*"`, (empty stack)

|::|::|::|
| **subsumes**  | (`"+"`, `start > addExp#1`) | (`"*"`, `start > addExp#1 > mulExp#2`) |
| `+` | N | N |
| `*` | N  | N |
| `+` or `*` | N  | N |

##### Unit test #2

```
start = addExp#1 ";"
addExp = addExp#2 "+" mulExp#1 | mulExp#2
mulExp = mulExp#3 "*" priExp#1 | priExp#2
priExp = number
```

If the input is `"1"`, the failed primitives recorded at position `1` should be:

* `"*"`, with stack `start > addExp#1 > mulExp#2`
* `"+"`, with stack `start > addExp#1`
* `";"`, with stack `start`

The expected set should be {`";"`}.

|::|::|::|::|
| **subsumes**  | (`";"`, `start`) | (`"+"`, `start > addExp#1`) | (`"*"`, `start > addExp#1 > mulExp#2`) |
| `;` | N | Y | Y |
| `+` | N  | N | N |
| `*` | N  | N | N |
| `;`, `+` or `*` | N  | Y | Y |

##### Unit test #3

```
start = a#1 b#1 | b#2 a#2
a = "a"
b = "b"
```

If the input is `""`, the failed primitives recorded at position `0` should be:

* `"a"`, with stack `start > a#1`
* `"b"`, with stack `start > b#2`

The expected set should be {`"a"`, `"b"`}.

##### Unit test #4

```
start = a#1 b#1 | a#2 | b#2 a#3
a = "a"
b = "b"
```

If the input is `""`, the failed primitives recorded at position `0` should be:

* `"a"`, with stacks `start > a#1` and `start > #a2`
* `"b"`, with stack `start > #b2`

The expected set should be {`"a"`, `"b"`}.

**TODO:** I added this example because it's important to consider the case when a terminal can be reached in different ways (i.e., w/ different stacks). Unfortunately in this case that doesn't make a difference. I'd like to find an example where it does.

Straw man: when a terminal has more than one stack in a `FailureDescriptor`, we should only exclude it from the expected set if there is one or more entry (terminal) that subsumes it, i.e., considering all of its stacks / continuations. To say it in a different way: the subsuming terminal must be on the path to acceptance considering all of the stacks.

##### Unit test #5

```
Start = c#1 "sucks" | c#2 "stinks"
c = "C" "++"?
```

If the input is `"C rules"`, the recorded failed primitives at position `2` should be:

* `"++"`, with stack `start > c#1`
* `"sucks"`, with stack `start`
* `"stinks"`, with stack `start`

The expected set should be {`"sucks"`, `"stinks"`}.
The interesting thing in this example is that neither `"sucks"` nor `"stinks"`  "subsumes" `"++"`, but `"++"` shouldn't be included in the expected set. This is because even if it shows up in the input, we will still (eventually) need one of the other expected strings in order to get to an accepting state, which means that `"++"` is superfluous.

