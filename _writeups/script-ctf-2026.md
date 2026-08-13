---
title: ScriptCTF 2026
date: 2026-08-08
categories: [misc, crypto, forensics, web, geo-osint, osint, rev, pwn]
summary: "A goated ctf hosted by ScriptSorceres. Had a lot of fun with it"
published: true
---

## Misc

### Insanity Check (179 Solves, 450 pts)
This was one of the easier ones.

Opening the challenge, we do not see much. In fact we see nothing as there seems to be no description!

![A screenshot showing the description missing](/assets/writeups/scriptctf2026/insanitycheck.png "Title")

Naturally, we check if we have gone insane, as the challenge suggests. So we check inspect element for a description.

In the description part, we see this comment in the HTML

```html
<span class="challenge-desc">
    <!-- visit /vibecheck ;) !-->
</span>
```

So we visit https://play.scriptsorcerers.xyz/vibecheck. There seems to be nothing there. We check the page source and Ctrl+F for `scriptCTF{`

We find a comment in the source containing the flag! Hooray!

```html
<div class="container">
    <!-- scriptCTF{v1b3_ch3ck_p4ss3d!} -->
</div>
```

So, flag: `scriptCTF{v1b3_ch3ck_p4ss3d!}`

### flagcheck67 (109 Solves, 482 Points)
TODO

### Golf (107 Solves, 483 Points)
TODO

## Crypto

### Misdirection (474 Solves, 143 Points)

#### Description
It is not what it is.

#### Solution

we are given a small `enc.txt` file that contains 0's and 1's.

```
1000100010100000100001110100100001010010001010110001101100101010000111000001001001000100101000100100001000101110001
```

##### The Easy Way Out
CyberChef "magic" recipe instantly decrypts the string.

![Cyberchef decrypting the enc.txt](/assets/writeups/scriptctf2026/misdirection.png "Title")

So, flag: `ScriptCTF{NOTWHATITSEEMS}`

But, that's not really fun, is it?

##### The Manual Way
One may notice that that the ciphertext has length of 115. That's quite unusual for a binary string. The divisors of 115 are 5 and 23 so one might guess that each plaintext character is 5 bits. A quick search will yield

![DuckDuckGo search of "cipher where each letter is 5 bits"](/assets/writeups/scriptctf2026/ddgo_search.png "Title")

Then, using any online tool to decrypt the cipher will give you the correct flag, `ScriptCTF{NOTWHATITSEEMS}`

### Misdirection Again (222 Solves, 422 Points)
TODO


### Oops (190 Solves, 443 Points)
TODO

## Forensics

### Bruteforced (360 Solves, 294 Points)
TODO

### John Cena (154 Solves, 463 Points)
TODO

### RecoverMyPet (125 Solves, 476 Points)
TODO

### Ron (71 Solves, 500 Points)
TODO

## Web

### 404 Found (329 Solves, 328 Points)

### wpm-game (194 Solves, 441 Points)
TODO

### PixiePlus (84 Solves, 489 Points)
TODO

### wpm-game2 (50 Solves, 497 Points)
TODO

## Geo-OSINT

### Midnight Snack (274 Solves, 381 Points)

### Titan (192 Solves, 442 Points)
TODO

### Where on Earth? (16 Solves, 500 Points)
TODO

### The New One 3 (14 Solves, 500 Points)
TODO

## OSINT

### The New One 1 (190 Solves, 443 Points)
TODO

### Promotion (107 Solves, 483 Points)
TODO

### The New One 2 (79 Solves, 491 Points)
TODO

### Time Traveler (72 Solves, 492 Points)
TODO

### Bonus 1 (32 Solves, 499 Points)
TODO

### Bonus 3 (29 Solves, 499 Points)
TODO

### Bonus 2 (15 Solves, 500 Points)
TODO

### The New One 4 (6 Solves, 500 Points)
TODO

## Reversing

### F**K (182 Solves, 448 Points)
TODO

### Diabolical (132 Solves, 473 Points)
TODO

### mc-checker (123 Solves, 477 Points)
TODO

### mc-checker-2 (91 Solves, 500 Points)
TODO

### MeowvelousShop (73 Solves, 492 Points)
TODO

## Blockchain
### Market (99 Solves, 485 Points)
TODO

## Pwn

### FaaS 1.5 (52 Solves, 496 Points)
TODO

### Leaks (44 Solves, 498 Points)
TODO

### FaaS (33 Solves, 499 Points)
TODO

### FaaS 2 (30 Solves, 499 Points)
TODO