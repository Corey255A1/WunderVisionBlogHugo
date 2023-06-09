---
title: "CVS Pure Digital Dispoable Camera"
date: "2016-11-29"
summary: "Extracting Videos and Images from an old One-Time use Digital Camera"
thumbnail: "/images/blog/2016-11-29-CVS_Camera.jpg"
slug: "cvs-pure-digital-disposable-camera"
---
<p class="blog-img center md">
    <img src="/images/blog/thumb.jpg" alt="">
    <div class="center">Disecting the CVS Camera</div>
</p>
I was recently given the challenge of retrieving some footage from a ~10 year old Disposable Digital camera. Some time around 2006 and 2007, there existed Disposable Digital cameras marketed by CVS Pharmacy and created by Pure Digital which was to eventually make the Flip video camera. 

The premise was that the average consumer would purchase these subsidized priced cameras (for around $30), use them to record video and take pictures digitally and send them off to the processing facility. This is where the videos and pictures would be taken off and sent back to the consumer on DVD and the camera would then be repackaged and reused. It was not meant for the average consumer to retrieve the videos and photos off themselves. I'm writing this blog entry now because I think the research and finding the tools to do the hack (because this was a hack) sheds some interesting light on the way information is stored on the internet. Also the persistence of a group of hackers that provided ways for the general population to reuse these one time use cameras was impressive. 

The first step was to see if someone had actually already hacked the devices and find out if it was even possible. Of course it was. Finding the pinout for the connections was easy and I quickly soldered in the USB plugs to hook it right in to the computer. The next step was to use a generic libusb driver that allowed for low level commands to be sent over USB. 

<p class="blog-img center md">
    <img src="/images/blog/cvs_camera_connected.jpg" alt="">
    <div class="center">Connected to computer</div>
</p>

The driver and libraries themselves are still available, however, the versions called out in these old 2007 forums were more difficult to find. I wound up using an old machine I had that is running a 32bit version of Mint Linux and proceeded to work from there since it was going to be too much of a hassle to coax Windows 10 into accepting these sketchy non signed 3rd party libraries, and I was also question the legitness of the windows software I was finding anyway. As expected the USB communication required a specific unlock sequence. I am still curious how they discovered this. This was accomplished by a series of Challenge and Responses.  

C 09b0e6f2fad0305549b358af0271a287a06886bf883ca8bf991c0acf054780c3  
C 5fcf65def59d8df15fb67ac358bdd3b5cdb811a634177c151ff2568511925626  
C 903358b17b0852949e808a4f84c8061e8c9144d83f132c17e1514399469f21e6  
C e8622533361867872e98ee1c2d9a24080679861c5238a00d08c439d14e78cb4c  
R 0d5091235d33d855dec2256c1cc1b9f43d2d115cc6d1ad719eb43d065ccde2ef  
R 867045487e660d486ade654d0a9e650813f35051cd1540fa5c97e7ce106d3955  
R 508b3f0a6598c68fbb90a14969b5393b73b01e4317e5ffc69c914d701b1f0ea0  
R d3de84cee4fd302cb3c321a334c4819ca44b1b65e31ddd03c6ae71c59ebacff4  

And the encoding differed between firmware versions of the cameras. The camera I was working with was firmware version 53.14. which luckily I found was in fact cracked at some point because had it not been I would have been stuck. The issue now was, find a version of the software that would work with this firmware. Broken links were everywhere. When dealing with forum posts from 2007, this is to be expected. There was all this talk of "Cronuskey" "BurningmanKeys" "Ops23" "Ops-for-linux" but trying to track down where all this software went proved to be a challenge. The interesting part about all of this software, is that it existed in the first place. This group of people collaborated to develop this software, create revisions of it, and tried to stay ahead of the firmware updates. Some of the forums were even talking about trying to track down cameras with the 53.14 firmware version because they hadn't cracked it yet. And that is another interesting aspect, this same group, set up there machines to brute force crack the encoding of those challenge and response keys. One post even said something like, they'll have it cracked with in the week. (Of course all back in 2007) Aside from the cracking the challenge and response codes, there was, I think one original guy who figured out the communication of the hardware in the first place and opened the door for cracking. They even wrote this whole GUI interface. And of course they made it all open source. And then here I am nearly 10 years later, spending my time just trying to track down the work these guys did. 

The ops for linux version everyone talked about did not work for this 53.14 version but I found another side project called avidownload which did actually talk to it. And I was finally able to extract the set of Challenge keys, which were unique to the device, but followed the firmwares encoding. I then had to locate the BurninmanKeys programing which would churn out the Responses for the Challenges. Success! ... I thought ... avidownloader would actually unlock the device and begin download but would fail to actually download .... Luckily I had the source code also. Threw in some debug print statements, and discovered that the expected buffer size was not getting filled to 4096bytes. it was only filling 64bytes. Something fired off in remembrance of some vague post I came across that some libusb setting had a limitation of only being able to transmit 64byte packet sizes. .. I recompiled the code with this new size and ran it .... low and behold it actually worked. It's a cool thought that the internet is such a resource that information developed 10 years ago can be found and utilized (with some digging) My other thought is that while I did a lot of digging and research about this camera worked and located this software to communicate to it, I'm just standing on the shoulder of those giants from 10 years ago who brute forced the cameras and wrote the initial software.