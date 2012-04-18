//Configure Popout by defining these properties. Default values will be used where none are defined.
//Note: If defining midPoint, BOTH 'x' and 'y' MUST BE DEFINED.

var POPOUT_cfg = {
	
	'canvasID': 'depth',  							//ID to apply to injected canvas
	'popSelector': '.pop',							//Selector to use for targeting elements to be "popped".

	'vanishingPoint': {         					//Screen position to use as vanishing point.
		'x': Math.round($(document).width() / 2),   //If overriding defaults, X & Y must BOTH be declared
		'y': Math.round($(document).height() /2)
	},

	'gradientStop': 60,								//Color stop adjustment.
	'stroke': true									//Apply stroke effect?
}