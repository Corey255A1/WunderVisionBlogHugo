---
title: "UWP vs .Net Framework File Access"
date: "2019-06-24"
summary: "For better or worse I started working on a UWP (Universal Windows P..."
thumbnail: "/images/blog/2019-06-24-UWP_vs_Net_Framework_File_Access.jpg"
slug: "uwp-vs-net-framework-file-access"
---
<p class="blog-img center md">
    <img src="/images/blog/FileSystem.png" alt="">
    <div class="center">Simple XML File</div>
</p>

Source: [https://github.com/Corey255A1/.NetStandardFileSystemInterface](https://github.com/Corey255A1/.NetStandardFileSystemInterface)

For better or worse I started working on a UWP (Universal Windows Platform) app that I have published to the Microsoft Store. It is still in a hidden state so that I can continue testing it before publishing out to the rest of the world.

Due to the sandbox nature of UWP applications there are quite a bit of differences between UWP and just writing a plain old .Net Framework application. One being that Loop Back network connections are disabled and another being reading and writing off of the filesystem. The application I've been working on starts a really simple HTTP server - [https://www.wundervisionenvisionthefuture.com/post/net-standard-simple-http-server-websockets](https://www.wundervisionenvisionthefuture.com/post/net-standard-simple-http-server-websockets) - and allows people to play the game while the controller operates the app. The problem is that due to the loop back restriction, looking at this site from the same computer that is running the app is impossible. (Without jumping through hoops: [https://stackoverflow.com/questions/33259763/uwp-enable-local-network-loopback](https://stackoverflow.com/questions/33259763/uwp-enable-local-network-loopback)) Because of this, I decided to just spin out the game hosting portion into its own dll and build a simple WPF (Windows Presentation Foundation) frontend for it. This way, I can run the same game hosting code and test the webpages without using a VM, which I had been doing for testing. To use the DLL between .Net Framework and UWP, I put it in a .Net Standard 2.0 DLL. Your UWP project has to have a minimum target of the 16299 version or higher to use those dlls.

A Big hurdle for this was the difference in file access. The code I was refactoring would look in a folder and load all of the objects into memory. UWP does not allow the app free reign of the filesystem. The only files it can access are ones it has created in its own sand box, or ones that the user has explicitly chosen using a FilePicker. The API it uses is within the **Windows.Storage** namespace. You have to access objects using a StorageFile, StorageFolder, or StorageItem (Which both StorageFile and StorageFolder derive). If you use the classic **System.IO** objects they will throw File Permission errors. To make something that I could share between UWP and .Net Framework, I created a new interface that I then implement in both UWP and .Net Framework. Then to use the calls in the DLL where in the past it would pass in a StorageFolder, it now passes an IFileSystemObject. Looking at the interface implementations between the .NetFramework and UWP you can get a sense of what the equivalent calls. 

The demo source and projects are here: [https://github.com/Corey255A1/.NetStandardFileSystemInterface](https://github.com/Corey255A1/.NetStandardFileSystemInterface) Below are the snippets. 

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">interface</span> IFileSystemObject
    {
        <span style="color: #333399; font-weight: bold">bool</span> <span style="color: #0066BB; font-weight: bold">IsDirectory</span>();
        <span style="color: #333399; font-weight: bold">bool</span> <span style="color: #0066BB; font-weight: bold">IsFile</span>();
        <span style="color: #333399; font-weight: bold">string</span> <span style="color: #0066BB; font-weight: bold">FullPath</span>();
        <span style="color: #333399; font-weight: bold">string</span> <span style="color: #0066BB; font-weight: bold">FileName</span>();
        <span style="color: #333399; font-weight: bold">string</span> <span style="color: #0066BB; font-weight: bold">DirectoryName</span>();
        Task&lt;IFileSystemObject&gt; GetFile(<span style="color: #333399; font-weight: bold">string</span> file);
        Task&lt;<span style="color: #333399; font-weight: bold">byte</span>[]&gt; ReadAllBytes();

        Task&lt;String&gt; ReadAllText();

        Task&lt;Stream&gt; GetReadStream();
        

        Task&lt;IEnumerable&lt;IFileSystemObject&gt;&gt; EnumerateItems();
    }
</pre></div>



I haven't added any Writes yet, but using this, it would be trivial. All of the UWP file system calls are async and need to be awaited. So in the Interface, I defined all of the methods to return Tasks. You can add the Async call without ruining the interface.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">class</span> <span style="color: #BB0066; font-weight: bold">UWPFileSystemObject</span>: IFileSystemObject
    {
        <span style="color: #008800; font-weight: bold">protected</span> IStorageItem _fsitem;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #0066BB; font-weight: bold">UWPFileSystemObject</span>(IStorageItem fsitem) { _fsitem = fsitem; }
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">string</span> <span style="color: #0066BB; font-weight: bold">FileName</span>() =&gt; _fsitem.Name;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">string</span> <span style="color: #0066BB; font-weight: bold">DirectoryName</span>() =&gt; _fsitem.Name;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">string</span> <span style="color: #0066BB; font-weight: bold">FullPath</span>() =&gt; _fsitem.Path;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">bool</span> <span style="color: #0066BB; font-weight: bold">IsDirectory</span>() =&gt; _fsitem.IsOfType(StorageItemTypes.Folder);
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">bool</span> <span style="color: #0066BB; font-weight: bold">IsFile</span>() =&gt; _fsitem.IsOfType(StorageItemTypes.File);

        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">async</span> Task&lt;IFileSystemObject&gt; GetFile(<span style="color: #333399; font-weight: bold">string</span> file)
        {
            StorageFile fsitem = <span style="color: #008800; font-weight: bold">await</span> StorageFile.GetFileFromPathAsync(<span style="color: #FF0000; background-color: #FFAAAA">$</span><span style="background-color: #fff0f0">"{_fsitem.Path}\\{file}"</span>);
            <span style="color: #008800; font-weight: bold">return</span> <span style="color: #008800; font-weight: bold">new</span> <span style="color: #0066BB; font-weight: bold">UWPFileSystemObject</span>(fsitem);
        }

        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">async</span> Task&lt;<span style="color: #333399; font-weight: bold">byte</span>[]&gt; ReadAllBytes()
        {
            <span style="color: #008800; font-weight: bold">return</span> (<span style="color: #008800; font-weight: bold">await</span> FileIO.ReadBufferAsync(_fsitem <span style="color: #008800; font-weight: bold">as</span> StorageFile)).ToArray();
        }

        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">async</span> Task&lt;String&gt; ReadAllText()
        {
            <span style="color: #008800; font-weight: bold">return</span> (<span style="color: #008800; font-weight: bold">await</span> Windows.Storage.FileIO.ReadTextAsync(_fsitem <span style="color: #008800; font-weight: bold">as</span> StorageFile));
        }

        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">async</span> Task&lt;IEnumerable&lt;IFileSystemObject&gt;&gt; EnumerateItems()
        {
            <span style="color: #333399; font-weight: bold">var</span> fsobjects = <span style="color: #008800; font-weight: bold">new</span> List&lt;IFileSystemObject&gt;();            
            <span style="color: #008800; font-weight: bold">foreach</span> (<span style="color: #333399; font-weight: bold">var</span> file <span style="color: #008800; font-weight: bold">in</span> <span style="color: #008800; font-weight: bold">await</span> (_fsitem <span style="color: #008800; font-weight: bold">as</span> StorageFolder).GetItemsAsync())
            {
                fsobjects.Add(<span style="color: #008800; font-weight: bold">new</span> UWPFileSystemObject(file));
            }
            <span style="color: #008800; font-weight: bold">return</span> fsobjects;
        }

        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">async</span> Task&lt;Stream&gt; GetReadStream()
        {
            <span style="color: #008800; font-weight: bold">return</span> <span style="color: #0066BB; font-weight: bold">await</span> (_fsitem <span style="color: #008800; font-weight: bold">as</span> StorageFile).OpenStreamForReadAsync();
        }
    }
</pre></div>


The .Net Framework calls however, are synchronous. So in order to return a Task and be awaitable, they have to be wrapped in a Task.Run() call. 

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">class</span> <span style="color: #BB0066; font-weight: bold">FrameworkFSObject</span> : IFileSystemObject
    {
        <span style="color: #008800; font-weight: bold">protected</span> <span style="color: #333399; font-weight: bold">string</span> _path;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #0066BB; font-weight: bold">FrameworkFSObject</span>(<span style="color: #333399; font-weight: bold">string</span> path) { _path = path; }
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">string</span> <span style="color: #0066BB; font-weight: bold">FileName</span>() =&gt; Path.GetFileName(_path);
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">string</span> <span style="color: #0066BB; font-weight: bold">DirectoryName</span>() =&gt; Path.GetDirectoryName(_path);
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">string</span> <span style="color: #0066BB; font-weight: bold">FullPath</span>() =&gt; _path;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">bool</span> <span style="color: #0066BB; font-weight: bold">IsDirectory</span>() =&gt; Directory.Exists(_path);
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">bool</span> <span style="color: #0066BB; font-weight: bold">IsFile</span>() =&gt; File.Exists(_path);

        <span style="color: #008800; font-weight: bold">public</span> Task&lt;IFileSystemObject&gt; GetFile(<span style="color: #333399; font-weight: bold">string</span> file)
        {
            <span style="color: #008800; font-weight: bold">return</span> Task.Run(() =&gt;
            {
                <span style="color: #008800; font-weight: bold">if</span> (File.Exists(<span style="color: #FF0000; background-color: #FFAAAA">$</span><span style="background-color: #fff0f0">"{_path}\\{file}"</span>))
                {
                    <span style="color: #008800; font-weight: bold">return</span> (<span style="color: #008800; font-weight: bold">new</span> FrameworkFSObject(<span style="color: #FF0000; background-color: #FFAAAA">$</span><span style="background-color: #fff0f0">"{_path}\\{file}"</span>)) <span style="color: #008800; font-weight: bold">as</span> IFileSystemObject;
                }
                <span style="color: #008800; font-weight: bold">else</span>
                {
                    <span style="color: #008800; font-weight: bold">return</span> <span style="color: #008800; font-weight: bold">null</span>;
                }
            });
        }

        <span style="color: #008800; font-weight: bold">public</span> Task&lt;<span style="color: #333399; font-weight: bold">byte</span>[]&gt; ReadAllBytes()
        {
            <span style="color: #008800; font-weight: bold">return</span> Task.Run(() =&gt;
            {
                <span style="color: #008800; font-weight: bold">return</span> File.ReadAllBytes(_path);
            });
        }

        <span style="color: #008800; font-weight: bold">public</span> Task&lt;String&gt; ReadAllText()
        {
            <span style="color: #008800; font-weight: bold">return</span> Task.Run(() =&gt;
            {
                <span style="color: #008800; font-weight: bold">return</span> File.ReadAllText(_path);
            });
        }

        <span style="color: #008800; font-weight: bold">public</span> Task&lt;IEnumerable&lt;IFileSystemObject&gt;&gt; EnumerateItems()
        {
            <span style="color: #008800; font-weight: bold">return</span> Task.Run(()=&gt; {
                <span style="color: #333399; font-weight: bold">var</span> fsobjects = <span style="color: #008800; font-weight: bold">new</span> List&lt;IFileSystemObject&gt;();
                <span style="color: #008800; font-weight: bold">foreach</span> (<span style="color: #333399; font-weight: bold">var</span> file <span style="color: #008800; font-weight: bold">in</span> Directory.EnumerateFileSystemEntries(_path))
                {
                    fsobjects.Add(<span style="color: #008800; font-weight: bold">new</span> FrameworkFSObject(file));

                }
                <span style="color: #008800; font-weight: bold">return</span> fsobjects.AsEnumerable();
            }); 

        }

        <span style="color: #008800; font-weight: bold">public</span> Task&lt;Stream&gt; GetReadStream()
        {
            <span style="color: #008800; font-weight: bold">return</span> Task.Run(()=&gt; {
                <span style="color: #008800; font-weight: bold">return</span> File.Open(_path, FileMode.Open) <span style="color: #008800; font-weight: bold">as</span> Stream;
            });
        }

    }
</pre></div>

So there you go, if you want to write a Library that accesses the filesystem in both UWP and .Net Framework applications, you can go this route!