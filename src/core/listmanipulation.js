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