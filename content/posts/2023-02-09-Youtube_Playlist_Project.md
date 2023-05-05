---
title: "Youtube Playlist Project"
date: "2023-02-09"
summary: "I am implenting the same app in several languages and frameworks (Desktop and Web)
to learn new things and explore what is possible."
thumbnail: "/images/blog/2023-02-09-Youtube_Playlist_Project.jpg"
slug: "2023-02-09-Youtube_Playlist_Project"
tags: ["SoftwareDesign","React","WPF","C#","Typescript","Javascript"]
---
### Introduction
I have worked with WPF for several years. Most of my career thus far has been based around developing desktop applications with MFC and WPF. I have mostly been learning web development on my own.

I started a Udemy course on React and he has of course sample projects that he walks through. I've also read tutorials and things that implement To-Do lists.

A To-Do list covers a lot of ground. Adding, Deleting, Editting, Shuffling.

I however wanted to just dive in and make something I haven't seen with similar but slightly more advanced concepts. A **Youtube Playlist Player**

### Requirements

The first thing to think about is, what are my applications requirements? What should the user be able to do?

The user shall be able to:

- Create a new list entry to the playlist
- Remove a list entry from the playlist
- Modify a list entry in the playlist
- Reorder a list entry in the playlist
- Start playback of an entry in the playlist
- Advance to the next playlist item
- Move back to the previous playlist item
- Enable and Disable Autoplay for the playlist

### Visual Design
Once I have some ideas for the app should do, I'm going to create a mockup of what that might look like. I'm not a graphics designer or a UX expert, but I like to think that I come up with GUIs that at least make sense to a user.  

I have been messing around with using Figma. I like that its straight forward and no nonsense to get things placed in an organized gridded fashion. You can group things together and basically get the component hierarchy just by building out your interface. 

Along with the basic user action requirements, some thought has to be put into how the current state of the application is presented to the user. 

An important part about developing an interface is to get feedback from other people as often as possible. What you might think is important may not be to someone else. You don't want to spend a bunch of time on a feature that no one will ever really use, even if it is really cool. You also want to get people using what you have to get feedback on what works and what doesn't. If people keep accidently clicking the remove button instead of the shift up and down button, you might consider rearranging those buttons to prevent that from happening. 

The interface shall indicate:

- The currently playing video title
- The currently playing item in the playlist

<p class="blog-img center lg">
    <img src="/images/blog/figma_playlist_mock.png">
    <div class="center">My quick design in Figma</div>
</p>

### Software Design
Some parts of the software design will be reliant upon the architecture chosen. Desktop vs Web. C# vs C++. React vs Angular. And so on.

Overall, however, the concepts are similar.

In general we have a playlist item which contains the information about the video that we want to play. A playlist is just an array of those items. Our player has an index into that array which is the currently playing item. 

Our player actions:

- Move that index forward or backward
- Play or Pause the currently playing video
- Move that index forward automatically at the end of the video if that mode is activated 

Our playlist actions:

- Add or Remove Item
- Move item forward or backward in the list

**Component Hierarchy**

- Current Playing Section
    - Video
    - Current Playing Title
    - Playback Controls
        - SkipBack Button
        - Play Button
        - Pause Button
        - SkipForward Button
    - Auto Play Checkbox 
- Play List Section
    - Add New Section
        - Add Top
        - Add Bottom
    - Playlist
        - Playlist Item
            - Move Up button
            - Move Down button
            - Play button
            - URL Edit Box
            - Remove button

**Data Types**

PlaylistItem

- id:number
- url:string 

Playlist

- items:Array<PlaylistItem> 

PlaylistPlayer 

- playlist:Playlist 
- currentPlaylistItem:PlaylistItem

### Starting the Projects
Once I had the ideas of how it would work written out and thought about, I was ready to dig in with the code.

So far I have written the app in two frameworks: React and WPF. There will be more to come for sure!