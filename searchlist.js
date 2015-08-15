/*
 * Basic prototype function
 * Runs the function given as first parameter and passes the argument "option"
 * to the specified function
 */
$.fn.searchlist = function (functionname, option) {
  return this.each(function() {
    return window[functionname](option, this);
  });
}; // end prototype


/*  function initialize    
 *
 *    Allowed options:
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

      // create one elements dom and put it into the lists dom
      createElementDom(el, datael).appendTo(el);

    }); // end data loop
  }); // end ajax request
} // end init function



/*  function search    
 *
 *    Allowed options:
 *      "keywords": Keywords, divided by spaces
 *        e.g. "javascript php something"
 *      "hideUnrelevants": If true, list elements not matching the search keywords
 *        will be hidden
 *      "caseSensitive": If true, it will matter wether keywords are lower or
 *        uppercase
 */
function search(option, el) {
  var defaults = {
    "keywords": "",
    "hideUnrelevants": "true",
    "caseSensitive": "false",
    "animate": "wrong"
  }

  var option = $.extend({}, defaults, option);

  if(option["animate"] == "true") {
    $(el).css("position", "relative");
  }

  $el = $(el)
    .find(".sl-element")
    .each(function() {
      var matches = 0;

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

      // mark found/not found elements with class
      if(matches != 0) {
        if($(this).hasClass("searchFound")) {
          $(this).addClass("previouslyFound");
        }
        $(this).addClass("searchFound").removeClass("searchNotFound");
      } else {
        $(this).addClass("searchNotFound").removeClass("searchFound").removeClass("previouslyFound");
      }
    });

  // always show found search elements
  $(el).find(".sl-element.searchFound").css("display", "block");

  // animation code
  if(option["animate"] == "true" && option["hideUnrelevants"] == "true") {
    // fade new search results in
    $(el).find(".sl-element.searchFound:not(.previouslyFound)").fadeIn(500);

    var offsetCount = 0;

    // iterate over listelements and temp save positioning
    $(el).find(".sl-element").each(function() {
      // old offset and width
      $(this).attr("data-defaultOffset", $($(this)[0]).offset().top);
      $(this).attr("data-defaultWidth", $($(this)[0]).outerWidth(true));

      if($(this).hasClass("searchFound")) {
        // new offset
        $(this).attr("data-newOffset", offsetCount);
        offsetCount += $(this).outerHeight(true);
      }
    });

    // iterate over listelements and apply old positioning as absolute position;
    // then animate into new position
    $(el).find(".sl-element").each(function() {
      $(this).css("position", "absolute");
      $(this).css("top", String($(this).attr("data-defaultOffset") - $(el).offset().top) + "px"); // - $(el).offset.top
      $(this).css("width", String($(this).attr("data-defaultWidth")) + "px");

      if($(this).hasClass("searchFound")) {
        // animate new position
        $(this).animate({top: $(this).attr("data-newOffset")}, 500, function() {
          $(this).removeAttr("style");
        });
      } else {
        // fade wrong elements out
        $(this).fadeOut(500, function() {
          $(this).removeAttr("style");
          $(this).css("display", "none");
        });
      }
    });

    // now hide wrong elements completely
    $(".sl-element.searchNotFound").css("display", "none");
  } // end animation code

  // hide wrong elements (fallback in case animation is turned off)
  if(option["animate"] != "true") {
    if(option["hideUnrelevants"] == "true") {
      $(el).find(".sl-element.searchNotFound").css("display", "none");
    } else {
      $(el).find(".sl-element.searchNotFound").css("display", "block");
    }
  }
} // end search function



/*  function injectElement    
 *
 *    Allowed options:
 *      "key": Can be either the key in case the list is an object or the position
 *        number where the element should be inserted; False if the element should
 *        be inserted at the end of the list // TODO
 *        e.g. 3 or "hello" or false
 *      "value": The element thats being inserted; Can be any valid variable, like
 *        String, Integer or Object
 *        e.g. "value" or 3 or true or {do:"something",and:"somethingelse"}
 */
function injectElement(option, el) {
  createElementDom(el, option["value"]).appendTo(el);
}



/*  function removeElement    
 *
 *    Allowed options:
 *      "key": Can be either the key in case the list is an object or the position
 *        number where the element being removed is // TODO
 *        e.g. 3 or "hello"
 *      "element": Alternativly you can hand a element as argument, which will
          be removed
 */
function removeElement(option, el) {
  if("key" in option) {
    $(el).find(".sl-element:not(.sl-prototype-element):nth-child(" + String( option["key"] + 1 ) + ")").remove();
  } else if("element" in option) {
    $(option["element"]).remove();
  }
}



// PRIVATE
function createElementDom(el, datael) {
  // clone prototype element to new one
  var $listel = $(el).find(".sl-prototype-element")
    .clone()
    .removeClass("sl-prototype-element")
    .addClass("sl-element");

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

  return $listel;
}


$(document).ready(function() {
  $("<style type='text/css'>.sl-prototype-element {display: none}</style>").appendTo("head");
});

//$(".searchlist).injectElement({value:{"country_id":"LOL","country_name":"LOLLAND"}});