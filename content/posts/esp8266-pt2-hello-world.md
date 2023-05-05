---
title: "ESP8266 Pt2 - Hello World"
date: "2016-11-30"
summary: "Once I was able to talk to the ESP, it was then time to connect to my Wifi. I enabled the Station and Access Point modes, because at some..."
thumbnail: "/images/blog/2016-11-30-ESP8266_Pt2___Hello_World.jpg"
slug: "esp8266-pt2-hello-world"
tags: ["Arduino"]
---
Once I was able to talk to the ESP, it was then time to connect to my Wifi. I enabled the Station and Access Point modes, because at some point I might want that. Then I had it display the networks that are around. Some one is funny with their FBI SURVEILLANCE VAN SSID haha. Last I connected to my Network. Easy Peasy. Once connected to the network. It was then time to send the classic Hello World message. I opted to use UDP. I tried to use a Multicast address to start with "224.1.2.3" But nothing seemed to be transmitting. So I retried using 192.168.1.255. I was then able to see the packets on the network via WireShark (A great tool that every programmer dealing with network traffic should use) I was having a hard time understanding the AT+CIPSEND command, but I finally found the answer: To Send Hello World: AT+CIPSEND=11 (Then you Send it with the CR/LF) It will then wait for 11 characters and CR/LF And if you can see it in the image, the payload of the packet is in fact Hello World! Woo hoo! The next step is to get the Arduino itself to talk and send data over the network. But it seems that with only a handful of simple commands it is extremely possible.