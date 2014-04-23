// Full list of configuration options available here:
// https://github.com/hakimel/reveal.js#configuration
var queryHash = Reveal.getQueryHash();
Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    theme: queryHash.theme || 'sky',
    transition: queryHash.transition || 'default',
    dependencies: [
        { src: 'reveal.js/lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: 'reveal.js/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'reveal.js/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },

        // Browser Console Speaker Notes
        { src: 'js/console-notes.js', condition: function() { return !!document.body.classList; } },

		{ src: 'reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
        { src: 'reveal.js/plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
        { src: 'reveal.js/plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
    ]
});