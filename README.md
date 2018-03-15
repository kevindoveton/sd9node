# DigiControl Server
This is the Server for [DigiControl](https://github.com/kevindoveton/sd9_client).

DigiControl is a web based (Angular 1.x) PWA that enables a user to control there fold back on a Digico sound desk. 
Whilst Digico have released an official app, it does not allow more than one device to connect at any given time, 
DigiControl allows many devices to connect by acting as a proxy. 

The server implementation is in Node.js and connects to the sound desk over OSC, the protocol was reverse engineered
through monitoring data transmissions from the official app. 

----

## Main server ##
To run `node app`

---

## SD9 Simulator ##
Currently supports
- Aux Names
- Aux Levels
- Input Names

To run `node sd9`

