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
```c++
while (EnumDisplayDevices(NULL, i, &dd, 0))
{
    if (EnumDisplaySettings(dd.DeviceName, ENUM_CURRENT_SETTINGS, &dm))
    {
        std::unique_ptr<DisplayInfo> di = std::make_unique<DisplayInfo>();
        std::wcout << dd.DeviceName << "\n";
        di->x = dm.dmPosition.x;
        di->y = dm.dmPosition.y;
        di->width = dm.dmPelsWidth;
        di->height = dm.dmPelsHeight;
        displays.push_back(std::move(di));
    }
    i++;
}
```
The GDI image grab gets the whole desktop, and copies the selected bits into your desired buffer.

When initializing the BitmapInfo, setting the biHeight to a negative height will make the bitmap store right side up in memory. Bitmaps are typically stored bottom up. Another thing to keep in mind is the bit count for the screen captures. I believe these days most screens are the typical 24bit (8bits per color). The bits are however stored with an extra 8 bits to pad out each pixel to 32bits.
```c++
_bitmap_info.biSize = sizeof(BITMAPINFOHEADER);
_bitmap_info.biWidth = _width;
_bitmap_info.biHeight = -_height;
_bitmap_info.biPlanes = 1;
_bitmap_info.biBitCount = 32;
_bitmap_info.biCompression = BI_RGB;
_bitmap_info.biSizeImage = 0;
_bitmap_info.biXPelsPerMeter = 0;
_bitmap_info.biYPelsPerMeter = 0;
_bitmap_info.biClrUsed = 0;
_bitmap_info.biClrImportant = 0;
```
After calling the BitBlt to copy the screen bits out of memory, this image won’t include the cursor. This requires getting the cursor position, the cursor image and then drawing that image on to the captured screen buffer.
```c++
if (cursor_info.flags == CURSOR_SHOWING &&
    PointOnScreen(cursor_info.ptScreenPos.x, cursor_info.ptScreenPos.y)) {
    ICONINFO info = { sizeof(info) };
        GetIconInfo(cursor_info.hCursor, &info);
        BITMAP bmpCursor = { 0 };
        GetObject(info.hbmColor, sizeof(bmpCursor), &bmpCursor);
        DrawIconEx(_memory_handle, cursor_info.ptScreenPos.x - _left, cursor_info.ptScreenPos.y - _top, cursor_info.hCursor, bmpCursor.bmWidth, bmpCursor.bmHeight,
            0, NULL, DI_NORMAL);
}
```

Rather than send over the full bitmap of the screen, I opted to use TurboJpeg to compress the image. This saves bandwidth especially after converting the image into a base64 string. This was a just a matter of cloning the TurboJpeg repository and using CMake to generate a Visual Studio project.


The TurboJpeg library likes to manage its own output buffer. So be sure to use the tjallocate to allocate the buffer. I initialize it to a 3rd of the size of the bitmap size. So far this has been good enough.
```c++
tjhandle _jpegCompressor = tjInitCompress();

compressed_image_size = _jpeg_buffer_size;
tjCompress2(_jpegCompressor, raw_image_buffer, width, 0, height, TJPF_BGRX,
&_jpeg_buffer, &compressed_image_size, TJSAMP_444, JPEG_QUALITY, TJFLAG_FASTDCT);

if (compressed_image_size > _jpeg_buffer_size) {
_jpeg_buffer_size = compressed_image_size;
}

tjDestroy(_jpegCompressor);
memcpy(compressed_image_buffer, _jpeg_buffer, compressed_image_size);
```
Raw image bytes from a websocket unfortunately can’t be turned directly into a DOM image element. You can however set the source of an image element to a Base64 string which will then be loaded as an image. Rather than put the pressure on the client side to turn the bytes into base64, I am converting it on my desktop before sending it. This uses more bandwidth, but cuts down on processing on the other end.
```c++
const BYTE* Base64Converter::Convert(const BYTE* raw_data, size_t data_size) {
    _string_length = 0;
    size_t rIndex = 3;
    for (; rIndex <= data_size; rIndex += 3) {
        _buffer[_string_length++] = Base64Table[(raw_data[rIndex - 3] >> 2) & 0x3f];
        _buffer[_string_length++] = Base64Table[(raw_data[rIndex - 3] << 4 | ((raw_data[rIndex - 2] >> 4) & 0x0f)) & 0x3f];
        _buffer[_string_length++] = Base64Table[(raw_data[rIndex - 2] << 2 | ((raw_data[rIndex - 1] >> 6) & 0x03)) & 0x3f];
        _buffer[_string_length++] = Base64Table[raw_data[rIndex - 1] & 0x3f]; 
        if (_string_length > _buffer_size) { return nullptr; }
    }
    //Ensure to mask the bits correctly.. also don't forget about sign extensions
    size_t remainder = rIndex - data_size;
    if (remainder == 2) {
        _buffer[_string_length++] = Base64Table[(raw_data[rIndex - 3] >> 2) & 0x3f];
        _buffer[_string_length++] = Base64Table[(raw_data[rIndex - 3] << 4) & 0x3f];
        _buffer[_string_length++] = '=';
        _buffer[_string_length++] = '=';
    }
    else if (remainder == 1) {
        _buffer[_string_length++] = Base64Table[(raw_data[rIndex - 3] >> 2) & 0x3f];
        _buffer[_string_length++] = Base64Table[(raw_data[rIndex - 3] << 4 | ((raw_data[rIndex - 2] >> 4) & 0x0f)) & 0x3f];
        _buffer[_string_length++] = Base64Table[(raw_data[rIndex - 2] << 2) & 0x3f];
        _buffer[_string_length++] = '=';
    }
    _buffer[_string_length] = '\0';
    return _buffer.get();
}
```

### NodeJS Addon
I built the screen capture code as a library that I could then wrapper around with javascript in NodeJS. Compiling a node addon requires the node-addon-api and the node-gyp packages. Within the wrapper class I consolidate the initialization code and the capture/compress/convert portions. This makes the API from the NodeJS side just 3 simple method calls.
Then within NodeJS, I set an interval to the rate that I want to capture the screens.

### Initial Optimizations
Once I finally got the end to end capture to stream to decode to render working, there were some latency issues that I noticed right away. Under certain conditions the latency was around 20 seconds! The first optimization I wanted to make to this was to not send the entire screen every frame if nothing has changed.

I messed around with different ideas of trying to identify the changed regions. I finally settled on just splitting up the image into regions. Not complex and not necessarily the most efficient, but much easier to understand and implement to see if there are any improvements.

The idea is that I would just split the image into 10x10 regions, and if anything within that region has changed, send over that block.

One thing that I ran into when sampling the regions from the image is that the image is laid out in memory in a grid of 4 byte pixels. The byte grid of a 1920x1080 image is actually 7680 bytes by 1080 bytes. This made it a little tricky to extract out the subimages.
```c++
region_difference = false;
//copy all bytes
for (int y = 0; y < _region_height; y++) {
    for (int x = 0; x < _region_byte_width; x++) {
        int yidx = (y + y_offset);
        int xidx = (x + x_offset);
        int idx = xidx + yidx * _byte_width;
        BYTE b = buffer1[idx];
        region_difference = region_difference || b != buffer2[idx];
        _working_buffer[x + y * _region_byte_width] = b;
    }
}
if (region_difference) {
    _compressor.Compress(_region_width, _region_height, _working_buffer, _regions[differences]->Buffer, image_size);
    _regions[differences]->ImageSize = image_size;
    _regions[differences]->X = rx*_region_width;
    _regions[differences]->Y = y_offset;
    _regions[differences]->Width = _region_width;
    _regions[differences]->Height = _region_height;
    differences++;
}
```
The code checks each block and if there is a difference, it copies those bytes into some working memory to then be compressed by turbo jpeg. That compressed jpeg image, is pushed to a vector of changed regions.
The NodeJS Addon side of the code then would generate the base64 string of each region, and push each region object with the x,y,width,height to an array to be sent over the websocket to the client.
