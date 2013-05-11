var Canvas = function(id) {
	var canvas = loadCanvas(id);

	function loadCanvas(id) {

		canvas = oCanvas.create({
			canvas: id,
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
					circles[x].y = calculateYCoordinate(this.points[x], min, max, h);
					circles[x].redraw();
				} else {
					circles[x] = this.display.ellipse({
						x: 10 + x * interval + interval * 0.5,
						y: calculateYCoordinate(this.points[x], min, max, h),
						radius_x: 1,
						radius_y: 1,
						fill: "#0370ea"
					});
					this.addChild(circles[x]);
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
							stroke: "3px #0370ea",
							cap: "round"
						});
						this.addChild(lines[x - 1]);
					}
				}
			}
		}).start();
		canvas.startAddPoints = function() {
			if (this.stock) {
				var c = this;
				this.int = window.setInterval(function() {
					if (c.stock.data.LastTradePriceOnly) {
						c.points.push(parseFloat(c.stock.data.LastTradePriceOnly));
					}
				}, 2000);
			}
		};
		canvas.stopAddPoints = function() {
			window.clearInterval(this.int);
		};
		return canvas;
	}
	// Utility Functions

	function calculateYCoordinate(y, min, max, h) {
		if (max - min === 0) {
			return (h - 430) / 2 + 400;
		} else {
			return ((1 - (y - min) / (max - min))) * (h - 430) + 400;
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
};