const ohm = require("ohm-js");

const grammar = ohm.grammar(`
Lisp {
  Program = Sexp*

  Sexp = "(" Stmt ")"

  Stmt = quasiquote (arg | argList ) -- quasiquote
       | quote (arg | argList)       -- quote
       | def symbol (arg | Sexp)     -- def
       | fn argList (Sexp | Stmt)    -- fn
       | macro argList Sexp          -- macro
       | listOf<(arg | Sexp), " ">   -- list

  def = "def" ~identifierPart
  quasiquote = "quasiquote" ~identifierPart
  quote = "quote" ~identifierPart
  fn = "fn" ~identifierPart
  macro = "macro" ~identifierPart

  identifierPart = arg

  argList = "(" listOf<(arg | argList), " "> ")"
  arg = number | string | symbol
  symbol = (letter | sign | number)+
  string = "\\\"" (~"\\\"" any)* "\\\""
  sign = "_" | "+" | "-" | "/" | "*" | ">" | "<" | ">=" | "<=" | "=" | "!" | "?" | "~"
  number = digit+

  comment = ";" (~eol any)* eol
  eol = "\\n" | "\\r"
  space += comment // extend Ohm built-in space with comment
}
`);

const isArray = Array.isArray;

const eval = (x, env) => (x && x.eval ? x.eval(env) : x);

const macroExpand = (x, env) => {
  if (x instanceof Lambda && x.isMacro) {
    return x.eval(env);
  }

  return x;
};

const unquote = (values, env) => {
  if (!isArray(values)) {
    return values;
  }

  const result = [];

  for (const value of values) {
    if (!isArray(value)) {
      result.push(unquote(value, env));
      continue;
    }

    if (value[0].name === "unquote") {
      result.push(eval(value[1], env));
    } else if (value[0].name === "splice-unquote") {
      result.push(...eval(value[1], env));
    } else {
      result.push(new List(unquote(value, env)));
    }
  }

  return result;
};

class Env {
  constructor() {
    this.env = {};
  }

  bind(name, value) {
    this.env[name] = value;
  }

  get(name) {
    if (!this.env[name]) {
      throw new Error(`${name} not in env`);
    }

    return this.env[name];
  }

  // this could be replaced with parentEnv and "looking up" if something is not found
  duplicate() {
    const dupEnv = new Env();

    Object.entries(this.env).forEach(([key, value]) => {
      dupEnv.bind(key, value);
    });

    return dupEnv;
  }
}

class List {
  constructor(args) {
    this.args = args;
  }

  eval(env) {
    const name = this.args[0];
    let args = this.args.slice(1);

    const fun = env.get(name);

    const isLambda = fun instanceof Lambda;
    const isMacro = isLambda && fun.isMacro;

    if (isMacro) {
      return fun.eval(env, args);
    }

    args = args
      .map((arg) => eval(arg, env))
      .map((arg) => macroExpand(arg, env));

    if (isLambda) {
      return fun.eval(env, args);
    }

    return fun(...args);
  }

  toString() {
    return "(" + this.args.map((arg) => arg.toString()).join(" ") + ")";
  }
}

class Fn {
  constructor(bindNames, body) {
    this.bindNames = bindNames;
    this.body = body;
  }

  eval() {
    return new Lambda(this.bindNames, this.body);
  }

  toString() {
    const argsList = this.bindNames.map((b) => b.toString()).join(" ");
    return `(fn (${argsList}) ${this.body.toString()}))`;
  }
}

class Macro {
  constructor(bindNames, body) {
    this.bindNames = bindNames;
    this.body = body;
  }

  eval() {
    return new Lambda(this.bindNames, this.body, true);
  }

  toString() {
    const argsList = this.bindNames.map((b) => b.toString()).join(" ");
    return `(macro (${argsList}) ${this.body.toString()}))`;
  }
}

class Lambda {
  constructor(bindNames, body, isMacro = false) {
    this.bindNames = bindNames;
    this.body = body;
    this.isMacro = isMacro;
  }

  eval(env, args = []) {
    const localEnv = env.duplicate();

    args.forEach((arg, i) => {
      const bindName = this.bindNames[i].toString();
      const value = this.isMacro ? arg : eval(arg, env);

      localEnv.bind(bindName, value);
    });

    const evaled = this.body.eval(localEnv, args);

    if (!this.isMacro) {
      return evaled;
    }

    const list = new List(evaled);
    const stringified = list.toString();

    return evalLisp(stringified, env);
  }
}

class Def {
  constructor(name, arg) {
    this.name = name;
    this.arg = arg;
  }

  eval(env) {
    const evaled = eval(this.arg, env);
    env.bind(this.name, evaled);
  }

  toString() {
    return `(def ${this.name} ${this.arg})`;
  }
}

class Sym {
  constructor(name) {
    this.name = name;
  }

  eval(env) {
    return env.get(this.name);
  }

  toString() {
    return this.name;
  }
}

class Quote {
  constructor(value) {
    this.value = value;
  }

  eval() {
    return this.value;
  }

  toString() {
    return `(quote ${this.value})`;
  }
}

class Quasiquote {
  constructor(value) {
    this.value = value;
  }

  eval(env) {
    return unquote(this.value, env);
  }

  toString() {
    return `(quasiquote ${this.value})`;
  }
}

// ---

const semantics = grammar.createSemantics();

semantics.addOperation("toAST", {
  Sexp(_1, stmt, _2) {
    return stmt.toAST();
  },

  Stmt_list(args) {
    return new List(args.asIteration().toAST());
  },

  Stmt_fn(_, args, body) {
    return new Fn(args.toAST(), body.toAST());
  },

  Stmt_def(_, name, arg) {
    return new Def(name.sourceString, arg.toAST());
  },

  Stmt_macro(_, args, body) {
    return new Macro(args.toAST(), body.toAST());
  },

  Stmt_quote(_, any) {
    return new Quote(any.toAST());
  },

  Stmt_quasiquote(_, any) {
    return new Quasiquote(any.toAST());
  },

  argList(_1, args, _2) {
    return args.asIteration().toAST();
  },

  symbol(_) {
    return new Sym(this.sourceString);
  },

  number(_) {
    return parseInt(this.sourceString);
  },

  string(_1, text, _3) {
    return text.sourceString;
  },
});

const evalLisp = (str, env) => {
  const match = grammar.match(str);
  let result;

  if (match.failed()) {
    throw new Error(match.message);
  }

  const adapter = semantics(match);
  const ast = adapter.toAST();

  ast.forEach((ast) => {
    result = ast.eval(env);
  });

  return result;
};

const createEnv = () => {
  const env = new Env();

  const multiArgOp = (cb) => (...args) => {
    if (args.length === 1) {
      return args[0];
    }

    return args.slice(1).reduce(cb, args[0]);
  };

  env.bind("str", (...args) => args.map((arg) => arg.toString()).join(" "));
  env.bind("log", (...text) => console.log("lisp>", ...text));

  env.bind(
    "+",
    multiArgOp((a, b) => a + b)
  );
  env.bind(
    "-",
    multiArgOp((a, b) => a - b)
  );
  env.bind(
    "*",
    multiArgOp((a, b) => a * b)
  );
  env.bind(
    "/",
    multiArgOp((a, b) => a / b)
  );

  env.bind("first", (xs) => xs[0]);
  env.bind("second", (xs) => xs[1]);
  env.bind("nth", (idx, xs) => xs[idx]);

  return env;
};

// "tests"

const LISP_BASIC_TEST = `
(def y 5)

(def add-two (fn (n) (+ n (+ 2 1))))

(def x (add-two y))

(log (str y "plus 3 is" x))
`;

const LISP_QUOTES = `
(log (quote symbol-test))

(def l (quote ((+ 1 1) 2 3)))
(log (first l))
(log (second l))
`;

const LISP_QUASIQUOTES = `
(def lst (quote (b c)))

(log (quasiquote (a lst b)))
(log (quasiquote (a (unquote lst) d)))
(log (quasiquote (a (splice-unquote lst) d)))
`;

const LISP_MACROS = `
(def defn
  (macro (name args body)
    (quasiquote
      (def (unquote name) (fn (unquote args) (unquote body))))))

(defn add (a b) (+ a b))

(log (str "(add 1 2) is" (add 1 2)))
`;

[LISP_BASIC_TEST, LISP_QUOTES, LISP_QUASIQUOTES, LISP_MACROS].forEach(
  (code) => {
    console.log(`>>> Running:\n${code}`);

    const env = createEnv();
    evalLisp(code, env);

    console.log();
  }
);
