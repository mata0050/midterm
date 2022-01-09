console.log("rDDDDeact");
$(document).ready(function () {
  $(".order-btn").on("click", function (e) {
    const menuItemID = $(this).parent().attr("id");
    let amount = localStorage.getItem(menuItemID) || 0;
    amount = Number(amount) + 1;
    amount = JSON.stringify(amount);

    localStorage.setItem(menuItemID, amount);
    console.log(localStorage);
    flash("Menu item added to order!", {
      bgColor: "#fe744d",
      ftColor: "black",
    });
  });
});
