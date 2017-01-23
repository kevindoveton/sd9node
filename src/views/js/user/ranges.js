function createRanges()
{
	var $document = $(document);
	var selector = '[data-rangeslider]';
	var $element = $(selector);
	// For ie8 support
	var textContent = ('textContent' in document) ? 'textContent' : 'innerText';

	// Basic rangeslider initialization
	$element.rangeslider({
		// Deactivate the feature detection
		polyfill: false,
		// Callback function
		onInit: function() {

		},

		// Callback function
		onSlide: function(position, value) {

			// // update level on mute text
			// var ch = (this.$element[0].id).substr(6);
			// volume = -(Math.pow(10,-((value-100)/100)*Math.log10(1+soundMin))-1)
			// volume = Math.round(volume*100)/100
			// $("#mute-"+ ch + " p").text(volume);

			// // prevent scrolling
			// $(document).on('scroll touchmove mousewheel', function(e) {
			// 	e.preventDefault();
			// 	e.stopPropagation();
			// 	return false;
			// })
		},

		// Callback function
		onSlideEnd: function(position, value) {
			var auxnumber = window.location.pathname.substring(5).replace ( /[^\d.]/g, '' )
			var ch = (this.$element[0].id).substr(6);
			// var value = value;
			volume = -(Math.pow(10,-((value-100)/100)*Math.log10(1+soundMin))-1)
			volume = Math.round(volume*100)/100
			console.log(ch);
			var obj = {
				"a":auxnumber,
				"c":ch,
				"v":volume
			};
			socket.emit("volume/aux", JSON.stringify(obj));

			// // reenable scrolling
			// $(document).off('scroll touchmove mousewheel');
		}
	});
};
