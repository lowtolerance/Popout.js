//Configure Popout by defining these properties. Default values will be used where none are defined.
//Note: If defining midPoint, BOTH 'x' and 'y' MUST BE DEFINED.

var POPOUT_cfg = {
	
	'canvasID': 'depth',  							//ID to apply to injected canvas
	'popSelector': '.pop',							//Selector to use for targeting elements to be "popped".
	
	'gradientStop': 180,								//Color stop adjustment.
	'stroke': true,									//Apply stroke effect?
	

	
	'height': 225,                                //Declare a height other than full page.
	'vanishingPoint': {							//Declare a vanishing point other than center of the page.
		'x': Math.round($(document).width() / 2),									//NOTE: You must declare both x AND y.
		'y': 900,
		'recalc': false
	},
    'noSides': true,
}

document.addEventListener("DOMContentLoaded", () => {
	document.getElementsByClassName("pop").forEach(el => {
		el.addEventListener("click", function (e) {
			e.preventDefault();
			var activepage = this.id;
			document.querySelectorAll(".active").forEach(activeEl => {
				activeEl.classList.remove('active');
			});
			this.classList.add('active');
			document.getElementById("content").load(activepage + ".html .loadme");
		});
	})
});
