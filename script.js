var stock;
var m;
var canvas;
var circles = [];
var lines = [];
var prices = [];
$(document).ready(function() {
	stock = new Stock();
	m = new MusicBox();

	stock.addListener("loaded", function() {
		if (this.data) {
			$("#name").html(this.data.Name.toLowerCase());
			$("#change").html(this.data.PercentChangePercent * 100 + "%");
			prices.push(new Array(Date.now(), this.data.Price));
		}
	});
	$("#stock").keypress(function(e) {
		if (e.charCode == 13) {
			console.log("Loading " + this.value);
			this.value = this.value.toLowerCase();
			stock.setTicker(this.value);
			stock.fetchQuote();
			prices = [];
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

	canvas = new Canvas("#canvas");
});