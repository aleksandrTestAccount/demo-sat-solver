# E0 Equation Language — Examples Collection

### SAT & Combinatorial Optimization
- [MaxSAT](#maxsat)
- [Weighted Partial MaxSAT](#weighted-partial-maxsat)
- [SAT with minimum TRUE variables](#sat-with-minimum-true-variables)
- [0-1 Knapsack](#0-1-knapsack)
- [Quadratic programming](#quadratic-programming)
- [Job shop](#job-shop)
- [Clauses generator](#clauses-generator)

### Strings, Graphs & Puzzles
- [Closest string](#closest-string)
- [Multiple Sequence Alignment](#multiple-sequence-alignment)
- [Longest common subsequence](#longest-common-subsequence)
- [Shortest common supersequence](#shortest-common-supersequence)
- [Travelling Salesman](#travelling-salesman)
- [The 3n+1 problem](#the-3n1-problem)
- [Sudoku](#sudoku)
- [Eight queens puzzle](#eight-queens-puzzle)

### Cryptography, Lattices & Coding Theory
- [Shortest Vector](#shortest-vector)
- [Closest Vector](#closest-vector)
- [Hash](#hash)
- [Addition chain](#addition-chain)
- [Constant multiplication](#constant-multiplication)
- [LWE](#lwe)
- [Binary linear code](#binary-linear-code)

### Number Theory
- [Discrete Square Roots](#discrete-square-roots)
- [Modular Multiplicative Inverse](#modular-multiplicative-inverse)
- [Chinese Remainder Theorem](#chinese-remainder-theorem)
- [Binary exponentiation and discrete Logarithm](#binary-exponentiation-and-discrete-logarithm)
- [Elliptic Curves](#elliptic-curves)
- [Extended Euclidean](#extended-euclidean)
- [An Even Number as the Sum of Two Prime Numbers](#an-even-number-as-the-sum-of-two-prime-numbers)

### Karp's 21 NP-Complete Problems
- [1. Satisfiability](#1-satisfiability)
- [2. 0-1 Integer Programming](#2-0-1-integer-programming)
- [3. Clique](#3-clique)
- [4. Set packing](#4-set-packing)
- [5. Vertex cover](#5-vertex-cover)
- [6. Set cover](#6-set-cover)
- [7. Feedback Vertex set](#7-feedback-vertex-set)
- [8. Feedback arc set](#8-feedback-arc-set)
- [9. Directed Hamilton circuit](#9-directed-hamilton-circuit)
- [10. Undirected Hamilton circuit](#10-undirected-hamilton-circuit)
- [11. SAT3](#11-sat3)
- [12. Chromatic number](#12-chromatic-number)
- [13. Clique cover](#13-clique-cover)
- [14. Exact cover](#14-exact-cover)
- [15. Hitting set](#15-hitting-set)
- [16. Steiner tree](#16-steiner-tree)
- [17. 3-dimensional matching](#17-3-dimensional-matching)
- [18. Subset sum (Knapsack)](#18-subset-sum-knapsack)
- [19. Job sequencing](#19-job-sequencing)
- [20. Partition](#20-partition)
- [21. Max cut](#21-max-cut)

---

## SAT & Combinatorial Optimization

### MaxSAT
```text
// MaxSAT

// (x0 || x1) && (x0 || !x1) && (!x0 || x1) && (!x0 || !x1)

 x0 ||  x1 == v0
 x0 || !x1 == v1
!x0 ||  x1 == v2
!x0 || !x1 == v3

v += v0 v1 v2 v3

binarySearch max v 0 4
```
                    


### Weighted Partial MaxSAT
```text
// Weighted Partial MaxSAT

// clause             : weight

//  x0 ||  x1         : 1
//  x0 || !x1         : must be satisfied
// !x0 ||  x1 ||  x2  : 2
// !x0 || !x1 || !x2  : must be satisfied
// !x1 || !x2         : 3
//  x0 || !x2         : 1
// !x0 ||  x1 || !x2  : 1
//  x0 ||  x1 ||  x2  : 2
// !x0 ||  x1         : 2
// !x0 || !x1         : 3

 x0 ||  x1         == b0;  b0 ? 1 : 0 = v0
 x0 || !x1         == true 
!x0 ||  x1 ||  x2  == b2;  b2 ? 2 : 0 = v2
!x0 || !x1 || !x2  == true
!x1 || !x2         == b4;  b4 ? 3 : 0 = v4
 x0 || !x2         == b5;  b5 ? 1 : 0 = v5
!x0 ||  x1 || !x2  == b6;  b6 ? 1 : 0 = v6
 x0 ||  x1 ||  x2  == b7;  b7 ? 2 : 0 = v7
!x0 ||  x1         == b8;  b8 ? 2 : 0 = v8
!x0 || !x1         == b9;  b9 ? 3 : 0 = v9

v = v0 + v2 + v4 + v5 + v6 + v7 + v8 + v9

binarySearch max v 0 15

size 5 0


/* Alternatively (equivalent):

 x0 || !x1 
!x0 || !x1 || !x2

v0 = 1 ?* ( x0 ||  x1)
v2 = 2 ?* (!x0 ||  x1 ||  x2)
v4 = 3 ?* (!x1 || !x2)
v5 = 1 ?* ( x0 || !x2)
v6 = 1 ?* (!x0 ||  x1 || !x2)
v7 = 2 ?* ( x0 ||  x1 ||  x2)
v8 = 2 ?* (!x0 ||  x1)
v9 = 3 ?* (!x0 || !x1)

v = v0 + v2 + v4 + v5 + v6 + v7 + v8 + v9

binarySearch max v 0 15

size 5 0

*/
```                    


### SAT with minimum TRUE variables
```text
// SAT with minimum TRUE variables

 x0 ||  x1 ||  x3        
 x0 || !x1           
!x0 ||  x1 ||  x2  
!x0 || !x1 || !x2  
!x1 || !x2        
 x0 || !x2 ||  x3        
!x0 ||  x1 || !x2  
 x0 ||  x1 ||  x2  
!x0 ||  x1         
!x0 || !x1        

x += x0 x1 x2 x3

binarySearch min x 0 4

size 5 0
```                    


### 0-1 Knapsack
```text
//0-1 Knapsack

// Item Weight Value

//   x0      3    53 
//   x1      7    41
//   x2      3    10
//   x3      4    35
//   x4      5    71
//   x5      9    67

// total weight <= 20
// maximize total value
// each item may be included at most once.


// x0, x1, x2, x3, x4, x5 - boolean values
// ?* - multiplication by boolean value operator
// 5 ?* true = 5
// 5 ?* false = 0
3 ?* x0 + 7 ?* x1 + 3 ?* x2 + 4 ?* x3 + 5 ?* x4 + 9 ?* x5 = weight
53 ?* x0 + 41 ?* x1 + 10 ?* x2 + 35 ?* x3 + 71 ?* x4 + 67 ?* x5 = value

weight <= 20

binarySearch max value 0 1000

size 10 0

```
                    
### Quadratic programming
```text
//Quadratic programming

size 10 4

binarySearch min r -800 0

r = 3*x1*x1 + 5*x2*x2 - 7*x1*x2 - 35*x1 - 50*x2

x1 + x2 <= 9
x1 + x2 >= 3
3*x2 - x1 >= 13

```                  



### Job Shop 
```text
// Job Shop Scheduling 

size + 5 0

// j1 - job1
// j2_t2 = job2 task2
// (m0 3) - task on machine0 in 3 units of time

// j0: (m0 4) (m1 2) (m2 2)
// j1: (m0 2) (m2 1) (m1 5)
// j2: (m1 5) (m2 2)

binarySearch min k 0 20

k >= j0_end; b1 ? k = j0_end
k >= j1_end; b2 ? k = j1_end
k >= j2_end; b3 ? k = j2_end

b1 || b2 || b3

j0_t0_start + 4 = j0_t0_end; j0_t1_start >= j0_t0_end
j0_t1_start + 2 = j0_t1_end; j0_t2_start >= j0_t1_end
j0_t2_start + 2 = j0_t2_end; j0_end = j0_t2_end

j1_t0_start + 2 = j1_t0_end; j1_t1_start >= j1_t0_end;
j1_t1_start + 1 = j1_t1_end; j1_t2_start >= j1_t1_end;
j1_t2_start + 5 = j1_t2_end; j1_end = j1_t2_end

j2_t0_start + 5 = j2_t0_end; j2_t1_start >= j2_t0_end;
j2_t1_start + 2 = j2_t1_end; j2_end = j2_t1_end

//m0: j0_t0, j1_t0

j0_t0_before_j1_t0 == j0_t0_end <= j1_t0_start
!j0_t0_before_j1_t0 == j0_t0_start >= j1_t0_end

//m1: j0_t1, j1_t2, j2_t0

j0_t1_before_j1_t2 == j0_t1_end <= j1_t2_start
!j0_t1_before_j1_t2 == j0_t1_start >= j1_t2_end

j0_t1_before_j2_t0 == j0_t1_end <= j2_t0_start
!j0_t1_before_j2_t0 == j0_t1_start >= j2_t0_end

j1_t2_before_j2_t0 == j1_t2_end <= j2_t0_start
!j1_t2_before_j2_t0 == j1_t2_start >= j2_t0_end

//m2: j0_t2, j1_t1, j2_t1

j0_t2_before_j1_t1 == j0_t2_end <= j1_t1_start
!j0_t2_before_j1_t1 == j0_t2_start >= j1_t1_end

j0_t2_before_j2_t1 == j0_t2_end <= j2_t1_start
!j0_t2_before_j2_t1 == j0_t2_start >= j2_t1_end

j1_t1_before_j2_t1 == j1_t1_end <= j2_t1_start
!j1_t1_before_j2_t1 == j1_t1_start >= j2_t1_end
```
                    
### Clauses generator
```text
// Clauses generator: Full adder (or 3-2 adder)    

// a b c - inputs,
// t - additional variable t = a xor b,
// r0 and r1 - result bits

// for example, 0b01 + 0b00 + 0b01 = 0b10
// a = 1, b = 0, c = 1: t = 1, r0 = 0, r1 = 1

// let's find 10 clauses for this adder 

/* 4 non-excludable clauses: 

a b !t
!a !b !t
t c !r0
t !c r0 

*/

// Let's find the remaining 6 clauses
// na: !a 
// a_b_nr1: clause a b !r1
 
a_b_nr1 || a_t_nr1 || a_c_nr1 || b_t_nr1 || b_c_nr1
a_b_nr1 || a_t_nr1 || a_nr1_nr0 || b_t_nr1 || b_nr1_nr0
a_nb_t || nb_t_r1 || nb_r1_r0
a_nb_t || a_t_nr1 || a_c_nr1
a_nb_t || nb_t_r1 || nb_nc_r1
a_nb_t || a_t_nr1 || a_nr1_nr0
nb_r1_r0 || nt_c_r0 || nt_r1_r0
a_c_nr1 || nt_c_nr1 || nt_c_r0
a_c_nr1 || a_nr1_nr0 || nt_c_nr1 || nt_nr1_nr0 || c_nr1_nr0
nb_nc_r1 || nb_r1_r0 || nt_nc_r1 || nt_r1_r0 || nc_r1_r0
nb_nc_r1 || nt_nc_r1 || nt_nc_nr0
a_nr1_nr0 || nt_nc_nr0 || nt_nr1_nr0
na_b_t || na_t_r1 || na_r1_r0
na_b_t || b_t_nr1 || b_c_nr1
na_b_t || na_t_r1 || na_nc_r1
na_b_t || b_t_nr1 || b_nr1_nr0
na_r1_r0 || nt_c_r0 || nt_r1_r0
b_c_nr1 || nt_c_nr1 || nt_c_r0
b_c_nr1 || b_nr1_nr0 || nt_c_nr1 || nt_nr1_nr0 || c_nr1_nr0
na_nc_r1 || na_r1_r0 || nt_nc_r1 || nt_r1_r0 || nc_r1_r0
na_nc_r1 || nt_nc_r1 || nt_nc_nr0
b_nr1_nr0 || nt_nc_nr0 || nt_nr1_nr0
na_nb_r1 || na_t_r1 || na_r1_r0 || nb_t_r1 || nb_r1_r0
na_nb_r1 || na_t_r1 || na_nc_r1 || nb_t_r1 || nb_nc_r1

k +=  a_b_nr1  a_t_nr1  a_c_nr1  b_t_nr1  b_c_nr1  a_nr1_nr0  b_nr1_nr0  a_nb_t  nb_t_r1  nb_r1_r0  nb_nc_r1  nt_c_r0  nt_r1_r0  nt_c_nr1  nt_nr1_nr0  c_nr1_nr0  nt_nc_r1  nc_r1_r0  nt_nc_nr0  na_b_t  na_t_r1  na_r1_r0  na_nc_r1  na_nb_r1 

size 5 0 

k = 6
```             

## Strings, Graphs & Puzzles

### Closest string
```text
// closest string problem, 4 letters, A C G T

// A: 0 
// C: 1
// G: 2
// T: 3

size + 4 0 

// string 0: A C G T C C G
// string 1: C A G T T T C
// string 2: T C A C G A A
// string 3: A C G C T C A
// string 4: C G G A T A A

d >= d0; d >= d1; d >= d2; d >= d3; d >= d4; 

binarySearch min d 0 7 

!d0_0 ? 0 = s0
!d0_1 ? 1 = s1
!d0_2 ? 2 = s2
!d0_3 ? 3 = s3
!d0_4 ? 1 = s4
!d0_5 ? 1 = s5
!d0_6 ? 2 = s6

d0 += d0_0 d0_1 d0_2 d0_3 d0_4 d0_5 d0_6

!d1_0 ? 1 = s0
!d1_1 ? 0 = s1
!d1_2 ? 2 = s2
!d1_3 ? 3 = s3
!d1_4 ? 3 = s4
!d1_5 ? 3 = s5
!d1_6 ? 1 = s6

d1 += d1_0 d1_1 d1_2 d1_3 d1_4 d1_5 d1_6

!d2_0 ? 3 = s0
!d2_1 ? 1 = s1
!d2_2 ? 0 = s2
!d2_3 ? 1 = s3
!d2_4 ? 2 = s4
!d2_5 ? 0 = s5
!d2_6 ? 0 = s6

d2 += d2_0 d2_1 d2_2 d2_3 d2_4 d2_5 d2_6

!d3_0 ? 0 = s0
!d3_1 ? 1 = s1
!d3_2 ? 2 = s2
!d3_3 ? 1 = s3
!d3_4 ? 3 = s4
!d3_5 ? 1 = s5
!d3_6 ? 0 = s6

d3 += d3_0 d3_1 d3_2 d3_3 d3_4 d3_5 d3_6

!d4_0 ? 1 = s0
!d4_1 ? 2 = s1
!d4_2 ? 2 = s2
!d4_3 ? 0 = s3
!d4_4 ? 3 = s4
!d4_5 ? 0 = s5
!d4_6 ? 0 = s6

d4 += d4_0 d4_1 d4_2 d4_3 d4_4 d4_5 d4_6            
```

### Multiple sequence alignment
```text
// Multiple sequence alignment

// string 0: C A G T T
// string 1: C A T T
// string 2: C A G A T

// pair mismatch penalty = 1
// gap penalty = 2

// A:00
// C:01
// G:10
// T:11

//      C A G T T
s0 = 0b0100101111 // string 0 
//      C A T T
s1 = 0b01001111 // string 1 
//      C A G A T
s2 = 0b0100100011 // string 2 

size + 10 0

gaps += g0_0 g1_0 g2_0 g0_1 g1_1 g2_1 g0_2 g1_2 g2_2 g0_3 g1_3 g2_3 g0_4 g1_4 g2_4 g0_5 g1_5 g2_5 

mis += m0_1_0 m0_2_0 m1_2_0 m0_1_1 m0_2_1 m1_2_1 m0_1_2 m0_2_2 m1_2_2 m0_1_3 m0_2_3 m1_2_3 m0_1_4 m0_2_4 m1_2_4 m0_1_5 m0_2_5 m1_2_5 

penalty = 2 * gaps + mis

// binarySearch min penalty 0 20

penalty = 4

// step 0 

m0_1_0 == !g0_0 && !g1_0 && !( (s0:0 == s1:0) && (s0:1 == s1:1) )
m0_2_0 == !g0_0 && !g2_0 && !( (s0:0 == s2:0) && (s0:1 == s2:1) )
m1_2_0 == !g1_0 && !g2_0 && !( (s1:0 == s2:0) && (s1:1 == s2:1) )

s0 >> 2 = n0_0 
g0_0 ? s0 : n0_0 = s0_0

s1 >> 2 = n1_0 
g1_0 ? s1 : n1_0 = s1_0

s2 >> 2 = n2_0 
g2_0 ? s2 : n2_0 = s2_0

// step 1 

m0_1_1 == !g0_1 && !g1_1 && !( (s0_0:0 == s1_0:0) && (s0_0:1 == s1_0:1) )
m0_2_1 == !g0_1 && !g2_1 && !( (s0_0:0 == s2_0:0) && (s0_0:1 == s2_0:1) )
m1_2_1 == !g1_1 && !g2_1 && !( (s1_0:0 == s2_0:0) && (s1_0:1 == s2_0:1) )

s0_0 >> 2 = n0_1 
g0_1 ? s0_0 : n0_1 = s0_1

s1_0 >> 2 = n1_1 
g1_1 ? s1_0 : n1_1 = s1_1

s2_0 >> 2 = n2_1 
g2_1 ? s2_0 : n2_1 = s2_1

// step 2 

m0_1_2 == !g0_2 && !g1_2 && !( (s0_1:0 == s1_1:0) && (s0_1:1 == s1_1:1) )
m0_2_2 == !g0_2 && !g2_2 && !( (s0_1:0 == s2_1:0) && (s0_1:1 == s2_1:1) )
m1_2_2 == !g1_2 && !g2_2 && !( (s1_1:0 == s2_1:0) && (s1_1:1 == s2_1:1) )

s0_1 >> 2 = n0_2 
g0_2 ? s0_1 : n0_2 = s0_2

s1_1 >> 2 = n1_2 
g1_2 ? s1_1 : n1_2 = s1_2

s2_1 >> 2 = n2_2 
g2_2 ? s2_1 : n2_2 = s2_2

// step 3 

m0_1_3 == !g0_3 && !g1_3 && !( (s0_2:0 == s1_2:0) && (s0_2:1 == s1_2:1) )
m0_2_3 == !g0_3 && !g2_3 && !( (s0_2:0 == s2_2:0) && (s0_2:1 == s2_2:1) )
m1_2_3 == !g1_3 && !g2_3 && !( (s1_2:0 == s2_2:0) && (s1_2:1 == s2_2:1) )

s0_2 >> 2 = n0_3 
g0_3 ? s0_2 : n0_3 = s0_3

s1_2 >> 2 = n1_3 
g1_3 ? s1_2 : n1_3 = s1_3

s2_2 >> 2 = n2_3 
g2_3 ? s2_2 : n2_3 = s2_3

// step 4 

m0_1_4 == !g0_4 && !g1_4 && !( (s0_3:0 == s1_3:0) && (s0_3:1 == s1_3:1) )
m0_2_4 == !g0_4 && !g2_4 && !( (s0_3:0 == s2_3:0) && (s0_3:1 == s2_3:1) )
m1_2_4 == !g1_4 && !g2_4 && !( (s1_3:0 == s2_3:0) && (s1_3:1 == s2_3:1) )

s0_3 >> 2 = n0_4 
g0_4 ? s0_3 : n0_4 = s0_4

s1_3 >> 2 = n1_4 
g1_4 ? s1_3 : n1_4 = s1_4

s2_3 >> 2 = n2_4 
g2_4 ? s2_3 : n2_4 = s2_4

// step 5 

m0_1_5 == !g0_5 && !g1_5 && !( (s0_4:0 == s1_4:0) && (s0_4:1 == s1_4:1) )
m0_2_5 == !g0_5 && !g2_5 && !( (s0_4:0 == s2_4:0) && (s0_4:1 == s2_4:1) )
m1_2_5 == !g1_5 && !g2_5 && !( (s1_4:0 == s2_4:0) && (s1_4:1 == s2_4:1) )
```
                    

                        
### longest common subsequence 
```text
// longest common subsequence 

size + 21 0 

// string 0: c a b b c a d
// string 1: b e c e a f d

// a: 1
// b: 2
// c: 3
// d: 4
// e: 5
// f: 6

k >= 0; r >= 0; // r - result subsequence 
binarySearch max k 0 7 

//str: 0, i: 0, letter: c, value: 3 
n_0_0 = 0 <<* 3; 
n_0_0:0 == 3:0; n_0_0:1 == 3:1; n_0_0:2 == 3:2; 
b_0_0 ? n_0_0 : 0 = v_0_0

//str: 0, i: 1, letter: a, value: 1 
n_0_1 = v_0_0 <<* 3; 
n_0_1:0 == 1:0; n_0_1:1 == 1:1; n_0_1:2 == 1:2; 
b_0_1 ? n_0_1 : v_0_0 = v_0_1

//str: 0, i: 2, letter: b, value: 2 
n_0_2 = v_0_1 <<* 3; 
n_0_2:0 == 2:0; n_0_2:1 == 2:1; n_0_2:2 == 2:2; 
b_0_2 ? n_0_2 : v_0_1 = v_0_2

//str: 0, i: 3, letter: b, value: 2 
n_0_3 = v_0_2 <<* 3; 
n_0_3:0 == 2:0; n_0_3:1 == 2:1; n_0_3:2 == 2:2; 
b_0_3 ? n_0_3 : v_0_2 = v_0_3

//str: 0, i: 4, letter: c, value: 3 
n_0_4 = v_0_3 <<* 3; 
n_0_4:0 == 3:0; n_0_4:1 == 3:1; n_0_4:2 == 3:2; 
b_0_4 ? n_0_4 : v_0_3 = v_0_4

//str: 0, i: 5, letter: a, value: 1 
n_0_5 = v_0_4 <<* 3; 
n_0_5:0 == 1:0; n_0_5:1 == 1:1; n_0_5:2 == 1:2; 
b_0_5 ? n_0_5 : v_0_4 = v_0_5

//str: 0, i: 6, letter: d, value: 4 
n_0_6 = v_0_5 <<* 3; 
n_0_6:0 == 4:0; n_0_6:1 == 4:1; n_0_6:2 == 4:2; 
b_0_6 ? n_0_6 : v_0_5 = v_0_6

k += b_0_0 b_0_1 b_0_2 b_0_3 b_0_4 b_0_5 b_0_6 
v_0_6 = r 


//str: 1, i: 0, letter: b, value: 2 
n_1_0 = 0 <<* 3; 
n_1_0:0 == 2:0; n_1_0:1 == 2:1; n_1_0:2 == 2:2; 
b_1_0 ? n_1_0 : 0 = v_1_0

//str: 1, i: 1, letter: e, value: 5 
n_1_1 = v_1_0 <<* 3; 
n_1_1:0 == 5:0; n_1_1:1 == 5:1; n_1_1:2 == 5:2; 
b_1_1 ? n_1_1 : v_1_0 = v_1_1

//str: 1, i: 2, letter: c, value: 3 
n_1_2 = v_1_1 <<* 3; 
n_1_2:0 == 3:0; n_1_2:1 == 3:1; n_1_2:2 == 3:2; 
b_1_2 ? n_1_2 : v_1_1 = v_1_2

//str: 1, i: 3, letter: e, value: 5 
n_1_3 = v_1_2 <<* 3; 
n_1_3:0 == 5:0; n_1_3:1 == 5:1; n_1_3:2 == 5:2; 
b_1_3 ? n_1_3 : v_1_2 = v_1_3

//str: 1, i: 4, letter: a, value: 1 
n_1_4 = v_1_3 <<* 3; 
n_1_4:0 == 1:0; n_1_4:1 == 1:1; n_1_4:2 == 1:2; 
b_1_4 ? n_1_4 : v_1_3 = v_1_4

//str: 1, i: 5, letter: f, value: 6 
n_1_5 = v_1_4 <<* 3; 
n_1_5:0 == 6:0; n_1_5:1 == 6:1; n_1_5:2 == 6:2; 
b_1_5 ? n_1_5 : v_1_4 = v_1_5

//str: 1, i: 6, letter: d, value: 4 
n_1_6 = v_1_5 <<* 3; 
n_1_6:0 == 4:0; n_1_6:1 == 4:1; n_1_6:2 == 4:2; 
b_1_6 ? n_1_6 : v_1_5 = v_1_6

k += b_1_0 b_1_1 b_1_2 b_1_3 b_1_4 b_1_5 b_1_6 
v_1_6 = r          
```

### shortest common supersequence
```text
// shortest common supersequence

size + 15 0 

// string 0: C A T T C A
// string 1: T T C G A

// A: 0
// C: 1
// G: 2
// T: 3

s0 = 1268 // string 0 
s1 = 984 // string 1 

k >= 0; 
//binarySearch min k 6 8 
k = 7; 

k += k0 k1 k2 k3 k4 k5 k6 k7

//result letter 0 
r0 ?= 0 1 2 3; 

n0_0 = 0 <<* 2; n0_0:0 == r0:0; n0_0:1 == r0:1; 
b0_0 ? n0_0 : 0 = v0_0

n1_0 = 0 <<* 2; n1_0:0 == r0:0; n1_0:1 == r0:1; 
b1_0 ? n1_0 : 0 = v1_0

b0_0 || b1_0 == k0

//result letter 1 
r1 ?= 0 1 2 3; 

n0_1 = v0_0 <<* 2; n0_1:0 == r1:0; n0_1:1 == r1:1; 
b0_1 ? n0_1 : v0_0 = v0_1

n1_1 = v1_0 <<* 2; n1_1:0 == r1:0; n1_1:1 == r1:1; 
b1_1 ? n1_1 : v1_0 = v1_1

b0_1 || b1_1 == k1

//result letter 2 
r2 ?= 0 1 2 3; 

n0_2 = v0_1 <<* 2; n0_2:0 == r2:0; n0_2:1 == r2:1; 
b0_2 ? n0_2 : v0_1 = v0_2

n1_2 = v1_1 <<* 2; n1_2:0 == r2:0; n1_2:1 == r2:1; 
b1_2 ? n1_2 : v1_1 = v1_2

b0_2 || b1_2 == k2

//result letter 3 
r3 ?= 0 1 2 3; 

n0_3 = v0_2 <<* 2; n0_3:0 == r3:0; n0_3:1 == r3:1; 
b0_3 ? n0_3 : v0_2 = v0_3

n1_3 = v1_2 <<* 2; n1_3:0 == r3:0; n1_3:1 == r3:1; 
b1_3 ? n1_3 : v1_2 = v1_3

b0_3 || b1_3 == k3

//result letter 4 
r4 ?= 0 1 2 3; 

n0_4 = v0_3 <<* 2; n0_4:0 == r4:0; n0_4:1 == r4:1; 
b0_4 ? n0_4 : v0_3 = v0_4

n1_4 = v1_3 <<* 2; n1_4:0 == r4:0; n1_4:1 == r4:1; 
b1_4 ? n1_4 : v1_3 = v1_4

b0_4 || b1_4 == k4

//result letter 5 
r5 ?= 0 1 2 3; 

n0_5 = v0_4 <<* 2; n0_5:0 == r5:0; n0_5:1 == r5:1; 
b0_5 ? n0_5 : v0_4 = v0_5

n1_5 = v1_4 <<* 2; n1_5:0 == r5:0; n1_5:1 == r5:1; 
b1_5 ? n1_5 : v1_4 = v1_5

b0_5 || b1_5 == k5

//result letter 6 
r6 ?= 0 1 2 3; 

n0_6 = v0_5 <<* 2; n0_6:0 == r6:0; n0_6:1 == r6:1; 
b0_6 ? n0_6 : v0_5 = v0_6

n1_6 = v1_5 <<* 2; n1_6:0 == r6:0; n1_6:1 == r6:1; 
b1_6 ? n1_6 : v1_5 = v1_6

b0_6 || b1_6 == k6

//result letter 7 
r7 ?= 0 1 2 3; 

n0_7 = v0_6 <<* 2; n0_7:0 == r7:0; n0_7:1 == r7:1; 
b0_7 ? n0_7 : v0_6 = v0_7

n1_7 = v1_6 <<* 2; n1_7:0 == r7:0; n1_7:1 == r7:1; 
b1_7 ? n1_7 : v1_6 = v1_7

b0_7 || b1_7 == k7

v0_7 = s0
v1_7 = s1           
```                    


### Travelling Salesman
```text
//Travelling Salesman

//edges and weights:

// v1 - v2 (1)
// v1 - v3 (2)
// v1 - v4 (3)
// v2 - v3 (3)
// v2 - v5 (2)
// v3 - v4 (3)
// v4 - v5 (1)
// v1 - v6 (3)
// v2 - v6 (2)
// v3 - v6 (3)
// v4 - v6 (4)
// v5 - v6 (1)

e12 && e21 == false
e13 && e31 == false
e14 && e41 == false
e23 && e32 == false
e25 && e52 == false
e34 && e43 == false
e45 && e54 == false
e16 && e61 == false
e26 && e62 == false
e36 && e63 == false
e46 && e64 == false
e56 && e65 == false

r = 1 ?* e12  + 1 ?* e21  + 2 ?* e13  + 2 ?* e31  + 3 ?* e14  + 3 ?* e41  + 3 ?* e23  + 3 ?* e32  + 2 ?* e25  + 2 ?* e52  + 3 ?* e34  + 3 ?* e43  + 1 ?* e45  + 1 ?* e54  + 3 ?* e16  + 3 ?* e61  + 2 ?* e26  + 2 ?* e62  + 3 ?* e36  + 3 ?* e63  + 4 ?* e46  + 4 ?* e64  + 1 ?* e56  + 1 ?* e65 

size 5 0
binarySearch min r 0 20
//r < 20


v1Index = 6
v1Prev = 5
v1Next = 1 

v2Index >= 0 
v2Prev = v2Index - 1 
v2Next = v2Index + 1 

v3Index >= 0 
v3Prev = v3Index - 1 
v3Next = v3Index + 1 

v4Index >= 0 
v4Prev = v4Index - 1 
v4Next = v4Index + 1 

v5Index >= 0 
v5Prev = v5Index - 1 
v5Next = v5Index + 1 

v6Index >= 0 
v6Prev = v6Index - 1 
v6Next = v6Index + 1 

//v1
e12 ? v1Next = v2Index 
e21 ? v1Prev = v2Index 
e13 ? v1Next = v3Index 
e31 ? v1Prev = v3Index 
e14 ? v1Next = v4Index 
e41 ? v1Prev = v4Index 
e16 ? v1Next = v6Index 
e61 ? v1Prev = v6Index 
1 += e12 e13 e14 e16
1 += e21 e31 e41 e61

//v2
e21 ? v2Next = v1Index 
e12 ? v2Prev = 0 
e23 ? v2Next = v3Index 
e32 ? v2Prev = v3Index 
e25 ? v2Next = v5Index 
e52 ? v2Prev = v5Index 
e26 ? v2Next = v6Index 
e62 ? v2Prev = v6Index 
1 += e21 e23 e25 e26
1 += e12 e32 e52 e62

//v3
e31 ? v3Next = v1Index 
e13 ? v3Prev = 0 
e32 ? v3Next = v2Index 
e23 ? v3Prev = v2Index 
e34 ? v3Next = v4Index 
e43 ? v3Prev = v4Index 
e36 ? v3Next = v6Index 
e63 ? v3Prev = v6Index 
1 += e31 e32 e34 e36
1 += e13 e23 e43 e63

//v4
e41 ? v4Next = v1Index 
e14 ? v4Prev = 0 
e43 ? v4Next = v3Index 
e34 ? v4Prev = v3Index 
e45 ? v4Next = v5Index 
e54 ? v4Prev = v5Index 
e46 ? v4Next = v6Index 
e64 ? v4Prev = v6Index 
1 += e41 e43 e45 e46
1 += e14 e34 e54 e64

//v5
e52 ? v5Next = v2Index 
e25 ? v5Prev = v2Index 
e54 ? v5Next = v4Index 
e45 ? v5Prev = v4Index 
e56 ? v5Next = v6Index 
e65 ? v5Prev = v6Index 
1 += e52 e54 e56
1 += e25 e45 e65

//v6
e61 ? v6Next = v1Index 
e16 ? v6Prev = 0 
e62 ? v6Next = v2Index 
e26 ? v6Prev = v2Index 
e63 ? v6Next = v3Index 
e36 ? v6Prev = v3Index 
e64 ? v6Next = v4Index 
e46 ? v6Prev = v4Index 
e65 ? v6Next = v5Index 
e56 ? v6Prev = v5Index 
1 += e61 e62 e63 e64 e65
1 += e16 e26 e36 e46 e56

```
                    


### The 3n+1 problem
```text
// The 3n+1 problem

// 5 steps

start:0 == true // start is odd 

n1 = (start + (start << 1) + 1) >> 1



v2 = (n1 + (n1 << 1) + 1) >> 1
n1:0 ? v2 : (n1 >> 1) = n2

v3 = (n2 + (n2 << 1) + 1) >> 1
n2:0 ? v3 : (n2 >> 1) = n3

v4 = (n3 + (n3 << 1) + 1) >> 1
n3:0 ? v4 : (n3 >> 1) = n4

v5 = (n4 + (n4 << 1) + 1) >> 1
n4:0 ? v5 : (n4 >> 1) = n5

n5 > 4

size 10
```                    


### Sudoku 
```text
// Sudoku 

/*

Puzzle: 

5 3 _  _ 7 _  _ _ _  
6 _ _  1 9 5  _ _ _  
_ 9 8  _ _ _  _ 6 _  

8 _ _  _ 6 _  _ _ 3  
4 _ _  8 _ 3  _ _ 1  
7 _ _  _ 2 _  _ _ 6  

_ 6 _  _ _ _  2 8 _  
_ _ _  4 1 9  _ _ 5  
_ _ _  _ 8 _  _ 7 9  

*/

// Values are powers of two

v1 = 0b0000000001
v2 = 0b0000000010
v3 = 0b0000000100
v4 = 0b0000001000
v5 = 0b0000010000
v6 = 0b0000100000
v7 = 0b0001000000
v8 = 0b0010000000
v9 = 0b0100000000

size + 9 0

// Set values

// Row 1 

x00  = v5
x01  = v3
x02 ?=    v1 v2 v4
x03 ?=    v2 v6
x04  = v7
x05 ?=    v2 v4 v6 v8
x06 ?=    v1 v4 v8 v9
x07 ?=    v1 v2 v4 v9
x08 ?=    v2 v4 v8

// Row 2 

x10  = v6
x11 ?=    v2 v4 v7
x12 ?=    v2 v4 v7
x13  = v1
x14  = v9
x15  = v5
x16 ?=    v3 v4 v7 v8
x17 ?=    v2 v3 v4
x18 ?=    v2 v4 v7 v8

// Row 3 

x20 ?=    v1 v2
x21  = v9
x22  = v8
x23 ?=    v2 v3
x24 ?=    v3 v4
x25 ?=    v2 v4
x26 ?=    v1 v3 v4 v5 v7
x27  = v6
x28 ?=    v2 v4 v7

// Row 4 

x30  = v8
x31 ?=    v1 v2 v5
x32 ?=    v1 v2 v5 v9
x33 ?=    v5 v7 v9
x34  = v6
x35 ?=    v1 v4 v7
x36 ?=    v4 v5 v7 v9
x37 ?=    v2 v4 v5 v9
x38  = v3

// Row 5 

x40  = v4
x41 ?=    v2 v5
x42 ?=    v2 v5 v6 v9
x43  = v8
x44 ?=    v5
x45  = v3
x46 ?=    v5 v7 v9
x47 ?=    v2 v5 v9
x48  = v1

// Row 6 

x50  = v7
x51 ?=    v1 v5
x52 ?=    v1 v3 v5 v9
x53 ?=    v5 v9
x54  = v2
x55 ?=    v1 v4
x56 ?=    v4 v5 v8 v9
x57 ?=    v4 v5 v9
x58  = v6

// Row 7 

x60 ?=    v1 v3 v9
x61  = v6
x62 ?=    v1 v3 v4 v5 v7 v9
x63 ?=    v3 v5 v7
x64 ?=    v3 v5
x65 ?=    v7
x66  = v2
x67  = v8
x68 ?=    v4

// Row 8 

x70 ?=    v2 v3
x71 ?=    v2 v7 v8
x72 ?=    v2 v3 v7
x73  = v4
x74  = v1
x75  = v9
x76 ?=    v3 v6
x77 ?=    v3
x78  = v5

// Row 9 

x80 ?=    v1 v2 v3
x81 ?=    v1 v2 v4 v5
x82 ?=    v1 v2 v3 v4 v5
x83 ?=    v2 v3 v5 v6
x84  = v8
x85 ?=    v2 v6
x86 ?=    v1 v3 v4 v6
x87  = v7
x88  = v9

// Rows Constraints

0b110101011 = x02 | x03 | x05 | x06 | x07 | x08 
0b011001110 = x11 | x12 | x16 | x17 | x18 
0b001011111 = x20 | x23 | x24 | x25 | x26 | x28 
0b101011011 = x31 | x32 | x33 | x35 | x36 | x37 
0b101110010 = x41 | x42 | x44 | x46 | x47 
0b110011101 = x51 | x52 | x53 | x55 | x56 | x57 
0b101011101 = x60 | x62 | x63 | x64 | x65 | x68 
0b011100110 = x70 | x71 | x72 | x76 | x77 
0b000111111 = x80 | x81 | x82 | x83 | x85 | x86 

// Columns Constraints 

0b100000111 = x20 | x60 | x70 | x80 
0b011011011 = x11 | x31 | x41 | x51 | x71 | x81 
0b101111111 = x02 | x12 | x32 | x42 | x52 | x62 | x72 | x82 
0b101110110 = x03 | x23 | x33 | x53 | x63 | x83 
0b000011100 = x24 | x44 | x64 
0b011101011 = x05 | x25 | x35 | x55 | x65 | x85 
0b111111101 = x06 | x16 | x26 | x36 | x46 | x56 | x76 | x86 
0b100011111 = x07 | x17 | x37 | x47 | x57 | x77 
0b011001010 = x08 | x18 | x28 | x68 

// Squares Constraints 

0b001001011 = x02 | x11 | x12 | x20 
0b010101110 = x03 | x05 | x23 | x24 | x25 
0b111011111 = x06 | x07 | x08 | x16 | x17 | x18 | x26 | x28 
0b100110111 = x31 | x32 | x41 | x42 | x51 | x52 
0b101011001 = x33 | x35 | x44 | x53 | x55 
0b111011010 = x36 | x37 | x46 | x47 | x56 | x57 
0b111011111 = x60 | x62 | x70 | x71 | x72 | x80 | x81 | x82 
0b001110110 = x63 | x64 | x65 | x83 | x85 
0b000101101 = x68 | x76 | x77 | x86 
```

                    


### Eight queens puzzle 
```text
// Eight queens puzzle 

size + 4 0 

// Rows Constraints

1 += x00 x01 x02 x03 x04 x05 x06 x07 
1 += x10 x11 x12 x13 x14 x15 x16 x17 
1 += x20 x21 x22 x23 x24 x25 x26 x27 
1 += x30 x31 x32 x33 x34 x35 x36 x37 
1 += x40 x41 x42 x43 x44 x45 x46 x47 
1 += x50 x51 x52 x53 x54 x55 x56 x57 
1 += x60 x61 x62 x63 x64 x65 x66 x67 
1 += x70 x71 x72 x73 x74 x75 x76 x77 

// Columns Constraints 

1 += x00 x10 x20 x30 x40 x50 x60 x70 
1 += x01 x11 x21 x31 x41 x51 x61 x71 
1 += x02 x12 x22 x32 x42 x52 x62 x72 
1 += x03 x13 x23 x33 x43 x53 x63 x73 
1 += x04 x14 x24 x34 x44 x54 x64 x74 
1 += x05 x15 x25 x35 x45 x55 x65 x75 
1 += x06 x16 x26 x36 x46 x56 x66 x76 
1 += x07 x17 x27 x37 x47 x57 x67 x77 

// Diagonal Constraints, Top-left to Bottom-right 

v01 <= 1; v01 += x60 x71 
v02 <= 1; v02 += x50 x61 x72 
v03 <= 1; v03 += x40 x51 x62 x73 
v04 <= 1; v04 += x30 x41 x52 x63 x74 
v05 <= 1; v05 += x20 x31 x42 x53 x64 x75 
v06 <= 1; v06 += x10 x21 x32 x43 x54 x65 x76 
v07 <= 1; v07 += x00 x11 x22 x33 x44 x55 x66 x77 
v08 <= 1; v08 += x01 x12 x23 x34 x45 x56 x67 
v09 <= 1; v09 += x02 x13 x24 x35 x46 x57 
v10 <= 1; v10 += x03 x14 x25 x36 x47 
v11 <= 1; v11 += x04 x15 x26 x37 
v12 <= 1; v12 += x05 x16 x27 
v13 <= 1; v13 += x06 x17 

// Diagonal Constraints, Top-right to Bottom-left 

v14 <= 1; v14 += x67 x76 
v15 <= 1; v15 += x57 x66 x75 
v16 <= 1; v16 += x47 x56 x65 x74 
v17 <= 1; v17 += x37 x46 x55 x64 x73 
v18 <= 1; v18 += x27 x36 x45 x54 x63 x72 
v19 <= 1; v19 += x17 x26 x35 x44 x53 x62 x71 
v20 <= 1; v20 += x07 x16 x25 x34 x43 x52 x61 x70 
v21 <= 1; v21 += x06 x15 x24 x33 x42 x51 x60 
v22 <= 1; v22 += x05 x14 x23 x32 x41 x50 
v23 <= 1; v23 += x04 x13 x22 x31 x40 
v24 <= 1; v24 += x03 x12 x21 x30 
v25 <= 1; v25 += x02 x11 x20 
v26 <= 1; v26 += x01 x10 
```
                    
## Cryptography, Lattices & Coding Theory

### Shortest Vector

```text

// Shortest Vector Problem (SVP) in a Lattice

// Basis vectors:
// v0 = [  1, 1, 1 ] 
// v1 = [ -1, 0, 2 ] 
// v2 = [  3, 5, 6 ] 

// Find coefficients k0 k1 k2 such that:
// k0 * v0 + k1 * v1 + k2 * v2 = vr
// Goal: minimize ||vr||  (squared Euclidean norm)

k0Abs >= 0;
k1Abs >= 0;
k2Abs >= 0;

t0_0_t = k0Abs * 1; t0_0 = k0Pos ? t0_0_t : (0 - t0_0_t)
t0_1_t = k1Abs * 1; t0_1 = k1Pos ? t0_1_t : (0 - t0_1_t)
t0_2_t = k2Abs * 3; t0_2 = k2Pos ? t0_2_t : (0 - t0_2_t)

t1_0_t = k0Abs * 1; t1_0 = k0Pos ? t1_0_t : (0 - t1_0_t) 
t1_1_t = k1Abs * 0; t1_1 = k1Pos ? t1_1_t : (0 - t1_1_t)
t1_2_t = k2Abs * 5; t1_2 = k2Pos ? t1_2_t : (0 - t1_2_t)

t2_0_t = k0Abs * 1; t2_0 = k0Pos ? t2_0_t : (0 - t2_0_t)
t2_1_t = k1Abs * 2; t2_1 = k1Pos ? t2_1_t : (0 - t2_1_t)
t2_2_t = k2Abs * 6; t2_2 = k2Pos ? t2_2_t : (0 - t2_2_t)

vr_0_t = t0_0 - t0_1 + t0_2
vr_1_t = t1_0 + t1_1 + t1_2
vr_2_t = t2_0 + t2_1 + t2_2 

vr_0 = (vr_0_t < 0) ? (0 - vr_0_t) : vr_0_t;
vr_1 = (vr_1_t < 0) ? (0 - vr_1_t) : vr_1_t;
vr_2 = (vr_2_t < 0) ? (0 - vr_2_t) : vr_2_t;

r = (vr_0 ** 2) + (vr_1 ** 2) + (vr_2 ** 2) 

binarySearch min r 1 20

size 8 0

format "length ** 2 = ${r}"
format "abs(k0) = ${k0Abs}; isPositive(k0) == ${k0Pos}"
format "abs(k1) = ${k1Abs}; isPositive(k1) == ${k1Pos}"
format "abs(k2) = ${k2Abs}; isPositive(k2) == ${k2Pos}"

```
                    
### Closest Vector
```text
// Closest Vector Problem (CVP) in a Lattice 

// Basis vectors:
// v0 = [  1, 1, 1 ] 
// v1 = [ -1, 0, 2 ] 
// v2 = [  3, 5, 6 ] 

// external vector (ve) = [ 1, 2, 3 ]

// Find coefficients k0 k1 k2 such that:
// k0 * v0 + k1 * v1 + k2 * v2 = vr
// Goal: minimize ||vr||  (squared Euclidean norm)

k0Abs >= 0;
k1Abs >= 0;
k2Abs >= 0;

t0_0_t = k0Abs * 1; t0_0 = k0Pos ? t0_0_t : (0 - t0_0_t)
t0_1_t = k1Abs * 1; t0_1 = k1Pos ? t0_1_t : (0 - t0_1_t)
t0_2_t = k2Abs * 3; t0_2 = k2Pos ? t0_2_t : (0 - t0_2_t)

t1_0_t = k0Abs * 1; t1_0 = k0Pos ? t1_0_t : (0 - t1_0_t) 
t1_1_t = k1Abs * 0; t1_1 = k1Pos ? t1_1_t : (0 - t1_1_t)
t1_2_t = k2Abs * 5; t1_2 = k2Pos ? t1_2_t : (0 - t1_2_t)

t2_0_t = k0Abs * 1; t2_0 = k0Pos ? t2_0_t : (0 - t2_0_t)
t2_1_t = k1Abs * 2; t2_1 = k1Pos ? t2_1_t : (0 - t2_1_t)
t2_2_t = k2Abs * 6; t2_2 = k2Pos ? t2_2_t : (0 - t2_2_t)

vr_0_t = 1 - (t0_0 - t0_1 + t0_2)
vr_1_t = 2 - (t1_0 + t1_1 + t1_2)
vr_2_t = 3 - (t2_0 + t2_1 + t2_2)

vr_0 = (vr_0_t < 0) ? (0 - vr_0_t) : vr_0_t;
vr_1 = (vr_1_t < 0) ? (0 - vr_1_t) : vr_1_t;
vr_2 = (vr_2_t < 0) ? (0 - vr_2_t) : vr_2_t;

r = (vr_0 ** 2) + (vr_1 ** 2) + (vr_2 ** 2) 

binarySearch min r 1 20

size 8 0

format "length ** 2 = ${r}"
format "abs(k0) = ${k0Abs}; isPositive(k0) == ${k0Pos}"
format "abs(k1) = ${k1Abs}; isPositive(k1) == ${k1Pos}"
format "abs(k2) = ${k2Abs}; isPositive(k2) == ${k2Pos}"
```
                    
### hash
```text
// hash function:

/* 
    function f(arr) {
        let h = 5381; 
        let mod = 2 ** 32;

        for (let symbol of arr) {
            h = (h * 33 + symbol) % mod;
        }

        return h
    }
*/ 

// hash function input: 5 letters, uppercase
// hash function output: 222103545

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
                    



### Addition chain
```text
// Addition chain

// Get 43 with 7 additions 

size + 6 0

n = 43

// 1
1 + 1 = 2

// 2
t2_1 ?= 1 2
t2_2 ?= 1 2

t2_1 + t2_2 = r2

// 3
t3_1 ?= 1 2 r2
t3_2 ?= 1 2 r2

t3_1 + t3_2 = r3

// 4
t4_1 ?= 1 2 r2 r3 
t4_2 ?= 1 2 r2 r3 

t4_1 + t4_2 = r4

// 5
t5_1 ?= 1 2 r2 r3 r4 
t5_2 ?= 1 2 r2 r3 r4 

t5_1 + t5_2 = r5

// 6
t6_1 ?= 1 2 r2 r3 r4 r5 
t6_2 ?= 1 2 r2 r3 r4 r5 

t6_1 + t6_2 = r6

// 7
t7_1 ?= 1 2 r2 r3 r4 r5 r6 
t7_2 ?= 1 2 r2 r3 r4 r5 r6 

t7_1 + t7_2 = n
```
                    


### Constant Multiplication
```text
// Constant Multiplication

// Searches for a solution using only additions.
// Finds a way to multiply by 43 using exactly 3 additions:

size + 6 0

n = 43

// 1

1 << x1_1 = s1_1
1 << x1_2 = s1_2

s1_1 + s1_2 = r1

// 2

t2_1 ?= 1 r1
t2_2 ?= 1 r1

t2_1 << x2_1 = s2_1
t2_2 << x2_2 = s2_2

s2_1 + s2_2 = r2

// 3

t3_1 ?= 1 r1 r2
t3_2 ?= 1 r1 r2

t3_1 << x3_1 = s3_1
t3_2 << x3_2 = s3_2

s3_1 + s3_2 = n

```
                    


### LWE 
```text
// LWE 

//  27x1 + 13x2 + 13x3 + e1 = 30 (mod 47)
//   1x1 + 46x2 + 23x3 + e2 = 28 (mod 47)
//  16x1 + 13x2 + 30x3 + e3 = 25 (mod 47)
//  18x1 + 16x2 + 19x3 + e4 = 34 (mod 47)
//  22x1 +  0x2 +  3x3 + e5 = 32 (mod 47)

// min: e1 ** 2  +  e2 ** 2  +  e3 ** 2  +  e4 ** 2  +  e5 ** 2 

size 14 0

m = 47

x1 >= 0; x1 < 16;
x2 >= 0; x2 < 16;
x3 >= 0; x3 < 16;

((27 * x1) + (13 * x2) + (13 * x3) + e1) % m = 30
(( 1 * x1) + (46 * x2) + (23 * x3) + e2) % m = 28
((16 * x1) + (13 * x2) + (30 * x3) + e3) % m = 25
((18 * x1) + (16 * x2) + (19 * x3) + e4) % m = 34
((22 * x1)             + ( 3 * x3) + e5) % m = 32

e1Abs = (e1 < 0) ? (0 - e1) : e1;
e2Abs = (e2 < 0) ? (0 - e2) : e2;
e3Abs = (e3 < 0) ? (0 - e3) : e3;
e4Abs = (e4 < 0) ? (0 - e4) : e4;
e5Abs = (e5 < 0) ? (0 - e5) : e5;

e = (e1Abs ** 2) + (e2Abs ** 2) + (e3Abs ** 2) + (e4Abs ** 2) + (e5Abs ** 2) 

binarySearch min e 0 20
```                 

### Binary linear code
```text
// Binary linear code

/*
    G: [
        1 1 0 1 0 0 0 0 0 1 1 1
        1 1 0 0 0 1 0 1 0 0 1 0
        0 0 1 0 1 1 0 1 1 0 0 1
        0 1 0 0 0 1 1 0 1 0 1 1
    ]

    b:  0 0 1 1 1 1 0 1 1 1 1 0

    error weight: 2

    find the message
*/

2 += e1 e2 e3 e4 e5 e6 e7 e8 e9 e10 e11 e12

x1 == !x2               ==  !e1 == false
x1 == !x2        == !x4 ==  !e2 == false
              x3        ==  !e3 == true
x1                      ==  !e4 == true
              x3        ==  !e5 == true
       x2 == !x3 == !x4 ==  !e6 == true
                     x4 ==  !e7 == false
       x2 == !x3        ==  !e8 == true
              x3 == !x4 ==  !e9 == true
x1                      == !e10 == true
x1 == !x2        == !x4 == !e11 == true
x1        == !x3 == !x4 == !e12 == false


format "message: ${x1} ${x2} ${x3} ${x4}"
```

## Number Theory
                 
### Discrete Square Roots
```text
//Discrete Square Roots

//x * x = 11 (mod 35); result: x equals 9, 16, 19 or 26;

x < m

m = 35
v = 11

x * x % m = v

size 11 0
```             
### Modular Multiplicative Inverse    
```text
// Modular Multiplicative Inverse    

// a * r = 1 (mod m)   

r < m

a = 17
m = 41

a * r % m = 1 

size 12 0
```             

### Chinese Remainder Theorem
```text
// Chinese Remainder Theorem

// x = v1 (mod m1)
// x = v2 (mod m2)
// x = v3 (mod m3)   

m1 = 5
m2 = 7
m3 = 11

v1 = 3
v2 = 4
v3 = 8

x % m1 = v1
x % m2 = v2
x % m3 = v3

x < m1 * m2 * m3

size 10 0
```                    

### Binary Exponentiation and Discrete Logarithm
```text                    
// Binary Exponentiation and Discrete Logarithm
                    
// base ** x = needle (mod m)

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

// binary exponentiation 
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
                

                    
### Elliptic Curves
```text
// Elliptic Curves

/*
    y ** 2 = x ** 3 + a * x + b
    a = 1
    b = 1


    points addition; p1 != p2; p1 + p2 = p3:    

    l = (p2_y - p1_y) / (p2_x - p1_x) (mod m)
    p3_x = l ** 2 - p1_x - p2_x (mod m)
    p3_y = l * (p1_x - p3_x) - p1_y (mod m)

    
    y ** 2 = x ** 3 + x + 1 (mod 23)

    k * basePoint = needlePoint; period = 28;    
*/

size 10

m = 23 
period = 28

base_x = 0
base_y = 1

needle_x = 11
needle_y = 20

needle_next_x = 7
needle_next_y = 12

k >= 0 
k < period

// 1 * base 
p1_x = 0
p1_y = 1

// 2 * base 
p2_x = 6
p2_y = 19

// 4 * base 
p3_x = 13
p3_y = 16

// 8 * base 
p4_x = 5
p4_y = 19

// 16 * base 
p5_x = 17
p5_y = 3

// 3 * base
pk3_x = 3
pk3_y = 13

// 0
k:0 == true
v1_x = base_x
v1_y = base_y

// 1
k:1 ? pk3_x : v1_x = v2_x
k:1 ? pk3_y : v1_y = v2_y

// 2, if ( k:2 ) { v3 = v2 + p3 } else { v3 = v2 }

l2_num_t = p3_y - v2_y 
(l2_num_t < 0) ? (l2_num_t + m) : l2_num_t = l2_num 

l2_den_t = p3_x - v2_x
(l2_den_t < 0) ? (l2_den_t + m) : l2_den_t = l2_den

l2 * l2_den % m = l2_num

t2_x = (l2 ** 2 - v2_x - p3_x + (m << 1)) % m 
t2_t = v2_x - t2_x
(t2_t < 0) ? (t2_t + m) : t2_t = t2_tt 
t2_y = (l2 * t2_tt - v2_y + m) % m

k:2 ? t2_x : v2_x = v3_x 
k:2 ? t2_y : v2_y = v3_y

// 3, if ( k:3 ) { v4 = v3 + p4 } else { v4 = v3 }

l3_num_t = p4_y - v3_y 
(l3_num_t < 0) ? (l3_num_t + m) : l3_num_t = l3_num 

l3_den_t = p4_x - v3_x
(l3_den_t < 0) ? (l3_den_t + m) : l3_den_t = l3_den

l3 * l3_den % m = l3_num

t3_x = (l3 ** 2 - v3_x - p4_x + (m << 1)) % m 
t3_t = v3_x - t3_x
(t3_t < 0) ? (t3_t + m) : t3_t = t3_tt 
t3_y = (l3 * t3_tt - v3_y + m) % m

k:3 ? t3_x : v3_x = v4_x 
k:3 ? t3_y : v3_y = v4_y

// 4, if ( k:4 ) { needle = v4 + p5 } else { needle = v3 }

l4_num_t = p5_y - v4_y 
(l4_num_t < 0) ? (l4_num_t + m) : l4_num_t = l4_num 

l4_den_t = p5_x - v4_x
(l4_den_t < 0) ? (l4_den_t + m) : l4_den_t = l4_den

l4 * l4_den % m = l4_num

t4_x = (l4 ** 2 - v4_x - p5_x + (m << 1)) % m 
t4_t = v4_x - t4_x
(t4_t < 0) ? (t4_t + m) : t4_t = t4_tt 
t4_y = (l4 * t4_tt - v4_y + m) % m

k:4 ? t4_x : v4_x = v5_x 
k:4 ? t4_y : v4_y = v5_y

// result

isOdd ? needle_x : needle_next_x = v5_x
isOdd ? needle_y : needle_next_y = v5_y

k_result = (k >> 1) <<* 1;
k_result:0 == isOdd

format "${k_result} * (${base_x}, ${base_y}) = (${needle_x}, ${needle_y})"
```                

                        
### An Even Number as the Sum of Two Prime Numbers
```text
// An Even Number as the Sum of Two Prime Numbers

// Fermat's test will be used, performing only one iteration per number (base 2). 
// One iteration is not enough, but sufficient for demonstration purposes.

// n = prime1 + prime2 

// n = 60

size + 12 0

60 = prime1 + prime2

// test prime1, base = 2

prime1:0 == true
prime1 >> 1 = prime1_half
(prime1 >> 1) << 1 = prime1_oneLess

prime1_p1 = 2 
prime1_p2 = 4 
prime1_p3 = 16 
prime1_p4 = 256 % prime1
prime1_p5 = prime1_p4 * prime1_p4 % prime1

prime1_half:0 ? prime1_p1 : 1 = prime1_v1  
prime1_half:1 ? (prime1_v1 * prime1_p2 % prime1) : prime1_v1 = prime1_v2  
prime1_half:2 ? (prime1_v2 * prime1_p3 % prime1) : prime1_v2 = prime1_v3  
prime1_half:3 ? (prime1_v3 * prime1_p4 % prime1) : prime1_v3 = prime1_v4  
prime1_half:4 ? (prime1_v4 * prime1_p5 % prime1) : prime1_v4 = prime1_v5  

prime1_b ? 1 : prime1_oneLess = prime1_v5


// test prime2, base = 2

prime2:0 == true
prime2 >> 1 = prime2_half
(prime2 >> 1) << 1 = prime2_oneLess

prime2_p1 = 2 
prime2_p2 = 4 
prime2_p3 = 16 
prime2_p4 = 256 % prime2
prime2_p5 = prime2_p4 * prime2_p4 % prime2

prime2_half:0 ? prime2_p1 : 1 = prime2_v1  
prime2_half:1 ? (prime2_v1 * prime2_p2 % prime2) : prime2_v1 = prime2_v2  
prime2_half:2 ? (prime2_v2 * prime2_p3 % prime2) : prime2_v2 = prime2_v3  
prime2_half:3 ? (prime2_v3 * prime2_p4 % prime2) : prime2_v3 = prime2_v4  
prime2_half:4 ? (prime2_v4 * prime2_p5 % prime2) : prime2_v4 = prime2_v5  

prime2_b ? 1 : prime2_oneLess = prime2_v5
```                    


### Extended Euclidean
```text
// Extended Euclidean

//a*x + b*y = GCD(a,b)

gcd >= 0

a = 70
b = 110

binarySearch max gcd 0 110

gcd * t1 = a
gcd * t2 = b

a * x = t3
b * y = t4

//t3 - t4 = gcd
t3 - t4 = t5

b1 ? t5 : (0 - t5) = gcd

size 12 0
```              

## Karp's 21 NP-Complete Problems

### 1. Satisfiability
```text

// Karp's problem 1. Satisfiability

(x1 || !x2 || x3) && (!x1 || x3 || x4 || x5) && (x3) == true

// or 

x1 || !x2 || x3 == true
!x1 || x3 || x4 || x5 == true
x3 == true

// or 

x1 || !x2 || x3
!x1 || x3 || x4 || x5
x3
```
                    


### 2. 0-1 Integer Programming
```text
// Karp's problem 2. 0-1 Integer Programming

// 40*x1 + 8*x2 + 50*x3 + 16*x4 = y
// 380*x1 + 200*x2 + 250*x3 + 800*x4 <= 1100
// maximize y 

y = 40 ?* x1 + 8 ?* x2 + 50 ?* x3 + 16 ?* x4

380 ?* x1 + 200 ?* x2 + 350 ?* x3 + 800 ?* x4 <= 1100

binarySearch max y 0 500

size 11 0
```
                    
### 3. Clique
```text

// Karp's problem 3. Clique

/* Matrix:

0 1 1 1 0 1 0
1 0 1 0 1 0 1
1 1 0 1 1 0 0 
1 0 1 0 1 1 1
0 1 1 1 0 1 1
1 0 0 1 1 0 1
0 1 0 1 1 1 0

*/

// k = 4 

4 += v1 v2 v3 v4 v5 v6 v7

//Each missing edge represents an additional constraint

v1 && v5 == false
v1 && v7 == false

v2 && v4 == false
v2 && v6 == false

v3 && v6 == false
v3 && v7 == false

size 4 0
```           


### 4. Set packing 
```text
// Karp's problem 4. Set packing 

/* Sets:

    u : {1,2,3,4,5,6,7,8}
    a : {1,2,3} 
    b : {4,5,6} 
    c : {1,4,7} 
    d : {2,5,8} 
    e : {3,6,8} 
    f : {7,8} 
    
*/

// k = 3 

3 += a b c d e f

//Each intersection of sets introduces an additional constraint.

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
                    


### 5. Vertex cover
```text
// Karp's problem 5. Vertex cover (node cover)

// V = {1,2,3,4}
// E = {(1,2), (1,3), (2,3), (2,4), (3,4)}

v1 || v2 == true  
v1 || v3 == true  
v2 || v3 == true  
v2 || v4 == true  
v3 || v4 == true 

binarySearch min k 0 4

k += v1 v2 v3 v4

size 3 0
```             


### 6. Set cover
```text
// Karp's problem 6. Set cover problem

//u = {1,2,3,4,5,6}

//a = {1,2,3}
//b = {2,3,4}
//c = {3,4,5}
//d = {4,5,6}
//e = {1,5,6}

a || e      //element 1 in [a, e]
a || b      //element 2 in [a,b]
a || b || c //element 3 in [a,b,c]
b || c || d //element 4 in [b,c,d]
c || d || e //element 5 in [c, d, e]
d || e      //element 6 in [d, e]

binarySearch min k 0 5

k += a b c d e

size 3 0
```


### 7. Feedback vertex set
```text
// Karp's problem 7. Feedback vertex set (Feedback node set)

//directed graph, edges:

//v1 -> v2
//v1 -> v4

//v2 -> v4
//v2 -> v5

//v3 -> v2
//v3 -> v4

//v4 -> v7

//v5 -> v7

//v6 -> v1
//v6 -> v2
//v6 -> v7
//v6 -> v9

//v7 -> v6

//v8 -> v6

//v9 -> v8

//if v1 == true, v1 is removed

k += v1 v2 v3 v4 v5 v6 v7 v8 v9

binarySearch min k 0 9

//The existence of v1 and v2 implies a path from v1 to v2
//if v1 == false, v1 is not removed; if v1 == true, v1 is removed

clauses {
    v1  v2  r12 
    v1  v4  r14
    v2  v4  r24
    v2  v5  r25
    v3  v2  r32
    v3  v4  r34
    v4  v7  r47
    v5  v7  r57
    v6  v1  r61
    v6  v2  r62
    v6  v7  r67
    v6  v9  r69
    v7  v6  r76
    v8  v6  r86
    v9  v8  r98
}

r11 == false
r22 == false
r33 == false
r44 == false
r55 == false
r66 == false
r77 == false
r88 == false
r99 == false

//Two paths from a to b and from b to c imply a path from a to c.
//!(rab && rbc) || rac == true
//or 
//!rab || !rbc || rac == true

clauses {
    
!r12 !r21 r11; !r13 !r31 r11; !r14 !r41 r11; !r15 !r51 r11; !r16 !r61 r11; !r17 !r71 r11; !r18 !r81 r11; !r19 !r91 r11; 
!r11 !r12 r12; !r13 !r32 r12; !r14 !r42 r12; !r15 !r52 r12; !r16 !r62 r12; !r17 !r72 r12; !r18 !r82 r12; !r19 !r92 r12; 
!r11 !r13 r13; !r12 !r23 r13; !r14 !r43 r13; !r15 !r53 r13; !r16 !r63 r13; !r17 !r73 r13; !r18 !r83 r13; !r19 !r93 r13; 
!r11 !r14 r14; !r12 !r24 r14; !r13 !r34 r14; !r15 !r54 r14; !r16 !r64 r14; !r17 !r74 r14; !r18 !r84 r14; !r19 !r94 r14; 
!r11 !r15 r15; !r12 !r25 r15; !r13 !r35 r15; !r14 !r45 r15; !r16 !r65 r15; !r17 !r75 r15; !r18 !r85 r15; !r19 !r95 r15; 
!r11 !r16 r16; !r12 !r26 r16; !r13 !r36 r16; !r14 !r46 r16; !r15 !r56 r16; !r17 !r76 r16; !r18 !r86 r16; !r19 !r96 r16; 
!r11 !r17 r17; !r12 !r27 r17; !r13 !r37 r17; !r14 !r47 r17; !r15 !r57 r17; !r16 !r67 r17; !r18 !r87 r17; !r19 !r97 r17; 
!r11 !r18 r18; !r12 !r28 r18; !r13 !r38 r18; !r14 !r48 r18; !r15 !r58 r18; !r16 !r68 r18; !r17 !r78 r18; !r19 !r98 r18; 
!r11 !r19 r19; !r12 !r29 r19; !r13 !r39 r19; !r14 !r49 r19; !r15 !r59 r19; !r16 !r69 r19; !r17 !r79 r19; !r18 !r89 r19; 
!r22 !r21 r21; !r23 !r31 r21; !r24 !r41 r21; !r25 !r51 r21; !r26 !r61 r21; !r27 !r71 r21; !r28 !r81 r21; !r29 !r91 r21; 
!r21 !r12 r22; !r23 !r32 r22; !r24 !r42 r22; !r25 !r52 r22; !r26 !r62 r22; !r27 !r72 r22; !r28 !r82 r22; !r29 !r92 r22; 
!r21 !r13 r23; !r22 !r23 r23; !r24 !r43 r23; !r25 !r53 r23; !r26 !r63 r23; !r27 !r73 r23; !r28 !r83 r23; !r29 !r93 r23; 
!r21 !r14 r24; !r22 !r24 r24; !r23 !r34 r24; !r25 !r54 r24; !r26 !r64 r24; !r27 !r74 r24; !r28 !r84 r24; !r29 !r94 r24; 
!r21 !r15 r25; !r22 !r25 r25; !r23 !r35 r25; !r24 !r45 r25; !r26 !r65 r25; !r27 !r75 r25; !r28 !r85 r25; !r29 !r95 r25; 
!r21 !r16 r26; !r22 !r26 r26; !r23 !r36 r26; !r24 !r46 r26; !r25 !r56 r26; !r27 !r76 r26; !r28 !r86 r26; !r29 !r96 r26; 
!r21 !r17 r27; !r22 !r27 r27; !r23 !r37 r27; !r24 !r47 r27; !r25 !r57 r27; !r26 !r67 r27; !r28 !r87 r27; !r29 !r97 r27; 
!r21 !r18 r28; !r22 !r28 r28; !r23 !r38 r28; !r24 !r48 r28; !r25 !r58 r28; !r26 !r68 r28; !r27 !r78 r28; !r29 !r98 r28; 
!r21 !r19 r29; !r22 !r29 r29; !r23 !r39 r29; !r24 !r49 r29; !r25 !r59 r29; !r26 !r69 r29; !r27 !r79 r29; !r28 !r89 r29; 
!r32 !r21 r31; !r33 !r31 r31; !r34 !r41 r31; !r35 !r51 r31; !r36 !r61 r31; !r37 !r71 r31; !r38 !r81 r31; !r39 !r91 r31; 
!r31 !r12 r32; !r33 !r32 r32; !r34 !r42 r32; !r35 !r52 r32; !r36 !r62 r32; !r37 !r72 r32; !r38 !r82 r32; !r39 !r92 r32; 
!r31 !r13 r33; !r32 !r23 r33; !r34 !r43 r33; !r35 !r53 r33; !r36 !r63 r33; !r37 !r73 r33; !r38 !r83 r33; !r39 !r93 r33; 
!r31 !r14 r34; !r32 !r24 r34; !r33 !r34 r34; !r35 !r54 r34; !r36 !r64 r34; !r37 !r74 r34; !r38 !r84 r34; !r39 !r94 r34; 
!r31 !r15 r35; !r32 !r25 r35; !r33 !r35 r35; !r34 !r45 r35; !r36 !r65 r35; !r37 !r75 r35; !r38 !r85 r35; !r39 !r95 r35; 
!r31 !r16 r36; !r32 !r26 r36; !r33 !r36 r36; !r34 !r46 r36; !r35 !r56 r36; !r37 !r76 r36; !r38 !r86 r36; !r39 !r96 r36; 
!r31 !r17 r37; !r32 !r27 r37; !r33 !r37 r37; !r34 !r47 r37; !r35 !r57 r37; !r36 !r67 r37; !r38 !r87 r37; !r39 !r97 r37; 
!r31 !r18 r38; !r32 !r28 r38; !r33 !r38 r38; !r34 !r48 r38; !r35 !r58 r38; !r36 !r68 r38; !r37 !r78 r38; !r39 !r98 r38; 
!r31 !r19 r39; !r32 !r29 r39; !r33 !r39 r39; !r34 !r49 r39; !r35 !r59 r39; !r36 !r69 r39; !r37 !r79 r39; !r38 !r89 r39; 
!r42 !r21 r41; !r43 !r31 r41; !r44 !r41 r41; !r45 !r51 r41; !r46 !r61 r41; !r47 !r71 r41; !r48 !r81 r41; !r49 !r91 r41; 
!r41 !r12 r42; !r43 !r32 r42; !r44 !r42 r42; !r45 !r52 r42; !r46 !r62 r42; !r47 !r72 r42; !r48 !r82 r42; !r49 !r92 r42; 
!r41 !r13 r43; !r42 !r23 r43; !r44 !r43 r43; !r45 !r53 r43; !r46 !r63 r43; !r47 !r73 r43; !r48 !r83 r43; !r49 !r93 r43; 
!r41 !r14 r44; !r42 !r24 r44; !r43 !r34 r44; !r45 !r54 r44; !r46 !r64 r44; !r47 !r74 r44; !r48 !r84 r44; !r49 !r94 r44; 
!r41 !r15 r45; !r42 !r25 r45; !r43 !r35 r45; !r44 !r45 r45; !r46 !r65 r45; !r47 !r75 r45; !r48 !r85 r45; !r49 !r95 r45; 
!r41 !r16 r46; !r42 !r26 r46; !r43 !r36 r46; !r44 !r46 r46; !r45 !r56 r46; !r47 !r76 r46; !r48 !r86 r46; !r49 !r96 r46; 
!r41 !r17 r47; !r42 !r27 r47; !r43 !r37 r47; !r44 !r47 r47; !r45 !r57 r47; !r46 !r67 r47; !r48 !r87 r47; !r49 !r97 r47; 
!r41 !r18 r48; !r42 !r28 r48; !r43 !r38 r48; !r44 !r48 r48; !r45 !r58 r48; !r46 !r68 r48; !r47 !r78 r48; !r49 !r98 r48; 
!r41 !r19 r49; !r42 !r29 r49; !r43 !r39 r49; !r44 !r49 r49; !r45 !r59 r49; !r46 !r69 r49; !r47 !r79 r49; !r48 !r89 r49; 
!r52 !r21 r51; !r53 !r31 r51; !r54 !r41 r51; !r55 !r51 r51; !r56 !r61 r51; !r57 !r71 r51; !r58 !r81 r51; !r59 !r91 r51; 
!r51 !r12 r52; !r53 !r32 r52; !r54 !r42 r52; !r55 !r52 r52; !r56 !r62 r52; !r57 !r72 r52; !r58 !r82 r52; !r59 !r92 r52; 
!r51 !r13 r53; !r52 !r23 r53; !r54 !r43 r53; !r55 !r53 r53; !r56 !r63 r53; !r57 !r73 r53; !r58 !r83 r53; !r59 !r93 r53; 
!r51 !r14 r54; !r52 !r24 r54; !r53 !r34 r54; !r55 !r54 r54; !r56 !r64 r54; !r57 !r74 r54; !r58 !r84 r54; !r59 !r94 r54; 
!r51 !r15 r55; !r52 !r25 r55; !r53 !r35 r55; !r54 !r45 r55; !r56 !r65 r55; !r57 !r75 r55; !r58 !r85 r55; !r59 !r95 r55; 
!r51 !r16 r56; !r52 !r26 r56; !r53 !r36 r56; !r54 !r46 r56; !r55 !r56 r56; !r57 !r76 r56; !r58 !r86 r56; !r59 !r96 r56; 
!r51 !r17 r57; !r52 !r27 r57; !r53 !r37 r57; !r54 !r47 r57; !r55 !r57 r57; !r56 !r67 r57; !r58 !r87 r57; !r59 !r97 r57; 
!r51 !r18 r58; !r52 !r28 r58; !r53 !r38 r58; !r54 !r48 r58; !r55 !r58 r58; !r56 !r68 r58; !r57 !r78 r58; !r59 !r98 r58; 
!r51 !r19 r59; !r52 !r29 r59; !r53 !r39 r59; !r54 !r49 r59; !r55 !r59 r59; !r56 !r69 r59; !r57 !r79 r59; !r58 !r89 r59; 
!r62 !r21 r61; !r63 !r31 r61; !r64 !r41 r61; !r65 !r51 r61; !r66 !r61 r61; !r67 !r71 r61; !r68 !r81 r61; !r69 !r91 r61; 
!r61 !r12 r62; !r63 !r32 r62; !r64 !r42 r62; !r65 !r52 r62; !r66 !r62 r62; !r67 !r72 r62; !r68 !r82 r62; !r69 !r92 r62; 
!r61 !r13 r63; !r62 !r23 r63; !r64 !r43 r63; !r65 !r53 r63; !r66 !r63 r63; !r67 !r73 r63; !r68 !r83 r63; !r69 !r93 r63; 
!r61 !r14 r64; !r62 !r24 r64; !r63 !r34 r64; !r65 !r54 r64; !r66 !r64 r64; !r67 !r74 r64; !r68 !r84 r64; !r69 !r94 r64; 
!r61 !r15 r65; !r62 !r25 r65; !r63 !r35 r65; !r64 !r45 r65; !r66 !r65 r65; !r67 !r75 r65; !r68 !r85 r65; !r69 !r95 r65; 
!r61 !r16 r66; !r62 !r26 r66; !r63 !r36 r66; !r64 !r46 r66; !r65 !r56 r66; !r67 !r76 r66; !r68 !r86 r66; !r69 !r96 r66; 
!r61 !r17 r67; !r62 !r27 r67; !r63 !r37 r67; !r64 !r47 r67; !r65 !r57 r67; !r66 !r67 r67; !r68 !r87 r67; !r69 !r97 r67; 
!r61 !r18 r68; !r62 !r28 r68; !r63 !r38 r68; !r64 !r48 r68; !r65 !r58 r68; !r66 !r68 r68; !r67 !r78 r68; !r69 !r98 r68; 
!r61 !r19 r69; !r62 !r29 r69; !r63 !r39 r69; !r64 !r49 r69; !r65 !r59 r69; !r66 !r69 r69; !r67 !r79 r69; !r68 !r89 r69; 
!r72 !r21 r71; !r73 !r31 r71; !r74 !r41 r71; !r75 !r51 r71; !r76 !r61 r71; !r77 !r71 r71; !r78 !r81 r71; !r79 !r91 r71; 
!r71 !r12 r72; !r73 !r32 r72; !r74 !r42 r72; !r75 !r52 r72; !r76 !r62 r72; !r77 !r72 r72; !r78 !r82 r72; !r79 !r92 r72; 
!r71 !r13 r73; !r72 !r23 r73; !r74 !r43 r73; !r75 !r53 r73; !r76 !r63 r73; !r77 !r73 r73; !r78 !r83 r73; !r79 !r93 r73; 
!r71 !r14 r74; !r72 !r24 r74; !r73 !r34 r74; !r75 !r54 r74; !r76 !r64 r74; !r77 !r74 r74; !r78 !r84 r74; !r79 !r94 r74; 
!r71 !r15 r75; !r72 !r25 r75; !r73 !r35 r75; !r74 !r45 r75; !r76 !r65 r75; !r77 !r75 r75; !r78 !r85 r75; !r79 !r95 r75; 
!r71 !r16 r76; !r72 !r26 r76; !r73 !r36 r76; !r74 !r46 r76; !r75 !r56 r76; !r77 !r76 r76; !r78 !r86 r76; !r79 !r96 r76; 
!r71 !r17 r77; !r72 !r27 r77; !r73 !r37 r77; !r74 !r47 r77; !r75 !r57 r77; !r76 !r67 r77; !r78 !r87 r77; !r79 !r97 r77; 
!r71 !r18 r78; !r72 !r28 r78; !r73 !r38 r78; !r74 !r48 r78; !r75 !r58 r78; !r76 !r68 r78; !r77 !r78 r78; !r79 !r98 r78; 
!r71 !r19 r79; !r72 !r29 r79; !r73 !r39 r79; !r74 !r49 r79; !r75 !r59 r79; !r76 !r69 r79; !r77 !r79 r79; !r78 !r89 r79; 
!r82 !r21 r81; !r83 !r31 r81; !r84 !r41 r81; !r85 !r51 r81; !r86 !r61 r81; !r87 !r71 r81; !r88 !r81 r81; !r89 !r91 r81; 
!r81 !r12 r82; !r83 !r32 r82; !r84 !r42 r82; !r85 !r52 r82; !r86 !r62 r82; !r87 !r72 r82; !r88 !r82 r82; !r89 !r92 r82; 
!r81 !r13 r83; !r82 !r23 r83; !r84 !r43 r83; !r85 !r53 r83; !r86 !r63 r83; !r87 !r73 r83; !r88 !r83 r83; !r89 !r93 r83; 
!r81 !r14 r84; !r82 !r24 r84; !r83 !r34 r84; !r85 !r54 r84; !r86 !r64 r84; !r87 !r74 r84; !r88 !r84 r84; !r89 !r94 r84; 
!r81 !r15 r85; !r82 !r25 r85; !r83 !r35 r85; !r84 !r45 r85; !r86 !r65 r85; !r87 !r75 r85; !r88 !r85 r85; !r89 !r95 r85; 
!r81 !r16 r86; !r82 !r26 r86; !r83 !r36 r86; !r84 !r46 r86; !r85 !r56 r86; !r87 !r76 r86; !r88 !r86 r86; !r89 !r96 r86; 
!r81 !r17 r87; !r82 !r27 r87; !r83 !r37 r87; !r84 !r47 r87; !r85 !r57 r87; !r86 !r67 r87; !r88 !r87 r87; !r89 !r97 r87; 
!r81 !r18 r88; !r82 !r28 r88; !r83 !r38 r88; !r84 !r48 r88; !r85 !r58 r88; !r86 !r68 r88; !r87 !r78 r88; !r89 !r98 r88; 
!r81 !r19 r89; !r82 !r29 r89; !r83 !r39 r89; !r84 !r49 r89; !r85 !r59 r89; !r86 !r69 r89; !r87 !r79 r89; !r88 !r89 r89; 
!r92 !r21 r91; !r93 !r31 r91; !r94 !r41 r91; !r95 !r51 r91; !r96 !r61 r91; !r97 !r71 r91; !r98 !r81 r91; !r99 !r91 r91; 
!r91 !r12 r92; !r93 !r32 r92; !r94 !r42 r92; !r95 !r52 r92; !r96 !r62 r92; !r97 !r72 r92; !r98 !r82 r92; !r99 !r92 r92; 
!r91 !r13 r93; !r92 !r23 r93; !r94 !r43 r93; !r95 !r53 r93; !r96 !r63 r93; !r97 !r73 r93; !r98 !r83 r93; !r99 !r93 r93; 
!r91 !r14 r94; !r92 !r24 r94; !r93 !r34 r94; !r95 !r54 r94; !r96 !r64 r94; !r97 !r74 r94; !r98 !r84 r94; !r99 !r94 r94; 
!r91 !r15 r95; !r92 !r25 r95; !r93 !r35 r95; !r94 !r45 r95; !r96 !r65 r95; !r97 !r75 r95; !r98 !r85 r95; !r99 !r95 r95; 
!r91 !r16 r96; !r92 !r26 r96; !r93 !r36 r96; !r94 !r46 r96; !r95 !r56 r96; !r97 !r76 r96; !r98 !r86 r96; !r99 !r96 r96; 
!r91 !r17 r97; !r92 !r27 r97; !r93 !r37 r97; !r94 !r47 r97; !r95 !r57 r97; !r96 !r67 r97; !r98 !r87 r97; !r99 !r97 r97; 
!r91 !r18 r98; !r92 !r28 r98; !r93 !r38 r98; !r94 !r48 r98; !r95 !r58 r98; !r96 !r68 r98; !r97 !r78 r98; !r99 !r98 r98; 
!r91 !r19 r99; !r92 !r29 r99; !r93 !r39 r99; !r94 !r49 r99; !r95 !r59 r99; !r96 !r69 r99; !r97 !r79 r99; !r98 !r89 r99; 

}
```

                    


### 8. Feedback arc set
```text

// Karp's problem 8. Feedback arc set

//directed graph, edges:

//v1 -> v2
//v2 -> v4
//v2 -> v5 
//v3 -> v1 
//v3 -> v4 
//v4 -> v6 
//v5 -> v3 
//v6 -> v1 
//v6 -> v5

//if e12 == true, e12 is removed

k += e12 e24 e25 e31 e34 e46 e53 e61 e65
size 4 0

binarySearch min k 0 9

clauses {
    e12 r12
    e24 r24
    e25 r25
    e31 r31
    e34 r34
    e46 r46
    e53 r53
    e61 r61
    e65 r65
}

r11 == false
r22 == false
r33 == false
r44 == false
r55 == false
r66 == false

//Two paths from a to b and from b to c imply a path from a to c.
//!(rab && rbc) || rac == true
//or 
//!rab || !rbc || rac == true

clauses {
    
!r12 !r21 r11; !r13 !r31 r11; !r14 !r41 r11; !r15 !r51 r11; !r16 !r61 r11; 
!r11 !r12 r12; !r13 !r32 r12; !r14 !r42 r12; !r15 !r52 r12; !r16 !r62 r12; 
!r11 !r13 r13; !r12 !r23 r13; !r14 !r43 r13; !r15 !r53 r13; !r16 !r63 r13; 
!r11 !r14 r14; !r12 !r24 r14; !r13 !r34 r14; !r15 !r54 r14; !r16 !r64 r14; 
!r11 !r15 r15; !r12 !r25 r15; !r13 !r35 r15; !r14 !r45 r15; !r16 !r65 r15; 
!r11 !r16 r16; !r12 !r26 r16; !r13 !r36 r16; !r14 !r46 r16; !r15 !r56 r16; 
!r22 !r21 r21; !r23 !r31 r21; !r24 !r41 r21; !r25 !r51 r21; !r26 !r61 r21; 
!r21 !r12 r22; !r23 !r32 r22; !r24 !r42 r22; !r25 !r52 r22; !r26 !r62 r22; 
!r21 !r13 r23; !r22 !r23 r23; !r24 !r43 r23; !r25 !r53 r23; !r26 !r63 r23; 
!r21 !r14 r24; !r22 !r24 r24; !r23 !r34 r24; !r25 !r54 r24; !r26 !r64 r24; 
!r21 !r15 r25; !r22 !r25 r25; !r23 !r35 r25; !r24 !r45 r25; !r26 !r65 r25; 
!r21 !r16 r26; !r22 !r26 r26; !r23 !r36 r26; !r24 !r46 r26; !r25 !r56 r26; 
!r32 !r21 r31; !r33 !r31 r31; !r34 !r41 r31; !r35 !r51 r31; !r36 !r61 r31; 
!r31 !r12 r32; !r33 !r32 r32; !r34 !r42 r32; !r35 !r52 r32; !r36 !r62 r32; 
!r31 !r13 r33; !r32 !r23 r33; !r34 !r43 r33; !r35 !r53 r33; !r36 !r63 r33; 
!r31 !r14 r34; !r32 !r24 r34; !r33 !r34 r34; !r35 !r54 r34; !r36 !r64 r34; 
!r31 !r15 r35; !r32 !r25 r35; !r33 !r35 r35; !r34 !r45 r35; !r36 !r65 r35; 
!r31 !r16 r36; !r32 !r26 r36; !r33 !r36 r36; !r34 !r46 r36; !r35 !r56 r36; 
!r42 !r21 r41; !r43 !r31 r41; !r44 !r41 r41; !r45 !r51 r41; !r46 !r61 r41; 
!r41 !r12 r42; !r43 !r32 r42; !r44 !r42 r42; !r45 !r52 r42; !r46 !r62 r42; 
!r41 !r13 r43; !r42 !r23 r43; !r44 !r43 r43; !r45 !r53 r43; !r46 !r63 r43; 
!r41 !r14 r44; !r42 !r24 r44; !r43 !r34 r44; !r45 !r54 r44; !r46 !r64 r44; 
!r41 !r15 r45; !r42 !r25 r45; !r43 !r35 r45; !r44 !r45 r45; !r46 !r65 r45; 
!r41 !r16 r46; !r42 !r26 r46; !r43 !r36 r46; !r44 !r46 r46; !r45 !r56 r46; 
!r52 !r21 r51; !r53 !r31 r51; !r54 !r41 r51; !r55 !r51 r51; !r56 !r61 r51; 
!r51 !r12 r52; !r53 !r32 r52; !r54 !r42 r52; !r55 !r52 r52; !r56 !r62 r52; 
!r51 !r13 r53; !r52 !r23 r53; !r54 !r43 r53; !r55 !r53 r53; !r56 !r63 r53; 
!r51 !r14 r54; !r52 !r24 r54; !r53 !r34 r54; !r55 !r54 r54; !r56 !r64 r54; 
!r51 !r15 r55; !r52 !r25 r55; !r53 !r35 r55; !r54 !r45 r55; !r56 !r65 r55; 
!r51 !r16 r56; !r52 !r26 r56; !r53 !r36 r56; !r54 !r46 r56; !r55 !r56 r56; 
!r62 !r21 r61; !r63 !r31 r61; !r64 !r41 r61; !r65 !r51 r61; !r66 !r61 r61; 
!r61 !r12 r62; !r63 !r32 r62; !r64 !r42 r62; !r65 !r52 r62; !r66 !r62 r62; 
!r61 !r13 r63; !r62 !r23 r63; !r64 !r43 r63; !r65 !r53 r63; !r66 !r63 r63; 
!r61 !r14 r64; !r62 !r24 r64; !r63 !r34 r64; !r65 !r54 r64; !r66 !r64 r64; 
!r61 !r15 r65; !r62 !r25 r65; !r63 !r35 r65; !r64 !r45 r65; !r66 !r65 r65; 
!r61 !r16 r66; !r62 !r26 r66; !r63 !r36 r66; !r64 !r46 r66; !r65 !r56 r66; 

}
```                


### 9. Directed Hamilton circuit
```text
// Karp's problem 9. Directed Hamilton circuit

//directed graph, edges:

//v1 -> v2
//v1 -> v3
//v1 -> v4 
//v2 -> v1
//v3 -> v1 
//v3 -> v2 
//v4 -> v3
//v4 -> v5
//v5 -> v2 
//v5 -> v3
//v5 -> v4 

size 3 0

v1Index = 5
v2Index >= 0
v3Index >= 0
v4Index >= 0
v5Index >= 0

v1Prev = 4
v2Prev = v2Index - 1
v3Prev = v3Index - 1
v4Prev = v4Index - 1
v5Prev = v5Index - 1

v1Next = 1
v2Next = v2Index + 1
v3Next = v3Index + 1
v4Next = v4Index + 1
v5Next = v5Index + 1

//v1
1 += e12  e13  e14
1 += e21 e31 

e12 ? v1Next = v2Index
e13 ? v1Next = v3Index
e14 ? v1Next = v4Index

e21 ? v1Prev = v2Index
e31 ? v1Prev = v3Index

//v2
1 += e21 
1 += e12 e32 e52

e21 ? v2Next = v1Index

e12 ? v2Prev = 0
e32 ? v2Prev = v3Index
e52 ? v2Prev = v5Index

//v3
1 += e31 e32
1 += e13 e43 e53 

e31 ? v3Next = v1Index
e32 ? v3Next = v2Index

e13 ? v3Prev = 0
e43 ? v3Prev = v4Index
e53 ? v3Prev = v5Index

//v4
1 += e43  e45
1 += e14 e54

e43 ? v4Next = v3Index
e45 ? v4Next = v5Index

e14 ? v4Prev = 0
e54 ? v4Prev = v5Index

//v5
1 += e52 e53 e54 
1 += e45

e52 ? v5Next = v2Index
e53 ? v5Next = v3Index
e54 ? v5Next = v4Index

e45 ? v5Prev = v4Index
```
                    


### 10. Undirected Hamilton circuit
```text

// Karp's problem 10. Undirected Hamilton circuit

//edges:
// v1 - v2
// v1 - v3
// v1 - v4
// v2 - v3
// v2 - v5
// v3 - v4
// v4 - v5

e12 && e21 == false
e13 && e31 == false
e14 && e41 == false
e23 && e32 == false
e25 && e52 == false
e34 && e43 == false
e45 && e54 == false

v1Index = 5
v1Prev = 4
v1Next = 1 

v2Index >= 0 
v2Prev = v2Index - 1 
v2Next = v2Index + 1 

v3Index >= 0 
v3Prev = v3Index - 1 
v3Next = v3Index + 1 

v4Index >= 0 
v4Prev = v4Index - 1 
v4Next = v4Index + 1 

v5Index >= 0 
v5Prev = v5Index - 1 
v5Next = v5Index + 1 

//v1
e12 ? v1Next = v2Index 
e21 ? v1Prev = v2Index 
e13 ? v1Next = v3Index 
e31 ? v1Prev = v3Index 
e14 ? v1Next = v4Index 
e41 ? v1Prev = v4Index 
1 += e12 e13 e14
1 += e21 e31 e41

//v2
e21 ? v2Next = v1Index 
e12 ? v2Prev = 0 
e23 ? v2Next = v3Index 
e32 ? v2Prev = v3Index 
e25 ? v2Next = v5Index 
e52 ? v2Prev = v5Index 
1 += e21 e23 e25
1 += e12 e32 e52

//v3
e31 ? v3Next = v1Index 
e13 ? v3Prev = 0 
e32 ? v3Next = v2Index 
e23 ? v3Prev = v2Index 
e34 ? v3Next = v4Index 
e43 ? v3Prev = v4Index 
1 += e31 e32 e34
1 += e13 e23 e43

//v4
e41 ? v4Next = v1Index 
e14 ? v4Prev = 0 
e43 ? v4Next = v3Index 
e34 ? v4Prev = v3Index 
e45 ? v4Next = v5Index 
e54 ? v4Prev = v5Index 
1 += e41 e43 e45
1 += e14 e34 e54

//v5
e52 ? v5Next = v2Index 
e25 ? v5Prev = v2Index 
e54 ? v5Next = v4Index 
e45 ? v5Prev = v4Index 
1 += e52 e54
1 += e25 e45

size 3 0
```             

### 11. SAT3

```text
// Karp's problem 11. Satisfiability with at most 3 literals per clause 

// (x1 || !x2 || x3) && (x1 || x2 || x4) &&  (!x1 || !x2 || x5) 
clauses {
    x1 !x2 x3 
    x1 x2 x4
    !x1 !x2 x5
}

```

                    


### 12. Chromatic number
```text
// Karp's problem 12. Chromatic number (graph coloring)

//let's use the Petersen graph:
//vertices of the inner pentagon: v1, v2, v3, v4, v5
//vertices of the outer pentagon: w1, w2, w3, w4, w5

k >= 0

v1 >= 0 && v1 < k
v2 >= 0 && v2 < k
v3 >= 0 && v3 < k
v4 >= 0 && v4 < k
v5 >= 0 && v5 < k

w1 >= 0 && w1 < k
w2 >= 0 && w2 < k
w3 >= 0 && w3 < k
w4 >= 0 && w4 < k
w5 >= 0 && w5 < k

v1 != v2
v2 != v3
v3 != v4
v4 != v5
v5 != v1

w1 != w3
w2 != w4
w3 != w5
w4 != w1
w5 != w2

v1 != w1
v2 != w2
v3 != w3
v4 != w4
v5 != w5

binarySearch min k 0 10

size 4 0
```               


### 13. Clique cover
```text
// Karp's problem 13. Clique cover

/* Matrix:

0 1 1 1 0 1 0
1 0 1 0 1 0 1
1 1 0 1 1 0 0 
1 0 1 0 1 1 1
0 1 1 1 0 1 1
1 0 0 1 1 0 1
0 1 0 1 1 1 0

*/

k >= 0

v1 >= 0 && v1 < k
v2 >= 0 && v2 < k
v3 >= 0 && v3 < k
v4 >= 0 && v4 < k
v5 >= 0 && v5 < k
v6 >= 0 && v6 < k
v7 >= 0 && v7 < k

//Each missing edge represents an additional constraint

v1 != v5
v1 != v7

v2 != v4
v2 != v6

v3 != v6
v3 != v7

binarySearch min k 0 10

size 4 0
```          


### 14. Exact cover
```text
// Karp's problem 14. Exact cover

// X: {1,2,3,4,5,6,7}

// A: {1,4,7}
// B: {1,4}
// C: {4,5,7}
// D: {3,5,6}
// E: {2,3,6,7}
// F: {2,7}

k += a b c d e f

// intersection of sets

a && b == false
a && c == false
a && e == false
a && f == false

b && c == false

c && d == false
c && e == false
c && f == false

d && e == false

e && f == false

// elements
a || b           //1
e || f           //2
d || e           //3
a || b || c      //4
c || d || c      //5
d || e           //6
a || c || e || f //7

binarySearch min k 0 6
```            


### 15. Hitting set
```text
// Karp's problem 15. Hitting set

// {v2, v3, v11}
// {v1, v4, v5}
// {v2, v6, v7, v8}
// {v3, v5, v8}
// {v3, v9, v10}
// {v5, v6, v10}
// {v7, v8, v9}
// {v1, v9, v11}

k += v1 v2 v3 v4 v5 v6 v7 v8 v9 v10 v11

v2 || v3 || v11
v1 || v4 || v5
v2 || v6 || v7 || v8
v3 || v5 || v8
v3 || v9 || v10
v5 || v6 || v10
v7 || v8 || v9
v1 || v9 || v11

binarySearch min k 0 15

size 5 0
```           


### 16. Steiner tree
```text
// Karp's problem 16. Steiner tree

//edges:
// v1 - v2 : 1
// v1 - v3 : 4
// v2 - v3 : 3
// v2 - v4 : 1
// v2 - v5 : 2
// v3 - v6 : 1
// v4 - v7 : 1
// v5 - v9 : 2
// v6 - v9 : 4
// v7 - v8 : 1
// v8 - v9 : 1

//terminals:
// v1
// v3
// v4
// v9

k >= 0

binarySearch min k 3 21

v1 == true
v3 == true
v4 == true
v9 == true

//k = k12 + k13 + k23 + k24 + k25 + k36 + k47 + k59 + k69 + k78 + k89

t1 = k12 + k13;
t2 = k23 + k24 + k25;
t3 = k36 + k47 + k59;
t4 = k69 + k78 + k89;

t5 = t1 + t2
t6 = t3 + t4

k = t5 + t6

t1:5 == false
t2:5 == false
t3:5 == false
t4:5 == false
t1:4 == false
t2:4 == false
t3:4 == false
t4:4 == false
t1:3 == false
t2:3 == false
t3:3 == false
t4:3 == false

t5:5 == false
t6:5 == false
t5:4 == false
t6:4 == false

size 5 0

e12 || e21 == et12
e12 && e21 == false 
et12 ? 1 : 0 = k12
e12 ? 1 : 0 = n12
e21 ? 1 : 0 = n21

e13 || e31 == et13
e13 && e31 == false 
et13 ? 4 : 0 = k13
e13 ? 1 : 0 = n13
e31 ? 1 : 0 = n31

e23 || e32 == et23
e23 && e32 == false 
et23 ? 3 : 0 = k23
e23 ? 1 : 0 = n23
e32 ? 1 : 0 = n32

e24 || e42 == et24
e24 && e42 == false 
et24 ? 1 : 0 = k24
e24 ? 1 : 0 = n24
e42 ? 1 : 0 = n42

e25 || e52 == et25
e25 && e52 == false 
et25 ? 2 : 0 = k25
e25 ? 1 : 0 = n25
e52 ? 1 : 0 = n52

e36 || e63 == et36
e36 && e63 == false 
et36 ? 1 : 0 = k36
e36 ? 1 : 0 = n36
e63 ? 1 : 0 = n63

e47 || e74 == et47
e47 && e74 == false 
et47 ? 1 : 0 = k47
e47 ? 1 : 0 = n47
e74 ? 1 : 0 = n74

e59 || e95 == et59
e59 && e95 == false 
et59 ? 2 : 0 = k59
e59 ? 1 : 0 = n59
e95 ? 1 : 0 = n95

e69 || e96 == et69
e69 && e96 == false 
et69 ? 4 : 0 = k69
e69 ? 1 : 0 = n69
e96 ? 1 : 0 = n96

e78 || e87 == et78
e78 && e87 == false 
et78 ? 1 : 0 = k78
e78 ? 1 : 0 = n78
e87 ? 1 : 0 = n87

e89 || e98 == et89
e89 && e98 == false 
et89 ? 1 : 0 = k89
e89 ? 1 : 0 = n89
e98 ? 1 : 0 = n98


!et12 || (v1 && v2)
!et13 || (v1 && v3)
!et23 || (v2 && v3)
!et24 || (v2 && v4)
!et25 || (v2 && v5)
!et36 || (v3 && v6)
!et47 || (v4 && v7)
!et59 || (v5 && v9)
!et69 || (v6 && v9)
!et78 || (v7 && v8)
!et89 || (v8 && v9)

//v1
v1Index = 0 
n12 + n13 = 1 

//v2
v2Index >= 0 
v2Prev = v2Index - 1
v2 ? 1 : 0 = nn2
e12 ? v1Index = v2Prev
e32 ? v3Index = v2Prev
e42 ? v4Index = v2Prev
e52 ? v5Index = v2Prev
n12 + n32 + n42 + n52 = nn2

//v3
v3Index >= 0 
v3Prev = v3Index - 1
v3 ? 1 : 0 = nn3
e13 ? v1Index = v3Prev
e23 ? v2Index = v3Prev
e63 ? v6Index = v3Prev
n13 + n23 + n63 = nn3

//v4
v4Index >= 0 
v4Prev = v4Index - 1
v4 ? 1 : 0 = nn4
e24 ? v2Index = v4Prev
e74 ? v7Index = v4Prev
n24 + n74 = nn4

//v5
v5Index >= 0 
v5Prev = v5Index - 1
v5 ? 1 : 0 = nn5
e25 ? v2Index = v5Prev
e95 ? v9Index = v5Prev
n25 + n95 = nn5

//v6
v6Index >= 0 
v6Prev = v6Index - 1
v6 ? 1 : 0 = nn6
e36 ? v3Index = v6Prev
e96 ? v9Index = v6Prev
n36 + n96 = nn6

//v7
v7Index >= 0 
v7Prev = v7Index - 1
v7 ? 1 : 0 = nn7
e47 ? v4Index = v7Prev
e87 ? v8Index = v7Prev
n47 + n87 = nn7

//v8
v8Index >= 0 
v8Prev = v8Index - 1
v8 ? 1 : 0 = nn8
e78 ? v7Index = v8Prev
e98 ? v9Index = v8Prev
n78 + n98 = nn8

//v9
v9Index >= 0 
v9Prev = v9Index - 1
v9 ? 1 : 0 = nn9
e59 ? v5Index = v9Prev
e69 ? v6Index = v9Prev
e89 ? v8Index = v9Prev
n59 + n69 + n89 = nn9

```                    


### 17. 3-dimensional matching 
```text
// Karp's problem 17. 3-dimensional matching 

//X: {x1, x2, x3}
//Y: {y1, y2, y3}
//Z: {z1, z2, z3}

//Triples:
// (x1, y1, z2)
// (x1, y2, z3)
// (x2, y3, z1)
// (x3, y1, z2)
// (x3, y1, z3)

1 += x1y1z2 x1y2z3 //x1
1 += x2y3z1 //x2
1 += x3y1z2 x3y1z3  //x3

1 += x1y1z2  x3y1z2  x3y1z3  //y1
1 += x1y2z3 //y2
1 += x2y3z1 //y3

1 += x2y3z1 //z1
1 += x1y1z2 x3y1z2  //z2
1 += x1y2z3 x3y1z3  //z3

size 3 0
```


### 18. Subset sum (Knapsack)
```text
// Karp's problem 18. Subset sum (Knapsack)

// {3,7,3,4,5,9}, s = 11                    

11 = 3 ?* x0 + 7 ?* x1 + 3 ?* x2 + 4 ?* x3 + 5 ?* x4 + 9 ?* x5

size 8 0
```


### 19. Job sequencing
```text
// Karp's problem 19. Job sequencing

/*

taskName: execution time, deadline, penalty

t1: 4, 3, 1
t2: 3, 2, 2
t3: 1, 4, 3
t4: 2, 7, 1
t5: 3, 4, 4

*/

k = 1 ?* isPenalty1 + 2 ?* isPenalty2 + 3 ?* isPenalty3 + 1 ?* isPenalty4 + 4 ?* isPenalty5

binarySearch min k 0 10

isPenalty1 == end1 > 3
isPenalty2 == end2 > 2
isPenalty3 == end3 > 4
isPenalty4 == end4 > 7
isPenalty5 == end5 > 4

size + 5 0

start1 + 4 = end1
start2 + 3 = end2
start3 + 1 = end3
start4 + 2 = end4
start5 + 3 = end5

// b12 : t1 before t2

end1 <= start2 == b12; end2 <= start1 == !b12;
end1 <= start3 == b13; end3 <= start1 == !b13;
end1 <= start4 == b14; end4 <= start1 == !b14;
end1 <= start5 == b15; end5 <= start1 == !b15;

end2 <= start3 == b23; end3 <= start2 == !b23;
end2 <= start4 == b24; end4 <= start2 == !b24;
end2 <= start5 == b25; end5 <= start2 == !b25;

end3 <= start4 == b34; end4 <= start3 == !b34;
end3 <= start5 == b35; end5 <= start3 == !b35;

end4 <= start5 == b45; end5 <= start4 == !b45;
    
```         


### 20. Partition
```text

// Karp's problem 20. Partition

// {3,7,3,4,5,10}                    


16 = 3 ?* v1 +  7 ?* v2  +  3 ?* v3  +  4 ?* v4  +  5 ?* v5  +  10 ?* v6

size 8 0

```
                    


### 21. Max cut
```text

// Karp's problem 21. Max cut

//Edge:weight
    
//AB:3
//AF:2
//BC:1
//BF:1
//CD:2
//CE:3
//DE:1
//EF:2

ab ? 3 : 0 = wab
af ? 2 : 0 = waf
bc ? 1 : 0 = wbc
bf ? 1 : 0 = wbf
cd ? 2 : 0 = wcd
ce ? 3 : 0 = wce
de ? 1 : 0 = wde
ef ? 2 : 0 = wef

a == !b == ab
a == !f == af
b == !c == bc
b == !f == bf
c == !d == cd
c == !e == ce
d == !e == de
e == !f == ef

cutWeight = wab + waf + wbc + wbf + wcd + wce + wde + wef

binarySearch max cutWeight 1 30
```



