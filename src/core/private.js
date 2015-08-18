function createElementDom(el, datael, prototypeelement, setClass) {
  // clone prototype element to new one
  var $listel = $(prototypeelement)
    .clone()
    .removeClass("sl-prototype-element")
    .removeClass("sl-prototype-transform-element")
    //.addClass("sl-element")
    .attr("data-elementdata", JSON.stringify(datael));

  // set class if supposed to do so
  if(setClass == true || !(typeof setClass !== 'undefined')) {
    $listel.addClass("sl-element");
  }

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
    $(createElementDom(el, elementdata, $(el).find(".sl-prototype-element[data-elementtype='" +  $(sortelement["element"]).attr("data-elementtype") + "']"), true))
      .appendTo($(sortedElements));
  });



  // return sorted elements
  return sortedElements.find(".sl-element");
}

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