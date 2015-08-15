/*
 *    Allowed options:
 *      "source": Path to the json file that's being used for the list
 *        e.g. "path/to/file.json"
 *      "context": JSON path to the list
 *        e.g. "json.list.path
 *        for the list {json:{list:{path:[listel,listlel,listel]}}}
 */

$.fn.searchlist = function (functionname, option) {
  return this.each(function() {
    return window[functionname](option, this);
  });
}; // end prototype

function initialize(option, el) {
  $.getJSON( option["source"], function( data ) {

    // bring data into context
    $.each(option["context"].split("."), function(i, contextpath) {
      data = data[contextpath];
    });

    // iterate over data, create list elements
    $.each(data, function(i, datael) {

      // clone prototype element to new one
      $listel = $(el).find(".sl-prototype-element")
        .clone()
        .removeClass("sl-prototype-element")
        .addClass("sl-element")
        .appendTo(el);

      // fill with data content
      $listel
        .find("[data-value]")
        .each(function() {
          listelValue = datael;

          // in case of sub elements, go through json objects to target element
          $.each($(this).attr("data-value").split("."), function(i, valuepath) {
            listelValue = listelValue[valuepath];
          });

          // feed value into html
          $(this).html(listelValue);
        });

    }); // end data loop
  }); // end ajax request
} // end init function

$(document).ready(function() {
  $("<style type='text/css'>.sl-prototype-element {display: none}</style>").appendTo("head");
});