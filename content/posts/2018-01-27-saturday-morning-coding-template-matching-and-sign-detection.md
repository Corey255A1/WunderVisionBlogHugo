---
title: "Saturday Morning Coding - Template Matching and Sign Detection"
date: "2018-01-27"
summary: "Using the basic Template Matching feature of OpenCV to detect road signs."
thumbnail: "/images/blog/2018-01-27-Saturday_Morning_Coding_Template_Matching_and_Sign_Detection.jpg"
slug: "saturday-morning-coding-template-matching-and-sign-detection"
tags: ["Python", "ComputerVision"]
---
## Introduction

- [Source Code](https://github.com/Corey255A1/BasicPythonOpenCVTemplateMatch/tree/master/SignDetector)

One of the most recent projects I have been working on is making a off the shelf RC car with the price limit set to $30 into an Autonomous vehicle. That is what sent me off in the direction of machine learning and also computer vision. Eventually the plan is to have a car use neural networks trained to steer the car around a course marked out with edge lines. But I'm not there yet. For now, I wanted to get the car at least moving by itself using visual processing, so today I decided to use a computer vision technique called template matching.

I wrote the code to distinguish between 3 Road signs. Stop, Turn Left and Turn Right. The plan is to place these road signs out and have the car move and follow the signs.

Here is a demo of the code detecting the road signs.

<div class="embed-youtube">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/ndP8KSWO_dY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Template matching works basically by taking a template image, and sliding it across the whole frame and creating a new image of points representing how similar that area is to the template image. The higher the number the more similar that region is to the template. The Green number in the video goes between 0 and 1, 1 meaning the region is exactly the same as the image. In this video below, I show the side by side of the frame from the web cam on the right, and on the left the template matching output. You can see the bright point representing the area of the matched template.

<div class="embed-youtube">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/PNNJyWC3ne0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Next up, getting this to work on the Raspberry pi and controlling the RC car! #SoftwareEngineering #ComputerVision