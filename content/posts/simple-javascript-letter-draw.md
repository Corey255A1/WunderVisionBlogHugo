---
title: "Simple JavaScript Letter Draw"
date: "2019-09-02"
summary: "JavaScript code that creates a cool letter etching animation"
thumbnail: "/images/blog/2019-09-02-Simple_JavaScript_Letter_Draw.jpg"
slug: "simple-javascript-letter-draw"
---
<p class="blog-img center md">
    [IMAGE(LetterEtch.gif)]
    <div class="center">Letter Draw</div>
</p>

I am by no means a web developer. My day job is a desktop application developer. However, I dabble in little bits of everything if it isn't obvious by my blog posts. If you have a GitHub account you can create a simple static webpage to mess around with however you want. If you checkout [https://corey255a1.github.io/](https://corey255a1.github.io/) you can see some of the little JavaScript projects I have been working on. I like the fact that you can directly draw on a canvas. With JavaScript and HTML you can code pretty much anything you can think of with minimal setup. Its also something I can easily do from my Chromebook. I don't think anything I do in those projects would be considered best practices for JavaScript, but hey, they work!

I had been imagining letters being drawn out line by line sort of like it was being laser cut. The HTML for this project is very simple.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #557799">&lt;!DOCTYPE html&gt;</span>
<span style="color: #007700">&lt;html</span> <span style="color: #0000CC">lang=</span><span style="background-color: #fff0f0">"en"</span><span style="color: #007700">&gt;</span>
<span style="color: #007700">&lt;head&gt;</span>
    <span style="color: #007700">&lt;meta</span> <span style="color: #0000CC">charset=</span><span style="background-color: #fff0f0">"UTF-8"</span><span style="color: #007700">&gt;</span>
    <span style="color: #007700">&lt;title&gt;</span>WunderVision Letter Etch<span style="color: #007700">&lt;/title&gt;</span>
<span style="color: #007700">&lt;/head&gt;</span>
<span style="color: #007700">&lt;body&gt;</span>
    <span style="color: #007700">&lt;input</span> <span style="color: #0000CC">type=</span><span style="background-color: #fff0f0">"text"</span> <span style="color: #0000CC">id=</span><span style="background-color: #fff0f0">"words"</span><span style="color: #007700">&gt;</span>
    <span style="color: #007700">&lt;button</span> <span style="color: #0000CC">onclick=</span><span style="background-color: #fff0f0">"startDrawing()"</span><span style="color: #007700">&gt;</span>Draw<span style="color: #007700">&lt;/button&gt;&lt;button</span> <span style="color: #0000CC">onclick=</span><span style="background-color: #fff0f0">"increaseSize()"</span><span style="color: #007700">&gt;</span>INC<span style="color: #007700">&lt;/button&gt;&lt;button</span> <span style="color: #0000CC">onclick=</span><span style="background-color: #fff0f0">"decreaseSize()"</span><span style="color: #007700">&gt;</span>dec<span style="color: #007700">&lt;/button&gt;&lt;br&gt;</span>
    <span style="color: #007700">&lt;canvas</span> <span style="color: #0000CC">id=</span><span style="background-color: #fff0f0">"draw"</span> <span style="color: #0000CC">width=</span><span style="background-color: #fff0f0">"800"</span> <span style="color: #0000CC">height=</span><span style="background-color: #fff0f0">"640"</span><span style="color: #007700">&gt;&lt;/canvas&gt;</span>
    <span style="color: #007700">&lt;script </span><span style="color: #0000CC">src=</span><span style="background-color: #fff0f0">"LetterEtch.js"</span><span style="color: #007700">&gt;&lt;/script&gt;</span>
<span style="color: #007700">&lt;/body&gt;</span>
<span style="color: #007700">&lt;/html&gt;</span>
</pre></div>

A input box for the words to etch, a button to draw it, buttons for increasing and decreasing the size, the canvas for drawing and the reference to the JavaScript. Simple!

I wanted the letters to be drawn at arbitrary sizes, so my design involved thinking of the letters as vectors in a (0-1, 0-1) = (x,y) square. Remember in computer graphics (0,0) is the top-left corner of the region. So the letter C would be (1,0) (right, top) to (0,0) (left, top) to (0, 1) (left, bottom) to (1, 1) (right, bottom). This allows it to be scaled to any size simply by multiplying it by the size!

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">function</span> Letter()
{
    <span style="color: #008800; font-weight: bold">const</span> self <span style="color: #333333">=</span> <span style="color: #008800; font-weight: bold">this</span>;
    self.LineDefs<span style="color: #333333">=</span>[];
    self.LastX <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">0</span>;
    self.LastY <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">0</span>;
    self.AddLine <span style="color: #333333">=</span> <span style="color: #008800; font-weight: bold">function</span>(x1,y1,x2,y2){
        self.LineDefs.push({X1<span style="color: #333333">:</span>x1,Y1<span style="color: #333333">:</span>y1,X2<span style="color: #333333">:</span>x2,Y2<span style="color: #333333">:</span>y2})
        self.LastX <span style="color: #333333">=</span> x2;
        self.LastY <span style="color: #333333">=</span> y2;
        <span style="color: #008800; font-weight: bold">return</span> self;
    }
    self.NextLine <span style="color: #333333">=</span> <span style="color: #008800; font-weight: bold">function</span>(x2,y2){
        self.LineDefs.push({X1<span style="color: #333333">:</span>self.LastX,Y1<span style="color: #333333">:</span>self.LastY,X2<span style="color: #333333">:</span>x2,Y2<span style="color: #333333">:</span>y2})
        self.LastX <span style="color: #333333">=</span> x2;
        self.LastY <span style="color: #333333">=</span> y2;
        <span style="color: #008800; font-weight: bold">return</span> self;
    }
    
    self.GetLines <span style="color: #333333">=</span> <span style="color: #008800; font-weight: bold">function</span>(x,y,w,h){
        <span style="color: #008800; font-weight: bold">var</span> ret <span style="color: #333333">=</span> [];
        <span style="color: #008800; font-weight: bold">for</span>(<span style="color: #008800; font-weight: bold">var</span> l <span style="color: #008800; font-weight: bold">in</span> self.LineDefs){
            <span style="color: #008800; font-weight: bold">var</span> line <span style="color: #333333">=</span>self.LineDefs[l];
            ret.push({
                startX<span style="color: #333333">:</span>(x <span style="color: #333333">+</span> w<span style="color: #333333">*</span>line.X1),
                startY<span style="color: #333333">:</span>(y <span style="color: #333333">+</span> h<span style="color: #333333">*</span>line.Y1),
                endX<span style="color: #333333">:</span>(x <span style="color: #333333">+</span> w<span style="color: #333333">*</span>line.X2),
                endY<span style="color: #333333">:</span>(y <span style="color: #333333">+</span> h<span style="color: #333333">*</span>line.Y2)
            });
        }
        <span style="color: #008800; font-weight: bold">return</span> ret;
    }
    
    <span style="color: #008800; font-weight: bold">return</span> self;
};
</pre></div>

In older JavaScript the way to make a "class" is to define a function. There are some weird scoping things that happen with "this" which is why in most of my little projects my class sets self to this at the top. This ensures if I'm using self, it is what I think it is. The LastX and LastY values are for storing the end point of the last line that was added. This makes it easier when defining a letter to just add the next line based on the last line. GetLines takes in the x,y offset for the top left corner and the width and height of the letter. Then it generates a new list of all of the lines at their offset and scale.

The NextLine and AddLine functions return itself so that the calls can be chained together. You will see in a minute.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">function</span> DrawLetter(lines){
    <span style="color: #008800; font-weight: bold">const</span> self <span style="color: #333333">=</span> <span style="color: #008800; font-weight: bold">this</span>;
    self.Speed <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">20</span>;
    self.Lines <span style="color: #333333">=</span> lines;
    self.lineIdx <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">0</span>;
    self.lineCount <span style="color: #333333">=</span> self.Lines.length;
    self.currentLine <span style="color: #333333">=</span> self.Lines[self.lineIdx];
    self.currentStep <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">1</span>;
    self.dstep <span style="color: #333333">=</span> <span style="color: #007020">Math</span>.floor(distance(self.currentLine)<span style="color: #333333">/</span>self.Speed);
    <span style="color: #008800; font-weight: bold">if</span>(self.dstep<span style="color: #333333">&lt;=</span><span style="color: #0000DD; font-weight: bold">0</span>) self.dstep<span style="color: #333333">=</span><span style="color: #0000DD; font-weight: bold">1</span>;
    self.xStep <span style="color: #333333">=</span> (self.currentLine.endX <span style="color: #333333">-</span> self.currentLine.startX)<span style="color: #333333">/</span>self.dstep;
    self.yStep <span style="color: #333333">=</span> (self.currentLine.endY <span style="color: #333333">-</span> self.currentLine.startY)<span style="color: #333333">/</span>self.dstep;
    self.sx <span style="color: #333333">=</span> self.currentLine.startX;
    self.sy <span style="color: #333333">=</span> self.currentLine.startY;
    self.ex <span style="color: #333333">=</span> self.sx;
    self.ey <span style="color: #333333">=</span> self.sy;
    self.DrawNext <span style="color: #333333">=</span> <span style="color: #008800; font-weight: bold">function</span>(ctx){
        ctx.beginPath();
        ctx.moveTo(self.sx, self.sy);
        ctx.lineTo(self.sx<span style="color: #333333">+</span>self.xStep, self.sy<span style="color: #333333">+</span>self.yStep);
        ctx.stroke();
        
        <span style="color: #008800; font-weight: bold">if</span>(self.currentStep<span style="color: #333333">&lt;</span>self.dstep){
            self.currentStep<span style="color: #333333">++</span>;
            self.sx <span style="color: #333333">=</span> self.sx <span style="color: #333333">+</span> self.xStep;
            self.sy <span style="color: #333333">=</span> self.sy <span style="color: #333333">+</span> self.yStep;
        }
        <span style="color: #008800; font-weight: bold">else</span>
        {
            self.lineIdx<span style="color: #333333">++</span>;
            <span style="color: #008800; font-weight: bold">if</span>(self.lineIdx <span style="color: #333333">&lt;</span> self.lineCount){
                self.currentLine <span style="color: #333333">=</span> self.Lines[self.lineIdx];
                self.dstep <span style="color: #333333">=</span> <span style="color: #007020">Math</span>.floor(distance(self.currentLine)<span style="color: #333333">/</span>self.Speed);
                <span style="color: #008800; font-weight: bold">if</span>(self.dstep<span style="color: #333333">&lt;=</span><span style="color: #0000DD; font-weight: bold">0</span>) self.dstep<span style="color: #333333">=</span><span style="color: #0000DD; font-weight: bold">1</span>;
                self.xStep <span style="color: #333333">=</span> (self.currentLine.endX <span style="color: #333333">-</span> self.currentLine.startX)<span style="color: #333333">/</span>self.dstep;
                self.yStep <span style="color: #333333">=</span> (self.currentLine.endY <span style="color: #333333">-</span> self.currentLine.startY)<span style="color: #333333">/</span>self.dstep;
                self.currentStep <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">1</span>;
                self.sx <span style="color: #333333">=</span> self.currentLine.startX;
                self.sy <span style="color: #333333">=</span> self.currentLine.startY;
            }
            <span style="color: #008800; font-weight: bold">else</span>
            {
                <span style="color: #008800; font-weight: bold">return</span> <span style="color: #008800; font-weight: bold">false</span>;
            }
        }
        <span style="color: #008800; font-weight: bold">return</span> <span style="color: #008800; font-weight: bold">true</span>;
    }
};
</pre></div>

The DrawLetter "class" takes care of splitting up the lines into smaller lines. On each call to the DrawNext function it draws the next line segment of the current line of the letter that it represents. If the letter is finished, it returns false, otherwise it returns true. This is what gives it the drawing/etching effect.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%">AllLetters <span style="color: #333333">=</span> {
A<span style="color: #333333">:</span> <span style="color: #008800; font-weight: bold">new</span> Letter()
 .AddLine(<span style="color: #6600EE; font-weight: bold">0.5</span>,<span style="color: #0000DD; font-weight: bold">0</span>,<span style="color: #0000DD; font-weight: bold">0</span>,<span style="color: #0000DD; font-weight: bold">1</span>)
 .AddLine(<span style="color: #6600EE; font-weight: bold">0.5</span>,<span style="color: #0000DD; font-weight: bold">0</span>,<span style="color: #0000DD; font-weight: bold">1</span>,<span style="color: #0000DD; font-weight: bold">1</span>)
 .AddLine(<span style="color: #0000DD; font-weight: bold">0</span>,<span style="color: #6600EE; font-weight: bold">0.5</span>,<span style="color: #0000DD; font-weight: bold">1</span>,<span style="color: #6600EE; font-weight: bold">0.5</span>),

B<span style="color: #333333">:</span> <span style="color: #008800; font-weight: bold">new</span> Letter()
  .AddLine(<span style="color: #0000DD; font-weight: bold">0</span>,<span style="color: #0000DD; font-weight: bold">0</span>, <span style="color: #6600EE; font-weight: bold">0.7</span>,<span style="color: #0000DD; font-weight: bold">0</span>)
  .NextLine(<span style="color: #0000DD; font-weight: bold">1</span>,<span style="color: #6600EE; font-weight: bold">0.2</span>)
  .NextLine(<span style="color: #6600EE; font-weight: bold">0.7</span>,<span style="color: #6600EE; font-weight: bold">0.4</span>)
  .NextLine(<span style="color: #6600EE; font-weight: bold">0.4</span>,<span style="color: #6600EE; font-weight: bold">0.5</span>)
  .NextLine(<span style="color: #6600EE; font-weight: bold">0.4</span>,<span style="color: #6600EE; font-weight: bold">0.5</span>)
  .NextLine(<span style="color: #6600EE; font-weight: bold">0.7</span>,<span style="color: #6600EE; font-weight: bold">0.6</span>)
  .NextLine(<span style="color: #0000DD; font-weight: bold">1</span>,<span style="color: #6600EE; font-weight: bold">0.8</span>)
  .NextLine(<span style="color: #6600EE; font-weight: bold">0.7</span>, <span style="color: #0000DD; font-weight: bold">1</span>)
  .NextLine(<span style="color: #0000DD; font-weight: bold">0</span>, <span style="color: #0000DD; font-weight: bold">1</span>)
  .NextLine(<span style="color: #0000DD; font-weight: bold">0</span>,<span style="color: #0000DD; font-weight: bold">0</span>),
  
C<span style="color: #333333">:</span> <span style="color: #008800; font-weight: bold">new</span> Letter()
    .AddLine(<span style="color: #0000DD; font-weight: bold">1</span>,<span style="color: #0000DD; font-weight: bold">0</span>, <span style="color: #0000DD; font-weight: bold">0</span>,<span style="color: #0000DD; font-weight: bold">0</span>)
    .NextLine(<span style="color: #0000DD; font-weight: bold">0</span>,<span style="color: #0000DD; font-weight: bold">1</span>)
    .NextLine(<span style="color: #0000DD; font-weight: bold">1</span>,<span style="color: #0000DD; font-weight: bold">1</span>),
</pre></div>

I then created an object of all capital letters of the alphabet. I suppose I could have made it take a list of objects and parse that rather than the addline/nextline syntax, but there are a million ways to skin a cat.

<div style="background: #ffffff; overflow:auto;width:auto;border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;"><pre style="margin: 0; line-height: 125%"><span style="color: #008800; font-weight: bold">var</span> letters <span style="color: #333333">=</span> [];
<span style="color: #008800; font-weight: bold">var</span> xidx <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">5</span>;
<span style="color: #008800; font-weight: bold">var</span> yidx <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">5</span>;
<span style="color: #008800; font-weight: bold">var</span> size <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">20</span>;

ctx.strokeStyle<span style="color: #333333">=</span><span style="background-color: #fff0f0">'rgb(0,0,255)'</span>;

<span style="color: #008800; font-weight: bold">var</span> currentLetter <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">0</span>;
<span style="color: #008800; font-weight: bold">var</span> letterCount <span style="color: #333333">=</span> letters.length;

<span style="color: #008800; font-weight: bold">function</span> Update()
{
    <span style="color: #008800; font-weight: bold">if</span>(<span style="color: #333333">!</span>letters[currentLetter].DrawNext(ctx))
    {
        currentLetter<span style="color: #333333">++</span>;
        <span style="color: #008800; font-weight: bold">if</span>(currentLetter<span style="color: #333333">&lt;</span>letterCount)
        {
            <span style="color: #007020">window</span>.requestAnimationFrame(Update);
        }
    }
    <span style="color: #008800; font-weight: bold">else</span>{
        <span style="color: #007020">window</span>.requestAnimationFrame(Update);
    }
};

<span style="color: #008800; font-weight: bold">function</span> startDrawing()
{
    ctx.clearRect(<span style="color: #0000DD; font-weight: bold">0</span>,<span style="color: #0000DD; font-weight: bold">0</span>,Width, Height);
    <span style="color: #008800; font-weight: bold">var</span> chars <span style="color: #333333">=</span> textbox.value.toUpperCase();
    letters <span style="color: #333333">=</span> [];
    xidx <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">5</span>;
    yidx <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">5</span>;
    <span style="color: #008800; font-weight: bold">for</span>(<span style="color: #008800; font-weight: bold">var</span> a <span style="color: #008800; font-weight: bold">in</span> chars){
        <span style="color: #008800; font-weight: bold">if</span>(<span style="color: #000000; background-color: #fff0ff">/^([A-Z])$/</span>.test(chars[a])){
            letters.push(<span style="color: #008800; font-weight: bold">new</span> DrawLetter(AllLetters[chars[a]].GetLines(xidx,yidx, size, size)));
        }
        <span style="color: #008800; font-weight: bold">else</span> <span style="color: #008800; font-weight: bold">if</span>(chars[a] <span style="color: #333333">==</span> <span style="background-color: #fff0f0">"-"</span>){
            xidx <span style="color: #333333">=</span> <span style="color: #333333">-</span>size;
            yidx <span style="color: #333333">+=</span> size<span style="color: #333333">+</span><span style="color: #0000DD; font-weight: bold">5</span>;
        }
        xidx <span style="color: #333333">+=</span> size<span style="color: #333333">+</span><span style="color: #0000DD; font-weight: bold">5</span>;
        <span style="color: #008800; font-weight: bold">if</span>(xidx <span style="color: #333333">&gt;</span> Width){
            xidx <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">5</span>;
            yidx <span style="color: #333333">+=</span> size<span style="color: #333333">+</span><span style="color: #0000DD; font-weight: bold">5</span>;
        }
    }
    letterCount <span style="color: #333333">=</span> letters.length
    currentLetter <span style="color: #333333">=</span> <span style="color: #0000DD; font-weight: bold">0</span>;
    Update();
};
</pre></div>

When the Draw button is clicked, the startDrawing function is called. I get the value from the text box and make it all uppercase. Then loop through each character. The /^([A-Z])$/.test(chars[a]) is testing if the character matches the regex. In this case I'm checking if it is A-Z. If it is, I use that character to get the letter from the AllLetters object. JavaScript allows you to get variables from the object using strings. I call the GetLines to get a list of lines that are scaled and offset and create a new DrawLetter to handle it. I suppose I could have reused the same DrawLetter over and over. I handled the special - character case and skip a row down. Else if the character doesn't match anything we just skip it. Then we call the Update(); Update() calls the DrawNext on the current letter until the letter is done and calls the requestAnimationFrame to keep the loop going until all letters are done. 

And that's it, you have a pretty cool letter etching effect!

Check it Out here! [https://corey255a1.github.io/LetterEtch/LetterEtch.html](https://corey255a1.github.io/LetterEtch/LetterEtch.html)

