function getCacheBuster(bust) {
    return (bust ? "?_t=" + (new Date()).getTime() : "");
}

function getCurrentProtocol() {
    return "file:" === document.location.protocol ? "http:" : ""
}

function parsePath(path, bust) {
    if (0 === path.indexOf("//")) {
        path = getCurrentProtocol() + path;
    }

    return path + getCacheBuster(bust);
}

function isArray(obj) {
    if (Array.isArray) {
        return Array.isArray(obj);
    }
    else {
        return "[object Array]" === Object.prototype.toString.call(obj);
    }
}

function after(calls, callback) {
    return function() {
        if (0 === --calls) {
            callback.apply(this, [].slice.apply(arguments));
        }
    };
}

function addJsScript(options) {
    options = options || {};

    var src = options.src;
    var id = options.id;
    var bust = options.bust;
    var async = options.async;
    var index = options.index;
    var additional = options.additional;
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
    if (false !== async) {
        script.setAttribute("async", "true");
    }
    if (id) {
        script.setAttribute("id", id);
    }
    script.setAttribute("src", parsePath(src, bust));

    if (additional) {
        for (var option in additional) {
            if (option && additional.hasOwnProperty(option)) {
                script.setAttribute(option, additional[option]);
            }
        }
    }

    if (!last) {
        scripts[0].parentNode.insertBefore(script, selected);
    }
    else {
        scripts[0].parentNode.appendChild(script);
    }
}

function addCssScript(options) {
    options = options || {};

    var href = options.href;
    var id = options.id;
    var bust = options.bust;
    var async = options.async;
    var additional = options.additional;

    var script = document.createElement("link");

    script.setAttribute("rel", "stylesheet");
    script.setAttribute("type", "text/css");

    if (false !== async) {
        script.setAttribute("async", "true");
    }

    if (id) {
        script.setAttribute("id", id);
    }
    script.setAttribute("href", parsePath(href, bust));

    if (additional) {
        for (var option in additional) {
            if (option && additional.hasOwnProperty(option)) {
                script.setAttribute(option, additional[option]);
            }
        }
    }

    document.getElementsByTagName("head")[0].appendChild(script);
}

function addScript(options) {
    options = options || {};

    var resolver = {
          css: addCssScript
        , js: addJsScript
    };

    resolver[options.type.toLowerCase()] && resolver[options.type.toLowerCase()](options);
}

function addScripts(scripts) {
    var i = 0;
    if (!isArray(scripts)) {
        scripts = [ scripts ];
    }

    for (; i < scripts.length; i++) {
        var script = scripts[i];
        addScript(script);
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

function loadRevealularResources(options) {
    var always = [
        {
              type: "css"
            , href: "//gh.itkoren.com/revealular/reveal.js/css/reveal.min.css"
        },
        {
              type: "css"
            , href: "//gh.itkoren.com/revealular/reveal.js/css/theme/default.css"
            , id: "theme"
        },
        {
              type: "css"
            , href: "//gh.itkoren.com/revealular/reveal.js/lib/css/zenburn.css"
        },
        {
              type: "js"
            , src: "//ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.min.js"
            , async: false
            , additional: {
                  onload: 'javascript:loadReveal(' + JSON.stringify(options) + ');'
              }
        }
    ];

    var print = [
        {
              type: "css"
            , href: "//gh.itkoren.com/revealular/reveal.js/css/print/pdf.css"
        }
    ];

    var ielt9 = [
        {
              type: "js"
            , src: "//gh.itkoren.com/revealular/reveal.js/lib/js/html5shiv.js"
        }
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
}

function loadReveal(options) {
    options = options || {};

    var reveal = [
        {
              type: "js"
            , src: "//gh.itkoren.com/revealular/reveal.js/lib/js/head.min.js"
            , async: false
        },
        {
              type: "js"
            , src: "//gh.itkoren.com/revealular/reveal.js/js/reveal.min.js"
            , async: false
            , additional: {
                 onload: 'javascript:loadRevealular(' + JSON.stringify(options) + ');'
              }
        }
    ];

    createRevealularDOM();
    addScripts(reveal);
}

function loadRevealular(options) {
    var script = {
          src: "//gh.itkoren.com/revealular/js/revealular.js"
        , async: false
        , additional: options
    };

    addJsScript(script);
}

function init() {
    // If the query includes '/', change it to '%2F'
    if (window.location.search.match(/\//g)) {
        window.location.search = window.location.search.replace(/\//g, "%2F");
    }

    // Assuming this script is loaded synchronous (not async)
    // Reliably grab current running script tag
    var scripts;
    var script = document.currentScript;
    var options = {};
    if (!script) {
        scripts = document.getElementsByTagName("script");
        script = script[scripts.length - 1];
    }

    // Check for an attribute/config
    if (script.hasAttribute("data-ext")) {
        options["data-ext"] = script.getAttribute("data-ext");
    }
    if (script.hasAttribute("data-slides")) {
        options["data-slides"] = script.getAttribute("data-slides");
    }
    if (script.hasAttribute("data-init")) {
        options["data-init"] = script.getAttribute("data-init");
    }

    loadRevealularResources(options);
}

init();