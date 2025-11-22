// ====== Cart Setup ======
let cart = [];

// Select DOM elements
const cartItemsEl = document.getElementById('cart-items');
const totalEl = document.getElementById('total');
const cancelBtn = document.getElementById('cancel-btn');
const proceedBtn = document.getElementById('proceed-btn');
const successMessage = document.getElementById('success-message');

// Hide success message initially
successMessage.style.display = 'none';

// ====== Add to Cart ======
const addButtons = document.querySelectorAll('.add-to-cart');

addButtons.forEach(button => {
  button.addEventListener('click', () => {
    const menuItem = button.closest('.menu-item');
    const name = menuItem.querySelector('.label').innerText;
    const priceText = menuItem.querySelector('.price').innerText;
    const price = parseFloat(priceText.replace('GH₵', ''));
    
    // Add item to cart with proper structure
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice = existingItem.quantity * price;
    } else {
      cart.push({ 
        name, 
        price,
        quantity: 1,
        totalPrice: price
      });
    }
    
    // Update cart display
    updateCart();
    
    // Show success feedback
    button.textContent = 'Added!';
    button.style.background = 'var(--yellow)';
    setTimeout(() => {
      button.textContent = 'Add to Cart';
      button.style.background = 'var(--orange)';
    }, 1000);
  });
});

// ====== Update Cart Display ======
function updateCart() {
  // Clear current cart list
  cartItemsEl.innerHTML = '';

  // Add each item
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.quantity}x ${item.name} - GH₵${item.totalPrice.toFixed(2)}</span>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;
    cartItemsEl.appendChild(li);
  });

  // Add remove event listeners
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      cart.splice(index, 1);
      updateCart();
    });
  });

  // Update total
  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  totalEl.innerText = `Total: GH₵${total.toFixed(2)}`;
  
  // Show/hide cart section based on items
  const cartSection = document.querySelector('.cart-items');
  if (cart.length === 0) {
    cartSection.style.display = 'none';
  } else {
    cartSection.style.display = 'block';
  }
}

// ====== Cancel Order ======
cancelBtn.addEventListener('click', () => {
  if(cart.length === 0){
    alert("Cart is already empty!");
    return;
  }
  if(confirm("Are you sure you want to cancel your order?")) {
    cart = [];
    updateCart();
    successMessage.style.display = 'none';
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-email').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('delivery-address').value = '';
    document.getElementById('special-notes').value = '';
    alert("Order cancelled!");
  }
});

// ====== Proceed to Payment ======
proceedBtn.addEventListener('click', () => {
  if(cart.length === 0){
    alert("Your cart is empty! Please add items first.");
    return;
  }

  // Get customer information
  const customerName = document.getElementById('customer-name').value;
  const customerEmail = document.getElementById('customer-email').value;
  const customerPhone = document.getElementById('customer-phone').value;
  const deliveryAddress = document.getElementById('delivery-address').value;
  const specialNotes = document.getElementById('special-notes').value;

  // Validate customer info
  if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
    alert("Please fill in all required customer information!");
    return;
  }

  // Prepare order data for payment page
  const orderData = {
    customerName,
    customerEmail, 
    customerPhone,
    deliveryAddress,
    specialNotes: specialNotes || 'None',
    cart: cart,
    total: cart.reduce((sum, item) => sum + item.totalPrice, 0),
    // Include cart items as text for Paystack
    cartItemsText: cart.map(item => `${item.quantity}x ${item.name}`).join(', ')
  };

  // Save to localStorage for payment page
  localStorage.setItem('orderData', JSON.stringify(orderData));
  localStorage.setItem('cartItems', JSON.stringify(cart));
  localStorage.setItem('cartTotal', orderData.total.toString());

  // Redirect to payment page
  window.location.href = 'payment.html';
});

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCart();
});