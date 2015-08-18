<head>
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script><?php include("test/getjs.php"); ?></script>
</head>

<input type="text" class="search"><br />
<a href='javascript:$(".searchlist").searchlist("sortList", {sortkey:"country.country_name",direction:"desc"})'>Sort for name ascending</a><br />
<a href='javascript:$(".searchlist").searchlist("sortList", {sortkey:"country.country_name",direction:"asc"})'>Sort for name descending</a><br />
<a href='javascript:$(".searchlist").searchlist("sortList", {sortkey:"country.country_id",direction:"desc"})'>Sort for id ascending</a><br />
<a href='javascript:$(".searchlist").searchlist("sortList", {sortkey:"country.country_id",direction:"asc"})'>Sort for id descending</a><br /><br />

<div class="searchlist">
  <div class="sl-prototype-element" data-elementtype="default">
    <a href="#!" data-event-transform="transform1">Modify!</a><br />
    id: <span data-value="country.country_id"></span><br />
    name: <span data-value="country.country_name"></span><br /><br />
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
    <h2>Group</g2>
      Name: <span data-value="sl.group.name"></span>, containing <span data-value="sl.group.elementcount"></span> Elements
      <br /><br />
  </div>
</div>

<script>
  $(document).ready(function() {
    $(".searchlist").searchlist("initialize", {
      "source": "test/structure.json",
      "context": "countries"
    });
  });

  $(".search").keyup(function() {
    $(".searchlist").searchlist("search", {"animate":"true","keywords":$(".search").val()});
  })
</script>