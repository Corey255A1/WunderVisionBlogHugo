---
title: "Interfacing with Azure SQL Server"
date: "2022-09-10"
summary: "I wanted to access a list of dance music for an dance music playlist site so I had to learn about setting up a database."
thumbnail: "/images/blog/2022-09-10-Azure_SQL_Server.jpg"
slug: "2022-09-10-Azure_SQL_Server"
---
For one of the many many side projects I am working on, I wanted to implement a database for a list of music associated with their dance style (Waltz, Tango, etc). This was the perfect opportunity to learn about creating an Azure database and connecting to it in various ways.
I don’t like writing direct step by step how to’s because they are typically obsolete before they are published. I like to provide the progress and any pitfalls I found along the way.

One thing that I’ve found about ASP.Net Core is that the documentation, at least at this moment in time, is all over the place. There have been so many different versions that the documentation is scattered between all of them. It also doesn’t help that a lot of the documentation uses selections from Visual Studio. Which is great once you understand what it is doing, but I like to do things the hard way first so that I know what the automated stuff is doing. This way when things go wrong I have an understanding of why it failed.

I have been doing this all from my Chromebook using VS Code. I’m sure there is an easier way to execute SQL statements on the Azure SQL Server instance, however, I found this way and stuck with it for now. I have the Azure VSCode extensions installed that makes it easy to connect and monitor the Azure Databases and other Azure products

The first thing I needed to do was create the tables for my database. I don’t know much about optimizations or database architecture, but this is pretty simple and doesn’t have to be fancy.

<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #999999; font-style: italic">-- Create a new database called &#39;DanceMusic&#39;</span>
<span style="color: #999999; font-style: italic">-- Connect to the &#39;master&#39; database to run this snippet</span>
<span style="color: #d0d0d0">USE</span> <span style="color: #d0d0d0">master</span>
<span style="color: #6ab825; font-weight: bold">GO</span>
<span style="color: #999999; font-style: italic">-- Create the new database if it does not exist already</span>
<span style="color: #d0d0d0">IF</span> <span style="color: #6ab825; font-weight: bold">NOT</span> <span style="color: #6ab825; font-weight: bold">EXISTS</span> <span style="color: #d0d0d0">(</span>
   <span style="color: #6ab825; font-weight: bold">SELECT</span> <span style="color: #d0d0d0">name</span>
       <span style="color: #6ab825; font-weight: bold">FROM</span> <span style="color: #d0d0d0">sys.databases</span>
       <span style="color: #6ab825; font-weight: bold">WHERE</span> <span style="color: #d0d0d0">name</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">N</span><span style="color: #ed9d13">&#39;DanceMusic&#39;</span>
<span style="color: #d0d0d0">)</span>
<span style="color: #6ab825; font-weight: bold">CREATE</span> <span style="color: #6ab825; font-weight: bold">DATABASE</span> <span style="color: #d0d0d0">DanceMusic</span>
<span style="color: #6ab825; font-weight: bold">GO</span>
 
<span style="color: #999999; font-style: italic">--Create this schema first</span>
<span style="color: #6ab825; font-weight: bold">CREATE</span> <span style="color: #6ab825; font-weight: bold">SCHEMA</span> <span style="color: #d0d0d0">DanceMusic</span>
 
<span style="color: #999999; font-style: italic">-- Create a new table called &#39;DanceStyles&#39; in schema &#39;DanceMusic&#39;</span>
<span style="color: #999999; font-style: italic">-- Drop the table if it already exists</span>
<span style="color: #d0d0d0">IF</span> <span style="color: #d0d0d0">OBJECT_ID(</span><span style="color: #ed9d13">&#39;DanceMusic.DanceStyles&#39;</span><span style="color: #d0d0d0">,</span> <span style="color: #ed9d13">&#39;U&#39;</span><span style="color: #d0d0d0">)</span> <span style="color: #6ab825; font-weight: bold">IS</span> <span style="color: #6ab825; font-weight: bold">NOT</span> <span style="color: #6ab825; font-weight: bold">NULL</span>
<span style="color: #6ab825; font-weight: bold">DROP</span> <span style="color: #6ab825; font-weight: bold">TABLE</span> <span style="color: #d0d0d0">DanceMusic.DanceStyles</span>
<span style="color: #6ab825; font-weight: bold">GO</span>
<span style="color: #999999; font-style: italic">-- Create the table in the specified schema</span>
<span style="color: #6ab825; font-weight: bold">CREATE</span> <span style="color: #6ab825; font-weight: bold">TABLE</span> <span style="color: #d0d0d0">DanceMusic.DanceStyles</span>
<span style="color: #d0d0d0">(</span>
   <span style="color: #d0d0d0">DanceStylesId</span> <span style="color: #24909d">INT</span> <span style="color: #6ab825; font-weight: bold">IDENTITY</span><span style="color: #d0d0d0">(</span><span style="color: #3677a9">1</span><span style="color: #d0d0d0">,</span><span style="color: #3677a9">1</span><span style="color: #d0d0d0">)</span> <span style="color: #6ab825; font-weight: bold">PRIMARY</span> <span style="color: #6ab825; font-weight: bold">KEY</span><span style="color: #d0d0d0">,</span> <span style="color: #999999; font-style: italic">-- primary key column</span>
   <span style="color: #d0d0d0">Style</span> <span style="color: #d0d0d0">[NVARCHAR](</span><span style="color: #3677a9">256</span><span style="color: #d0d0d0">)</span> <span style="color: #6ab825; font-weight: bold">NOT</span> <span style="color: #6ab825; font-weight: bold">NULL</span>
<span style="color: #d0d0d0">);</span>
<span style="color: #6ab825; font-weight: bold">GO</span>
 
<span style="color: #999999; font-style: italic">-- Insert rows into table &#39;DanceStyles&#39;</span>
<span style="color: #6ab825; font-weight: bold">INSERT</span> <span style="color: #6ab825; font-weight: bold">INTO</span> <span style="color: #d0d0d0">DanceMusic.DanceStyles</span>
<span style="color: #d0d0d0">(</span> <span style="color: #999999; font-style: italic">-- columns to insert data into</span>
<span style="color: #d0d0d0">Style</span>
<span style="color: #d0d0d0">)</span>
<span style="color: #6ab825; font-weight: bold">VALUES</span>
<span style="color: #d0d0d0">(</span> <span style="color: #999999; font-style: italic">-- first row: values for the columns in the list above</span>
<span style="color: #ed9d13">&#39;Waltz&#39;</span>
<span style="color: #d0d0d0">)</span>
<span style="color: #6ab825; font-weight: bold">GO</span>
 
 
 
<span style="color: #999999; font-style: italic">-- Create a new table called &#39;Music&#39; in schema &#39;DanceMusic&#39;</span>
<span style="color: #999999; font-style: italic">-- Drop the table if it already exists</span>
<span style="color: #d0d0d0">IF</span> <span style="color: #d0d0d0">OBJECT_ID(</span><span style="color: #ed9d13">&#39;DanceMusic.Music&#39;</span><span style="color: #d0d0d0">,</span> <span style="color: #ed9d13">&#39;U&#39;</span><span style="color: #d0d0d0">)</span> <span style="color: #6ab825; font-weight: bold">IS</span> <span style="color: #6ab825; font-weight: bold">NOT</span> <span style="color: #6ab825; font-weight: bold">NULL</span>
<span style="color: #6ab825; font-weight: bold">DROP</span> <span style="color: #6ab825; font-weight: bold">TABLE</span> <span style="color: #d0d0d0">DanceMusic.Music</span>
<span style="color: #6ab825; font-weight: bold">GO</span>
<span style="color: #999999; font-style: italic">-- Create the table in the specified schema</span>
<span style="color: #6ab825; font-weight: bold">CREATE</span> <span style="color: #6ab825; font-weight: bold">TABLE</span> <span style="color: #d0d0d0">DanceMusic.Music</span>
<span style="color: #d0d0d0">(</span>
   <span style="color: #d0d0d0">MusicId</span> <span style="color: #24909d">INT</span> <span style="color: #6ab825; font-weight: bold">IDENTITY</span><span style="color: #d0d0d0">(</span><span style="color: #3677a9">1</span><span style="color: #d0d0d0">,</span><span style="color: #3677a9">1</span><span style="color: #d0d0d0">)</span> <span style="color: #6ab825; font-weight: bold">PRIMARY</span> <span style="color: #6ab825; font-weight: bold">KEY</span><span style="color: #d0d0d0">,</span> <span style="color: #999999; font-style: italic">-- primary key column</span>
   <span style="color: #d0d0d0">Title</span> <span style="color: #d0d0d0">[NVARCHAR](</span><span style="color: #3677a9">256</span><span style="color: #d0d0d0">)</span> <span style="color: #6ab825; font-weight: bold">NOT</span> <span style="color: #6ab825; font-weight: bold">NULL</span><span style="color: #d0d0d0">,</span>
   <span style="color: #d0d0d0">Artist</span> <span style="color: #d0d0d0">[NVARCHAR](</span><span style="color: #3677a9">256</span><span style="color: #d0d0d0">)</span> <span style="color: #6ab825; font-weight: bold">NOT</span> <span style="color: #6ab825; font-weight: bold">NULL</span><span style="color: #d0d0d0">,</span>
   <span style="color: #d0d0d0">DanceStylesId</span> <span style="color: #24909d">INT</span> <span style="color: #6ab825; font-weight: bold">FOREIGN</span> <span style="color: #6ab825; font-weight: bold">KEY</span> <span style="color: #6ab825; font-weight: bold">REFERENCES</span>  <span style="color: #d0d0d0">DanceMusic.DanceStyles(DanceStylesId)</span>
   <span style="color: #999999; font-style: italic">-- specify more columns here</span>
<span style="color: #d0d0d0">);</span>
<span style="color: #6ab825; font-weight: bold">GO</span>
 
<span style="color: #999999; font-style: italic">-- Insert rows into table &#39;DanceMusic.Music&#39;</span>
<span style="color: #6ab825; font-weight: bold">INSERT</span> <span style="color: #6ab825; font-weight: bold">INTO</span> <span style="color: #d0d0d0">DanceMusic.Music</span>
<span style="color: #d0d0d0">(</span> <span style="color: #999999; font-style: italic">-- columns to insert data into</span>
<span style="color: #d0d0d0">Title,</span> <span style="color: #d0d0d0">Artist,</span> <span style="color: #d0d0d0">DanceStylesId</span>
<span style="color: #d0d0d0">)</span>
<span style="color: #6ab825; font-weight: bold">VALUES</span>
<span style="color: #d0d0d0">(</span> <span style="color: #999999; font-style: italic">-- first row: values for the columns in the list above</span>
<span style="color: #ed9d13">&#39;Tennessee Waltz&#39;</span><span style="color: #d0d0d0">,</span> <span style="color: #ed9d13">&#39;Patti Page&#39;</span><span style="color: #d0d0d0">,</span> <span style="color: #3677a9">1</span>
<span style="color: #d0d0d0">),</span>
<span style="color: #d0d0d0">(</span> <span style="color: #999999; font-style: italic">-- second row: values for the columns in the list above</span>
<span style="color: #ed9d13">&#39;Take it to the limit&#39;</span><span style="color: #d0d0d0">,</span> <span style="color: #ed9d13">&#39;The Eagles&#39;</span><span style="color: #d0d0d0">,</span> <span style="color: #3677a9">1</span>
<span style="color: #d0d0d0">)</span>
<span style="color: #999999; font-style: italic">-- add more rows here</span>
<span style="color: #6ab825; font-weight: bold">GO</span>
 
<span style="color: #999999; font-style: italic">-- query examples</span>
<span style="color: #6ab825; font-weight: bold">SELECT</span> <span style="color: #d0d0d0">Music.Title,</span> <span style="color: #d0d0d0">DanceStyles.Style</span> <span style="color: #6ab825; font-weight: bold">from</span> <span style="color: #d0d0d0">DanceMusic.Music</span>
<span style="color: #6ab825; font-weight: bold">INNER</span> <span style="color: #6ab825; font-weight: bold">JOIN</span> <span style="color: #d0d0d0">DanceMusic.DanceStyles</span>
<span style="color: #6ab825; font-weight: bold">ON</span> <span style="color: #d0d0d0">Music.DanceStyleId=DanceStyles.DanceStylesId</span>
 
<span style="color: #6ab825; font-weight: bold">Select</span> <span style="color: #d0d0d0">DanceStyles.DanceStylesId</span> <span style="color: #6ab825; font-weight: bold">FROM</span> <span style="color: #d0d0d0">DanceMusic.DanceStyles</span> <span style="color: #6ab825; font-weight: bold">Where</span> <span style="color: #d0d0d0">DanceStyles.Style=</span><span style="color: #ed9d13">&#39;Waltz&#39;</span>
<span style="color: #6ab825; font-weight: bold">GO</span>
</pre></div>  


### Populating the Database

Once the tables were created, I needed to add my CSV of dance music to the database.
I used NodeJS to do this part because it is quick to develop. To access the database, use the tedious module which is the MS recommended package to use.
First it loads the CSV using the CSV module. Then it loops through the songs and builds the style set to be added to the DanceStyles table.
After the DanceStyles table is populated, the DanceMusic table can be populated with the foreign key for the DanceStylesId set to the correct style. I set up the NodeJS project to query all of the styles, and grab the assigned ids.
Great! All of the data is now in the database. How do we use it? I already had the code to make queries in NodeJS. I can use the sql commands from the VS Code Execution.

### Integrating with ASP.Net Core

The goal is to integrate this database into my asp.net core web project. I started with a simple class that used the **Microsoft.Data.SqlClient** NuGet package.

With this library you can create a basic SqlConnection and execute SqlCommands directly. You can then execute basically any SQL statement and parse the response. The response back is a reader that reads each row at a time.

<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #6ab825; font-weight: bold">string</span> <span style="color: #d0d0d0">sql</span> <span style="color: #d0d0d0">=</span> <span style="color: #a61717; background-color: #e3d2d2">$</span><span style="color: #ed9d13">&quot;SELECT Artist, Title FROM DanceMusic.Music WHERE DanceStylesId={style_id}&quot;</span><span style="color: #d0d0d0">;</span>
<span style="color: #6ab825; font-weight: bold">using</span> <span style="color: #d0d0d0">(SqlConnection</span> <span style="color: #d0d0d0">connection</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">SqlConnection(_connection_string))</span>
<span style="color: #d0d0d0">{</span>
    <span style="color: #d0d0d0">connection.Open();</span>
    <span style="color: #6ab825; font-weight: bold">using</span> <span style="color: #d0d0d0">(SqlCommand</span> <span style="color: #d0d0d0">command</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">SqlCommand(sql,</span> <span style="color: #d0d0d0">connection))</span>
    <span style="color: #d0d0d0">{</span>
        <span style="color: #6ab825; font-weight: bold">using</span> <span style="color: #d0d0d0">(SqlDataReader</span> <span style="color: #d0d0d0">reader</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">await</span> <span style="color: #d0d0d0">command.ExecuteReaderAsync())</span>
        <span style="color: #d0d0d0">{</span>                           
            <span style="color: #6ab825; font-weight: bold">var</span> <span style="color: #d0d0d0">song_list</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">List&lt;Song&gt;();</span>
            <span style="color: #6ab825; font-weight: bold">while</span> <span style="color: #d0d0d0">(reader.Read())</span>
            <span style="color: #d0d0d0">{</span>
                <span style="color: #d0d0d0">song_list.Add(</span><span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">Song(){Artist=reader.GetString(</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">),</span> <span style="color: #d0d0d0">Title=reader.GetString(</span><span style="color: #3677a9">1</span><span style="color: #d0d0d0">)});</span>
            <span style="color: #d0d0d0">}</span>
            <span style="color: #6ab825; font-weight: bold">return</span> <span style="color: #d0d0d0">song_list;</span>
        <span style="color: #d0d0d0">}</span>
    <span style="color: #d0d0d0">}</span>                    
<span style="color: #d0d0d0">}</span>
</pre></div>
  
I refactored that code a bit to encapsulate the connection code  

<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #6ab825; font-weight: bold">private</span> <span style="color: #6ab825; font-weight: bold">static</span> <span style="color: #6ab825; font-weight: bold">async</span> <span style="color: #d0d0d0">Task&lt;R&gt;</span> <span style="color: #d0d0d0">ExecuteDatabaseAction&lt;R&gt;(</span><span style="color: #6ab825; font-weight: bold">string</span> <span style="color: #d0d0d0">sql,</span> <span style="color: #d0d0d0">Func&lt;SqlDataReader,</span> <span style="color: #d0d0d0">R&gt;</span> <span style="color: #d0d0d0">callback){</span>
    <span style="color: #6ab825; font-weight: bold">try</span><span style="color: #d0d0d0">{</span>
        <span style="color: #6ab825; font-weight: bold">using</span> <span style="color: #d0d0d0">(SqlConnection</span> <span style="color: #d0d0d0">connection</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">SqlConnection(_connection_string))</span>
        <span style="color: #d0d0d0">{</span>
            <span style="color: #d0d0d0">connection.Open();</span>
            <span style="color: #6ab825; font-weight: bold">using</span> <span style="color: #d0d0d0">(SqlCommand</span> <span style="color: #d0d0d0">command</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">SqlCommand(sql,</span> <span style="color: #d0d0d0">connection))</span>
            <span style="color: #d0d0d0">{</span>
                <span style="color: #6ab825; font-weight: bold">using</span> <span style="color: #d0d0d0">(SqlDataReader</span> <span style="color: #d0d0d0">reader</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">await</span> <span style="color: #d0d0d0">command.ExecuteReaderAsync())</span>
                <span style="color: #d0d0d0">{</span>                           
                    <span style="color: #6ab825; font-weight: bold">return</span> <span style="color: #447fcf">callback</span><span style="color: #d0d0d0">(reader);</span>
                <span style="color: #d0d0d0">}</span>
            <span style="color: #d0d0d0">}</span>                    
        <span style="color: #d0d0d0">}</span>
    <span style="color: #d0d0d0">}</span>
    <span style="color: #6ab825; font-weight: bold">catch</span><span style="color: #d0d0d0">{</span>
        <span style="color: #6ab825; font-weight: bold">return</span> <span style="color: #447fcf">default</span><span style="color: #d0d0d0">(R);</span>
    <span style="color: #d0d0d0">}</span>
<span style="color: #d0d0d0">}</span>
<span style="color: #6ab825; font-weight: bold">public</span> <span style="color: #d0d0d0">Task&lt;List&lt;Song&gt;&gt;</span> <span style="color: #d0d0d0">GetSongsByStyleId(</span><span style="color: #6ab825; font-weight: bold">int</span> <span style="color: #d0d0d0">style_id){</span>
    <span style="color: #6ab825; font-weight: bold">string</span> <span style="color: #d0d0d0">sql</span> <span style="color: #d0d0d0">=</span> <span style="color: #a61717; background-color: #e3d2d2">$</span><span style="color: #ed9d13">&quot;SELECT Artist, Title FROM DanceMusic.Music WHERE DanceStylesId={style_id}&quot;</span><span style="color: #d0d0d0">;</span>
    <span style="color: #6ab825; font-weight: bold">return</span> <span style="color: #6ab825; font-weight: bold">await</span> <span style="color: #d0d0d0">ExecuteDatabaseAction&lt;List&lt;Song&gt;&gt;(sql,</span> <span style="color: #d0d0d0">(reader)=&gt;{</span>
        <span style="color: #6ab825; font-weight: bold">var</span> <span style="color: #d0d0d0">song_list</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">List&lt;Song&gt;();</span>
        <span style="color: #6ab825; font-weight: bold">while</span> <span style="color: #d0d0d0">(reader.Read())</span>
        <span style="color: #d0d0d0">{</span>
            <span style="color: #d0d0d0">song_list.Add(</span><span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">Song(){Artist=reader.GetString(</span><span style="color: #3677a9">0</span><span style="color: #d0d0d0">),</span> <span style="color: #d0d0d0">Title=reader.GetString(</span><span style="color: #3677a9">1</span><span style="color: #d0d0d0">)});</span>
        <span style="color: #d0d0d0">}</span>
        <span style="color: #6ab825; font-weight: bold">return</span> <span style="color: #d0d0d0">song_list;</span>
    <span style="color: #d0d0d0">});</span>
<span style="color: #d0d0d0">}</span>
</pre></div>



Using this basic connection I was able to implement the end point to test the SQL query and send back a JSON response of my data!
However it was clunky, and not really ideal since it requires sending SQL strings that have to be handled correctly.



### Entity Framework Core 
I have read about Entity Framework Core in the past and so I went to dig into this and give it a try. It seemed to be the preferred way to access database objects. This lets .Net handle the translation from a database object to a C# object.

A lot of the examples assumes you are starting from the C# side defining the objects and then using that to migrate the tables and columns to a table. I wanted to go the other way, connecting the C# side to existing tables and columns.
Add the **Microsoft.EntityFrameworkCore.SqlServer** NuGet package, or equivalent for your backend database server type.
It turns out to be pretty straight forward. Add the DataAnnotations annotations to the C# classes I wanted to represent the database rows.
The next part was defining the DBContext. I once again found documentation that differed on how to configure them. Class itself is again not complex after finding the bare minimum.  

In the ConfigureServices method of the Startup class, add the DBContext for use by dependency injection. It took me a while to understand how the dependency injection system works. When the DBContext is added to the service collection, it can then be used from other parts of the code, such as the Controllers. If the controller constructor has a parameter that matches a dependency, it will be passed in automatically.

<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #d0d0d0">services.AddDbContext&lt;Contexts.DanceMusicDbContext&gt;(options=&gt;{</span>
    <span style="color: #6ab825; font-weight: bold">var</span> <span style="color: #d0d0d0">builder</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">SqlConnectionStringBuilder();</span>
    <span style="color: #d0d0d0">builder.DataSource</span> <span style="color: #d0d0d0">=</span> <span style="color: #ed9d13">&quot;[url].database.windows.net&quot;</span><span style="color: #d0d0d0">;</span> 
    <span style="color: #d0d0d0">builder.UserID</span> <span style="color: #d0d0d0">=</span> <span style="color: #ed9d13">&quot;[userid]&quot;</span><span style="color: #d0d0d0">;</span>            
    <span style="color: #d0d0d0">builder.Password</span> <span style="color: #d0d0d0">=</span> <span style="color: #ed9d13">&quot;[password]&quot;</span><span style="color: #d0d0d0">;</span>     
    <span style="color: #d0d0d0">builder.InitialCatalog</span> <span style="color: #d0d0d0">=</span> <span style="color: #ed9d13">&quot;[database]&quot;</span><span style="color: #d0d0d0">;</span>
    <span style="color: #d0d0d0">builder.Encrypt=</span><span style="color: #6ab825; font-weight: bold">true</span><span style="color: #d0d0d0">;</span>
    <span style="color: #d0d0d0">options.UseSqlServer(builder.ConnectionString);</span>
<span style="color: #d0d0d0">});</span>
</pre></div>

Getting the DBContext through dependency injection. This happens magically.
<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">        <span style="color: #6ab825; font-weight: bold">public</span> <span style="color: #447fcf">DanceSequenceController</span><span style="color: #d0d0d0">(DanceMusicDbContext</span> <span style="color: #d0d0d0">dance_db,</span> <span style="color: #d0d0d0">DanceSequenceService</span> <span style="color: #d0d0d0">dance_service,</span> <span style="color: #d0d0d0">IWebHostEnvironment</span> <span style="color: #d0d0d0">env,</span> <span style="color: #d0d0d0">IHubContext&lt;DanceSequenceUpdateHub&gt;</span> <span style="color: #d0d0d0">real_time_hub)</span>
        <span style="color: #d0d0d0">{</span>
            <span style="color: #d0d0d0">_env</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">env;</span>
            <span style="color: #d0d0d0">_vote_update_hub</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">real_time_hub;</span>
            <span style="color: #d0d0d0">_dance_serivce</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">dance_service;</span>
            <span style="color: #d0d0d0">_dance_db</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">dance_db;</span>
        <span style="color: #d0d0d0">}</span>
</pre></div>


The DBContext makes it simple to get data from the database using the LINQ syntax. I heard about the Fluent API syntax, but I haven’t gotten that far yet. I wanted the database query to be asynchronous so I wrapped them in a Task. It wasn’t quite clear to me whether or not there is a way to use LINQ with an await, but I knew I could do it this way with the task.


<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #6ab825; font-weight: bold">public</span> <span style="color: #d0d0d0">Task&lt;List&lt;Song&gt;&gt;</span> <span style="color: #d0d0d0">GetSongsByStyleId(</span><span style="color: #6ab825; font-weight: bold">int</span> <span style="color: #d0d0d0">style_id){</span>
<span style="color: #6ab825; font-weight: bold">  var</span> <span style="color: #d0d0d0">task</span> <span style="color: #d0d0d0">=</span> <span style="color: #6ab825; font-weight: bold">new</span> <span style="color: #d0d0d0">Task&lt;List&lt;Song&gt;&gt;(()=&gt;{</span>
<span style="color: #6ab825; font-weight: bold">      return</span> <span style="color: #d0d0d0">_dance_db.Songs.Where(song=&gt;song.DanceStylesId</span> <span style="color: #d0d0d0">==</span> <span style="color: #d0d0d0">style_id).Cast&lt;Song&gt;().ToList();</span>
<span style="color: #d0d0d0">  });</span>
<span style="color: #6ab825; font-weight: bold">  return</span> <span style="color: #d0d0d0">task;</span>
<span style="color: #d0d0d0">}</span>
</pre></div>


During initial testing, I was using the SqlConnectionBuilder to build the connection string required to connect to the database. This included hardcoding the username and password which is not acceptable.
To make it safe and deployable to the Azure app service, there is a programmatic way to access the connection string from the environment. Again throughout the documentation there are multiple ways of storing and getting connection strings. There are several different files and locations, and classes for accessing.


    dotnet user-secrets init  
    dotnet user-secrets set ConnectionStrings:[Name] “Value”

If you are on linux and you happen to have special characters in your connection string, use single quotes instead of double quotes.

    dotnet user-secrets set ConnectionStrings:[Name] ‘Value’

Took me some googling to finally figure that out. Using escape characters with the double quotes make it store, however the \ remains in the string. Single quotes works without the need of escape characters

I noticed a difference between the SqlConnectionStringBuilder and the Connection string from the Azure configuration page for the database. The DataSource and the Server parameter are equivalent. Apparently there are several parameters that have synonyms. Just to add to the confusion.

<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #d0d0d0">services.AddDbContext&lt;Contexts.DanceMusicDbContext&gt;(options=&gt;{</span>
    <span style="color: #d0d0d0">options.UseSqlServer(Configuration.GetConnectionString(</span><span style="color: #ed9d13">&quot;[Name]&quot;</span><span style="color: #d0d0d0">));</span>
<span style="color: #d0d0d0">});</span>
</pre></div>

All there is left to do is deploy it and add the connection string to the app service configuration page. Make sure you click the save button after adding the string. The app will then reload and magically read the string just like in the local development environment.

### Using sqlcmd
I wanted a way to access the database from a command line, but when I was getting things going, I was content with just executing the sql commands from VS Code.
Somewhere along the line I must have installed Microsoft Sql Server because I have access to sqlcmd. This allows you to connect to the Sql Server database and make queries. Though it does not seem intuitive at first.
```bash
sqlcmd -S [serverurl].database.windows.net -d [database] -U [username] -P [password]
```
Once logged in you should be greeted with 1>
You can list the tables with the command
```sql
select * from sysobjects where xtype='U'
go
```
From here it becomes a matter of knowing how to use the SQL Server style of SQL. It seems like every statement ends in a go.
I’m glad I figured this out, because now I can play around with making new databases, and continue my learning journey.
