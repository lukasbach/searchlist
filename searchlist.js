$.fn.searchlist = function (functionname, option) {
  return this.each(function() {
    return window[functionname](option, this);
  });
}; // end prototype


 /*    Allowed options:
 *      "source": Path to the json file that's being used for the list
 *        e.g. "path/to/file.json"
 *      "context": JSON path to the list
 *        e.g. "json.list.path
 *        for the list {json:{list:{path:[listel,listlel,listel]}}}
 */
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


 /*    Allowed options:
 *      "keywords": Keywords, divided by spaces
 *        e.g. "javascript php something"
 *      "hideUnrelevants": If true, list elements not matching the search keywords
 *        will be hidden
 *      "caseSensitive": If true, it will matter wether keywords are lower or
 *        uppercase
 */
function search(option, el) {
  var defaults = {
    "keywords": option["keywords"] || "",
    "hideUnrelevants": option["hideUnrelevants"] || "true",
    "caseSensitive": option["caseSensitive"] || "false"
  }

  var option = $.extend({}, defaults, option);

  $el = $(el)
    .find(".sl-element")
    .removeClass("searchFound")
    .removeClass("searchNotFound")
    .each(function() {
      matches = 0;

      $(this)
        .find("[data-value]")
        .each(function() {
          // iterate over value elements in listelement
          var valelement = $(this);
          $.each(option["keywords"].split(" "), function(i, keyword) {
            // iterate over list of keywords
            thisMatches = valelement.html().match(option["caseSensitive"] == "true" ? keyword : new RegExp(keyword, "i"));
            matches += thisMatches == null ? 0 : thisMatches.length;
          });
        });

      if(matches != 0) {
        $(this).addClass("searchFound");
      } else {
        $(this).addClass("searchNotFound");
      }
    });

  $(el).find(".sl-element.searchFound").css("display", "block");

  if(option["hideUnrelevants"] == "true") {
    $(el).find(".sl-element.searchNotFound").css("display", "none");
  } else {
    $(el).find(".sl-element.searchNotFound").css("display", "block");
  }
}

$(document).ready(function() {
  $("<style type='text/css'>.sl-prototype-element {display: none}</style>").appendTo("head");
});