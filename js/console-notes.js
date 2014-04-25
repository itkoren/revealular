/**
 * Handles writting the notes to the browser console in synchronization with the reveal.js
 */
var ConsoleNotes = (function() {

    function log(event) {
	    // event.previousSlide, event.currentSlide, event.indexh, event.indexv
	    var notes = event.currentSlide.querySelector(".notes");
	    
		if (notes) {
	        console.info(notes.innerHTML.replace(/\n\s+/g, "\n"));
	    }
    }
	
    // Fires when slide is changed
    Reveal.addEventListener("slidechanged", log);
})();