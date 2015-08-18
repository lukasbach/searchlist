/*  function groupList    
 *
 *    Allowed options:
 *      "groupkey"
 *      "sortdirection"; either asc or desc
 *      "headerprototype"
 *      "footerprototype"
 */
function groupList(option, el) {
  var groups = [];

  // iterate over elements to sort them into their groups
  $(el).find(".sl-element").each(function(){
    // get group name
    var groupname = getValueFromJson($(this).attr("data-elementdata"), option["groupkey"]);

    // create group if not yet existing
    if(!(groups.indexOf(groupname) >= 0)) {
      groups.push(groupname);
      
      var groupelement = $("<div class='sl-group'></div>")
        .attr("data-groupname", groupname)
        .appendTo($(el));

      // create data for header and footer
      if("headerprototype" in option || "footerprototype" in option) {
        var hfdata = {
          sl: {
            group: {
              name: groupname,
              count: 0
            }
          }
        };
      }

      // push header
      if("headerprototype" in option) {
        createElementDom(el, hfdata, $(el).find(".sl-prototype-element[data-elementtype='" +  option["headerprototype"] + "']"), false)
          .addClass("sl-groupheader")
          .appendTo(groupelement);
      }

      // push footer
      if("footerprototype" in option) {
        createElementDom(el, hfdata, $(el).find(".sl-prototype-element[data-elementtype='" +  option["footerprototype"] + "']"), false)
          .addClass("sl-groupfooter")
          .appendTo(groupelement);
      }
    }

    // find group element
    var groupelement = $(el).find(".sl-group[data-groupname='" + groupname + "']");

    // push elements into their corresponding groups
    if("footerprototype" in option) {
      $(this).insertBefore(groupelement.find(".sl-groupfooter"));
    } else {
      $(this).appendTo(groupelement);
    }
  });

  // Mark list as grouped
  $(el).addClass("grouped");
}


/*  function unGroup    
 *
 *    Allowed options: none
 */
function unGroup(option, el) {
  // replace all list elements in groups back to main element
  $(el)
    .find(".sl-group .sl-element")
    .appendTo(el);

  // Remove all (now empty) group elements and headers/footers
  $(el)
    .find(".sl-group, sl-groupheader, sl-groupfooter")
    .remove();

  // Mark list as ungrouped
  $(el).removeClass("grouped");
}


/*  function sortGroup    
 *
 *    Allowed options:
 *      "groupname"/"group"
 *      "sortkey"
 *      "direction"; either asc or desc
 */
function sortGroup(option, el) {
  // get group
  if(typeof option["groupname"] !== 'undefined') {
    // by name
    var group = $(el).find(".sl-group[data-groupname='" + option["groupname"] + "']");
  } else if(typeof option["group"] !== 'undefined') {
    // by element
    var group = $(option["group"]);
  } else {
    console.log("error");
    // TODO error
    }

  // sort all elements
  var sortedElements = sortElements(group.find(".sl-element:not(.sl-prototype-element)"), option["sortkey"], option["direction"], el);
  
  // remove old elements
  group.find(".sl-element.unsorted").remove();

  // insert new elements
  group.append(sortedElements);
}