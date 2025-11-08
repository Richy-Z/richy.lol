---
draft: true
date:
    created: 2024-11-10
    updated: 2025-11-08
authors:
    - richard
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

So firstly, let us get the most basic thing out of the way:

## What even is *obfuscation*?

In pure English definition, **obfuscation** *(mass noun)* is the action of making something obscure, unclear, or unintelligible.

In the same way when applied to code, obfuscation is used to prevent source code from being easily read or understood. This can be done for a multitude of reasons, usually when an author wants to protect a valuable or proprietary implementation but is forced to distribute human-readable code (e.g., many Roblox scripts must be shared as plain code). Authors will garble identifiers, inline constants, or add convoluted logic to hide original formulas. However increasingly, this technique has also been used to make it harder for defenders to reverse-engineer genuinely malicious scripts.

It is a common misconception that obfuscation *completely hides* source code from other people. In reality, obfuscation simply makes the code harder to read and understand, but with eough effort, it can often be de-obfuscated (as will be demonstrated by this blog post).

## Our starting point

```lua title="The starting point" linenums="1"
local _ = ('t' .. 'a' .. 's' .. 'k')['w' .. 'a' .. 'i' .. 't']
local __ = (getfenv()[string.char(103, 97, 109, 101)].LinkingService)
local ___ = (string[('r' .. 'e' .. 'v' .. 'e' .. 'r' .. 's' .. 'e')])
while (0 == 0) do
    _((5 ^ 2) ^ -2)
    __:openUrl("\104\116\116\112\115\58\47\47" .. ___("\108\111\108\46\121\104\99\105\114"))
end
```

The code above *was* actually used as a malicious troll by opening inappropriate links using a vulnerable Roblox service, but for the purpose of this blog post it has been adapted to be friendly.

<!-- TODO: insert the image here! annotate "a reaction to the code when I sent the example" or something -->

At first glance, the code above may seem perplexing due to the string concatenations and inconsistencies in delimiters, the mixing of ASCII character codes with regular strings, and seemingly random and confusing mathematical expressions. However, by breaking it down line-by-line, we can uncover its hidden functionality.

## Line #1

```lua
local _ = ('t' .. 'a' .. 's' .. 'k')['w' .. 'a' .. 'i' .. 't']
```

To a Lua programmer of any level, especially one familiar with Roblox's version of it, it is clear that this line accesses the `#!luau task.wait` function, Roblox's custom waiting function.

Here is how it works: the expression

<!-- you can wrap a regular string in parenthesis to make Lua do a global lookup, or rather treat it as if you wrote it as regular code in this case -->