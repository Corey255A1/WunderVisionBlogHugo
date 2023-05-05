---
title: "VR Desktop: Screen Capture"
date: "2022-10-02"
summary: "Capturing, Compressing and Comparing regions."
thumbnail: "/images/blog/2022-10-02-VRDesktop_ScreenCapture.jpg"
slug: "2022-10-02-VRDesktop_ScreenCapture"
tags: ["C++","Win32"]
---

I wanted to be able to view my desktop but be surrounded by a 360 view of cool places outside. To do this, I had to capture the desktop, transmit those images to my phone, and then render those images in virtual reality. I don't currently have a VR headset, but I have one of those phone based headsets. The next couple of blog posts will be talking about the different pieces of the project.

<div class="embed-youtube">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/KFBgEsjaJoc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

This is the first step in streaming my desktop into a web browser on my phone.

The source for the screen capture: [WindowsScreenCaptureLib](https://github.com/Corey255A1/WindowsScreenCaptureLib)

The source for the NodeJS side: [VRDesktopStreamer](https://github.com/Corey255A1/VRDesktopStreamer)

### Capture
There are at least 2 ways to capture the screen on Windows. I believe there are even nvidia or amd apis to grab from their respective hardware. I’m more familiar with the slower Windows GDI approach to grabbing the screens. While it is slower, it is easier to use. The other newer Windows way is to use the DXGI Desktop Duplication API.

In order to capture all screens, I had to determine what screens are attached, their sizes, and their positions. This is easily obtained using a combination of the EnumDisplayDevices and EnumDisplaySettings. There may be some gotcha’s with the DPI of the screens if they are set to something other than 100%. But in my case, everything is the standard DPI.

<!-- HTML generated using hilite.me -->
<div style="background: #111111; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">        <span style="color: #fb660a; font-weight: bold">while</span> <span style="color: #ffffff">(EnumDisplayDevices(NULL,</span> <span style="color: #ffffff">i,</span> <span style="color: #ffffff">&amp;dd,</span> <span style="color: #0086f7; font-weight: bold">0</span><span style="color: #ffffff">))</span>
        <span style="color: #ffffff">{</span>
            <span style="color: #fb660a; font-weight: bold">if</span> <span style="color: #ffffff">(EnumDisplaySettings(dd.DeviceName,</span> <span style="color: #ffffff">ENUM_CURRENT_SETTINGS,</span> <span style="color: #ffffff">&amp;dm))</span>
            <span style="color: #ffffff">{</span>
                <span style="color: #ffffff">std::unique_ptr&lt;DisplayInfo&gt;</span> <span style="color: #ffffff">di</span> <span style="color: #ffffff">=</span> <span style="color: #ffffff">std::make_unique&lt;DisplayInfo&gt;();</span>
                <span style="color: #ffffff">std::wcout</span> <span style="color: #ffffff">&lt;&lt;</span> <span style="color: #ffffff">dd.DeviceName</span> <span style="color: #ffffff">&lt;&lt;</span> <span style="color: #0086d2">&quot;\n&quot;</span><span style="color: #ffffff">;</span>
                <span style="color: #ffffff">di-&gt;x</span> <span style="color: #ffffff">=</span> <span style="color: #ffffff">dm.dmPosition.x;</span>
                <span style="color: #ffffff">di-&gt;y</span> <span style="color: #ffffff">=</span> <span style="color: #ffffff">dm.dmPosition.y;</span>
                <span style="color: #ffffff">di-&gt;width</span> <span style="color: #ffffff">=</span> <span style="color: #ffffff">dm.dmPelsWidth;</span>
                <span style="color: #ffffff">di-&gt;height</span> <span style="color: #ffffff">=</span> <span style="color: #ffffff">dm.dmPelsHeight;</span>
                <span style="color: #ffffff">displays.push_back(std::move(di));</span>
            <span style="color: #ffffff">}</span>
            <span style="color: #ffffff">i++;</span>
        <span style="color: #ffffff">}</span>
</pre></div>

The GDI image grab gets the whole desktop, and copies the selected bits into your desired buffer.

When initializing the BitmapInfo, setting the biHeight to a negative height will make the bitmap store right side up in memory. Bitmaps are typically stored bottom up. Another thing to keep in mind is the bit count for the screen captures. I believe these days most screens are the typical 24bit (8bits per color). The bits are however stored with an extra 8 bits to pad out each pixel to 32bits.

<!-- HTML generated using hilite.me -->
<div style="background: #111111; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">        <span style="color: #ffffff">_bitmap_info.biSize</span> <span style="color: #ffffff">=</span> <span style="color: #fb660a; font-weight: bold">sizeof</span><span style="color: #ffffff">(BITMAPINFOHEADER);</span>
        <span style="color: #ffffff">_bitmap_info.biWidth</span> <span style="color: #ffffff">=</span> <span style="color: #ffffff">_width;</span>
        <span style="color: #ffffff">_bitmap_info.biHeight</span> <span style="color: #ffffff">=</span> <span style="color: #ffffff">-_height;</span>
        <span style="color: #ffffff">_bitmap_info.biPlanes</span> <span style="color: #ffffff">=</span> <span style="color: #0086f7; font-weight: bold">1</span><span style="color: #ffffff">;</span>
        <span style="color: #ffffff">_bitmap_info.biBitCount</span> <span style="color: #ffffff">=</span> <span style="color: #0086f7; font-weight: bold">32</span><span style="color: #ffffff">;</span>
        <span style="color: #ffffff">_bitmap_info.biCompression</span> <span style="color: #ffffff">=</span> <span style="color: #ffffff">BI_RGB;</span>
        <span style="color: #ffffff">_bitmap_info.biSizeImage</span> <span style="color: #ffffff">=</span> <span style="color: #0086f7; font-weight: bold">0</span><span style="color: #ffffff">;</span>
        <span style="color: #ffffff">_bitmap_info.biXPelsPerMeter</span> <span style="color: #ffffff">=</span> <span style="color: #0086f7; font-weight: bold">0</span><span style="color: #ffffff">;</span>
        <span style="color: #ffffff">_bitmap_info.biYPelsPerMeter</span> <span style="color: #ffffff">=</span> <span style="color: #0086f7; font-weight: bold">0</span><span style="color: #ffffff">;</span>
        <span style="color: #ffffff">_bitmap_info.biClrUsed</span> <span style="color: #ffffff">=</span> <span style="color: #0086f7; font-weight: bold">0</span><span style="color: #ffffff">;</span>
        <span style="color: #ffffff">_bitmap_info.biClrImportant</span> <span style="color: #ffffff">=</span> <span style="color: #0086f7; font-weight: bold">0</span><span style="color: #ffffff">;</span>
</pre></div>


After calling the BitBlt to copy the screen bits out of memory, this image won’t include the cursor. This requires getting the cursor position, the cursor image and then drawing that image on to the captured screen buffer.

<!-- HTML generated using hilite.me -->
<div style="background: #272822; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">        <span style="color: #66d9ef">if</span> <span style="color: #f8f8f2">(cursor_info.flags</span> <span style="color: #f92672">==</span> <span style="color: #f8f8f2">CURSOR_SHOWING</span> <span style="color: #f92672">&amp;&amp;</span>
            <span style="color: #f8f8f2">PointOnScreen(cursor_info.ptScreenPos.x,</span> <span style="color: #f8f8f2">cursor_info.ptScreenPos.y))</span> <span style="color: #f8f8f2">{</span>
            <span style="color: #f8f8f2">ICONINFO</span> <span style="color: #f8f8f2">info</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">{</span> <span style="color: #66d9ef">sizeof</span><span style="color: #f8f8f2">(info)</span> <span style="color: #f8f8f2">};</span>
                <span style="color: #f8f8f2">GetIconInfo(cursor_info.hCursor,</span> <span style="color: #f92672">&amp;</span><span style="color: #f8f8f2">info);</span>
                <span style="color: #f8f8f2">BITMAP</span> <span style="color: #f8f8f2">bmpCursor</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">{</span> <span style="color: #ae81ff">0</span> <span style="color: #f8f8f2">};</span>
                <span style="color: #f8f8f2">GetObject(info.hbmColor,</span> <span style="color: #66d9ef">sizeof</span><span style="color: #f8f8f2">(bmpCursor),</span> <span style="color: #f92672">&amp;</span><span style="color: #f8f8f2">bmpCursor);</span>
                <span style="color: #f8f8f2">DrawIconEx(_memory_handle,</span> <span style="color: #f8f8f2">cursor_info.ptScreenPos.x</span> <span style="color: #f92672">-</span> <span style="color: #f8f8f2">_left,</span> <span style="color: #f8f8f2">cursor_info.ptScreenPos.y</span> <span style="color: #f92672">-</span> <span style="color: #f8f8f2">_top,</span> <span style="color: #f8f8f2">cursor_info.hCursor,</span> <span style="color: #f8f8f2">bmpCursor.bmWidth,</span> <span style="color: #f8f8f2">bmpCursor.bmHeight,</span>
                    <span style="color: #ae81ff">0</span><span style="color: #f8f8f2">,</span> <span style="color: #f8f8f2">NULL,</span> <span style="color: #f8f8f2">DI_NORMAL);</span>
        <span style="color: #f8f8f2">}</span>
</pre></div>


Rather than send over the full bitmap of the screen, I opted to use TurboJpeg to compress the image. This saves bandwidth especially after converting the image into a base64 string. This was a just a matter of cloning the TurboJpeg repository and using CMake to generate a Visual Studio project.


The TurboJpeg library likes to manage its own output buffer. So be sure to use the tjallocate to allocate the buffer. I initialize it to a 3rd of the size of the bitmap size. So far this has been good enough.

<!-- HTML generated using hilite.me --><div style="background: #272822; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #f8f8f2">tjhandle</span> <span style="color: #f8f8f2">_jpegCompressor</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">tjInitCompress();</span>
<span style="color: #f8f8f2">compressed_image_size</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">_jpeg_buffer_size;</span>
<span style="color: #f8f8f2">tjCompress2(_jpegCompressor,</span> <span style="color: #f8f8f2">raw_image_buffer,</span> <span style="color: #f8f8f2">width,</span> <span style="color: #ae81ff">0</span><span style="color: #f8f8f2">,</span> <span style="color: #f8f8f2">height,</span> <span style="color: #f8f8f2">TJPF_BGRX,</span> 
<span style="color: #f92672">&amp;</span><span style="color: #f8f8f2">_jpeg_buffer,</span> <span style="color: #f92672">&amp;</span><span style="color: #f8f8f2">compressed_image_size,</span> <span style="color: #f8f8f2">TJSAMP_444,</span> <span style="color: #f8f8f2">JPEG_QUALITY,</span> <span style="color: #f8f8f2">TJFLAG_FASTDCT);</span>

<span style="color: #66d9ef">if</span> <span style="color: #f8f8f2">(compressed_image_size</span> <span style="color: #f92672">&gt;</span> <span style="color: #f8f8f2">_jpeg_buffer_size)</span> <span style="color: #f8f8f2">{</span>
   <span style="color: #f8f8f2">_jpeg_buffer_size</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">compressed_image_size;</span>
<span style="color: #f8f8f2">}</span>

<span style="color: #f8f8f2">tjDestroy(_jpegCompressor);</span>
<span style="color: #f8f8f2">memcpy(compressed_image_buffer,</span> <span style="color: #f8f8f2">_jpeg_buffer,</span> <span style="color: #f8f8f2">compressed_image_size);</span>
</pre></div>


Raw image bytes from a websocket unfortunately can’t be turned directly into a DOM image element. You can however set the source of an image element to a Base64 string which will then be loaded as an image. Rather than put the pressure on the client side to turn the bytes into base64, I am converting it on my desktop before sending it. This uses more bandwidth, but cuts down on processing on the other end.

<!-- HTML generated using hilite.me -->
<div style="background: #272822; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #66d9ef">const</span> <span style="color: #f8f8f2">BYTE</span><span style="color: #f92672">*</span> <span style="color: #f8f8f2">Base64Converter</span><span style="color: #f92672">::</span><span style="color: #f8f8f2">Convert(</span><span style="color: #66d9ef">const</span> <span style="color: #f8f8f2">BYTE</span><span style="color: #f92672">*</span> <span style="color: #f8f8f2">raw_data,</span> <span style="color: #66d9ef">size_t</span> <span style="color: #f8f8f2">data_size)</span> <span style="color: #f8f8f2">{</span>
    <span style="color: #f8f8f2">_string_length</span> <span style="color: #f92672">=</span> <span style="color: #ae81ff">0</span><span style="color: #f8f8f2">;</span>
    <span style="color: #66d9ef">size_t</span> <span style="color: #f8f8f2">rIndex</span> <span style="color: #f92672">=</span> <span style="color: #ae81ff">3</span><span style="color: #f8f8f2">;</span>
    <span style="color: #66d9ef">for</span> <span style="color: #f8f8f2">(;</span> <span style="color: #f8f8f2">rIndex</span> <span style="color: #f92672">&lt;=</span> <span style="color: #f8f8f2">data_size;</span> <span style="color: #f8f8f2">rIndex</span> <span style="color: #f92672">+=</span> <span style="color: #ae81ff">3</span><span style="color: #f8f8f2">)</span> <span style="color: #f8f8f2">{</span>
        <span style="color: #f8f8f2">_buffer[_string_length</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">Base64Table[(raw_data[rIndex</span> <span style="color: #f92672">-</span> <span style="color: #ae81ff">3</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">&gt;&gt;</span> <span style="color: #ae81ff">2</span><span style="color: #f8f8f2">)</span> <span style="color: #f92672">&amp;</span> <span style="color: #ae81ff">0x3f</span><span style="color: #f8f8f2">];</span>
        <span style="color: #f8f8f2">_buffer[_string_length</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">Base64Table[(raw_data[rIndex</span> <span style="color: #f92672">-</span> <span style="color: #ae81ff">3</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">&lt;&lt;</span> <span style="color: #ae81ff">4</span> <span style="color: #f92672">|</span> <span style="color: #f8f8f2">((raw_data[rIndex</span> <span style="color: #f92672">-</span> <span style="color: #ae81ff">2</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">&gt;&gt;</span> <span style="color: #ae81ff">4</span><span style="color: #f8f8f2">)</span> <span style="color: #f92672">&amp;</span> <span style="color: #ae81ff">0x0f</span><span style="color: #f8f8f2">))</span> <span style="color: #f92672">&amp;</span> <span style="color: #ae81ff">0x3f</span><span style="color: #f8f8f2">];</span>
        <span style="color: #f8f8f2">_buffer[_string_length</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">Base64Table[(raw_data[rIndex</span> <span style="color: #f92672">-</span> <span style="color: #ae81ff">2</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">&lt;&lt;</span> <span style="color: #ae81ff">2</span> <span style="color: #f92672">|</span> <span style="color: #f8f8f2">((raw_data[rIndex</span> <span style="color: #f92672">-</span> <span style="color: #ae81ff">1</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">&gt;&gt;</span> <span style="color: #ae81ff">6</span><span style="color: #f8f8f2">)</span> <span style="color: #f92672">&amp;</span> <span style="color: #ae81ff">0x03</span><span style="color: #f8f8f2">))</span> <span style="color: #f92672">&amp;</span> <span style="color: #ae81ff">0x3f</span><span style="color: #f8f8f2">];</span>
        <span style="color: #f8f8f2">_buffer[_string_length</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">Base64Table[raw_data[rIndex</span> <span style="color: #f92672">-</span> <span style="color: #ae81ff">1</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">&amp;</span> <span style="color: #ae81ff">0x3f</span><span style="color: #f8f8f2">];</span> 
        <span style="color: #66d9ef">if</span> <span style="color: #f8f8f2">(_string_length</span> <span style="color: #f92672">&gt;</span> <span style="color: #f8f8f2">_buffer_size)</span> <span style="color: #f8f8f2">{</span> <span style="color: #66d9ef">return</span> <span style="color: #f8f8f2">nullptr;</span> <span style="color: #f8f8f2">}</span>
    <span style="color: #f8f8f2">}</span>
    <span style="color: #75715e">//Ensure to mask the bits correctly.. also don&#39;t forget about sign extensions</span>
    <span style="color: #66d9ef">size_t</span> <span style="color: #f8f8f2">remainder</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">rIndex</span> <span style="color: #f92672">-</span> <span style="color: #f8f8f2">data_size;</span>
    <span style="color: #66d9ef">if</span> <span style="color: #f8f8f2">(remainder</span> <span style="color: #f92672">==</span> <span style="color: #ae81ff">2</span><span style="color: #f8f8f2">)</span> <span style="color: #f8f8f2">{</span>
        <span style="color: #f8f8f2">_buffer[_string_length</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">Base64Table[(raw_data[rIndex</span> <span style="color: #f92672">-</span> <span style="color: #ae81ff">3</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">&gt;&gt;</span> <span style="color: #ae81ff">2</span><span style="color: #f8f8f2">)</span> <span style="color: #f92672">&amp;</span> <span style="color: #ae81ff">0x3f</span><span style="color: #f8f8f2">];</span>
        <span style="color: #f8f8f2">_buffer[_string_length</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">Base64Table[(raw_data[rIndex</span> <span style="color: #f92672">-</span> <span style="color: #ae81ff">3</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">&lt;&lt;</span> <span style="color: #ae81ff">4</span><span style="color: #f8f8f2">)</span> <span style="color: #f92672">&amp;</span> <span style="color: #ae81ff">0x3f</span><span style="color: #f8f8f2">];</span>
        <span style="color: #f8f8f2">_buffer[_string_length</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">=</span> <span style="color: #e6db74">&#39;=&#39;</span><span style="color: #f8f8f2">;</span>
        <span style="color: #f8f8f2">_buffer[_string_length</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">=</span> <span style="color: #e6db74">&#39;=&#39;</span><span style="color: #f8f8f2">;</span>
    <span style="color: #f8f8f2">}</span>
    <span style="color: #66d9ef">else</span> <span style="color: #66d9ef">if</span> <span style="color: #f8f8f2">(remainder</span> <span style="color: #f92672">==</span> <span style="color: #ae81ff">1</span><span style="color: #f8f8f2">)</span> <span style="color: #f8f8f2">{</span>
        <span style="color: #f8f8f2">_buffer[_string_length</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">Base64Table[(raw_data[rIndex</span> <span style="color: #f92672">-</span> <span style="color: #ae81ff">3</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">&gt;&gt;</span> <span style="color: #ae81ff">2</span><span style="color: #f8f8f2">)</span> <span style="color: #f92672">&amp;</span> <span style="color: #ae81ff">0x3f</span><span style="color: #f8f8f2">];</span>
        <span style="color: #f8f8f2">_buffer[_string_length</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">Base64Table[(raw_data[rIndex</span> <span style="color: #f92672">-</span> <span style="color: #ae81ff">3</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">&lt;&lt;</span> <span style="color: #ae81ff">4</span> <span style="color: #f92672">|</span> <span style="color: #f8f8f2">((raw_data[rIndex</span> <span style="color: #f92672">-</span> <span style="color: #ae81ff">2</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">&gt;&gt;</span> <span style="color: #ae81ff">4</span><span style="color: #f8f8f2">)</span> <span style="color: #f92672">&amp;</span> <span style="color: #ae81ff">0x0f</span><span style="color: #f8f8f2">))</span> <span style="color: #f92672">&amp;</span> <span style="color: #ae81ff">0x3f</span><span style="color: #f8f8f2">];</span>
        <span style="color: #f8f8f2">_buffer[_string_length</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">Base64Table[(raw_data[rIndex</span> <span style="color: #f92672">-</span> <span style="color: #ae81ff">2</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">&lt;&lt;</span> <span style="color: #ae81ff">2</span><span style="color: #f8f8f2">)</span> <span style="color: #f92672">&amp;</span> <span style="color: #ae81ff">0x3f</span><span style="color: #f8f8f2">];</span>
        <span style="color: #f8f8f2">_buffer[_string_length</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">]</span> <span style="color: #f92672">=</span> <span style="color: #e6db74">&#39;=&#39;</span><span style="color: #f8f8f2">;</span>
    <span style="color: #f8f8f2">}</span>
    <span style="color: #f8f8f2">_buffer[_string_length]</span> <span style="color: #f92672">=</span> <span style="color: #e6db74">&#39;\0&#39;</span><span style="color: #f8f8f2">;</span>
    <span style="color: #66d9ef">return</span> <span style="color: #f8f8f2">_buffer.get();</span>
<span style="color: #f8f8f2">}</span>
</pre></div>


### NodeJS Addon
I built the screen capture code as a library that I could then wrapper around with javascript in NodeJS. Compiling a node addon requires the node-addon-api and the node-gyp packages. Within the wrapper class I consolidate the initialization code and the capture/compress/convert portions. This makes the API from the NodeJS side just 3 simple method calls.
Then within NodeJS, I set an interval to the rate that I want to capture the screens.

### Initial Optimizations
Once I finally got the end to end capture to stream to decode to render working, there were some latency issues that I noticed right away. Under certain conditions the latency was around 20 seconds! The first optimization I wanted to make to this was to not send the entire screen every frame if nothing has changed.

I messed around with different ideas of trying to identify the changed regions. I finally settled on just splitting up the image into regions. Not complex and not necessarily the most efficient, but much easier to understand and implement to see if there are any improvements.

The idea is that I would just split the image into 10x10 regions, and if anything within that region has changed, send over that block.

One thing that I ran into when sampling the regions from the image is that the image is laid out in memory in a grid of 4 byte pixels. The byte grid of a 1920x1080 image is actually 7680 bytes by 1080 bytes. This made it a little tricky to extract out the subimages.

<!-- HTML generated using hilite.me -->
<div style="background: #272822; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #f8f8f2">region_difference</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">false;</span>
<span style="color: #75715e">//copy all bytes</span>
<span style="color: #66d9ef">for</span> <span style="color: #f8f8f2">(</span><span style="color: #66d9ef">int</span> <span style="color: #f8f8f2">y</span> <span style="color: #f92672">=</span> <span style="color: #ae81ff">0</span><span style="color: #f8f8f2">;</span> <span style="color: #f8f8f2">y</span> <span style="color: #f92672">&lt;</span> <span style="color: #f8f8f2">_region_height;</span> <span style="color: #f8f8f2">y</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">)</span> <span style="color: #f8f8f2">{</span>
    <span style="color: #66d9ef">for</span> <span style="color: #f8f8f2">(</span><span style="color: #66d9ef">int</span> <span style="color: #f8f8f2">x</span> <span style="color: #f92672">=</span> <span style="color: #ae81ff">0</span><span style="color: #f8f8f2">;</span> <span style="color: #f8f8f2">x</span> <span style="color: #f92672">&lt;</span> <span style="color: #f8f8f2">_region_byte_width;</span> <span style="color: #f8f8f2">x</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">)</span> <span style="color: #f8f8f2">{</span>
        <span style="color: #66d9ef">int</span> <span style="color: #f8f8f2">yidx</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">(y</span> <span style="color: #f92672">+</span> <span style="color: #f8f8f2">y_offset);</span>
        <span style="color: #66d9ef">int</span> <span style="color: #f8f8f2">xidx</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">(x</span> <span style="color: #f92672">+</span> <span style="color: #f8f8f2">x_offset);</span>
        <span style="color: #66d9ef">int</span> <span style="color: #f8f8f2">idx</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">xidx</span> <span style="color: #f92672">+</span> <span style="color: #f8f8f2">yidx</span> <span style="color: #f92672">*</span> <span style="color: #f8f8f2">_byte_width;</span>
        <span style="color: #f8f8f2">BYTE</span> <span style="color: #f8f8f2">b</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">buffer1[idx];</span>
        <span style="color: #f8f8f2">region_difference</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">region_difference</span> <span style="color: #f92672">||</span> <span style="color: #f8f8f2">b</span> <span style="color: #f92672">!=</span> <span style="color: #f8f8f2">buffer2[idx];</span>
        <span style="color: #f8f8f2">_working_buffer[x</span> <span style="color: #f92672">+</span> <span style="color: #f8f8f2">y</span> <span style="color: #f92672">*</span> <span style="color: #f8f8f2">_region_byte_width]</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">b;</span>
    <span style="color: #f8f8f2">}</span>
<span style="color: #f8f8f2">}</span>
<span style="color: #66d9ef">if</span> <span style="color: #f8f8f2">(region_difference)</span> <span style="color: #f8f8f2">{</span>
    <span style="color: #f8f8f2">_compressor.Compress(_region_width,</span> <span style="color: #f8f8f2">_region_height,</span> <span style="color: #f8f8f2">_working_buffer,</span> <span style="color: #f8f8f2">_regions[differences]</span><span style="color: #f92672">-&gt;</span><span style="color: #f8f8f2">Buffer,</span> <span style="color: #f8f8f2">image_size);</span>
    <span style="color: #f8f8f2">_regions[differences]</span><span style="color: #f92672">-&gt;</span><span style="color: #f8f8f2">ImageSize</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">image_size;</span>
    <span style="color: #f8f8f2">_regions[differences]</span><span style="color: #f92672">-&gt;</span><span style="color: #f8f8f2">X</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">rx</span><span style="color: #f92672">*</span><span style="color: #f8f8f2">_region_width;</span>
    <span style="color: #f8f8f2">_regions[differences]</span><span style="color: #f92672">-&gt;</span><span style="color: #f8f8f2">Y</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">y_offset;</span>
    <span style="color: #f8f8f2">_regions[differences]</span><span style="color: #f92672">-&gt;</span><span style="color: #f8f8f2">Width</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">_region_width;</span>
    <span style="color: #f8f8f2">_regions[differences]</span><span style="color: #f92672">-&gt;</span><span style="color: #f8f8f2">Height</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">_region_height;</span>
    <span style="color: #f8f8f2">differences</span><span style="color: #f92672">++</span><span style="color: #f8f8f2">;</span>
<span style="color: #f8f8f2">}</span>
</pre></div>


The code checks each block and if there is a difference, it copies those bytes into some working memory to then be compressed by turbo jpeg. That compressed jpeg image, is pushed to a vector of changed regions.
The NodeJS Addon side of the code then would generate the base64 string of each region, and push each region object with the x,y,width,height to an array to be sent over the websocket to the client.
