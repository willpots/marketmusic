var MusicBox = function() {
    var scale = new Array(.5, 1, 1.059463, 1.122462, 1.189207, 1.259921, 1.334840, 1.414214, 1.498307, 1.587401, 1.681793, 1.781797, 1.887749, 2);
    
    var url = "tribal.wav"; 
    var url2 = "electra.wav";
    var url3 = "tom1.wav";
    var url4 = "tom2.wav";
    var url5 = "flute.wav";
    var context = new webkitAudioContext(); 
    var source; 
    var buffer; 
    var gainNode = context.createGainNode(); 
    var interval = null;
    var latestTime = 0;
    function now() {
        return context.currentTime;
    }

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() { 
        buffer = context.createBuffer(request.response, false);
    }
    request.send();

    var request2 = new XMLHttpRequest();
    request2.open('GET', url2, true);
    request2.responseType = 'arraybuffer';
    request2.onload = function() { 
        buffer2 = context.createBuffer(request2.response, false);
    }
    request2.send();

    var request3 = new XMLHttpRequest();
    request3.open('GET', url3, true);
    request3.responseType = 'arraybuffer';
    request3.onload = function() { 
        buffer3 = context.createBuffer(request3.response, false);
    }
    request3.send();

    var request4 = new XMLHttpRequest();
    request4.open('GET', url4, true);
    request4.responseType = 'arraybuffer';
    request4.onload = function() { 
        buffer4 = context.createBuffer(request4.response, false);
    }
    request4.send();

    var request5 = new XMLHttpRequest();
    request5.open('GET', url5, true);
    request5.responseType = 'arraybuffer'; 
    request5.onload = function() { 
        buffer5 = context.createBuffer(request5.response, false);
    }
    request5.send();

    this.mute = function(test) {
        if(test == true) {
            gainNode.gain.value = 0;
        } else {
            gainNode.gain.value = 1;
        }
    }

    function playTone(index, time) { 
        var source = context.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = scale[index];
        source.connect(gainNode);
        gainNode.connect(context.destination);
        source.noteOn(time);
    }

    function playTone2(index, time) { 
        var source = context.createBufferSource();
        source.buffer = buffer2;
        source.playbackRate.value = scale[index];
        source.connect(gainNode);
        gainNode.connect(context.destination);
        source.noteOn(time);
    }
    function playTone3(index, time) { 
        var source = context.createBufferSource();
        source.buffer = buffer3;
        source.playbackRate.value = scale[index];
        source.connect(gainNode);
        gainNode.connect(context.destination);
        source.noteOn(time);
    }

    function playTone4(index, time) { 
        var source = context.createBufferSource();
        source.buffer = buffer4;
        source.playbackRate.value = scale[index];
        source.connect(gainNode);
        gainNode.connect(context.destination);
        source.noteOn(time);
    }

    function playTone5(index, time) { 
        var source = context.createBufferSource();
        source.buffer = buffer5;
        source.playbackRate.value = scale[index];
        source.connect(gainNode);
        gainNode.connect(context.destination);
        source.noteOn(time);
    }

    function getVolume() {
        gainNode.gain.value = document.getElementById("vol").value / 100.;
    }

    function getNote(s) {
        var scales = [];
        scales["major"] = new Array(0, 1, 3, 5, 6, 8, 10, 12, 13);
        scales["minor"] = new Array(0, 1, 3, 4, 6, 8, 9, 11, 13);
        scales["majpent"] = new Array(0, 1, 3, 5, 8, 10, 13);
        scales["minpent"] = new Array(0, 1, 4, 6, 8, 11, 13);
        scales["chromatic"] = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13);
        var note = Math.floor(Math.random() * scales[s].length)
        return scales[s][note];
    }

    this.playPattern = function(stock) {
        if(stock.data != null) {
            var change = stock.data.PercentChange.replace("+","").replace("%","") / 100;
            var scale = "major";
            // console.log(change);
            if(change < -0.05) {
                scale = "chromatic";
            } else if(change >= -0.05 && change < -0.01) {
                scale = "minor";
            } else if(change >= -0.01 && change < 0.01) {
                scale = "major";
            } else if(change >= 0.01 && change < 0.05) {
                scale = "majpent";
            } else if(change >= 0.05) {
                scale = "majpent";
            }
            var starttime = now();
            var tempo = (1 - Math.abs(change))/2;
            // console.log(tempo);
            if(change < -0.05) {
            for (i = 0; i < 30; i++) {
                playTone(getNote(scale), starttime + tempo * i);
                playTone2(getNote(scale), starttime + tempo * i);
                playTone2(1.1*(getNote(scale)), starttime + tempo * i);
            }
            for (i = 0; i < 15; i++) {
                playTone2(getNote(scale), starttime + 2 * tempo * i);
            }
            for (i = 0; i < 7; i++) {
                playTone3(getNote(scale), starttime + 4 * tempo * i);
                playTone4(getNote(scale), starttime + 4 * tempo * i);
            }
            
            } else if(change >= -0.05) {
            for (i = 0; i < 30; i++) {
                playTone(getNote(scale), starttime + tempo * i);
                playTone2(getNote(scale), starttime + tempo * i);
            }
            for (i = 0; i < 15; i++) {
                playTone2(getNote(scale), starttime + 2 * tempo * i);
            }
            for (i = 0; i < 7; i++) {
                playTone3(getNote(scale), starttime + 4 * tempo * i);
                playTone4(getNote(scale), starttime + 4 * tempo * i);
            }
            }
            latestTime = Date.now() + ( 29 * tempo * 1000 );
        }
    }
    this.startPlaying = function(stock) {
        var mbox = this;
        interval = window.setInterval(function(){
            // console.log(Date.now() + " " + latestTime + " " + (Date.now() > latestTime));
            if(Date.now() > latestTime) {
                mbox.playPattern(stock);
            }
        }, 500);
    };
    this.stopPlaying = function() {
        window.clearInterval(interval);
    }
}
// Event listener code pulled from here
// http://www.nczonline.net/blog/2010/03/09/custom-events-in-javascript/
MusicBox.prototype.addListener =  function(type, listener){
    if (typeof this._listeners[type] == "undefined"){
        this._listeners[type] = [];
    }

    this._listeners[type].push(listener);
};
// Trigger a particular event
MusicBox.prototype.fire = function(event){
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
MusicBox.prototype.removeListener = function(type, listener){
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