/*  function interfaceAdd    
 *
 *    Allowed options:
 *      "interfaceElement"
 */
function interfaceAdd(option, el) {
  // Get elements with values
  var valueElements = option["interfaceElement"].find("[data-value]");

  // Fill list with values
  values = {};
  valueElements.each(function() {
  	if(!$(this).is("[data-getvalue]") || $(this).attr("data-getvalue") == "html") {
  		// get value from html
  		values[$(this).attr("data-value")] = $(this).html();
  	} else if ($(this).attr("data-getvalue") == "value") {
  		// get value using jquerys val api
  		//values[$(this).attr("data-value")] = $(this).val();
  		//values = $.merge(getObjectFromKey($(this).attr("data-value"), $(this).val()), values);
  		$.extend(true, values, getObjectFromKey($(this).attr("data-value"), $(this).val()));
  	} else {
  		// get value from specified attribute
  		values[$(this).attr("data-value")] = $(this).attr($(this).attr("data-getvalue"));
  	}
  });

  // Append item to list
  addElement({
  	data: values,
  	prototypeelement: $(el).find(".sl-prototype-element[data-elementtype=" + option["interfaceElement"].attr("data-elementtype") + "]")
  }, el);
}


/*  function interfacesInit    
 *
 */
function interfacesInit(option) {
	// get elements
	if("selector" in option) {
		var elements = $(option["selector"]);
	} else if("element" in option) {
		var elements = option["element"]
	} else {
		var elements = $(document);
	}

	// interfaceAdd
	elements.find(".sl-add-form [data-event=add-element]").click(function(e) {
		interfaceAdd(
			{
				interfaceElement: $(this).parent(".sl-add-form")
			}, 
			$($(this).parent(".sl-add-form").attr("data-searchlist"))
		);
	});
}