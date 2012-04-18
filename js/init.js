//Configure Popout by defining these properties. Default values will be used where none are defined.
//Note: If defining midPoint, BOTH 'x' and 'y' MUST BE DEFINED.

var POPOUT_cfg = {
	
	'canvasID': 'depth',  							//ID to apply to injected canvas
	'popSelector': '.pop',							//Selector to use for targeting elements to be "popped".
	
	'gradientStop': 60,								//Color stop adjustment.
	'stroke': true,									//Apply stroke effect?
	

	//Unsupported properties
	//'height': 225,                                //Declare a height other than full page.
	//'vanishingPoint': {							//Declare a vanishing point other than center of the page.
	//	'x': 200,									//NOTE: You must declare both x AND y.
	//	'y': 100
	//},
	//noSides: true									//Only draw top and bottom faces.

}