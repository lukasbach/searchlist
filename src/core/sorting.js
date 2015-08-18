/*  function sortList    
 *
 *    Allowed options:
 *      "sortkey"
 *      "direction"; either asc or desc
 */
function sortList(option, el) {
  // if not grouped
  if(!$(el).hasClass("grouped")) {
    // sort all elements
    var sortedElements = sortElements($(el).find(".sl-element:not(.sl-prototype-element)"), option["sortkey"], option["direction"], el);
    
    // remove old elements
    $(el).find(".sl-element.unsorted").remove();

    // insert new elements
    $(el).append(sortedElements);
  } else {
    // if grouped
    $(el).find(".sl-group").each(function() {
      sortGroup({group: this, sortkey: option["sortkey"], direction: option["direction"]}, el);
    });
  }
}
