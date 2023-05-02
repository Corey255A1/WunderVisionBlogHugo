---
title: ".NET Standard Simple HTTP Server"
date: "2019-03-09"
summary: "Like the title suggests, we are going to build a simple HTTP Server"
thumbnail: "/images/blog/2019-03-09-NET_Standard_Simple_HTTP_Server.jpg"
slug: "net-standard-simple-http-server"
---
Like the title suggests, we are going to build a simple HTTP Server.  
[https://github.com/Corey255A1/BareBonesHttpServer](https://github.com/Corey255A1/BareBonesHttpServer)  
**Suggested Reading**  
[https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)

### TCP Server
At its core, an HTTP Server is just a TCP Server with a specific packet protocol. Typically webpages are hosted on port 80 for HTTP and 443 for HTTPS. But it can be any port really. Your browser just defaults and makes the assumption of it being on one of those. In the HttpServer class, StartListening loops and waits for a client to connect to the TCP Server.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #333399; font-weight: bold">var</span> client = <span style="color: #008800; font-weight: bold">await</span> <span style="color: #008800; font-weight: bold">this</span>._server.AcceptTcpClientAsync();
<span style="color: #008800; font-weight: bold">if</span> ((HttpNewClientConnected!=<span style="color: #008800; font-weight: bold">null</span> &amp;&amp; HttpNewClientConnected.Invoke(client)) || HttpNewClientConnected==<span style="color: #008800; font-weight: bold">null</span>)
{
    <span style="color: #333399; font-weight: bold">var</span> httpc = <span style="color: #008800; font-weight: bold">new</span> HttpClientHandler(client);
    httpc.HttpRequestReceived += HttpRequestReceived;
    httpc.WebSocketDataReceived += HttpWebSocketDataReceived;
    _clients[client.Client.RemoteEndPoint]=httpc;
}
</pre></div>

The StartListening method is an Asynchronous method. This means that if you call it with out using the await, it spins off on to a different task/thread automatically. Within that we have a loop that is Asynchronous listening for clients. The HttpNewClientConnected has a bool return so that in the future I can filter out client connections.

I get the TcpClient and create a wrapper HttpClientHandler to handle the HTTP processing for that client.

The constructor of the HttpClientHandler saves off the NetworkStream and the client information and then begins reading. Which is another Async method that loops and reads from the stream.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #333399; font-weight: bold">int</span> bytesread = <span style="color: #008800; font-weight: bold">await</span> _stream.ReadAsync(_buffer, <span style="color: #6600EE; font-weight: bold">0</span>, BUFFERSIZE);
<span style="color: #008800; font-weight: bold">while</span> (bytesread &gt; <span style="color: #6600EE; font-weight: bold">0</span>)
{
    
    <span style="color: #008800; font-weight: bold">if</span> (!<span style="color: #008800; font-weight: bold">this</span>.WebSocketUpgrade)
    {
        <span style="color: #333399; font-weight: bold">string</span> msg = System.Text.Encoding.UTF8.GetString(_buffer);
        HttpRequest h = <span style="color: #008800; font-weight: bold">new</span> HttpRequest(msg);
        HttpRequestReceived?.Invoke(<span style="color: #008800; font-weight: bold">this</span>, h);
    }
    <span style="color: #008800; font-weight: bold">else</span>
    {
        <span style="color: #888888">//Not handling Multiple Frames worth of data...</span>
        WebSocketFrame frame = <span style="color: #008800; font-weight: bold">new</span> WebSocketFrame(_buffer);
        WebSocketDataReceived?.Invoke(<span style="color: #008800; font-weight: bold">this</span>, frame);
        <span style="color: #888888">//Console.WriteLine(Encoding.UTF8.GetString(frame.Payload));</span>
    }
    bytesread = <span style="color: #008800; font-weight: bold">await</span> _stream.ReadAsync(_buffer, <span style="color: #6600EE; font-weight: bold">0</span>, BUFFERSIZE);
}
</pre></div>

You can see how there is some code in there for handling WebSocket connections. We will get there.

### HTTP Packets
First though we will focus on the HttpRequest. I'm assuming HTTP1.1 plain text UTF8 packets.

[Example Request, There is a lot more data that comes through typically]

GET / HTTP/1.1  
Host: WunderVision  
Accept-Language: en-US  

[Here is one that I captured from a Firefox request] 

GET / HTTP/1.1  
Host: localhost  
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0  
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8  
Accept-Language: en-US,en;q=0.5  
Accept-Encoding: gzip, deflate  
Connection: keep-alive  
Upgrade-Insecure-Requests: 1  

I made the most basic HttpContainer which is basically a map that handles the Key, Value pairs from the Http Header.

A co-worker had brought to my attention the other day that you can override the [] operator of a C# Class, so this makes it a convenient way to access the elements of the HTTP header.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">string</span> <span style="color: #008800; font-weight: bold">this</span>[<span style="color: #333399; font-weight: bold">string</span> obj]
{
    <span style="color: #008800; font-weight: bold">get</span>
    {
        <span style="color: #008800; font-weight: bold">return</span> _properties.ContainsKey(obj) ? _properties[obj] : <span style="background-color: #fff0f0">""</span>;
    }
    <span style="color: #008800; font-weight: bold">set</span>
    {
        <span style="color: #008800; font-weight: bold">if</span> (_properties.ContainsKey(obj)) { _properties[obj] = <span style="color: #008800; font-weight: bold">value</span>; } <span style="color: #008800; font-weight: bold">else</span> { _properties.Add(obj, <span style="color: #008800; font-weight: bold">value</span>); }
    }
}
</pre></div>

I made two derived classes from the HttpContainer, HttpRequest and HttpResponse, The HttpRequest decodes the first line of the HttpHeader (example Get / HTTP1.1) and assigns them to their appropriate Property names. This way all pieces of the HTTP Request can be accessed the same way.

The HttpResponse is a little bit different. It has the capability to add on Http Content. (i.e html, .png, .jpg, etc). They have the GetBytes method which recombines the key/values in to a string and then gets the packet as an array of UTF8 Bytes. 

The HttpClientHandler decodes the packet and passes it back up to the to the handling application for processing. I want to add one more layer to the code, but for now I have a test application (SimpleWebHost) that is handling the various HTTP Requests.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">private</span> <span style="color: #008800; font-weight: bold">static</span> <span style="color: #008800; font-weight: bold">void</span> <span style="color: #0066BB; font-weight: bold">ClientRequest</span>(HttpClientHandler client, HttpRequest req)
{
    HttpResponse resp = <span style="color: #008800; font-weight: bold">null</span>;
    <span style="color: #888888">//Console.WriteLine(req.ToString());</span>
    <span style="color: #008800; font-weight: bold">if</span> (req[<span style="background-color: #fff0f0">"Request"</span>] == <span style="background-color: #fff0f0">"GET"</span>)
    {
        <span style="color: #333399; font-weight: bold">string</span> uri = req[<span style="background-color: #fff0f0">"URI"</span>];
        <span style="color: #008800; font-weight: bold">if</span> (uri == <span style="background-color: #fff0f0">"/"</span>)
        {
            resp = <span style="color: #008800; font-weight: bold">new</span> HttpResponse(<span style="background-color: #fff0f0">"HTTP/1.1"</span>, <span style="background-color: #fff0f0">"200"</span>, <span style="background-color: #fff0f0">"OK"</span>);
            resp.AddProperty(<span style="background-color: #fff0f0">"Date"</span>, DateTime.Now.ToShortDateString());
            resp.AddProperty(<span style="background-color: #fff0f0">"Server"</span>, <span style="background-color: #fff0f0">"WunderVision"</span>);
            resp.AddProperty(<span style="background-color: #fff0f0">"Content-Type"</span>, <span style="background-color: #fff0f0">"text/html;charset=UTF-8"</span>);
            resp.SetData(Site);
        }
</pre></div>

Here is the most basic response back to the client site. And you can see how the [] override makes it easy to get the data. First we see if the Request packet type is a GET. Then we get the URI that is requested. If it is the root / we create our default response. I don't think I'm sending the Date format back right, but it doesn't seem to affect Firefox, Chrome or Edge haha. You can see how I'm filling out just the basic response fields. There is a lot more information that can be sent back, but I'm only sticking with the minimum. The SetData(Site) is just setting the content of the header to the string version of an HTML file I read above in the program.

[Example of the response]  
HTTP/1.1 200 OK  
Date:  Sat, 09 March 2019 13:09:02 GMT  
Server: WunderVision  
Content-Type: text/html;charset=UTF-8   
Content-Length: 1327  
<html .... some html data from a file ...

Using my library, setting the data, fills out the Content-Length automatically. And that is it basically for serving up and a webpage over HTTP! The other pieces are serving back the Images or Javascript. You can see there is the Content-Type which tells the browser what kind of data is in the response. In the HttpTools class there are some static functions that assign the basic MIME type for a handful of file types.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">case</span> <span style="background-color: #fff0f0">".ico"</span>: <span style="color: #008800; font-weight: bold">return</span> <span style="background-color: #fff0f0">"image/x-icon"</span>;
<span style="color: #008800; font-weight: bold">case</span> <span style="background-color: #fff0f0">".jpg"</span>: <span style="color: #008800; font-weight: bold">return</span> <span style="background-color: #fff0f0">"image/jpeg"</span>;
<span style="color: #008800; font-weight: bold">case</span> <span style="background-color: #fff0f0">".png"</span>: <span style="color: #008800; font-weight: bold">return</span> <span style="background-color: #fff0f0">"image/png"</span>;
<span style="color: #008800; font-weight: bold">case</span> <span style="background-color: #fff0f0">".gif"</span>: <span style="color: #008800; font-weight: bold">return</span> <span style="background-color: #fff0f0">"image/gif"</span>;
<span style="color: #008800; font-weight: bold">case</span> <span style="background-color: #fff0f0">".css"</span>: <span style="color: #008800; font-weight: bold">return</span> <span style="background-color: #fff0f0">"text/css"</span>;
<span style="color: #008800; font-weight: bold">case</span> <span style="background-color: #fff0f0">".js"</span>: <span style="color: #008800; font-weight: bold">return</span> <span style="background-color: #fff0f0">"text/javascript"</span>;
<span style="color: #008800; font-weight: bold">case</span> <span style="background-color: #fff0f0">".json"</span>: <span style="color: #008800; font-weight: bold">return</span> <span style="background-color: #fff0f0">"application/json"</span>;
<span style="color: #008800; font-weight: bold">case</span> <span style="background-color: #fff0f0">".html"</span>:
<span style="color: #008800; font-weight: bold">case</span> <span style="background-color: #fff0f0">".htm"</span>:
<span style="color: #008800; font-weight: bold">default</span>:
    <span style="color: #008800; font-weight: bold">return</span> <span style="background-color: #fff0f0">"text/html"</span>;
</pre></div>

This obviously doesn't cover everything, and isn't very extensible. But the name of the game was to be simple!

There is the piece of code that looks for all other files that are requested with in our root serving directory and builds the appropriate response back depending on the file type.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">Uri requestedfile = <span style="color: #008800; font-weight: bold">new</span> Uri(Root + uri);
<span style="color: #888888">//Console.WriteLine(requestedfile.LocalPath);</span>
<span style="color: #008800; font-weight: bold">if</span> (File.Exists(requestedfile.LocalPath))
{
    <span style="color: #333399; font-weight: bold">string</span> mime = HttpTools.GetFileMimeType(uri);
    <span style="color: #888888">//Console.WriteLine(mime);</span>
    <span style="color: #333399; font-weight: bold">byte</span>[] data;
    <span style="color: #008800; font-weight: bold">if</span> (HttpTools.IsFileBinary(uri))
    {
        data = File.ReadAllBytes(requestedfile.LocalPath);
    }
    <span style="color: #008800; font-weight: bold">else</span>
    {
        data = System.Text.Encoding.UTF8.GetBytes(File.ReadAllText(requestedfile.LocalPath));
    }
    resp = <span style="color: #008800; font-weight: bold">new</span> HttpResponse(<span style="background-color: #fff0f0">"HTTP/1.1"</span>, <span style="background-color: #fff0f0">"200"</span>, <span style="background-color: #fff0f0">"OK"</span>);
    resp.AddProperty(<span style="background-color: #fff0f0">"Date"</span>, DateTime.Now.ToShortDateString());
    resp.AddProperty(<span style="background-color: #fff0f0">"Server"</span>, <span style="background-color: #fff0f0">"WunderVision"</span>);
    resp.AddProperty(<span style="background-color: #fff0f0">"Content-Type"</span>, mime);
    resp.SetData(data);
}
</pre></div>

And with that, we can serve up some basic webpages all with images, CSS and Javascript!

<p class="blog-img center lg">
    [IMAGE(serving_webpage.jpg)]
    <div class="center">HTTP Handshake and data</div>
</p>


Here I'm we can see it processing the requests for all of the pieces to the DragWindow.html page (can be found here: [https://corey255a1.github.io/DragWindow/DragWindow.html](https://corey255a1.github.io/DragWindow/DragWindow.html))

However, I wasn't done, I also need basic WebSocket support ...