var openSettings = function() {
    if ($("div.settings").css("opacity") == 1) {
        $("div.settings").css({
            opacity: 0
        });
        setTimeout(function() {
            $("div.settings").css({
                "z-index": -1
            });
        }, 1e3);
    } else {
        $("div.settings").css({
            "z-index": 2,
            opacity: 1
        });
    }
};

var connect = function() {
    alert("connect!");
};

$(function() {
    $(".openSettings").on({
        click: openSettings
    });
    $("#connectBtn").on({
        click: connect
    });
});