---
title: "Card Player: Keras/TensorFlow"
date: "2018-06-23"
summary: "Part 1: Creating a Keras/Tensor Flow Solitaire player. Prepare the Dataset!"
thumbnail: "/images/blog/2018-06-23-Card_Player_KerasTensorFlow.jpg"
slug: "card-player-keras-tensorflow"
tags: ["MachineLearning","ComputerVision","Python"]
---
This we be split over several different blog posts because my end goal is to use machine learning to play solitaire. 

The code is all here: [https://github.com/Corey255A1/PlayingCardsNeuralNet](https://github.com/Corey255A1/PlayingCardsNeuralNet)

* **Phase 1**: [Prepare the data set]({{< ref "/posts/card-player-keras-tensorflow">}})
* **Phase 2**: [Training]({{< ref "/posts/card-player-keras-training">}})
* **Phase 3**: [Simulate Solitaire]({{< ref "/posts/card-player-command-line-solitaire">}})
* **Phase 4**: [Label the playing field]({{< ref "/posts/card-player-detecting-cards">}})

**Phase 1: Prepare the Training Data**

**Gathering Datasets**  
The down side to the current trends in machine learning and AI is that the require lots and lots of labeled data sets to get meaningful results. Datasets like the CIFAR10, CIFAR100 and MNIST have 100s of examples of each category that you are trying to train against. So my first goal was scrounging up as many different full deck of card images I could find. I managed to find 5 complete sets from digging around on google images. To supplement that, I took photos of 3 more real life decks that I had. So I wound up with 8 complete decks of cards. 

Lucky you I have the 8 decks of cards on github here!  
[https://github.com/Corey255A1/PlayingCardsNeuralNet/blob/master/PlayingCards.zip](https://github.com/Corey255A1/PlayingCardsNeuralNet/blob/master/PlayingCards.zip) 

<p class="blog-img center lg">
    <img src="/images/blog/cards8-sm.jpg" alt="">
    <div class="center">Starting Image</div>
</p>

Rather than crop out, save and label each card by hand, I wrote a simple script to parse out the cards.  
Using OpenCV, I grey scale, blur, threshold, dilate and houghlines to find the horizontal and vertical lines. Each set of cards required only minor tweaks to some of the parameters, but by the end I had it pretty general.

<p class="blog-img center lg">
    <img src="/images/blog/cards_process1-sm.jpg" alt="">
    <div class="center">Threshold Image</div>
</p>

At first I was trying to find all of the lines at once, but it turned out to be more reliable to split the houghlines call into a horizontal and vertical call.

*linesH = cv2.HoughLinesP(thresh,1,np.pi/2,900,minLineLength=1800,maxLineGap=20)*

*linesV = cv2.HoughLinesP(thresh,1,np.pi,100,minLineLength=800,maxLineGap=10)*

*alllines = [linesH,linesV]*


The gaps in between the cards results in lots of different lines, but I wanted to boil it down to a single line. I came up with my own little technique to bin the lines that wound up be pretty effective. Basically for each line, I would look at just one of end points x,y. There are two list of baskets and X and a Y basket. The processing on the image limited the lines to be fairly long and discontinuous. That was my assumption. Each different Y value would be a different horizontal line and each different X value would be a vertical line.

<p class="blog-img center lg">
    <img src="/images/blog/cards_process2-sm.jpg" alt="">
    <div class="center">Dividing Lines</div>
</p>

Each Basket had a threshold where if several Ys fell into the same basket, At the end, I would only take the average of that Basket and consider that the end point of a line. 

<p class="blog-img center md">
    <img src="/images/blog/aceofspades.jpg" alt="">
    <div class="center">Extracted Ace</div>
</p>

That in and of itself was a fun dive into OpenCV and image process.. but that was only the first part.

**Augmenting the Data**  
While training the neural network (Next blog post) It became apparent that even with 8 sets of cards, this wasn't going to be enough to be robust. 

There is a technique called augmenting that warps the cards in various controlled ways, to prevent the neural net from over-fitting your training data and make it more reliable in the real world. To be clear, the augmentation part of this happens on the fly during training and you don't have to create more images to use as the training set, although I guess you could do that. 

Some of the augmenting that I did was, Rotate180 (since Cards can be either way), Slight Rotation, Darkness/Lightness, Perspective, Scale, and Blur.

<p class="blog-img center md">
    <img src="/images/blog/card2c_normal.jpg" alt="">
    <div class="center">Unmodified 2 of Clubs</div>
</p>

<p class="blog-img center md">
    <img src="/images/blog/card2c_warped.jpg" alt="">
    <div class="center">Augmented 2 of Clubs</div>
</p>


That is all for the Phase 1 blog! I will post a Phase 2 the actual neural net training process. 

`#MachineLearning #Python #OpenCV`