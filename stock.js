var Stock = function(ticker, c) {
    var stock_canvas = c || null;
    // Stock Ticker Symbol ex. "GOOG"
    ticker = ticker || "";
    this.ticker = ticker.toUpperCase();
    // Market data
    this.data = null;
    this.prev = null;
    // Holds event listeners
    this._listeners = {};
    this.fetching = false;
    this.addListener("loaded", function() {
        if(this.fetching === true) {
            this.fetchQuote();
        }
    });
};


// Canvas utility functions
Stock.prototype.setCanvas = function(c) {
    stock_canvas = c;
    stock_canvas.stock = this;
};
Stock.prototype.getCanvas = function() {
    return stock_canvas;
};
Stock.prototype.setTicker = function(t) {
    this.ticker = t;
    if(stock_canvas) {
        stock_canvas.points = [];
    }
};



// Fetches the most recent market information from markitondemand.com
Stock.prototype.fetchQuote = function(){
    var stock = this;
    $.ajax({
        type: 'GET',
        async: false,
        url: 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20(%22'+stock.ticker+'%22)%0A%09%09&format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=process',
        jsonp: true,
        contentType: "application/json",
        dataType: 'jsonp',
        jsonpCallback: "process"
    }).done(function(data) {
        stock.prev = stock.data;
        if(data.query.results) {
            stock.data = data.query.results.quote;
            if(stock.data.PercentChange) {
                stock.data.PercentChangeNumber = stock.data.PercentChange.replace("+","").replace("%","") / 100;
                stock.data.PercentChangePercent = stock.data.PercentChange.replace("+","").replace("%","");
            } else if (stock.data.Change) {
                stock.data.PercentChangeNumber = stock.data.Change.replace("+","").replace("%","") / ((parseInt(stock.data.LastTradePriceOnly) * 2 + parseInt(stock.data.Change.replace("+","").replace("%","")))/2);
                stock.data.PercentChangePercent = stock.data.Change.replace("+","").replace("%","") / ((parseInt(stock.data.LastTradePriceOnly) * 2 + parseInt(stock.data.Change.replace("+","").replace("%","")))/2) * 100;
            }
        }
        // console.log(data);
    }).fail(function(xhr, text) {
        console.log(text);
    }).always(function() {
        stock.fire("loaded");
    });
};

// Event listener code pulled from here
// http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/
Stock.prototype.addListener =  function(type, listener){
    if (typeof this._listeners[type] == "undefined"){
        this._listeners[type] = [];
    }

    this._listeners[type].push(listener);
};
// Trigger a particular event
Stock.prototype.fire = function(event){
    if (typeof event == "string"){
        event = { type: event };
    }
    if (!event.target){
        event.target = this;
    }

    if (!event.type){  //falsy
        throw new Error("Event object missing 'type' property.");
    }

    if (this._listeners[event.type] instanceof Array){
        var listeners = this._listeners[event.type];
        for (var i=0, len=listeners.length; i < len; i++){
            listeners[i].call(this, event);
        }
    }
};
Stock.prototype.removeListener = function(type, listener){
    if (this._listeners[type] instanceof Array){
        var listeners = this._listeners[type];
        for (var i=0, len=listeners.length; i < len; i++){
            if (listeners[i] === listener){
                listeners.splice(i, 1);
                break;
            }
        }
    }
};

// TODO METHODS
// Start fetching quotes every "interval"
Stock.prototype.startFetching = function(interval) {
    this.fetching = true;
    this.fetchQuote();
    stock_canvas.startAddPoints();
};

// Stop fetching quotes
Stock.prototype.stopFetching = function() {
    this.fetching = false;
    stock_canvas.stopAddPoints();
};