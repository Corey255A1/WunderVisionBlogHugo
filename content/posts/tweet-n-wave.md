---
title: "Tweet 'n Wave"
date: "2014-03-23"
summary: "I was thinking of a fun way for people to interact with one of my weekend creations. What I came up with was a hand that waves everytime ..."
thumbnail: "/images/blog/2014-03-23-Tweet_n_Wave.jpg"
slug: "tweet-n-wave"
tags: ["Arduino","RaspberryPi"]
---
I was thinking of a fun way for people to interact with one of my weekend creations. What I came up with was a hand that waves everytime a new tweet has been received. Using the Raspberry Pi, I downloaded Twython which is a Python library that interfaces with the Twitter API. You must go register for an access key to their API. It is free though so it isn't a big deal. Once armed with the access key, you can then use the Twython library to access twitter and do quite a number of things through the API. What I did with the API was do a search for the most recent posts that contained WunderVision89. I would also have it just return back 1 result. Through the library you are able to easily get the UserName of the person who sent the tweet as well as the message. I created a serial interface to the Arduino, so the Raspberry Pi would recieve all of the info and send it to the Arduino which then displayed the user and part of the message. And also as the main purpose it would the run through the waving servo sequence so that when you tweeted me it was like you were waving at me. Almost like you were really here...haha.