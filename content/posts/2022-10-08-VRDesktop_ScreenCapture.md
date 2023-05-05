---
title: "VR Desktop: Rendering"
date: "2022-10-08"
summary: "After capturing the screen and passing those images to NodeJS, the next step is to send the updates to the client and render them on the virtual screen."
thumbnail: "/images/blog/2022-10-08-VRDesktop_ScreenCapture_Client.jpg"
slug: "2022-10-08-VRDesktop_ScreenCapture_Client"
tags: ["Javascript","BabylonJS"]
---

After capturing the screen and passing those images to NodeJS, the next step is to send the updates to the client and render them on the virtual screen.

<div class="embed-youtube">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/KFBgEsjaJoc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

The source for the screen capture: [WindowsScreenCaptureLib](https://github.com/Corey255A1/WindowsScreenCaptureLib)

The source for the NodeJS side: [VRDesktopStreamer](https://github.com/Corey255A1/VRDesktopStreamer)

I chose to use BabylonJS because I liked that it had really good typescript support. My background is more of a desktop developer and I like strong typing.
I had dabbled with BabylonJS before however at the time I didn’t have a thorough understanding of typescript or using things like webpack. Compiling a typescript project with BabylonJS would take 30 seconds or so and that would really slow down the normal fast pace development that comes with javascript. I found out that there is a cool trick; the webpack-dev-server. I had known about webpack -w where it would watch the directory for changes and compile. However, that would still take almost the full amount of time to compile. Webpack-dev-server compiles the changes very quickly and even reinitializes the client. This makes minor changes very quick to evaluate. For my application, I am using websockets and WebXR. Both of these things require HTTPS. I keep seeing that the webpack-dev-server --https command is obsolete, however that is what I have been using for now.

As with any project, I like to start with the basics, and then develop it into the more advanced form. I started with a Plane and the DynamicTexture. The DynamicTexture allows you draw on the canvas using the same HTML Canvas Context api. 

<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #d0d0d0">let</span> <span style="color: #d0d0d0">plane1:</span> <span style="color: #d0d0d0">Mesh</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">MeshBuilder.CreatePlane(</span><span style="color: #ed9d13">&quot;screen1&quot;</span><span style="color: #d0d0d0">,</span> <span style="color: #d0d0d0">{size:</span><span style="color: #3677a9">1</span><span style="color: #d0d0d0">},</span> <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._scene);</span>
<span style="color: #d0d0d0">plane1.rotate(Axis.Y,</span> <span style="color: #d0d0d0">Math.PI);</span>

<span style="color: #d0d0d0">let</span> <span style="color: #d0d0d0">dTexture:</span> <span style="color: #d0d0d0">DynamicTexture</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">DynamicTexture(</span><span style="color: #ed9d13">&quot;s1&quot;</span><span style="color: #d0d0d0">,</span> <span style="color: #d0d0d0">{width:</span><span style="color: #3677a9">256</span><span style="color: #d0d0d0">,</span> <span style="color: #d0d0d0">height:</span><span style="color: #3677a9">256</span><span style="color: #d0d0d0">},</span> <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._scene);</span>
<span style="color: #d0d0d0">let</span> <span style="color: #d0d0d0">mat:</span> <span style="color: #d0d0d0">StandardMaterial</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">StandardMaterial(</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">m1</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">,</span> <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._scene);</span>
<span style="color: #d0d0d0">mat.diffuseTexture</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">dTexture;</span>
<span style="color: #d0d0d0">mat.specularColor</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">Color3(</span><span style="color: #3677a9">1</span><span style="color: #d0d0d0">,</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">,</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">);</span>
<span style="color: #d0d0d0">mat.emissiveColor</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">Color3(</span><span style="color: #3677a9">1</span><span style="color: #d0d0d0">,</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">,</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">);</span>
<span style="color: #d0d0d0">mat.ambientColor</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">Color3(</span><span style="color: #3677a9">1</span><span style="color: #d0d0d0">,</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">,</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">);</span>
<span style="color: #d0d0d0">plane1.material</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">mat;</span>

<span style="color: #d0d0d0">let</span> <span style="color: #d0d0d0">font</span> <span style="color: #d0d0d0">=</span> <span style="color: #ed9d13">&quot;bold 24px monospace&quot;</span><span style="color: #d0d0d0">;</span>
<span style="color: #d0d0d0">dTexture.drawText(</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">WunderVision</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">,</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">,</span><span style="color: #3677a9">100</span><span style="color: #d0d0d0">,font,</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">blue</span><span style="color: #ed9d13">&#39;,&#39;</span><span style="color: #d0d0d0">white</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">);</span>
<span style="color: #d0d0d0">let</span> <span style="color: #d0d0d0">ctx</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">dTexture.getContext();</span>
</pre></div>


When you want to apply the changes, call the update() on the texture.

For this project, the idea was to send the screen captures of the desktop over the websocket and draw them on the mesh. As the first step, I was just sending a static image over. Then after the optimizations I was updating only certain regions of the screens. The initial packet from the server desribes the screen sizes and locations. Then the updates start coming in.

### NodeJS Side
<!-- HTML generated using hilite.me --><div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #6ab825; font-weight: bold">const</span> <span style="color: #d0d0d0">wss</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">websocket.WebSocketServer({</span> <span style="color: #d0d0d0">server</span> <span style="color: #d0d0d0">});</span>

<span style="color: #d0d0d0">wss.on(</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">connection</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">,</span> <span style="color: #d0d0d0">function</span> <span style="color: #d0d0d0">connection(client)</span> <span style="color: #d0d0d0">{</span>
  <span style="color: #d0d0d0">websocketClients.</span><span style="color: #6ab825; font-weight: bold">add</span><span style="color: #d0d0d0">(client);</span>
  <span style="color: #d0d0d0">client.on(</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">message</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">,</span> <span style="color: #d0d0d0">function</span> <span style="color: #d0d0d0">message(data)</span> <span style="color: #d0d0d0">{</span>
    <span style="color: #d0d0d0">console.log(</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">received:</span> <span style="color: #d0d0d0">%s</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">,</span> <span style="color: #d0d0d0">data);</span>
  <span style="color: #d0d0d0">});</span>
  <span style="color: #d0d0d0">client.on(</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">close</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">,function</span> <span style="color: #d0d0d0">close(){</span>
    <span style="color: #d0d0d0">websocketClients.delete(client);</span>
  <span style="color: #d0d0d0">});</span>

  <span style="color: #d0d0d0">client.send(JSON.stringify({cmd:</span><span style="color: #ed9d13">&quot;init&quot;</span><span style="color: #d0d0d0">,screens:screen_regions}));</span>


<span style="color: #d0d0d0">});</span>

<span style="color: #6ab825; font-weight: bold">const</span> <span style="color: #d0d0d0">id</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">setInterval(function(){</span>
  <span style="color: #d0d0d0">screen_regions.forEach((screen,</span> <span style="color: #d0d0d0">idx)=&gt;{</span>
    <span style="color: #6ab825; font-weight: bold">const</span> <span style="color: #d0d0d0">change_list</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">screen_manager.CaptureScreen(idx);</span>
    <span style="color: #6ab825; font-weight: bold">if</span><span style="color: #d0d0d0">(change_list.length==</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">){</span><span style="color: #6ab825; font-weight: bold">return</span><span style="color: #d0d0d0">;}</span>
    <span style="color: #d0d0d0">change_list.forEach((region)=&gt;{</span>
      <span style="color: #d0d0d0">websocketClients.forEach((client)=&gt;{</span>
        <span style="color: #d0d0d0">client.send(JSON.stringify({cmd:</span><span style="color: #ed9d13">&quot;update&quot;</span><span style="color: #d0d0d0">,</span> <span style="color: #d0d0d0">screen:{x:screen.x,</span> <span style="color: #d0d0d0">y:screen.y},</span> <span style="color: #d0d0d0">region:{x:region.x,</span> <span style="color: #d0d0d0">y:region.y,</span> <span style="color: #d0d0d0">width:region.width,</span> <span style="color: #d0d0d0">height:region.height,</span> <span style="color: #d0d0d0">image:region.image}}));</span>
      <span style="color: #d0d0d0">});</span>
    <span style="color: #d0d0d0">});</span>
  <span style="color: #d0d0d0">});</span>
<span style="color: #d0d0d0">},</span><span style="color: #3677a9">100</span><span style="color: #d0d0d0">);</span>
</pre></div>

### Client Side

<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #6ab825; font-weight: bold">const</span> <span style="color: #d0d0d0">client</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">WebSocket(</span><span style="color: #ed9d13">&quot;wss://&quot;</span><span style="color: #d0d0d0">+location.host+</span><span style="color: #ed9d13">&quot;/socket&quot;</span><span style="color: #d0d0d0">);</span>
<span style="color: #d0d0d0">client.addEventListener(</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">open</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">,()=&gt;{</span>
    <span style="color: #d0d0d0">client.send(</span><span style="color: #ed9d13">&quot;HELLO&quot;</span><span style="color: #d0d0d0">);</span>
<span style="color: #d0d0d0">});</span>
<span style="color: #d0d0d0">client.addEventListener(</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">message</span><span style="color: #a61717; background-color: #e3d2d2">&#39;</span><span style="color: #d0d0d0">,(msg)=&gt;{</span>            
    <span style="color: #6ab825; font-weight: bold">const</span> <span style="color: #d0d0d0">jdata</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">JSON.parse(msg.data);</span>
    <span style="color: #6ab825; font-weight: bold">switch</span><span style="color: #d0d0d0">(jdata.cmd){</span>
        <span style="color: #6ab825; font-weight: bold">case</span> <span style="color: #ed9d13">&quot;init&quot;</span><span style="color: #d0d0d0">:{</span>
            <span style="color: #d0d0d0">jdata.screens.forEach((screen=&gt;{</span>
                <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._screens.</span><span style="color: #6ab825; font-weight: bold">set</span><span style="color: #d0d0d0">(</span>
                    <span style="color: #d0d0d0">screen.x+</span><span style="color: #ed9d13">&quot;:&quot;</span><span style="color: #d0d0d0">+screen.y,</span>
                    <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #447fcf">VRScreenObject</span><span style="color: #d0d0d0">(</span><span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._scene,</span> 
                        <span style="color: #d0d0d0">screen.x,</span> <span style="color: #d0d0d0">screen.y,</span> 
                        <span style="color: #d0d0d0">screen.width,</span> <span style="color: #d0d0d0">screen.height));</span>
            <span style="color: #d0d0d0">}));</span>
        <span style="color: #d0d0d0">}</span><span style="color: #6ab825; font-weight: bold">break</span><span style="color: #d0d0d0">;</span>
        <span style="color: #6ab825; font-weight: bold">case</span> <span style="color: #ed9d13">&quot;update&quot;</span><span style="color: #d0d0d0">:{</span>
            <span style="color: #6ab825; font-weight: bold">const</span> <span style="color: #d0d0d0">screen</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._screens.</span><span style="color: #6ab825; font-weight: bold">get</span><span style="color: #d0d0d0">(jdata.screen.x+</span><span style="color: #ed9d13">&quot;:&quot;</span><span style="color: #d0d0d0">+jdata.screen.y);</span>
            <span style="color: #d0d0d0">screen.updateImageBuffer(jdata.region.x,</span> <span style="color: #d0d0d0">jdata.region.y,</span> <span style="color: #d0d0d0">jdata.region.width,</span> <span style="color: #d0d0d0">jdata.region.height,</span> <span style="color: #d0d0d0">jdata.region.image);</span>
        <span style="color: #d0d0d0">}</span><span style="color: #6ab825; font-weight: bold">break</span><span style="color: #d0d0d0">;</span>
    <span style="color: #d0d0d0">}</span>             
<span style="color: #d0d0d0">});</span>
</pre></div>


The image is sent across as a base64 string so that it can be directly injected as the source of an image element. When an image source is updated, it takes some time for the browser to decode it. The load event is fired when the image is ready for rendering. Initially I just had a flag that would monitor the state of that single screen image. When it was in the Decoded state, in the BabylonJS update loop, I would call the drawImage on the texture and repaint the image.

<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"> <span style="color: #999999; font-style: italic">// run the main render loop</span>
 <span style="color: #d0d0d0">engine.runRenderLoop(()</span> <span style="color: #d0d0d0">=&gt;</span> <span style="color: #d0d0d0">{</span>
    <span style="color: #999999; font-style: italic">// x+=0.1;</span>
    <span style="color: #999999; font-style: italic">// ctx.fillStyle = &#39;#0033ff&#39;;</span>
    <span style="color: #999999; font-style: italic">// ctx.fillRect(x,0,100,100);</span>
    <span style="color: #6ab825; font-weight: bold">if</span><span style="color: #d0d0d0">(currentObj.ready){</span>
        <span style="color: #d0d0d0">ctx.clearRect(</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">,</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">,</span><span style="color: #3677a9">256</span><span style="color: #d0d0d0">,</span><span style="color: #3677a9">256</span><span style="color: #d0d0d0">);</span>
        <span style="color: #d0d0d0">ctx.drawImage(img,</span> <span style="color: #d0d0d0">currentObj.obj.x,</span> <span style="color: #d0d0d0">currentObj.obj.y,</span> <span style="color: #3677a9">100</span><span style="color: #d0d0d0">,</span> <span style="color: #3677a9">100</span><span style="color: #d0d0d0">);</span>
        <span style="color: #d0d0d0">dTexture.update();</span>
    <span style="color: #d0d0d0">}</span>
    <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._scene.render();</span>
<span style="color: #d0d0d0">});</span>
</pre></div>


Once I had it working with one virtual screen, I made sure it would work with multiple screens (I have two monitors). Two planes with two dynamic rendering two images received over a websocket! What I noticed though after getting the two planes working, is that a flat plane of screens is not ideal. I decided that I would make the screens curve around a point. The full 360 pixel count is set at 7680 (1920x4).

To get the curved plane I used the MeshBuilder.ExtrudeShape. With that, I draw an arc to the ratio of the screen width, and then extrude that arc to the screen height ratio. I made a VRScreenObject class that would handle its own regional updates and keep track of its own curved mesh. The code is setup up for up to four 1920x1080 screens.

<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #999999; font-style: italic">//Arch Mesh</span>
<span style="color: #999999; font-style: italic">//Calculate the curve segment length</span>
<span style="color: #999999; font-style: italic">//Full Circle 1920*4 = 7680</span>
<span style="color: #999999; font-style: italic">//20 Segments for full circle</span>
<span style="color: #999999; font-style: italic">//1920/5</span>
<span style="color: #6ab825; font-weight: bold">const</span> <span style="color: #d0d0d0">segment_start</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">Math.round((</span><span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">.X</span> <span style="color: #d0d0d0">/</span> <span style="color: #3677a9">7680</span><span style="color: #d0d0d0">)*</span><span style="color: #3677a9">20</span><span style="color: #d0d0d0">);</span>
<span style="color: #6ab825; font-weight: bold">const</span> <span style="color: #d0d0d0">segment_end</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">Math.round(((</span><span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">.X+</span><span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">.Width)</span> <span style="color: #d0d0d0">/</span> <span style="color: #3677a9">7680</span><span style="color: #d0d0d0">)*</span><span style="color: #3677a9">20</span><span style="color: #d0d0d0">)</span>
<span style="color: #6ab825; font-weight: bold">const</span> <span style="color: #d0d0d0">screen_arc</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">[];</span>
<span style="color: #6ab825; font-weight: bold">for</span><span style="color: #d0d0d0">(let</span> <span style="color: #d0d0d0">i=segment_start;i&lt;=segment_end;</span> <span style="color: #d0d0d0">i++){</span>
    <span style="color: #d0d0d0">screen_arc.push(</span><span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">Vector3(Math.cos(i*Math.PI/</span><span style="color: #3677a9">10</span><span style="color: #d0d0d0">),</span> <span style="color: #d0d0d0">Math.sin(i*Math.PI/</span><span style="color: #3677a9">10</span><span style="color: #d0d0d0">),</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">));</span>
<span style="color: #d0d0d0">}</span>

<span style="color: #6ab825; font-weight: bold">const</span> <span style="color: #d0d0d0">extrusion_path</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">[</span>
        <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #447fcf">Vector3</span><span style="color: #d0d0d0">(</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">,</span> <span style="color: #3677a9">0</span><span style="color: #d0d0d0">,</span> <span style="color: #3677a9">0</span><span style="color: #d0d0d0">),</span>
        <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #447fcf">Vector3</span><span style="color: #d0d0d0">(</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">,</span> <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">.Height/</span><span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">.Width,</span> <span style="color: #3677a9">0</span><span style="color: #d0d0d0">),</span>
<span style="color: #d0d0d0">];</span>


<span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._mesh</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">MeshBuilder.ExtrudeShape(</span><span style="color: #ed9d13">&quot;screen&quot;</span><span style="color: #d0d0d0">,</span> <span style="color: #d0d0d0">{shape:</span> <span style="color: #d0d0d0">screen_arc,</span> <span style="color: #d0d0d0">path:</span> <span style="color: #d0d0d0">extrusion_path,</span> <span style="color: #d0d0d0">sideOrientation:</span> <span style="color: #d0d0d0">BABYLON.Mesh.BACKSIDE},</span> <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._scene);</span>
<span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._mesh.position.y</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">-(</span><span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">.Height/</span><span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">.Width/</span><span style="color: #3677a9">2</span><span style="color: #d0d0d0">);</span>
</pre></div>


The final result of the code is that I am sending over image regions instead of the entire screen. This required a way to buffer up images and wait for them to ready up for rendering. With in the VRScreenObject class I have two arrays of images. One for the currently pending decode and one for the unused ones. When an image update comes in, it pops a unused one off the stack sets its source, and then in the render loop checks for any that have been marked as decoded. Once it is render, that image goes back on the stack.

<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #d0d0d0">updateImageBuffer(x:number,</span> <span style="color: #d0d0d0">y:number,</span> <span style="color: #d0d0d0">width:number,</span> <span style="color: #d0d0d0">height:number,</span> <span style="color: #d0d0d0">base64Image:</span><span style="color: #6ab825; font-weight: bold">string</span><span style="color: #d0d0d0">){</span>
    <span style="color: #d0d0d0">let</span> <span style="color: #d0d0d0">image</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._image_update_buffer.pop();</span>
    <span style="color: #d0d0d0">image.UpdateImageBuffer(x,y,width,height,base64Image);</span>
    <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._image_update_pending.push(image);</span>
<span style="color: #d0d0d0">}</span>

<span style="color: #d0d0d0">update(){</span>
    <span style="color: #6ab825; font-weight: bold">for</span><span style="color: #d0d0d0">(let</span> <span style="color: #d0d0d0">i=</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">;</span> <span style="color: #d0d0d0">i&lt;</span><span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._image_update_pending.length;</span> <span style="color: #d0d0d0">i++){</span>
        <span style="color: #d0d0d0">let</span> <span style="color: #d0d0d0">img</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._image_update_pending[i];</span>
        <span style="color: #6ab825; font-weight: bold">if</span><span style="color: #d0d0d0">(img.Status</span> <span style="color: #d0d0d0">==</span> <span style="color: #d0d0d0">ImageRenderStatus.DECODED){</span>
            <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._context.drawImage(</span>
                <span style="color: #d0d0d0">img.Image,</span> 
                <span style="color: #d0d0d0">img.Left,</span>
                <span style="color: #d0d0d0">img.Top,</span>
                <span style="color: #d0d0d0">img.Width,</span>
                <span style="color: #d0d0d0">img.Height</span>
            <span style="color: #d0d0d0">);</span>
            <span style="color: #d0d0d0">img.Reset();</span>
            <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._image_update_pending.splice(i,</span><span style="color: #3677a9">1</span><span style="color: #d0d0d0">);</span>
            <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._image_update_buffer.push(img);</span>
        <span style="color: #d0d0d0">}</span>
    <span style="color: #d0d0d0">}</span>
    <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._texture.update();</span>
<span style="color: #d0d0d0">}</span>
</pre></div>



Mozilla has a helpful extension that can be added to Firefox and Chrome which is the WebXR API Emulator. It allows you to enter the WebXR mode without having a VR headset to connect. This makes it easy to debug issues that show up in the webxr mode. One thing that I had to check out was the initial head position within the VR space. I am using the easy to use createDefaultXRExperienceAsync() and what I wanted to know is when the XR mode was entered. The VR state change has a callback that can be registered for by using the return value from the createDefaultXRExperienceAsync().

<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #6ab825; font-weight: bold">async</span> <span style="color: #447fcf">InitializeVR</span><span style="color: #d0d0d0">(){</span>
    <span style="color: #6ab825; font-weight: bold">try</span> <span style="color: #d0d0d0">{</span>
        <span style="color: #6ab825; font-weight: bold">var</span> <span style="color: #d0d0d0">defaultXRExperience</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">await</span> <span style="color: #6ab825; font-weight: bold">this</span><span style="color: #d0d0d0">._scene.createDefaultXRExperienceAsync();</span>
        <span style="color: #d0d0d0">defaultXRExperience.baseExperience.onStateChangedObservable.</span><span style="color: #6ab825; font-weight: bold">add</span><span style="color: #d0d0d0">((state)</span> <span style="color: #d0d0d0">=&gt;</span> <span style="color: #d0d0d0">{</span>
            <span style="color: #6ab825; font-weight: bold">switch</span> <span style="color: #d0d0d0">(state)</span> <span style="color: #d0d0d0">{</span>
                <span style="color: #6ab825; font-weight: bold">case</span> <span style="color: #d0d0d0">WebXRState.IN_XR:</span> 
                <span style="color: #d0d0d0">defaultXRExperience.baseExperience.camera.position</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">Vector3.Zero();</span>
                <span style="color: #6ab825; font-weight: bold">break</span><span style="color: #d0d0d0">;</span>
                    <span style="color: #999999; font-style: italic">// XR is initialized and already submitted one frame</span>
                <span style="color: #6ab825; font-weight: bold">case</span> <span style="color: #d0d0d0">WebXRState.ENTERING_XR:</span> 
                    <span style="color: #6ab825; font-weight: bold">break</span><span style="color: #d0d0d0">;</span>
                    <span style="color: #999999; font-style: italic">// xr is being initialized, enter XR request was made</span>
                <span style="color: #6ab825; font-weight: bold">case</span> <span style="color: #d0d0d0">WebXRState.EXITING_XR:</span> <span style="color: #6ab825; font-weight: bold">break</span><span style="color: #d0d0d0">;</span>
                    <span style="color: #999999; font-style: italic">// xr exit request was made. not yet done.</span>
                <span style="color: #6ab825; font-weight: bold">case</span> <span style="color: #d0d0d0">WebXRState.NOT_IN_XR:</span> <span style="color: #6ab825; font-weight: bold">break</span><span style="color: #d0d0d0">;</span>
                    <span style="color: #999999; font-style: italic">// self explanatory - either out or not yet in XR</span>
            <span style="color: #d0d0d0">}</span>
        <span style="color: #d0d0d0">})</span>
    <span style="color: #d0d0d0">}</span> <span style="color: #6ab825; font-weight: bold">catch</span> <span style="color: #d0d0d0">(e)</span> <span style="color: #d0d0d0">{</span>
        <span style="color: #d0d0d0">console.log(e);</span>
    <span style="color: #d0d0d0">}</span>
<span style="color: #d0d0d0">}</span>
</pre></div>



The end result of the streaming is not perfect or low latency by any means. However, it is surprising that it works as well as it does. This was a fun exercise putting together several different parts of technology.