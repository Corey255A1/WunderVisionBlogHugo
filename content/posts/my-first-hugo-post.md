---
title: "My First Hugo Post"
date: 2023-04-22T07:30:55-04:00
draft: true
---

# Introduction
I have been messing around with using different server side technologies such as Flask and ASP.Net. But, as I started to think about it, having these server side rendering applications is a bit over kill for blog posts that I rarely update. I knew things existed to generate static webpages from templates, and for now I'm going to dig into **Hugo**.

I'm not going to get into the installation of hugo because there are a lot of tutorials on that already and it is pretty straight forward. I'm going to dive right into the build of my site.

# Building the layouts
The Hugo tutorial has you install a template. Which is a good starting point to see how it all works and its potential. However, I want to build my own pages not just use a premade template.

I haven't really found too much information yet about how to build your layout from the ground up, so its taking a bit of research.

I managed to get the home page, footer and header set up fairly easily. This was just a matter of adding a index.html ( there seems to be a lot of options for the naming of things) and a partials directory with the header and footer.html to be used with in the index.html.
[Insert code snips]

Using the _default directory with the baseof.html makes it easy to share the same HTML template.

I managed also to figure out fairly quickly looping through the auto generate page menus to eventually build a top navbar.
[insert code snips]

However, I struggled to figure out how to get the posts page to show up.
Part of the issue was the command **hugo server** doesn't seem to compile the markdown by default.
If you change the command to **hugo -D server** it will compile and then everything will show up.

To render the blog Post list and post pages, it was a matter of making a **posts** directory under the layouts and defining the list.html and the single.html.
[ inser code snip]