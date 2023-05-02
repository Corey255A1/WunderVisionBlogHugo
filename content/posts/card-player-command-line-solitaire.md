---
title: "Card Player: Command Line Solitaire"
date: "2018-07-04"
summary: "Part 3: Solitaire Player Series. Creating a Solitaire environment."
thumbnail: "/images/blog/2018-07-04-Card_Player_Command_Line_Solitaire.jpg"
slug: "card-player-command-line-solitaire"
---
This is Phase 3 of the Card Player series I have been blogging about. I am attempting to make a Solitaire playing bot. 

* **Phase 1**: [Prepare the data set](/single-post/card-player-keras-tensorflow)
* **Phase 2**: [Training](/single-post/card-player-keras-training)
* **Phase 4**: [Label the playing field](/single-post/card-player-detecting-cards)

**Phase 3: Simulating Solitaire**

[https://github.com/Corey255A1/PlayingCardsNeuralNet/blob/master/PlayingCardID/PlayingCardID/Solitaire.py](https://github.com/Corey255A1/PlayingCardsNeuralNet/blob/master/PlayingCardID/PlayingCardID/Solitaire.py)

<div class="embed-youtube">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/nR2Lse6cak4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>


The approach I took to simulating Klondike (Solitaire) is at each step, find all of the valid moves and present those to the user. Rather than validate the user's action after the fact. I wanted to do it this way to make it easier to train a machine in how to determine the best strategy. This way I don't have to worry about also training the machine what the valid moves are because in this world the only moves possible are valid ones.

[https://github.com/Corey255A1/PlayingCardsNeuralNet/blob/master/PlayingCardID/PlayingCardID/SolitaireSimulator.py](https://github.com/Corey255A1/PlayingCardsNeuralNet/blob/master/PlayingCardID/PlayingCardID/SolitaireSimulator.py)

This intermediate step of creating a command line based version of solitaire is necessary to have a machine rapidly learn how to play. 

Run SolitaireSimulator.py to play the command line version!

<p class="blog-img center md">
    <img src="/images/blog/commandlinesolitaire.jpg" alt="">
    <div class="center">Command Line Solitaire</div>
</p>

Once the machine knows how to play effectively in the simulation world, then the next step is to present it with inputs from the screen based version of solitaire. At that point I will have to worry about moving the mouse and dragging and dropping the right cards in to the right places. That will be its own challenge.

`#python #computerscience #MachineLearning`