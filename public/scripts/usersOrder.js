const getPhoneNumber = () => {
  let numbers = [];
  while (numbers !== null && (numbers.length > 11 || numbers.length < 10)) {
    phoneNumber = prompt(
      "Please enter a valid phone number to receive SMS confirmation!",
      "+1"
    );
    if (phoneNumber === null) return null;
    numbers = phoneNumber.match(/\d+/g) || [];
    numbers = numbers.join("");
  }
  return phoneNumber;
};

const addItemsToSummary = () => {
  //reset the summary table
  $(".summary-details").html("");

  let totalQuantity = 0;
  let totalPrice = 0;
  let totalTime = 0;

  // get item data from local storage
  const items = JSON.parse(localStorage.getItem("order"));
  for (let itemID in items) {
    const menuItem = $("body").find(`#${itemID}`);
    const name = menuItem
      .children(".menu-item-info")
      .children("[data-name]")
      .attr("data-name");
    const quantity = items[itemID];
    const price = menuItem
      .children(".menu-item-info")
      .children("[data-price]")
      .attr("data-price");
    const prepTime = menuItem
      .children(".menu-item-info")
      .children("[data-time]")
      .attr("data-time");

    totalQuantity += Number(quantity);
    totalPrice += price * quantity;
    totalTime += prepTime * quantity;

    // create HTML elements for selected items
    const itemDetails = `
    <tr id=${itemID}>
    <td>${name}</td>
    <td>${quantity}</td>
    <td>${(price / 100).toFixed(2)}</td>
    <td></td>
    <td class="item-remove-btn">❌</td>
    </tr>
    `;

    $(".summary-details").append(itemDetails);
  }

  if (totalTime > 100) {
    totalTime = 110;
  }

  const tableHead = `
  <tr>
  <th>Menu Item</th>
  <th>Quantity</th>
  <th>Price</th>
  <th>Total prep time</th>
  </tr>
  `;
  $(".summary-details").prepend(tableHead);

  const total = `
    <tr id="total">
    <td>Total:</td>
    <td>${totalQuantity}</td>
    <td>${(totalPrice / 100).toFixed(2)}</td>
    <td id="prep-time">${Math.floor(totalTime / 60)}h ${
    totalTime - 60 * Math.floor(totalTime / 60)
  } min</td>
    </tr>
  `;
  $(".summary-details").append(total);

  // remove item from order
  $(".item-remove-btn").on("click", function () {
    delete items[$(this).parent().attr("id")];
    localStorage.clear();
    if (Object.keys(items).length !== 0) {
      localStorage.setItem("order", JSON.stringify(items));
    }
    flash("Menu item removed!", {
      bgColor: "#fe744d",
      ftColor: "black",
    });
    addItemsToSummary();
  });
};

$(document).ready(function () {
  addItemsToSummary();

  // save user's selected menu items to local storage
  $(".order-btn").on("click", function (e) {
    const order = JSON.parse(localStorage.getItem("order")) || {};
    const menuItemID = $(this).parent().parent().attr("id");
    let amount = order[menuItemID] || 0;
    amount = Number(amount) + 1;
    amount = JSON.stringify(amount);

    order[menuItemID] = amount;

    localStorage.setItem("order", JSON.stringify(order));
    addItemsToSummary();
    flash("Menu item added to order!", {
      bgColor: "#ffc529",
      ftColor: "black",
    });
  });

  // send user's selected menu items to POST /orders
  $("#place-order-btn").on("click", function (e) {
    let userPhoneNumber = "";
    if (localStorage.getItem("order") && (userPhoneNumber = getPhoneNumber())) {
      const newOrder = JSON.parse(localStorage.getItem("order"));
      const prepTime = $("#prep-time").text();
      const data = { ...newOrder, userPhoneNumber, prepTime };
      $.ajax("/orders", { method: "POST", data })
        .done((res) => {
          console.log(res);
          localStorage.clear();
          $("#order-summary").hide();
          addItemsToSummary();
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
      500
    );
  });
});
