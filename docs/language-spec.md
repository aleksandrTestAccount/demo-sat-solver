# Proto Equation Language & Solver Documentation

> **Note:** This project was created exclusively for educational purposes. 

Proto Equation Language is a declarative constraint language and built-in solver that compiles arithmetic, bitwise, and logical equations into 3-CNF-SAT boolean formulas (at most 3 literals per clause).

[more examples here - examples.md](./examples.md)

[benchmarks.md](./benchmarks.md)

## Table of Contents

- [Getting Started & Simple Examples](#getting-started--simple-examples)
- [How It Works](#how-it-works)
  - [More Simple Examples](#more-simple-examples)
- [Data Types](#data-types)
  - [Boolean Type](#boolean-type)
  - [Rational Number Type](#rational-number-type)
  - [Rational Number Representation](#rational-number-representation)
- [Links](#links)
- [Binary Operators](#binary-operators)
  - [Division](#division)
  - [Remainder and Division with Remainder](#remainder-and-division-with-remainder)
  - [Multiplication](#multiplication)
  - [Multiplication by Boolean Value](#multiplication-by-boolean-value)
  - [Comparison](#comparison)
  - [Equal, Unequal](#equal-unequal)
  - [Logical Imply and Boolean Condition](#logical-imply-and-boolean-condition)
  - [Power-of-Two Modular Operations](#power-of-two-modular-operations)
  - [Exponentiation](#exponentiation)
- [Unary Operators](#unary-operators)
- [Types of Lines](#types-of-lines)
  - [Condition Type Line](#condition-type-line)
  - [Equation Lines](#equation-lines)
  - [Config: `inputVarsPositive`](#config-inputvarspositive)
  - [Value from Set (`?=`)](#value-from-set-)
  - [Assignment of Possible Values](#assignment-of-possible-values)
  - [Boolean Values Adder](#boolean-values-adder)
  - [Number as a Structure](#number-as-a-structure)
  - [3CNF-SAT Format and Clauses Block](#3cnf-sat-format-and-clauses-block)
  - [Binary Search (`binarySearch`)](#binary-search-binarysearch)
- [Working with Irrational Numbers](#working-with-irrational-numbers)
- [SAT Optimization](#sat-optimization)
  - [Pairs Reduction](#pairs-reduction)
  - [Pure Variable Check](#pure-variable-check)
  - [Optimizer Limitations](#optimizer-limitations)
- [SAT Solver](#sat-solver)
  - [Config: `solve false`](#config-solve-false)
- [Number of Clauses for Basic Operations](#number-of-clauses-for-basic-operations)
- [Multiplication Optimization](#multiplication-optimization)
  - [Approximate Value](#approximate-value)
  - [Setting an Upper Bound](#setting-an-upper-bound)
  - [Squaring vs. Multiplication](#squaring-vs-multiplication)
  - [Karatsuba Algorithm](#karatsuba-algorithm)
  - [Multiplication by a Known Value](#multiplication-by-a-known-value)
- [Resize](#resize)
- [Development Notes](#development-notes)
- [Advanced Examples](#advanced-examples)
  - [Number Theory Algorithms](#number-theory-algorithms)
  - [Various Examples](#various-examples)
  - [Karp's NP-Complete Problems](#karps-np-complete-problems)

---

## Getting Started & Simple Examples

You must specify the number of bits allocated for each number:
* **Integer only:** For an 8-bit number, use `size 8 0`.
* **With fractions:** Specify both integer and fractional bits. For example, 5 integer bits and 1 fractional bit: `size 5 1; x + x = 7;`.
* **Overflow handling:** If you encounter an `"Invalid number"` error, increase the number of bits (e.g., `size 11 0; x + x = 1024.`).
* **Non-negative constraint:** Adding a `+` to `size` ensures that all calculated values are non-negative: `size + 8 0`.

### Simple Examples

```text
// Fibonacci sequence
v10 < 64

v9 + v8 = v10
v8 + v7 = v9
v7 + v6 = v8
v6 + v5 = v7
v5 + v4 = v6
v4 + v3 = v5
v3 + v2 = v4
v2 + v1 = v3

v1 < v2

size + 7 0
```

```text
// Pythagorean triple
a*a + b*b = c*c

a > 0
b > 0
c > 0

c < 8

size + 5 0
```

```text
// Chinese remainder theorem
x % 3 = 2
x % 5 = 3
x % 7 = 2

x < 3 * 5 * 7

size + 8 0
```

```text
// Find divisors
a * b = 247

a > 1
b > 1

size + 8 0
```

```text
// 9 coins (values 5 and 2) with a total sum of 24
v5 + v2 = 9
5 * v5 + 2 * v2 = 24

size + 8 0
```

---

## How It Works

This language is a declarative language (working name: **Equation Language**) developed for generating boolean formulas expressed in **3CNF-SAT** format. In many cases, these systems of equations are similar to standard SMT problems (Quantifier-Free Bit-Vectors).

Every line is an equation (except config lines and a few specific constructs):

```text
// Single line examples:
a + b = r        // ok
(x + y) * q = p  // ok
a1 && b1 == r1   // ok, XNOR is "==" ("equality" operator for boolean type)
a2 + b2          // error, no "="
a3 * b3 == r     // error, "==" is for boolean type, "=" is for rational number
a4               // ok, a4 --> a4 == true
a5 > b5 == false // ok
a6 > b6 == true  // ok
a7 > b7          // ok, a7 > b7 --> a7 > b7 == true
a8 = b8 == r8    // ok
a9 == b9 == r9   // ok
```

### Internal Transformation Pipeline

1. **Simple Equations:** Every line converts to a simple equation structure consisting of four elements: `[operand1, operator, operand2, result]`. Operands and results can be either a Rational Number or a Boolean. Additional temporary variables may be created for nested expressions.
   *(Note: This approach is not optimal and will be refactored, as it generates too many extra variables, especially for logical and bitwise operation chains).*

```text
a + b = r            // [ [a, +, b, r] ]
r = a + b            // [ [a, +, b, r] ]
a > b == r2          // [ [a, >, b, r2] ] (r2 is boolean)
b1 || b2 == b3       // [ [b1, ||, b2, b3] ]

a + b * c = r3       // [ [b, *, c, t1], [a, +, t1, r3] ]
a > b && b4 == true  // [ [a, >, b, t2], [t2, &&, b4, true] ]

r4 = a / 2 + ( b ^ ~a) /* [
    [ 0, ~, a, t3],  // "~" is a unary operation, operand1 is omitted
    [ b, ^, t3, t4],
    [ a, /, 2, t5],
    [ t5, +, t4, r4]
] */
```

2. **Reduction & Links:** Equations may be optimized or reduced by creating variable links.
3. **3CNF-SAT Conversion:** Each simple equation is transformed into Conjunctive Normal Form (CNF) with clauses limited to at most three literals.
4. **Solving:** The resulting CNF formula is optimized and solved using 3CNF-SAT algorithms.

### More Simple Examples

```text
// Find positive integer divisors greater than one
// Two results possible: {a:13, b:19} or {a:19, b:13}
a * b = 247
a > 1
b > 1

// 8 bits integer part, 0 bits fractional part, 1 bit sign
size 8 0 // numbers in interval [-256, 255]

format "a = ${a}, b = ${b}"
```

```text
// In this case only one result is possible: {a:13, b:19}
a * b = 247
a > 1
b > 1

// It's better to use a power of two for upper bounds
a < 16
b < 32

size 8 0

format "a = ${a}, b = ${b}"
```

```text
// Equation sides can be interchanged and lines can be in any order
1 < a
size 8 0
a <= b
247 = a * b
b > 1
```

```text
// Bit Settings
// Usually, setting bits improves performance and reduces memory consumption.
// The least significant bit (LSB) is bit 0 (e.g., x:0).
// The most significant bit (MSB) represents the sign bit.

a * b = 247
a != 1

// Since 247 = 3 (mod 4), the following constraints can be applied:
a:0 == true  // a is odd; LSB is 1
a:1 == false // a = 1 (mod 4); bit 1 is 0

b:0 == true  // b is odd; LSB is 1
b:1 == true  // b = 3 (mod 4); bit 1 is 1

a:8 == false // a is positive
b:8 == false // b is positive

size 8 0
```

```text
// No result: small bit size, with 7 bits all numbers are less than 128
a * b = 247
a > 1
b > 1
size 7 0
```

```text
// No result (false): 97 is a prime number
a * b = 97
a > 1
b > 1
size 8 0
```

---

## Data Types

The language supports only two data types: **Boolean** and **Rational Number**. Data types are inferred from operators:
* Variables in arithmetic equations (e.g., `a + b = r`) represent **rational numbers**.
* Variables in boolean equations (e.g., `x1 || x2 == x3`) represent **boolean values**.

### Boolean Type

Standard logical values `true` and `false`.

```text
// a, b, c - boolean type vars
a == true
b == false
1 > 2 == c
size 4 0
// result: {a: true, b: false, c: false}
```

```text
c == true
1 > 2 == c
size 4 0
// result: false
```

### Rational Number Type

A rational number is stored in **two's complement representation** as a fixed-size vector of boolean values, separated into integer, fractional, and sign bits.

For example, when defining `size 4 3`:
* **4 bits** are assigned to the integer part.
* **3 bits** are assigned to the fractional part.
* **1 bit** is reserved for the sign.
* Total: every rational number consumes exactly **8 bits**.

**Important Rules:**
* **Overflow & Rounding:** If an integer value exceeds the allocated integer bits, an overflow error occurs. Fractional values exceeding the designated fractional bits are rounded accordingly.
* **Direct Bit Access:** Individual bits can be accessed and manipulated like any boolean using `varName:bitIndex`:
  * Set the 4th bit (index 3) of `v`: `v:3 == true`
  * Access the sign bit: `v:s == false` or `v:-1 == false` (or via its last index, e.g., `v:7` for an 8-bit number). Checking the sign bit prevents overflow conditions in addition and subtraction.
* **Unary Negation:** Unary minus (`-x`) is omitted because it requires bitwise negation plus addition (not a free operation). Use binary subtraction from zero instead: `0 - varName = negVarName`.

### Rational Number Representation

Numbers can be written in four bases:
* **Binary (`0b`):** `0b101.1` equals decimal `5.5` *(Recommended for numbers with fractional parts to minimize approximation errors)*
* **Hexadecimal (`0x`):** `0xB.A` equals decimal `11.625`
* **Octal (`0o`):** `0o13.3` equals decimal `11.375`
* **Decimal (`0d`):** `0d12.34` equals decimal `12.34`

> **Note:** Leading zeros at the beginning of numbers raise an error to avoid ambiguity across different programming languages.

```text
001 = x    // error
0b001 = x  // ok
05 = x     // error
0d05 = x   // ok
```

---

## Links

When expressions like `a = b == true` occur, variable `a` becomes linked to variable `b`, replacing all occurrences of `a` with `b` within the list of equations:

```text
x1 + a = x2
a = b == true
x3 * b = x4
```

Transformed into:

```text
x1 + b = x2
x3 * b = x4
```

Bit shift operators are **free** because they simply establish links between corresponding bits. For example, `a << 2 = r` sets up the links `r:2 == a:0`, `r:3 == a:1`, etc. No new variables or equations are created—only references between existing bits are established.

---

## Binary Operators

> **Important:** Standard division and multiplication are performed only with **positive numbers**.

### Variable & Clause Overhead Example

Consider `size 15 0`, where every number uses 16 bits (16 boolean variables). For `a`, `b`, and `r`, there are 48 variables in total. Arithmetic operations introduce additional variables—for example, addition introduces carry and intermediate result variables (`15 * 2 = 30` extra variables). Each bit in addition generates 10 clauses, except the first bit and the sign bit, which produce fewer.

Approximate formulas for addition:
* **Additional variables:** `2 * bitSize - 2`
* **Clauses:** `10 * bitSize - 6`

### Binary Operators Overview (`size 15 0`, 16 bits)

#### Arithmetic Operations

| Operator | Name | Example | Metrics & Notes |
| :--- | :--- | :--- | :--- |
| `+` | Addition | `a + b = r` | `30` add. vars, `78` total vars, `154` clauses (~10 clauses/bit) |
| `-` | Subtraction | `a - b = r` | `30` add. vars, `78` total vars, `154` clauses |
| `*` | Multiplication | `a * b = r` | `278` add. vars, `326` total vars, `1188` clauses |
| `/` | Division | `a / b = r` | `427` total vars, `1476` clauses (integer division if no fractional part) |
| `/%` | Division with remainder | `a /% b = (r1, r2)` | Construct (not an operator); `427` total vars, `1476` clauses; returns a pair |
| `%` | Remainder | `a % b = r` | `427` total vars, `1476` clauses |
| `!*` | Negative multiplication | `a !* b = r` | `466` total vars, `1642` clauses |
| `?*` | Multiplication by boolean | `a ?* b = r` | `operand2` must be boolean; transforms into `b ? a : 0 = r` |
| `**2` | Square | `a ** 2 = r` | `operand2` must be `2` |

#### Bitwise Operations

| Operator | Name | Example | Metrics & Notes |
| :--- | :--- | :--- | :--- |
| `&` | Bitwise AND | `a & b = r` | `0` add. vars, `48` total vars, `48` clauses |
| `^` | Bitwise XOR | `a ^ b = r` | `0` add. vars, `48` total vars, `64` clauses |
| `\|` | Bitwise OR | `a \| b = r` | `0` add. vars, `48` total vars, `48` clauses |

#### Shift Operations

| Operator | Name | Example | Metrics & Notes |
| :--- | :--- | :--- | :--- |
| `<<` | Left shift | `a << 4 = r` | No overflow (multiplication by power of 2); free (links only); `operand2` must be known positive int |
| `>>` | Right shift | `a >> 1 = r` | Free (links only); `operand2` must be known positive int |
| `>>>` | Unsigned right shift | `a >>> 2 = r` | Left bits in result are `false`; free (links only); `operand2` must be known positive int |
| `<<*`, `*>>` | Open shift | `a <<* 2 = r`<br>`b *>> 1 = c` | New bits are unconstrained (`true` or `false`); overflow possible in left shift |
| `<<` | Unknown left shift | `a << x = r` | Expensive operation (`operand2` is a variable) |

#### Comparison Operations

| Operator | Name | Example | Metrics & Notes |
| :--- | :--- | :--- | :--- |
| `<` | Less than | `a < b == r` | `29` add. vars, `77` total vars, `152` clauses (special case `0 < b == r` checks sign bit only) |
| `<=` | Less than or equal | `a <= b == r` | `29` add. vars, `77` total vars, `152` clauses |
| `>` | Greater than | `a > b == r` | `29` add. vars, `77` total vars, `152` clauses |
| `>=` | Greater than or equal | `a >= b == r` | `29` add. vars, `77` total vars, `152` clauses (special case `a >= 0 == r` checks sign bit only) |
| `=` | Equal | `a = b == r` | `15` add. vars, `63` total vars, `109` clauses |
| `!=` | Unequal | `a != b == r` | `15` add. vars, `63` total vars, `109` clauses |

#### Logical Operations

| Operator | Name | Example | Metrics & Notes |
| :--- | :--- | :--- | :--- |
| `&&` | Logical AND | `a && b == r` | `0` add. vars, `3` total vars, `3` clauses |
| `\|\|` | Logical OR | `a \|\| b == r` | `0` add. vars, `3` total vars, `3` clauses |
| `==` | Logical XNOR | `a == b == r` | `0` add. vars, `3` total vars, `4` clauses |

#### Power-of-Two Modular Operations

Only the integer part is used; the sign bit and the fractional part are ignored.

| Operator | Name | Example | Metrics & Notes |
| :--- | :--- | :--- | :--- |
| `{+}` | Modular addition | `a {+} b = r` | `200 {+} 200 = 144` in `size 8 0` |
| `{-}` | Modular subtraction | `a {-} b = r` | `10 {-} 15 = 11` in `size 4 0` |
| `{*}` | Modular multiplication | `a {*} b = r` | `11 {*} 13 = 15` in `size 5 0` |
| `{<<}` | Modular left shift | `a {<<} 3 = r` | `255 {<<} 2 = 252` in `size 8 0` |
| `{>>>}` | Modular unsigned right shift | `a {>>>} 2 = r` | Same as `>>>`, ignoring sign & fractional bits |
| `{:<<:}` | Modular left rotation | `a {:<<:} 1 = r` | `34 {:<<:} 2 = 10` in `size 6 0`; `operand2` must be known positive int |
| `{:>>:}` | Modular right rotation | `a {:>>:} 4 = r` | `7 {:>>:} 3 = 112` in `size 7 0`; `operand2` must be known positive int |
| `{<<*}`, `{*>>}` | Modular open shift | `a {<<*} 1 = r`<br>`b {*>>} 1 = x` | New bits are unconstrained (`true` or `false`) |
| `{&}`, `{^}`, `{\|}` | Modular bitwise ops | `a {&} b = r`<br>`a {^} b = r`<br>`a {\|} b = r` | Same as non-modular bitwise ops, ignoring sign & fractional bits |
| `{**}` | Modular square | `a {**} 2 = r` | `11 {**} 2 = 25` in `size 5 0`; `operand2` must be `2` |

---

### Division

Avoid division if possible, as it is internally replaced by multiplication and addition.

The equation `a / b = r` enforces the following constraints:
1. `b * r + remainder = a`
2. `remainder >= 0`
3. `b * oneBitNumber > remainder`

> **Note:** In `a / b = r`, `b` cannot be zero because no solution satisfies both `remainder >= 0` and `b * oneBitNumber > remainder`.

---

### Remainder and Division with Remainder

Division (`/`) and division with remainder (`/%`) return different quotients for numbers with a fractional part.

#### Division with Remainder Construct (`/%`)

```text
a /% b = (quotient, remainder)
```

Internal constraints:
* `b * quotient + remainder = a`
* `remainder >= 0`
* `b * oneBitNumber > remainder`
* `quotient = %%quotient` *(integer)*

Here, `quotient` is the integer result of dividing `a` by `b`, and `remainder` is the non-negative remainder (`a mod b`). Because calculating the remainder naturally requires calculating the quotient, this construct returns both values as a pair.

#### Remainder Operator (`%`)

Unlike the `/%` construct, the `%` operator can be used directly within an equation line (`a % b = r`). However, since the quotient is still calculated internally, it may trigger an overflow error when working with fractional numbers:

```text
// Result is false, even though 1 % 0.25 = 0, because 1 / 0.25 = 4 (overflow)
a % 0.25 = r

a >= 1
a <= 1

size 1 2 // max value is 1
```

---

### Multiplication

Ordinary multiplication (`*`) works only with positive numbers. Using a fractional part significantly increases the number of generated clauses.

#### Multiplication of Negative Numbers (`!*`)

To multiply negative numbers, signs must be checked and absolute values computed:

```text
// Equivalent manual expansion of a !* b = r
a:s == b:s == !r:s // check signs

0 - a = ta
0 - b = tb

!a:s ? a : ta = aAbs
!b:s ? b : tb = bAbs

aAbs * bAbs = rAbs

0 - rAbs = tr

!r:s ? rAbs : tr = r

size 8 0
```

You can use the shorthand operator `!*` (`a !* b = r`), which automatically generates the expansion shown above.

If the first operand can be negative while the second operand is guaranteed to be positive, you can optimize manually:

```text
// a * b = r (where b is guaranteed positive)
a:s == r:s // signs

0 - a = ta
!a:s ? a : ta = aAbs

aAbs * b = rAbs

0 - rAbs = tr
!r:s ? rAbs : tr = r

size 8 0
```

---

### Multiplication by Boolean Value

```text
// Subset sum
2 ?* x1 + 3 ?* x2 + 8 ?* x3 + 7 ?* x4 + 9 ?* x5 = 19

size 5 0

/* Transforms into:
x1 ? 2 : 0 = t1
x2 ? 3 : 0 = t2
x3 ? 8 : 0 = t3
x4 ? 7 : 0 = t4
x5 ? 9 : 0 = t5

t1 + t2 + t3 + t4 + t5 = 19
*/
```

---

### Comparison

Comparisons (`<`, `<=`, `>`, `>=`) are performed via subtraction:
* Checking the sign (`a >= 0` or `a < 0`) is **free**.
* If a variable is positive and compared against an exact power-of-two upper bound (e.g., `a >= 0; a < 64;`), optimizations may apply and make the comparison **free**.

---

### Equal, Unequal

The equation `a = b == r` is equivalent to `a != b == !r`:
* `a = b == true`: creates a direct link `{b: a}` (**free**).
* `a = b == r`: generates **7 clauses per bit** (`r == true` enforces `a = b`; `r == false` enforces `a != b`).
* `a = b == false`: generates **7 clauses per bit**.

In many cases, it is more efficient to use a condition instead:
* `r ? a = b`: generates only **2 clauses per bit**. If `r == true`, then `a = b`; if `r == false`, `a` and `b` can have any value (including `a = b`).

> **Syntax Note:** A single equality sign (`=` or `==`) acts as the equation separator. If multiple signs are present, one serves as the separator while the others function as operators.

---



### Logical Imply and Boolean Condition

In many cases, a boolean condition construct is preferable to logical implication:
* `a ? b == r`: **2 clauses** — if `a` is `true`, then `b` equals `r` *(this is a construct, not an operator)*.
* `!a || b == r`: **3 clauses** — if `a` is `true`, then `b` equals `r`; if `a` is `false`, then `r` equals `true`.

---

### Power-of-Two Modular Operations

Modular operators (`{+}`, `{-}`, `{*}`, etc.) require positive integer operands with zero fractional parts. Only the integer part is used, and all operations are performed modulo a power of two. Any negative input or number with a non-zero fractional part evaluates to `false`:

```text
x {+} -1 = 2; // result is false
```

```text
size 8 2
x {*} 0.5 = 1; // result is false
```

#### Difference Between `{<<}` and `<<`

* `{<<}` operates only on the integer part (ignoring the sign bit) and behaves like a standard bitwise left shift in conventional programming languages.
* `<<` acts as arithmetic multiplication by a power of two (no overflow; positive numbers remain positive and negative numbers remain negative).

**Shift Trick:** Subtracting `1` from an odd number is free using shifts:

```text
// If x is odd, y = x - 1
(x >> 1) << 1 = y
```

---

### Exponentiation

It is preferable to set upper bounds as powers of two. The exponentiation operator (`**`) can be used when both operands are known values. If the first operand is a variable, only squaring (`** 2`) is supported:

```text
r < 2 ** 5
a ** 2 = r
```

---

## Unary Operators

Unary minus (`-x`) is not supported for variables, though known literal constants can be negative:

```text
-2 = r      // ok
a + -2 = r  // ok

-x = r      // error
0 - x = r   // ok

a + -x = r      // error
a + 0 - x = r   // ok
```

Logical negation (`!varName`) translates directly into 3CNF-SAT as the literal `!varName` without introducing extra variables or clauses. For `!a == r`, a link `{a: !r}` is created.

### Unary Operators Overview

| Operator | Name | Example | Details |
| :--- | :--- | :--- | :--- |
| `!` | Logical NOT | `!a == r` | Free operation (link only) |
| `~` | Bitwise NOT | `~a = r` | Free operation (links only); `~5 = -6` |
| `%%` | Floor | `%%a = r` | Free operation (links only); `%%5.75 = 5` |
| `{~}` | Modular bitwise NOT | `{~}a = r` | Free operation (links only); `{~}5 = 250` in `size 8 0` |
| `^:` | Isolate highest set bit | `^:a = r` | `size 15 0`: 90 clauses (6 clauses/bit); `^:6 = 4` |
| `\|:` | Mask from highest set bit | `\|:a = r` | `size 15 0`: 45 clauses (3 clauses/bit); `\|:6 = 7` |
| `+:` | Population count | `+:a = r` | `size 15 0`: 134 clauses (~10 clauses/bit); `+:6 = 2` |
| `<:>` | Reverse bits | `<:>a = r` | Free operation (links only); `<:>2 = 64` in `size 7 0` |
| `{<:>}` | Modular reverse bits | `{<:>}a = r` | Free operation (links only); `{<:>}2 = 32` in `size 7 0` |

### Unary Operator Examples

```text
!x1 == true
x2 == !false
x1 || !x2 == !x3
// result: {x1: false, x2: true, x3: true}
```

```text
size 10 0

~x4 = 10
3 + ~x5 = x4
%% 10 = x6
// result: {x4: -11, x5: 13, x6: 10}
```

```text
size 10 3 // 3 bits for fractional part, one bit number is 0.125

~x8 = 10
3 + ~x9 = x8
%% 10.25 = x10

%% x12 = 7
// result: {x8: -10.125, x9: 13, x10: 10, x12: 7.75}
```

```text
size 3 2

%% a = b /* links created:
    {b:0: false, b:1: false, b:2: a:2, b:3: a:3, b:4: a:4, b:5: a:5} */

~ q = p /* links created:
    {p:0: !q:0, p:1: !q:1, p:2: !q:2, p:3: !q:3, p:4: !q:4, p:5: !q:5} */
```

#### Common Bitwise Idioms

```text
// Set variable as an integer
%%a = a // a is an integer
size 8 3;
```

```text
// Set consecutive bits to zeros then ones
|:a = a
+:a = bitsNumber
size 8 0;
```

```text
// Isolate the highest set bit manually
~( (|:a) >> 1) = t
a & t = r
size 8 0
```

```text
// Integer binary logarithm for positive integers
a >= 0
|: a = t
+: (t >> 1) = floorIntLog
size 8 0
```

```text
// Upper limit on multiplication via bit-length addition
// Ensures a * b is less than an 8-bit number without performing actual multiplication
aLog + bLog < 8

a >= 0; b >= 0;

+: (|: a) = aLog;
+: (|: b) = bLog;
```

---

## Types of Lines

The language supports 8 types of lines:
1. **Equations:** `a + b * c = r`
2. **Configs:** `size`, `config`, `format`
3. **Conditions (`?`):** `a ? x = v`
4. **Clauses block:** `clauses { ... }`
5. **Division with remainder:** `a /% b = (r, remainder)`
6. **Value from set:** `r ?= a b c d e`
7. **Boolean values adder:** `x += a b c d e`
8. **Binary search:** `binarySearch min|max x 0 1000`

### Condition Type Line

The language supports three types of conditional statements: **boolean conditions**, **implication-like conditions**, and **ternary conditions**.

#### 1. Boolean Conditions: `b1 ? b2 == b3`

* Costs **2 clauses**: if `b1` is `true`, then `b2` equals `b3`.
* If `b1` is `false`, `b2` and `b3` may or may not be equal.
* *(This is a conditional construct, not an equation line.)*

#### 2. Implication-Like Conditions: `boolean1 ? number1 = number2`

* Costs **2 clauses per bit**.
* Example: `a ? x = v` — if `a` is `true`, `x` equals `v`; if `a` is `false`, this condition is ignored and `x` can take any value.
* Negation is allowed before the condition (`!a ? x1 = x2`), but left-hand and right-hand sides cannot be swapped.
* **Restriction:** Additional operations inside an implication-like condition must be wrapped in parentheses:

```text
(a || b) ? (x1 + x2) = (x3 - x4)
```

#### 3. Ternary Condition: `r = b ? n1 : n2` or `b ? n1 : n2 = r`

Translates internally into two separate implication-like conditions:

```text
a ? x1 : x2 = x3 /* Transforms into:
    a ? x1 = x3
    !a ? x2 = x3
*/

!a ? y1 : y2 = y3 /* Transforms into:
    !a ? y1 = y3
    a ? y2 = y3
*/
```

**Ternary Condition with Known Values:**
If both branch values are known constants, ternary conditions are **free** (only links are created):

```text
// Converting boolean to number is free (links only):
// {n:0: a, n:1: false, n:2: false, n:3: false}
a ? 1 : 0 = n; // or n = 1 ?* a

// Also free:
// {v:0: true, v:1: b, v:2: !b, v:3: false}
b ? 3 : 5 = v;

size 3 0;
```

> **Important:** Both ternary branches must be valid (SAT) regardless of the condition:

```text
// Result is false (200 * x overflows 8-bit integer even though condition is false)
x > 1
r = false ? (200 * x) : 3
size 8 0
```

---

### Equation Lines

Almost every equation is converted into a simple form. Operator precedence and parentheses are supported.

* **Implicit `== true`:** If a line contains no equality signs (`=` or `==`), `== true` is automatically appended (`a >= 0` becomes `a >= 0 == true`).
* **Semicolon separator:** Use `;` to write multiple statements on one line:

```text
a + b = c; a >= 0; b >= 0;
// Converts to:
// a + b = c
// a >= 0 == true
// b >= 0 == true
```

#### Operator Precedence (Highest to Lowest)

Unary operators have higher precedence than binary operators. Binary operators follow this precedence order:

1. `**`, `{**}`
2. `*`, `/`, `!*`, `%`, `?*`, `{*}`
3. `+`, `-`, `{+}`, `{-}`
4. `<<`, `>>`, `<<*`, `*>>`, `{<<}`, `{>>>}`, `{<<*}`, `{*>>}`, `{:<<:}`, `{:>>:}`
5. `&`, `{&}`
6. `^`, `{^}`
7. `|`, `{|}`
8. `<`, `<=`, `>`, `>=`
9. `=`, `!=`
10. `&&`
11. `||`
12. `==` *(XNOR)*

> **XNOR (`==`) Precedence Note:** Unlike most programming languages where `==` evaluates before `&&` (e.g., `a && b == c && d`), in Equation Language `==` represents logical **XNOR** and holds the **lowest** operator precedence.

---

### Config: `inputVarsPositive`

Ensures that all number-type variables declared in the code are non-negative (note that internally generated temporary variables may still take negative values). Shortened syntax: `size + 8 0`.

```text
size + 8 0 // equivalent to: config inputVarsPositive true

a + b = -1 // result is false
```


---

### Value from Set (`?=`)

> **Stability Note:** The `?= ` construct is experimental/unstable and may be redesigned or removed in future versions.

```text
x ?= 1 2 3 5 8 13 21 34

size 8 0
```

---

### Assignment of Possible Values

All examples in this section involve integers only.

#### Interval-Based Value Assignment

Defining an interval via comparison operators is straightforward, though the resulting clause count varies depending on bit patterns:

```text
// x is in interval [5, 20] -> 52 clauses
x >= 5
x <= 20
size 15 0
```

```text
// x is in interval [6, 21] -> 37 clauses
x >= 6
x <= 21
size 15 0
```

```text
// x is in interval [7, 22] -> 54 clauses
x >= 7
x <= 22
size 15 0
```

For large intervals, comparison-based bounds are preferable. For very small intervals, use direct links or ternary conditions:
* **Single value `[5, 5]`:** Use equality (`x = 5`), which creates a free link `{x: 5}`.
* **Two values `[5, 6]`:** Use a ternary condition (`b ? 5 : 6 = x`), which creates free links only.
* **Three values:** Use nested ternary conditions, grouping numbers that share the most identical bits to minimize clauses:

```text
// Set {1, 2, 3}: grouping matters
// 6 clauses (1 and 2 differ in 2 bits)
b1 ? 1 : 2 = t1
b2 ? t1 : 3 = x
size 15 0

// 3 clauses (1 and 3 share bit 0 = 1)
b1 ? 1 : 3 = t1
b2 ? t1 : 2 = x
size 15 0

// 3 clauses (2 and 3 share bit 1 = 1)
b1 ? 2 : 3 = t1
b2 ? t1 : 1 = x
size 15 0
```

```text
// Set {2, 3, 4}:
// 3 clauses (optimal grouping)
b1 ? 2 : 3 = t1
b2 ? t1 : 4 = x
size 15 0

// 6 clauses
b1 ? 2 : 4 = t1
b2 ? t1 : 3 = x
size 15 0

// 9 clauses
b1 ? 3 : 4 = t1
b2 ? t1 : 2 = x
size 15 0
```

#### Non-Interval-Based Value Assignment

For disconnected sets like `{3, 6, 10}`, using logical OR with equality is inefficient:

```text
// Inefficient: 139 clauses
x = 3 || x = 6 || x = 10 == true
size 15 0
```

For larger sets, use the `?= ` construct, which automatically builds a tree of ternary conditions:

```text
// {x: 2, a: 1, b: 2, c: 3}
x ?= a b c;

x + a = 3;
x + b = 4;
x + c = 5;

size 4 0
```

```text
// x is in set {1, 2, 3, 4, 5, 6, 7}
x ?= 1 2 3 4 5 6 7 /* Example of internal transformation:
    b1 ? 1 : 2 = t1
    b2 ? 3 : 4 = t2
    b3 ? 5 : 6 = t3

    b4 ? t1 : t2 = t4
    b5 ? t3 : 7 = t5

    b6 ? t4 : t5 = x
*/
size 15 0
```

```text
// x is in set {3, 6, 7, 10, 20}
x ?= 3 6 7 10 20 /* Transforms into:
    b1 ? 3 : 6 = t1
    b2 ? 7 : 10 = t2
    b3 ? t2 : 20 = t3

    b5 ? t1 : t3 = x
*/
size 15 0
```

#### Set with Variables

When choosing from a set of variables, explicit implication conditions may perform better:

```text
// Equivalent to: x ?= a b c
b1 ? x = a
b2 ? x = b
b3 ? x = c

b1 || b2 || b3

size 4 0
```

#### Internal `?= ` Condition Generation & Tuning

When pairing numbers in `?=`, the generator prioritizes pairs with the maximum number of matching bits (e.g., `101010` and `111000` → `1x10x0`; `x10x` and `xx00` → `xx0x`):
1. Both bits are known and equal → resulting bit takes the common value (0 clauses).
2. Both bits are known and differ → resulting bit becomes a variable link (0 clauses).
3. One bit is a variable → generates **3 clauses**.
4. Both bits are distinct variables → generates **4 clauses**.

Currently, `?= ` uses a prototype beam-search heuristic with configurable parameters (`limit`, `branching`, `grouping`). Increasing these values may slightly reduce clause counts at the cost of higher generation time and memory usage:

```text
// Default: config valueFromSet 64 2 64

// 90 clauses (default settings)
x ?= 2 3 5 8 13 21 34 55 89 144 9 16 25 36 49 64 81 100 121

// 88 clauses (custom settings)
x ?= 2 3 5 8 13 21 34 55 89 144 9 16 25 36 49 64 81 100 121
config valueFromSet 2048 3 64
```

```text
// 107 clauses
x ?= 2 1 3 4 7 11 18 29 47 76 123 199 322 521 843 1364
size 11 0

// 106 clauses
x ?= 2 1 3 4 7 11 18 29 47 76 123 199 322 521 843 1364
size 11 0
config valueFromSet 64 3 64
```

> **Tip:** You can inspect the generated condition tree in the solver output under **Details -> valueFromSet**.

#### Manual Bit Setting for Power-of-Two Aligned Intervals

For intervals aligned with powers of two—such as `[40, 47]` (`0b101000` to `0b101111`)—manual bit constraints can be more efficient than comparisons: bits `x:6` and above are `false`, while `x:5 == true`, `x:4 == false`, and `x:3 == true`.

---

### Boolean Values Adder

Counts how many boolean literals evaluate to `true` and equates the sum to a rational number variable or constant:

```text
// x = 2
x += a b c

a || b == c
a && b == !c
```

```text
// x = 3
x += false false true false true true false
```

```text
// Result: {a: false, b: true, c: true}
2 += a b c

a || b == b && c
```

---

### Number as a Structure

Because a rational number is stored as a vector of booleans, it can be used as a compact structure (such as a stack or state snapshot), though every state transition creates a new number variable:

```text
// Letter size is 2 bits; s0, s1, s2 are stack snapshots
s0 = 0

n1 = s0 <<* 2; n1:0 == letter1_1; n1:1 == letter1_2;
condition1 ? n1 : s0 = s1

n2 = s1 << 2; n2:0 == letter2_1; n2:1 == letter2_2;
condition2 ? n2 : s1 = s2
```

> **Best Practice:** In most cases, it is better to generate the required number of explicit boolean variables rather than packing structures into numbers.

---

### 3CNF-SAT Format and Clauses Block

Every simple equation is compiled into **3CNF-SAT** clauses. For example:

```text
a || b == r /* transforms into:
    clauses {
        a b !r 
        !a r
        !b r
    }
*/
/* one of four possible results is {a:false, b:true, r:true}, every clauses will be true:
    clauses {
        a b !r  --> false || true  || false == true
        !a r    --> true  || true           == true
        !b r    --> false || true           == true
    }
*/
```

You can write raw 3CNF-SAT clauses directly using a `clauses { ... }` block (one clause per line, 1 to 3 literals per clause):

```text
a || b == r 

//additional clauses
clauses {
    a b r 
    a !b !r
    !a !b !r
}

/* Full list of clauses (3 from logic operation and 3 from clauses block):
    clauses {
        a b !r 
        !a r
        !b r
        a b r 
        a !b !r
        !a !b !r
    }
*/

/* the only one possible result is {a:true, b:false, r:true}, every clauses will be true:
    clauses {
        a b !r   --> true  || false || false == true
        !a r     --> false || true           == true
        !b r     --> true  || true           == true
        a b r    --> true  || false || true  == true
        a !b !r  --> true  || true  || false == true
        !a !b !r --> false || true  || false == true
    }
*/
```

Equations consisting purely of top-level ORs (`a || b || c` or `a || b || c == true`) compile directly into a single clause:

```text
a || !b || !c
/* Converts directly to:
    clauses {
        a !b !c
    }
*/
```

---

### Binary Search (`binarySearch`)

Syntax:

```text
binarySearch min|max variableName lowerBound upperBound
```

Both `lowerBound` and `upperBound` are **inclusive**.

#### Example Execution Trace

For `binarySearch min x 0 1000`:
1. Check left interval `[0, 499]` → SAT (`x = 120`)
2. Check left interval `[0, 59]` → UNSAT
3. Check right interval `[60, 119]` → SAT (`x = 90`)
4. Check left interval `[60, 74]` → UNSAT
5. Check right interval `[75, 89]` → UNSAT → returns last valid result: **`x = 90`**

*(Note: Currently, each binary search step regenerates the entire SAT task from scratch, which can be slow for large models; incremental bound updates are planned).*

#### Examples

```text
// Result: {x3: 8}
x1 * x2 > 15;
x1 + x2 = x3;

x1 >= 0; x2 >= 0; x3 >= 0;

size 6;

binarySearch min x3 0 30;
```

```text
// Result: {x3: 9}
x1 * x2 < 15;
x1 + x2 = x3;

x1 > 1; x2 > 1; x3 > 1;

size 6;

binarySearch max x3 0 30
```

```text
a + b = 30
a * b = v

size + 10 0

binarySearch max v 0 1000
```

---

## Working with Irrational Numbers

The tool operates strictly on discrete values represented by a fixed number of bits, so there is no direct support for irrational numbers. For instance, `x * x = 2` has no solution regardless of fractional bit precision because the square root of 2 is irrational.

To approximate irrational solutions, introduce a small tolerance slack variable:

```text
x * x + a = 2

a >= 0
a <= 0.0125

size 2 10
```

> Precompute constant irrational values (such as π, e, or square roots of known constants) beforehand and substitute their rational approximations into your equations.

---

## SAT Optimization

Before invoking the 3CNF-SAT solver, the generated formula undergoes four optimization passes:

1. **Known Values Removal:** Known literals (`0` or `1`) are stripped from clauses. Any clause containing `1` evaluates to `true` and is removed.
2. **Single-Literal Clause Resolution (Unit Propagation):** Clauses containing a single literal force that literal to `1`, propagating its value across all other clauses.
3. **Pairs Reduction:** Simplifies two-literal clauses that share the exact same variables.
4. **Pure Literal Check:** Identifies variables appearing exclusively with positive polarity or exclusively with negative polarity across the entire formula and assigns them fixed values (`true` or `false`).

### Pairs Reduction

When two two-literal clauses contain the exact same variables, three reductions apply:

1. **Identical Pairs:** The duplicate clause is removed.
2. **One Matching Literal, One Opposing Literal:** The matching literal is forced to `1`, and both clauses are discarded:

```text
// Result: {x1: false}; both clauses are removed
clauses {
    !x1 x2
    !x1 !x2
}
```

```text
// Result: {x2: true}; both clauses are removed
clauses {
    !x1 x2
    x1 x2
}
```

3. **Both Literals Opposing:** Creates an equivalence/negation link between the two variables, and both clauses are discarded:

```text
// Link created: {x1: !x2}; both clauses are removed
clauses {
    x1 x2
    !x1 !x2
}
```

```text
// Link created: {x1: x2}; both clauses are removed
clauses {
    x1 !x2
    !x1 x2
}
```

### Pure Variable Check

```text
// x1 appears only negated (pure literal) -> assigned {x1: false},
// and all four clauses are eliminated during optimization
clauses {
    !x1 x2 x3
    !x1 !x2 !x3
    !x1 x4 x5
    !x1 !x4 !x5
}
```

To disable pure variable elimination (useful when benchmarking exact clause and variable counts), set `config checkPure false`:

```text
clauses {
    !x1 x2 x3
    !x1 !x2 !x3
    !x1 x4 x5
    !x1 !x4 !x5
}

config checkPure false
```

### Optimizer Limitations

The optimizer does not currently perform resolution on three-literal clauses (for example, reducing `x1 x2 x3` and `x1 x2 !x3` into `x1 x2`), as well as several other advanced CNF simplification rules.

---

## SAT Solver

The current solver implementation is a prototype. Note that if a variable has no impact on satisfiability (i.e., it can be either `true` or `false`), the solver defaults its value to **`false`**.

### Config: `solve false`

Use `config solve false` to parse, validate, generate clauses, and run all CNF optimizations while skipping the final solving phase. This is useful for inspecting generated clause counts and checking for memory limits:

```text
size 101 0

a * b = 1267650600228229401496703205376

a < 2 ** 50

config solve false
```

---

## Number of Clauses for Basic Operations

| Operation / Construct | Syntax Example | Clauses | Generated 3CNF Clauses |
| :--- | :--- | :---: | :--- |
| **Half Adder** | `r += a b` | `6` | `a b !r:0`<br>`a b !r:1`<br>`!a !b r:1`<br>`a !b r:0`<br>`!a b r:0`<br>`!r:1 !r:0` |
| **Full Adder** | `r += a b c` | `10` | `a b !t`<br>`a !b t`<br>`t c !r:0`<br>`t !c r:0`<br>`!a !b !t`<br>`!a t r:1`<br>`b t !r:1`<br>`!t c !r:1`<br>`!t !c !r:0`<br>`!t r:1 r:0` |
| **Full Adder (one `true`)** | `r += a true b` | `6` | `!a b !r:0`<br>`!a !b r:0`<br>`!a r:1`<br>`a b !r:1`<br>`a !b !r:0`<br>`a r:1 r:0` |
| **Logic AND (`false` result)** | `a && b == false` | `1` | `!a !b` |
| **Logic Equation AND** | `a && b == r` | `3` | `!a !b r`<br>`a !r`<br>`b !r` |
| **Logic OR (`true` result)** | `a \|\| b` | `1` | `a b` |
| **Logic OR (3 vars)** | `a \|\| b \|\| c` | `1` | `a b c` |
| **Logic OR (4 vars)** | `a \|\| b \|\| c \|\| d` | `2` | `a b t`<br>`!t c d` |
| **Logic OR (5 vars)** | `a \|\| b \|\| c \|\| d \|\| e` | `3` | `a b t1`<br>`!t1 c t2`<br> `!t2 d e` |
| **Logic Equation OR** | `a \|\| b == r` | `3` | `a b !r`<br>`!a r`<br>`!b r` |
| **1–3 Truth Table (e.g., IMPLY)** | `!a \|\| b == r` | `3` | `!a b !r`<br>`a r`<br>`!b r` |
| **2–2 Truth Table (XOR / XNOR)** | `a == b == r` | `4` | `a b r`<br>`a !b !r`<br>`!a b !r`<br>`!a !b r` |
| **Boolean Implication** | `a ? b == r` | `2` | `!a b !r`<br>`!a !b r` |
| **If `a == b` then `r == true`** | `a \|\| b \|\| r`<br>`!a \|\| !b \|\| r` | `2` | `a b r`<br>`!a !b r` |
| **If `a == b` then `r == b`** | `a \|\| b \|\| !r`<br>`!a \|\| !b \|\| r` | `2` | `a b !r`<br>`!a !b r` |
| **If `a \|\| b` then `r == true`** | `!a \|\| r`<br>`!b \|\| r` | `2` | `!a r`<br>`!b r` |
| **If `a \|\| b` then `r == b`** | `!a \|\| b \|\| !r`<br>`!b \|\| r` | `2` | `!a b !r`<br>`!b r` |
| **If `a && b` then `r == true`** | `!a \|\| !b \|\| r` | `1` | `!a !b r` |

---

## Multiplication Optimization

Multiplication occurs in several forms:
1. Regular multiplication (all variables unknown)
2. Known result (integer factorization)
3. Multiplication by a known value
4. Squaring (`** 2`)
5. Power-of-two modular multiplication (`{*}` and `{**} 2`)

> **Tip:** The fastest multiplication is avoiding multiplication altogether. When only an approximate magnitude or upper bound is needed, add the bit-lengths instead: `+: (|: a) = aLog;`.

### Approximate Value

When full precision is not required, shift operands right before multiplying and shift the result back afterward:

```text
// Approximate multiplication: a * b ≈ r
a >> 3 = ta
b >> 3 = tb

ta * tb = tr

tr << 6 = r
```

### Setting an Upper Bound

The solver inspects multiplicand upper bounds first to choose the multiplication circuit. Setting tight upper bounds—ideally **powers of two**—dramatically reduces clause counts (power-of-two bounds simply fix higher bits to `false`, whereas arbitrary bounds generate extra comparison clauses):

```text
// Valid upper bounds (known constants)
a * b = r

a < 16
b < 2 ** 4
```

```text
// Invalid upper bounds (non-constant expressions are not treated as static bit bounds)
a * b = r

a < t + 8
b < a
```

### Squaring vs. Multiplication

Because both operands are identical, squaring (`a ** 2 = r`) generates roughly half as many clauses as general multiplication and enables deeper recursive squaring optimizations in Karatsuba's algorithm. Note that `a * a = r` is automatically transformed into `a ** 2 = r`.

```text
// 1108 clauses
a * b = r
a < 2 ** 10
b < 2 ** 10
size 20 0

// 599 clauses
a ** 2 = r
size 20 0
```

### Karatsuba Algorithm

The Karatsuba algorithm is implemented for standard multiplication (`*`) and squaring (`** 2`), but **not** for modular operations (`{*}`, `{**} 2`):
* **Small numbers:** Uses simple table-based multiplication.
* **Large numbers:** Switches to Karatsuba above **20 bits** for general multiplication (when bounded) and at **30+ bits** for squaring.
* **Unbounded multiplication:** If no upper bound is set, Karatsuba triggers at `size 176 0` and generates an initial overflow check (`full, bitSize` in `karatsubaLog`). Explicitly setting upper bounds below half the total bit size avoids overflow checks.

The task was to make this tool/language as universal as possible. For example, in a simple equation like a * b = 256, possible solutions could be [16,16], [2, 128], [1, 256] etc. Here all possible variants are taken into account. If no upper bound is set, currently, the switch to Karatsuba occurs at size 176 0. And if there's no upper boundary specified, instead of performing the first multiplication an overflow check is generated. In this case on the first step, 2 multiplications are performed instead of 3. However, it's still costly, so it's better to set an upper bound. In karatsubaLog this initial step is denoted as "full, bitSize". If an upper limit is explicitly provided and both numbers bit sizes are smaller than "total bitSize" divided by two, then no overflow checks occur.


Inspect generated sub-multiplications in **Result Details -> karatsubaLog**:

```text
a ** 2 = r

size 70 0

config solve false

/*
    Details -> karatsubaLog (multiplier bit size, result bit size):
    35,71
    18,37
    17,35
    19,39

    -> 3 sub-squarings with bit sizes 18, 17, and 19.
*/
```

### Multiplication by a Known Value

Constant multiplication decomposes into shift-and-add chains (inspectable under **Result Details -> multAdditions**). For example, multiplying by `27` requires only two additions:

```text
a * 27 = r /* Transforms into:
    a + (a << 1) = t
    t + (t << 3) = r
    a >= 0
*/
```

Because the current grouping heuristic is not always optimal, manual shift-and-subtract formulations can save clauses—for example, `31 * a = (a << 5) - a` (allocate one extra integer bit to prevent intermediate overflow):

```text
// 31 * a = r
a << 5 = t
t - a = r
```

Two experimental constant-multiplication strategies can be toggled via config:

```text
config multByConstMethod 1
config multByConstMethod 2
```

---

## Resize

> **Stability Note:** `resize` is experimental/unstable and may be removed in future versions.

`resize` restricts the integer and fractional bit widths for all supported operations (`+`, `-`, `*`, `**`, `>`, `>=`, `<`, `<=`, and all modular `{...}` operations) on a single line, setting excess higher-order bits to `false`:

```text
size 10 0;

resize 8 0: a + b = r /* Addition using 8 bits; excess bits are forced to false:
    a:10 == false; b:10 == false; r:10 == false;
    a:9 == false;  b:9 == false;  r:9 == false;
*/
```

```text
size 15 3;

// 8-bit modular arithmetic (mod 256):
resize 8 0: a {+} b {*} c = r {:<<:} 2
```

---

## Development Notes

This solver is currently a prototype built to run entirely client-side in the browser without requiring a backend server. The initial design aimed to avoid function-like syntax in favor of pure operators, which led to specialized constructs such as `{:<<:}`, `|:`, `+:`, and `<:>`; parts of the syntax and optimizer may undergo refactoring in future releases.

---

## Advanced Examples

### Number Theory Algorithms

#### Modular Multiplicative Inverse

```text
// Solve: a * r = 1 (mod m)
a = 17
m = 41

(a * r) % m = 1

r < m

size 12 0
```

#### Chinese Remainder Theorem

```text
x % 5 = 3
x % 7 = 4
x % 11 = 8

x < 5 * 7 * 11

size 10 0
```

#### Discrete Logarithm Problem (via Binary Exponentiation)

For many tasks it's better to generate equation language code using your preferred programming language and then use this solver.

```text
// Solve: base ** x = needle (mod m)
m = 241
base = 190
needle = 132

x >= 0
x < m - 1

size + 18 0

p1 = 190    // base ** 1 (mod m)
p2 = 191    // base ** 2 (mod m)
p3 = 90     // base ** 4 (mod m)
p4 = 147    // base ** 8 (mod m)
p5 = 160    // base ** 16 (mod m)
p6 = 54     // base ** 32 (mod m)
p7 = 24     // base ** 64 (mod m)
p8 = 94     // base ** 128 (mod m)

// Binary exponentiation
x:0 ? p1 : 1 = v1
x:1 ? (v1 * p2 % m) : v1 = v2
x:2 ? (v2 * p3 % m) : v2 = v3
x:3 ? (v3 * p4 % m) : v3 = v4
x:4 ? (v4 * p5 % m) : v4 = v5
x:5 ? (v5 * p6 % m) : v5 = v6
x:6 ? (v6 * p7 % m) : v6 = v7
x:7 ? (v7 * p8 % m) : v7 = needle

format "${base} ** ${x} = ${needle} (mod ${m})"
```

---

### Various Examples

#### Find Maximum Value from a Set

```text
// Find max value from set {3, 4, 1, 8, -3}
maxValue >= 3
maxValue >= 4
maxValue >= 1
maxValue >= 8
maxValue >= -3

maxValue ?= 3 4 1 8 -3

size 8 0
```

#### Set Intersection (Bit-Vector Representation)

```text
// Universal set {1, 2, 3, 4, 5} -> 0b11111
a = 7  // {1, 2, 3} -> 0b00111
b = 14 // {2, 3, 4} -> 0b01110

r = a & b // {2, 3} -> 0b00110

size 4 0
```

#### Quadratic Equation with Negative Multiplication

```text
// Solve: a*x*x + b*x + c = 0
a = 4
b = -5
c = -12

a !* x !* x + b !* x + c = zero

-0.1 < zero
zero < 0.1

size 8 8
```

#### HELLO

```text
/*
    function f(arr) {
        let h = 5381;
        let mod = 2 ** 32;

        for (let symbol of arr) {
            h = (h * 33 + symbol) % mod;
        }

        return h;
    }
*/

// Input: 5 uppercase ASCII letters
// Target hash output: 222103545

symbol1 >= 65; symbol1 <= 90;
symbol2 >= 65; symbol2 <= 90;
symbol3 >= 65; symbol3 <= 90;
symbol4 >= 65; symbol4 <= 90;
symbol5 >= 65; symbol5 <= 90;

h1 = 5381

(h1 {<<} 5) {+} h1 {+} symbol1 = h2
(h2 {<<} 5) {+} h2 {+} symbol2 = h3
(h3 {<<} 5) {+} h3 {+} symbol3 = h4
(h4 {<<} 5) {+} h4 {+} symbol4 = h5
(h5 {<<} 5) {+} h5 {+} symbol5 = 222103545

size + 32 0
```

---

### Karp's NP-Complete Problems

#### 1. Satisfiability (3-SAT)

```text
// (x1 || !x2 || x3) && (x1 || x2 || x4) && (!x1 || !x2 || x5)
clauses {
    x1 !x2 x3
    x1 x2 x4
    !x1 !x2 x5
}
```

#### 2. 0–1 Integer Programming

```text
y = 40 ?* x1 + 8 ?* x2 + 50 ?* x3 + 16 ?* x4

380 ?* x1 + 200 ?* x2 + 350 ?* x3 + 800 ?* x4 <= 1100

binarySearch max y 0 500

size 11 0
```

#### 3. Clique (`k = 4`)

```text
/* Adjacency matrix:
0 1 1 1 0 1 0
1 0 1 0 1 0 1
1 1 0 1 1 0 0
1 0 1 0 1 1 1
0 1 1 1 0 1 1
1 0 0 1 1 0 1
0 1 0 1 1 1 0
*/

// Select k = 4 vertices
4 += v1 v2 v3 v4 v5 v6 v7

// Each missing edge introduces an exclusion constraint
v1 && v5 == false
v1 && v7 == false

v2 && v4 == false
v2 && v6 == false

v3 && v6 == false
v3 && v7 == false

size 4 0
```

#### 4. Set Packing (`k = 3`)

```text
/* Sets:
u : {1, 2, 3, 4, 5, 6, 7, 8}
a : {1, 2, 3}
b : {4, 5, 6}
c : {1, 4, 7}
d : {2, 5, 8}
e : {3, 6, 8}
f : {7, 8}
*/

// Select k = 3 disjoint sets
3 += a b c d e f

// Each overlapping pair of sets introduces an exclusion constraint
a && c == false
a && d == false
a && e == false

b && c == false
b && d == false
b && e == false

c && f == false

d && e == false
d && f == false

e && f == false

size 4 0
```

#### 18. Subset Sum (Knapsack)

```text
// Set: {3, 7, 3, 4, 5, 9}, target sum s = 11
11 = 3 ?* x1 + 7 ?* x2 + 3 ?* x3 + 4 ?* x4 + 5 ?* x5 + 9 ?* x6

size 8 0
```