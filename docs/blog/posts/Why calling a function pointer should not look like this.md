---
draft: false
date:
    created: 2026-03-04
    updated: 2026-03-05
authors:
    - richard
categories:
    - Nue
    - C/C++
    - Programming
    - Reverse Engineering
comments: true
---

# Why calling a function pointer **should *not*** look like this

In [a previous post](./Nue:%20How%20an%20overambitious%20idea%20found%20its%20purpose%20after%202%20years.md) I explained how [Nue](https://github.com/NueLanguage/nue) evolved from an overambitious programming language experiment into a niche language designed specifically for reverse engineering and runtime manipulation. That post focused mostly on the story behind the project and how its purpose eventually became clear after two years of an absolute mess.

In this article I would like to focus on something more practical: the actual motivation behind the language itself.

Anyone who has spent a significant amount of time working with reverse engineering, runtime hooks, or injected libraries will inevitably encounter large amounts of C or C++. These languages are extraordinarily powerful and remain the foundation of most low-level software today. It would be impossible to seriously discuss systems programming without acknowledging how important they are.

At the same time, however, it is difficult to ignore the fact that much of their syntax feels like an artefact from another era of computing.

<!-- more -->

Of course, all of this discussion about language philosophy and design choices only really matters if it results in code that is genuinely easier to write and understand. The entire point of Nue is not theoretical elegance; it is to make a very specific category of programming less unpleasant.

To illustrate the idea, consider a simplified example from the sort of work that motivated the redesign of the language in the first place: calling a function that already exists somewhere in memory inside another application. This is an extremely common pattern when writing runtime hooks and doing some reverse engineering.

In C or C++, code for this sort of task often ends up looking something like this:

```cpp
using PrintFn = long long (*)(int, const char*, ...);

PrintFn print = reinterpret_cast<PrintFn>(0x12345678);

print(0, "Hello from injected code");
```

For developers who have spent years working with C or C++, this is perfectly understandable. However, it also demonstrates the sort of syntactic density that can make the language feel heavier than it needs to be for relatively simple operations. The line

```cpp
using PrintFn = long long (*)(int, const char*, ...);
```

declares a type representing a pointer to a function which returns a `#!cpp long long` and accepts an `#!cpp int`, a `#!cpp const char*` (string), and a variadic argument list.

Even after many years of programming I still occasionally have to pause and mentally unpack declarations like this. The type name `#!cpp long long` itself is a small historical oddity which usually corresponds to a 64-bit integer on modern systems, yet the absolutely hectic name does not communicate that particularly clearly. Then there is the curious `#!cpp (*)` placed before the list of arguments. Are we declaring a function? A pointer? Both at the same time? The syntax works, but it often feels like something that must be decoded rather than something that communicates its meaning directly.

Part of this discomfort comes from the underlying philosophy of C's type system itself. C famously uses what is often described as ["declarations that mirror usage"](https://eigenstate.org/notes/c-decl), meaning that variables are declared in a way that resembles how they would appear inside an expression. While this idea may have seemed elegant when the language was designed in the early 1970s, it leads to syntax that feels increasingly unnatural when applied to more complex constructs.

Consider something as simple as a pointer. In C one typically writes:

```c
int *ptr;
```

The reasoning here is that when `#!c ptr` is dereferenced using `#!c *ptr`, the resulting expression has the type `#!c int`. In other words, the declaration describes the type that appears after dereferencing the variable.

Personally, I find it far more intuitive for a declaration to describe the type of the variable itself rather than the result of dereferencing it. If a variable is a pointer to an integer, the declaration should clearly state that relationship. In a more modern syntax this might instead look something like:

```go
var ptr *int32
```

which reads quite naturally as: "`#!go ptr` is a pointer (hence the star before the type) to an `#!go int32`."

The distinction may seem subtle, but it makes declarations much easier to reason about. Instead of mentally reversing the logic of dereferencing expressions, the type of the variable is written directly and explicitly. The star simply indicates that the variable is a pointer to another type rather than implying that the base type only appears after dereferencing.

Many newer languages like [Go](https://go.dev) have gradually moved toward this more direct style because it aligns more closely with how people tend to read code. When I write something like:

```go
var address *uint32 = somePointer
```

it reads almost like plain English: `#!go address` is a pointer to a `#!go uint32` whose value is `#!go somePointer`.

To illustrate how far C's declaration syntax can go, consider the following perfectly valid line of code:

```c
int (*(*foo)(double))[3];
```

If this looks confusing at first glance, that is because it is. Even experienced C programmers sometimes reach for tools like [cdecl](https://cdecl.org) (check it out, it is fun) just to decode declarations of this sort. What the line actually describes is a pointer to a function named foo which accepts a double and returns a pointer to an array of three integers.

Once explained, the meaning itself is not complicated. The difficulty lies purely in the way the syntax forces the reader to mentally unravel the declaration before understanding it.

In [Nue](https://github.com/NueLanguage/nue), the same idea would be expressed in a much more direct way:

```go
type FooFn = func(float64) *[3]int32
```

Here the structure of the type is immediately visible. `#!go FooFn` is a function that takes a `#!go float64` and returns a pointer to an array containing three `#!go int32` values. There are no nested parentheses, no inverted reading order, and no need to mentally decode the declaration.

Returning to the original example, the same function pointer pattern from earlier would simply look like this in Nue:

```go
type PrintFn = func(int32, *char, ...) int64

var print PrintFn = 0x12345678

print(0, "Hello from injected code")
```

There are no reinterpret casts, no complicated pointer syntax, and definitely no hidden abstractions. The programmer simply defines the function type, assigns an address to a variable of that type, and calls it.

Under the hood, the Nue compiler simply lowers this code into equivalent C, allowing the existing C toolchain to handle compilation and optimisation. Of course this example only scratches the surface of what Nue is intended to do - it is just retrieving a function already in memory and calling it - but it illustrates the core idea quite well.

The goal of Nue is *absolutely not* to reinvent low-level programming (like it was trying to do before in 0.1.0), but rather to simply make it a little less awkward to express.
