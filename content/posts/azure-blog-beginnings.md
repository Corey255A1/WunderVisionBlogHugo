---
title: "Switching My Blog From Wix to Azure"
date: "2021-01-03"
summary: "Building up the blog using Flask and Azure App Service"
thumbnail: "/images/blog/2021-01-03-Switching_My_Blog_From_Wix_to_Azure.jpg"
slug: "azure-blog-beginnings"
---
Since I started dabbling in web technologies about 3 years ago, I've learned quite a bit.  
I still don't do it as my real day job, however I have been able to integrate some things I've learned.  
With that I decided to setup a proper website using Azure and move the blog off of Wix.

I started playing with the blog server using Flask. I chose flask because it is very lightweight and easy to get started with. I also wanted to doing something other than NodeJS. I've used NodeJS for a lot of things recently but it seemed like this would be an oppotunity to try something else.

I was able to export the majority of the Wix Blog as a CSV. If you have a Wix Blog, and want to do this, go to the Blog Dashboard, go to Content Manager. Select Posts from the Blog section. And then from the tripple dot More Actions menu, select Export CSV.

There is a gotcha with that though, any sort of formatting or images are not included with the CSV export. (part of the process I'm going though now is reformatting all of the blog posts)

What I have done on the Flask server side is make every post a Markdown file, and that is where I can create my post.

Luckily my blog has not been very complex, so it was easy to ensure that my links are not broken.

There are some very good articles from Microsoft on Rerouting your domains to Azure.

[Existing Domain To App Service](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain)

[Setup HTTPS for your domain](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-bindings)

[Serve Static Files from Azure Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website)

Overall it wasn't too painful to switch over to a basic bare minimum webserver running on Azure App Service. I hope to do more interesting things with it in the future. But for now I was just trying to get it going before Jan 8th when my Wix premium account would renew, so that I could cancel it with no interuptions to some of my more popular posts.