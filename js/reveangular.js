var app = angular.module("reveangular", []);

function parseStep(step, elem) {
	if (!elem) {
		elem = angular.element("<section>");
	}
	if ("string" === typeof step) {
		elem.html(step);
	} 
	else if (step) {
		for (var attr in step) {
			if (attr && step.hasOwnProperty(attr)) {
				var subElem = angular.element("<" + attr + ">");
				parseStep(step[attr], subElem);
				elem.append(subElem);
			}
		}
	}
	
	return elem;
}

app.controller("ReveAngularController", function($scope, $http) {
  scope.slides = [];
});

app.directive("slideshow", function($http) {
  return {
    scope: {
      slides: "=slideshow"
    },
    link: function(scope, elem, attrs) {
      elem.addClass("slides");
      $http.get("slides.json").then(function(res) {
        scope.slides = res.data;
        
        if (scope.slides) {
          for (var i = 0; i < scope.slides.length; i++) {
            var steps = scope.slides[i].steps;
            var section;
            
            if (1 === steps.length) {
              section = parseStep(steps[0]);
            } 
            else {
              section = angular.element("<section>");
              for (var j = 0; j < steps.length; j++) {
                var subSection = parseStep(steps[j]);
                section.append(subSection);
              }
            }
    
            if (section) {
              elem.append(section);
            }
          }
          
          Reveal.addEventListener("slidechanged", function(event) {
            // event.previousSlide, event.currentSlide, event.indexh, event.indexv
            var notes = event.currentSlide.querySelector(".notes");
            if (notes) {
              console.info(notes.innerHTML.replace(/\n\s+/g,"\n"));
            }
          });
        
  
          $http.jsonp("init.js").
            success(function(data, status, headers, config) {
              //what do I do here?
            }).
            error(function(data, status, headers, config) {
              scope.error = true;
            });
        }
      });
    }
  };
});