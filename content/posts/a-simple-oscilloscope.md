---
title: "A Simple Oscilloscope"
date: "2013-11-16"
summary: "Plagued by the need for real time signal viewing and high price of oscilloscopes, I decided to make a simple arduino/digital oscilloscope..."
thumbnail: "/images/blog/2013-11-16-A_Simple_Oscilloscope.jpg"
slug: "a-simple-oscilloscope"
---
Plagued by the need for real time signal viewing and high price of oscilloscopes, I decided to make a simple arduino/digital oscilloscope to fill the void. Using the Analog input on an Arduino, I have a simple programing that reads in the Analog value and sends it over the serial port. At this point I wrote a C# program that reads the serial port value and plots it in real time. The picture is showing the PWM output of the Arduino that isbeing read back in and sent over the serial port. Have fun with the code below. Arduino Code: C# Code: