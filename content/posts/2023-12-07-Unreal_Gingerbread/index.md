---
title: "Unreal Gingerbread Man - Unreal Control"
date: "2023-12-07"
summary: "Beginning to use our gingerbread man assets within Unreal"
bundle: true
draft: true
thumbnail: "gingerbread_thumb.jpg"
tags: ["Unreal","Blender","3DGraphics"]
---
# Introduction
[Git Source](https://github.com/Corey255A1/Unreal-GingerbreadMan/)  
Now that I have some assets, I'm going to start building a level. I'm starting with the Third Person template and going from there.

# Updating the player character
I already imported the assets from Blender and with those came my animations and skeleton. The first thing I did was update the Skeletal Mesh Asset from the BP_ThirdPersonCharacter Blueprint. This immediately, gives us control of a static gingerbread man. Now, however, I want the run animation to work correctly.
## Blend Space
To do this, I have to make a new blendspace. When I started doing this, the standing and walking animations did not blend well. My issue was that the standing animation only had 1 key frame at the start. To make it blend better, I added another key frame at frame 30 so that the animations matched the amount of frames.
For now I have the standing animation at 0,0 and the walking animation at 100,0
Since I'm using only the horizontal axis for now, I name the horizontal axis **Speed** to be used in the Animation Blueprint
## Animation Blueprint
After the basic blend space, it is time to connect it up in the Animation Blueprint