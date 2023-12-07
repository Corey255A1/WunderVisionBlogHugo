---
title: "Unreal Gingerbread Man"
date: "2023-12-04"
summary: "A basic 3rd person game using Unreal and some assets created in Blender"
bundle: true
thumbnail: "gingerbread_thumb.jpg"
tags: ["Unreal","Blender","3DGraphics"]
---
# Introduction
There is a Gingerbread Man code jam being hosted by the Orlando Unreal community. I liked the idea of it so I decided to use that as something to work towards and put what I've learned so far into action.  
I like trying to do everything from the ground up, but I don't have the time and patientance to create nice looking assets, but I'm going to try it anyway!

# Creating the Gingerbread Man
## Flatman
I started with a plane for the torso, subdivided, then extruded out the arms and legs.  
Next, I created a circle for the head, and to get the radial spokes, I extrude the circle in place. Then scaled those points down to the center and merged the points. I then subdived those lines as well to get the rings. Then I connected some points points from the head to the body to create a neck.
![Flatman](flatman.png)

## Extrudeman
Flatman needs some thickness, so I extruded that plane. Also make sure that any duplicate vertices are removed as well, because that can cause issues later.
To bevel the edges, I selected one entire side, and used the Select Boundary Loops option to select just the outer edge. Then use the bevel tool.

![Extrudeman](extrudeman.png)

## Adding Features
To build the simple gingerbread man features, I subdivided a couple areas of the chest and then extruded his buttons. With the face I just extruded some of the already existing subdivides. I then beveled raised pieces to give them a more low res candy shape.

![Featureman](featureman.png)

## Texturize
Then to give it a basic gingerbread texture, I marked a seam along the outer edge and then unwrapped the UVs. I've sure there are some better things that could be done, but I don't want to spend a ton of time on the blender part. That could become its entire own project!  
I then painted in the eyes and buttons with some basic coloring.

![UV Man](uv_man.png)
![Texture Man](textureman.png)

## Animations
Adding some bones was pretty straight foward since it is a simple mesh. Parent the mesh to the armature and the automatic weights worked well enough for me!
![animationman](animationman.png)

# Make a Candy Cane
The candy cane shape is basically just a bent cylinder. Thats the shape I started with. I then subdivided and then subdivide the upper half and proceded to bend it.

I'm not sure whats going on with the UVs. Again however, I'm not going to spend a ton of time on the assets. haha

![Crappy Cane](crappycane.png)

# Gum Drop
One more asset I thought would be easy to make is a gum drop.
I'm going to start with a cylinder here also. Make the base bigger than the top. Extrude in the top and lower it down to give it the dimple. Then bevel the edges to make it more a candy shape. For this I'm just going to give it a plain candy color material.

![Gum Drop](gumdrop.png)

And with that I'm done with my assets for now!

# Exporting and importing to Unreal
Before exporting, since I have all the objects in one blender file, I have to move them to the center before exporting.
When exporting the Gingerbread, I had to make sure to select the skeleton and the mesh because it wasn't exporting it all at once. (I had export only selected on, but didn't know I needed to select all those pieces explicitly)

![Gingerbread Land](gingerbread_land.png)

And thats all I have so far! I have some rudimentary assets, imported into Unreal. Next will be trying to do something with these assets!!