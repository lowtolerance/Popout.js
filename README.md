#Popout.js
## *Web Design in one-point perspective.*


###Intro 

A client requested a website with a "retro-tech" look. Unfortunately, the client's business never saw the light of day, but I felt that the work I put into it is still interesting enough to show off. What you're looking at is a "3D layout" script. It injects a window-sized canvas element into the page, and it treats HTML elements as if they were being seen top-down in a one-point perspective.

The code could very likely use some cleanup(and I'm still interested enough in it that I may very well revisit it at some time in the future), but the foundation is there and working rather well.

You can see it action [here](http://lowtolerance.github.com/Popout.js)(and also a somewhat more practical example [here](http://lowtolerance.github.com/Popout.js/generica)).

---------------------

###Usage

Popout.js is fairly straight-forward to include in your pages. Just add:

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
<script src="js/init.js" type="text/javascript"></script>	
<script src="js/popout.js" type="text/javascript"></script>
```

to the bottom of your pages. By default, Popout.js will look for any elements with a classname of 'pop' and style them accordingly. You can override this classname and other variables by modifying the `init.js` script.

Configuration variables include:

**canvasID** - Declare ID to give injected Canvas element. Default is `depth`.
**popoutSelector** - Class name to targer. Default is `pop`.
**gradientStop** - Adjust gradient. Higher values = darker gradients. Default is `60`.
**stroke** - Apply a stroke to drawn shapes. Deafuls is `false`.

There are also some experimental configuration variables, but they come with some caveats:

**height** - Declare canvas height. By default, the canvas is window-sized, and will resize along with the window. *Overriding the default will set a static the canvas element to a static height.*
**noSides** - Only draw top and bottom faces, ignoring the right and left sides. Default is `false`.
**vanishingPoint** - Declare an alternate vanishing point, in the format:

```javascript
'vanishingPoint': {
	'x': 100,
	'y': 200
}
```

Both `x` and `y` must be declared together. By default, `vanishingPoint.x` & `vanishingPoint.y` are set to the center of the window, and it is recalculated if the window is resized. Overriding this will result in a static vanishing point.



