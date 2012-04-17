$(document).ready(function () {
	$("#wrapper").before("<div id='background'><canvas id='depth' width='"+$(window).width()+"'height='"+$(document).height()+"'></canvas></div>");
	$(window).resize(function() {
	$("#depth").attr("width",$(window).width());
	$("#depth").attr("height",$(document).height());
	});
});