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
This was a super guessy imo, but the techniques and ideas used are common on image based forensics challenges. If this looks strange and guessy, imo it's because it is... 

#### Description 
You can't see me!

#### Solution
We are given an image file of John Cena, `enc.png`.

Opening the image, we can see that it's just a regular photo without anything unusual or out of the ordinary.

!["Image of John Cena given"](/assets/writeups/scriptctf2026/john-cena.png "John Cena Image")

Now, there are many many things to try when given an image in a forensics challenge, but in this case, since this is a public image, one idea would be to compare it to the original, just to see what's different. (if anything)

By reverse image searching, we can find the photo on wikimedia (wikipedia). It is a photo taken By Gage Skidmore of John Cena speaking at the 2025 San Diego Comic-Con International in San Diego, California.

we download the image, the small version of it, which is the version we have from the challenge, and convert it to png. Now we are ready to analyze for differences.

By writing some python code, we analyze for differences in the pixel data, and their locations:

```py
from PIL import Image

original = Image.open('original.png')
enc = Image.open('enc.png')

width, height = original.size

original_pixels = list(original.getdata())
enc_pixels = list(enc.getdata())

changed_positions = []

for i in range(len(original_pixels)):
    if original_pixels[i] != enc_pixels[i]:
        x = i % width
        y = i // width
        changed_positions.append((x, y))

print("Changed pixels:", changed_positions[:])
```

We run this, and we have the following output:

```
Changed pixels: [(0, 1), (0, 2), (0, 3), (0, 6), (0, 7), (0, 9), (0, 10), (0, 14), (0, 15), (0, 17), (0, 18), (0, 19), (0, 22), (0, 25), (0, 26), (0, 28), (0, 31), (0, 33), (0, 34), (0, 35), (0, 41), (0, 42), (0, 43), (0, 45), (0, 49), (0, 54), (0, 55), (0, 57), (0, 59), (0, 61), (0, 65), (0, 69), (0, 70), (0, 73), (0, 74), (0, 75), (0, 76), (0, 78), (0, 79), (0, 81), (0, 82), (0, 83), (0, 84), (0, 87), (0, 90), (0, 91), (0, 97), (0, 98), (0, 99), (0, 101), (0, 103), (0, 105), (0, 107), (0, 108), (0, 109), (0, 110), (0, 111), (0, 113), (0, 114), (0, 118), (0, 119), (0, 122), (0, 123), (0, 125), (0, 129), (0, 130), (0, 132), (0, 133), (0, 134), (0, 137), (0, 138), (0, 139), (0, 141), (0, 145), (0, 147), (0, 148), (0, 149), (0, 150), (0, 151), (0, 153), (0, 154), (0, 155), (0, 158), (0, 159), (0, 162), (0, 163), (0, 166), (0, 167), (0, 170), (0, 171), (0, 174), (0, 175), (0, 177), (0, 179), (0, 180), (0, 181), (0, 182), (0, 183), (0, 185), (0, 186), (0, 188), (0, 189), (0, 191), (0, 194), (0, 195), (0, 198), (0, 199), (0, 201), (0, 203), (0, 204), (0, 205), (0, 206), (0, 207), (0, 209), (0, 210), (0, 211), (0, 213), (0, 215), (0, 217), (0, 218), (0, 220), (0, 221), (0, 222), (0, 225), (0, 226), (0, 228), (0, 229), (0, 234), (0, 235), (0, 238), (0, 239), (0, 242), (0, 243), (0, 245), (0, 247), (0, 250), (0, 251), (0, 253), (0, 255), (0, 257), (0, 259), (0, 260), (0, 261), (0, 262), (0, 263), (0, 265), (0, 266), (0, 267), (0, 268), (0, 271), (0, 274), (0, 275), (0, 281), (0, 282), (0, 283), (0, 285), (0, 287), (0, 289), (0, 291), (0, 292), (0, 293), (0, 294), (0, 295), (0, 297), (0, 298), (0, 299), (0, 302), (0, 303), (0, 306), (0, 307), (0, 310), (0, 311), (0, 314), (0, 315), (0, 318), (0, 319), (0, 321), (0, 323), (0, 324), (0, 325), (0, 326), (0, 327), (0, 329), (0, 330), (0, 332), (0, 333), (0, 335), (0, 338), (0, 339), (0, 342), (0, 343), (0, 346), (0, 347), (0, 348), (0, 349), (0, 350), (0, 351), (0, 354), (0, 355), (0, 356), (0, 357), (0, 358), (0, 359), (0, 362), (0, 363), (0, 364), (0, 365), (0, 366), (0, 367), (0, 369), (0, 370), (0, 371), (0, 372), (0, 373), (0, 375)]
```

We can see that the changes only happen in the first column!. So, we are gonna treat different pixel value as 1, and same value as 0. We can again write a simple script for this:

```py
from PIL import Image

original = Image.open('original.png')
enc = Image.open('enc.png')

width, height = original.size

original_pixels = list(original.getdata())
enc_pixels = list(enc.getdata())

bits = []

for row in range(height):
    i = row * width
    if original_pixels[i] != enc_pixels[i]:
        bits.append('1')
    else:
        bits.append('0')

flag_bin = "".join(bits)
print("".join(flag_bin))
```

That produces a binary string. We convert it to ascii, and we get the flag. 

flag: `scriptCTF{y0u_c4nt_s33_m3_unl355_y0u_s33_m3???}`


### RecoverMyPet (125 Solves, 476 Points)
TODO

### Ron (71 Solves, 500 Points)

#### Description
The password is his name

#### Solution



## Web

### 404 Found (329 Solves, 328 Points)
TODO

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