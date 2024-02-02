---
title: "WPF FunKey Viewer"
date: "2024-01-27"
summary: "A simple WPF key viewer to display the keys I press during video demos"
bundle: true
thumbnail: "thumb.jpg"
tags: ["C#","WPF","UI"]
---
# Introduction
**[GitHub Source](https://github.com/Corey255A1/FunKeyView)**

<div class="embed-youtube">
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/TUixcwogCYc?si=7TEI2q6QDIEV_Zkq" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

When I was creating the video for the [WPF Dijkstra]({{< ref "/posts/2024-01-08-WPF_Dijkstra" >}} "WPF Dijkstra"), I wanted a way to show my key presses on the screen in real time. Of course there are already probably hundreds of projects that do this. I, however, thought I could make one fairly quickly that would solve the need and be another fun project.

# Getting the Key States
The most important part of a key viewer, is getting the key presses as they are typed. There are several ways to capture the key strokes.

## KeyDown Event
You can add an event handler to a KeyDown or KeyUp event on pretty much any element the user can interact with. There is also a PreviewKeyDown and PreviewKeyUp event. The difference between the two is that the Preview starts with the parent element and travels down to the element that was interacted with. Then the normal events are called in the reverse order. For instance a TextBox on a Window. When a key is pressed with the TextBox is focused, the Window would trigger a Preview event, then the Textbox. Then the Textbox would trigger a normal event followed by the Window (Unless the Textbox blocked the event from continuing to bubble).

The issue with this, is that the Window has to be in focus for these events to fire. This won't work for a key viewer which is supposed to display keys pressed while typing in other windows.

## RegisterHotKey
This is an interesting Win32 API. It allows you to create a hotkey combination that triggers the WM_HOTKEY message. To use this within C# you use the PInvoke method to call the RegisterHotKey function. Then use the WindowInteropHelper to get the HwndSource from the Window. HwndSource has a AddHook method that allows you to add a handler for the raw Windows Messages. In there you check if it is a WM_HOTKEY and then process the Hotkey ID appropriately.

While this works even if the window is not in focus, this does not allow you to register for all keyboard keys.

## Using a thread
The approach that I initially settled on to meet the need at the time was to use a thread to monitor the keyboard states manually. This is the approach that is shown in the Youtube video and in the Dijkstra video. The more satisfying solution is the Low Level Keyboard Hook which is the next section. But let's run through this first.

This uses the **System.Windows.Input.Keyboard.GetKeyStates** method. In the constructor of the KeyStateManager class, it iterates over all the **Key** enums and adds their initial states.
```C#
foreach (var key in Enum.GetValues<Key>())
{
    if (key == Key.None) { continue; }
    KeyState keyState = new(key, false);
    KeyStateUpdater.UpdateState(keyState);
    _keyMap[key] = keyState;
    if (keyState.IsPressed) { PressedKeys.Add(keyState); }
}
```

Because of the way that the Keyboard method works, the thread has to be set to Single Threaded Apartment (STA). This ensures that both the UI thread and the new thread share the same message loop.
```c#
public void StartThread()
{
    if (_keyMonitorThread != null) { throw new Exception("Thread is already running."); }

    _keyMonitorThread = new Thread(ThreadLoop);
    _keyMonitorThread.SetApartmentState(ApartmentState.STA);
    _keyMonitorThread.Start();
}
```

Then a thread is spun up to loop and check the state of each key. If something changes, the key is added or removed from the Pressed Keys list and events are triggered for the UI code to handle.

```c#
public void Update()
{
    foreach (var keyMapState in _keyMap.Values)
    {
        if (!KeyStateUpdater.UpdateState((KeyState)keyMapState)) { continue; }

        if (keyMapState.IsPressed) { AddKeyPressed(keyMapState); }
        else { RemoveKeyPressed(keyMapState); }
    }
}
```

The KeyStateUpdater using the Keyboard class to get the state of the Key that is passed in, checks if it is different, and then updates the state of that key.

```c#
public static bool UpdateState(KeyState state)
{
    var keyboarState = Keyboard.GetKeyStates(state.Key);
    bool hasChanged = state.IsPressed != keyboarState.HasFlag(KeyStates.Down);
    if (!hasChanged) { return false; }

    state.IsPressed = !state.IsPressed;
    return true;
}
```


## LowLevelKeyboardProc
The Win32 API Allows you to set up hooks for various things with in the OS. The **SetWindowsHookEx** allows you to setup a callback function to receive all the key presses even if your window is not in focus.

I created a KeyboardHookManager class that allows client code to register for the Keyboard Events, and then handles in the background the hook.

```c#
public static event EventHandler<IKeyState>? KeyStateChanged
{
    add
    {
        _keyStateChanged += value;
        AddHook();
    }
    remove
    {
        _keyStateChanged -= value;
        if (_keyStateChanged == null)
        {
            RemoveHook();
        }
    }
}
```

When a listener to the KeyStateChanged event is added, it adds the hook. It does this by getting a handle to the ProcessModule, and passing in the reference to our callback handler HookCallback

```c#
public static bool AddHook()
{
    if (_hookId != nint.Zero) { return false; }
    using (Process curProcess = Process.GetCurrentProcess())
    {
        using (ProcessModule? curModule = curProcess.MainModule)
        {
            if (curModule == null) { return false; }

            _hookId = Win32.SetWindowsHookEx(Win32.WH_KEYBOARD_LL, HookCallback, Win32.GetModuleHandle(curModule.ModuleName), 0);

            if (_hookId == nint.Zero) { return false; }
        }
    }
    return true;
}
```

Hook Callback then invokes the event for the Key Down or Key Up events
```c#
private static nint HookCallback(int nCode, nint wParam, nint lParam)
{
    if (nCode >= 0)
    {
        if (wParam == Win32.WM_KEYDOWN)
        {
            int virtualKeyCode = Marshal.ReadInt32(lParam);
            var keyState = new VKKeyState((VK_KeyCode)virtualKeyCode, true);
            _keyStateChanged?.Invoke(null, keyState);
        }
        else if (wParam == Win32.WM_KEYUP)
        {
            int virtualKeyCode = Marshal.ReadInt32(lParam);
            var keyState = new VKKeyState((VK_KeyCode)virtualKeyCode, false);
            _keyStateChanged?.Invoke(null, keyState);
        }
    }
    return Win32.CallNextHookEx(_hookId, nCode, wParam, lParam);
}
```

The KeyStateLLManager then register for that event, and checks if the key state has actually changed, and then adds or removes it from the Current Key List. What happens, is if the key is held down, you'll get that key down event fired over and over, so this filters that out.

```c#
private void KeyStateChanged(object? sender, IKeyState key)
{
    if (!(key is VKKeyState keyState)) { return; }
    var currentState = _keyMap[keyState.Key];
    if (currentState.IsPressed == keyState.IsPressed) { return; }

    currentState.IsPressed = keyState.IsPressed;
    if (currentState.IsPressed)
    {
        AddKeyPressed(currentState);
    }
    else
    {
        RemoveKeyPressed(currentState);
    }
}
```

# Showing the Keys
Now that we have the key presses, we can show them on the screen. In the window viewmodel, I have a collection for the Current keys that are held down, and a collection for the key history.

```c#
public ObservableCollection<List<IKeyState>> KeyHistory { get; private set; } = new();
public ObservableCollection<IKeyState> CurrentKeys { get; private set; } = new();
public MainWindowViewModel(Window window)
{
    _keyStateManager = new KeyStateLLManager(Dispatcher.CurrentDispatcher);
    _keyStateManager.AllKeysReleased += KeyStateManagerAllKeysReleased;
    _keyStateManager.KeyPressed += KeyStateManagerKeyPressed;

    _itemRemoveTimer = new DispatcherTimer();
    _itemRemoveTimer.Interval = TimeSpan.FromSeconds(ItemRemoveSeconds);
    _itemRemoveTimer.Tick += ItemRemoveTimer;
}
```

The key history is bound to a ItemsControl that renders the KeyComboView for each key combo that was pressed. There is also a singular one for the current key presses.

```xml
<ItemsControl ItemsSource="{Binding KeyHistory}">
    <ItemsControl.ItemsPanel>
        <ItemsPanelTemplate>
            <StackPanel VerticalAlignment="Bottom"/>
        </ItemsPanelTemplate>
    </ItemsControl.ItemsPanel>
    <ItemsControl.ItemTemplate>
        <DataTemplate>
            <view:KeyComboView DataContext="{Binding}" FadeOut="True" FadeOutSeconds="{Binding DataContext.ItemRemoveSeconds, RelativeSource={RelativeSource AncestorType=ItemsControl}}"/>
        </DataTemplate>
    </ItemsControl.ItemTemplate>
</ItemsControl>
<view:KeyComboView Grid.Row="1" DataContext="{Binding CurrentKeys}" FadeOut="False"/>
```

I decided it would be cool to have the Key History fade out over time and I wanted to have it be bound to the same ItemRemoveSeconds property from the view model.

The issue was that you can't bind directly a property to a Storyboard from the xaml. 

This will not work:
```xml
<BeginStoryboard>
    <Storyboard 
        Storyboard.TargetProperty="Opacity">
        <DoubleAnimation BeginTime="0:0:0" Duration="{Binding FadeOutSeconds}" From="1.0" To="0.0"/>
    </Storyboard>
</BeginStoryboard>
```

The reason is that the Storyboard has to be locked so that it can be used from a different thread. I did some research and while there does seem to be some hacks you can do, I opted to use Code behind since that was the most straight forward.

```C#
private void OnLoaded(object sender, RoutedEventArgs e)
{
    if (FadeOut)
    {
        BeginFadeOut();
    }
}

public void BeginFadeOut()
{
    Storyboard storyboard = new Storyboard();
    DoubleAnimation doubleAnimation = new DoubleAnimation();
    doubleAnimation.BeginTime = new TimeSpan(0);
    doubleAnimation.From = 1.0;
    doubleAnimation.To = 0.0;
    doubleAnimation.Duration = new Duration(TimeSpan.FromSeconds(FadeOutSeconds));
    Storyboard.SetTarget(doubleAnimation, this);
    Storyboard.SetTargetProperty(doubleAnimation, new PropertyPath(UserControl.OpacityProperty));
    storyboard.Children.Add(doubleAnimation);
    storyboard.Begin(this);
}
```

This way the FadeOutSeconds can be specified as from the view model, and it all lines up!

![FunKey Viewer](funkeyviewer.gif)

This was a fun little diversion into something that I'll probably use quite a bit now.

Check out - [Using Bing Copilot]({{< ref "/posts/2024-02-02_BingCopilot" >}} "Using Bing Copilot") for some of things it helped me with on this project!