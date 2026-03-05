---
draft: false
date:
    created: 2026-03-01
    updated: 2026-03-04
authors:
    - richard
categories:
    - Nue
    - C/C++
    - Programming
    - Reverse Engineering
comments: true
---

# Nue: How an overambitious idea found its purpose after 2 years

Back in late 2024 I decided that building a programming language sounded like a perfectly reasonable project. (yikes!)

At the time I had spent several years primarily writing software in Lua. Lua is genuinely one of the most pleasant programming languages I have ever worked with: simple, elegant, extremely readable - and, without going into the beautiful rabbit hole of [Luvit](https://luvit.io) and [LuaJIT](https://luajit.org) - surprisingly capable despite its size. However, after a while, I began to feel that I was approaching the architectural limits of what I could comfortably build with it. I wanted stronger structure, a more expressive type system, and access to lower-level capabilities such as systems interaction and proper threading instead of silly co-operative coroutines. In fact, [I was literally dying](./When%20a%20Lua%20system%20hits%20its%20concurrency%20ceiling.md) for proper OS threads since some of my important production code was written on single-threaded Lua, but I still wanted something that retained the readability and approachability that made Lua enjoyable in the first place.

Naturally, the completely rational conclusion to me at the time was that I should simply design my own language, **and so Nue was born...**

<!-- more -->

What followed was an absurdly deep dive into programming language design. I spent hundreds of hours researching compiler architecture, recursive descent parsing, type systems, AST structures, grammar design, and the various trade-offs that every language inevitably makes. By the time I stopped actively working on the first version of Nue I had already implemented a lexer, a parser, a fairly extensive AST design, and large portions of a language specification. If one were to measure purely in time invested, the project easily crossed the **500 hour** mark. Which, now, seems like a massive opportunity cost.

Looking back at it now, the interesting thing is not that the project stalled for aalmost two years. The interesting thing is *why* it actually stalled as hard as it did.

The original vision for Nue was essentially to create another general-purpose programming language. That is an incredibly ambitious goal, and more importantly it is a goal that only really makes sense if the language solves a problem that existing tools truly cannot solve. In blatant honesty, I thought I should create an entire new programming language purely because of my lack of willingness to learn a new programming language for my own sake, and simply not wanting to wrap my head around slightly lower level things. Indeed, that is incredibly selfish of me. And yet ironically, around September of 2025 I quite literally picked a completely random language from a hat to be my next language - [Go](https://go.dev) - and coincidentally it had almost everything I've needed, and thus my own programming environment changed significantly. I moved many of my projects away from Lua and towards Go (especially all of Numelon's infrastructure, which was largely written in Lua at the time), which already provided much of the structure and clarity that I had originally wanted from Nue.
Then recently at the end of this February in 2026 after some exams, I began spending time working on projects that involved reverse engineering, heavy runtime modification, and various forms of systems-level manipulation. That world tends to revolve around C and C++, and while those languages are extraordinarily powerful, writing them is often an experience that can only be described as... inelegant.

To be clear, this is not meant as criticism of C or C++. Quite the opposite. These languages are foundational to modern computing (even if they are 50 and 40 years old, respectively), and they remain authoritative tools for low-level development. Anyone who dismisses them outright simply does not understand how much of the software world they underpin. Or they probably use Rust and cannot shutup about it. On a serious note however, respect and appreciation do not automatically translate to aesthetic enjoyment. C and C++, particularly modern C++, carry the weight of decades of accumulated design decisions and historical baggage. Even when the underlying concepts are simple, the syntax and tooling around them can feel unnecessarily complex.

What surprised me the most is that despite how much programming language design has evolved over the past few decades, there still does not appear to be a language specifically designed for the niche of **runtime manipulation and reverse engineering**. There are many general systems languages, and there are many high-level scripting languages, but there is surprisingly little that sits comfortably between the two.

Eventually it occurred to me that the problem with Nue was not the project itself. The problem was that the goal was entirely wrong.

Instead of trying to compete with established general-purpose languages, Nue could focus on something far more specific. In fact, probably too niche, but thats fine. It could become a language designed explicitly for writing injected code, runtime hooks, vtable hooking, memory manipulation logic, and other tools that interact with existing software at runtime. In other words, a language designed for **manipulation rather than application development**.

Once that idea crystallised, the entire project suddenly made sense again.

Nue is now being redesigned as a language that combines the readability and structural clarity of Go with the raw power and ABI compatibility of C. The language will compile to C rather than directly to machine code, allowing the existing C toolchain to handle optimisation and platform-specific details while Nue focuses purely on providing a pleasant syntax and a predictable programming model. There will be no runtime, no hidden abstractions, and no unnecessary features that would complicate its use in low-level environments. The goal is not to replace C or C++, but simply to make certain categories of systems programming significantly easier to write and read.

Interestingly, this shift also reflects a broader pattern that I have noticed in many of my own projects. People sometimes ask where I get ideas for things like Rubiš, Sklair, or the various other projects I have worked on over the years. The honest answer is that I ***very rarely*** start with an abstract *"idea"* at all. More often than not, a project begins because something existing annoys me so much that I feel compelled to fix it.

[Rubiš](https://rubis.app) exists because a friend of mine was frustrated with how outdated and awkward Pastebin is to use. [Sklair](https://sklair.numelon.com) exists because I wanted a better way to build reusable HTML components without relying on heavy frameworks and silly web-dev stuff like NextJS. Many of my other projects follow the same pattern: they start as small attempts to solve a problem and then gradually evolve into larger systems as new improvements and features emerge.

In a conversation with someone recently I tried to summarise this pattern rather simply: I do not start projects because I have ideas. I start them because something existing annoys me, and then I keep fixing it until it stops annoying me.

> well to be honest with you, recently there have been a lot of updates to sklair and they may have been motivated by the fact that entire websites that I build depend on them, meaning I need to add new features to sklair when I see fit (if a website would benefit from them)
>
> a lot of my projects in fact depend on eachother now that I think about it, so its a circular dependency loop
>
> in terms of not losing faith, I think it ties in with *why* I start projects at all in the first place. ***i dont start projects because i have ideas, i start them because something existing annoys me***, and then I keep fixing it until it stops annoying me

Nue originally began for exactly that reason as well, although it *clearly* took some time (only two years!) before the correct problem revealed itself.

There is also a more personal lesson here about ambition. Many of the projects I start are quite ambitious from the beginning. That ambition is not necessarily a bad thing; without it, Numelon or its projects like Rubiš, Numelon Passport or Sklair would likely never have existed. However, ambition also carries the risk of setting goals that are so broad that progress becomes difficult to maintain (especially as a single person). In the case of Nue, the solution was not abandoning the project entirely, but rather redefining its scope so that it solved a very specific and meaningful problem. Or more realistically: let the project rot until coincidentally in your life there is an insanely niche use case for said project. I'm joking.

At one point the language had become such an abstract endeavour that I even considered postponing it entirely and repurposing the work as part of my A-Level Computer Science project simply because I had already invested so much time into it. That alone should give some indication of how detached the project had become from any immediate practical use.

Fortunately, the new direction makes the language far more grounded.

Development will now continue under the version **Nue 0.2.0**, reflecting the fact that the language is still in an experimental stage rather than a stable release. The original Nue v1 (now called 0.1.0) codebase will still be [released publicly](https://github.com/NueLanguage/nue/tree/c1bd056f0c3ed37eb57a644191924089a557bb04), not as a finished language since v1 was never finished, but rather as a form of historical preservation. It represents hundreds of hours of experimentation and learning, and it may be interesting for anyone curious about how the project evolved over time.

What began as an overambitious idea in 2024 has finally found a clear purpose two years later in 2026. Instead of trying to be everything, Nue will aim to be an extremely sharp tool for a very particular job.

And in many ways, that is a far more interesting outcome.
