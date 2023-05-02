---
title: "Smartphone Controlled Camera Tripod"
date: "2014-02-08"
summary: "A smartphone controlled camera tripod. Using a GUI in a cool scripting language called FASL on the Android market, I am able to control t..."
thumbnail: "/images/blog/2014-02-08-Smartphone_Controlled_Camera_Tripod.jpg"
slug: "smartphone-controlled-camera-tripod"
---
A smartphone controlled camera tripod. Using a GUI in a cool scripting language called FASL on the Android market, I am able to control the position of the camera by clicking buttons on my phone. The script on the phone sends out control commands over TCP to a TCP port listener written in Python on the Raspberry Pi. The Raspberry Pi then sends serial commands to an Arduino which then translates those messages and controls the servos accordingly.