const addItemsToSumary = () => {
  $(".summary-details").html("");

  let totalQuantity = 0;
  let totalPrice = 0;
  let totalTime = 0;

  const items = JSON.parse(localStorage.getItem("order"));
  for (let itemID in items) {
    const menuItem = $("body").find(`#${itemID}`);
    const name = menuItem.children("[data-name]").attr("data-name");
    const quantity = items[itemID];
    const price = menuItem.children("[data-price]").attr("data-price");
    const prepTime = menuItem.children("[data-time]").attr("data-time");
    console.log({ name, price, prepTime });

    totalQuantity += Number(quantity);
    totalPrice += price * quantity;
    totalTime += prepTime * quantity;

    const itemDetails = `
      <tr>
      <td>${name}</td>
      <td>${quantity}</td>
      <td>${(price / 100).toFixed(2)}</td>
      <td>${prepTime}</td>
      </tr>
    `;

    $(".summary-details").append(itemDetails);
  }

  const tableHead = `
  <tr>
  <th>Menu Item</th>
  <th>Quantity</th>
  <th>Price</th>
  <th>Prep time</th>
  </tr>
  `;
  $(".summary-details").prepend(tableHead);

  const total = `
    <tr id="total">
    <td>Total:</td>
    <td>${totalQuantity}</td>
    <td>${(totalPrice / 100).toFixed(2)}</td>
    <td>${totalTime}</td>
    </tr>
  `;
  $(".summary-details").append(total);
};

$(document).ready(function () {
  addItemsToSumary();

  // save user's selected menu items to local storage
  $(".order-btn").on("click", function (e) {
    const order = JSON.parse(localStorage.getItem("order")) || {};
    const menuItemID = $(this).parent().attr("id");
    let amount = order[menuItemID] || 0;
    amount = Number(amount) + 1;
    amount = JSON.stringify(amount);

    order[menuItemID] = amount;

    localStorage.setItem("order", JSON.stringify(order));
    addItemsToSumary();
    flash("Menu item added to order!", {
      bgColor: "#fe744d",
      ftColor: "black",
    });
  });

  // send user's selected menu items to POST /orders
  $("#place-order-btn").on("click", function (e) {
    if (localStorage.getItem("order")) {
      const data = JSON.parse(localStorage.getItem("order"));
      $.ajax("/orders", { method: "POST", data })
        .done((res) => {
          console.log(res);
          localStorage.clear();
          $("#order-summary").hide();
          addItemsToSumary();
          flash(
            "Order received! You will receive an SMS confirmation shortly!",
            {
              bgColor: "#962100",
              ftColor: "white",
              duration: 6000,
            }
          );
        })
        .fail(function (jqXHR, textStatus) {
          console.error("Request failed: " + textStatus);
        });
    }
  });

  // display order-summary
  $("#toggle-order-btn").on("click", function () {
    $("#order-summary").animate(
      {
        height: "toggle",
      },
      600
    );
  });
});
