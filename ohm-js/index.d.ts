export = ohm;

declare namespace ohm {

  /**
   * Instantiate the Grammar defined by source. If specified, namespace is
   * the Namespace to use when resolving external references in the grammar.
   */
  function grammar(source: string, namespace?: Namespace): Grammar;

  /**
   * Create a Grammar instance from the contents of a <script> tag.
   * node, if specified, is a script tag with the attribute
   * type="text/ohm-js". If it is not specified, the result of
   * document.querySelector(script[type="text/ohm-js"]) will be used instead.
   * If specified, namespace is
   * the Namespace to use when resolving external references in the grammar.
   */
  function grammarFromScriptElement(node?: Node, namespace?: Namespace): Grammar;

  /**
   * Create a new Namespace containing Grammar instances for all of the
   * grammars defined in source.
   * If namespace is specified, it will be the prototype of the new
   * Namespace.
   */
  function grammars(source: string, namespace?: Namespace): Namespace;

  /**
   * Create a new Namespace containing Grammar instances for all of the
   * grammars defined in the <script> tags in nodeList. If nodeList is
   * not specified, the result of
   * document.querySelectorAll('script[type="text/ohm-js"]') will be used.
   * If namespace is specified, it will be the prototype of the new
   * Namespace.
   */
  function grammarFromScriptElements(
    nodeList?: NodeList,
    namespace?: Namespace): Namespace;

  /**
   * Create a new namespace. If props is specified, all of its properties
   * will be copied to the new namespace.
   */
  function namespace(props?: Object): Namespace;

  /**
   * Create a new namespace which inherits from namespace. If props is
   * specified, all of its properties will be copied to the new namespace.
   */
  function extendNamespace(namespace: Namespace, props?: Object): Namespace;

  /**
   * A Namespace is a dictionary of Grammars
   */
  interface Namespace {
    [index: string]: Grammar;
  }

  /**
   * An Ohm Grammar.
   */
  interface Grammar {
    /**
     * Try to match input with this grammar, returning a MatchResult. If
     * startRule is given, it specifies the rule on which to start
     * matching. By default, the start rule is inherited from the
     * supergrammar, or if there is no supergrammar specified, it is the
     * first rule in this grammar.
     */
    match(input: string, startRule?: string): MatchResult;

    /**
     * Create a new Matcher object which supports incrementally matching
     * this grammar against a changing input string.
     */
    matcher(): Matcher;

    /**
     * Like match() except returns a trace object whose toString() returns
     * a summary of each parsing step useful for debugging.
     */
    trace(input: string, startRule?: string): Object;

    /**
     * Create a new Semantics object for this Grammar.
     */
    createSemantics(): Semantics;

    /**
     * Create a new Semantics object for this Grammar that inherits all
     * of the operations and attributes in superSemantics.
     * This Grammar must be a descendant of the grammar associated with
     * superSemantics.
     */
    extendSemantics(superSemantics: Semantics): Semantics;
  }

  /**
   * Matcher objects are used to incrementally match a changing input
   * against a Grammar, e.g. in an editor or IDE.
   */
  interface Matcher {
    /**
     * Return the current input string.
     */
    getInput(): string;

    /**
     * Set the input string to `str`.
     */
    setInput(str: string): void;

    /**
     * Edit the current input string, replacing the characters between
     * `startIdx` and `endIdx` with `str`.
     */
    replaceInputRange(startIdx: number, endIdx: number, str: string): Matcher;


    /**
     * Like Grammar#match, but operates incrementally.
     */
    match(optStartRule?: string): MatchResult;


    /**
     * Like Grammar#trace, but operates incrementally.
     */
    trace(optStartRule?: string): Object;
  }

  /**
   * Result of Grammar#match
   */
  interface MatchResult {
    /**
     * True iff match succeeded
     */
    succeeded(): boolean;

    /**
     * True iff match did not succeed
     */
    failed(): boolean;

    /**
     * If match failed contains an error message indicating where and
     * why the match failed. This message is suitable for end users of a
     * language (i.e., people who do not have access to the grammar source).
     */
    message?: string;

    /**
     * If match failed contains an abbreviated version of this.message that
     * does not include an excerpt from the invalid input.
     */
    shortMessage?: string;
  }

  /**
   * A Semantics is a family of operations and/or attributes for a given
   * grammar. Each operation/attribute has a unique name within the
   * Semantics. A grammar may have any number of Semantics instances
   * associated with it -- this means that the clients of a grammar
   * (even in the same program) never have to worry about
   * operation/attribute name clashes.
   */
  interface Semantics {
    /**
     * Returns a dictionary containing operations and attributes defined by
     * this Semantics on the result of a matched grammar. Operations are
     * no-arg functions and attributes are properties.
     */
    (match: MatchResult): Dict;

    /**
     * Add a new operation named name to this Semantics, using the
     * semantic actions contained in actionDict. It is an error if there
     * is already an operation or attribute called name in this semantics.
     * Returns this Semantics.
     */
    addOperation(name: string, actionDict: ActionDict): Semantics;

    /**
     * Add a new attribute named name to this Semantics, using the
     * semantic actions contained in actionDict. It is an error if there
     * is already an operation or attribute called name in this semantics.
     * Returns this Semantics.
     */
    addAttribute(name: string, actionDict: ActionDict): Semantics;

    /**
     * Extend the operation named name with the semantic actions contained
     * in actionDict. name must be the name of an operation in the super
     * semantics.
     * Returns this Semantics.
     */
    extendOperation(name: string, actionDict: ActionDict): Semantics;

    /**
     * Extend the attribute named name with the semantic actions contained
     * in actionDict. name must be the name of an attribute in the super
     * semantics.
     * Returns this Semantics.
     */
    extendAttribute(name: string, actionDict: ActionDict): Semantics;
  }

  /**
   * A dictionary is indexed by strings.
   */
  interface Dict {
    [index: string]: any;
  }

  /**
   * An ActionDict is a dictionary of Actions indexed by rule names.
   */
  interface ActionDict {
    [index: string]: Action;
  }

  /**
   * An Action is a function from ParseNodes, called with the children nodes
   * of the node it is being executed on.
   * The current node is passed as a dynamic this, requiring an ES5
   * anonymous function with this typed as any.
   */
  type Action = (...args: Node[]) => any;

  /**
   * A node in the parse tree, passed to Action functions.
   */
  interface Node {
    /**
     * Returns the child at index idx.
     */
    child(idx: number): Node;

    /**
     * true if the node is a terminal node, otherwise false.
     */
    isTerminal(): boolean;

    /**
     * true if the node is an iteration node, which corresponds to a
     * +, *, or ? expression in the grammar.
     */
    isIteration(): boolean;

    /**
     * An array containing the node's children.
     */
    children: Node[];

    /**
     * The name of grammar rule that created the node.
     */
    ctorName: string;

    /**
     * Captures the portion of the input that was consumed by the node.
     */
    source: Interval;

    /**
     * Returns the contents of the input stream consumed by this node.
    */
    sourceString: string;

    /**
     * The number of child nodes that the node has.
     */
    numChildren: number;

    /**
     * True if Node is ? option
     */
    isOptional: boolean;

    /**
     * For a terminal node, the raw value that was consumed from the
     * input stream.
     */
    primitiveValue: string;

    /**
     * In addition to the properties defined above, within a given
     * semantics, every node also has a method/property corresponding to
     * each operation/attribute in the semantics.
     * For example, in a semantics that has an operation named 'prettyPrint'
     * and an attribute named 'freeVars', every node has a prettyPrint()
     * method and a freeVars property.
     * NOTE this means the above node properties can not be used as
     * operation/attribute names.
     */
    [index: string]: any;
  }

  /**
   * Interval in input string
   */
  interface Interval {

    /**
     * Input stream of parse
     */
    inputStream: any;

    /**
     * Starting index in input
     */
    startIdx: number;
    /**
     * Ending index in input
     */
    endIdx: number;
    /**
     * Contents of interval
     */
    contents: string;

    /**
     * Returns a new Interval at the start of this one
     */
    collapsedLeft(): Interval;

    /**
     * Returns a new Interval at the end of this one
     */
    collapsedRight(): Interval;

    /**
     * Returns a new Interval which contains the same contents as this one,
     * but with whitespace trimmed from both ends.
     */
    trimmed(): Interval;

    /**
     * Returns a new Interval that covers this Interval and all the
     * argument Intervals. The new Interval will start at the lowest start
     * index and end at the largest end index.
     */
    coverageWith(...intervals: Interval[]): Interval;

    /**
     * Return a nicely-formatted string describing the start of the Interval
     */
    getLineAndColumnMessage(): string;
  }
}
