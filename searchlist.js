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
      createElementDom(el, datael, $(el).find(".sl-prototype-element[data-elementtype='default']")).appendTo(el);

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
            var autoHeight = $(this).css('height', 'auto').height();
            $(this).height(0).animate({height: autoHeight, opacity: 1}, 500, function() {
              $(this).removeAttr("style");
            });
        }

        // fade previously shown, but now not the search keywords matching elements out
        if($(this).hasClass("searchNotFound") && !$(this).hasClass("searchPreviouslyNotFound")) {
          $(this).animate({height: 0, opacity: 0}, 500, function() {
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
  createElementDom(el, option["value"], $(el).find(".sl-prototype-element[data-elementtype='default']")).appendTo(el);
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



/*  function modifyElement    
 *
 *    Allowed options:
 *      "key": Can be either the key in case the list is an object or the position
 *        number where the element being modified is // TODO
 *        e.g. 3 or "hello"
 *      "element": Alternativly you can hand a element as argument, which will
          be modified
 *      "data": New data, that will overwrite the old data; Note that missing elements
 *        will use the old data, so not every piece of data must be in this argument
 */
function modifyElement(option, el) {
  // get specified element
  if("key" in option) {
    var element = $(el).find(".sl-element:not(.sl-prototype-element):nth-child(" + String( option["key"] + 1 ) + ")");
  } else if("element" in option) {
    var element = $(option["element"]);
  }

  // put old and new data intro one array
  var data = $.extend(true, jQuery.parseJSON(element.attr("data-elementdata")), option["data"]);

  // create new element and insert it
  createElementDom(
      el, 
      data, 
      $(el).find(".sl-prototype-element[data-elementtype='" + element.attr("data-elementtype") + "']")
    )
    .insertAfter(element);

  // remove elemnt with old data
  element.remove();
}



/*  function transformElement    
 *
 *    Allowed options:
 *      "transformedElement"
 *      "transformPrototype"
 */
function transformElement(option, el) {
  previousElement = $(option["transformedElement"]).prev();
  elementdata = jQuery.parseJSON($(option["transformedElement"]).attr("data-elementdata"));
  $(option["transformedElement"]).remove();
  createElementDom(el, elementdata, option["transformPrototype"])
    .insertAfter(previousElement);
}



/*  function sortList    
 *
 *    Allowed options:
 *      "sortkey"
 *      "direction"; either asc or desc
 */
function sortList(option, el) {
  // sort all elements
  var sortedElements = sortElements($(el).find(".sl-element:not(.sl-prototype-element)"), option["sortkey"], option["direction"], el);
  console.log(sortedElements);
  
  // remove old elements
  $(el).find(".sl-element.unsorted").remove();

  // insert new elements
  $(el).append(sortedElements);

  // create array from sortkeys
  // Old function:
  /*var sortarray = []
  $(el).find(".sl-element").each(function(i) {
    $(this).attr("data-index", i);
    sortarray.push({
      index: i, 
      value: $(this).find("[data-value='" + option["sortkey"] + "']").html(),
      element: $(this).addClass("unsorted")
    });
  });

  // sort array
  sortarray.sort(function(a, b) {
    if(typeof a.value == "string") {
      var aName = a.value.toLowerCase();
      var bName = b.value.toLowerCase(); 
      if(option["direction"] == "desc") 
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
      else 
        return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
    } // TODO
  });

  // apply sorting to dom
  $.each(sortarray, function(i, sortelement) {
    // recreate element
    elementdata = jQuery.parseJSON($(sortelement["element"]).attr("data-elementdata"));
    createElementDom(el, elementdata, $(el).find(".sl-prototype-element[data-elementtype='" +  $(sortelement["element"]).attr("data-elementtype") + "']"))
      .appendTo($(el));
    /*sortelement["element"]
      .clone()
      .removeClass("unsorted")
      .appendTo($(el));
  });

  // remove old temporary elements
  $(el).find(".sl-element.unsorted").remove();*/
}



/*  function groupList    
 *
 *    Allowed options:
 *      "groupkey"
 *      "sortdirection"; either asc or desc
 */
function groupList(option, el) {
  var groups = [];

  // iterate over elements to sort them into their groups
  $(el).find(".sl-element").each(function(){
    // get group name
    var groupname = getValueFromJson($(this).attr("data-elementdata"), option["groupkey"]);

    console.log(groups);

    // create group if not yet existing
    if(!(groups.indexOf(groupname) >= 0)) {
      groups.push(groupname);
      $("<div class='sl-group'></div>")
        .attr("data-groupname", groupname)
        .appendTo($(el));
    }

    // push elements into their corresponding groups
    $(this).appendTo($(el).find(".sl-group[data-groupname='" + groupname + "']"))
  });
}



/*  function groupList    
 *
 *    Allowed options: none
 */
function unGroup(option, el) {
  // replace all list elements in groups back to main element
  $(el)
    .find(".sl-group .sl-element")
    .appendTo(el);

  // Remove all (now empty) group elements
  $(el)
    .find(".sl-group")
    .remove();
}




/*  function moveUp    
 *
 *    Allowed options:
 *      "key": Can be either the key in case the list is an object or the position
 *        number where the element being moved is // TODO
 *        e.g. 3 or "hello"
 *      "element": Alternativly you can hand a element as argument, which will
          be moved
 */
function moveUp(option, el) {
  if("key" in option) {
    element = $(el).find(".sl-element:not(.sl-prototype-element):nth-child(" + String( option["key"] + 1 ) + ")");
  } else if("element" in option) {
    element = $(option["element"]);
  }

  element.insertBefore(element.prev(".sl-element:not(.sl-prototype-element)"));
}



/*  function moveDown    
 *
 *    Allowed options:
 *      "key": Can be either the key in case the list is an object or the position
 *        number where the element being moved is // TODO
 *        e.g. 3 or "hello"
 *      "element": Alternativly you can hand a element as argument, which will
          be moved
 */
function moveDown(option, el) {
  if("key" in option) {
    element = $(el).find(".sl-element:not(.sl-prototype-element):nth-child(" + String( option["key"] + 1 ) + ")");
  } else if("element" in option) {
    element = $(option["element"]);
  }

  element.insertAfter(element.next(".sl-element:not(.sl-prototype-element)"));
}



// PRIVATE
function createElementDom(el, datael, prototypeelement) {
  // clone prototype element to new one
  var $listel = $(prototypeelement)
    .clone()
    .removeClass("sl-prototype-element")
    .removeClass("sl-prototype-transform-element")
    .addClass("sl-element")
    .attr("data-elementdata", JSON.stringify(datael));

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
      if($(this).is("[data-putvalue]") && $(this).attr("data-putvalue") != "html") {
        $(this).attr($(this).attr("data-putvalue"), listelValue);
      } else {
        $(this).html(listelValue);
      }
    });

  // transform events
  $listel.find("[data-event-transform]").click(function() {
    //$(el).searchlist("transformElement", {transformedElement:$listel,transformPrototype:$(el).find("#" + $(this).attr("data-transform"))});
    transformElement({
      transformedElement:$listel,
      transformPrototype:$(el).find(".sl-prototype-element[data-elementtype='" + $(this).attr("data-event-transform") + "']")
    }, el);
  });

  // other events
  $listel.find("[data-event]").click(function() {
    // EVENT apply changes
    //  looks through the element for changed values and applies them on the list
    if($(this).attr("data-event") == "applychanges") {
      createElementDom(el, getDataFromElement($listel), $(el).find(".sl-prototype-element[data-elementtype='default']"))
        .insertAfter($listel);
      $listel.remove();
    }
    // EVENT removeElement
    //  removes the current element
    else if($(this).attr("data-event") == "removeElement") {
      $listel.remove();
    }
    // EVENT moveUp
    else if($(this).attr("data-event") == "moveUp") {
      moveUp({element: $listel}, el);
    }
    // EVENT moveDown
    else if($(this).attr("data-event") == "moveDown") {
      moveDown({element: $listel}, el);
    }
  });

  return $listel;
}

// PRIVATE
function getDataFromElement(element) {
  obj = {};
  $(element)
    .find("[data-value]")
    .each(function( ){
    var $el = $(this), 
        name = $(this).attr("data-value"), 
        key, k, i, o, val
    ;

    key = name;

    //val = $el.val() || '';

    // read data into object
    if($(this).is("[data-putvalue]") && $(this).attr("data-putvalue") != "html" && $(this).attr("data-putvalue") != "value") {
      val = $(this).attr($(this).attr("data-putvalue"));
    } else if($(this).attr("data-putvalue") == "value") {
      val = $(this).val();
    } else {
      val = $(this).html();
    }


    k = key.split('.'); o = obj;
    while ( k.length )
    {
        i = k.shift( );
        if ( k.length ) 
        {
            if ( !o.hasOwnProperty( i ) ) o[ i ] = /^\d+$/.test( k[0] ) ? [ ] : { };
            o = o[ i ];
        }
        else 
        {
            o[ i ] = val;
        }
    }
  });

  return obj;
}

// PRIVATE
function sortElements(elements, sortkey, direction, el) {
  // create array from sortkeys
  var sortarray = []
  elements.each(function(i) {
    $(this).attr("data-index", i);
    sortarray.push({
      index: i, 
      value: $(this).find("[data-value='" + sortkey + "']").html(),
      element: $(this).addClass("unsorted")
    });
  });

  // sort array
  sortarray.sort(function(a, b) {
    if(typeof a.value == "string") {
      var aName = a.value.toLowerCase();
      var bName = b.value.toLowerCase(); 
      if(direction == "desc") 
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
      else 
        return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
    } // TODO
  });

  // apply sorting to dom
  var sortedElements = $("<div class='sortcontainer'></div>");
  $.each(sortarray, function(i, sortelement) {
    // recreate element
    elementdata = jQuery.parseJSON($(sortelement["element"]).attr("data-elementdata"));
    $(createElementDom(el, elementdata, $(el).find(".sl-prototype-element[data-elementtype='" +  $(sortelement["element"]).attr("data-elementtype") + "']")))
      .appendTo($(sortedElements));
  });

  // return sorted elements
  return sortedElements.find(".sl-element");
}
/*function ggetDataFromElement(element) {
  obj = {};
  $(element)
    .find("[data-value]")
    .each(function() {
      // create object node
      valueObj = {};
      currentValueObj = valueObj;
      $.each($(this).attr("data-value").split("."), function(i, objpath) {
        currentValueObj[objpath] = {};
        currentValueObj = currentValueObj[objpath];
      });

      // read data into object
      if($(this).is("[data-putvalue]") && $(this).attr("data-putvalue") != "html") {
        currentValueObj = $(this).attr($(this).attr("data-putvalue"));
      } else {
        currentValueObj = $(this).html();
      }

      console.log(currentValueObj);

      // combine with previous gathered data
      obj = $.extend(true, {}, obj, valueObj);
    });

  return obj;
}*/

// PRIVATE
function getValueFromObject(obj, key) {
  listelValue = obj;

  // in case of sub elements, go through json objects to target element
  $.each(key.split("."), function(i, valuepath) {
    listelValue = listelValue[valuepath];
  });

  return listelValue;
}
function getValueFromJson(json, key) {
  return getValueFromObject($.parseJSON(json), key);
}

$(document).ready(function() {
  $("<style type='text/css'>.sl-prototype-element, .sl-prototype-transform-element {display: none}</style>").appendTo("head");
});