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

#### Description
Simpler, yet harder

#### Solution
Just like Misdirection, we are again given a file `enc.txt` which contains a binary string.
```
111101001000111101110000101110000110000111100000010011011111000110001010000100011101001101000101000101011001001101010110110011000110111011011101011100001111010001010110111000110111000110101001111010011110011011010100111101100101000010110010001111011010011101101101001010100101
```

This time however, cyberchef (and other similar tools I tried) were not able to identify/decipher the ciphertext...

Given that the description mentions that this time the situation is "simpler", with a bit of a guessing power, one might try to treat the ciphertext as a single binary number, and convert it to decimal.

By doing that, we get:

```
115991141051121166784701231094911510049114519911649481109510249110521089598485353125
```

Now, this may look like a dead end, but if you happen to be familiar with ascii, you might see that by splitting the text into ascii values you get text!

```
115 -> s
99 -> c
114 -> r
...
```

We keep doing that, and the plaintext is revealed.

flag: `scriptCTF{m1sd1r3ct10n_f1n4l_b055}`

### Oops (190 Solves, 443 Points)

#### Description
I am from the future! I accidentally forgot to link `chall.zip`! Surely you can find it and solve it right?

#### Solution
Now, as the description suggests, there is no attachment for this challenge. Well, there is one, but the author forgot to include it.

So we are gonna have to get it ourselves.

By looking at the link for any other attachment of any other file, we can see that the format is:

```
https://scriptctf-2026-wave1-randomchars-4f7d3a6b.s3.us-east-1.amazonaws.com/[Category]/[Challenge]/[file]
```

So, we try to find the forgotten `chall.zip`.

We visit https://scriptctf-2026-wave1-randomchars-4f7d3a6b.s3.us-east-1.amazonaws.com/Crypto/Oops/chall.zip

and we get the file!

We now unzip it, and we have our ciphertext:

```
d37cbce47f0c71a75d644badb77039e48ab1645f60ddebe928c0a3c417561345b4852636ecb388ec79417357100da120
```

and the file that produced it.

```py
import random
import time
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from hashlib import sha256

flag = open('flag.txt','rb').read()
random.seed(int(time.time())) # Preserves upto the MINUTE, not seconds ;)
key = random.randbytes(32)
cipher = AES.new(key, AES.MODE_ECB)
enc = cipher.encrypt(pad(flag,16)).hex()
open('enc.txt', 'w').write(enc)
```

Obviously, the seed will be easy to bruteforce since the sub-second precision has been dropped.

We need to check the file creation date before bruteforcing, as we can get that up to the minute, and then we can bruteforce the seconds

By checking file creation date, we see that it was made in 30 November 2069 at 11:39:00 UTC. (Which may seem odd, but hey, the author claimed to be from the future, so we run with it)

By using any online tool, we get that this is 3153037140 in Unix Epoch time.

We are now ready to brute force the seed and get the flag. Here is a simple script that will do the job

```py
import random
from Crypto.Cipher import AES

enc = open('enc.txt', 'r').read()
guess_time = 3153037140 # Known creation date up to the minute

# For each possible second of that minute generate a seed, then a key using that seed.
# Then using that key, try to decrypt our ciphertext. If we get a hit, great, we print it. If not, move on the the next second.
for i in range(guess_time, guess_time + 60):
    random.seed(i)
    key = random.randbytes(32)
    cipher = AES.new(key, AES.MODE_ECB)
    flag = cipher.decrypt(bytes.fromhex(enc))
    if flag.startswith(b'scriptCTF{'):
        print(flag.decode("utf-8"))
```

Running this will instantly reveal the flag: `scriptCTF{mY_buck37_1s_l34k1ng!}`
Which is a nice reference to how we obtained the challenge files to begin with :)

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
TODO

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