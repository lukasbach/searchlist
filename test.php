<head>
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script><?php include("test/getjs.php"); ?></script>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.0/css/materialize.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.0/js/materialize.min.js"></script>

  <link rel="stylesheet/less" href="src/style/compact/compact.less">
  <script src="//localhost/frameworks/less.js/less-1.3.3.min.js"></script>


</head>

<div class="row">
  <div class="col s10 offset-s1 m6 offset-m3">
    Enter search:<br />
    <input type="text" class="searchbar"><br />
    <a href='javascript:$(".searchlist").searchlist("sortList", {sortkey:"country.country_name",direction:"desc"})'>Sort for name ascending</a><br />
    <a href='javascript:$(".searchlist").searchlist("sortList", {sortkey:"country.country_name",direction:"asc"})'>Sort for name descending</a><br />
    <a href='javascript:$(".searchlist").searchlist("sortList", {sortkey:"country.country_id",direction:"desc"})'>Sort for id ascending</a><br />
    <a href='javascript:$(".searchlist").searchlist("sortList", {sortkey:"country.country_id",direction:"asc"})'>Sort for id descending</a><br />
    <a href='javascript:$(".searchlist").searchlist("groupList", {groupkey:"country.group",headerprototype:"header"})'>Group</a><br />
    <a href='javascript:$(".searchlist").searchlist("unGroup", {})'>Ungroup</a><br />
  </div>
</div>

<div class="row">
  <div class="col searchlist sl-style compact s12 m8 l6 offset-m2 offset-l3">
    <div class="sl-prototype-element" data-elementtype="default">
      <a href="#!" class="right btn waves-effect light-blue" data-event-transform="edit">Edit</a>
      <div class="sl-element-header" data-value="country.country_name"></div>
      <div class="sl-element-second">
        Country ID: <span data-value="country.country_id"></span>
      </div>
    </div>
    <div class="sl-prototype-element" data-elementtype="edit">
      <input id="id" type="text" class="validate" data-value="country.country_id" data-putvalue="value">
      <label for="id">Country ID</label>
      <input id="name" type="text" class="validate" data-value="country.country_name" data-putvalue="value">
      <label for="name">Country Name</label>
        <div class="pull-right">
          <a href="#!" class="btn waves-effect light-blue" data-event-transform="default">Abort</a>
          <a href="#!" class="btn waves-effect light-blue" data-event="applychanges">Save</a>
          <a href="#!" class="btn waves-effect light-blue lighten-2" data-event="moveUp">Move up</a>
          <a href="#!" class="btn waves-effect light-blue lighten-2" data-event="moveDown">Move down</a>
          <a href="#!" class="btn waves-effect red" data-event="removeElement">Remove element</a>
        </div>
    </div>
    <div class="sl-prototype-element" data-elementtype="defaultt">
      <a href="#!" data-event-transform="transform1">Modify!</a><br />
      id: <span data-value="country.country_id"></span><br />
      name: <span data-value="country.country_name"></span>
    </div>
    <div class="sl-prototype-element" data-elementtype="transform1">
      <a href="#!" data-event-transform="default">Abort!</a> I've got different DOM than other elements, yay!<br />
       - id: <input data-value="country.country_id" data-putvalue="value"></input><br />
       - name: <input style="font-style:italic" data-value="country.country_name" data-putvalue="value"></input><br />
       <a href="#!" data-event="applychanges">Save changes</a>
       <a href="#!" data-event="removeElement">Remove element</a>
       <a href="#!" data-event="moveUp">Up</a>
       <a href="#!" data-event="moveDown">Down</a><br /><br />
    </div>
    <div class="sl-prototype-element" data-elementtype="header">
      <div class="sl-group-h"><span data-value="sl.group.name"></div>
    </div>
  </div>
</div>

<script>
  $(document).ready(function() {
    $(".searchlist").searchlist("initialize", {
      "source": "test/structure.json",
      "context": "countries"
    });
  });

  $(".searchbar").keyup(function() {
    $(".searchlist").searchlist("search", {"animate":"true","keywords":$(".searchbar").val()});
  })
</script>