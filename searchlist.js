$.fn.searchlist = function (option) {
  return this.each(function() {
    el = this;
    $.getJSON( option["source"], function( data ) {
      $.each(data, function(i, datael) {

        // clone prototype element to new one
        $listel = $(el).find(".sl-prototype-element")
          .clone()
          .removeClass("sl-prototype-element")
          .addClass("sl-element")
          .appendTo(el);

        // Fill with data content
        $listel
          .find("[data-value]")
          .each(function() {
            $(this).html(datael[$(this).attr("data-value")]);
          });

      }); // end data loop
    }); // end ajax request
  }); // end searchlist element loop
}; // end prototype