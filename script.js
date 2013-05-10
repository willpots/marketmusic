var stock;
var m;
var canvas;
var circles = [];
var lines = [];
var prices = new Array();
$(document).ready(function() {
	stock = new Stock();
	m = new MusicBox();

	stock.addListener("loaded", function() {
		if (this.data) {
			$("#name").html(this.data.Name);
			$("#change").html(this.data.PercentChange);
			prices.push(new Array(Date.now(), this.data.Price));
		}
	});
	$("#stock").keypress(function(e) {
		if (e.charCode == 13) {
			console.log("Loading " + this.value);
			this.value = this.value.toUpperCase();
			stock.setTicker(this.value);
			stock.fetchQuote();
			prices = new Array();
		}
	});
	$("#start").click(function(e) {
		stock.startFetching();
		m.startPlaying(stock);
		m.mute(false);
	});
	$("#stop").click(function(e) {
		stock.stopFetching();
		m.stopPlaying();
		m.mute(true);
	});

	loadCanvas();
});

function loadCanvas() {

	canvas = oCanvas.create({
		canvas: "#canvas",
		background: "#333"
	});
	stock.setCanvas(canvas);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.points = [];
	canvas.setLoop(function() {
		var h = window.innerHeight;
		var w = window.innerWidth;
		var max = minMax(this.points).max;
		var min = minMax(this.points).min;
		var interval = (w - 20) / this.points.length;
		for (var x = 0; x < this.points.length; x++) {
			if (circles[x]) {
				circles[x].x = 10 + x * interval + interval * 0.5;
				circles[x].y = calculateYCoordinate(this.points[x],min,max,h);
				circles[x].redraw();
			} else {
				circles[x] = this.display.ellipse({
					x: 10 + x * interval + interval * 0.5,
					y: calculateYCoordinate(this.points[x],min,max,h),
					radius_x: 3,
					radius_y: 3,
					fill: "#f00"
				});
				canvas.addChild(circles[x]);
			}
			if (lines[x - 1]) {
				if (circles[x - 1]) {
					lines[x - 1].start = {
						x: circles[x - 1].x,
						y: circles[x - 1].y
					};
					lines[x - 1].end = {
						x: circles[x].x,
						y: circles[x].y
					};
					lines[x - 1].redraw();
				}
			} else {
				if (circles[x - 1]) {
					lines[x - 1] = this.display.line({
						start: {
							x: circles[x - 1].x,
							y: circles[x - 1].y
						},
						end: {
							x: circles[x].x,
							y: circles[x].y
						},
						stroke: "3px #f00",
						cap: "round"
					});
					canvas.addChild(lines[x - 1]);
				}
			}
		}
	}).start();
	canvas.startAddPoints = function() {
		if (this.stock) {
			var c = this;
			this.int = window.setInterval(function() {
				if (c.stock.data.LastTradePriceOnly) {
					c.points.push(parseInt(c.stock.data.LastTradePriceOnly));
				}
			}, 1000);
		}
	};
	canvas.stopAddPoints = function() {
		window.clearInterval(this.int);
	};
}
// Utility Functions

function calculateYCoordinate(y,min,max,h) {
	if(max - min == 0) {
		return (h-430)/2 + 400;
	} else {
		return ((y - min) / (max - min)) * (h - 430) + 400;
	}
}
function minMax(arr) {
	var r = {
		min: null,
		max: null
	};
	for (var p = 0; p < arr.length; p++) {
		if (!r.min || arr[p] < r.min) {
			r.min = arr[p];
		}
		if (!r.max || arr[p] > r.max) {
			r.max = arr[p];
		}
	}
	return r;
}