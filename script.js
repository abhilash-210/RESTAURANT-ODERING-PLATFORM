const prices = Array(20).fill().map((_, i) => (i + 1) * 10);
const menuItemsDiv = document.getElementById("menuItems");

const foodItems = [
  { name: "🍕 chicken Pizza", price: 150 },
  { name: "🍔 Classic Burger", price: 120 },
  { name: "🍣 chicken mandi", price: 300 },
  { name: "🌮 Tacos", price: 100 },
  { name: "🍜 buttersoch icecream", price: 180 },
  { name: "🥗 Caesar Salad", price: 130 },
  { name: "🍝 Spaghetti Bolognese", price: 160 },
  { name: "🍩 Donuts", price: 80 },
  { name: "🍦 Ice Cream", price: 90 },
  { name: "🍗 Fried Chicken", price: 200 },
  { name: "🥪 Club Sandwich", price: 140 },
  { name: "🍤 Prawn Tempura", price: 220 },
  { name: "🍛 Butter Chicken", price: 250 },
  { name: "🥞 Pancakes", price: 110 },
  { name: "🍰 Chocolate Cake", price: 150 },
  { name: "🍚 Biryani", price: 210 },
  { name: "🥩 Steak", price: 350 },
  { name: "🍪 Cookies", price: 70 },
  { name: "🍹 Mojito", price: 120 },
  { name: "☕ Coffee", price: 60 }
];

foodItems.forEach((item, i) => {
  const div = document.createElement("div");
  div.className = "menu-item";
  div.innerHTML = `
    <span>${item.name} - ₹${item.price}</span>
    <div class="menu-controls">
      <input type="number" min="0" value="0" data-price="${item.price}" onchange="updateTotal()">
      <span class="item-total">₹0</span>
    </div>
  `;
  menuItemsDiv.appendChild(div);
});

function updateTotal() {
  let total = 0;
  document.querySelectorAll("#menu .menu-item").forEach(item => {
    const input = item.querySelector("input");
    const totalSpan = item.querySelector(".item-total");
    const qty = parseInt(input.value) || 0;
    const price = parseInt(input.dataset.price);
    const itemTotal = qty * price;
    total += itemTotal;
    totalSpan.innerText = `₹${itemTotal}`;
  });
  document.getElementById("total").innerText = "Total: ₹" + total;
}

function showPage(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

const faqs = [
  { q: "What are your opening hours?", a: "We are open from 9 AM to 11 PM every day." },
  { q: "Do you offer home delivery?", a: "Yes, we offer fast home delivery within a 5 km radius." },
  { q: "Is online payment available?", a: "Yes, we support all major UPI and card payments." },
  { q: "Are your ingredients fresh?", a: "Absolutely! We use only fresh and quality ingredients." },
  { q: "Do you serve vegetarian dishes?", a: "Yes, we have a wide range of vegetarian options." },
  { q: "Can I customize my order?", a: "Yes, mention it in special instructions while ordering." },
  { q: "Is contactless delivery available?", a: "Yes, we offer contactless delivery upon request." },
  { q: "Do you cater for parties?", a: "Yes, contact us for bulk and party orders." },
  { q: "What is your most popular dish?", a: "Our Chicken Biryani and Paneer Butter Masala are most loved." },
  { q: "Is parking available?", a: "Yes, we provide parking space for customers." },
  { q: "Do you have outdoor seating?", a: "Yes, outdoor and indoor both are available." },
  { q: "Can I pre-order food?", a: "Yes, pre-ordering is available via call or online." },
  { q: "Are your dishes spicy?", a: "We can adjust the spice level based on your preference." },
  { q: "Do you offer discounts?", a: "Yes, check our app or website for latest offers." },
  { q: "Can I order via WhatsApp?", a: "Yes, just drop a message on our number to order." },
];

const faqContainer = document.getElementById("faqContainer");
faqs.forEach((faq, i) => {
  const div = document.createElement("div");
  div.className = "faq-item";
  div.innerHTML = `<strong>${faq.q}</strong><div class="faq-answer">${faq.a}</div>`;
  div.onclick = () => {
    const answer = div.querySelector(".faq-answer");
    if (answer.classList.contains("visible")) {
      answer.classList.remove("visible");
      div.classList.remove("expanded");
    } else {
      answer.classList.add("visible");
      div.classList.add("expanded");
    }
  };
  faqContainer.appendChild(div);
});

// Modal popup functionality
const placeOrderBtn = document.getElementById("placeOrder");
const modalOverlay = document.getElementById("orderModal");
const modalContent = document.getElementById("modalContent");
const orderSummaryDiv = document.getElementById("orderSummary");
const closeModalBtn = document.getElementById("closeModalBtn");
const proceedPaymentBtn = document.getElementById("proceedPaymentBtn");

let selectedPaymentMethod = null;

placeOrderBtn.addEventListener("click", () => {
  // Gather order summary
  let summaryHTML = "";
  let totalAmount = 0;
  document.querySelectorAll("#menu .menu-item").forEach(item => {
    const input = item.querySelector("input");
    const qty = parseInt(input.value) || 0;
    if (qty > 0) {
      const itemName = item.querySelector("span").innerText;
      const price = parseInt(input.dataset.price);
      const itemTotal = qty * price;
      totalAmount += itemTotal;
      summaryHTML += `<p>${itemName} x ${qty} = ₹${itemTotal}</p>`;
    }
  });
  if (summaryHTML === "") {
    summaryHTML = "<p>No items selected.</p>";
    proceedPaymentBtn.style.display = "none";
  } else {
    summaryHTML += `<hr><p><strong>Total: ₹${totalAmount}</strong></p>`;
    proceedPaymentBtn.style.display = "inline-block";
  }
  orderSummaryDiv.innerHTML = summaryHTML;

  // Show modal with order summary
  modalContent.innerHTML = `
    <h2>Order Summary</h2>
    <div class="order-summary" id="orderSummary">${summaryHTML}</div>
    <button class="close-btn" id="closeModalBtn">Close</button>
    <button id="proceedPaymentBtn">Proceed with Payment</button>
  `;

  modalOverlay.style.display = "flex";

  // Re-assign buttons after innerHTML change
  assignModalButtons();
});

function assignModalButtons() {
  const closeBtn = document.getElementById("closeModalBtn");
  const proceedBtn = document.getElementById("proceedPaymentBtn");

  closeBtn.addEventListener("click", () => {
    modalOverlay.style.display = "none";
  });

  proceedBtn.addEventListener("click", () => {
    showPaymentMethods();
  });
}

function showPaymentMethods() {
  selectedPaymentMethod = null;
  // Get the total amount from the main page
  const totalText = document.getElementById("total").innerText;
  modalContent.innerHTML = `
    <h2>Select Payment Method</h2>
    <div style="font-size: 1.3em; font-weight: bold; margin-bottom: 15px; color: #fff;">Amount to Pay: ${totalText}</div>
    <div class="payment-methods">
<img src="images/qr.jpg" alt="QR Code" style="width: 225px; display: block; margin: 0 auto 20px auto;" />
      <button class="payment-method" data-method="Google Pay">Google Pay</button>
      <button class="payment-method" data-method="PhonePe">PhonePe</button>
      <button class="payment-method" data-method="FamPay">FamPay</button>
      <button class="payment-method" data-method="Paytm">Paytm</button>
    </div>
    <button id="confirmPaymentBtn">Confirm Payment</button>
  `;

  // Enlarge payment buttons by adding styles
  const style = document.createElement('style');
  style.innerHTML = `
    .payment-method {
      font-size: 1.1em !important;
      padding: 10px 20px !important;
      border-radius: 10px !important;
    }
  `;
  document.head.appendChild(style);

  const paymentButtons = modalContent.querySelectorAll(".payment-method");
  const confirmBtn = document.getElementById("confirmPaymentBtn");

  paymentButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      paymentButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedPaymentMethod = btn.getAttribute("data-method");
      confirmBtn.style.display = "block";
    });
  });

  confirmBtn.addEventListener("click", () => {
    if (selectedPaymentMethod) {
      processPayment();
    }
  });
}

function processPayment() {
  modalContent.innerHTML = `
    <h2>Processing Payment</h2>
    <div class="spinner"></div>
  `;

  setTimeout(() => {
    modalContent.innerHTML = `
      <h2>Payment Successful!</h2>
      <div class="payment-success-tick">&#10004;</div>
      <p>Your payment via ${selectedPaymentMethod} was successful.</p>
      <button class="close-btn" id="closeModalBtn">Close</button>
    `;

    // Clear the cart inputs and update total to 0 to refresh order history
    document.querySelectorAll("#menu .menu-item input[type='number']").forEach(input => {
      input.value = 0;
    });
    updateTotal();

    const closeBtn = document.getElementById("closeModalBtn");
    closeBtn.addEventListener("click", () => {
      modalOverlay.style.display = "none";
    });
  }, 5000);
}
