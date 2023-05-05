---
title: ".NET Standard Simple HTTP Server: Websockets"
date: "2019-03-09"
summary: "Adding basic Websocket capability to our simple HTTP Server.."
thumbnail: "/images/blog/2019-03-09-NET_Standard_Simple_HTTP_Server_Websockets.jpg"
slug: "net-standard-simple-http-server-websockets"
tags: ["C#","Sockets"]
---
Source:  
[https://github.com/Corey255A1/BareBonesHttpServer](https://github.com/Corey255A1/BareBonesHttpServer) 
 
**Suggested Reading**

 * *Previous Post*: https://www.wundervisionenvisionthefuture.com/blog/net-standard-simple-http-server 
 * https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers  
 
Websockets allow for full duplex communication between a client and server. This is useful for realtime communication such as chats or a game like [http://slither.io/](http://slither.io/)

On the Javascript side, starting a Websocket is like this:  

    var ws = new WebSocket("ws://localhost/socket");

I'm not trying to be backwards compatible, I don't really care about old browsers. Everything is going to be forward looking.

The browser client then sends the server a WebSocket Upgrade request. This is just a plain HTTP Request that looks like this: 

    GET /chat HTTP/1.1  
    Host: wundervision  
    Upgrade: websocket  
    Connection: Upgrade  
    Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==  
    Sec-WebSocket-Version: 13  

In my demo code, I'm looking for the Sec-WebSocket-Key to determine if it is a websocket request. 

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">if</span>(req.ContainsKey(<span style="background-color: #fff0f0">"Sec-WebSocket-Key"</span>))
{
    resp = <span style="color: #008800; font-weight: bold">new</span> HttpResponse(<span style="background-color: #fff0f0">"HTTP/1.1"</span>, <span style="background-color: #fff0f0">"101"</span>, <span style="background-color: #fff0f0">"Switching Protocols"</span>);
    resp.AddProperty(<span style="background-color: #fff0f0">"Upgrade"</span>, <span style="background-color: #fff0f0">"websocket"</span>);
    resp.AddProperty(<span style="background-color: #fff0f0">"Connection"</span>, <span style="background-color: #fff0f0">"Upgrade"</span>);
    <span style="color: #888888">//Console.WriteLine(req["Sec-WebSocket-Key"]);</span>
    <span style="color: #333399; font-weight: bold">string</span> concat = req[<span style="background-color: #fff0f0">"Sec-WebSocket-Key"</span>]+<span style="background-color: #fff0f0">"258EAFA5-E914-47DA-95CA-C5AB0DC85B11"</span>;
    <span style="color: #333399; font-weight: bold">var</span> s = SHA1.Create();
    <span style="color: #333399; font-weight: bold">byte</span>[] hash = s.ComputeHash(System.Text.Encoding.UTF8.GetBytes(concat));
    resp.AddProperty(<span style="background-color: #fff0f0">"Sec-WebSocket-Accept"</span>, Convert.ToBase64String(hash));
    <span style="color: #888888">//Console.WriteLine(req.ToString());</span>
    <span style="color: #888888">//Console.WriteLine(resp.ToString());</span>
    client.UpgradeToWebsocket();
}
</pre></div>

The key step here is creating the Sec-WebSocket-Accept code. To do this, use the key in the Sec-WebSocket-Key field (in our example: dGhlIHNhbXBsZSBub25jZQ==) add to it the string 258EAFA5-E914-47DA-95CA-C5AB0DC85B11 (See the Mozilla document about this magic string). Compute the SHA1 hash of the string, and convert that to a Base64 String. 

Our result would be s3pPLMBiTxaQ9kYGzzhZRbK+xOo= *(These keys were the demo from the Mozilla site)*  

After that I tell our client handler that it is now a websocket handler, and then some more packet processing fun occurs!  
A Websocket frame has several bit fields and optional fields. The Mozilla page goes over them, and also here is the entire specification. [https://tools.ietf.org/html/rfc6455](https://tools.ietf.org/html/rfc6455)

The WebSocketFrame (in the Websocket.cs) class handles the decoding and encoding of the frames. 

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">public</span> <span style="color: #0066BB; font-weight: bold">WebSocketFrame</span>(<span style="color: #333399; font-weight: bold">byte</span>[] bytes)
{
    <span style="color: #008800; font-weight: bold">this</span>.FIN = (bytes[<span style="color: #6600EE; font-weight: bold">0</span>] &amp; <span style="color: #6600EE; font-weight: bold">0</span>x80) &gt;&gt; <span style="color: #6600EE; font-weight: bold">7</span>;
    <span style="color: #008800; font-weight: bold">this</span>.OpCode = bytes[<span style="color: #6600EE; font-weight: bold">0</span>] &amp; <span style="color: #6600EE; font-weight: bold">0</span>x0F;
    <span style="color: #008800; font-weight: bold">this</span>.Masked = (bytes[<span style="color: #6600EE; font-weight: bold">1</span>] &amp; <span style="color: #6600EE; font-weight: bold">0</span>x80) == <span style="color: #6600EE; font-weight: bold">0</span>x80;
    <span style="color: #008800; font-weight: bold">this</span>.PayloadLength = bytes[<span style="color: #6600EE; font-weight: bold">1</span>] &amp; <span style="color: #6600EE; font-weight: bold">0</span>x7F;
    <span style="color: #333399; font-weight: bold">int</span> nextbyte = <span style="color: #6600EE; font-weight: bold">2</span>;
    <span style="color: #008800; font-weight: bold">if</span> (<span style="color: #008800; font-weight: bold">this</span>.PayloadLength == <span style="color: #6600EE; font-weight: bold">126</span>)
    {
        <span style="color: #008800; font-weight: bold">this</span>.PayloadLength = <span style="color: #6600EE; font-weight: bold">0</span>;
        <span style="color: #008800; font-weight: bold">this</span>.PayloadLength = ((Int64)bytes[nextbyte]) &amp; ((Int64)bytes[nextbyte + <span style="color: #6600EE; font-weight: bold">1</span>]) &lt;&lt; <span style="color: #6600EE; font-weight: bold">8</span>;
        nextbyte += <span style="color: #6600EE; font-weight: bold">2</span>;
    }
    <span style="color: #008800; font-weight: bold">else</span> <span style="color: #0066BB; font-weight: bold">if</span> (<span style="color: #008800; font-weight: bold">this</span>.PayloadLength == <span style="color: #6600EE; font-weight: bold">127</span>)
    {
        <span style="color: #008800; font-weight: bold">this</span>.PayloadLength = <span style="color: #6600EE; font-weight: bold">0</span>;
        <span style="color: #008800; font-weight: bold">for</span> (<span style="color: #333399; font-weight: bold">int</span> i = <span style="color: #6600EE; font-weight: bold">0</span>; i &lt; <span style="color: #6600EE; font-weight: bold">8</span>; i++)
        {
            <span style="color: #008800; font-weight: bold">this</span>.PayloadLength = <span style="color: #008800; font-weight: bold">this</span>.PayloadLength &amp; ((Int64)bytes[nextbyte++]) &lt;&lt; (<span style="color: #6600EE; font-weight: bold">8</span> * i);
        }
    }
    <span style="color: #008800; font-weight: bold">if</span> (<span style="color: #008800; font-weight: bold">this</span>.Masked)
    {
        <span style="color: #008800; font-weight: bold">this</span>.MaskingKey = <span style="color: #008800; font-weight: bold">new</span> <span style="color: #333399; font-weight: bold">byte</span>[<span style="color: #6600EE; font-weight: bold">4</span>];
        <span style="color: #008800; font-weight: bold">for</span> (<span style="color: #333399; font-weight: bold">int</span> i = <span style="color: #6600EE; font-weight: bold">0</span>; i &lt; <span style="color: #6600EE; font-weight: bold">4</span>; i++)
        {
            <span style="color: #008800; font-weight: bold">this</span>.MaskingKey[i] = bytes[nextbyte++];
        }
    }
    <span style="color: #008800; font-weight: bold">this</span>.Payload = <span style="color: #008800; font-weight: bold">new</span> <span style="color: #333399; font-weight: bold">byte</span>[<span style="color: #008800; font-weight: bold">this</span>.PayloadLength];
    <span style="color: #888888">//Probably will cause issues using PayloadLength rather than just the remaining byte count</span>
    Array.Copy(bytes, nextbyte, <span style="color: #008800; font-weight: bold">this</span>.Payload, <span style="color: #6600EE; font-weight: bold">0</span>, <span style="color: #008800; font-weight: bold">this</span>.PayloadLength);
    <span style="color: #008800; font-weight: bold">if</span> (<span style="color: #008800; font-weight: bold">this</span>.Masked)
    {
        <span style="color: #888888">//Decode the message;</span>
        <span style="color: #008800; font-weight: bold">for</span> (<span style="color: #333399; font-weight: bold">int</span> m = <span style="color: #6600EE; font-weight: bold">0</span>; m &lt; <span style="color: #008800; font-weight: bold">this</span>.PayloadLength; m++)
        {
            <span style="color: #008800; font-weight: bold">this</span>.Payload[m] = (<span style="color: #333399; font-weight: bold">byte</span>)(<span style="color: #008800; font-weight: bold">this</span>.Payload[m] ^ <span style="color: #008800; font-weight: bold">this</span>.MaskingKey[m % <span style="color: #6600EE; font-weight: bold">4</span>]);
        }
    }
}
</pre></div>

One interesting note about the WebSocket frame is the XOR Masking of the data from the Client. All client data uses the Mask field, and in order to recover the original payload data, the data has to be iterated over and XOR with the MaskingKey. Data sent from the Server is typically not done this way.  

Once the data is decoded, it is sent back up to the controlling application for handling and responding back with WebSocket data! 

The most basic WebSocket in Javascript sends over string data on the click of a button. 

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">    <span style="color: #333333">&lt;</span>script<span style="color: #333333">&gt;</span>
        <span style="color: #008800; font-weight: bold">var</span> ws <span style="color: #333333">=</span> <span style="color: #008800; font-weight: bold">new</span> WebSocket(<span style="background-color: #fff0f0">"ws://localhost/socket"</span>);
        ws.onopen <span style="color: #333333">=</span> <span style="color: #008800; font-weight: bold">function</span>(e)
        {
            <span style="color: #007020">document</span>.getElementById(<span style="background-color: #fff0f0">"status"</span>).innerText <span style="color: #333333">=</span> <span style="background-color: #fff0f0">"Connection Established"</span>
            <span style="color: #888888">//ws.send("This is a test");</span>
        }
        ws.onmessage <span style="color: #333333">=</span> <span style="color: #008800; font-weight: bold">function</span>(e){
            console.log(e.data);
        }
        <span style="color: #008800; font-weight: bold">function</span> sendmsg()
        {
            ws.send(<span style="background-color: #fff0f0">"Sending from a button"</span>);
        }
    <span style="color: #333333">&lt;</span><span style="color: #FF0000; background-color: #FFFFFF">/script&gt;</span>
</pre></div>

On the server side, I just have it respond to the client with a This is a WebSocket server response!

<p class="blog-img center lg">
    <img src="/images/blog/websocket_request.jpg" alt="">
    <div class="center">HTTP Handshake and data</div>
</p>

And that's it! So far, this seems to get me everything I need to server basic webpages, and establish basic websocket support. The best part is, I wrote it all in .NET Standard 2.0, which means in theory this can be used in all .NET variations. (At least that is how I understand it.)

Happy coding and let me know if you have questions or suggestions!