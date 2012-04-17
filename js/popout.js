//Determine our 4 corner coordinates based off the given dimensions and offsets.
function getCornerVals(width,height,left,top){
	var corner = new Array (4);
	for (i=0;i<4;i++)
		corner[i] = new Array(2);
	corner[0][0] = left;
	corner[0][1] = top;
	corner[1][0] = left+width;
	corner[1][1] = top;
	corner[2][0] = left+width;
	corner[2][1] = top+height;
	corner[3][0] = left;
	corner[3][1] = top+height;
	return corner; 
}

//Retrieves and calculates dimensions and offsets of our divs as well as determine what
//faces get drawn.
function getElemProperties(nThis,midPoint) {
	//TODO-Look into replacing jQuery reliance.
	this.width = Math.round($(nThis).outerWidth());
    this.height = Math.round($(nThis).outerHeight());
    offset = $(nThis).offset();
    this.left=offset.left;
    this.top=offset.top;
    this.coord = getCornerVals(this.width,this.height,this.left,this.top);
   	this.popColor=$(nThis).css("background-color");
	//Determine where corners are in relation to the mid point to
	//determine what sides should be visible.
   	if (this.coord[0][0] >= midPoint[0]) this.leftFace=true;
   	if (this.coord[1][0] < midPoint[0]) this.rightFace=true;
   	if (this.coord[0][1] > midPoint[1]) this.topFace=true;
   	if (this.coord[3][1] <= midPoint[1]) this.bottomFace=true;
	//Determine which corner is closest to the midpoint.
   	this.distance=99999999;
   	for (a=0;a<3;a++) {
   		distBuff=Math.sqrt(Math.pow(midPoint[0]-this.coord[a][0],2) +Math.pow(midPoint[1]-this.coord[a][1],2));
   		if (distBuff < this.distance) this.distance = distBuff;
   	}  			
}

//Set up our canvas and draw each side. Additionally, set our gradient fill.
function drawFace(coord, mid, popColor,gs,x1,x2,side) {
	//Gradients in our case run either up/down or left right.
	//We have two algorithms depending on whether or not it's a sideways facing piece.
	//Rather than parse the "rgb(r,g,b)" string(popColor) retrieved from elsewhere, it is simply
	//offset with the gs variable to give the illusion that it starts at a darker color.
	var canvas = document.getElementById('depth');
	//This is for excanvas.js
	var G_vmlCanvasManager;
	if (G_vmlCanvasManager != undefined) { // ie IE
                G_vmlCanvasManager.initElement(canvas);
        }
	//Init canvas
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d'); 
		if (side) var lineargradient=ctx.createLinearGradient(coord[x1][0]+gs,mid[1],mid[0],mid[1]);
		else var lineargradient=ctx.createLinearGradient(coord[0][0],coord[2][1]+gs,coord[0][0],mid[1]);
		lineargradient.addColorStop(0,popColor);
		lineargradient.addColorStop(1,'black');
		ctx.fillStyle=lineargradient;
		ctx.beginPath();
		//Draw from one corner to the midpoint, then to the other corner, and apply a stroke and a fill.
		ctx.moveTo(coord[x1][0],coord[x1][1]);
		ctx.lineTo(mid[0],mid[1]);
		ctx.lineTo(coord[x2][0],coord[x2][1]);
		ctx.stroke();
		ctx.fill();
	}
}

//Pretty self-explanatory.
function clearCanvas() {
	var canvas = document.getElementById('depth');
	var G_vmlCanvasManager;
	if (G_vmlCanvasManager != undefined) { // ie IE
                G_vmlCanvasManager.initElement(canvas);
        }
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,$(document).width(),$(document).height());
	}
}

//Sort our array of elements to be drawn using the Painter's algorithm.
//Draws objects from furthest out to closest in.
function sortByDistance(a,b) {
	var x = a.distance;
	var y = b.distance;
	return ((x < y) ? 1 : ((x > y) ? -1  : 0));
}

//Our main function. Loops through each element given the "pop" class, and gets
//necessary information: offset, dimensions, color, and the midpoint of the document.
function draw(e) {
	setTimeout(function() {
		var arr = new Array()
		var i = 0;
		var mid = new Array(2);
		$(".pop").each(function() {
			mid[0]=Math.round($(document).width()/2);
			mid[1]=Math.round($(document).height()/2);
			arr[arr.length++]=new getElemProperties(this,mid);
			i++;
		});
		arr.sort(sortByDistance);
		clearCanvas();
		for (a=0;a<i;a++) {
			//In the following conditional statements, we're testing to see which direction faces should be drawn,
			//based on a 1-point perspective drawn from the midpoint. In the first statement, we're testing to see
			//if the lower-left hand corner coord[3] is higher on the screen than the midpoint. If so, we set it's gradient
			//starting position to start at a point in space 60pixels higher(-60) than the actual side, and we also
			//declare which corners make up our face, in this case the lower two corners, coord[3], and coord[2].
			if (arr[a].bottomFace) drawFace(arr[a].coord,mid,arr[a].popColor,-60,3,2);
			if (arr[a].topFace) drawFace(arr[a].coord,mid,arr[a].popColor,60,0,1);
			if (arr[a].leftFace) drawFace(arr[a].coord,mid,arr[a].popColor,60,0,3,true);
			if (arr[a].rightFace) drawFace(arr[a].coord,mid,arr[a].popColor,-60,1,2,true);
		}
	},1);
}

function getDocHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}

function getWidth(){
  	if( typeof( window.innerWidth ) == 'number' ) {
   		//Non-IE
    	this.width = window.innerWidth;
  	} 	
  	else if( document.documentElement && ( document.documentElement.clientWidth ) ) {
    	//IE 6+ in 'standards compliant mode'
		this.width = document.documentElement.clientWidth;
	} 
}

$(document).ready(function () {
	//Inject our canvas into the "background".
	//Excanvas doesn't like the way jQuery handles DOM elements, 
	//so we're using straigh DOM methods.
	d=document;
	var w=d.getElementById("wrapper");
	var divbg = d.createElement("div");
	var cvs = d.createElement("canvas");
	var size=new getWidth();
	cvs.setAttribute("width",size.width);
	cvs.setAttribute("height",getDocHeight());
	cvs.setAttribute("id","depth");
	divbg.setAttribute("id","background");
	divbg.appendChild(cvs);
	w.parentNode.insertBefore(divbg,w);
	
	//Hijax our links
	$("a.pop").attr("href","#");
	$("a.pop").click(function(){
		$(".active").removeClass('active');
        $(this).addClass('active');
		var activepage=$(".active").attr("id");
		$("#content").load(activepage+".html .loadme",draw);
		draw();
	});
	//we need to refresh the background if colors change, such as with a hover event.
	$("a.pop").bind("mouseenter mouseleave focusin focusout",draw);
	//Our canvas needs to grown with the document.
	//Again, excanvas.js doesn't like jQuery touching the DOM, so we're doing it the
	//"hard" way.
	$(window).resize(function() {
		var size=new getWidth();
		var depth=document.getElementById("depth");
		var height=$(document).height();
		var docHeight=getDocHeight();
		depth.setAttribute("width",size.width);	
		if (height < docHeight) depth.setAttribute("height",docHeight-height);
		draw()
	});
	draw();
});