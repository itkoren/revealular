/**
 * Handles loading slides from JSON using AngularJS
 */
var Revealular = (function () {
    var app = angular.module("revealular", []);

    function parseUrl (url) {
        var loc = window.location;
        var a = document.createElement("a");
        a.href = url;

        var parsed = {
            href : a.href,
            host : a.host,
            hostname : a.hostname,
            port : a.port || "", // Avoid "0" ports for local URL's - Safari 5.1
            pathname : a.pathname,
            protocol : a.protocol,
            hash : a.hash,
            search : a.search
        };

        if (":" === a.protocol) { // Avoid empty "hostname", "port" & "protocol" for local URL's - IE
            parsed.host = loc.host;
            parsed.hostname = lc.hostname;
            parsed.port = loc.port;
            parsed.protocol = loc.protocol;
        }

        a = null;

        return parsed;
    };

    function isSameOrigin (url) {
        var loc = window.location;
        var parsed = parseUrl(url);

        return parsed.hostname === loc.hostname && parsed.port === loc.port && parsed.protocol === loc.protocol;
    };

    function parseStep (sce, step, elem) {
        step = step || "";
        if (!elem) {
            elem = angular.element("<section>");
        }
        if ("string" === typeof step) {
            elem.html(step);
        } 
        else if (step) {
            for (var i = 0; i < step.length; i++) {
                var item = step[i];
                if (item && "object" === typeof item) {
                    var source = item.name;
                    if ("notes" === source.toLowerCase()) {
                        var notes = angular.element(sce.trustAsHtml("<aside class=\"notes\">").toString());
                        if (item.value.join) {
                            notes.html(item.value.join("\n"));
                        } 
                        else {
                            notes.html(item.value);
                        }
                        elem.append(notes);
                    } 
                    else {
                        if (item.attributes) {
                            for (var attr in item.attributes) {
                                if (attr && item.attributes.hasOwnProperty(attr)) {
                                    source += " " + attr + "=\"" + item.attributes[attr] + "\"";
                                }
                            }
                        }
                        var html = sce.trustAsHtml("<" + source + ">").toString();
                        var subElem = angular.element(html);
                        parseStep(sce, item.value, subElem);
                        elem.append(subElem);
                    }
                } 
                else if (item && "string" === typeof item) {
                    elem.html(item);
                }
            }
        }

        return elem;
    }

    function addScript (js, scope, q) {
        var deferred = q.defer();

        // Inject js into a script tag
        var script = document.createElement("script");

        script.setAttribute("type", "text/javascript");
        script.setAttribute("async", true);
        script.setAttribute("src", encodeURI(js));
        script.setAttribute("onload", function () {
            // The script is ready for use, resolve promise
            scope.$apply(deferred.resolve());
        });

        document.body.appendChild(script);

        return deferred.promise;
    }

    app.controller("RevealularController", function ($scope, $http) {
        $scope.slides = [];
    });

    app.directive("slideshow", function ($http, $sce, $q) {
        return {
            scope : {
                slides : "=slideshow"
            },
            link : function (scope, elem, attrs) {
                var query = Reveal.getQueryHash();
                var slides = (query.slides || "slides") + ".json";
                var init = (query.init || "init") + ".js";
                var local = isSameOrigin(slides);
                var action = local ? "get" : "jsonp";
                var deferred = new $q.defer();

                elem.addClass("slides");

                if (!local) {
                    Reveal.Revealular = Reveal.Revealular || {};
                    Reveal.Revealular.gotSlides = function (data) {
                        deferred.resolve({ data : data });
                    };
                    slides += "?callback=Reveal.Revealular.gotSlides"
                }

                deferred.promise.then(function (res, status, headers, config) {
                        scope.slides = res.data;

                        if (scope.slides) {
                            for (var i = 0; i < scope.slides.length; i++) {
                                var steps = scope.slides[i].steps;
                                var section;

                                if (1 === steps.length) {
                                    section = parseStep($sce, steps[0]);
                                } 
                                else {
                                    section = angular.element("<section>");
                                    for (var j = 0; j < steps.length; j++) {
                                        var subSection = parseStep($sce, steps[j]);
                                        section.append(subSection);
                                    }
                                }

                                if (section) {
                                    elem.append(section);
                                }
                            }

                            addScript(init, scope, $q).then(function (res) {
                                    // Initialize script loaded!
                                }, function (res) {
                                    scope.error = true;
                                });
                        }
                    }, function (res, status, headers, config) {
                        scope.error = true;
                    });

                // Get the slides
                $http[action](slides).then(function (res) {
                        deferred.resolve(res);
                    }, function (error) {
                        deferred.reject(error);
                    });
            }
        };
    });

})();
