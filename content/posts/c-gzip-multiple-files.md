---
title: "C# GZip Multiple Files"
date: "2019-09-15"
summary: "Using C# quickly Compress and Decompress multiple files  without the use of 3rd party libraries!"
thumbnail: "/images/blog/2019-09-15-CS_GZip_Multiple_Files.jpg"
slug: "c-gzip-multiple-files"
---
<p class="blog-img float-left md">
	<img src="/images/blog/Compression.jpg" alt="">
</p>
An application I'm working on deals with loading in a group of files. I wanted to make it easier to import and export packages and so was looking at the compression options that C# has built in.

The **System.IO.Compression** namespace includes the **GZipStream** class that can be used to compress files and memory. The examples on MSDN show the straight forward way of compressing a single file, however in my case I wanted to do several files. Not wanting to use any 3rd party libraries, I came up with my own way of doing this.

[https://github.com/Corey255A1/WunderVisionMiscCode/blob/master/GZipMulti/GZipMultiLib/GZipFiles.cs](https://github.com/Corey255A1/WunderVisionMiscCode/blob/master/GZipMulti/GZipMultiLib/GZipFiles.cs)

GZipStream compresses a MemoryStream. The trick is to create a memory stream that contains the files to compress, and write it out in a single block. However the issue then becomes, how do you know what the files are and how big are they?

I blocked out the memory like this.  
[FileNameLength 4bytes]  
[FileName (FileNameLength bytes)]  
[FileLength 8bytes] [File (FileLength bytes)]  
.. repeat  

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">using</span> (MemoryStream stream = <span style="color: #008800; font-weight: bold">new</span> MemoryStream())
{
	<span style="color: #008800; font-weight: bold">foreach</span> (FileInfo file <span style="color: #008800; font-weight: bold">in</span> files)
	{
		<span style="color: #333399; font-weight: bold">byte</span>[] filenameBytes = Encoding.Unicode.GetBytes(file.Name);
		<span style="color: #333399; font-weight: bold">byte</span>[] filenameLength = BitConverter.GetBytes(filenameBytes.Length);
		<span style="color: #333399; font-weight: bold">var</span> fstream = file.OpenRead();
		<span style="color: #333399; font-weight: bold">long</span> size = fstream.Length;
		<span style="color: #333399; font-weight: bold">byte</span>[] fileBytesLength = BitConverter.GetBytes(size);
		stream.Write(filenameLength, <span style="color: #6600EE; font-weight: bold">0</span>, filenameLength.Length);
		stream.Write(filenameBytes, <span style="color: #6600EE; font-weight: bold">0</span>, filenameBytes.Length);
		stream.Write(fileBytesLength, <span style="color: #6600EE; font-weight: bold">0</span>, fileBytesLength.Length);
		fstream.CopyTo(stream);
	}
	stream.Position = <span style="color: #6600EE; font-weight: bold">0</span>;

	<span style="color: #008800; font-weight: bold">using</span> (FileStream compressTo = File.Create(filepath))
	{
		<span style="color: #008800; font-weight: bold">using</span> (GZipStream compression = <span style="color: #008800; font-weight: bold">new</span> GZipStream(compressTo, CompressionMode.Compress))
		{
			stream.CopyTo(compression);
		}
	}
}
</pre></div>

I was having issues at first when trying to write out the MemoryStream, and finally realized the issue was because the stream position was at the end of the memory stream. Be sure to stream.Position = 0 the stream before calling the CopyTo. 

Then when Decompressing the package it is straight forward how to get the files. 

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">using</span> (FileStream decompressFrom = File.OpenRead(filepath))
{
	<span style="color: #008800; font-weight: bold">using</span> (GZipStream compression = <span style="color: #008800; font-weight: bold">new</span> GZipStream(decompressFrom, CompressionMode.Decompress))
	{
		<span style="color: #008800; font-weight: bold">using</span> (MemoryStream decomp = <span style="color: #008800; font-weight: bold">new</span> MemoryStream())
		{
			compression.CopyTo(decomp);
			decomp.Position = <span style="color: #6600EE; font-weight: bold">0</span>;
			<span style="color: #333399; font-weight: bold">byte</span>[] filenameLength = <span style="color: #008800; font-weight: bold">new</span> <span style="color: #333399; font-weight: bold">byte</span>[<span style="color: #6600EE; font-weight: bold">4</span>];
			<span style="color: #333399; font-weight: bold">byte</span>[] fileBytesLength = <span style="color: #008800; font-weight: bold">new</span> <span style="color: #333399; font-weight: bold">byte</span>[<span style="color: #6600EE; font-weight: bold">8</span>];
			<span style="color: #008800; font-weight: bold">while</span> (decomp.Position != decomp.Length)
			{
				decomp.Read(filenameLength, <span style="color: #6600EE; font-weight: bold">0</span>, filenameLength.Length);
				<span style="color: #333399; font-weight: bold">int</span> filenameInt = BitConverter.ToInt32(filenameLength, <span style="color: #6600EE; font-weight: bold">0</span>);

				<span style="color: #333399; font-weight: bold">byte</span>[] filenameBytes = <span style="color: #008800; font-weight: bold">new</span> <span style="color: #333399; font-weight: bold">byte</span>[filenameInt];
				decomp.Read(filenameBytes, <span style="color: #6600EE; font-weight: bold">0</span>, filenameBytes.Length);
				<span style="color: #333399; font-weight: bold">string</span> filename = Encoding.Unicode.GetString(filenameBytes);

				decomp.Read(fileBytesLength, <span style="color: #6600EE; font-weight: bold">0</span>, fileBytesLength.Length);
				<span style="color: #333399; font-weight: bold">long</span> filesizeInt = BitConverter.ToInt64(fileBytesLength, <span style="color: #6600EE; font-weight: bold">0</span>);

				<span style="color: #333399; font-weight: bold">byte</span>[] fileBytes = <span style="color: #008800; font-weight: bold">new</span> <span style="color: #333399; font-weight: bold">byte</span>[filesizeInt];
				decomp.Read(fileBytes, <span style="color: #6600EE; font-weight: bold">0</span>, fileBytes.Length);

				File.WriteAllBytes(outputfolder + filename, fileBytes);
			}
		}
	}
</pre></div>

Calling the CopyTo on the GZipStream decompresses the files into the MemoryStream, and then it traverses through the memory parsing out each file.

And with that, you can package and unpackage multiple files! No Thirdparty libs required! This could be extended to include nested directories fairly easily. Just include the directories in the file name and when unpacking, create them. In my case I just need one level of files.