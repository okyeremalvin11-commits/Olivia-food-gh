// ====== Cart Setup ======
let cart = [];
let mealAddons = {}; // Track addons for each meal item

// Select DOM elements
const cartItemsEl = document.getElementById('cart-items');
const totalEl = document.getElementById('total');
const cancelBtn = document.getElementById('cancel-btn');
const proceedBtn = document.getElementById('proceed-btn');
const successMessage = document.getElementById('success-message');

// Hide success message initially
successMessage.style.display = 'none';

// ====== Customization Toggle ======
document.addEventListener('DOMContentLoaded', function() {
  // Handle customization toggle buttons
  const toggleButtons = document.querySelectorAll('.customization-toggle');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const panel = button.nextElementSibling;
      if (panel && panel.classList.contains('customization-panel')) {
        panel.classList.toggle('show');
        button.textContent = panel.classList.contains('show') ? '- Hide Extras' : '+ Add Extras';
      }
    });
  });

  // Handle addon selection
  const addonItems = document.querySelectorAll('.addon-item');
  
  addonItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const category = item.closest('.addon-options').getAttribute('data-category');
      const mealItem = item.closest('.menu-item');
      const mealItemId = mealItem ? mealItem.dataset.itemId : null;
      
      // Unselect other items in same category
      const category_items = item.closest('.addon-options').querySelectorAll('.addon-item');
      category_items.forEach(i => {
        if (i.getAttribute('data-category') !== category) return;
        i.classList.remove('selected');
      });
      
      // Toggle selection
      item.classList.toggle('selected');
      
      // Update preview
      updateAddonPreview(mealItem);
    });
  });

  updateCart();
});

// ====== Update Addon Preview ======
function updateAddonPreview(mealItem) {
  const panel = mealItem.querySelector('.customization-panel');
  const previewDiv = panel.querySelector('#selected-addons-preview');
  const addonsList = panel.querySelector('#addons-list');
  
  const selectedAddons = panel.querySelectorAll('.addon-item.selected');
  
  addonsList.innerHTML = '';
  let hasMore = false;
  
  selectedAddons.forEach(addon => {
    const tag = document.createElement('span');
    tag.className = 'addon-tag';
    tag.textContent = addon.getAttribute('data-name');
    addonsList.appendChild(tag);
    hasMore = true;
  });
  
  previewDiv.style.display = hasMore ? 'block' : 'none';
}

// ====== Get Selected Addons ======
function getSelectedAddons(mealItem) {
  const panel = mealItem.querySelector('.customization-panel');
  if (!panel) return { addons: [], extraCost: 0, description: '' };
  
  const selectedAddons = panel.querySelectorAll('.addon-item.selected');
  const addons = [];
  let extraCost = 0;
  
  selectedAddons.forEach(addon => {
    const name = addon.getAttribute('data-name');
    const price = parseFloat(addon.getAttribute('data-price'));
    addons.push(name);
    extraCost += price;
  });
  
  const description = addons.length > 0 ? ' + ' + addons.join(', ') : '';
  
  return { addons, extraCost, description };
}

// ====== Add to Cart ======
const addButtons = document.querySelectorAll('.add-to-cart');

addButtons.forEach(button => {
  button.addEventListener('click', () => {
    const menuItem = button.closest('.menu-item');
    const baseLabel = menuItem.querySelector('.label').innerText;
    const priceText = menuItem.querySelector('.price').innerText;
    const basePrice = parseFloat(priceText.replace('GH₵', ''));
    
    // Get selected addons
    const { addons, extraCost, description } = getSelectedAddons(menuItem);
    
    // Create complete item name with addons
    const fullName = baseLabel + description;
    const totalPrice = basePrice + extraCost;
    
    // Add item to cart with proper structure
    const existingItem = cart.find(item => item.name === fullName);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice = existingItem.quantity * totalPrice;
    } else {
      cart.push({ 
        name: fullName,
        basePrice: basePrice,
        extraCost: extraCost,
        price: totalPrice,
        quantity: 1,
        totalPrice: totalPrice,
        addons: addons
      });
    }
    
    // Update cart display
    updateCart();
    
    // Reset customization panel
    const panel = menuItem.querySelector('.customization-panel');
    if (panel) {
      panel.querySelectorAll('.addon-item').forEach(addon => addon.classList.remove('selected'));
      panel.querySelectorAll('#selected-addons-preview').forEach(preview => preview.style.display = 'none');
      panel.querySelectorAll('#addons-list').forEach(list => list.innerHTML = '');
      const toggleBtn = menuItem.querySelector('.customization-toggle');
      if (toggleBtn) {
        toggleBtn.textContent = '+ Add Extras';
        panel.classList.remove('show');
      }
    }
    
    // Show success feedback
    button.textContent = 'Added!';
    button.style.background = 'var(--accent)';
    setTimeout(() => {
      button.textContent = 'Add to Cart';
      button.style.background = '';
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
  
  // Show/hide entire cart section based on items
  const cartSection = document.querySelector('.cart-section');
  if (cart.length === 0) {
    cartSection.classList.remove('show');
  } else {
    cartSection.classList.add('show');
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