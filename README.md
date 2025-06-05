#Popout.js
## *Web Design in one-point perspective.*


###Intro 

A client requested a website with a "retro-tech" look. Unfortunately, the client's business never saw the light of day, but I felt that the work I put into it is still interesting enough to show off. What you're looking at is a "3D layout" script. It gives elements with a class name of `pop`(configurable, see below) the appearance of receeding toward a vanishing point. 

Popout.js extends 2D HTML elements into the third dimension by projecting them toward a point on the screen(though I suppose there is nothing stopping you from defining a point *off* the screen). If you've ever taken a drawing class, you probably understand this as [one-point perspective](http://drawsketch.about.com/od/perspective/ss/1ptperspective.htm). It automatically picks up the background color of these elements and shades the sides accordingly, giving it a more realistic illusion of receeding into the depths of the screen.

This is easier to see in action than it is for me to explain:

Check it out in a simple demo [here](http://lowtolerance.github.com/Popout.js). As you can see and it handles :hover states, colors with transparency just fine.

Also, a somewhat more practical example that uses some non-default configuration options is [here](http://lowtolerance.github.com/Popout.js/generica).

As you can see, Popout.js is fairly flexible.

---------------------

###Usage

Popout.js is fairly straight-forward to include in your pages. Just add:

```html
<script src="js/init.js" type="text/javascript"></script>	
<script src="js/popout.js" type="text/javascript"></script>
```


By default, Popout.js will look for any elements with a classname of 'pop' and style them accordingly. You can override this classname and other variables by modifying the `init.js` script.

####Configuration variables include:

**canvasID** - Declare ID to give injected Canvas element. Default is `depth`.  
**popoutSelector** - Class name to targer. Default is `pop`.  
**gradientStop** - Adjust gradient. Higher values = darker gradients. Default is `60`.  
**stroke** - Apply a stroke to drawn shapes. Deafuls is `false`.  

####Experimental variables
These come with some caveats. You have been warned!

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

