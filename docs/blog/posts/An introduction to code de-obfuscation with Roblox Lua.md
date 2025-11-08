---
draft: true
date: 2024-11-10
categories:
    - Reverse Engineering
    - Programming
    - Lua
---

# An introduction to code de-obfuscation with Roblox Lua

Recently, I engaged in a discussion within my community about de-obfuscating Lua code. This blog post was requested after many were puzzled about how *supposedly "random-looking"* characters and invalid-looking syntax could possibly result in non-fault code being executed.

In this blog post, we will therefore examine a short code sample which will make the code in your brain start working, in order to potentially think about de-obfuscating larger scripts.

<!-- more -->

Although this post uses a small extract in Lua as an example, it is still relevant to other scripting/programming languages, as the same techniques of obfuscation are usually used.
