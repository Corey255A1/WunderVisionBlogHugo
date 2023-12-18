---
title: "WPF Dijkstra Demo Refactor - GUI Part 1"
date: "2023-12-17T00:00:01Z"
summary: "Refactoring the Dijkstra GUI to use better utilize the power of WPF."
bundle: true
thumbnail: "dijkstra_thumb.jpg"
tags: ["WPF", "C#", "Algorithms"]
---
# Introduction
- [Initial Algorithm Refactor]({{<ref "/posts/2023-12-17-WPF_Dijkstra_Demo_Refactor">}})
- [GUI Refactor Part 1]({{<ref "/posts/2023-12-18-WPF_Dijkstra_Demo_Refactor">}})

[Github Source](https://github.com/Corey255A1/DijkstraCoffeeAndCode)

The UI was closely coupled to the old classes. Again, it's going to be better to tear it down to the bones, and rethink how to reflect the algorithm state in the UI.

One thing that I didn't realize initially, is that you can't use .Net 7 dll with .Net Framework 4.8 WPF application. There doesn't seem to be a way to change the target in the project settings, so instead I'm going to create a new project and just move the code over to that new project. This wasn't too big of a deal, but just wasn't something I was expecting.

# 2018 Overview
The original code had most of the user interaction and business logic right in the MainWindow class. It would create nodes and add them manually as children to the canvas and call the functions to solve the algorithm. I want to separate this all out, clean it up, and make it more WPF like.

Not great code...
```c#
private void Window_PreviewKeyDown(object sender, KeyEventArgs e)
{
    if(e.Key == Key.Enter && SelectedNodes.Count==2)
    {
        if (!EdgeElement.IsAnEdge(SelectedNodes[0], SelectedNodes[1]))
        {
            EdgeElement ee = new EdgeElement(SelectedNodes[0], SelectedNodes[1]);
            ee.EdgeDeleted += EdgeElementDeleted;
            graphCanvas.Children.Add(ee);
            CreatedEdges.Add(ee);
            SelectedNodes[0].Selected = false;
            SelectedNodes[1].Selected = false;
            SelectedNodes.Clear();
        }
    }
}

private void solveBtn_Click(object sender, RoutedEventArgs e)
{
    if(SelectedNodes.Count>0)
    {
        if(ShortestPathClass.FindShortestPath(SelectedNodes[0].theNode, endNode.theNode))
        {
            infoBox.Text = String.Format("Shortest Distance Found {0}", endNode.theNode.ShortestDistance);
        }
        else
        {
            infoBox.Text = "No Path To End";
        }
    }
    else
    {
        infoBox.Text = "Please select a starting Node";
    }
}
```

# 2023 Overview
What I want to do is follow loosely the idea of Model, View, View Model. Where the model is the Dijkstra Algorithm, the View Model is the encapsulating class to drive thinks like if it is highlighted or not, and the View is the XAML and user interaction part.

Rather than have the Nodes and Edges added directly as children to the canvas, I created view models that derive from the same base class. This is then an observable collection that is bound to by an ItemsControl with a Canvas Template.

I had to dig to find it, but you can bind DataTemplates based on Class Type just by specifying the DataType field of the DataTemplate, and making it a resource that is available to the control you want to use. 

```xml
<ItemsControl Background="AliceBlue" Grid.Row="0" ItemsSource="{Binding Path=DijkstraObjects}"  MouseRightButtonDown="CanvasMouseRightButtonDown" MouseLeftButtonDown="CanvasMouseLeftButtonDown">
    <ItemsControl.Resources>
        <DataTemplate DataType="{x:Type vm:DijkstraNodeViewModel}">
            <views:NodeElement DataContext="{Binding }" />
        </DataTemplate>
        <DataTemplate DataType="{x:Type vm:DijkstraEdgeViewModel}">
            <Line X1="{Binding X1}" Y1="{Binding Y1}" Y2="{Binding Y2}" X2="{Binding X2}" Stroke="Black" StrokeThickness="20"/>
        </DataTemplate>
    </ItemsControl.Resources>
    <ItemsControl.ItemsPanel>
        <ItemsPanelTemplate>
            <Canvas/>
        </ItemsPanelTemplate>
    </ItemsControl.ItemsPanel>
    <ItemsControl.ItemContainerStyle>
        <Style TargetType="ContentPresenter">
            <Setter Property="Canvas.Left" Value="{Binding Left}"/>
            <Setter Property="Canvas.Top" Value="{Binding Top}"/>
        </Style>
    </ItemsControl.ItemContainerStyle>
</ItemsControl>
```


# Nodes
Starting at the Node element, in 2018 I wasn't really thinking in terms of how to bind the states. Instead, I was driving the logic from the code behind.
## 2018 Code Behind
Setting the fill of the ellipse with hard coded brush values.
```C#
public partial class NodeElement : UserControl
{
    public Node theNode;
    private bool selected;
    public bool Selected
    {
        get
        {
            return selected;
        }
        set
        {
            selected = value;
            nodeEllipse.Fill = selected ? Brushes.Green : Brushes.White;
        }
    }
```

Let's think about what our Node states and colors are. 
- Selected – When the user clicks and selects a node on the canvas
- "Visualized" - When the algorithm is checking that node as a neighbor to the currently visited node
- Highlight – When the algorithm is visiting that node, and when it is the shortest path
- Visited – When the algorithm has visited that node and checked its neighbors 

To handle all the visualization states, I'm going to create a ViewModels folder to contain classes to encapsulate the classes from the library. This way we can keep the graphics decoupled from the algorithm.

## 2023
Using Notifications to drive style triggers in the View.
```C#
public class DijkstraNodeViewModel : DijkstraObjectViewModel
{
    public event EventHandler<UserInteractionEventArgs>? UserInteraction;

    private DijkstraAlgorithm.DijkstraNode _node;
    public DijkstraAlgorithm.DijkstraNode Node => _node;

    private bool _isSelected;
    public bool IsSelected
    {
        get { return _isSelected; }
        set { _isSelected = value; Notify(); }
    }
```
```xml
 <UserControl.Resources>
    <Style TargetType="Ellipse" x:Key="node">
        <Setter Property="Fill" Value="White"/>
        <Style.Triggers>
            <DataTrigger Binding="{Binding IsSelected}" Value="true">
                <Setter Property="Fill" Value="CadetBlue"/>
            </DataTrigger>
            <DataTrigger Binding="{Binding IsHighlighted}" Value="true">
                <Setter Property="Fill" Value="Lime"/>
            </DataTrigger>
        </Style.Triggers>
    </Style>
</UserControl.Resources>
```

This is making things already so much cleaner.

I was having issues getting the click and drag set up for the nodes. I was doing what I thought would be fine using the CaptureMouse and ReleaseMouseCapture.. But I was calling it for the NodeElement as a whole. Apparently that doesn't work for some reason. 

Using the sender in the mouse click callback however (which is the ellipse element) to capture and release the mouse works as expected. 

# Edges
The original Edge element overrode the OnRender of the FrameworkElement. In there I rendered a line and some text.
While this is certainly interesting, its not the cleanest or most WPF way to do this.

```c#
protected override void OnRender(DrawingContext drawingContext)
{
    var shadow = new FormattedText(((int)theEdge.Distance).ToString(),
        System.Globalization.CultureInfo.CurrentCulture,
        FlowDirection.LeftToRight,
        font, 16, Brushes.Black);
    var text = new FormattedText(((int)theEdge.Distance).ToString(),
        System.Globalization.CultureInfo.CurrentCulture,
        FlowDirection.LeftToRight,
        font, 16, Brushes.White);

    drawingContext.DrawLine(thePen, theEdge.N1, theEdge.N2);
    drawingContext.DrawText(shadow, theEdge.GetMidPoint(1,1));
    drawingContext.DrawText(text, theEdge.GetMidPoint());
    base.OnRender(drawingContext);
}
```

What I wound up doing in the DijkstraEdgeViewModel is defining the (X1,Y1) and (X2,Y2) as the end nodes.
Then in the template selector of the ItemsControl, for Edges I bind those to a Line element. I had to set the Top and Left to 0.

```C#
 public class DijkstraEdgeViewModel : DijkstraObjectViewModel
{
    private Edge _edge;

    private bool _highlighted;
    public bool Highlighted
    {
        get { return _highlighted; }
        set
        {
            _highlighted = value;
            Notify();
        }
    }

    public double Left => 0;
    public double Top => 0;

    public double X1
    {
        get => _edge.Node1.Point.X;
    }

    public double Y1
    {
        get => _edge.Node1.Point.Y;
    }

    public double X2
    {
        get => _edge.Node2.Point.X;
    }

    public double Y2
    {
        get => _edge.Node2.Point.Y;
    }
```