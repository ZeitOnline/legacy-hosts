(function ($) {
	/*
	* Plugin fuer den Absendebutton in Scripten
	* @requires: jQuery > 1.6
	*/
    $.fn.quizSend = function () {

        return this.each(function () {
			var $radios = $(this).find("input[type='radio']"),
			$submits = $(this).find(".submitbutton");
			$radios.removeProp("checked");
			$submits.prop("disabled", "disabled").text("Bitte eine der Antworten auswählen");
			$radios.on("click", function(){
				$submits.removeProp("disabled").text("weiter");
				$radios.unbind("click");
			});
        });

    };

})(jQuery);
