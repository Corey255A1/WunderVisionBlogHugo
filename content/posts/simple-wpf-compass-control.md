---
title: "Simple WPF Compass Control"
date: "2019-08-24"
summary: "Create a simple WPF Compass Control"
thumbnail: "/images/blog/2019-08-24-Simple_WPF_Compass_Control.jpg"
slug: "simple-wpf-compass-control"
tags: ["C#","WPF"]
---

<p class="blog-img center md">
    <img src="/images/blog/Compass.gif" alt="">
    <div class="center">Compass!</div>
</p>

The source for this project is here: [https://github.com/Corey255A1/MiscWPFControls/tree/master/MiscWPFControls/Controls/Compass](https://github.com/Corey255A1/MiscWPFControls/tree/master/MiscWPFControls/Controls/Compass)

This is going to be a quick rundown of how to make a WPF Compass Control.

### Create the Graphics

I highly recommend downloading Microsoft Expression Design 4. Its a little bit old, but it is free and perfect for whipping up quick SVGs for use in WPF.

**Update 1/10/2021 -** It might not be possible to find Expression Design 4 as an official download anymore! :( I've never used Blend for Visual Studio but I guess its about time to figure it out.

<p class="blog-img center lg">
    <img src="/images/blog/Compass_Expression.jpg" alt="">
    <div class="center">Two Layers of the Compass</div>
</p>

When you export from Expression, you can export it as a WPF Resource. Which you can then load and make the Fill of things like Rectangle or Ellipse.

<p class="blog-img center lg">
    <img src="/images/blog/Compass_Expression_Export.jpg" alt="">
    <div class="center">Export As WPF Resource Dictionary</div>
</p>

Below is the export of the N,S,W,E in XAML form.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #557799">&lt;?xml version="1.0" encoding="utf-8"?&gt;</span>
<span style="color: #007700">&lt;ResourceDictionary</span> <span style="color: #0000CC">xmlns=</span><span style="background-color: #fff0f0">"http://schemas.microsoft.com/winfx/2006/xaml/presentation"</span> <span style="color: #0000CC">xmlns:x=</span><span style="background-color: #fff0f0">"http://schemas.microsoft.com/winfx/2006/xaml"</span><span style="color: #007700">&gt;</span>
	<span style="color: #007700">&lt;DrawingBrush</span> <span style="color: #0000CC">x:Key=</span><span style="background-color: #fff0f0">"Layer_1"</span> <span style="color: #0000CC">Stretch=</span><span style="background-color: #fff0f0">"Uniform"</span><span style="color: #007700">&gt;</span>
		<span style="color: #007700">&lt;DrawingBrush.Drawing&gt;</span>
			<span style="color: #007700">&lt;DrawingGroup&gt;</span>
				<span style="color: #007700">&lt;DrawingGroup.Children&gt;</span>
					<span style="color: #007700">&lt;GeometryDrawing</span> <span style="color: #0000CC">Brush=</span><span style="background-color: #fff0f0">"#FF000000"</span> <span style="color: #0000CC">Geometry=</span><span style="background-color: #fff0f0">"F1 M 72.3333,18.6667L 69.7042,18.6667L 59.8583,3.78754C 59.6111,3.41531 59.407,3.02499 59.2458,2.61667L 59.1667,2.61667C 59.2333,3.01669 59.2667,3.87088 59.2667,5.17917L 59.2667,18.6667L 57.1333,18.6667L 57.1333,3.05176e-005L 59.9167,3.05176e-005L 69.4958,14.6458C 69.8986,15.2542 70.157,15.6708 70.2708,15.8958L 70.325,15.8958C 70.2417,15.357 70.2,14.4417 70.2,13.15L 70.2,3.05176e-005L 72.3333,3.05176e-005L 72.3333,18.6667 Z "</span><span style="color: #007700">/&gt;</span>
					<span style="color: #007700">&lt;GeometryDrawing</span> <span style="color: #0000CC">Brush=</span><span style="background-color: #fff0f0">"#FF000000"</span> <span style="color: #0000CC">Geometry=</span><span style="background-color: #fff0f0">"F1 M 59.3333,129.779L 59.3333,127.2C 59.6306,127.489 59.9861,127.749 60.4,127.981C 60.8139,128.213 61.25,128.408 61.7083,128.567C 62.1667,128.725 62.6271,128.848 63.0896,128.935C 63.5521,129.023 63.9792,129.067 64.3708,129.067C 65.7236,129.067 66.7333,128.81 67.4,128.298C 68.0667,127.785 68.4,127.049 68.4,126.087C 68.4,125.587 68.2882,125.151 68.0646,124.779C 67.841,124.407 67.5326,124.068 67.1396,123.763C 66.7466,123.457 66.2813,123.163 65.7437,122.881C 65.2063,122.599 64.6264,122.304 64.0042,121.996C 63.3486,121.665 62.7368,121.332 62.1688,120.996C 61.6007,120.66 61.1063,120.289 60.6854,119.883C 60.2646,119.478 59.9341,119.018 59.6938,118.504C 59.4535,117.99 59.3333,117.388 59.3333,116.696C 59.3333,115.849 59.5229,115.112 59.9021,114.485C 60.2813,113.859 60.7792,113.343 61.3958,112.938C 62.0125,112.532 62.7153,112.23 63.5042,112.031C 64.2931,111.833 65.0972,111.733 65.9167,111.733C 67.7834,111.733 69.1444,111.979 70,112.471L 70,114.933C 68.8917,114.044 67.468,113.6 65.7292,113.6C 65.2486,113.6 64.7681,113.651 64.2875,113.754C 63.8069,113.857 63.3792,114.025 63.0042,114.258C 62.6292,114.492 62.3236,114.792 62.0875,115.158C 61.8514,115.525 61.7333,115.972 61.7333,116.5C 61.7333,116.975 61.8229,117.385 62.0021,117.731C 62.1812,118.077 62.4458,118.392 62.7958,118.677C 63.1458,118.962 63.5722,119.238 64.075,119.506C 64.5778,119.774 65.157,120.068 65.8125,120.388C 66.4875,120.715 67.1264,121.06 67.7292,121.423C 68.3319,121.785 68.8611,122.188 69.3167,122.629C 69.7722,123.071 70.1333,123.559 70.4,124.094C 70.6667,124.628 70.8,125.242 70.8,125.933C 70.8,126.85 70.6174,127.626 70.2521,128.26C 69.8868,128.895 69.3944,129.411 68.775,129.808C 68.1555,130.206 67.441,130.492 66.6313,130.669C 65.8215,130.845 64.968,130.933 64.0708,130.933C 63.7708,130.933 63.4014,130.908 62.9625,130.856C 62.5236,130.805 62.075,130.73 61.6167,130.631C 61.1584,130.533 60.725,130.41 60.3167,130.265C 59.9084,130.119 59.5806,129.957 59.3333,129.779 Z "</span><span style="color: #007700">/&gt;</span>
					<span style="color: #007700">&lt;GeometryDrawing</span> <span style="color: #0000CC">Brush=</span><span style="background-color: #fff0f0">"#FF000000"</span> <span style="color: #0000CC">Geometry=</span><span style="background-color: #fff0f0">"F1 M 24.2667,56L 18.9833,74.6667L 16.4208,74.6667L 12.575,61.025C 12.4111,60.4445 12.3125,59.8111 12.2792,59.125L 12.225,59.125C 12.1722,59.7667 12.0597,60.3917 11.8875,61L 8.01251,74.6667L 5.47502,74.6667L 0,56L 2.41252,56L 6.38751,70.3167C 6.55139,70.9167 6.65556,71.5417 6.70001,72.1917L 6.76668,72.1917C 6.80835,71.7306 6.94305,71.1056 7.17084,70.3167L 11.3,56L 13.3958,56L 17.3583,70.4208C 17.4972,70.9153 17.6014,71.4973 17.6708,72.1667L 17.725,72.1667C 17.7583,71.7167 17.875,71.1181 18.075,70.3709L 21.8958,56L 24.2667,56 Z "</span><span style="color: #007700">/&gt;</span>
					<span style="color: #007700">&lt;GeometryDrawing</span> <span style="color: #0000CC">Brush=</span><span style="background-color: #fff0f0">"#FF000000"</span> <span style="color: #0000CC">Geometry=</span><span style="background-color: #fff0f0">"F1 M 129.267,74.6667L 119.133,74.6667L 119.133,56L 128.733,56L 128.733,57.8667L 121.267,57.8667L 121.267,64.2667L 128.2,64.2667L 128.2,66.1334L 121.267,66.1334L 121.267,72.8L 129.267,72.8L 129.267,74.6667 Z "</span><span style="color: #007700">/&gt;</span>
				<span style="color: #007700">&lt;/DrawingGroup.Children&gt;</span>
			<span style="color: #007700">&lt;/DrawingGroup&gt;</span>
		<span style="color: #007700">&lt;/DrawingBrush.Drawing&gt;</span>
	<span style="color: #007700">&lt;/DrawingBrush&gt;</span>
<span style="color: #007700">&lt;/ResourceDictionary&gt;</span>
</pre></div>

Export the two pieces of the compass from the XAML, and what I did was combine the two files in to one. Make sure to change the x:Key value to something unique. Mine were NSWE and Star. Copy the <DrawingBrush> to </DrawingBrush> and make sure they are both in between one ResourceDictionary.

### Resource Dictionary
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #007700">&lt;ResourceDictionary</span> <span style="color: #0000CC">xmlns=</span><span style="background-color: #fff0f0">"http://schemas.microsoft.com/winfx/2006/xaml/presentation"</span>
                    <span style="color: #0000CC">xmlns:x=</span><span style="background-color: #fff0f0">"http://schemas.microsoft.com/winfx/2006/xaml"</span>
                    <span style="color: #0000CC">xmlns:local=</span><span style="background-color: #fff0f0">"clr-namespace:MiscWPFControls.Controls.Compass"</span><span style="color: #007700">&gt;</span>
    <span style="color: #007700">&lt;DrawingBrush</span> <span style="color: #0000CC">x:Key=</span><span style="background-color: #fff0f0">"NSWE"</span> <span style="color: #0000CC">Stretch=</span><span style="background-color: #fff0f0">"Uniform"</span><span style="color: #007700">&gt;</span>
        <span style="color: #007700">&lt;DrawingBrush.Drawing&gt;</span>
            <span style="color: #007700">&lt;DrawingGroup&gt;</span>
                <span style="color: #007700">&lt;DrawingGroup.Children&gt;</span>
                    <span style="color: #007700">&lt;GeometryDrawing</span> <span style="color: #0000CC">Brush=</span><span style="background-color: #fff0f0">"#FF000000"</span> <span style="color: #0000CC">Geometry=</span><span style="background-color: #fff0f0">"F1 M 72.3333,18.6667L 69.7042,18.6667L 59.8583,3.78754C 59.6111,3.41531 59.407,3.02499 59.2458,2.61667L 59.1667,2.61667C 59.2333,3.01669 59.2667,3.87088 59.2667,5.17917L 59.2667,18.6667L 57.1333,18.6667L 57.1333,3.05176e-005L 59.9167,3.05176e-005L 69.4958,14.6458C 69.8986,15.2542 70.157,15.6708 70.2708,15.8958L 70.325,15.8958C 70.2417,15.357 70.2,14.4417 70.2,13.15L 70.2,3.05176e-005L 72.3333,3.05176e-005L 72.3333,18.6667 Z "</span><span style="color: #007700">/&gt;</span>
                    <span style="color: #007700">&lt;GeometryDrawing</span> <span style="color: #0000CC">Brush=</span><span style="background-color: #fff0f0">"#FF000000"</span> <span style="color: #0000CC">Geometry=</span><span style="background-color: #fff0f0">"F1 M 59.3333,129.779L 59.3333,127.2C 59.6306,127.489 59.9861,127.749 60.4,127.981C 60.8139,128.213 61.25,128.408 61.7083,128.567C 62.1667,128.725 62.6271,128.848 63.0896,128.935C 63.5521,129.023 63.9792,129.067 64.3708,129.067C 65.7236,129.067 66.7333,128.81 67.4,128.298C 68.0667,127.785 68.4,127.049 68.4,126.087C 68.4,125.587 68.2882,125.151 68.0646,124.779C 67.841,124.407 67.5326,124.068 67.1396,123.763C 66.7466,123.457 66.2813,123.163 65.7437,122.881C 65.2063,122.599 64.6264,122.304 64.0042,121.996C 63.3486,121.665 62.7368,121.332 62.1688,120.996C 61.6007,120.66 61.1063,120.289 60.6854,119.883C 60.2646,119.478 59.9341,119.018 59.6938,118.504C 59.4535,117.99 59.3333,117.388 59.3333,116.696C 59.3333,115.849 59.5229,115.112 59.9021,114.485C 60.2813,113.859 60.7792,113.343 61.3958,112.938C 62.0125,112.532 62.7153,112.23 63.5042,112.031C 64.2931,111.833 65.0972,111.733 65.9167,111.733C 67.7834,111.733 69.1444,111.979 70,112.471L 70,114.933C 68.8917,114.044 67.468,113.6 65.7292,113.6C 65.2486,113.6 64.7681,113.651 64.2875,113.754C 63.8069,113.857 63.3792,114.025 63.0042,114.258C 62.6292,114.492 62.3236,114.792 62.0875,115.158C 61.8514,115.525 61.7333,115.972 61.7333,116.5C 61.7333,116.975 61.8229,117.385 62.0021,117.731C 62.1812,118.077 62.4458,118.392 62.7958,118.677C 63.1458,118.962 63.5722,119.238 64.075,119.506C 64.5778,119.774 65.157,120.068 65.8125,120.388C 66.4875,120.715 67.1264,121.06 67.7292,121.423C 68.3319,121.785 68.8611,122.188 69.3167,122.629C 69.7722,123.071 70.1333,123.559 70.4,124.094C 70.6667,124.628 70.8,125.242 70.8,125.933C 70.8,126.85 70.6174,127.626 70.2521,128.26C 69.8868,128.895 69.3944,129.411 68.775,129.808C 68.1555,130.206 67.441,130.492 66.6313,130.669C 65.8215,130.845 64.968,130.933 64.0708,130.933C 63.7708,130.933 63.4014,130.908 62.9625,130.856C 62.5236,130.805 62.075,130.73 61.6167,130.631C 61.1584,130.533 60.725,130.41 60.3167,130.265C 59.9084,130.119 59.5806,129.957 59.3333,129.779 Z "</span><span style="color: #007700">/&gt;</span>
                    <span style="color: #007700">&lt;GeometryDrawing</span> <span style="color: #0000CC">Brush=</span><span style="background-color: #fff0f0">"#FF000000"</span> <span style="color: #0000CC">Geometry=</span><span style="background-color: #fff0f0">"F1 M 24.2667,56L 18.9833,74.6667L 16.4208,74.6667L 12.575,61.025C 12.4111,60.4445 12.3125,59.8111 12.2792,59.125L 12.225,59.125C 12.1722,59.7667 12.0597,60.3917 11.8875,61L 8.01251,74.6667L 5.47502,74.6667L 0,56L 2.41252,56L 6.38751,70.3167C 6.55139,70.9167 6.65556,71.5417 6.70001,72.1917L 6.76668,72.1917C 6.80835,71.7306 6.94305,71.1056 7.17084,70.3167L 11.3,56L 13.3958,56L 17.3583,70.4208C 17.4972,70.9153 17.6014,71.4973 17.6708,72.1667L 17.725,72.1667C 17.7583,71.7167 17.875,71.1181 18.075,70.3709L 21.8958,56L 24.2667,56 Z "</span><span style="color: #007700">/&gt;</span>
                    <span style="color: #007700">&lt;GeometryDrawing</span> <span style="color: #0000CC">Brush=</span><span style="background-color: #fff0f0">"#FF000000"</span> <span style="color: #0000CC">Geometry=</span><span style="background-color: #fff0f0">"F1 M 129.267,74.6667L 119.133,74.6667L 119.133,56L 128.733,56L 128.733,57.8667L 121.267,57.8667L 121.267,64.2667L 128.2,64.2667L 128.2,66.1334L 121.267,66.1334L 121.267,72.8L 129.267,72.8L 129.267,74.6667 Z "</span><span style="color: #007700">/&gt;</span>
                <span style="color: #007700">&lt;/DrawingGroup.Children&gt;</span>
            <span style="color: #007700">&lt;/DrawingGroup&gt;</span>
        <span style="color: #007700">&lt;/DrawingBrush.Drawing&gt;</span>
    <span style="color: #007700">&lt;/DrawingBrush&gt;</span>
    <span style="color: #007700">&lt;DrawingBrush</span> <span style="color: #0000CC">x:Key=</span><span style="background-color: #fff0f0">"Star"</span> <span style="color: #0000CC">Stretch=</span><span style="background-color: #fff0f0">"Uniform"</span><span style="color: #007700">&gt;</span>
        <span style="color: #007700">&lt;DrawingBrush.Drawing&gt;</span>
            <span style="color: #007700">&lt;DrawingGroup&gt;</span>
                <span style="color: #007700">&lt;DrawingGroup.Children&gt;</span>
                    <span style="color: #007700">&lt;GeometryDrawing</span> <span style="color: #0000CC">Brush=</span><span style="background-color: #fff0f0">"{Binding StarColor, FallbackValue=Blue}"</span> <span style="color: #0000CC">Geometry=</span><span style="background-color: #fff0f0">"F1 M 140,70L 80,60L 70,0L 60,60L 0,70L 60,80L 70,140L 80,80L 140,70 Z "</span><span style="color: #007700">/&gt;</span>
                <span style="color: #007700">&lt;/DrawingGroup.Children&gt;</span>
            <span style="color: #007700">&lt;/DrawingGroup&gt;</span>
        <span style="color: #007700">&lt;/DrawingBrush.Drawing&gt;</span>
    <span style="color: #007700">&lt;/DrawingBrush&gt;</span>
<span style="color: #007700">&lt;/ResourceDictionary&gt;</span>
</pre></div>

One thing to notice is that the x:Key="Star", if you look at the GeometryDrawing Brush="{Binding StarColor, FallbackValue=Blue}". This allows you to change the fill of the SVG produced Geometry. In this case, StarColor just has to be defined as a property in the control that you are applying the DrawingBrush to. You will see this when I get to the code behind.

### User Control XAML

Now create your new UserControl in your WPF project. Add a ResourceDictionary to the UserControl.Resources.

    <UserControl.Resources>
      <ResourceDictionary Source="CompassResources.xaml"/>
    </UserControl.Resources> 

This is key, because with out it we can't use the resources that we just created.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #007700">&lt;UserControl</span> <span style="color: #0000CC">x:Class=</span><span style="background-color: #fff0f0">"MiscWPFControls.Controls.Compass.Compass"</span>
             <span style="color: #0000CC">xmlns=</span><span style="background-color: #fff0f0">"http://schemas.microsoft.com/winfx/2006/xaml/presentation"</span>
             <span style="color: #0000CC">xmlns:x=</span><span style="background-color: #fff0f0">"http://schemas.microsoft.com/winfx/2006/xaml"</span>
             <span style="color: #0000CC">xmlns:mc=</span><span style="background-color: #fff0f0">"http://schemas.openxmlformats.org/markup-compatibility/2006"</span> 
             <span style="color: #0000CC">xmlns:d=</span><span style="background-color: #fff0f0">"http://schemas.microsoft.com/expression/blend/2008"</span> 
             <span style="color: #0000CC">xmlns:local=</span><span style="background-color: #fff0f0">"clr-namespace:MiscWPFControls.Controls.Compass"</span>
             <span style="color: #0000CC">mc:Ignorable=</span><span style="background-color: #fff0f0">"d"</span> 
             <span style="color: #0000CC">d:DesignHeight=</span><span style="background-color: #fff0f0">"450"</span> <span style="color: #0000CC">d:DesignWidth=</span><span style="background-color: #fff0f0">"450"</span><span style="color: #007700">&gt;</span>
    <span style="color: #007700">&lt;UserControl.Resources&gt;</span>
        <span style="color: #007700">&lt;ResourceDictionary</span> <span style="color: #0000CC">Source=</span><span style="background-color: #fff0f0">"CompassResources.xaml"</span><span style="color: #007700">/&gt;</span>
    <span style="color: #007700">&lt;/UserControl.Resources&gt;</span>
    <span style="color: #007700">&lt;Grid&gt;</span>
        <span style="color: #007700">&lt;Ellipse</span> <span style="color: #0000CC">Stroke=</span><span style="background-color: #fff0f0">"Black"</span> <span style="color: #0000CC">StrokeThickness=</span><span style="background-color: #fff0f0">"4"</span> <span style="color: #0000CC">Fill=</span><span style="background-color: #fff0f0">"{Binding BackgroundFill}"</span><span style="color: #007700">/&gt;</span>
        <span style="color: #007700">&lt;Ellipse</span> <span style="color: #0000CC">Fill=</span><span style="background-color: #fff0f0">"{Binding Source={StaticResource Star}}"</span> <span style="color: #0000CC">Margin=</span><span style="background-color: #fff0f0">"10"</span><span style="color: #007700">/&gt;</span>
        <span style="color: #007700">&lt;Ellipse</span> <span style="color: #0000CC">Fill=</span><span style="background-color: #fff0f0">"{Binding Source={StaticResource NSWE}}"</span> <span style="color: #0000CC">Margin=</span><span style="background-color: #fff0f0">"10"</span><span style="color: #007700">/&gt;</span>
        <span style="color: #888888">&lt;!--&lt;Line X1="225" X2="225" Y1="0" Y2="450" StrokeThickness="10" RenderTransformOrigin="0.5, 0.5"&gt;--&gt;</span>
        <span style="color: #007700">&lt;Line</span> <span style="color: #0000CC">X1=</span><span style="background-color: #fff0f0">"{Binding CenterWidth}"</span> <span style="color: #0000CC">X2=</span><span style="background-color: #fff0f0">"{Binding CenterWidth}"</span> <span style="color: #0000CC">Y1=</span><span style="background-color: #fff0f0">"{Binding NeedleStart}"</span> <span style="color: #0000CC">Y2=</span><span style="background-color: #fff0f0">"{Binding NeedleEnd}"</span> <span style="color: #0000CC">StrokeThickness=</span><span style="background-color: #fff0f0">"10"</span> <span style="color: #0000CC">RenderTransformOrigin=</span><span style="background-color: #fff0f0">"0.5, 0.5"</span> <span style="color: #0000CC">StrokeStartLineCap=</span><span style="background-color: #fff0f0">"Triangle"</span><span style="color: #007700">&gt;</span>
            <span style="color: #007700">&lt;Line.Stroke&gt;</span>
                <span style="color: #007700">&lt;LinearGradientBrush</span> <span style="color: #0000CC">EndPoint=</span><span style="background-color: #fff0f0">"0.5,1"</span> <span style="color: #0000CC">StartPoint=</span><span style="background-color: #fff0f0">"0.5,0"</span><span style="color: #007700">&gt;</span>
                    <span style="color: #007700">&lt;GradientStop</span> <span style="color: #0000CC">Color=</span><span style="background-color: #fff0f0">"Red"</span> <span style="color: #0000CC">Offset=</span><span style="background-color: #fff0f0">"0.2"</span><span style="color: #007700">/&gt;</span>
                    <span style="color: #007700">&lt;GradientStop</span> <span style="color: #0000CC">Color=</span><span style="background-color: #fff0f0">"White"</span> <span style="color: #0000CC">Offset=</span><span style="background-color: #fff0f0">"1"</span><span style="color: #007700">/&gt;</span>
                <span style="color: #007700">&lt;/LinearGradientBrush&gt;</span>
            <span style="color: #007700">&lt;/Line.Stroke&gt;</span>
            <span style="color: #007700">&lt;Line.RenderTransform&gt;</span>
                <span style="color: #007700">&lt;TransformGroup&gt;</span>
                    <span style="color: #007700">&lt;RotateTransform</span> <span style="color: #0000CC">Angle=</span><span style="background-color: #fff0f0">"{Binding NeedleAngle}"</span><span style="color: #007700">/&gt;</span>
                <span style="color: #007700">&lt;/TransformGroup&gt;</span>
            <span style="color: #007700">&lt;/Line.RenderTransform&gt;</span>

        <span style="color: #007700">&lt;/Line&gt;</span>

    <span style="color: #007700">&lt;/Grid&gt;</span>
<span style="color: #007700">&lt;/UserControl&gt;</span>
</pre></div>

I added three Ellipses. One that creates a ring around the border of the compass. One that adds the Star. And one that adds the NSWE labels. The StaticResource value is the x:Key that you set in the resource dictionary xaml.

The next piece is the needle that spins around. I accomplish this by drawing a line in the center of the control. X1 and X2 are bound to a CenterWidth property that I define in the code behind. I'll get to how that works in a minute. The Y1 and Y2 are set to NeedleStart and NeedleEnd which I have set based on a NeedleLength value. A key point here is the RenderTransformOrigin. To make the needle spin from the center, ensure that it is set to 0.5, 0.5. When adjusting the angle it will now spin in the middle. StrokeStartLineCap="Triangle" gives the North pointing end a nice point. The LinearGradientBrush colors the needle Red to White so that it easy to tell the ends apart. Line.RenderTransform and RotateTransform the Angle is bound to the NeedleAngle property.

### Code Behind

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">    <span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">partial</span> <span style="color: #008800; font-weight: bold">class</span> <span style="color: #BB0066; font-weight: bold">Compass</span> : UserControl, INotifyPropertyChanged
    {

        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">event</span> PropertyChangedEventHandler PropertyChanged;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">void</span> <span style="color: #0066BB; font-weight: bold">NotifyPropertyChanged</span>([CallerMemberName]<span style="color: #333399; font-weight: bold">string</span> name=<span style="background-color: #fff0f0">""</span>) =&gt; PropertyChanged?.Invoke(<span style="color: #008800; font-weight: bold">this</span>, <span style="color: #008800; font-weight: bold">new</span> PropertyChangedEventArgs(name));

        <span style="color: #008800; font-weight: bold">private</span> Brush starColor = Brushes.Red;
        <span style="color: #008800; font-weight: bold">public</span> Brush StarColor
        {
            <span style="color: #008800; font-weight: bold">get</span> =&gt; starColor;
            <span style="color: #008800; font-weight: bold">set</span>
            {
                starColor = <span style="color: #008800; font-weight: bold">value</span>;
                NotifyPropertyChanged();
            }
        }

        <span style="color: #008800; font-weight: bold">private</span> Brush backgroundFill = Brushes.Gray;
        <span style="color: #008800; font-weight: bold">public</span> Brush BackgroundFill
        {
            <span style="color: #008800; font-weight: bold">get</span> =&gt; backgroundFill;
            <span style="color: #008800; font-weight: bold">set</span>
            {
                backgroundFill = <span style="color: #008800; font-weight: bold">value</span>;
                NotifyPropertyChanged();
            }
        }

        <span style="color: #008800; font-weight: bold">private</span> <span style="color: #333399; font-weight: bold">double</span> centerWidth = <span style="color: #6600EE; font-weight: bold">225</span>;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">double</span> CenterWidth
        {
            <span style="color: #008800; font-weight: bold">get</span> =&gt; centerWidth;
            <span style="color: #008800; font-weight: bold">set</span>
            {
                centerWidth = <span style="color: #008800; font-weight: bold">value</span>;
                NotifyPropertyChanged();
            }
        }

        <span style="color: #008800; font-weight: bold">private</span> <span style="color: #333399; font-weight: bold">double</span> centerHeight = <span style="color: #6600EE; font-weight: bold">225</span>;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">double</span> CenterHeight
        {
            <span style="color: #008800; font-weight: bold">get</span> =&gt; centerHeight;
            <span style="color: #008800; font-weight: bold">set</span>
            {
                centerHeight = <span style="color: #008800; font-weight: bold">value</span>;
                NotifyPropertyChanged();
            }
        }


        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">double</span> NeedleAngle
        {
            <span style="color: #008800; font-weight: bold">get</span> { <span style="color: #008800; font-weight: bold">return</span> (<span style="color: #333399; font-weight: bold">double</span>)GetValue(NeedleAngleProperty); }
            <span style="color: #008800; font-weight: bold">set</span> { SetValue(NeedleAngleProperty, <span style="color: #008800; font-weight: bold">value</span>); }
        }

        <span style="color: #888888">// Using a DependencyProperty as the backing store for NeedleAngle.  This enables animation, styling, binding, etc...</span>
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">static</span> <span style="color: #008800; font-weight: bold">readonly</span> DependencyProperty NeedleAngleProperty =
            DependencyProperty.Register(<span style="background-color: #fff0f0">"NeedleAngle"</span>, <span style="color: #008800; font-weight: bold">typeof</span>(<span style="color: #333399; font-weight: bold">double</span>), <span style="color: #008800; font-weight: bold">typeof</span>(Compass), <span style="color: #008800; font-weight: bold">new</span> PropertyMetadata(<span style="color: #6600EE; font-weight: bold">45.0</span>));




        <span style="color: #008800; font-weight: bold">private</span> <span style="color: #333399; font-weight: bold">double</span> needleLength = <span style="color: #6600EE; font-weight: bold">0.9</span>;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">double</span> NeedleLength
        {
            <span style="color: #008800; font-weight: bold">get</span> =&gt; needleLength;
            <span style="color: #008800; font-weight: bold">set</span>
            {
                needleLength = <span style="color: #008800; font-weight: bold">value</span>;
                NotifyPropertyChanged();
            }
        }

        <span style="color: #008800; font-weight: bold">private</span> <span style="color: #333399; font-weight: bold">double</span> needleStart = (<span style="color: #6600EE; font-weight: bold">450</span> - <span style="color: #6600EE; font-weight: bold">450</span> * <span style="color: #6600EE; font-weight: bold">0.9</span>)/<span style="color: #6600EE; font-weight: bold">2</span>;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">double</span> NeedleStart
        {
            <span style="color: #008800; font-weight: bold">get</span> =&gt; needleStart;
            <span style="color: #008800; font-weight: bold">private</span> <span style="color: #008800; font-weight: bold">set</span>
            {
                needleStart = <span style="color: #008800; font-weight: bold">value</span>;
                NotifyPropertyChanged();
            }
        }
        <span style="color: #008800; font-weight: bold">private</span> <span style="color: #333399; font-weight: bold">double</span> needleEnd = <span style="color: #6600EE; font-weight: bold">450</span> - (<span style="color: #6600EE; font-weight: bold">450</span> - <span style="color: #6600EE; font-weight: bold">450</span> * <span style="color: #6600EE; font-weight: bold">0.9</span>) / <span style="color: #6600EE; font-weight: bold">2</span>;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">double</span> NeedleEnd
        {
            <span style="color: #008800; font-weight: bold">get</span> =&gt; needleEnd;
            <span style="color: #008800; font-weight: bold">private</span> <span style="color: #008800; font-weight: bold">set</span>
            {
                needleEnd = <span style="color: #008800; font-weight: bold">value</span>;
                NotifyPropertyChanged();
            }
        }

        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #0066BB; font-weight: bold">Compass</span>()
        {
            <span style="color: #008800; font-weight: bold">this</span>.DataContext = <span style="color: #008800; font-weight: bold">this</span>;
            InitializeComponent();
        }

        <span style="color: #008800; font-weight: bold">protected</span> <span style="color: #008800; font-weight: bold">override</span> <span style="color: #008800; font-weight: bold">void</span> <span style="color: #0066BB; font-weight: bold">OnPropertyChanged</span>(DependencyPropertyChangedEventArgs e)
        {
            <span style="color: #008800; font-weight: bold">base</span>.OnPropertyChanged(e);
            <span style="color: #008800; font-weight: bold">switch</span> (e.Property.Name)
            {
                <span style="color: #008800; font-weight: bold">case</span> <span style="background-color: #fff0f0">"ActualWidth"</span>: CenterWidth = ActualWidth / <span style="color: #6600EE; font-weight: bold">2</span>; <span style="color: #008800; font-weight: bold">break</span>;
                <span style="color: #008800; font-weight: bold">case</span> <span style="background-color: #fff0f0">"ActualHeight"</span>:
                    {
                        CenterHeight = ActualHeight / <span style="color: #6600EE; font-weight: bold">2</span>;
                        <span style="color: #333399; font-weight: bold">var</span> offset = (ActualHeight - needleLength * ActualHeight) / <span style="color: #6600EE; font-weight: bold">2</span>;
                        NeedleStart = offset;
                        NeedleEnd = ActualHeight - offset;
                    }
                    <span style="color: #008800; font-weight: bold">break</span>;
            }
        }
</pre></div>

I went with the standard Notify Property Changed property approach for the bindings. If you haven't seen the [CallerMemberName] attribute before, it is really handy in this case. It allows you to just call NotifyPropertyChanged(); and when the code is compiled the name of the member calling it automatically gets filled in behind the scenes. This eliminates the need to have NotifyPropertyChanged(nameof(BackgroundFill));

To make the CenterWidth and CenterHeight properties work, I overrode the OnPropertyChanged of the user control. When the ActualWidth and ActualHeight properties are set, I set them to half it. Also I have it calculate the NeedleStart and NeedleEnd.

The key piece here was that for me to be able to bind the NeedleAngle to a value on the MainWindow slider angle, I had to make it a Dependency Property. If you are using a newer version of Visual Studio, you can auto fill out a template for that by typing propdp and tab twice.
### Main Window
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #007700">&lt;Window</span>
        <span style="color: #0000CC">xmlns=</span><span style="background-color: #fff0f0">"http://schemas.microsoft.com/winfx/2006/xaml/presentation"</span>
        <span style="color: #0000CC">xmlns:x=</span><span style="background-color: #fff0f0">"http://schemas.microsoft.com/winfx/2006/xaml"</span>
        <span style="color: #0000CC">xmlns:d=</span><span style="background-color: #fff0f0">"http://schemas.microsoft.com/expression/blend/2008"</span>
        <span style="color: #0000CC">xmlns:mc=</span><span style="background-color: #fff0f0">"http://schemas.openxmlformats.org/markup-compatibility/2006"</span>
        <span style="color: #0000CC">xmlns:local=</span><span style="background-color: #fff0f0">"clr-namespace:MiscWPFControls"</span>
        <span style="color: #0000CC">xmlns:Compass=</span><span style="background-color: #fff0f0">"clr-namespace:MiscWPFControls.Controls.Compass"</span> <span style="color: #0000CC">x:Class=</span><span style="background-color: #fff0f0">"MiscWPFControls.MainWindow"</span>
        <span style="color: #0000CC">mc:Ignorable=</span><span style="background-color: #fff0f0">"d"</span>
        <span style="color: #0000CC">Title=</span><span style="background-color: #fff0f0">"MainWindow"</span> <span style="color: #0000CC">Height=</span><span style="background-color: #fff0f0">"364.5"</span> <span style="color: #0000CC">Width=</span><span style="background-color: #fff0f0">"239"</span> <span style="color: #0000CC">Name=</span><span style="background-color: #fff0f0">"mainWindow"</span><span style="color: #007700">&gt;</span>
    <span style="color: #007700">&lt;Grid&gt;</span>

        <span style="color: #007700">&lt;Compass:Compass</span> <span style="color: #0000CC">HorizontalAlignment=</span><span style="background-color: #fff0f0">"Left"</span> <span style="color: #0000CC">Height=</span><span style="background-color: #fff0f0">"200"</span> <span style="color: #0000CC">Margin=</span><span style="background-color: #fff0f0">"10,49,0,0"</span> <span style="color: #0000CC">VerticalAlignment=</span><span style="background-color: #fff0f0">"Top"</span> <span style="color: #0000CC">Width=</span><span style="background-color: #fff0f0">"200"</span> <span style="color: #0000CC">StarColor=</span><span style="background-color: #fff0f0">"Green"</span> <span style="color: #0000CC">BackgroundFill=</span><span style="background-color: #fff0f0">"LightGray"</span> <span style="color: #0000CC">NeedleAngle=</span><span style="background-color: #fff0f0">"{Binding Angle, ElementName=mainWindow}"</span> <span style="color: #0000CC">NeedleLength=</span><span style="background-color: #fff0f0">"0.8"</span><span style="color: #007700">/&gt;</span>
        <span style="color: #007700">&lt;Slider</span> <span style="color: #0000CC">HorizontalAlignment=</span><span style="background-color: #fff0f0">"Left"</span> <span style="color: #0000CC">Margin=</span><span style="background-color: #fff0f0">"10,254,0,0"</span> <span style="color: #0000CC">VerticalAlignment=</span><span style="background-color: #fff0f0">"Top"</span> <span style="color: #0000CC">Width=</span><span style="background-color: #fff0f0">"200"</span> <span style="color: #0000CC">Height=</span><span style="background-color: #fff0f0">"21"</span> <span style="color: #0000CC">Maximum=</span><span style="background-color: #fff0f0">"359"</span> <span style="color: #0000CC">Value=</span><span style="background-color: #fff0f0">"{Binding Angle}"</span><span style="color: #007700">/&gt;</span>

    <span style="color: #007700">&lt;/Grid&gt;</span>
<span style="color: #007700">&lt;/Window&gt;</span>
</pre></div>

Here you can see I just add the Compass control to the window. In the code behind for the window I have a Angle property that I'm binding the Slider value to. In order to tie the Main Window Angle property to the Compass, first give the Window a name. In this case Name="mainWindow", then in the binding for the NeedleAngle, specify which element to get the property from: NeedleAngle="{Binding Angle, ElementName=mainWindow}"

You can also see that you can set the StarColor and the NeedleLength directly from the XAML here. However, in order to bind those values to something, you would have to change them from Properties to DependencyProperties.

<p class="blog-img center md">
    <img src="/images/blog/WPFCompass.jpg" alt="">
    <div class="center">Result!</div>
</p>


Enjoy!

