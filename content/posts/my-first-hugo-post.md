---
title: "My First Hugo Post"
date: 2023-04-22T07:30:55-04:00
summary: Working on converting my blog to a static webpage using Hugo!
thumbnail: /images/blog/2016-11-29-The_ESP8266.jpg
draft: true
---

## Introduction
I have been messing around with using different server side technologies such as Flask and ASP.Net. But, as I started to think about it, having these server side rendering applications is a bit over kill for blog posts that I rarely update. I knew things existed to generate static webpages from templates, and for now I'm going to dig into **Hugo**.

I'm not going to get into the installation of hugo because there are a lot of tutorials on that already and it is pretty straight forward. I'm going to dive right into the build of my site.

## Building the layouts
The Hugo tutorial has you install a template. Which is a good starting point to see how it all works and its potential. However, I want to build my own pages not just use a premade template.

I haven't really found too much information yet about how to build your layout from the ground up, so its taking a bit of research.

I managed to get the home page, footer and header set up fairly easily. This was just a matter of adding a index.html (there seems to be a lot of options for the naming of things) and a partials directory with the header and footer.html to be used with in the index.html.
[Insert code snips]

Using the _default directory with the baseof.html makes it easy to share the same HTML template.

I managed also to figure out fairly quickly looping through the auto generate page menus to eventually build a top navbar.
[insert code snips]

However, I struggled to figure out how to get the posts page to show up.
Part of the issue was the command **hugo server** doesn't seem to compile the markdown by default.
If you change the command to **hugo -D server** it will compile and then everything will show up.

To render the blog Post list and post pages, it was a matter of making a **posts** directory under the layouts and defining the list.html and the single.html.
[insert code snip]

I finally noticed the **draft** flag that is in the header. That is what causes those markdown files to not get compiled with out the **-D**. I had been wondering what was made it think that file was a draft.

Another issue I just ran in to was apparently between version 0.8 and the latest version +0.86 there was a change in how the menu urls are defined in the menu section of the config. Using **pageRef** was enough in the new version, but in an older version I had to define **url** as well. I ran into this problem because I was trying to work on it while I was on my chromebook which had a different version. In addition, the url parameter I had to include the trailing / to ensure that it matched the permaLink of the page
[insert code snip]

I got the navbar highlighting the active link after getting the menu figured out. It was just comparing the URL of the menu to the permaLink of the current page, and applying the active class to the link

One cool thing that I realized a couple days ago when using markdown for something else is that some of the markdown renderers actually will code highlight!

You can and it will auto highlight it for you!:
```markdown
    ```python
    if this == that:
        print(this)
    ```
```
```python
if this == that:
    print(this)
```
Which is pretty cool!

## Deploying
I have been on a kick using Azure. Azure has a Static Web App option that allows you to sync directly from GitHub. This project then is directly built and deployed to my website automatically!

## Tagging
Next up was figuring how to use the Taxonomies. One thing I had been doing in the past was adding hash tags to articles, but I never
implemented anything to actually use them. Hugo seems to have a built in way to do display these Taxonomy pages.

```toml
title: "Saturday Morning Coding - Template Matching and Sign Detection"
date: "2018-01-27"
summary: "Using the basic Template Matching feature of OpenCV to detect road signs."
thumbnail: "/images/blog/2018-01-27-Saturday_Morning_Coding_Template_Matching_and_Sign_Detection.jpg"
slug: "saturday-morning-coding-template-matching-and-sign-detection"
tags: ["python", "opencv", "computervision"]
```

I added in the **tags** line with some tags that describe the article. In order for these to display somewhere you have to add a taxonomoy template. Once again I'm not sure why there are so many alternate names and locations for these templates, but I'm choosing to make a taxonomy directory and putting a list.html in there. 

```html
{{ define "main"}}
<ul>
    {{ range .Data.Terms.Alphabetical }}
            <li><a href="{{ .Page.Permalink }}">{{ .Page.Title }}</a> {{ .Count }}</li>
    {{ end }}
</ul>
{{ end }}
```

It didn't seem to auto build the tags, so be careful of that. I had to start and start the server for it to take effect.

<p class="blog-img center md">
    <img src="/images/blog/hugo-tags-1.png" alt="">
    <div class="center">Basic Tag List</div>
</p>