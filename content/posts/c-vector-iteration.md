---
title: "C++ Vector Iteration"
date: "2018-04-22"
summary: "Looking at the various ways to iterate in C++"
thumbnail: "/images/blog/2018-04-22-C_Vector_Iteration.jpg"
slug: "c-vector-iteration"
tags: ["C++"]
---
At work one day a few coworkers and I were discussing the various ways to iterate through a vector in C++. I thought that it was interesting enough to warrant a blog post about it!

Here is a simple cool class to start off with.

```C++
class ACoolClass
{
public:
    
    std::string Name;
    ACoolClass(std::string name);
    
    void ACoolMethod();
};

ACoolClass::ACoolClass(std::string name)
{
    Name = name;
}

void ACoolClass::ACoolMethod()
{
    std::cout << Name << std::endl;
}
```

The constructor sets the name, and then a cool method just writes that name out to the console. Simple.  

And then we will create a standard vector of some cool classes. 
```C++
std::vector<ACoolClass> CoolClassList = {
  ACoolClass("Cool"), 
  ACoolClass("Awesome"), 
  ACoolClass("Sweet"),
  ACoolClass("Dude")
};
```

Now the only question is; How do we iterate through this loop and call a method on each of these objects in the vector? Well, several different ways, and the output will always be: Cool Awesome Sweet Dude

## For I
Probably the most obvious way would be to use the classic For i=0, i<Length, i++ loop. You can use the .at() method of the vector.

```C++
for(unsigned int i=0; i<CoolClassList.size(); i++)
{
  CoolClassList.at(i).ACoolMethod();
}
```

Or the [] operator to access it more like a standard array. 
```C++
for(unsigned int i=0;i<CoolClassList.size();i++)
{
  CoolClassList[i].ACoolMethod();
}
```

That was a little bit unexciting.

## For Iterator
A slightly more advanced way is to use the iterator of the vector to get each element. 
```C++
for(std::vector<ACoolClass>::iterator cool=CoolClassList.begin(); 
    cool!=CoolClassList.end();
    ++cool)
{
  (*cool).ACoolMethod();
}
```


This can be cleaned up a little bit using a modern C++ spin and using the auto keyword to have to compiler determine the iterator type automatically. 
```C++
for(auto cool=CoolClassList.begin(); cool!=CoolClassList.end(); ++cool)
{
  (*cool).ACoolMethod();
}
```

## For_Each Standard Library
It seems that a lot of people don't know that C++ has for_each included as part of the standard library. Just include the **<algorithm>** header.

```C++
std::for_each(CoolClassList.begin(), CoolClassList.end(), 
  [](ACoolClass c){
  c.ACoolMethod();
});

```

This uses the modern C++ technique of a lambda function. This calls the lambda for each element in the vector and the lambda calls the method of the object passed in.  

Using a macro we can shorten this up even more.
```C++
#define FOREACH(L,F) std::for_each((L).begin(),(L).end(),F)

FOREACH(CoolClassList, [](ACoolClass c){c.ACoolMethod();});
```

## For Mem Fun
What sort of prompted our conversation on iterators in C++ was my discovery of a use of **std::mem_fun_ref()**. I had to look up what that did because I had never seen it before. Since that specific function has been removed in C++/17 we will use the **std::mem_fn()** which is the replacement. You must include the **<functional>** header.
```C++
auto coolMemFn = std::mem_fn(&ACoolClass::ACoolMethod);
std::for_each(CoolClassList.begin(), CoolClassList.end(), coolMemFn);
```
From cppreference.com: "generates wrapper objects for pointers to members, which can store, copy, and invoke a pointer to member" Basically, it does what the lambda function does in the For Each section above, except it does it for you. For completeness, you can obviously use our FOREACH macro to make it even shorter.

```C++
auto coolMemFn = std::mem_fn(&ACoolClass::ACoolMethod);
FOREACH(CoolClassList, coolMemFn);
```

## For Each More Modern
Since C++ 11, it has built in the range based for loop that is more like other modern foreach loops.

```C++
for(ACoolClass& c : CoolClassList)
{
  c.ACoolMethod();
}
```

Using it the auto keyword makes it very succinct.
```C++
for(auto c : CoolClassList)
{
  c.ACoolMethod();
}
```

C++ has a lot of ways to accomplish different tasks. Part of the reason for this is that C++ has been around for quite a while and more modern programming languages are changing the way code is written. Through the various revisions of C++, it has been upgraded to include these new paradigms, but for backwards compatibility reasons a lot of those legacy functions still remain. This leads to things like over 5 unique ways to call a method on each element in a list.

