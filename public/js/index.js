const addToCardBtn = document.querySelectorAll(".add-card");
const Container = document.querySelector(".cart-items");
const purchaseBtn = document.querySelector(".btn-purchase");
console.log(purchaseBtn);

const updateTotal = () => {
  const total = document.querySelector(".cart-total-price");
  const items = Array.from(Container.children);
  let finalTotal = 0;
  items.forEach((item) => {
    const price = parseFloat(item.childNodes[3].innerText);
    const quantity = item.childNodes[5].childNodes[1].value;
    finalTotal += price * quantity;
  });
  total.innerHTML = `$${finalTotal}`;
};

const createItem = (btn) => {
  const title = btn.parentElement.previousElementSibling.innerHTML;
  const price = btn.previousElementSibling.innerHTML;
  const itemContainer = document.createElement("div");
  itemContainer.classList += "item";
  const itemHtml = `
  <h4 class="item-name">${title}</h4>
  <p class="item-price">${price}</p>
  <div class="actions">
    <input type="number" name="quantity" class="quantity" value="1" min="1" />
    <button class="remove-btn">Remove</button>
  </div>
  `;
  itemContainer.innerHTML = itemHtml;
  return itemContainer;
};

const purchaseClicked = () => {
  const price = parseFloat(
    document.querySelector(".cart-total-price").innerText.replace("$", "")
  );
  fetch("/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ price: price }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (session) {
      return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(function (result) {
      // If redirectToCheckout fails due to a browser or network
      // error, you should display the localized error message to your
      // customer using error.message.
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
};

addToCardBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const itemContainer = createItem(btn);
    Container.appendChild(itemContainer);
    updateTotal();
    const removeBtn = itemContainer.childNodes[5].childNodes[3];
    removeBtn.addEventListener("click", () => {
      removeBtn.parentNode.parentNode.remove();
      updateTotal();
    });
    const quantityInput = itemContainer.childNodes[5].childNodes[1];
    quantityInput.addEventListener("change", () => {
      updateTotal();
    });
  });
});

purchaseBtn.addEventListener("click", () => {
  purchaseClicked();
});

paypal.Button.render(
  {
    // Configure environment
    env: "sandbox",
    client: {
      sandbox: "demo_sandbox_client_id",
      production: "demo_production_client_id",
    },
    // Customize button (optional)
    locale: "en_US",
    style: {
      size: "small",
      color: "gold",
      shape: "pill",
    },

    // Enable Pay Now checkout flow (optional)
    commit: true,

    // Set up a payment
    payment: function (data, actions) {
      return actions.payment.create({
        transactions: [
          {
            amount: {
              total: "0.01",
              currency: "USD",
            },
          },
        ],
      });
    },
    // Execute the payment
    onAuthorize: function (data, actions) {
      return actions.payment.execute().then(function () {
        // Show a confirmation message to the buyer
        window.alert("Thank you for your purchase!");
      });
    },
  },
  "#paypal-button"
);
