---
title: "Write your own HTTP Server?"
date: "2019-03-09"
summary: "Writing a barebones http server from scratch in C#"
thumbnail: "/images/blog/2019-03-09-Write_your_own_HTTP_Server.jpg"
slug: "write-your-own-http-server"
tags: ["CSharp", "Sockets"]
---
I have an idea for an application that may one day be all moved to the web. However, my day to day job, and therefore the most of my professional experience, is in desktop applications. Rather than dive in to web hosting, site security, certificate authorities, databases, and all of the nonsense that typically goes with web servers and web apps, I'm playing to my strengths and developing my idea as a desktop app, with elements of web.

So when I'm talking about desktop applications I mean Windows and WPF, UWP, MFC, with C#/C++. I of course dabble in all sorts of technologies as can been seen in the projects on this blog. 

I'm going to try to get the app on the Microsoft Store. While I read things about using the Desktop Bridge to bring a WPF application on to the store, I'm going to stick with trying to use UWP. I have written a lot more in WPF than UWP, and from my experience in UWP, there are a lot of things that are lacking or more restrictive due to security policies. UWP vs WPF and getting things on the Microsoft Store will be a future blog post, because I'm not quite to that point yet. 

Now the HTTP Server part. One of the things that UWP is lacking is the HttpListener class. To go off course again, I've learned that there are now several different versions of .NET.

 * .NET Framework - The classic WPF/WinForms  

 * .NET Core - A cross platform version 

 * UWP - Universal Windows Platform, A Cross device platform that runs on various types of Windows 10 devices (XBox, Raspberry Pi IOT, Hub, etc) 

 * Unity - The Unity Game engine uses its own version of .NET that I believe is compatible with the .NET Standard 

 * .NET Standard - This is the reference version of .NET, the libraries in this are in all other versions  

UWP and the .NET Standard does not include the HttpListener class from the .NET Framework. So this means, that if you want to host a basic web page from a UWP application, you'd have to use a 3rd party library, or write your own. I never like the idea of using 3rd party libraries because I feel like there is always so much that I don't need in them. People use libraries blindly these days because package managers make it so easy. Whether or not what they are trying to could be accomplished with just a few lines of code.

If you want to just jump in and start looking at the code:  
[https://github.com/Corey255A1/BareBonesHttpServer](https://github.com/Corey255A1/BareBonesHttpServer)

I really had to dig into the workings of HTTP and looked through lots of different sites full of information. Mozilla has a couple great pages of detailed overviews of the protocols involved.

HTTP: [https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)  
WebSockets: [https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers)

Surprisingly it wasn't too difficult to get things up and running, and the next couple blog posts will go over the code!

The basic HTTP Server  
[https://www.wundervisionenvisionthefuture.com/blog/net-standard-simple-http-server](https://www.wundervisionenvisionthefuture.com/blog/net-standard-simple-http-server)

Adding Websocket Support  
[https://www.wundervisionenvisionthefuture.com/blog/net-standard-simple-http-server-websockets](https://www.wundervisionenvisionthefuture.com/blog/net-standard-simple-http-server-websockets)