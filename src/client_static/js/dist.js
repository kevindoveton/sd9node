"use strict";

angular.module("DigiControl", [ "DigiControl.controllers", "DigiControl.filters", "DigiControl.services", "DigiControl.directives", "ui.router", "btford.socket-io", "rzModule" ]).config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: "home",
        url: "/home",
        templateUrl: "/static/html/partials/home.html",
        controller: "HomeCtrl"
    });
    $stateProvider.state({
        name: "aux",
        url: "/aux/:id",
        templateUrl: "/static/html/partials/aux.html",
        controller: "AuxCtrl"
    });
    $stateProvider.state({
        name: "engFaders",
        url: "/eng/faders/{id:int}",
        templateUrl: "/static/html/partials/eng_faders.html",
        controller: "EngFaderCtrl"
    });
    $stateProvider.state({
        name: "eng",
        url: "/eng/select",
        templateUrl: "/static/html/partials/eng_select.html",
        controller: "EngSelectCtrl"
    });
    $urlRouterProvider.otherwise("/home");
});
"use strict";

angular.module("DigiControl.controllers", []).controller("AppCtrl", function($scope, $rootScope, $http) {});
"use strict";

angular.module("DigiControl.directives", []).directive("appVersion", function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
});
"use strict";

angular.module("DigiControl.filters", []).filter("interpolate", function(version) {
    return function(text) {
        return String(text).replace(/\%VERSION\%/gm, version);
    };
});
"use strict";

angular.module("DigiControl.services", []).value("version", "0.1");
Array.prototype.subarray = function(start, end) {
    if (!end) {
        end = -1;
    }
    return this.slice(start, this.length + 1 - end * -1);
};

angular.module("DigiControl.controllers").controller("AuxCtrl", function($scope, $state, SocketHelper, socket) {
    const AuxId = $state.params.id;
    SocketHelper.RequestConfig();
    SocketHelper.RequestInputNames();
    SocketHelper.RequestAuxVolume();
    const StepArray = [ -150, -60, -58, -54, -53.5, -53, -52, -51, -50, -49, -48, -46, -45, -44, -42, -40, -38, -36, -35, -34, -33, -32, -31, -30, -29, -28, -27, -26, -25, -24, -24, -22, -21, -20, -19, -18, -17, -16, -15, -14, -13.5, -13, -12.5, -12, -11.5, -11, -10.5, -10, -9.5, -9.2, -8.8, -8.4, -7.8, -7.4, -6.9, -6.6, -6.3, -6, -5.75, -5.5, -5.25, -5, -4.75, -4.5, -3.25, -2.6, -2.2, -1.8, -1.5, -1.3, -1, -.7, -.4, -.2, 0, .2, .4, .7, 1, 1.3, 1.6, 2, 2.4, 2.7, 3, 3.5, 4, 4.5, 5, 5.25, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10 ];
    $scope.StepArray = StepArray;
    function SliderEnd(id, value, highValue, pointerType) {
        SocketHelper.SetAuxVolume(AuxId, id, value);
    }
    $scope.SliderEnd = SliderEnd;
    $scope.faders = [];
    if (AuxId == "") {
        $state.go("home");
    }
    $scope.$on("socket:engineer", function(ev, data) {
        $state.transitionTo($state.current, {
            id: data
        }, {
            reload: true,
            inherit: false,
            notify: true
        });
    });
    $scope.$on("socket:name/input", function(ev, data) {
        data = JSON.parse(data);
        $scope.faders[data.c - 1].name = data.n;
    });
    $scope.$on("socket:announcements", function(ev, data) {
        console.log(data);
        data = JSON.parse(data);
        if (data["name"] == "consoleConfig") {
            for (var i = 1; i <= data.channelInputs; i++) {
                $scope.faders.push({
                    id: i,
                    name: "",
                    value: 0
                });
            }
        }
    });
    $scope.$on("socket:volume/aux", function(ev, data) {
        data = JSON.parse(data);
        data.v = searchArrayValues(data.v, StepArray);
        if (data["a"] == AuxId) {
            $scope.faders[data.c - 1].value = data.v;
        }
    });
    function searchArrayValues(value, array) {
        if (array.length == 1) {
            return array[0];
        }
        var index = Math.floor(array.length / 2);
        if (value < array[index]) {
            return searchArrayValues(value, array.slice(0, index));
        } else {
            return searchArrayValues(value, array.slice(index, array.length));
        }
    }
});
Array.prototype.subarray = function(start, end) {
    if (!end) {
        end = -1;
    }
    return this.slice(start, this.length + 1 - end * -1);
};

angular.module("DigiControl.controllers").controller("EngFaderCtrl", function($scope, $state, socket) {
    const AuxId = $state.params.id;
    console.log(AuxId);
    console.log("a");
    const StepArray = [ -150, -60, -58, -54, -53.5, -53, -52, -51, -50, -49, -48, -46, -45, -44, -42, -40, -38, -36, -35, -34, -33, -32, -31, -30, -29, -28, -27, -26, -25, -24, -24, -22, -21, -20, -19, -18, -17, -16, -15, -14, -13.5, -13, -12.5, -12, -11.5, -11, -10.5, -10, -9.5, -9.2, -8.8, -8.4, -7.8, -7.4, -6.9, -6.6, -6.3, -6, -5.75, -5.5, -5.25, -5, -4.75, -4.5, -3.25, -2.6, -2.2, -1.8, -1.5, -1.3, -1, -.7, -.4, -.2, 0, .2, .4, .7, 1, 1.3, 1.6, 2, 2.4, 2.7, 3, 3.5, 4, 4.5, 5, 5.25, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10 ];
    function SliderEnd(id, value, highValue, pointerType) {
        console.log(id, value);
    }
    $scope.SliderOptions = {
        vertical: true,
        onEnd: SliderEnd,
        hidePointerLabels: true,
        hideLimitLabels: true,
        stepsArray: StepArray
    };
    $scope.faders = [];
    if (AuxId == "") {
        $state.go("home");
    }
    function searchArrayValues(value, array) {
        if (array.length == 1) {
            return array[0];
        }
        var index = Math.floor(array.length / 2);
        if (value < array[index]) {
            return searchArrayValues(value, array.slice(0, index));
        } else {
            return searchArrayValues(value, array.slice(index, array.length));
        }
    }
});
angular.module("DigiControl.controllers").controller("EngSelectCtrl", function($scope, $state, SocketHelper, socket) {
    SocketHelper.RequestConfig();
    $scope.$on("socket:announcements", function(ev, data) {
        $scope.aux = [];
        console.log(data);
        data = JSON.parse(data);
        for (var i = 1; i <= data.auxOutputs; i++) {
            $scope.aux.push({
                name: "Output " + i,
                id: i
            });
        }
    });
    $scope.$on("socket:name/aux", function(ev, data) {
        console.log(data);
        data = JSON.parse(data);
        $scope.aux[data["a"] - 1].name = data["n"];
    });
    $scope.SelectMonitor = function(id) {
        socket.emit("engineer", id);
        SocketHelper.SoloAux(id, 1);
    };
});
angular.module("DigiControl.controllers").controller("HomeCtrl", function($scope, $state, SocketHelper) {
    SocketHelper.RequestConfig();
    SocketHelper.RequestAuxNames();
    $scope.$on("socket:announcements", function(ev, data) {
        $scope.aux = [];
        data = JSON.parse(data);
        for (var i = 1; i <= data.auxOutputs; i++) {
            $scope.aux.push({
                name: "Output " + i,
                id: i
            });
        }
    });
    $scope.$on("socket:name/aux", function(ev, data) {
        data = JSON.parse(data);
        console.log(data);
        $scope.aux[data["a"] - 1].name = data["n"];
    });
});
var app = angular.module("autocomplete", []);

app.directive("autocomplete", function() {
    var index = -1;
    return {
        restrict: "E",
        scope: {
            searchParam: "=ngModel",
            suggestions: "=data",
            onType: "=onType",
            onSelect: "=onSelect",
            autocompleteRequired: "=",
            disableFilter: "=disableFilter",
            render: "=render",
            this: "=this"
        },
        controller: [ "$scope", function($scope) {
            $scope.selectedIndex = -1;
            $scope.initLock = true;
            $scope.setIndex = function(i) {
                $scope.selectedIndex = parseInt(i);
            };
            this.setIndex = function(i) {
                $scope.setIndex(i);
                $scope.$apply();
            };
            $scope.getIndex = function(i) {
                return $scope.selectedIndex;
            };
            var watching = true;
            var hasBeenSelected = false;
            $scope.completing = false;
            $scope.$watch("searchParam", function(newValue, oldValue) {
                if (oldValue === newValue || !oldValue && $scope.initLock) {
                    return;
                }
                if (watching && typeof $scope.searchParam !== "undefined" && $scope.searchParam !== null) {
                    $scope.completing = true;
                    $scope.searchFilter = $scope.disableFilter ? "" : $scope.searchParam;
                    $scope.selectedIndex = -1;
                }
                if ($scope.onType) $scope.onType($scope.searchParam, hasBeenSelected);
            });
            this.preSelect = function(suggestion) {
                watching = false;
                $scope.$apply();
                watching = true;
            };
            $scope.preSelect = this.preSelect;
            this.preSelectOff = function() {
                watching = true;
            };
            $scope.preSelectOff = this.preSelectOff;
            $scope.select = function(suggestion) {
                if (suggestion) {
                    $scope.searchParam = suggestion.text;
                    $scope.searchFilter = suggestion.text;
                    if ($scope.onSelect) {
                        $scope.onSelect(suggestion.data, $scope.this);
                    }
                }
                watching = false;
                $scope.completing = false;
                setTimeout(function() {
                    watching = true;
                }, 1e3);
                hasBeenSelected = true;
                setTimeout(function() {
                    hasBeenSelected = false;
                }, 1);
                $scope.setIndex(-1);
            };
            $scope.wrappedSuggestions = [];
            $scope.$watchCollection("suggestions", function(newSuggestions) {
                if (newSuggestions instanceof Array) {
                    $scope.wrappedSuggestions = newSuggestions.map(function(suggestion, counterIndex) {
                        var renderedText;
                        if (typeof $scope.render === "function") {
                            renderedText = $scope.render(suggestion);
                        } else if (typeof suggestion !== "string") {
                            console.error("render function must be defined when using data object suggestions");
                            renderedText = "";
                        } else {
                            renderedText = suggestion;
                        }
                        return {
                            text: renderedText,
                            data: suggestion,
                            _id: "" + (counterIndex + 1)
                        };
                    });
                }
            });
        } ],
        link: function(scope, element, attrs) {
            setTimeout(function() {
                scope.initLock = false;
                scope.$apply();
            }, 250);
            var attr = "";
            scope.attrs = {
                placeholder: "start typing...",
                class: "",
                id: "",
                inputclass: "",
                inputid: ""
            };
            for (var a in attrs) {
                attr = a.replace("attr", "").toLowerCase();
                if (a.indexOf("attr") === 0) {
                    scope.attrs[attr] = attrs[a];
                }
            }
            if (attrs.clickActivation) {
                element[0].onclick = function(e) {
                    if (!scope.searchParam) {
                        setTimeout(function() {
                            scope.completing = true;
                            scope.$apply();
                        }, 200);
                    }
                };
            }
            var key = {
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                enter: 13,
                esc: 27,
                tab: 9
            };
            document.addEventListener("keydown", function(e) {
                var keycode = e.keyCode || e.which;
                switch (keycode) {
                  case key.esc:
                    scope.select();
                    scope.setIndex(-1);
                    scope.$apply();
                    e.preventDefault();
                }
            }, true);
            document.addEventListener("blur", function(e) {
                setTimeout(function() {
                    scope.select();
                    scope.setIndex(-1);
                    scope.$apply();
                }, 150);
            }, true);
            element[0].addEventListener("keydown", function(e) {
                var keycode = e.keyCode || e.which;
                var l = angular.element(this).find("li").length;
                if (!scope.completing || l == 0) return;
                switch (keycode) {
                  case key.up:
                    index = scope.getIndex() - 1;
                    if (index < -1) {
                        index = l - 1;
                    } else if (index >= l) {
                        index = -1;
                        scope.setIndex(index);
                        scope.preSelectOff();
                        break;
                    }
                    scope.setIndex(index);
                    if (index !== -1) scope.preSelect(angular.element(angular.element(this).find("li")[index]).text());
                    scope.$apply();
                    break;

                  case key.down:
                    index = scope.getIndex() + 1;
                    if (index < -1) {
                        index = l - 1;
                    } else if (index >= l) {
                        index = -1;
                        scope.setIndex(index);
                        scope.preSelectOff();
                        scope.$apply();
                        break;
                    }
                    scope.setIndex(index);
                    if (index !== -1) scope.preSelect(angular.element(angular.element(this).find("li")[index]).text());
                    break;

                  case key.left:
                    break;

                  case key.right:
                  case key.enter:
                  case key.tab:
                    index = scope.getIndex();
                    if (index !== -1) {
                        var jLiElement = angular.element(angular.element(this).find("li")[index]);
                        var suggestionId = jLiElement.attr("data-suggestion-id");
                        var suggestion = scope.wrappedSuggestions.filter(function(wrappedSuggestion) {
                            return suggestionId == wrappedSuggestion._id;
                        })[0];
                        scope.select(suggestion);
                        if (keycode == key.enter) {
                            e.preventDefault();
                        }
                    } else {
                        if (keycode == key.enter) {
                            scope.select();
                        }
                    }
                    scope.setIndex(-1);
                    scope.$apply();
                    break;

                  case key.esc:
                    scope.select();
                    scope.setIndex(-1);
                    scope.$apply();
                    e.preventDefault();
                    break;

                  default:
                    return;
                }
            });
        },
        template: '        <div class="autocomplete {{ attrs.class }}" id="{{ attrs.id }}">          <input            type="text"            ng-model="searchParam"            placeholder="{{ attrs.placeholder }}"            class="{{ attrs.inputclass }}"            id="{{ attrs.inputid }}"            ng-required="{{ autocompleteRequired }}" />          <ul ng-show="completing && (wrappedSuggestions | myFilter:searchFilter).length > 0">            <li              suggestion              ng-repeat="wrappedSuggestion in wrappedSuggestions | myFilter:searchFilter | limitTo:10"              index="{{ $index }}"              val="{{ wrappedSuggestion.text }}"              data-suggestion-id="{{ wrappedSuggestion._id }}"              ng-class="{ active: ($index === selectedIndex) }"              ng-click="select(wrappedSuggestion)"              ng-bind-html="wrappedSuggestion.text | highlight:searchParam"></li>          </ul>        </div>'
    };
});

app.filter("myFilter", [ "$filter", function($filter) {
    return function(wrappedSuggestions, searchFilter) {
        if (wrappedSuggestions instanceof Array) {
            searchFilter = searchFilter || "";
            return wrappedSuggestions.filter(function(wrappedSuggestion) {
                var escapeRegexp = function(text) {
                    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
                };
                var words = searchFilter.replace(/\ +/g, " ").split(/\ /g);
                var escapedWords = words.map(escapeRegexp);
                var pattern = "";
                escapedWords.forEach(function(escapedWord) {
                    pattern += "(?=.*" + escapedWord + ")";
                });
                var rePattern = new RegExp(pattern, "gi");
                var suggestion = wrappedSuggestion.text;
                return rePattern.test(suggestion);
            });
        }
    };
} ]);

app.filter("highlight", [ "$sce", function($sce) {
    return function(input, searchParam) {
        if (typeof input === "function") return "";
        if (searchParam) {
            var escapeRegexp = function(text) {
                return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            };
            var words = searchParam.replace(/\ +/g, " ").split(/\ /g);
            var escapedWords = words.map(escapeRegexp);
            escapedWords.forEach(function(escapedWord) {
                var wordPattern = "(?!<span[^>]*?>)(" + escapedWord + ")(?![^<]*?</span>)(?=[^>]*(<|$))";
                var wordRegexp = new RegExp(wordPattern, "gi");
                input = input.replace(wordRegexp, '<span class="highlight">$1</span>');
            });
        }
        return $sce.trustAsHtml(input);
    };
} ]);

app.directive("suggestion", function() {
    return {
        restrict: "A",
        require: "^autocomplete",
        link: function(scope, element, attrs, autoCtrl) {
            element.bind("mouseenter", function() {
                autoCtrl.preSelect(attrs.val);
                autoCtrl.setIndex(attrs.index);
            });
            element.bind("mouseleave", function() {
                autoCtrl.preSelectOff();
            });
        }
    };
});
angular.module("DigiControl").factory("HttpService", function($http, $q, localStorageService, $state) {});
angular.module("DigiControl").factory("SocketHelper", function(socket) {
    socket.on("connect", function() {
        socket.emit("subscribe", "announcements");
        socket.emit("subscribe", "engineer");
        socket.emit("subscribe", "name/input");
        socket.emit("subscribe", "name/input");
        socket.emit("subscribe", "volume/aux");
        socket.emit("subscribe", "mute/input");
    });
    return {
        RequestConfig: function() {
            socket.emit("request", "consoleConfig");
        },
        RequestAuxVolume: function() {
            socket.emit("request", "inputAuxLevelVolume");
        },
        RequestInputNames: function() {
            socket.emit("subscribe", "name/input");
            socket.emit("request", "inputNames");
        },
        RequestAuxNames: function() {
            socket.emit("request", "auxNames");
        },
        SetAuxVolume: function(aux, channel, volume) {
            socket.emit("volume/aux", JSON.stringify({
                a: aux,
                c: channel,
                v: volume
            }));
        },
        SoloAux: function(aux, value) {
            socket.emit("auxsolo", aux);
        }
    };
});
angular.module("DigiControl").factory("socket", function(socketFactory) {
    var socket = socketFactory();
    socket.forward("announcements");
    socket.forward("name/input");
    socket.forward("name/aux");
    socket.forward("volume/aux");
    socket.forward("mute/input");
    socket.forward("engineer");
    return socket;
});