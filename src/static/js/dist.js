$(function() {
    function screenSizeUpdate() {
        var height = $(window).height();
        console.log(height);
        $("#app").height(height);
    }
    screenSizeUpdate();
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
        alert("click");
        window.location(item.getAttribute("href"));
        return false;
    };
});