---
title: "Hugo Blog Tags"
date: 2023-05-04T21:06:48-04:00
draft: true
thumbnail: /images/blog/HugoH.jpg
tags: ["Hugo", "WebDev"]
---
## Tagging
Next up was figuring how to use the Taxonomies. One thing I had been doing in the past was adding hash tags to articles, but I never
implemented anything to actually use them. Hugo seems to have a built in way to do display these Taxonomy pages.

```toml
title: "Saturday Morning Coding - Template Matching and Sign Detection"
date: "2018-01-27"
summary: "Using the basic Template Matching feature of OpenCV to detect road signs."
thumbnail: "/images/blog/2018-01-27-Saturday_Morning_Coding_Template_Matching_and_Sign_Detection.jpg"
slug: "saturday-morning-coding-template-matching-and-sign-detection"
tags: ["Python", "OpenCV", "ComputerVision"]
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
    <img src="/images/blog/hugo-tags-1.png" alt="Basic Tag List">
    <div class="center">Basic Tag List</div>
</p>

To list the tags associated with a page you can do something like this.
```html
<ul>
    {{ range (.GetTerms "tags") }}
        <li><a href="{{ .Permalink }}">{{ .LinkTitle }}</a></li>
    {{ end }}
</ul>
```

And I finally read how to list all the tags of your site.
```html
<ul>
    {{ range .Site.Taxonomies.tags }}
            <li><a href="{{ .Page.Permalink }}">{{ .Page.Title }}</a> {{ .Count }}</li>
    {{ end }}
</ul>
```

<p class="blog-img center md">
    <img src="/images/blog/hugo_tags_list.jpg" alt="Side Bar List">
    <div class="center">Side Bar List</div>
</p>

Getting the lists of tags is great! The next piece those was actually rendering a page when that tag was clicked. The **layouts/taxonomy/term.html** seems to be one of the many names that can be chosen to do just that.

Turns out that to render the list of pages associated with a tag, is the same as rendering all the posts. Rather than duplicate the post list code between the Term.html and the List.html for posts, I just turned it into a partial, and basically shared that between the two. There might be even more clever ways to do it, but for now this works great.

Another got'ya that I ran into was for the tags which include special characters. Specifically # as in C#. I didn't find a super clean way to globally fix the issue, however when generating the links you can swap out the # with %23 which makes it work.

```html
<a href="{{ replace .Permalink "#" "%23"}}">#{{ .LinkTitle }}</a>
```

