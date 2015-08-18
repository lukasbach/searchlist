$(document).ready(function() {
  $("<style type='text/css'>.sl-prototype-element, .sl-prototype-transform-element {display: none}</style>").appendTo("head");
});

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