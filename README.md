# AR Co-Creation System

<img width="1191" alt="Screen Shot 2021-10-13 at 5 50 08 PM" src="https://user-images.githubusercontent.com/98379268/229663119-55b487a5-a5f0-48d7-9cec-addbe1ab153b.png">

Visit: https://www.jieunlee.org/arcocreation for more information.

## Summary

- AR co-creation system to support collaborative design with end-user and designer to envision and design the future.
- It enables designers and users to rapidly construct, and concretize new interaction design concepts for the interior space of the vehicle in user-centered perspectives. 
- Within the AR co-creation system, designers and users exchange opinions, embody, modify, and verify design ideas. Co-creation sessions were conducted to evaluate the proposed system.

## Features

- Facilitate AR experience with multi-user in real-time via AR sketches to be located freely in physical space.

## System Detail & Implementation

System:
- Interface sketch into AR  
- Agile sketch modification
- AR experience in actual vehicle scale

Implementation:
- Two web-based applications are implemented with JavaScript.
- A single Express server operates a web server and is deployed on the public web browser.
- The drawing data are sent to the projector application via socket.io stream through an express server.
- 
## Requirements

- Node.js
