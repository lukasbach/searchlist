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