// Full list of configuration options available here:
// https://github.com/hakimel/reveal.js#configuration
var queryHash = Reveal.getQueryHash();
var scripts;
var script = document.currentScript;
if (!script) {
    scripts = document.getElementsByTagName("script");
    script = script[scripts.length - 1];
}
var path = "";
var idx = script.src.lastIndexOf("/");
if (-1 !== idx) {
    path = script.src.substring(0, idx) + "/";
}
Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    theme: queryHash.theme,
    transition: queryHash.transition || 'default',
    dependencies: [
        { src: path + 'reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: path + 'reveal.js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: path + 'reveal.js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },

        // Browser Console Speaker Notes
        { src: path + 'js/console-notes.js', condition: function() { return !!document.body.classList; } },

	    { src: path + 'reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
        { src: path + 'reveal.js/plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
        { src: path + 'reveal.js/plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
    ]
});