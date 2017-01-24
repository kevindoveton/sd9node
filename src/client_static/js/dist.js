var soundMin = 80;

window.scrollTo(0, 1);

window.addEventListener("orientationchange", screenSizeUpdate);

$(function() {
    $("#nav-icon3").click(function() {
        $(this).toggleClass("open");
    });
    screenSizeUpdate();
    var socket = io.connect();
});

function screenSizeUpdate() {
    var height = $(window).height();
}

function updateFaderName(channel, name) {
    var selector = "p#name-" + channel;
    if (name != "") {
        $(selector).text(name);
    } else {
        $(selector).text(".");
    }
}

function updateFaderLevel(channel, level) {
    var selector = "input#fader-" + channel;
    var faderLevel = 100;
    if (level <= 0) {
        faderLevel = 100 - Math.log10(1 - level) / Math.log10(1 + soundMin) * 100;
    }
    $(selector).val(faderLevel).change();
}

function createFaders(channels) {
    var input = "";
    var faderLevel = 0;
    for (i = 0; i < channels; i++) {
        input += '<div class="fader"><input id="fader-' + (i + 1) + '" type="range" min="0" max="100" value="' + faderLevel + '"data-rangeslider data-orientation="vertical"><p id="name-' + (i + 1) + '" class="name">Channel ' + (i + 1) + "</p></div>";
    }
    $("div#faders").html(input);
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
        input += '<div class="item"><a onclick=\'window.location = this.getAttribute("href"); return false;\' href="/aux/' + (i + 1) + '" class="btn btn-primary btn-lg" id="aux' + (i + 1) + '"></a></div>';
    }
    $("div#app").html(input);
}

function updateName(aux, name) {
    var selector = "a#aux" + aux;
    $(selector).text(name);
}

var auxClick = function(item) {
    window.location(item.getAttribute("href"));
    return false;
};

var socket = io.connect();

$(function() {
    var auxnumber = window.location.pathname.substring(5).replace(/[^\d.]/g, "");
    $("#auxName").text("Aux " + auxnumber);
    socket.on("connect", function() {
        socket.emit("request", "consoleConfig");
        socket.emit("subscribe", "announcements");
        socket.emit("subscribe", "name/input");
        socket.emit("subscribe", "name/aux");
        socket.emit("subscribe", "volume/aux/" + auxnumber);
        socket.emit("subscribe", "mute/input");
        socket.emit("request", "inputAuxLevelVolume" + auxnumber);
        socket.emit("request", "inputNames");
        socket.emit("request", "auxNames");
        socket.emit("request", "inputMutes");
    });
    setInterval(function() {
        socket.emit("request", "inputMutes");
    }, 2e4);
    socket.on("announcements", function(data) {
        data = JSON.parse(data);
        if (data["name"] == "consoleConfig") {
            createFaders(data["channelInputs"]);
        }
    });
    socket.on("name/input", function(data) {
        data = JSON.parse(data);
        updateFaderName(data["c"], data["n"]);
    });
    socket.on("name/aux", function(data) {
        if (auxnumber == data["a"]) {
            $("#auxName").text(data["n"]);
        }
    });
    socket.on("volume/aux/" + auxnumber, function(data) {
        data = JSON.parse(data);
        if (data["a"] == auxnumber) {
            updateFaderLevel(data["c"], data["v"]);
        }
    });
    socket.on("mute/input", function(data) {
        data = JSON.parse(data);
        $("#js-rangeslider-" + (data.c - 1)).find(".rangeslider__handle").first().toggleClass("mute", !!data.m);
    });
    screenSizeUpdate();
});

$(function() {
    var socket = io.connect();
    socket.on("connect", function() {
        socket.emit("subscribe", "announcements");
        socket.emit("subscribe", "name/aux");
        socket.emit("request", "auxNames");
    });
    socket.on("announcements", function(data) {
        data = JSON.parse(data);
        console.log(data);
        createButtons(data);
    });
    socket.on("name/aux", function(data) {
        data = JSON.parse(data);
        updateName(data["a"], data["n"]);
    });
});

function createRanges() {
    var $document = $(document);
    var selector = "[data-rangeslider]";
    var $element = $(selector);
    var textContent = "textContent" in document ? "textContent" : "innerText";
    $element.rangeslider({
        polyfill: false,
        onInit: function() {},
        onSlide: function(position, value) {},
        onSlideEnd: function(position, value) {
            var auxnumber = window.location.pathname.substring(5).replace(/[^\d.]/g, "");
            var ch = this.$element[0].id.substr(6);
            volume = -(Math.pow(10, -((value - 100) / 100) * Math.log10(1 + soundMin)) - 1);
            volume = Math.round(volume * 100) / 100;
            console.log(ch);
            var obj = {
                a: auxnumber,
                c: ch,
                v: volume
            };
            socket.emit("volume/aux", JSON.stringify(obj));
        }
    });
}

