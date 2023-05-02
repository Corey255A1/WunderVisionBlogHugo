---
title: "C++ Vector Iteration"
date: "2018-04-22"
summary: "Looking at the various ways to iterate in C++"
thumbnail: "/images/blog/2018-04-22-C_Vector_Iteration.jpg"
slug: "c-vector-iteration"
---
At work one day a few coworkers and I were discussing the various ways to iterate through a vector in C++. I thought that it was interesting enough to warrant a blog post about it :)

Here is a simple cool class to start off with.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">class</span> <span style="color: #BB0066; font-weight: bold">ACoolClass</span>
{
<span style="color: #997700; font-weight: bold">public:</span>
    
    std<span style="color: #333333">::</span>string Name;
    ACoolClass(std<span style="color: #333333">::</span>string name);
    
    <span style="color: #333399; font-weight: bold">void</span> <span style="color: #0066BB; font-weight: bold">ACoolMethod</span>();
};

ACoolClass<span style="color: #333333">::</span>ACoolClass(std<span style="color: #333333">::</span>string name)
:Name(name)
{
}

<span style="color: #333399; font-weight: bold">void</span> ACoolClass<span style="color: #333333">::</span>ACoolMethod()
{
    std<span style="color: #333333">::</span>cout <span style="color: #333333">&lt;&lt;</span> Name <span style="color: #333333">&lt;&lt;</span> std<span style="color: #333333">::</span>endl;
}
</pre></div>

The constructor sets the name, and then a cool method just writes that name out to the console. Simple. And then we will create a standard vector of some cool classes. 

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"> std<span style="color: #333333">::</span>vector<span style="color: #333333">&lt;</span>ACoolClass<span style="color: #333333">&gt;</span> CoolClassList <span style="color: #333333">=</span> {
      ACoolClass(<span style="background-color: #fff0f0">"Cool"</span>), 
      ACoolClass(<span style="background-color: #fff0f0">"Awesome"</span>), 
      ACoolClass(<span style="background-color: #fff0f0">"Sweet"</span>), 
      ACoolClass(<span style="background-color: #fff0f0">"Dude"</span>)
  };
</pre></div>

Now the only question is; How do we iterate through this loop and call a method on each of these objects in the vector? Well, several different ways, and the output will always be: Cool Awesome Sweet Dude

**For I**

Probably the most obvious way would be to use the classic For i=0, i<Length, i++ loop. You can use the .at() method of the vector.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">  <span style="color: #008800; font-weight: bold">for</span>(<span style="color: #333399; font-weight: bold">unsigned</span> <span style="color: #333399; font-weight: bold">int</span> i<span style="color: #333333">=</span><span style="color: #0000DD; font-weight: bold">0</span>; i<span style="color: #333333">&lt;</span>CoolClassList.size(); i<span style="color: #333333">++</span>)
  {
      CoolClassList.at(i).ACoolMethod();
  }
</pre></div>

Or the [] operator to access it more like a standard array. 

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">  <span style="color: #008800; font-weight: bold">for</span>(<span style="color: #333399; font-weight: bold">unsigned</span> <span style="color: #333399; font-weight: bold">int</span> i<span style="color: #333333">=</span><span style="color: #0000DD; font-weight: bold">0</span>; i<span style="color: #333333">&lt;</span>CoolClassList.size(); i<span style="color: #333333">++</span>)
  {
      CoolClassList[i].ACoolMethod();
  }
</pre></div>

That was a little bit unexciting.

**For Iterator**

A slightly more advanced way is to use the iterator of the vector to get each element. 
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">  <span style="color: #008800; font-weight: bold">for</span>(std<span style="color: #333333">::</span>vector<span style="color: #333333">&lt;</span>ACoolClass<span style="color: #333333">&gt;::</span>iterator cool<span style="color: #333333">=</span>CoolClassList.begin(); 
    cool<span style="color: #333333">!=</span>CoolClassList.end();
    <span style="color: #333333">++</span>cool)
  {
      (<span style="color: #333333">*</span>cool).ACoolMethod();
  }
</pre></div>
This can be cleaned up a little bit using a modern C++ spin and using the auto keyword to have to compiler determine the iterator type automatically. 
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">  <span style="color: #008800; font-weight: bold">for</span>(<span style="color: #008800; font-weight: bold">auto</span> cool<span style="color: #333333">=</span>CoolClassList.begin(); cool<span style="color: #333333">!=</span>CoolClassList.end();<span style="color: #333333">++</span>cool)
  {
      (<span style="color: #333333">*</span>cool).ACoolMethod();
  }
</pre></div>

**For Each Standard**

It seems that a lot of people don't know that C++ has for_each included as part of the standard library. Just include the <algorithm> header.
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">  std<span style="color: #333333">::</span>for_each(CoolClassList.begin(), CoolClassList.end(), 
  [](ACoolClass c){
      c.ACoolMethod();
  });
</pre></div>

This uses the modern C++ technique of a lambda function. This calls the lambda for each element in the vector and the lambda calls the method of the object passed in. Using a macro we can shorten this up even more. 
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">  <span style="color: #FF0000; background-color: #FFAAAA">#</span>define FOREACH(L,F) std<span style="color: #333333">::</span>for_each((L).begin(),(L).end(),F)

  FOREACH(CoolClassList, [](ACoolClass c){c.ACoolMethod();});
</pre></div>

**For Mem Fun**

What sort of prompted our conversation on iterators in C++ was my discovery of a use of std::mem_fun_ref(). I had to look up what that did because I had never seen it before. Since that specific function has been removed in C++/17 we will use the std::mem_fn() which is the replacement. You must include the <functional> header. 
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">  <span style="color: #008800; font-weight: bold">auto</span> coolMemFn <span style="color: #333333">=</span> std<span style="color: #333333">::</span>mem_fn(<span style="color: #333333">&amp;</span>ACoolClass<span style="color: #333333">::</span>ACoolMethod);
  std<span style="color: #333333">::</span>for_each(CoolClassList.begin(), CoolClassList.end(), coolMemFn);
</pre></div>
From cppreference.com: "generates wrapper objects for pointers to members, which can store, copy, and invoke a pointer to member" Basically, it does what the lambda function does in the For Each section above, except it does it for you. For completeness, you can obviously use our FOREACH macro to make it even shorter.
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">  <span style="color: #008800; font-weight: bold">auto</span> coolMemFn <span style="color: #333333">=</span> std<span style="color: #333333">::</span>mem_fn(<span style="color: #333333">&amp;</span>ACoolClass<span style="color: #333333">::</span>ACoolMethod);
  FOREACH(CoolClassList, coolMemFn);
</pre></div>

**For Each More Modern**

Since C++ 11, it has built in the range based for loop that is more like other modern foreach loops.
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">  <span style="color: #008800; font-weight: bold">for</span>(ACoolClass<span style="color: #333333">&amp;</span> c <span style="color: #333333">:</span> CoolClassList)
  {
      c.ACoolMethod();
  }
</pre></div>
Using it the auto keyword makes it very succinct. 
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">  <span style="color: #008800; font-weight: bold">for</span>(<span style="color: #008800; font-weight: bold">auto</span> c <span style="color: #333333">:</span> CoolClassList)
  {
      c.ACoolMethod();
  }
</pre></div>
C++ has a lot of ways to accomplish different tasks. Part of the reason for this is that C++ has been around for quite a while and more modern programming languages are changing the way code is written. Through the various revisions of C++, it has upgraded to include these new paradigms, but for backwards compatibility reasons a lot of those legacy functions are left in. Leading to things like over 5 unique ways to call a method on each element in a list. #computerscience #coding #codingforfun #moderndayprogramming #functionalprogramming