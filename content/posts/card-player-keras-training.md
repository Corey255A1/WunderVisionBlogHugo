---
title: "Card Player: Keras Training"
date: "2018-06-24"
summary: "Part 2: Solitaire Player Series. Training the neural net."
thumbnail: "/images/blog/2018-06-24-Card_Player_Keras_Training.jpg"
slug: "card-player-keras-training"
tags: ["MachineLearning","Python"]
---
In the previous post I talked about gathering data and data augmentation. This post will cover some of the things I encountered while setting up and training the neural network.

* **Phase 1**: [Prepare the data set]({{< ref "/posts/card-player-keras-tensorflow">}})
* **Phase 2**: [Training]({{< ref "/posts/card-player-keras-training">}})
* **Phase 3**: [Simulate Solitaire]({{< ref "/posts/card-player-command-line-solitaire">}})
* **Phase 4**: [Label the playing field]({{< ref "/posts/card-player-detecting-cards">}})

**Phase 2: Training**

The code for the network trainer is of course on github here: [https://github.com/Corey255A1/PlayingCardsNeuralNet/blob/master/PlayingCardID/PlayingCardID/PlayingCardTrainer.py](https://github.com/Corey255A1/PlayingCardsNeuralNet/blob/master/PlayingCardID/PlayingCardID/PlayingCardTrainer.py)

<div class="embed-youtube">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/oPbVpT_USfQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

While training a neural network, there are lots of different ***hyperparameters***. Hyperparameters are input parameters that are chosen before beginning training. Things like, batch size, learning rate, epochs, steps per epoch, training size/validation size ratio, kernal size of the convolution layers, etc. From all of my reading so far into neural nets and hyperparameters, there doesn't seem to be any clear or rules for what these parameters should be. It is really a trial and error game of getting the network to train effectively.

I decided to just squish all of the images into a 128x128 image. Square or rectangle, the network isn't going to really care. You just have to remember to squish the inputs into the trained network to the 128x128 size. When I first started training the network, I figured I could use the color images (red and black I thought would be easy to distinguish). I was trying to use a 128x128x3 input to the network. However, after several attempts the training error would not go down or the validation error would get worse. Attempting to make the network bigger, resulted in running out of graphics memory. (I am running on a 1070 with 8 GB).

So I switched to just using the greyscale image, and I finally started to have some luck. I played around with different learning rates, different amounts of dropout. It seemed that I was still over fitting the training set, but getting that training error down and training accuracy up was still part of the way there. This is when I started applying different types of augmentation to the images and that was the key. Randomly rotating, adjusting the brightness, blurriness and perspective helped bring up the validation accuracy and drive down the error. The resulting network wound up being pretty robust. I tried adding in a random obstruction to the images in the form of a random shaped and shade of rectangle, but the network never seemed to converge with that.

Once I had the network trained that is when I created the real time card detector from the video. It grabs each frame, crops to the blue rectangle that is in the image, scales it to 128x128 and makes it greyscale to pass into the network. 

Success! The network seemed to be pretty reliable with most of the cards I held in front of the camera. And it seemed to not be too susceptible to slight rotations or having the card completely 180.
`#MachineLearning` `#AI`  `#Keras` `#python`