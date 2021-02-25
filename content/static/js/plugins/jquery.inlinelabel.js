(function ($) {
  $.fn.inlinelabel = function (defaults) {
    return this.each (function (uid) {
      var that = this;
      $(this).addClass("js");
      $("label", this).each(function (i) {
        $("input[id=" + $(this).attr('for') +"]", that).attr("value",$(this).html());
        $(this).hide();
      });

      $("input", this).focus(function() {
        if($(this).attr("value") == "" || $(this).attr("value") == $("label[for=" + $(this).attr('id') +"]", that).html()){
          $(this).val('');
        }
      });
    
      $("input", this).blur(function() {
        if($(this).attr("value") == ""){
          $(this).attr("value",$("label[for=" + $(this).attr('id') +"]", that).html());
        }
      });
    });
  };
})(jQuery);