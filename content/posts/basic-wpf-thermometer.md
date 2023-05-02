---
title: "Basic WPF Thermometer"
date: "2019-08-25"
summary: "Create a basic thermometer control using WPF xaml and C#"
thumbnail: "/images/blog/2019-08-25-Basic_WPF_Thermometer.jpg"
slug: "basic-wpf-thermometer"
---
<p class="blog-img center md">
    <img src="/images/blog/Thermometer.gif" alt="">
    <div class="center">WPF Thermometer</div>
</p>


Continuing the trend of churning out some very basic easy to replicate WPF Controls, today I present the Basic Thermometer. Check out [Compass Control](/single-post/simple-wpf-compass-control) too!

[https://github.com/Corey255A1/MiscWPFControls/tree/master/MiscWPFControls/Controls/Thermometer](https://github.com/Corey255A1/MiscWPFControls/tree/master/MiscWPFControls/Controls/Thermometer)

This is created purely just using Ellipse and Rectangles, no SVG export needed.

### The XAML
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #007700">&lt;UserControl</span> <span style="color: #0000CC">x:Class=</span><span style="background-color: #fff0f0">"MiscWPFControls.Controls.Thermometer.Thermometer"</span>
             <span style="color: #0000CC">xmlns=</span><span style="background-color: #fff0f0">"http://schemas.microsoft.com/winfx/2006/xaml/presentation"</span>
             <span style="color: #0000CC">xmlns:x=</span><span style="background-color: #fff0f0">"http://schemas.microsoft.com/winfx/2006/xaml"</span>
             <span style="color: #0000CC">xmlns:mc=</span><span style="background-color: #fff0f0">"http://schemas.openxmlformats.org/markup-compatibility/2006"</span> 
             <span style="color: #0000CC">xmlns:d=</span><span style="background-color: #fff0f0">"http://schemas.microsoft.com/expression/blend/2008"</span> 
             <span style="color: #0000CC">xmlns:local=</span><span style="background-color: #fff0f0">"clr-namespace:MiscWPFControls.Controls.Thermometer"</span>
             <span style="color: #0000CC">mc:Ignorable=</span><span style="background-color: #fff0f0">"d"</span> <span style="color: #0000CC">Height=</span><span style="background-color: #fff0f0">"292.667"</span> <span style="color: #0000CC">Width=</span><span style="background-color: #fff0f0">"95.333"</span><span style="color: #007700">&gt;</span>
    <span style="color: #007700">&lt;Grid&gt;</span>
        <span style="color: #007700">&lt;Grid.ColumnDefinitions&gt;</span>
            <span style="color: #007700">&lt;ColumnDefinition</span> <span style="color: #0000CC">Width=</span><span style="background-color: #fff0f0">"*"</span><span style="color: #007700">/&gt;</span>
            <span style="color: #007700">&lt;ColumnDefinition</span> <span style="color: #0000CC">Width=</span><span style="background-color: #fff0f0">"2*"</span><span style="color: #007700">/&gt;</span>
            <span style="color: #007700">&lt;ColumnDefinition</span> <span style="color: #0000CC">Width=</span><span style="background-color: #fff0f0">"*"</span><span style="color: #007700">/&gt;</span>
        <span style="color: #007700">&lt;/Grid.ColumnDefinitions&gt;</span>
        <span style="color: #007700">&lt;Grid.RowDefinitions&gt;</span>
            <span style="color: #007700">&lt;RowDefinition</span> <span style="color: #0000CC">Height=</span><span style="background-color: #fff0f0">"14*"</span><span style="color: #007700">/&gt;</span>
            <span style="color: #007700">&lt;RowDefinition</span> <span style="color: #0000CC">Height=</span><span style="background-color: #fff0f0">"*"</span><span style="color: #007700">/&gt;</span>
            <span style="color: #007700">&lt;RowDefinition</span> <span style="color: #0000CC">Height=</span><span style="background-color: #fff0f0">"*"</span><span style="color: #007700">/&gt;</span>
        <span style="color: #007700">&lt;/Grid.RowDefinitions&gt;</span>
        <span style="color: #007700">&lt;Grid</span> <span style="color: #0000CC">Grid.Column=</span><span style="background-color: #fff0f0">"1"</span> <span style="color: #0000CC">Grid.RowSpan=</span><span style="background-color: #fff0f0">"2"</span><span style="color: #007700">&gt;</span>
            <span style="color: #007700">&lt;Grid.ColumnDefinitions&gt;</span>
                <span style="color: #007700">&lt;ColumnDefinition</span> <span style="color: #0000CC">Width=</span><span style="background-color: #fff0f0">"*"</span><span style="color: #007700">/&gt;</span>
                <span style="color: #007700">&lt;ColumnDefinition</span> <span style="color: #0000CC">Width=</span><span style="background-color: #fff0f0">"2*"</span><span style="color: #007700">/&gt;</span>
                <span style="color: #007700">&lt;ColumnDefinition</span> <span style="color: #0000CC">Width=</span><span style="background-color: #fff0f0">"*"</span><span style="color: #007700">/&gt;</span>
            <span style="color: #007700">&lt;/Grid.ColumnDefinitions&gt;</span>
            <span style="color: #007700">&lt;Rectangle</span> <span style="color: #0000CC">Grid.Column=</span><span style="background-color: #fff0f0">"1"</span> <span style="color: #0000CC">Stroke=</span><span style="background-color: #fff0f0">"Black"</span> <span style="color: #0000CC">StrokeThickness=</span><span style="background-color: #fff0f0">"3"</span> <span style="color: #0000CC">RadiusX=</span><span style="background-color: #fff0f0">"5"</span> <span style="color: #0000CC">RadiusY=</span><span style="background-color: #fff0f0">"5"</span> <span style="color: #0000CC">Fill=</span><span style="background-color: #fff0f0">"White"</span> <span style="color: #0000CC">Name=</span><span style="background-color: #fff0f0">"temperatureTube"</span><span style="color: #007700">/&gt;</span>
            <span style="color: #007700">&lt;Rectangle</span> <span style="color: #0000CC">Grid.Column=</span><span style="background-color: #fff0f0">"1"</span> <span style="color: #0000CC">RadiusX=</span><span style="background-color: #fff0f0">"10"</span> <span style="color: #0000CC">RadiusY=</span><span style="background-color: #fff0f0">"10"</span> <span style="color: #0000CC">Fill=</span><span style="background-color: #fff0f0">"Red"</span> <span style="color: #0000CC">VerticalAlignment=</span><span style="background-color: #fff0f0">"Bottom"</span> <span style="color: #0000CC">Height=</span><span style="background-color: #fff0f0">"{Binding TemperatureHeight}"</span> <span style="color: #0000CC">Margin=</span><span style="background-color: #fff0f0">"3,0,3,0"</span><span style="color: #007700">/&gt;</span>
        <span style="color: #007700">&lt;/Grid&gt;</span>
        <span style="color: #007700">&lt;TextBlock</span> <span style="color: #0000CC">Grid.Row=</span><span style="background-color: #fff0f0">"0"</span> <span style="color: #0000CC">Grid.Column=</span><span style="background-color: #fff0f0">"0"</span> <span style="color: #0000CC">Text=</span><span style="background-color: #fff0f0">"{Binding MaxTemperatureStr, FallbackValue=50°C}"</span> <span style="color: #0000CC">FontSize=</span><span style="background-color: #fff0f0">"10"</span> <span style="color: #0000CC">FontWeight=</span><span style="background-color: #fff0f0">"Bold"</span> <span style="color: #0000CC">HorizontalAlignment=</span><span style="background-color: #fff0f0">"Center"</span> <span style="color: #0000CC">VerticalAlignment=</span><span style="background-color: #fff0f0">"Top"</span><span style="color: #007700">/&gt;</span>
        <span style="color: #007700">&lt;TextBlock</span> <span style="color: #0000CC">Grid.Row=</span><span style="background-color: #fff0f0">"0"</span> <span style="color: #0000CC">Grid.Column=</span><span style="background-color: #fff0f0">"0"</span> <span style="color: #0000CC">Text=</span><span style="background-color: #fff0f0">"{Binding MinTemperatureStr, FallbackValue=-30°C}"</span> <span style="color: #0000CC">FontSize=</span><span style="background-color: #fff0f0">"10"</span> <span style="color: #0000CC">FontWeight=</span><span style="background-color: #fff0f0">"Bold"</span> <span style="color: #0000CC">HorizontalAlignment=</span><span style="background-color: #fff0f0">"Center"</span> <span style="color: #0000CC">VerticalAlignment=</span><span style="background-color: #fff0f0">"Bottom"</span><span style="color: #007700">/&gt;</span>
        <span style="color: #007700">&lt;Ellipse</span> <span style="color: #0000CC">Grid.Row=</span><span style="background-color: #fff0f0">"1"</span> <span style="color: #0000CC">Grid.Column=</span><span style="background-color: #fff0f0">"1"</span> <span style="color: #0000CC">Grid.RowSpan=</span><span style="background-color: #fff0f0">"2"</span> <span style="color: #0000CC">Grid.ColumnSpan=</span><span style="background-color: #fff0f0">"1"</span> <span style="color: #0000CC">Stroke=</span><span style="background-color: #fff0f0">"Black"</span> <span style="color: #0000CC">StrokeThickness=</span><span style="background-color: #fff0f0">"3"</span> <span style="color: #0000CC">Fill=</span><span style="background-color: #fff0f0">"Red"</span> <span style="color: #0000CC">Name=</span><span style="background-color: #fff0f0">"bulb"</span><span style="color: #007700">/&gt;</span>
        <span style="color: #007700">&lt;TextBlock</span> <span style="color: #0000CC">Grid.Row=</span><span style="background-color: #fff0f0">"1"</span> <span style="color: #0000CC">Grid.Column=</span><span style="background-color: #fff0f0">"1"</span>  <span style="color: #0000CC">Grid.RowSpan=</span><span style="background-color: #fff0f0">"2"</span> <span style="color: #0000CC">Grid.ColumnSpan=</span><span style="background-color: #fff0f0">"1"</span> <span style="color: #0000CC">Text=</span><span style="background-color: #fff0f0">"{Binding TemperatureText, FallbackValue=-30°C}"</span> <span style="color: #0000CC">FontSize=</span><span style="background-color: #fff0f0">"14"</span> <span style="color: #0000CC">FontWeight=</span><span style="background-color: #fff0f0">"Bold"</span> <span style="color: #0000CC">HorizontalAlignment=</span><span style="background-color: #fff0f0">"Center"</span> <span style="color: #0000CC">VerticalAlignment=</span><span style="background-color: #fff0f0">"Center"</span><span style="color: #007700">/&gt;</span>
    <span style="color: #007700">&lt;/Grid&gt;</span>
<span style="color: #007700">&lt;/UserControl&gt;</span>
</pre></div>

I start off by splitting up the grid. Using the * Allows the grid to be split up into chunks that are a fraction of the total height or width. For example, if you have two ColumnDefinitions with Width="*", what you will have are two columns that are equally sized. If you set one of them to 2* that column will be twice the size of the * column. So the 2* will be 2/3 and the * will be 1/3. Above, the 14* RowDefinition is for the stem of the thermometer. I want it to be 14 times taller than the single *. In this case it will be 14/16 and the other two rows will be 1/16.

<p class="blog-img center md">
    <img src="/images/blog/Thermostat_Grid.jpg" alt="">
    <div class="center">Showing the Grid</div>
</p>


I then created a nested grid in that second long column, and sized it so that it spanned 2 rows. Then in that grid, I create two rectangles, on that is filled white with a border and some border radius to round off the corners. I name this rectangle "temperatureTube" this is important in the code behind when calculating how the fluid responds to temperature change. The second rectangle Height is bound to a TemperatureHeight value which is calculated in the code behind. I set the margin of the left and right side of this rectangle to the strokethickness of the background rectangle.

The two Min and Max labels are set to the first column where the VerticalAlignment is set to bottom and top respectively. These are bound to the Min and Max Temperature strings. I probably could have done something fancy here like create a converter to convert the doubles into a temperature, but this is all about simplicity and bare minimum. The thermometer bulb spans the bottom center grid cells. This ensures that the bulb stays the same relative size to the stem. And finally I added the Textblock in the center of the bulb so that the value of the temperature is displayed.

### The Code Behind

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #008800; font-weight: bold">static</span> <span style="color: #008800; font-weight: bold">readonly</span> DependencyProperty TemperatureProperty =
            DependencyProperty.Register(<span style="background-color: #fff0f0">"Temperature"</span>, <span style="color: #008800; font-weight: bold">typeof</span>(<span style="color: #333399; font-weight: bold">double</span>), <span style="color: #008800; font-weight: bold">typeof</span>(Thermometer), <span style="color: #008800; font-weight: bold">new</span> PropertyMetadata(<span style="color: #6600EE; font-weight: bold">37.0</span>));
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #0066BB; font-weight: bold">Thermometer</span>()
        {
            <span style="color: #008800; font-weight: bold">this</span>.DataContext = <span style="color: #008800; font-weight: bold">this</span>;
            InitializeComponent();
        }

        <span style="color: #008800; font-weight: bold">protected</span> <span style="color: #008800; font-weight: bold">override</span> <span style="color: #008800; font-weight: bold">void</span> <span style="color: #0066BB; font-weight: bold">OnPropertyChanged</span>(DependencyPropertyChangedEventArgs e)
        {
            <span style="color: #008800; font-weight: bold">base</span>.OnPropertyChanged(e);
            <span style="color: #008800; font-weight: bold">switch</span> (e.Property.Name)
            {
                <span style="color: #008800; font-weight: bold">case</span> <span style="background-color: #fff0f0">"ActualHeight"</span>:
                    {
                        temperatureStep = (temperatureTube.ActualHeight-(bulb.ActualHeight/<span style="color: #6600EE; font-weight: bold">2</span>)) / (maxTemp - minTemp);
                        NotifyPropertyChanged(nameof(TemperatureHeight));
                    }
                    <span style="color: #008800; font-weight: bold">break</span>;
                <span style="color: #008800; font-weight: bold">case</span> <span style="background-color: #fff0f0">"Temperature"</span>:
                    NotifyPropertyChanged(nameof(TemperatureHeight));
                    NotifyPropertyChanged(nameof(TemperatureText));
                    <span style="color: #008800; font-weight: bold">break</span>;
            }
        }
    }
</pre></div>

As discussed in Compass Control, the DependencyProperty is used for when you need to bind this property in xaml from a different control or window. So I created the Temperature DependencyProperty to be set from the demo window. Also like in Compass Control, I overrode the OnPropertyChanged. I'd like to find out if there is a more WPF way to do the things I'm doing with it, but until then, this works. When ActualHeight is changed, I calculate the Temperature to Height step. I off set this by half the bulb height This is so that when the Minimum Temperature is set, it ends right at the top of the bulb. I then send out a notify that the TemperatureHeight has changed to that it can rescale the fluid rectangle. When the Temperature dependency property is changed, I send out the notifications that the Height and Text has changed so that things bound to those can update.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">double</span> TemperatureHeight
        {
            <span style="color: #008800; font-weight: bold">get</span> =&gt; bulb!=<span style="color: #008800; font-weight: bold">null</span>?((Temperature-minTemp) * temperatureStep) + (bulb.ActualHeight / <span style="color: #6600EE; font-weight: bold">2</span>): ((Temperature - minTemp) * temperatureStep);
        }
</pre></div>

When the TemperatureHeight is accessed, I calculate the new height of the fluid rectangle with the bulb offset.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">        <span style="color: #008800; font-weight: bold">private</span> <span style="color: #333399; font-weight: bold">double</span> maxTemp = <span style="color: #6600EE; font-weight: bold">50.0</span>;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">double</span> MaxTemperature
        {
            <span style="color: #008800; font-weight: bold">get</span> =&gt; maxTemp;
            <span style="color: #008800; font-weight: bold">set</span>
            {
                maxTemp = <span style="color: #008800; font-weight: bold">value</span>;
                temperatureStep = (temperatureTube.ActualHeight - (bulb.ActualHeight / <span style="color: #6600EE; font-weight: bold">2</span>)) / (maxTemp - minTemp);
                NotifyPropertyChanged(nameof(TemperatureHeight));
                NotifyPropertyChanged(nameof(MaxTemperatureStr));
            }
        }
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">string</span> MaxTemperatureStr
        {
            <span style="color: #008800; font-weight: bold">get</span> =&gt; <span style="color: #FF0000; background-color: #FFAAAA">$</span><span style="background-color: #fff0f0">"{(int)maxTemp}°"</span> + (isCelsius ? <span style="background-color: #fff0f0">"C"</span> : <span style="background-color: #fff0f0">"F"</span>);
        }
</pre></div>

Min and Max Temperature calls similar code, where if the are changed, notify that the Height needs to be recalculated and the the Str should be refreshed.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">       <span style="color: #008800; font-weight: bold">private</span> <span style="color: #333399; font-weight: bold">bool</span> isCelsius = <span style="color: #008800; font-weight: bold">true</span>;
        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #333399; font-weight: bold">bool</span> IsCelsius
        {
            <span style="color: #008800; font-weight: bold">get</span> =&gt; isCelsius;
            <span style="color: #008800; font-weight: bold">set</span>
            {
                isCelsius = <span style="color: #008800; font-weight: bold">value</span>;
                NotifyPropertyChanged(nameof(MinTemperatureStr));
                NotifyPropertyChanged(nameof(MaxTemperatureStr));
                NotifyPropertyChanged(nameof(TemperatureText));
            }
        }
</pre></div>

And change the labels based on if the display should be Fahrenheit or Celsius.

### Using it

On the main window, add the control.
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">        <span style="color: #007700">&lt;Thermometer:Thermometer</span> <span style="color: #0000CC">Grid.Column=</span><span style="background-color: #fff0f0">"1"</span> <span style="color: #0000CC">HorizontalAlignment=</span><span style="background-color: #fff0f0">"Center"</span> <span style="color: #0000CC">Margin=</span><span style="background-color: #fff0f0">"108,10,107,13"</span> <span style="color: #0000CC">VerticalAlignment=</span><span style="background-color: #fff0f0">"Stretch"</span> <span style="color: #0000CC">Temperature=</span><span style="background-color: #fff0f0">"{Binding Value, ElementName=tempSlider}"</span> <span style="color: #0000CC">IsCelsius=</span><span style="background-color: #fff0f0">"True"</span> <span style="color: #0000CC">MinTemperature=</span><span style="background-color: #fff0f0">"-30"</span><span style="color: #007700">/&gt;</span>
</pre></div>

I set the MinTemperature to -30 (The MaxTemperature is default 50) and set it to IsCelisus="True"

I added a vertical slider bar with the name tempSlider, and this I bind its Value directly to the Temperature of the Thermometer using the "{Binding Value, ElementName=tempSlider}". No backing code required for that.

And that is as simple as it gets!

<ToDo Add Image>

P.S. I was looking for a way to create this simple animation and found a neat tool called ScreenToGif: [https://www.screentogif.com/](https://www.screentogif.com/) [https://github.com/NickeManarin/ScreenToGif](https://github.com/NickeManarin/ScreenToGif) Very simple to use and worked great!