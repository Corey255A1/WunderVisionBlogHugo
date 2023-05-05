---
title: "My First Hugo Post"
date: 2023-04-22T07:30:55-04:00
summary: Working on converting my blog to a static webpage using Hugo!
thumbnail: /images/blog/HugoH.jpg
tags: ["Hugo", "WebDev"]
---

## Introduction
I have been messing around with using different server side technologies such as Flask and ASP.Net. But, as I started to think about it, having these server side rendering applications is a bit over kill for blog posts that I rarely update. I knew things existed to generate static webpages from templates, and for now I'm going to dig into **Hugo**.

I'm not going to get into the installation of hugo because there are a lot of tutorials on that already and it is pretty straight forward. I'm going to dive right into the build of my site.

## Building the layouts
The Hugo tutorial has you install a template. Which is a good starting point to see how it all works and its potential. However, I want to build my own pages not just use a premade template.

I haven't really found too much information yet about how to build your layout from the ground up, so its taking a bit of research.

I managed to get the home page, footer and header set up fairly easily. This was just a matter of adding a index.html (there seems to be a lot of options for the naming of things) and a partials directory with the header and footer.html to be used with in the index.html.

Using the _default directory with the baseof.html makes it easy to share the same HTML template.

To render the blog Post list and post pages, it was a matter of making a **posts** directory under the layouts and defining the list.html and the single.html

I struggled to figure out how to get the posts page to show up at first. The issue turned out that if you use the **hugo new post.md** command it uses the archetypes to create a default markdown file. It includes a **draft: true** flag which makes Hugo not compile it by default. You can either remove that flag... or when developing use the **hugo -D server** command which compiles the drafts.


After reading the docs, generating the header menu was straight forward. Just loop through the auto generate page menus to eventually build a top navbar.
```html
<header class="navbar menu color1">
    <h2><img src="/images/wundervisionbot_sd.png" class="icon">WunderVision</h2>
    {{$currentPage := .}}
    <div class="navoptions">
        {{- range site.Menus.main }}
        <a href="{{ .URL }}" class="color3 btn {{if eq .URL $currentPage.RelPermalink}}active {{ end }}">
            {{ .Name }}
        </a>
        {{- end }}
    </div>
</header>
```

An issue I just ran in to was apparently between version 0.8 and the latest there was a change in how the menu urls are defined in the menu section of the config. Using **pageRef** was enough in the new version, but in an older version I had to define **url** as well. I ran into this problem because I was trying to work on it while I was on my chromebook which had a different version. In addition, the url parameter I had to include the trailing / to ensure that it matched the permaLink of the page

```toml
[[menu.main]]
  name = 'Home'
  pageRef = '/'
  url = '/'
  weight = 10
[[menu.main]]
  name = 'Blog'
  pageRef = '/posts'
  url = '/posts/'
  weight = 20
[[menu.main]]
  name = 'Projects'
  pageRef = '/projects'
  url = '/projects/'
  weight = 30
```

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
