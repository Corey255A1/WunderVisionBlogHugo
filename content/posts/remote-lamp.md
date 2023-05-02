---
title: "Remote Lamp"
date: "2014-04-14"
summary: "Using the Raspberry Pi, I created a simple Python TCP server that monitors a port for commands. When the script received the appropriate ..."
thumbnail: "/images/blog/2014-04-14-Remote_Lamp.jpg"
slug: "remote-lamp"
---
Using the Raspberry Pi, I created a simple Python TCP server that monitors a port for commands. When the script received the appropriate command it would toggle a pin. I used FASL again on my Galaxy S4 to create my simple TCP client that sends out the light command on button press.

The circuitry is probably overly complex because I just use what I had available aside from a Relay I purchased at RadioShack. Using a 4n26 OptoCoupler, I convert the 3V output of the Raspberry pi to 5V (which I didn't realize I would have to do originally...) The 5V then was used to drive the Gate of a IRF510 which was used to drive the 12V coil of the relay. So toggling the 3V out on the raspberry pi then results in switching the Relay which is capable of handling 240VAC 5A max. In this case I used that capability to control the lamp.