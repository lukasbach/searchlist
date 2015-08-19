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

      // mark/unmark previously found elements
      if($(this).hasClass("searchFound")) {
        $(this).removeClass("searchPreviouslyNotFound");
      }
      else if($(this).hasClass("searchNotFound")) {
        $(this).addClass("searchPreviouslyNotFound");
      }

      // mark found/not found elements with class
      if(matches != 0) {
        $(this).addClass("searchFound").removeClass("searchNotFound");
      } else {
        $(this).addClass("searchNotFound").removeClass("searchFound");
      }
  
      // animation code
      if(option["animate"] == "true" && option["hideUnrelevants"] == "true") {

        // fade previously hidden, but now found elements in
        if($(this).hasClass("searchFound") && $(this).hasClass("searchPreviouslyNotFound")) {
            var autoHeight = 
              $(this).css('height', 'auto').outerHeight();
            $(this).height(0).animate({height: autoHeight, opacity: 1}, 500, function() {
              $(this).removeAttr("style");
            });
        }

        // fade previously shown, but now not the search keywords matching elements out
        if($(this).hasClass("searchNotFound") && !$(this).hasClass("searchPreviouslyNotFound")) {
          $(this).animate({height: 0, opacity: 0, "padding-top": 0, "padding-bottom": 0}, 500, function() {
            $(this).removeAttr("style");
            $(this).css("display", "none");
          });
        }
        
      } // end animation code

    });

  // always show found search elements
  $(el).find(".sl-element.searchFound").css("display", "block");


  // hide wrong elements (fallback in case animation is turned off)
  if(option["animate"] != "true") {
    if(option["hideUnrelevants"] == "true") {
      $(el).find(".sl-element.searchNotFound").css("display", "none");
    } else {
      $(el).find(".sl-element.searchNotFound").css("display", "block");
    }
  }
} // end search function