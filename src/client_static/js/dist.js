"use strict";

angular.module("DigiControl", [ "DigiControl.controllers", "DigiControl.filters", "DigiControl.services", "DigiControl.directives", "ui.router" ]).config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
    $stateProvider.state({
        name: "home",
        url: "/home",
        templateUrl: "/html/partials/home.html",
        controller: "HomeCtrl"
    });
    $stateProvider.state({
        name: "aux",
        url: "/aux",
        templateUrl: "/html/partials/aux.html",
        controller: "AuxCtrl",
        params: {
            aux: null
        }
    });
    $urlRouterProvider.otherwise("/home");
});

"use strict";

angular.module("DigiControl.controllers", []).controller("AppCtrl", function($scope, $rootScope, $http, $templateCache) {});

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