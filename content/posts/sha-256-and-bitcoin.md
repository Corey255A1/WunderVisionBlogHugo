---
title: "SHA-256 and Bitcoin"
date: "2018-01-20"
summary: "A few months ago I wanted to take a hard look at the ideas behind Bitcoin and also the SHA256 algorithm at its core. Bitcoin In a nutshel..."
thumbnail: "/images/blog/2018-01-20-SHA_256_and_Bitcoin.jpg"
slug: "sha-256-and-bitcoin"
tags: ["Bitcoin","Algorithms","Crypto"]
---
A few months ago I wanted to take a hard look at the ideas behind Bitcoin and also the SHA256 algorithm at its core. Bitcoin In a nutshell, the "miners" are find ing a cryptographic hash of a block of transactions. However, the restriction is that the resulting hash has to have a value less than the current complexity value. At the core of Bitcoin, the miners are using the SHA256 algorithm. 256 meaning 256 bits or 32 bytes. 256bits has a value of of 2^256 or about 1.1579x10^77 So to find a specific hash or a range of hashes is very difficult. There is a special value in the bitcoin block header called the nonce. If the block is hashed and it is not with in the range of values specified, the nonce is increased, and the miner tries again. This happens trillions of times a second on some of the latest Mining rigs. So all the miners in the world are crunching the numbers looking for a hash value with in the specified range, and the range is chosen as such that it takes about 10mins per block. The reason for this difficulty is to restrict one miner from adding lots of blocks really fast to the chain and controlling the longest chain of the block chain. The idea behind this method wasn't new to bitcoins, it was used as a denial of service countermeasure. Check out Hashcash. http://www.hashcash.org/ http://www.hashcash.org/papers/ The blockchain aspect of this and other currencies comes from the fact that each new block of transactions added to the ledger contains the hash value of the last block. Making it pretty much impossible to modify a past block, because its hash value would not match down the chain. Other crypto's use different algorithms, but the ideas is similar. SHA-256 The most important part to understand about bitcoin was the SHA256 hashing algorithm. I looked at code and explanations online, but the best way for me to fully understand what was going on was to write it for myself and play with the values. The code was written in C#. It has a built in SHA256 library to use for comparison to make sure my algorithm hashed to the same value. It really clicked for me when I was able to see the FIPS document detailing the actual process. https://csrc.nist.gov/csrc/media/publications/fips/180/4/final/documents/fips180-4-draft-aug2014.pdf Here is my code on GitHub! https://github.com/Corey255A1/WunderVisionMiscCode/blob/master/SHA256/SHA256/SecureHashAlgorithm.cs I urge you to take a look at my code and then try to write your own! It was very interesting and fun. This is only a snip it of the whole process, but this 64 step loop really mixes up and destroys bits of information, giving an irreversible hash. for (int i = 0; i < 64; i++)

                {

                    T1 = AtoH[H] + Sigma1256(AtoH[E]) + Ch(AtoH[E], AtoH[F], AtoH[G]) + W[i];

                    T2 = Sigma0256(AtoH[A]) + Maj(AtoH[A], AtoH[B], AtoH[C]);

                    AtoH[H] = AtoH[G];

                    AtoH[G] = AtoH[F];

                    AtoH[F] = AtoH[E];

                    AtoH[E] = AtoH[D] + T1;

                    AtoH[D] = AtoH[C];

                    AtoH[C] = AtoH[B];

                    AtoH[B] = AtoH[A];

                    AtoH[A] = T1 + T2;

                } I implemented the algorithm the normal looping way, and also using recursion just for fun. private UInt32[] RecurseHash(UInt32 A, UInt32 B, UInt32 C, UInt32 D, UInt32 E, UInt32 F, UInt32 G, UInt32 H, int depth)

        {

            if (depth == 64) return new UInt32[] { A, B, C, D, E, F, G, H };

            T1 = H + Sigma1256(E) + Ch(E, F, G) + W[depth];

            T2 = Sigma0256(A) + Maj(A, B, C);

            return RecurseHash(T1 + T2, A, B, C, D + T1, E, F, G, depth+1);

        } The algorithm can use can arbitrary length of bits and the resulting hash is always 256bits. So you have no way of knowing what the original message length was. That makes it a huge problem when trying to reverse the bits. Bitcoin takes the SHA-256 hashing even one step further. It does a double SHA-256. Meaning it does an SHA256 on the original block and then does an SHA256 on the SHA256. This makes it even harder for the miners to find the correct hash value. #bitcoin #sha256 #SoftwareEngineering #crypto #Github #codingforfun