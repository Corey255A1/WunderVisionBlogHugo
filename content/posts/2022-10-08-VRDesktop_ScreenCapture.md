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
```javascript
this._mesh = MeshBuilder.CreatePlane("screen1", {width:scaledWidth, height:scaledHeight}, this._scene);
this._mesh.rotate(Axis.Y, Math.PI);
this._mesh.position.x = -(this._x/500);
this._mesh.position.y = 2;


this._texture = new DynamicTexture("stexture:" + this._x + ":" + this._y, {width:1920, height:1080}, this._scene);
const material: StandardMaterial = new StandardMaterial('smaterial:'+ this._x + ":" + this._y, this._scene);
material.diffuseTexture = this._texture;
material.specularColor = new Color3(1,1,1);
material.emissiveColor = new Color3(1,1,1);
material.ambientColor = new Color3(1,1,1);
this._mesh.material = material;
const font = "bold 24px monospace";
this._texture.drawText('WunderVision',0,100,font,'blue','white');
this._context = this._texture.getContext();
```


When you want to apply the changes, call the update() on the texture.

For this project, the idea was to send the screen captures of the desktop over the websocket and draw them on the mesh. As the first step, I was just sending a static image over. Then after the optimizations I was updating only certain regions of the screens. The initial packet from the server desribes the screen sizes and locations. Then the updates start coming in.

### NodeJS Side
```javascript
const wss = new websocket.WebSocketServer({ server });

wss.on('connection', function connection(client) {
  websocketClients.add(client);
  client.on('message', function message(data) {
    console.log('received: %s', data);
  });
  client.on('close',function close(){
    websocketClients.delete(client);
  });

  client.send(JSON.stringify({cmd:"init",screens:screen_regions}));


});

const id = setInterval(function(){
  screen_regions.forEach((screen, idx)=>{
    const change_list = screen_manager.CaptureScreen(idx);
    if(change_list.length==0){ return; }
    change_list.forEach((region)=>{
      websocketClients.forEach((client)=>{
        client.send(JSON.stringify({cmd:"update", screen:{x:screen.x, y:screen.y}, region:{x:region.x, y:region.y, width:region.width, height:region.height, image:region.image}}));
      });
    });
  });
},100);
```

### Client Side
```javascript
const client = new WebSocket("wss://"+location.host+"/socket");
client.addEventListener('open',()=>{
    client.send("HELLO");
});
client.addEventListener('message',(msg)=>{            
    const jdata = JSON.parse(msg.data);
    switch(jdata.cmd){
        case "init":{
            jdata.screens.forEach((screen=>{
                this._screens.set(
                    screen.x+":"+screen.y,
                    new VRScreenObject(this._scene, 
                        screen.x, screen.y, 
                        screen.width, screen.height));
            }));
        }break;
        case "update":{
            const screen = this._screens.get(jdata.screen.x+":"+jdata.screen.y);
            screen.updateImageBuffer(jdata.region.x, jdata.region.y, jdata.region.width, jdata.region.height, jdata.region.image);
        }break;
    }             
});
```

The image is sent across as a base64 string so that it can be directly injected as the source of an image element. When an image source is updated, it takes some time for the browser to decode it. The load event is fired when the image is ready for rendering. Initially I just had a flag that would monitor the state of that single screen image. When it was in the Decoded state, in the BabylonJS update loop, I would call the drawImage on the texture and repaint the image.

```javascript
engine.runRenderLoop(() => {
    this._screens.forEach((screen)=>{
        screen.update();
    });
    
    this._scene.render();
});
```

Screen Class Update function
```javascript
update(){
    for(let i=0; i<this._image_update_pending.length; i++){
        let img = this._image_update_pending[i];
        if(img.Status == ImageRenderStatus.DECODED){
            this._context.drawImage(
                img.Image, 
                img.Left,
                img.Top,
                img.Width,
                img.Height
            );
            img.Reset();
            this._image_update_pending.splice(i,1);
            this._image_update_buffer.push(img);
        }
    }

    this._texture.update();
}
```


Once I had it working with one virtual screen, I made sure it would work with multiple screens (I have two monitors). Two planes with two dynamic rendering two images received over a websocket! What I noticed though after getting the two planes working, is that a flat plane of screens is not ideal. I decided that I would make the screens curve around a point. The full 360 pixel count is set at 7680 (1920x4).

To get the curved plane I used the MeshBuilder.ExtrudeShape. With that, I draw an arc to the ratio of the screen width, and then extrude that arc to the screen height ratio. I made a VRScreenObject class that would handle its own regional updates and keep track of its own curved mesh. The code is setup up for up to four 1920x1080 screens.
```javascript
//Arch Mesh
//Calculate the curve segment length
//Full Circle 1920*4 = 7680
//20 Segments for full circle
//1920/5
const segment_start = Math.round((this.X / 7680)*20);
const segment_end = Math.round(((this.X+this.Width) / 7680)*20)
const screen_arc = [];
for(let i=segment_start;i<=segment_end; i++){
    screen_arc.push(new Vector3(Math.cos(i*Math.PI/10), Math.sin(i*Math.PI/10),0));
}

const extrusion_path = [
        new Vector3(0, 0, 0),
        new Vector3(0, this.Height/this.Width, 0),
];


this._mesh = MeshBuilder.ExtrudeShape("screen", {shape: screen_arc, path: extrusion_path, sideOrientation: BABYLON.Mesh.BACKSIDE}, this._scene);
this._mesh.position.y = -(this.Height/this.Width/2);
```

The final result of the code is that I am sending over image regions instead of the entire screen. This required a way to buffer up images and wait for them to ready up for rendering. With in the VRScreenObject class I have two arrays of images. One for the currently pending decode and one for the unused ones. When an image update comes in, it pops a unused one off the stack sets its source, and then in the render loop checks for any that have been marked as decoded. Once it is render, that image goes back on the stack.

```javascript
updateImageBuffer(x:number, y:number, width:number, height:number, base64Image:string){
    let image = this._image_update_buffer.pop();
    image.UpdateImageBuffer(x,y,width,height,base64Image);
    this._image_update_pending.push(image);
}
```


Mozilla has a helpful extension that can be added to Firefox and Chrome which is the WebXR API Emulator. It allows you to enter the WebXR mode without having a VR headset to connect. This makes it easy to debug issues that show up in the webxr mode. One thing that I had to check out was the initial head position within the VR space. I am using the easy to use createDefaultXRExperienceAsync() and what I wanted to know is when the XR mode was entered. The VR state change has a callback that can be registered for by using the return value from the createDefaultXRExperienceAsync().

```javascript
async InitializeVR(){
    try {
        var defaultXRExperience = await this._scene.createDefaultXRExperienceAsync();
        defaultXRExperience.baseExperience.onStateChangedObservable.add((state) => {
            switch (state) {
                case WebXRState.IN_XR: 
                defaultXRExperience.baseExperience.camera.position = Vector3.Zero();
                break;
                    // XR is initialized and already submitted one frame
                case WebXRState.ENTERING_XR: 
                    
                    break;
                    // xr is being initialized, enter XR request was made
                case WebXRState.EXITING_XR: break;
                    // xr exit request was made. not yet done.
                case WebXRState.NOT_IN_XR: break;
                    // self explanatory - either out or not yet in XR
            }
        })
    } catch (e) {
        console.log(e);
    }
}
```


The end result of the streaming is not perfect or low latency by any means. However, it is surprising that it works as well as it does. This was a fun exercise putting together several different parts of technology.