---
title: "WPF Dijkstra Demo Refactor"
date: "2023-12-16"
summary: "Refactoring another application from 2018. This is a WPF GUI that visualizes Dijkstra's shortest path algorithm."
bundle: true
thumbnail: "dijkstra_thumb.jpg"
tags: ["WPF", "C#", "Algorithms"]
---
# Introduction
- [Initial Algorithm Refactor]({{<ref "/posts/2023-12-17-WPF_Dijkstra_Demo_Refactor">}})
- [GUI Refactor Part 1]({{<ref "/posts/2023-12-18-WPF_Dijkstra_Demo_Refactor">}})


[Github Source](https://github.com/Corey255A1/DijkstraCoffeeAndCode)

Another application from 2018 that I created just for fun was a Dijkstra's Algorithm Visualization. It uses WPF as well and has some basic graphics.  
Since I'm on a kick of refactoring old code, I decided to give this one a refresh.  
First, a quick summary of how Dijkstra's Algorithm works. At the start node, look at each next node and store the total distance to that node. Then move to the node that is the shortest path and calculate the total distance from the beginning through that path to the next nodes. If that distance is shorter than an existing path, update that distance using the shorter path value.  
Continue until the algorithm reaches the end. 

The existing application has the following behavior. 
- Create nodes when left clicking on the canvas 
- Left clicking on a node selects it 
    - Only 2 can be selected at a time 
- Left Click and Drag moves the nodes around 
- Pressing Enter with 2 nodes selected draws an edge between them 
- The Visualization shows the distance between nodes in the middle of the edge 
- Pressing Solve, completes the algorithm 
    - Highlights the shortest path 
    - Each node has the calculated route distance 
- Pressing Step, takes one iteration of the algorithm so you can see the process step by step 

The end goal of this refactor is to: 
- Implement the graphics in a more WPF way 
- Refactor algorithm code and make it unit testable
- Normalize code and follow clean code practices