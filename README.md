# AR Co-Creation System

![Header](https://user-images.githubusercontent.com/98379268/229661393-ac8fe45d-37ec-445e-b6c0-0fee008a3410.png)

Visit: https://www.jieunlee.org/arcocreation

## Summary

- AR co-creation system to support collaborative design with end-user and designer to envision and design the future.
- It enables designers and users to rapidly construct, and concretize new interaction design concepts for the interior space of the vehicle in user-centered perspectives. 
- Within the AR co-creation system, designers and users exchange opinions, embody, modify, and verify design ideas. Co-creation sessions were conducted to evaluate the proposed system.

## Features

1. Support both driver and designer perspective in low fidelity car mock-up.
2. Provide building blocks for large vehicle space to easily and rapidly construct, assemble, and iterate.
3. Facilitate AR experience with multi-user in real-time via AR sketches to be located freely in physical space.

##System Detail & Implementation

Web-Based Projected AR Sketch Tool Kit

System:
- Interface sketch into AR  
- Agile sketch modification
- AR experience in actual vehicle scale

Implementation:
- Two web-based applications are implemented with JavaScript.
- A single Express server operates a web server and is deployed on the public web browser.
- The drawing data are sent to the projector application via socket.io stream through an express server.

## Usage Scenario

![Screen Shot 2022-01-13 at 11 49 23 PM](https://user-images.githubusercontent.com/98379268/229662818-c6e032a0-1d52-4698-af50-b1bfcd5d1862.png)

## Requirements

- Node.js
