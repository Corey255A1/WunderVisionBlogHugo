---
title: "C# Xml Easy Read and Write"
date: "2019-09-06"
summary: "Use C# to easily read and write XML files."
thumbnail: "/images/blog/2019-09-06-CS_Xml_Easy_Read_and_Write.jpg"
slug: "c-xml-easy-read-and-write"
tags: ["C#"]
---
<p class="blog-img center lg">
    <img src="/images/blog/XML.jpg" alt="">
    <div class="center">Simple XML File</div>
</p>
C# has an extremely powerful XML processor built in. This makes it very easy to serialize and deserialize data in XML format. Visual Studio also has a neat tool for automatically creating the classes based on a schema or even just from the XML file, however I find it much easier to just quickly layout the framework by hand for my projects.

The code for this post is here: [https://github.com/Corey255A1/WunderVisionMiscCode/tree/master/XmlReadNWrite](https://github.com/Corey255A1/WunderVisionMiscCode/tree/master/XmlReadNWrite)

Let's start with defining our data structure. I went with the classic Class/Student type example. 

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #557799">&lt;?xml version="1.0"?&gt;</span>
<span style="color: #007700">&lt;Classes</span> <span style="color: #0000CC">xmlns:xsi=</span><span style="background-color: #fff0f0">"http://www.w3.org/2001/XMLSchema-instance"</span> <span style="color: #0000CC">xmlns:xsd=</span><span style="background-color: #fff0f0">"http://www.w3.org/2001/XMLSchema"</span><span style="color: #007700">&gt;</span>
  <span style="color: #007700">&lt;Class</span> <span style="color: #0000CC">name=</span><span style="background-color: #fff0f0">"History"</span> <span style="color: #0000CC">time=</span><span style="background-color: #fff0f0">"0700"</span><span style="color: #007700">&gt;</span>
    <span style="color: #007700">&lt;Students&gt;</span>
      <span style="color: #007700">&lt;Student</span> <span style="color: #0000CC">firstname=</span><span style="background-color: #fff0f0">"Joanna"</span> <span style="color: #0000CC">lastname=</span><span style="background-color: #fff0f0">"Johnson"</span> <span style="color: #0000CC">studentid=</span><span style="background-color: #fff0f0">"556825"</span> <span style="color: #007700">/&gt;</span>
      <span style="color: #007700">&lt;Student</span> <span style="color: #0000CC">firstname=</span><span style="background-color: #fff0f0">"Frederick"</span> <span style="color: #0000CC">lastname=</span><span style="background-color: #fff0f0">"Lemowitz"</span> <span style="color: #0000CC">studentid=</span><span style="background-color: #fff0f0">"567864"</span> <span style="color: #007700">/&gt;</span>
    <span style="color: #007700">&lt;/Students&gt;</span>
  <span style="color: #007700">&lt;/Class&gt;</span>
  <span style="color: #007700">&lt;Class</span> <span style="color: #0000CC">name=</span><span style="background-color: #fff0f0">"Mathematics"</span> <span style="color: #0000CC">time=</span><span style="background-color: #fff0f0">"0800"</span><span style="color: #007700">&gt;</span>
    <span style="color: #007700">&lt;Students&gt;</span>
      <span style="color: #007700">&lt;Student</span> <span style="color: #0000CC">firstname=</span><span style="background-color: #fff0f0">"Bobby"</span> <span style="color: #0000CC">lastname=</span><span style="background-color: #fff0f0">"Villanova"</span> <span style="color: #0000CC">studentid=</span><span style="background-color: #fff0f0">"568845"</span> <span style="color: #007700">/&gt;</span>
      <span style="color: #007700">&lt;Student</span> <span style="color: #0000CC">firstname=</span><span style="background-color: #fff0f0">"Sandra"</span> <span style="color: #0000CC">lastname=</span><span style="background-color: #fff0f0">"Thomson"</span> <span style="color: #0000CC">studentid=</span><span style="background-color: #fff0f0">"574568"</span> <span style="color: #007700">/&gt;</span>
    <span style="color: #007700">&lt;/Students&gt;</span>
  <span style="color: #007700">&lt;/Class&gt;</span>
<span style="color: #007700">&lt;/Classes&gt;</span>
</pre></div>

So in our code we will start off like this:

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">using</span> <span style="color: #0e84b5; font-weight: bold">System.Xml.Serialization</span>;

<span style="color: #008800; font-weight: bold">namespace</span> <span style="color: #0e84b5; font-weight: bold">XmlReadNWrite</span>
{
<span style="color: #0000CC">    [XmlRoot("Classes")]</span>
    <span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">class</span> <span style="color: #BB0066; font-weight: bold">StudentListFile</span>
    {
<span style="color: #0000CC">        [XmlElement("Class")]</span>
        <span style="color: #008800; font-weight: bold">public</span> List&lt;Class&gt; Classes { <span style="color: #008800; font-weight: bold">get</span>; <span style="color: #008800; font-weight: bold">set</span>; }
    }
</pre></div>

Be sure to add the System.Xml.Serialization namespace. We will define our XMLRoot attribute. This is where the serializer will start taking the data from the XML and matching it up to the class structure. It is important that the letter capitalization and spelling matches what your XML file looks like. 
Now looking at our XML structure, we want to have multiple Class elements, so you can see in our code we have a List<Class> with the XmlElement attribute. Now we define the Class class.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">    <span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">class</span> <span style="color: #BB0066; font-weight: bold">Class</span>
    {
<span style="color: #0000CC">        [XmlAttribute("name")]</span>
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">string</span> Name { <span style="color: #008800; font-weight: bold">get</span>; <span style="color: #008800; font-weight: bold">set</span>; }

<span style="color: #0000CC">        [XmlAttribute("time")]</span>
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">string</span> Time { <span style="color: #008800; font-weight: bold">get</span>; <span style="color: #008800; font-weight: bold">set</span>; }

<span style="color: #0000CC">        [XmlArray("Students"), XmlArrayItem("Student")]</span>
        <span style="color: #008800; font-weight: bold">public</span> List&lt;Student&gt; Students { <span style="color: #008800; font-weight: bold">get</span>; <span style="color: #008800; font-weight: bold">set</span>; }
    }
</pre></div>

If we look back at our XML we notice the the Class element has two Attributes, "name" and "time". In our Class class then we add two strings, with the XmlAttribute attribute ensuring the spelling and capitalization matches the XML. Now, here I have Time just defined as a simple string, however there ways to get more complex data types to serialize other than just string. In this post I just cover basic datatypes.

Each class has a Students element that is populated with a List of students. I could have created a Students class that has a list of Student as a property however, since we know that Students only contains a list of Student, we can short cut it with the [XmlArray("Students"), XmlArrayItem("Student")] attribute.

Now we define our Student.
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">    <span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">class</span> <span style="color: #BB0066; font-weight: bold">Student</span>
    {
<span style="color: #0000CC">        [XmlAttribute("firstname")]</span>
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">string</span> FirstName { <span style="color: #008800; font-weight: bold">get</span>; <span style="color: #008800; font-weight: bold">set</span>; }

<span style="color: #0000CC">        [XmlAttribute("lastname")]</span>
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">string</span> LastName { <span style="color: #008800; font-weight: bold">get</span>; <span style="color: #008800; font-weight: bold">set</span>; }

<span style="color: #0000CC">        [XmlAttribute("studentid")]</span>
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">int</span> StudentID { <span style="color: #008800; font-weight: bold">get</span>; <span style="color: #008800; font-weight: bold">set</span>; }
    }
</pre></div>

Like before we have our XmlAttributes defined, and you can see here we have StudentID defined as an int. There is no other special code needed for things like int, double or float.

That defines our XML structure in C# code.

Now for the Reading and Writing. The code to read and write an XML file is always the same, and I find convenient to just make the Read and Write a static template function and just call that with the Class I want to read or write.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">static</span> T ReadXML&lt;T&gt;(<span style="color: #333399; font-weight: bold">string</span> filePath)
{
    <span style="color: #008800; font-weight: bold">try</span>
    {
        <span style="color: #008800; font-weight: bold">using</span> (FileStream stream = <span style="color: #008800; font-weight: bold">new</span> FileStream(filePath, FileMode.Open))
        {
            <span style="color: #333399; font-weight: bold">var</span> xsz = <span style="color: #008800; font-weight: bold">new</span> XmlSerializer(<span style="color: #008800; font-weight: bold">typeof</span>(T));
            <span style="color: #008800; font-weight: bold">return</span> (T)xsz.Deserialize(stream);
        }
    }
    <span style="color: #008800; font-weight: bold">catch</span> (Exception e)
    {
        Console.WriteLine(e.ToString());
    }
    <span style="color: #008800; font-weight: bold">return</span> <span style="color: #008800; font-weight: bold">default</span>;
}

<span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">static</span> <span style="color: #333399; font-weight: bold">bool</span> WriteXML&lt;T&gt;(T classToSave, <span style="color: #333399; font-weight: bold">string</span> filePath)
{
    <span style="color: #008800; font-weight: bold">try</span>
    {
        <span style="color: #008800; font-weight: bold">using</span> (FileStream stream = <span style="color: #008800; font-weight: bold">new</span> FileStream(filePath, FileMode.Create))
        {
            <span style="color: #333399; font-weight: bold">var</span> xsz = <span style="color: #008800; font-weight: bold">new</span> XmlSerializer(<span style="color: #008800; font-weight: bold">typeof</span>(T));
            xsz.Serialize(stream, classToSave);
        }
        <span style="color: #008800; font-weight: bold">return</span> <span style="color: #008800; font-weight: bold">true</span>;
    }
    <span style="color: #008800; font-weight: bold">catch</span> (Exception e)
    {
        Console.WriteLine(e.ToString());
        <span style="color: #008800; font-weight: bold">return</span> <span style="color: #008800; font-weight: bold">false</span>;
    }

}
</pre></div>

And with those two functions, you can read and write any XML file that is defined the way we did it above! XmlSerializer lives in the same System.Xml.Serialization namespace. Basically get a file stream, create the Serializer based on the class type, and call Serialize or Deserialize!

Now for the test code.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">static</span> <span style="color: #008800; font-weight: bold">void</span> <span style="color: #0066BB; font-weight: bold">Main</span>(<span style="color: #333399; font-weight: bold">string</span>[] args)
{
    StudentListFile slf = <span style="color: #008800; font-weight: bold">new</span> StudentListFile();
    slf.Classes = <span style="color: #008800; font-weight: bold">new</span> List&lt;Class&gt;() {
        <span style="color: #008800; font-weight: bold">new</span> <span style="color: #0066BB; font-weight: bold">Class</span>()
        {
            Name = <span style="background-color: #fff0f0">"History"</span>,
            Time = <span style="background-color: #fff0f0">"0700"</span>,
            Students = <span style="color: #008800; font-weight: bold">new</span> List&lt;Student&gt;()
            {
                <span style="color: #008800; font-weight: bold">new</span> <span style="color: #0066BB; font-weight: bold">Student</span>(){FirstName=<span style="background-color: #fff0f0">"Joanna"</span>, LastName=<span style="background-color: #fff0f0">"Johnson"</span>, StudentID=<span style="color: #6600EE; font-weight: bold">556825</span>},
                <span style="color: #008800; font-weight: bold">new</span> <span style="color: #0066BB; font-weight: bold">Student</span>(){FirstName=<span style="background-color: #fff0f0">"Frederick"</span>, LastName=<span style="background-color: #fff0f0">"Lemowitz"</span>, StudentID=<span style="color: #6600EE; font-weight: bold">567864</span>}
            }
        },
        <span style="color: #008800; font-weight: bold">new</span> <span style="color: #0066BB; font-weight: bold">Class</span>()
        {
            Name = <span style="background-color: #fff0f0">"Mathematics"</span>,
            Time = <span style="background-color: #fff0f0">"0800"</span>,
            Students = <span style="color: #008800; font-weight: bold">new</span> List&lt;Student&gt;()
            {
                <span style="color: #008800; font-weight: bold">new</span> <span style="color: #0066BB; font-weight: bold">Student</span>(){FirstName=<span style="background-color: #fff0f0">"Bobby"</span>, LastName=<span style="background-color: #fff0f0">"Villanova"</span>, StudentID=<span style="color: #6600EE; font-weight: bold">568845</span>},
                <span style="color: #008800; font-weight: bold">new</span> <span style="color: #0066BB; font-weight: bold">Student</span>(){FirstName=<span style="background-color: #fff0f0">"Sandra"</span>, LastName=<span style="background-color: #fff0f0">"Thomson"</span>, StudentID=<span style="color: #6600EE; font-weight: bold">574568</span>}
            }
        }
    };

    Console.WriteLine(<span style="background-color: #fff0f0">"Writing out Class List..."</span>);
    XmlUtils.WriteXML(slf, <span style="background-color: #fff0f0">"StudentList.xml"</span>);

    Console.WriteLine(<span style="background-color: #fff0f0">"Reading in Class List..."</span>);
    StudentListFile readFile = XmlUtils.ReadXML&lt;StudentListFile&gt;(<span style="background-color: #fff0f0">"StudentList.xml"</span>);
    <span style="color: #008800; font-weight: bold">foreach</span>(Class c <span style="color: #008800; font-weight: bold">in</span> readFile.Classes)
    {
        Console.WriteLine(<span style="color: #FF0000; background-color: #FFAAAA">$</span><span style="background-color: #fff0f0">"Class {c.Name} at {c.Time}"</span>);
        <span style="color: #008800; font-weight: bold">foreach</span>(Student s <span style="color: #008800; font-weight: bold">in</span> c.Students)
        {
            Console.WriteLine(<span style="color: #FF0000; background-color: #FFAAAA">$</span><span style="background-color: #fff0f0">"- Student {s.FirstName} {s.LastName} ID:{s.StudentID}"</span>);
        }
    }
}
</pre></div>

We create our StudentListFile class and the create a new List<Class>. If you are not familiar with the initializer syntax; I'm initializing the List<Class> with two new Class() elements. Then for each class, I'm using the {} syntax to set the properties of the Class to values and with that I'm creating the new List<Student>() for each class. For the students, I'm then doing the same with by using the {} syntax to set the values for each student. 

\*I think it is important to note that doing the {} syntax to set the values of a new class() property, the values are set after the constructor has been called. So if something in the constructor depends on one of the values being set, it won't be until after it is complete. So if there is value that needs to be set during construction, make sure to pass it in rather than use the {} syntax.\*

Then Write out the XML file... Read it back in and print it out to the console!

<p class="blog-img center md">
    <img src="/images/blog/XmlConsole.jpg" alt="">
</P>

And that is it! A very simple way to read and write XML files using C#.