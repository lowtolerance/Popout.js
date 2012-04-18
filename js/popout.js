(function (cfg) {

	"use strict";

	//Variable defaults. Better to configure these through the initialization script at js/init.js
	var config =  {
		'canvasID': cfg.canvasID || 'depth',
		'popoutSelector': cfg.popoutSelector || '.pop',
		'vanishingPoint': cfg.vanishingPoint || {
			'x': Math.round($(document).width() / 2),
			'y': Math.round($(document).height() / 2)
		},
		'height': cfg.height || Math.round($(document).height()),
		'width': cfg.width || Math.round($(document).width()),
		'gradientStop': cfg.gradientStop || 60,
		'stroke': cfg.stroke || false
	},

	//CONSTANTS - DO NOT MODIFY
		UPPER_LEFT = 0,
		UPPER_RIGHT = 1,
		LOWER_RIGHT = 2,
		LOWER_LEFT = 3,
		X = 0,
		Y = 1;


//Determine our corner coordinates based off the given dimensions and offsets.
	function getCornerVals(el) {
		var corner = new Array (4),
			i;
		for (i = 0; i < 4; i += 1) {
			corner[i] = new Array(2);
		}
		corner[UPPER_LEFT][X] = el.left;
		corner[UPPER_LEFT][Y] = el.top;
		corner[UPPER_RIGHT][X] = el.left + el.width;
		corner[UPPER_RIGHT][Y] = el.top;
		corner[LOWER_RIGHT][X] = el.left + el.width;
		corner[LOWER_RIGHT][Y] = el.top + el.height;
		corner[LOWER_LEFT][X] = el.left;
		corner[LOWER_LEFT][Y] = el.top + el.height;
		return corner;
	}

	//Retrieves and calculates dimensions and offsets of our divs as well as determine what
	//faces get drawn.
	function GetElemProperties(nThis) {

		var offset = $(nThis).offset(),
			distBuff,
			a;

		//TODO-Look into replacing jQuery reliance.
		this.width = Math.round($(nThis).outerWidth());
		this.height = Math.round($(nThis).outerHeight());
		this.left = offset.left;
		this.top = offset.top;
		this.coord = getCornerVals(this);
		this.popColor = $(nThis).css("background-color");

		//Determine where corners are in relation to the mid point to
		//determine what sides should be visible.
		if (this.coord[UPPER_LEFT][X] >= config.vanishingPoint.x) { this.leftFace = true; }
		if (this.coord[UPPER_RIGHT][X] < config.vanishingPoint.x) { this.rightFace = true; }
		if (this.coord[UPPER_LEFT][Y] > config.vanishingPoint.y) { this.topFace = true; }
		if (this.coord[LOWER_LEFT][Y] <= config.vanishingPoint.y) { this.bottomFace = true; }

		//Determine which corner is closest to the vanishingPoint.
		this.distance = 99999999;
		for (a = 0; a < 3; a += 1) {
			distBuff = Math.sqrt(Math.pow(config.vanishingPoint.x - this.coord[a][X], 2) + Math.pow(config.vanishingPoint.y - this.coord[a][Y], 2));
			if (distBuff < this.distance) {
				this.distance = distBuff;
			}
		}
	}

	//Set up our canvas and draw each side. Additionally, set our gradient fill.
	function drawFace(coord, popColor, x1, x2, side) {
		//Gradients in our case run either up/down or left right.
		//We have two algorithms depending on whether or not it's a sideways facing piece.
		//Rather than parse the "rgb(r,g,b)" string(popColor) retrieved from elsewhere, it is simply
		//offset with the config.gradientStop variable to give the illusion that it starts at a darker color.
		var canvas = document.getElementById(config.canvasID),
			G_vmlCanvasManager,
			ctx,
			lineargradient;

		//This bit is to make exCanvas happy.
		if (G_vmlCanvasManager !== undefined) { // ie IE
			G_vmlCanvasManager.initElement(canvas);
		}
		//Init canvas
		if (canvas.getContext) {
			ctx = canvas.getContext('2d');
			if (side) {
				lineargradient = ctx.createLinearGradient(
					coord[x1][X] + config.gradientStop,
					config.vanishingPoint.y,
					config.vanishingPoint.x,
					config.vanishingPoint.y
				);
			} else {
				lineargradient = ctx.createLinearGradient(
					coord[UPPER_LEFT][X],
					coord[LOWER_RIGHT][Y] + config.gradientStop,
					coord[UPPER_LEFT][X],
					config.vanishingPoint.y
				);
			}
			lineargradient.addColorStop(0, popColor);
			lineargradient.addColorStop(1, 'black');
			ctx.fillStyle = lineargradient;
			ctx.beginPath();
			//Draw from one corner to the vanishingPoint, then to the other corner, and apply a stroke and a fill.
			ctx.moveTo(coord[x1][X], coord[x1][Y]);
			ctx.lineTo(config.vanishingPoint.x, config.vanishingPoint.y);
			ctx.lineTo(coord[x2][X], coord[x2][Y]);
			if (config.stroke) { ctx.stroke(); }
			ctx.fill();
		}
	}

	//Pretty self-explanatory.
	function clearCanvas() {
		var canvas = document.getElementById(config.canvasID),
			G_vmlCanvasManager,
			ctx;

		if (G_vmlCanvasManager !== undefined) { // ie IE
			G_vmlCanvasManager.initElement(canvas);
		}
		if (canvas.getContext) {
			ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, config.width, config.height);
		}
	}

	//Sort our array of elements to be drawn using the Painter's algorithm.
	//Draws objects from furthest out to closest in.
	function sortByDistance(a, b) {
		var x = a.distance,
			y = b.distance;

		return ((x < y) ? 1 : ((x > y) ? -1  : 0));
	}

	//Our main function. Loops through each element given the "pop" class, and gets
	//necessary information: offset, dimensions, color, and the vanishingPoint of the document.
	function draw() {

		var elements = [],
			isSide = true,
			i = 0,
			a;

		$(config.popoutSelector).each(function () {
			elements[elements.length += 1] = new GetElemProperties(this);
			i += 1;
		});
		elements.sort(sortByDistance);
		clearCanvas();

		for (a = 0; a < i; a += 1) {

			//In the following conditional statements, we're testing to see which direction faces should be drawn,
			//based on a 1-point perspective drawn from the vanishingPoint. In the first statement, we're testing to see
			//if the lower-left hand corner coord[3] is higher on the screen than the vanishingPoint. If so, we set it's gradient
			//starting position to start at a point in space 60pixels higher(-60) than the actual side, and we also
			//declare which corners make up our face, in this case the lower two corners, coord[3], and coord[2].


			if (elements[a].bottomFace) {
				drawFace(
					elements[a].coord,
					elements[a].popColor,
					LOWER_LEFT,
					LOWER_RIGHT
				);
			}
			if (elements[a].topFace) {
				drawFace(
					elements[a].coord,
					elements[a].popColor,
					UPPER_LEFT,
					UPPER_RIGHT
				);
			}
			if (elements[a].leftFace) {
				drawFace(
					elements[a].coord,
					elements[a].popColor,
					UPPER_LEFT,
					LOWER_LEFT,
					isSide
				);
			}
			if (elements[a].rightFace) {
				drawFace(
					elements[a].coord,
					elements[a].popColor,
					UPPER_RIGHT,
					LOWER_RIGHT,
					isSide
				);
			}
		}
	}

	function getDocHeight() {
		var D = document;
		return Math.max(
			Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
			Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
			Math.max(D.body.clientHeight, D.documentElement.clientHeight)
		);
	}

	function GetWidth() {
		if (typeof (window.innerWidth) === 'number') {
			//Non-IE
			this.width = window.innerWidth;
		} else if (document.documentElement && (document.documentElement.clientWidth)) {
			//IE 6+ in 'standards compliant mode'
			this.width = document.documentElement.clientWidth;
		}
		return this.width;
	}

	$(document).ready(function () {
		//Inject our canvas into the "background".
		//Excanvas doesn't like the way jQuery handles DOM elements, 
		//so we're using straigh DOM methods.
		var d = document,
			w = d.getElementById("wrapper"),
			divbg = d.createElement("div"),
			cvs = d.createElement("canvas"),
			size = new GetWidth();

		cvs.setAttribute("width", size.width);
		cvs.setAttribute("height", getDocHeight());
		cvs.setAttribute("id", config.canvasID);
		divbg.setAttribute("id", "background");
		divbg.appendChild(cvs);
		w.parentNode.insertBefore(divbg, w);

		//Hijax our links
		$("a" + config.popoutSelector).attr("href", "#");
		$("a" + config.popoutSelector).click(function () {
			$(".active").removeClass('active');
			$(this).addClass('active');
			var activepage = $(".active").attr("id");
			$("#content").load(activepage + ".html .loadme", draw);
			draw();
		});

		//we need to refresh the background if colors change, such as with a hover event.
		$("a.pop").bind("mouseenter mouseleave focusin focusout", draw);
		//Our canvas needs to grown with the document.
		//Again, excanvas.js doesn't like jQuery touching the DOM, so we're doing it the
		//"hard" way.
		$(window).resize(function () {
			var size = new GetWidth(),
				depth = document.getElementById(config.canvasID),
				docHeight = getDocHeight();


			depth.setAttribute("width", size.width);
			if (config.height < docHeight) {
				depth.setAttribute("height", docHeight - config.height);
			}
			draw();
		});
		draw();
	});
}(POPOUT_cfg));