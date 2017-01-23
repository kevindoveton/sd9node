var soundMin = 80;

// fullscreen on android
window.scrollTo(0,1);
window.addEventListener('orientationchange', screenSizeUpdate);

$(function() {

	// Menu Button
	$('#nav-icon3').click(function(){
		$(this).toggleClass('open');
	});

	// Update App div to Screen Size
	screenSizeUpdate();

	// Connect to Web Sockets
	var socket = io.connect();
});

function screenSizeUpdate() {
	var height = $(window).height();
	// console.log(height);
	// $("#app").height(height);
}

function updateFaderName(channel, name) {
	var selector = "p#name-"+(channel);
	if (name != "") {
		$(selector).text(name);
	}
	else {
		$(selector).text(".");
	}
}

function updateFaderLevel(channel, level) {
	var selector = "input#fader-"+(channel);
	var faderLevel = 100;
	if (level <= 0) {
		faderLevel = 100-(Math.log10(1-level)/Math.log10(1+soundMin))*100
	}
	$(selector).val(faderLevel).change();
}

function createFaders(channels) {
	// initialising is important or you may get a random
	// 'undefined' when appending to it
	var input = "";
	var faderLevel = 0;
	for (i = 0; i < channels; i++) {
		// input += '<div class="fader"><input id="fader-'+(i+1)+'" type="range" min="0" max="100" value="'+faderLevel+'"data-rangeslider data-orientation="vertical"><p id="name-'+(i+1)+'" class="name">Channel '+(i+1)+'</p><div id="mute-'+(i+1)+'" class="mute"><p></p></div></div>' // <div id="mute-'+(i+1)+'" class="mute"><p></p></div>
		input += '<div class="fader"><input id="fader-'+(i+1)+'" type="range" min="0" max="100" value="'+faderLevel+'"data-rangeslider data-orientation="vertical"><p id="name-'+(i+1)+'" class="name">Channel '+(i+1)+'</p></div>'
	}

	$( "div#faders" ).html(input);
	createRanges();

	for (var i = 0; i < channels; i++) {
		var fader = $($(".fader")[i]).append("<div class='faderNumbers'></div>").find("div.faderNumbers");
		fader.append("<span>+10</span>");
		fader.append("<span>+5</span>");
		fader.append("<span>0</span>");
		fader.append("<span>-5</span>");
		fader.append("<span>-10</span>");
		fader.append("<span>-20</span>");
		fader.append("<span>-30</span>");
		fader.append("<span>-40</span>");
		fader.append("<span>-50</span>");
		fader.append("<span>-60</span>");
	}

}

function createButtons(data) {
	var input = "";
	for (i = 0; i < data["auxOutputs"]; i++) {
		input += '<div class="item"><a onclick=\'window.location = this.getAttribute("href"); return false;\' href="/aux/'+(i+1)+'" class="btn btn-primary btn-lg" id="aux'+(i+1)+'"></a></div>';
	}
	$( "div#app" ).html(input);
}

function updateName(aux, name) {
	var selector = "a#aux"+aux;
	$(selector).text(name);
}

var auxClick = function(item) {
	window.location(item.getAttribute("href"));
	return false;
}
