$(document).ready(function () {
  $(".order-btn").on("click", function (e) {
    const order = JSON.parse(localStorage.getItem("order")) || {};
    const menuItemID = $(this).parent().attr("id");
    let amount = order[menuItemID] || 0;
    amount = Number(amount) + 1;
    amount = JSON.stringify(amount);

    order[menuItemID] = amount;

    localStorage.setItem("order", JSON.stringify(order));
    console.log(localStorage);
    flash("Menu item added to order!", {
      bgColor: "#fe744d",
      ftColor: "black",
    });
  });
  $("#place-order-btn").on("click", function (e) {
    const data = JSON.parse(localStorage.getItem("order"));
    $.ajax("/orders", { method: "POST", data })
      .done((res) => console.log(res))
      .fail(function (jqXHR, textStatus) {
        console.error("Request failed: " + textStatus);
      });
  });
});
