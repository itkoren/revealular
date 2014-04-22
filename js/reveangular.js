var app = angular.module("reveangular", []);

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
                    notes.html(item.value);
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

app.controller("ReveAngularController", function ($scope, $http) {
    $scope.slides = [];
});

app.directive("slideshow", function ($http, $sce) {
    return {
        scope : {
            slides : "=slideshow"
        },
        link : function (scope, elem, attrs) {
            elem.addClass("slides");
            $http.get("slides.json").then(function (res) {
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

                    Reveal.addEventListener("slidechanged", function (event) {
                        // event.previousSlide, event.currentSlide, event.indexh, event.indexv
                        var notes = event.currentSlide.querySelector(".notes");
                        if (notes) {
                            console.info(notes.innerHTML.replace(/\n\s+/g, "\n"));
                        }
                    });

                    $http.jsonp("init.js").success(function (data, status, headers, config) {
                        //what do I do here?
                    }).error(function (data, status, headers, config) {
                        scope.error = true;
                    });
                }
            });
        }
    };
});
