---
title: "Word Streak/Boggle With Friends Automation"
date: "2018-01-13"
summary: "Use Machine Learning, Python and OpenCV to beat the game of Word Streak."
thumbnail: "/images/blog/wordstreak.jpg"
slug: "word-streak-boggle-with-friends-automation"
tags: ["ComputerVision","MachineLearning","Python","Android"]
---
## Introduction

This project combined the use of Python, OpenCV, and Keras (TensorFlow). After learning about Word Streak, of course the software engineer in me knew that finding all the words in a grid could be solved with an algorithm. So that was the task I set out to do. 

<div class="embed-youtube">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/stluJAXSk-Q" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>


The first step was to create the algorithm of finding the words. I was able to find a plain text list of about 60,000 words. Some of the words in it aren't considered words in the game which results in it rejecting some of them, but that's ok. The majority of the words work. I start at each letter in the grid and recursively check all the letters around the letters. I have some simple optimizations like the dictionary is split up in a map by the first letters. Another is if the combo of letters being checked is not found as the start of any of the words in the dictionary, it quits checking it. As it finds words, it adds them to an all encompassing list. 

The score for the word is also calculated and takes into consideration the letter/word multipliers that are in the word. 
The Python libraries used are: 
- **mss** for the screen capture 
- **pynput** for the mouse automation 
- **keras** for the neural network 
- **numpy** to handle arrays and images 
- **opencv** to do the image processing 

At first it was a manual process of typing in the letters so that it could find all the letters, but I wanted to keep going with some letter detection. The first step was to extract out each letter from the boggle board. 

I use OpenCV to find all of the contours in the image. I then filter out anything that isn't 4 edges. Then I determine how square the contour is and if it is the correct size. This almost always leads to only the tiles being selected.

```python
gimg = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
ret, thresh = cv2.threshold(gimg, 120, 200, 0)
im2, contours, hier = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
if DEBUG:
 cv2.imshow("Test Screen Grab", thresh)
 cv2.waitKey()
contourList = []
letterwidth = 0

#Go through the contours and find
#the Square-ish sections that are the
#boggle pieces
for c in contours:
    p = cv2.arcLength(c,True)
    app = cv2.approxPolyDP(c,0.04*p,True)
    #cv2.drawContours(img,[c],0,(0,255,0),2)
    if len(app) == 4 or len(app)==6:
        (x,y,w,h) = cv2.boundingRect(app)
        if(w>50 and w<90):
         ratio = w/float(h)
         if ratio>=0.80 and ratio <= 1.20:
          #cv2.drawContours(img,[c],0,(0,255,0),2)
          if DEBUG:
           cv2.rectangle(img,(x,y),(x+w,y+h),(0,255,0),2)
          letterwidth = w
          #create a list of top-left corners with widths and height
          contourList.append((x,y,w,h))
```


Sometimes a tile might be missed (especially in the case with DW/DL/TW/TL), since I know the basic size of each tiles and the spacing, I can interpolate where a square should be and still extract a tile anyway. Once I have the letters extracted from the image and processed with thresholds and gaussians, I pass it in to the Neural Net. 

The Neural Network part I used Keras and Tensorflow. I've been on kind of a deep learning/machine learning/neural net kick lately. So I thought I'd used that. I trained the net on a set of 1000 images per letter. Each image of the letter is of a different font style. This way when I passed in a picture of a letter extract from the boggle board, it would be able to know what letter it is without having seen the images of the boggle letters. This is the network I used. 

```python
model = Sequential()
model.add(Conv2D(32, 3,3, activation='elu', input_shape=(IMAGE_HEIGHT,IMAGE_WIDTH,IMAGE_CHANNELS)))

model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Conv2D(32, 3,3, activation='elu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(KEEP_PROBABILITY))
model.add(Flatten())
model.add(Dense(256,activation='elu'))
model.add(Dense(26,activation='softmax'))
```

For the Qu case, I had to do the more simple technique (which in this case could probably work for all letters and I wouldn't have had to use the neural net at all) where I subtract a canned Qu image from it. The sum of the pixel values for the Qu subtraction would be way less than letters that are not Qu. 

```python
QSub = bw - QU
IsItQ = cv2.sumElems(QSub)
if DEBUG:
    cv2.imshow("Letter View", QSub)
    cv2.waitKey()
    print(IsItQ)
npimg = np.array(bw).reshape(1,60,60,1)
if DEBUG:
    cv2.imshow("Letter View", bw)
    cv2.waitKey()
    # Get Weights of Classes
if IsItQ[0] < 100000:
    letter = 'qu'
else:
    lbls = model.predict(npimg,batch_size=1)
    letter = chr(GetMostLikelyChar(lbls))
```


Once the letters are all found, I then pass it into my original code of finding the words. It sorts it by the highest score first and then begins inputting the words into the game by controlling the mouse. I installed Android inside a VM using Virtual Box. This allowed me to interface with it easily using the pynput library.

This was a very fun exercise that kind of spanned across several different areas of computer science!