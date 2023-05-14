---
title: "Hugo Blog More Tweaks"
date: "2023-05-12"
summary: "Adding a section for recent posts to the home page"
bundle: true
thumbnail: "recent_post_list.png"
tags: ["Hugo", "HTML"]
---

A couple more things that I wanted to add to the blog was a feature list on the home page, and pagination on the post list page.

## Feature List

There are a few hugo functions that are key: **first**, **last**, **where**. 

### Where
To get the list of only *Posts* I had to figure out how to filter the .Site.Pages list by only only the post type. The problem was that initialy for some reason the Posts list page also show up in that category.

```go
where .Site.Pages "Type" "posts"
```

Turns out there is an additional list that is .RegularPages

```go
where .Site.RegularPages "Type" "posts"
```

### First and Last
First and Last return N number of items from the first or last of the list. In this case I also sorted the List ByDate
```go
last 10 ( where .Site.RegularPages "Type" "posts" ).ByDate
```

I think wanted the list in order from recent to least recent.

```go
(( last 10 ( where .Site.RegularPages "Type" "posts" ).ByDate ).Reverse)
```

There we go!

### Final Results

With this added piece of code:

```html
<h3>Recent Posts</h3>
<ul class="list-group thin">
    {{ range (( last 3 ( where .Site.RegularPages "Type" "posts" ).ByDate ).Reverse) }}
    <li>
        <a class="thin-card" href="{{ .Permalink }}">
            <div><h3>{{ .Date.Format "2006-01-02" }} - {{ .Title }}</h3></div>
            <div>
                {{ .Summary }}
            </div>
        </a>
    </li>
    {{ end }}
</ul>
```

That creates the list on the home page!

![Recent List](recent_post_list.png "List of posts on home page")


## Pagination

As I'm discovering the power and features of Hugo, it is making it easier to discover and apply other techniques. 
To use the paginator it was as easy as just calling the .Paginator.Pages. There are some other things that can be done to customize it but I didn't require those. Hugo's bult in pagnination template makes it very easy to make the navigation. 

```html
{{ template "_internal/pagination.html" . }}
<ul class="list-group">
{{ range .Paginator.Pages }}
    {{ partial "postpreview.html" .}}
{{ end }}
</ul>
{{ template "_internal/pagination.html" . }}
```

The output of the pagination template
```html
<ul class="pagination pagination-default">
    <li class="page-item disabled">
        <a aria-disabled="true" aria-label="First" class="page-link" role="button" tabindex="-1"><span aria-hidden="true">&laquo;&laquo;</span></a>
    </li>
    <li class="page-item disabled">
        <a aria-disabled="true" aria-label="Previous" class="page-link" role="button" tabindex="-1"><span aria-hidden="true">&laquo;</span></a>
    </li>
    <li class="page-item active">
        <a aria-current="page" aria-label="Page 1" class="page-link" role="button">1</a>
    </li>
    <li class="page-item">
        <a href="/posts/page/2/" aria-label="Page 2" class="page-link" role="button">2</a>
    </li>
```


## Bonus

In addition to this list, I also was able to get the markdown image tags to render in a custom way.

```markdown
![Recent List](recent_post_list.png "List of posts on home page")
```
turns in to:

```html
<p class="blog-img center md">
    <img src="{{ .Destination | safeURL }}" alt="{{ .Text }}" {{ with .Title }} title="{{ . }}"{{ end }}>
    <br><span class="center">{{ .Title }}</span>
</p>
```

This uses the **layouts/_default/_markup/render-image.html** which is called to render all the image markups.