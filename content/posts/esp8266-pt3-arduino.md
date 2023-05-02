---
title: "ESP8266 Pt3 - Arduino"
date: "2016-11-30"
summary: "Very Very Basic Arduino Code that assumes your ESP8266 is already setup to connect to your wifi and sends a \"Hello World\" as a UDP Packet..."
thumbnail: "/images/blog/2016-11-30-ESP8266_Pt3___Arduino.jpg"
slug: "esp8266-pt3-arduino"
---
Very Very Basic Arduino Code that assumes your ESP8266 is already setup to connect to your wifi and sends a "Hello World" as a UDP Packet on the network. We are talking bare minimum. Just to get you up to speed with using the ESP8266. I don't like using developed libraries - like a lot of examples talk about - unless I understand how the underlying code works. Plus usually, those libraries contain waaayyy more than you might need for your project. Basic Run Down of what is going on in the code. First of all I set the ESP8266 to 57600 Baud rate. The default 115200 is too fast to use the SoftwareSerial on an Uno. To do this send the: AT+UART_DEF=57600,8,1,0,0 That command writes to the flash the current settings and from then on it will be 57600. 8bits, 1 stop bit, 0 parity, No Flow control. With that, The code then forwards to and from ports 10,11 to the Arduino UART. Allowing me the user to send and look at commands from my terminal and also have the Arduino talk on the same line. There is a very primative debouncer for the button on my protoshield. And basically that is it. The rest are just function calls that wrap the AT Commands to the ESP8266. And soo ... Here you go: #include <SoftwareSerial.h>


SoftwareSerial espWifi(10,11);//RX,TX

int DEBOUNCE = 100;

int currState, lastState = 0;

int debounceCount = DEBOUNCE;



void OutLine(String s)

{

  Serial.println(s);

}

void ESP_Write(String o)

{

  espWifi.println(o);

}


void ESP_Init()

{

  OutLine("Waiting 2secs for ESP8266 To Start");

  delay(2000);

  espWifi.begin(57600);

  ESP_Write("AT");

  ESP_Wait_For_OK();

}


void ESP_Wait_For_OK()

{

  delay(100);

  if (espWifi.available()) {

    String dat =  espWifi.readString();

    if(dat.indexOf("OK")>-1)

    {

      OutLine("SUCCESS!");

    }

    else

    {

      OutLine("Did Not get OK");

    }

  }

}


void ESP_Close_UDP()

{

  ESP_Write("AT+CIPCLOSE");

}


void ESP_Open_UDP(String ip, String port)

{

  String s = "\""+ip+"\"," + port;

  ESP_Write("AT+CIPSTART=\"UDP\"," + s);

  ESP_Wait_For_OK();

}


void ESP_Begin_Send(String len)

{

  ESP_Write("AT+CIPSEND=" + len);

  ESP_Wait_For_OK();

}


void ESP_Send_Data(String message)

{

  ESP_Begin_Send(String(message.length()));

  ESP_Write(message);

  ESP_Wait_For_OK();

}


void setup() {


  pinMode(8, INPUT);

  Serial.begin(57600);

  while (!Serial) {

    ; // wait for serial port to connect. Needed for native USB port only

  }

  ESP_Init();
 

}


void loop() {

  if (Serial.available()) {

    espWifi.write(Serial.read());

  }
 

  if (espWifi.available()) {

    Serial.write(espWifi.read());

  }


 currState = digitalRead(8);


  if(currState != lastState)

  {

    debounceCount = DEBOUNCE;

  }

  else if(debounceCount==0)

  {

    debounceCount--;

    currState = lastState;

    if(currState == LOW)

    {

      ESP_Open_UDP("192.168.1.255","6543");

      ESP_Send_Data("Hello World");

      ESP_Close_UDP();

    }

  }

  else if(debounceCount>0)

  {

      debounceCount--;

  }


}