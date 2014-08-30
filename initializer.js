function getCacheBuster(bust) {
    return (bust ? "?_t=" + (new Date()).getTime() : "");
}

function isArray(obj) {
    if (Array.isArray) {
        return Array.isArray(obj);
    }
    else {
        return "[object Array]" === Object.prototype.toString.call(obj);
    }
}

function addJsScript(src, id, bust, index, options) {
    var script = document.createElement("script");
    var scripts = document.getElementsByTagName("script");
    var selected = scripts[0];
    var last = false;

    if (!index || 0 > index || index > (scripts.length - 1)) {
        last = true;
    }
    else if (0 < index) {
        selected = scripts[index];
    }

    script.setAttribute("type", "text/javascript");
    script.setAttribute("async", true);
    if (id) {
        script.setAttribute("id", id);
    }
    script.setAttribute("src", src + getCacheBuster(bust));

    if (options) {
        for (var option in options) {
            if (option && options.hasOwnProperty(option)) {
                script.setAttribute(option, options[option]);
            }
        }
    }

    if (!last) {
        scripts.insertBefore(script, selected);
    }
    else {
        scripts.appendChild(script);
    }
}

function addCssScript(href, id, bust) {
    var script = document.createElement("link");

    script.setAttribute("rel", "stylesheet");
    script.setAttribute("type", "text/css");
    script.setAttribute("async", true);
    if (id) {
        script.setAttribute("id", id);
    }
    script.setAttribute("href", href + getCacheBuster(bust));

    document.getElementsByTagName("head")[0].appendChild(script);
}

function addScript(type, path, id, bust, index, options) {
    var resolver = {
          css: addCssScript
        , js: addJsScript
    };

    resolver[type.toLowerCase()] && resolver[type.toLowerCase()](path, id, bust, index, options);
}

function getCurrentProtocol() {
    return "file:" === document.location.protocol ? "http:" : ""
}

function addScripts(scripts) {
    var i = 0;
    if (!isArray(scripts)) {
        scripts = [ scripts ];
    }

    for (; i < scripts.length; i++) {
        var spec = scripts[i].split("->");
        spec[1] = getCurrentProtocol() + spec[1];

        addScript.apply(this, spec);
    }
}

function createRevealularDOM() {
    var wrapper = document.createElement("div");
    wrapper.setAttribute("class", "reveal");
    wrapper.setAttribute("ng-app", "revealular");
    wrapper.setAttribute("ng-controller", "RevealularController");

    // Any section element inside of this container is displayed as a slide
    var slides = document.createElement("div");
    slides.setAttribute("slideshow", "slides");

    wrapper.appendChild(slides);

    document.getElementsByTagName("body")[0].appendChild(wrapper);
}

function loadRevealularResources() {
    var always = [
          "css->//gh.itkoren.com/revealular/reveal.js/css/reveal.min.css"
        , "css->//gh.itkoren.com/revealular/reveal.js/css/theme/default.css->theme"
        , "css->//gh.itkoren.com/revealular/reveal.js/lib/css/zenburn.css"
        , "js->//ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.min.js"
    ];

    var print = [
        "css->//gh.itkoren.com/revealular/reveal.js/css/print/pdf.css"
    ];

    var ielt9 = [
        "js->//gh.itkoren.com/revealular/reveal.js/lib/js/html5shiv.js"
    ];

    var reveal = [
          "js->//gh.itkoren.com/revealular/reveal.js/lib/js/head.min.js"
        , "js->//gh.itkoren.com/revealular/reveal.js/js/reveal.min.js"
    ];

    addScripts(always);

    // If the query includes 'print-pdf', include the PDF print sheet
    if (window.location.search.match(/print-pdf/gi)) {
        addScripts(print);
    }

    // If IE < 9, include the HTML5 shim
    if (!document.addEventListener) { // IE < 9
        addScripts(ielt9);
    }

    createRevealularDOM();

    addScripts(reveal);
}

function loadSlideshow(options) {
    var src = getCurrentProtocol() + "//gh.itkoren.com/revealular/js/revealular.js";

    addJsScript(src, "revealvular", true, -1, options);
}

function init() {
    // If the query includes '/', change it to '%2F'
    if (window.location.search.match(/\//g)) {
        window.location.search = window.location.search.replace(/\//g, "%2F");
    }

    loadRevealularResources();
}

init();