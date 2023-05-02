---
title: "Card Player: Detecting Cards"
date: "2018-07-04"
summary: "Part 4: Solitaire Player Series. Card Image detection using OpenCV."
thumbnail: "/images/blog/2018-07-04-Card_Player_Detecting_Cards.jpg"
slug: "card-player-detecting-cards"
---
**Phase 4** of my Card Player series. I am attempting to create a solitaire playing bot in python. 

* **Phase 1**: [Prepare the data set](/single-post/card-player-keras-tensorflow)
* **Phase 2**: [Training](/single-post/card-player-keras-training)
* **Phase 3**: [Simulate Solitaire](/single-post/card-player-command-line-solitaire)

Here is the location of the source code for this project: https://github.com/Corey255A1/PlayingCardsNeuralNet 

<div class="embed-youtube">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/nJPVZGcZZyQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

I first had to figure out how to extract out all of the top most cards for labeling. This proved a little challenging since the cards can be offset by various degrees. Also when the stack has several face up ones stacked up, it looks like a single blob during processing. 

So my processing steps include, blurring, thresholding based on HSV, and eroding.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">    <span style="color: #008800; font-weight: bold">def</span> <span style="color: #0066BB; font-weight: bold">__getImageMask</span>(<span style="color: #007020">self</span>,img):
        hsv <span style="color: #333333">=</span> cv2<span style="color: #333333">.</span>cvtColor(img,cv2<span style="color: #333333">.</span>COLOR_BGR2HSV)
        hsv <span style="color: #333333">=</span> cv2<span style="color: #333333">.</span>GaussianBlur(hsv,(<span style="color: #0000DD; font-weight: bold">15</span>,<span style="color: #0000DD; font-weight: bold">15</span>),<span style="color: #0000DD; font-weight: bold">0</span>)
        mask <span style="color: #333333">=</span> cv2<span style="color: #333333">.</span>inRange(hsv, <span style="color: #007020">self</span><span style="color: #333333">.</span>__lower_thresh, <span style="color: #007020">self</span><span style="color: #333333">.</span>__upper_thresh)
        mask <span style="color: #333333">=</span> cv2<span style="color: #333333">.</span>erode(mask,(<span style="color: #0000DD; font-weight: bold">5</span>,<span style="color: #0000DD; font-weight: bold">5</span>),iterations<span style="color: #333333">=</span><span style="color: #0000DD; font-weight: bold">4</span>)
        <span style="color: #888888">#cv2.imshow("mask",mask)</span>
        <span style="color: #888888">#cv2.waitKey()</span>
        <span style="color: #008800; font-weight: bold">return</span> mask
</pre></div>

That produces the black and white image on the right. As you can see, the 5 and 4 kind of get combined into a super card. I had to do some extra calculations to get just the top facing card portion of the blob. 

I leverage the fact that a card can be only a certain size and the fact that the top card is always the furthest down. 

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">    <span style="color: #008800; font-weight: bold">def</span> <span style="color: #0066BB; font-weight: bold">__getBoundingRects</span>(<span style="color: #007020">self</span>,mask):
        (im2, conts, ret) <span style="color: #333333">=</span> cv2<span style="color: #333333">.</span>findContours(mask,cv2<span style="color: #333333">.</span>RETR_EXTERNAL,cv2<span style="color: #333333">.</span>CHAIN_APPROX_SIMPLE)
        <span style="color: #008800; font-weight: bold">for</span> c <span style="color: #000000; font-weight: bold">in</span> conts:
            p <span style="color: #333333">=</span> cv2<span style="color: #333333">.</span>arcLength(c,<span style="color: #007020">True</span>)
            <span style="color: #008800; font-weight: bold">if</span> p <span style="color: #333333">&gt;</span> <span style="color: #0000DD; font-weight: bold">500</span>:
                a <span style="color: #333333">=</span> cv2<span style="color: #333333">.</span>approxPolyDP(c,<span style="color: #6600EE; font-weight: bold">0.03</span><span style="color: #333333">*</span>p,<span style="color: #007020">True</span>)
                <span style="color: #008800; font-weight: bold">if</span> <span style="color: #007020">len</span>(a) <span style="color: #333333">&gt;=</span> <span style="color: #0000DD; font-weight: bold">4</span>: <span style="color: #888888">#Four Points</span>
                    (x,y,w,h) <span style="color: #333333">=</span> cv2<span style="color: #333333">.</span>boundingRect(a)
                    <span style="color: #888888">#Account for vertical card stack</span>
                    <span style="color: #008800; font-weight: bold">if</span> h<span style="color: #333333">&gt;</span><span style="color: #007020">self</span><span style="color: #333333">.</span>__cardHeight:
                        y<span style="color: #333333">=</span>(y<span style="color: #333333">+</span>h)<span style="color: #333333">-</span><span style="color: #007020">self</span><span style="color: #333333">.</span>__cardHeight
                        h<span style="color: #333333">=</span><span style="color: #007020">self</span><span style="color: #333333">.</span>__cardHeight
                    <span style="color: #888888">#Account for horizontal card stack</span>
                    <span style="color: #008800; font-weight: bold">if</span> w<span style="color: #333333">&gt;</span><span style="color: #007020">self</span><span style="color: #333333">.</span>__cardWidth:
                        x<span style="color: #333333">=</span>(x<span style="color: #333333">+</span>w)<span style="color: #333333">-</span><span style="color: #007020">self</span><span style="color: #333333">.</span>__cardWidth
                        w<span style="color: #333333">=</span><span style="color: #007020">self</span><span style="color: #333333">.</span>__cardWidth
                    <span style="color: #008800; font-weight: bold">yield</span> (x,y,w,h)  
</pre></div>

In the end we wind up with a bunch of rectangles around things. Now I do a check if it is longer than a card, I crop it to only the bottom part of it. If it is wider than a card, I crop it to only the right side of it. This accounts for long columns and the offset discard pile. 

Once we have all of those rectangles, the script then extracts the pixels from each rectangle and passes them in to the neural network to determine what card it is.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">    <span style="color: #008800; font-weight: bold">def</span> <span style="color: #0066BB; font-weight: bold">GetCurrentCards</span>(<span style="color: #007020">self</span>,img):
        mask <span style="color: #333333">=</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>__getImageMask(img)
        cardmap <span style="color: #333333">=</span> {}
        <span style="color: #008800; font-weight: bold">for</span> (x,y,w,h) <span style="color: #000000; font-weight: bold">in</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>__getBoundingRects(mask):
            extract <span style="color: #333333">=</span> img[y:y<span style="color: #333333">+</span>h,x:x<span style="color: #333333">+</span>w]
            <span style="color: #888888">#cv2.imshow("extract",extract)</span>
            <span style="color: #888888">#cv2.waitKey()</span>
            cX <span style="color: #333333">=</span> x<span style="color: #333333">+</span>(w<span style="color: #333333">/</span><span style="color: #0000DD; font-weight: bold">2</span>)
            cY <span style="color: #333333">=</span> y<span style="color: #333333">+</span>(h<span style="color: #333333">/</span><span style="color: #0000DD; font-weight: bold">2</span>)
            mapval <span style="color: #333333">=</span> <span style="background-color: #fff0f0">""</span>
            <span style="color: #008800; font-weight: bold">if</span> cY<span style="color: #333333">&lt;</span><span style="color: #007020">self</span><span style="color: #333333">.</span>TOP_ROW_Y:
                <span style="color: #008800; font-weight: bold">if</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>DRAWPILE_X<span style="color: #333333">.</span>inRange(cX): mapval <span style="color: #333333">=</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>DRAWPILE
                <span style="color: #008800; font-weight: bold">elif</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>H1_X<span style="color: #333333">.</span>inRange(cX):mapval <span style="color: #333333">=</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>H1
                <span style="color: #008800; font-weight: bold">elif</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>H2_X<span style="color: #333333">.</span>inRange(cX):mapval <span style="color: #333333">=</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>H2
                <span style="color: #008800; font-weight: bold">elif</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>H3_X<span style="color: #333333">.</span>inRange(cX):mapval <span style="color: #333333">=</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>H3
                <span style="color: #008800; font-weight: bold">elif</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>H4_X<span style="color: #333333">.</span>inRange(cX):mapval <span style="color: #333333">=</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>H4
            <span style="color: #008800; font-weight: bold">else</span>:
                <span style="color: #008800; font-weight: bold">if</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C1_X<span style="color: #333333">.</span>inRange(cX): mapval <span style="color: #333333">=</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C1
                <span style="color: #008800; font-weight: bold">elif</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C2_X<span style="color: #333333">.</span>inRange(cX):mapval <span style="color: #333333">=</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C2
                <span style="color: #008800; font-weight: bold">elif</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C3_X<span style="color: #333333">.</span>inRange(cX):mapval <span style="color: #333333">=</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C3
                <span style="color: #008800; font-weight: bold">elif</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C4_X<span style="color: #333333">.</span>inRange(cX):mapval <span style="color: #333333">=</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C4
                <span style="color: #008800; font-weight: bold">elif</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C5_X<span style="color: #333333">.</span>inRange(cX):mapval <span style="color: #333333">=</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C5
                <span style="color: #008800; font-weight: bold">elif</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C6_X<span style="color: #333333">.</span>inRange(cX):mapval <span style="color: #333333">=</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C6
                <span style="color: #008800; font-weight: bold">elif</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C7_X<span style="color: #333333">.</span>inRange(cX):mapval <span style="color: #333333">=</span> <span style="color: #007020">self</span><span style="color: #333333">.</span>C7

            gray <span style="color: #333333">=</span> cv2<span style="color: #333333">.</span>cvtColor(extract,cv2<span style="color: #333333">.</span>COLOR_BGR2GRAY)
            <span style="color: #888888">#_, gray = cv2.threshold(gray,128,255,cv2.THRESH_BINARY)</span>
            cardmap[mapval] <span style="color: #333333">=</span> (gray,(<span style="color: #007020">int</span>(cX),<span style="color: #007020">int</span>(cY)))
        <span style="color: #008800; font-weight: bold">return</span> cardmap
</pre></div>

It also determines which pile the card belongs to based on the position of the card. 

CardExtraction is the source that deals with extracting the cards from the image. I wasn't focusing on making it general, so it is pretty tailored to the default size of the klondike board.  
[https://github.com/Corey255A1/PlayingCardsNeuralNet/blob/master/PlayingCardID/PlayingCardID/CardExtraction.py](https://github.com/Corey255A1/PlayingCardsNeuralNet/blob/master/PlayingCardID/PlayingCardID/CardExtraction.py)

At first, the neural network was having troubles being accurate with the face cards. Specifically with the suits. So I had to do some retraining. What I finally did was tweak the layout of the model itself, tweak the augmentation a little bit, and also (probably the biggest factor) went through and captured all of the cards from the MS Solitaire to train against. It was kind of cool because I actually was using the neural network I had to give its best guess of all of the cards extract from the board, so that I didn't have to manually label each and every card! I just had to correct the few it was having troubles with.

Once I did that I wound up with a network that can detect all of the cards on the board perfectly. 

SolitairePlayer handles grabbing the screen and passing the pieces into the model for labeling.  
[https://github.com/Corey255A1/PlayingCardsNeuralNet/blob/master/PlayingCardID/PlayingCardID/SolitairePlayer.py](https://github.com/Corey255A1/PlayingCardsNeuralNet/blob/master/PlayingCardID/PlayingCardID/SolitairePlayer.py)

`#Keras #MachineLearning #AI #SoftwareEngineering #computerscience #ComputerVision #Python #python`