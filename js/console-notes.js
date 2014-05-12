/**
 * Handles writting the notes to the browser console in synchronization with the reveal.js
 */
var ConsoleNotes = (function() {

  function log(event) {
	  // event.previousSlide, event.currentSlide, event.indexh, event.indexv
	  var notes = event.currentSlide.querySelector(".notes");

		if (notes) {
      var html = notes.innerHTML;
      if (true == notes.getAttrubute("data-trim")) {
        html = html.replace(/\n\s+/g, "\n");
      }
	    console.info(html);
	  }
  }
	
  // Fires when slide is changed
  Reveal.addEventListener("slidechanged", log);
})();
