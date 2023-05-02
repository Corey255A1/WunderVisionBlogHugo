---
title: "Scribbler Pt.2"
date: "2014-11-23"
summary: "This time around, I went for manual control. I used two 5K Potentiometers to control the x and y axis servos. I used a button on the Ardu..."
thumbnail: "/images/blog/2014-11-23-Scribbler_Pt2.jpg"
slug: "scribbler-pt-2"
---
This time around, I went for manual control. I used two 5K Potentiometers to control the x and y axis servos. I used a button on the Arduino Proto shield to toggle the Pen up and down state. So my pinouts for the Arduino includes, 3 PWM pins for the servo, 1 digital input and 2 analog inputs. The analog inputs were reading the voltage from the voltage divider circuit of the potentiometers. So I found the range of analog input values initially and used the built in Arduino map() function which scales a number within one range to another. map(y,MIN_INY,MAX_INY,MIN_Y,MAX_Y) It makes it easy to read in code.  Also, my functions initially check and make sure that the analog input values are with in my predefined range.. it might not be necessary because of the map function but I wasn't sure, so better safe than sorry. As you can see in the code below, I also do a simple debounce on the digital input for the push button. I did this before I even tried it from experience in the past and knowledge I gained in class about debouncers. #include <Servo.h>

#define XAXIS 6

#define YAXIS 5

#define PEN 3


#define PEN_BTN 13

#define X_IN A4

#define Y_IN A5


const int MIN_Y = 35;

const int MAX_Y = 65;

const int MIN_X = 75;

const int MAX_X = 130;

const int MIN_P = 30;

const int MAX_P = 65;


const int MAX_INX = 600;

const int MIN_INX = 450;

const int MAX_INY = 550;

const int MIN_INY = 450;



Servo XServo;

Servo YServo;

Servo PServo;

int yPos = 40;

int xPos = 100;

int pPos = 65;


boolean bPenUp = true;


void setup() {

  Serial.begin(9600);

  XServo.attach(XAXIS);

  YServo.attach(YAXIS);

  PServo.attach(PEN);

  XServo.write(xPos);

  YServo.write(yPos);

  PServo.write(pPos);

  pinMode(PEN_BTN, INPUT);
 

}


int readX()

{

  int x = analogRead(X_IN);

  x = (x > MAX_INX ? MAX_INX : (x<MIN_INX ? MIN_INX : x));

  return map(x,MIN_INX,MAX_INX,MIN_X,MAX_X);

}


int readY()

{

  int y = analogRead(Y_IN);

  y = (y > MAX_INY ? MAX_INY : (y<MIN_INY ? MIN_INY : y));

  return map(y,MIN_INY,MAX_INY,MIN_Y,MAX_Y);

}


int lastButton = LOW;

void readPen()

{

  int currentButton = digitalRead(PEN_BTN);

  if(currentButton != lastButton)

  {

    int i = 0;

    lastButton = currentButton;

    while(i<10)

    {

      if((currentButton = digitalRead(PEN_BTN)) == lastButton)

      {

        i++;

      }else

      {

        lastButton = currentButton;

        i=0;

      }

    }

    if(lastButton == LOW)

    {

      bPenUp = !bPenUp;

    }

  }

}


void loop() {

    xPos = readX();

    yPos = readY();

    readPen();

    XServo.write(xPos);

    YServo.write(yPos);

    if(bPenUp) PServo.write(MAX_P);

    else PServo.write(MIN_P);

}//endloop #arduino