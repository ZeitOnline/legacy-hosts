(function ($) {

    $.fn.quizSend = function (options) {
    
    
        var options = $.extend({
			sendable: true
		}, options);

		var enDisable = function() {
			if(options.sendable) {
				options.sendable = false;
				$("#weiter", that).attr("disabled", "disabled").val("Bitte eine der Antworten auswählen");
			} else {
				options.sendable = true;
				$("#weiter", that).attr("disabled", "").val("weiter");
			}
		};
        
        var that = this;
        
        return this.each(function () {
			$("input[type='radio']", that).attr("checked","");
			enDisable();
			$("input[type='radio']", that).bind("click", function(){
				enDisable();
				$("input[type='radio']", that).unbind("click");
			});
        });
        
    };

})(jQuery);