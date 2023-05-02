---
title: "Scribbler (Servo Plotter)"
date: "2014-11-22"
summary: "I had been wanting to make a plotter for a while. So I finally made a basic one using 3 servos, K-Nex, a raspberry pi and an arduino. I a..."
thumbnail: "/images/blog/2014-11-22-Scribbler_(Servo_Plotter).jpg"
slug: "scribbler-servo-plotter"
---
I had been wanting to make a plotter for a while. So I finally made a basic one using 3 servos, K-Nex, a raspberry pi and an arduino. I am not quite done with this project I want to ultimately have it write out a tweet, which is why the raspberry pi is invovled. The rpi communicates to the arduino over serial. Simple packets xXX, yXX or pXX where XX is an integer. "p" is for the Pen servo. I have the Arduino decode X,Y coordinates into the servo motion. The whole system isn't as precise as I want it to be but it works OK. The next step is to create a library of the alphabet for the servo motions, however there are still some tweaks that will need to happen to get things to work. As you can see I got it to scribble out the CW haha.