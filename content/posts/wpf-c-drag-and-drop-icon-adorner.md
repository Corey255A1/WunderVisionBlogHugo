---
title: "WPF C# Drag and Drop Icon (Adorner)"
date: "2018-09-15"
summary: "Quick demonstration and explanation of Drag and Drop Icons (Adorners) in WPF"
thumbnail: "/images/blog/2018-09-15-WPF_CSharp_Drag_and_Drop_Icon_(Adorner).jpg"
slug: "wpf-c-drag-and-drop-icon-adorner"
tags: ["WPF","CSharp"]
---
At work I was implementing a control that had drag and drop capability and I wanted to add a preview of the object as it dragged along. This turned into a frustrating dig through overly complicated examples and not so great documentation in MSDN. I didn't want to have to write a whole bunch of extraneous code that I believed couldn't have been necessary to implement a bare-minimum drag and drop preview. 

<div class="embed-youtube">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/oC3DuSahiZc" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
Here is all of the code and solution referenced in the blog post: [https://github.com/Corey255A1/WPFDragAndDrop](https://github.com/Corey255A1/WPFDragAndDrop)

Getting drag and drop to work at a minimum is actually pretty straight forward.

- Create a drop target by setting the AllowDrop property on the control you want to drop objects on.
- Implement the Drop event in your drop target control to handle the drop.
- On the drag control, implement the **MouseMove** event and check if the LeftButton (or what ever key you want) is pressed and call the **DragDrop.DoDragDrop** (DependencyObject,object,DragDropEffects) method.
- Create a **new DataObject** with a label for the data that you are passing.
- Example: var obj = new DataObject("COLOR", this.Background); 
- Back on the drop target, get the data that you passed by calling **e.Data.GetData("COLOR")** 



<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #0066BB; font-weight: bold">DropZone</span>()
        {
            InitializeComponent();
        }

        <span style="color: #008800; font-weight: bold">private</span> <span style="color: #008800; font-weight: bold">void</span> <span style="color: #0066BB; font-weight: bold">UserControl_Drop</span>(<span style="color: #333399; font-weight: bold">object</span> sender, DragEventArgs e)
        {
            <span style="color: #333399; font-weight: bold">var</span> droppedBrush = (Brush)e.Data.GetData(<span style="background-color: #fff0f0">"COLOR"</span>);
            <span style="color: #008800; font-weight: bold">this</span>.Background = droppedBrush;
            borderRect.StrokeDashArray = <span style="color: #008800; font-weight: bold">null</span>;
            borderRect.Stroke = Brushes.Black;
        }
</pre></div>
</br>
<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">        <span style="color: #008800; font-weight: bold">public</span> <span style="color: #0066BB; font-weight: bold">Draggable</span>()
        {
            InitializeComponent();
        }

        <span style="color: #008800; font-weight: bold">private</span> <span style="color: #008800; font-weight: bold">void</span> <span style="color: #0066BB; font-weight: bold">UserControl_MouseMove</span>(<span style="color: #333399; font-weight: bold">object</span> sender, MouseEventArgs e)
        {
            <span style="color: #008800; font-weight: bold">if</span> (e.LeftButton == MouseButtonState.Pressed)
            {
                <span style="color: #333399; font-weight: bold">var</span> obj = <span style="color: #008800; font-weight: bold">new</span> DataObject(<span style="background-color: #fff0f0">"COLOR"</span>, <span style="color: #008800; font-weight: bold">this</span>.Background);
                DragDrop.DoDragDrop(<span style="color: #008800; font-weight: bold">this</span>, obj, DragDropEffects.Copy);
               
            }
        }
</pre></div>

And that's it. Using this little bit of code you can now drag data around from object to object. That's pretty cool, but to add flair you decide that you want to have a little preview of the object drag along with the mouse. That is the tricky part.

There is this concept of an AdornerLayer. It is another layer of WPF rendering that allows you to add some additional objects on top of a UIElement. This is what we are going to use to add our preview object on. First you have to subclass the **Adorner**. Contrary to all of the examples I've seen online this isn't as bad as seems at least to get the bare minimum. The **OnRender** is the only method that needs overridden. In your Adorner constructor, make sure to set **this.IsHitTestVisible = false;** otherwise, the adornment will interfere with the drop target because your mouse will be technically hitting the adorner and not the drop target. 

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">        <span style="color: #888888">//Adorner subclass specific to this control</span>
        <span style="color: #008800; font-weight: bold">private</span> <span style="color: #008800; font-weight: bold">class</span> <span style="color: #BB0066; font-weight: bold">DraggableAdorner</span> : Adorner
        {
            Rect renderRect;
            Brush renderBrush;
            <span style="color: #008800; font-weight: bold">public</span> Point CenterOffset;
            <span style="color: #008800; font-weight: bold">public</span> <span style="color: #0066BB; font-weight: bold">DraggableAdorner</span>(Draggable adornedElement) : <span style="color: #008800; font-weight: bold">base</span>(adornedElement)
            {
                renderRect = <span style="color: #008800; font-weight: bold">new</span> Rect(adornedElement.RenderSize);
                <span style="color: #008800; font-weight: bold">this</span>.IsHitTestVisible = <span style="color: #008800; font-weight: bold">false</span>;
                <span style="color: #888888">//Clone so that it can be modified with on modifying the original</span>
                renderBrush = adornedElement.Background.Clone();
                CenterOffset = <span style="color: #008800; font-weight: bold">new</span> Point(-renderRect.Width / <span style="color: #6600EE; font-weight: bold">2</span>, -renderRect.Height / <span style="color: #6600EE; font-weight: bold">2</span>);
            }
            <span style="color: #008800; font-weight: bold">protected</span> <span style="color: #008800; font-weight: bold">override</span> <span style="color: #008800; font-weight: bold">void</span> <span style="color: #0066BB; font-weight: bold">OnRender</span>(DrawingContext drawingContext)
            {
                drawingContext.DrawRectangle(renderBrush, <span style="color: #008800; font-weight: bold">null</span>, renderRect);
            }
        }
</pre></div>


When the DragDrop is about to happen just before the DragDrop.DoDragDrop, this is where you create your adorner. First you have to **AdornerLayer.GetAdornerLayer(this);** get the adornerlayer for this object. Then create an instance of your new Adorner class and add it to that adorner layer. Store the adorner in a class member variable so that it can be updated with in the **PreviewGiveFeedback** method. An interesting note is that the DragDrop.DoDragDrop is actually blocking call. It blocks until the DragDrop is over. So right after the drag drop, you remove the adornment that you created from the adornerlayer, and then it will go away. 

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">        <span style="color: #008800; font-weight: bold">private</span> <span style="color: #008800; font-weight: bold">void</span> <span style="color: #0066BB; font-weight: bold">UserControl_MouseMove</span>(<span style="color: #333399; font-weight: bold">object</span> sender, MouseEventArgs e)
        {
            <span style="color: #008800; font-weight: bold">if</span> (e.LeftButton == MouseButtonState.Pressed)
            {
                <span style="color: #333399; font-weight: bold">var</span> obj = <span style="color: #008800; font-weight: bold">new</span> DataObject(<span style="background-color: #fff0f0">"COLOR"</span>, <span style="color: #008800; font-weight: bold">this</span>.Background);
                <span style="color: #333399; font-weight: bold">var</span> adLayer = AdornerLayer.GetAdornerLayer(<span style="color: #008800; font-weight: bold">this</span>);
                myAdornment = <span style="color: #008800; font-weight: bold">new</span> DraggableAdorner(<span style="color: #008800; font-weight: bold">this</span>);
                adLayer.Add(myAdornment);
                DragDrop.DoDragDrop(<span style="color: #008800; font-weight: bold">this</span>, obj, DragDropEffects.Copy);
                adLayer.Remove(myAdornment);
            }
        }
</pre></div>

One frustrating piece to this was the fact that the **OnMouseMove** does not fire when doing the DragDrop. There is a DragOver event that get's fired, but for that to work effectively, it has to be done on the main grid, and it only fires if the mouse isn't over top a control that is above it. The probably slightly controversial way (and the way I ultimately did it) is to **PInvoke** the **GetMousePosition** from user32.dll. People always seem to be reluctant to use PInvoke for some reason, probably because it is relatively slow. But I have never had any issues with doing that. I made the PInvoke point struct a private member variable so that I didn't have to keep creating a new one for each call into the GetMousePosition. 

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #0000CC">        [DllImport("user32.dll")]</span>
        <span style="color: #008800; font-weight: bold">static</span> <span style="color: #008800; font-weight: bold">extern</span> <span style="color: #008800; font-weight: bold">void</span> <span style="color: #0066BB; font-weight: bold">GetCursorPos</span>(<span style="color: #008800; font-weight: bold">ref</span> PInPoint p);

        <span style="color: #008800; font-weight: bold">private</span> DraggableAdorner myAdornment;
        <span style="color: #008800; font-weight: bold">private</span> PInPoint pointRef = <span style="color: #008800; font-weight: bold">new</span> PInPoint();     

        <span style="color: #008800; font-weight: bold">private</span> <span style="color: #008800; font-weight: bold">void</span> <span style="color: #0066BB; font-weight: bold">UserControl_PreviewGiveFeedback</span>(<span style="color: #333399; font-weight: bold">object</span> sender, GiveFeedbackEventArgs e)
        {            
            GetCursorPos(<span style="color: #008800; font-weight: bold">ref</span> pointRef);
            Point relPos = <span style="color: #008800; font-weight: bold">this</span>.PointFromScreen(pointRef.GetPoint(myAdornment.CenterOffset));
            myAdornment.Arrange(<span style="color: #008800; font-weight: bold">new</span> Rect(relPos, myAdornment.DesiredSize));
        }
</pre></div>

When the Dragging is happening there is another even that gets fired and that is the **PreviewGiveFeedback**. It is in here that we call into GetMousePosition and then update the position of our adorner. To update its position, you call the adornment **.Arrange(new Rect(Point, Size));** Remember to translate your GetCursorPoint into a point that is relative to the adorned element using **PointFromScreen**.

You should now see an adornment following the mouse during the drag operation!

Other WPF Projects

- [WPF Compass Control](https://www.wundervisionenvisionthefuture.com/post/simple-wpf-compass-control)
- [WPF Thermometer Control](https://www.wundervisionenvisionthefuture.com/post/basic-wpf-thermometer)