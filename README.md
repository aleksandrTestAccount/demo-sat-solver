# Proto Equation Language & 3-SAT Solver

**Live Playground:** [aleksandrtestaccount.github.io/demo-sat-solver](https://aleksandrtestaccount.github.io/demo-sat-solver)

A declarative constraint language and compiler that translates arithmetic, bitwise, and logical equations into **3-CNF-SAT** boolean formulas (at most 3 literals per clause) via bit-blasting. Equations can be solved directly in the browser or from the command line using the bundled **MiniSat (WebAssembly)** solver, a built-in pure JavaScript solver, or external **DIMACS CNF** solvers (`z3`, `cadical`, `cryptominisat`).

> **Note:** This project was created for educational purposes as a playground for exploring SAT/SMT solving and NP-complete problems.

## How It Works

1. **Bit-Blasting:** Rational numbers are represented as fixed-width two's complement boolean vectors configured globally via `size <int> <frac>` (or `size + <int> <frac>` for non-negative numbers).
2. **3-CNF Compilation:** Expressions are decomposed into elementary operations, simplified through variable linking and CNF reductions (unit propagation, pair reduction, pure literal elimination), and compiled into ≤3-literal clauses.
3. **Solving:** The resulting 3-CNF formula is solved using **MiniSat (WASM)** by default, the built-in backtracking JS solver, or exported via **DIMACS CNF** to external SAT/SMT solvers.

## Quick Example

```eproto
// Integer factorization compiled to 3-CNF-SAT
a * b = 247
a > 1
b > 1

// 8-bit integer, 0-bit fraction (+1 sign bit)
size 8 0
```

More examples (modular arithmetic, number theory, Karp's NP-complete problems, fixed-point approximations) are available in [`docs/examples.md`](docs/examples.md).

## Web Playground

Run the interactive editor and documentation locally:

```bash
npm install
npm run dev
```

In the editor toolbar, you can switch between **MiniSat (WASM)** and **Built-in JS**, or click **To DIMACS** to export the compiled DIMACS CNF formula, run it in any local or online SAT solver, and paste the output back to decode the solution.

## Node.js CLI

Run `.eproto` files directly from the terminal without a browser:

```bash
# Solve using the bundled MiniSat WASM solver (default, no extra dependencies)
node cli/index.js examples/root.eproto

# Or via npm script
npm run cli examples/root.eproto

# Solve using the built-in pure JS 3-SAT solver (slow)
node cli/index.js examples/example.eproto --solver builtin
```

### Using External DIMACS Solvers

If you have external SAT/SMT solvers installed in your `PATH`, pass `--solver <name>` (`z3`, `cadical`, or `cryptominisat`):

```bash
# Install external solvers on Debian/Ubuntu (optional)
sudo apt update && sudo apt install -y z3 cadical cryptominisat

# Solve via external DIMACS backends
node cli/index.js examples/root.eproto --solver z3
node cli/index.js examples/root.eproto --solver cadical
node cli/index.js examples/root.eproto --solver cryptominisat
```

## Documentation

* **[Language Specification](docs/language-spec.md)** — data types, operators, bit access, optimization rules, and configuration directives.
* **[Examples](docs/examples.md)** — collection of constraint problems and algorithms.
