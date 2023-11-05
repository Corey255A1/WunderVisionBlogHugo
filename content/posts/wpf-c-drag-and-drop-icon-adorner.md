---
title: "WPF C# Drag and Drop Icon (Adorner)"
date: "2018-09-15"
summary: "Quick demonstration and explanation of Drag and Drop Icons (Adorners) in WPF"
thumbnail: "/images/blog/2018-09-15-WPF_CSharp_Drag_and_Drop_Icon_(Adorner).jpg"
slug: "wpf-c-drag-and-drop-icon-adorner"
tags: ["WPF","C#"]
---
At work I was implementing a control that had drag and drop capability and I wanted to add a preview of the object as it dragged along. This turned into a frustrating dig through overly complicated examples and not so great documentation in MSDN. I didn't want to have to write a whole bunch of extraneous code that I believed couldn't have been necessary to implement a bare-minimum drag and drop preview. 

<div class="embed-youtube">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/oC3DuSahiZc" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

Here is all of the code and solution referenced in the blog post: [Source Code](https://github.com/Corey255A1/WPFDragAndDrop)

Getting drag and drop to work at a minimum is actually pretty straight forward.

- Create a drop target by setting the AllowDrop property on the control you want to drop objects on.
- Implement the Drop event in your drop target control to handle the drop.
- On the drag control, implement the **MouseMove** event and check if the LeftButton (or what ever key you want) is pressed and call the **DragDrop.DoDragDrop** (DependencyObject,object,DragDropEffects) method.
- Create a **new DataObject** with a label for the data that you are passing.
- Example: var obj = new DataObject("COLOR", this.Background); 
- Back on the drop target, get the data that you passed by calling **e.Data.GetData("COLOR")** 

```C#
public DropZone()
{
    InitializeComponent();
}

private void UserControl_Drop(object sender, DragEventArgs e)
{
    var droppedBrush = (Brush)e.Data.GetData("COLOR");
    this.Background = droppedBrush;
    borderRect.StrokeDashArray = null;
    borderRect.Stroke = Brushes.Black;
}
```

```C#
public Draggable()
{
    InitializeComponent();
}

private void UserControl_MouseMove(object sender, MouseEventArgs e)
{
    if (e.LeftButton == MouseButtonState.Pressed)
    {
        var obj = new DataObject("COLOR", this.Background);
        DragDrop.DoDragDrop(this, obj, DragDropEffects.Copy);
        
    }
}
```
And that's it. Using this little bit of code you can now drag data around from object to object. That's pretty cool, but to add flair you decide that you want to have a little preview of the object drag along with the mouse. That is the tricky part.

There is this concept of an AdornerLayer. It is another layer of WPF rendering that allows you to add some additional objects on top of a UIElement. This is what we are going to use to add our preview object on. First you have to subclass the **Adorner**. Contrary to all of the examples I've seen online this isn't as bad as seems at least to get the bare minimum. The **OnRender** is the only method that needs overridden. In your Adorner constructor, make sure to set **this.IsHitTestVisible = false;** otherwise, the adornment will interfere with the drop target because your mouse will be technically hitting the adorner and not the drop target. 
```C#
private class DraggableAdorner : Adorner
{
    Rect renderRect;
    Brush renderBrush;
    public Point CenterOffset;
    public DraggableAdorner(Draggable adornedElement) : base(adornedElement)
    {
        renderRect = new Rect(adornedElement.RenderSize);
        this.IsHitTestVisible = false;
        //Clone so that it can be modified with on modifying the original
        renderBrush = adornedElement.Background.Clone();
        CenterOffset = new Point(-renderRect.Width / 2, -renderRect.Height / 2);
    }
    protected override void OnRender(DrawingContext drawingContext)
    {
        drawingContext.DrawRectangle(renderBrush, null, renderRect);
    }
}
```


When the DragDrop is about to happen just before the DragDrop.DoDragDrop, this is where you create your adorner. First you have to **AdornerLayer.GetAdornerLayer(this);** get the adornerlayer for this object. Then create an instance of your new Adorner class and add it to that adorner layer. Store the adorner in a class member variable so that it can be updated with in the **PreviewGiveFeedback** method. An interesting note is that the DragDrop.DoDragDrop is actually blocking call. It blocks until the DragDrop is over. So right after the drag drop, you remove the adornment that you created from the adornerlayer, and then it will go away. 
```C#
private void UserControl_MouseMove(object sender, MouseEventArgs e)
{
    if (e.LeftButton == MouseButtonState.Pressed)
    {
        var obj = new DataObject("COLOR", this.Background);
        var adLayer = AdornerLayer.GetAdornerLayer(this);
        myAdornment = new DraggableAdorner(this);
        adLayer.Add(myAdornment);
        DragDrop.DoDragDrop(this, obj, DragDropEffects.Copy);
        adLayer.Remove(myAdornment);
    }
}
```

One frustrating piece to this was the fact that the **OnMouseMove** does not fire when doing the DragDrop. There is a DragOver event that get's fired, but for that to work effectively, it has to be done on the main grid, and it only fires if the mouse isn't over top a control that is above it. The probably slightly controversial way (and the way I ultimately did it) is to **PInvoke** the **GetMousePosition** from user32.dll. People always seem to be reluctant to use PInvoke for some reason, probably because it is relatively slow. But I have never had any issues with doing that. I made the PInvoke point struct a private member variable so that I didn't have to keep creating a new one for each call into the GetMousePosition. 
```C#
[DllImport("user32.dll")]
static extern void GetCursorPos(ref PInPoint p);

private DraggableAdorner myAdornment;
private PInPoint pointRef = new PInPoint();     

private void UserControl_PreviewGiveFeedback(object sender, GiveFeedbackEventArgs e)
{            
    GetCursorPos(ref pointRef);
    Point relPos = this.PointFromScreen(pointRef.GetPoint(myAdornment.CenterOffset));
    myAdornment.Arrange(new Rect(relPos, myAdornment.DesiredSize));
}
```

When the Dragging is happening there is another even that gets fired and that is the **PreviewGiveFeedback**. It is in here that we call into GetMousePosition and then update the position of our adorner. To update its position, you call the adornment **.Arrange(new Rect(Point, Size));** Remember to translate your GetCursorPoint into a point that is relative to the adorned element using **PointFromScreen**.

You should now see an adornment following the mouse during the drag operation!

Other WPF Projects
- [WPF Compass Control]({{< ref "/posts/simple-wpf-compass-control" >}} "WPF Compass")
- [WPF Thermometer Control]({{< ref "/posts/basic-wpf-thermometer" >}} "WPF Thermometer")