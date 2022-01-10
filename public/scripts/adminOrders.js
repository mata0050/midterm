// Hide and show Create Menu item

$(document).ready(function () {
  //show Create Item for Menu
  $("#add-item-menu").on("click", function () {
    $("#create-menu-item-form").css("display", "flex");
  });


  // close Create Item Menu
  $('#close').on("click", function () {
    $("#create-menu-item-form").css("display", "none");
  })
});
