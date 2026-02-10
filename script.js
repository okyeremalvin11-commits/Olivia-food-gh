// script.js - Complete solution for Olivia Delish

// ====== GLOBAL CART SYSTEM ======
let cart = [];

// ====== INITIALIZE ON PAGE LOAD ======
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    loadCart();
    
    // Check what page we're on and set it up
    setupPageBasedOnContent();
    
    // Setup common elements
    setupCommonElements();
    
    // Update cart badge immediately
    updateCartBadge();
});

// ====== DETECT AND SETUP PAGE TYPE ======
function setupPageBasedOnContent() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('waakye.html') || 
        currentPath.includes('jollof_rice.html') || 
        currentPath.includes('plain_rice.html') || 
        currentPath.includes('jollof_spaghetti.html') || 
        currentPath.includes('fried_rice.html') ||
        currentPath.includes('ampesi.html')) {
        // We're on a food item page
        setupFoodItemPage();
    } else if (currentPath.includes('menu.html')) {
        // We're on the main menu page
        setupMenuPage();
    } else if (currentPath.includes('payment.html')) {
        // We're on the payment page
        setupPaymentPage();
    } else if (currentPath.includes('index.html') || currentPath === '/') {
        // We're on the homepage
        setupHomePage();
    }
}

// ====== SETUP FOOD ITEM PAGE ======
function setupFoodItemPage() {
    console.log('Setting up food item page');
    
    // 1. Add cart badge to navigation
    addCartBadge();
    
    // 2. Add customer form to this page (if not already present)
    addCustomerFormToFoodPage();
    
    // 3. Setup the food item options (meat, stew, sides selection)
    setupFoodItemOptions();
    
    // 4. Setup the original Add to Cart button (the one near the food image)
    setupOriginalAddToCartButton();
    
    // 5. Show current cart items in summary
    updateFoodPageCartSummary();
}

// ====== ADD CUSTOMER FORM TO FOOD PAGE ======
function addCustomerFormToFoodPage() {
    // Check if form already exists
    if (document.querySelector('.customer-form-section')) {
        console.log('Customer form already exists');
        return;
    }
    
    console.log('Adding customer form to food page');
    
    // Create customer form HTML
    const formHTML = `
        <section class="customer-form-section" style="margin-top: 50px; padding: 30px; background: var(--dark-light); border-radius: 20px; box-shadow: var(--shadow);">
            <div class="form-header">
                <h2 style="color: var(--secondary); margin-bottom: 10px; text-align: center;">
                    📍 Delivery Information
                </h2>
                <p style="color: var(--text-light); text-align: center; margin-bottom: 30px;">
                    Please provide your details for delivery
                </p>
            </div>
            
            <div class="customer-form-grid">
                <div class="form-group">
                    <label for="customer_name">Full Name *</label>
                    <input type="text" id="customer_name" placeholder="Enter your full name" required>
                </div>
                
                <div class="form-group">
                    <label for="customer_email">Email Address *</label>
                    <input type="email" id="customer_email" placeholder="your.email@example.com" required>
                </div>
                
                <div class="form-group">
                    <label for="customer_phone">Phone Number *</label>
                    <input type="tel" id="customer_phone" placeholder="+233 XX XXX XXXX" required>
                </div>
                
                <div class="form-group full-width">
                    <label for="customer_address">Delivery Address *</label>
                    <textarea id="customer_address" placeholder="Your complete delivery address with landmarks" rows="3" required></textarea>
                </div>
                
                <div class="form-group full-width">
                    <label for="customer_notes">Special Instructions (optional)</label>
                    <textarea id="customer_notes" placeholder="Any special requests or delivery instructions" rows="2"></textarea>
                </div>
            </div>
            
            <div class="form-actions" style="margin-top: 30px; display: flex; gap: 15px;">
                <button id="order_now_btn" class="order-now-btn" style="flex: 1; padding: 15px; background: var(--gradient); color: white; border: none; border-radius: 15px; font-weight: 600; cursor: pointer; font-size: 1.1rem;">
                    🛒 Order Now with Paystack
                </button>
                
                <button id="add_to_cart_btn" class="add-to-cart-btn" style="flex: 1; padding: 15px; background: rgba(255,255,255,0.1); color: var(--text-light); border: 2px solid rgba(255,255,255,0.2); border-radius: 15px; font-weight: 600; cursor: pointer; font-size: 1.1rem;">
                    ➕ Add to Cart
                </button>
            </div>
            
            <div class="order-summary" id="order_summary" style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 15px; display: none;">
                <h3 style="color: var(--accent); margin-bottom: 15px;">Your Order Summary</h3>
                <div id="summary_items"></div>
                <div class="summary-total" style="margin-top: 15px; padding-top: 15px; border-top: 2px solid var(--accent); text-align: right; font-size: 1.3rem; font-weight: 700; color: var(--secondary);">
                    Total: GH₵<span id="summary_total">0.00</span>
                </div>
            </div>
            
            <div class="form-footer" style="margin-top: 20px; text-align: center; color: var(--text-light); font-size: 0.9rem;">
                <p>🔒 Your information is secure and will only be used for delivery purposes.</p>
            </div>
        </section>
    `;
    
    // Add form to page - after the food item section
    const foodItemSection = document.querySelector('.menu-section');
    if (foodItemSection) {
        foodItemSection.insertAdjacentHTML('afterend', formHTML);
        console.log('Customer form added successfully');
        
        // Setup form event listeners
        setupFoodPageFormEvents();
    } else {
        // If no menu-section found, add to main content
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.insertAdjacentHTML('beforeend', formHTML);
            setupFoodPageFormEvents();
        }
    }
}

// ====== SETUP FOOD PAGE FORM EVENTS ======
function setupFoodPageFormEvents() {
    // Order Now button
    const orderNowBtn = document.getElementById('order_now_btn');
    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', function() {
            console.log('Order Now button clicked');
            processFoodPageOrder();
        });
    }
    
    // Add to Cart button
    const addToCartBtn = document.getElementById('add_to_cart_btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            console.log('Add to Cart button clicked');
            addCurrentFoodItemToCart();
        });
    }
}

// ====== PROCESS FOOD PAGE ORDER ======
function processFoodPageOrder() {
    console.log('Processing food page order...');
    
    // 1. Validate and get customer information
    const customerInfo = getCustomerInfoFromForm();
    if (!customerInfo) {
        showToast('Please fill in all required fields!', 'error');
        return;
    }
    
    // 2. Add current food item to cart
    const itemAdded = addCurrentFoodItemToCart();
    if (!itemAdded) {
        showToast('Please select your food options first!', 'error');
        return;
    }
    
    // 3. Save customer info to localStorage
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    
    // 4. Prepare payment data
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const paymentData = {
        customer: customerInfo,
        cart: cart,
        total: total,
        itemsText: cart.map(item => `${item.quantity}x ${item.name}`).join(', '),
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('paymentData', JSON.stringify(paymentData));
    
    // 5. Redirect to payment page
    window.location.href = 'payment.html';
}

// ====== GET CUSTOMER INFO FROM FORM ======
function getCustomerInfoFromForm() {
    const name = document.getElementById('customer_name')?.value.trim();
    const email = document.getElementById('customer_email')?.value.trim();
    const phone = document.getElementById('customer_phone')?.value.trim();
    const address = document.getElementById('customer_address')?.value.trim();
    const notes = document.getElementById('customer_notes')?.value.trim() || '';
    
    // Validate required fields
    if (!name || !email || !phone || !address) {
        return null;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address!', 'error');
        return null;
    }
    
    return {
        name: name,
        email: email,
        phone: phone,
        address: address,
        notes: notes,
        timestamp: new Date().toISOString()
    };
}

// ====== ADD CURRENT FOOD ITEM TO CART ======
function addCurrentFoodItemToCart() {
    console.log('Adding current food item to cart...');
    
    // Get food item details from the page
    const foodName = document.getElementById('item-title')?.textContent || 'Food Item';
    const foodPrice = document.getElementById('item-price')?.textContent || 'GH₵0';
    const basePrice = parseFloat(foodPrice.replace('GH₵', '')) || 0;
    
    // Get selected options
    const selectedOptions = getSelectedOptionsFromPage();
    
    // Build the complete item name with options
    let itemName = foodName;
    let extraCost = 0;
    const addons = [];
    
    if (selectedOptions.meat) {
        itemName += ` with ${selectedOptions.meat.name}`;
        extraCost += selectedOptions.meat.price;
        addons.push(selectedOptions.meat.name);
    }
    
    if (selectedOptions.stew) {
        itemName += ` and ${selectedOptions.stew.name}`;
        extraCost += selectedOptions.stew.price;
        addons.push(selectedOptions.stew.name);
    }
    
    if (selectedOptions.sides.length > 0) {
        const sideNames = selectedOptions.sides.map(side => side.name);
        itemName += ` + ${sideNames.join(', ')}`;
        extraCost += selectedOptions.sides.reduce((sum, side) => sum + side.price, 0);
        addons.push(...sideNames);
    }
    
    const totalPrice = basePrice + extraCost;
    
    // Check if this exact item already exists in cart
    const existingIndex = cart.findIndex(item => item.name === itemName);
    
    if (existingIndex !== -1) {
        // Update existing item quantity
        cart[existingIndex].quantity += 1;
        cart[existingIndex].totalPrice = cart[existingIndex].quantity * totalPrice;
    } else {
        // Add new item to cart
        cart.push({
            name: itemName,
            basePrice: basePrice,
            extraCost: extraCost,
            price: totalPrice,
            quantity: 1,
            totalPrice: totalPrice,
            addons: addons,
            page: window.location.pathname
        });
    }
    
    // Save cart and update display
    saveCart();
    
    // Update the order summary on the page
    updateFoodPageCartSummary();
    
    // Show success message
    showToast(`${foodName} added to cart!`, 'success');
    
    return true;
}

// ====== GET SELECTED OPTIONS FROM PAGE ======
function getSelectedOptionsFromPage() {
    const options = {
        meat: null,
        stew: null,
        sides: []
    };
    
    // Get selected meat
    const meatRadio = document.querySelector('input[name="page-meat"]:checked');
    if (meatRadio) {
        options.meat = {
            name: meatRadio.dataset.name,
            price: parseFloat(meatRadio.dataset.price) || 0
        };
    }
    
    // Get selected stew
    const stewRadio = document.querySelector('input[name="page-stew"]:checked');
    if (stewRadio) {
        options.stew = {
            name: stewRadio.dataset.name,
            price: parseFloat(stewRadio.dataset.price) || 0
        };
    }
    
    // Get selected sides (checkboxes)
    const sideCheckboxes = document.querySelectorAll('input[name="page-side"]:checked');
    sideCheckboxes.forEach(checkbox => {
        options.sides.push({
            name: checkbox.dataset.name,
            price: parseFloat(checkbox.dataset.price) || 0
        });
    });
    
    return options;
}

// ====== UPDATE FOOD PAGE CART SUMMARY ======
function updateFoodPageCartSummary() {
    const summaryContainer = document.getElementById('order_summary');
    const summaryItems = document.getElementById('summary_items');
    const summaryTotal = document.getElementById('summary_total');
    
    if (!summaryContainer || !summaryItems || !summaryTotal) return;
    
    if (cart.length > 0) {
        summaryContainer.style.display = 'block';
        
        let itemsHTML = '';
        cart.forEach((item, index) => {
            const addonsHTML = item.addons && item.addons.length > 0 
                ? `<div style="font-size: 0.85rem; color: var(--text-light); margin-left: 20px; margin-top: 5px;">
                    Extras: ${item.addons.join(', ')}
                   </div>`
                : '';
            
            itemsHTML += `
                <div class="summary-item" style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>
                            <strong style="background: var(--primary); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.9rem;">
                                ${item.quantity}x
                            </strong>
                            <span style="margin-left: 10px;">${item.name}</span>
                        </span>
                        <span style="color: var(--secondary); font-weight: 700;">
                            GH₵${item.totalPrice.toFixed(2)}
                        </span>
                    </div>
                    ${addonsHTML}
                    <button onclick="removeItemFromCart(${index})" style="margin-left: 30px; margin-top: 5px; padding: 4px 12px; background: rgba(239,71,111,0.2); color: var(--danger); border: 1px solid var(--danger); border-radius: 15px; font-size: 0.8rem; cursor: pointer;">
                        Remove
                    </button>
                </div>
            `;
        });
        
        summaryItems.innerHTML = itemsHTML;
        
        // Calculate and display total
        const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        summaryTotal.textContent = total.toFixed(2);
    } else {
        summaryContainer.style.display = 'none';
    }
}

// ====== SETUP FOOD ITEM OPTIONS ======
function setupFoodItemOptions() {
    // Add change event listeners to all option inputs
    const allOptionInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    allOptionInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Update the price display on the main Add to Cart button
            updateAddToCartButtonPrice();
            
            // Also update the cart summary if we have items
            updateFoodPageCartSummary();
        });
    });
    
    // Initialize the button price
    updateAddToCartButtonPrice();
}

// ====== UPDATE ADD TO CART BUTTON PRICE ======
function updateAddToCartButtonPrice() {
    const addToCartBtn = document.getElementById('item-add-to-cart');
    if (!addToCartBtn) return;
    
    const basePrice = parseFloat(document.getElementById('item-price')?.textContent.replace('GH₵', '') || 0);
    const selectedOptions = getSelectedOptionsFromPage();
    
    let totalPrice = basePrice;
    
    if (selectedOptions.meat) {
        totalPrice += selectedOptions.meat.price;
    }
    
    if (selectedOptions.stew) {
        totalPrice += selectedOptions.stew.price;
    }
    
    if (selectedOptions.sides.length > 0) {
        totalPrice += selectedOptions.sides.reduce((sum, side) => sum + side.price, 0);
    }
    
    // Update button text with total price
    addToCartBtn.textContent = `Add to Cart - GH₵${totalPrice.toFixed(2)}`;
    addToCartBtn.dataset.totalPrice = totalPrice;
}

// ====== SETUP ORIGINAL ADD TO CART BUTTON ======
function setupOriginalAddToCartButton() {
    const addToCartBtn = document.getElementById('item-add-to-cart');
    if (addToCartBtn) {
        // Remove any existing event listeners
        const newBtn = addToCartBtn.cloneNode(true);
        addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
        
        // Add new event listener
        newBtn.addEventListener('click', function() {
            addCurrentFoodItemToCart();
        });
    }
}

// ====== SETUP MENU PAGE ======
function setupMenuPage() {
    console.log('Setting up menu page');
    
    // Add cart badge
    addCartBadge();
    
    // Setup Add to Cart buttons for menu items
    const addButtons = document.querySelectorAll('.menu-item .add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('.label').textContent;
            const priceText = menuItem.querySelector('.price').textContent;
            const basePrice = parseFloat(priceText.replace('GH₵', '')) || 0;
            
            // For menu page, we don't have customization options
            const success = addItemToCartSimple(itemName, basePrice);
            
            if (success) {
                // Show feedback
                this.textContent = '✓ Added!';
                this.style.background = 'var(--success)';
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                    this.style.background = '';
                }, 1500);
            }
        });
    });
    
    // Setup View More buttons
    const viewMoreButtons = document.querySelectorAll('.view-more');
    viewMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            // Navigation is handled by the href attribute
        });
    });
}

// ====== SIMPLE ADD TO CART FOR MENU PAGE ======
function addItemToCartSimple(itemName, basePrice) {
    const existingIndex = cart.findIndex(item => item.name === itemName && !item.addons?.length);
    
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
        cart[existingIndex].totalPrice = cart[existingIndex].quantity * basePrice;
    } else {
        cart.push({
            name: itemName,
            basePrice: basePrice,
            price: basePrice,
            quantity: 1,
            totalPrice: basePrice,
            addons: [],
            page: 'menu.html'
        });
    }
    
    saveCart();
    showToast(`${itemName} added to cart!`, 'success');
    return true;
}

// ====== SETUP PAYMENT PAGE ======
function setupPaymentPage() {
    console.log('Setting up payment page');
    
    // Load payment data
    const paymentData = JSON.parse(localStorage.getItem('paymentData')) || {};
    const cart = paymentData.cart || [];
    const total = paymentData.total || 0;
    const customer = paymentData.customer || {};
    
    // Display order summary
    const cartItemsEl = document.getElementById('cart-items');
    if (cartItemsEl) {
        cartItemsEl.innerHTML = '';
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'order-item';
            div.innerHTML = `
                <span>${item.quantity}x ${item.name}</span>
                <span>GH₵${item.totalPrice.toFixed(2)}</span>
            `;
            cartItemsEl.appendChild(div);
        });
    }
    
    // Display total
    document.getElementById('total').textContent = `GH₵${total.toFixed(2)}`;
    
    // Display customer information
    if (customer.name) {
        document.getElementById('display-name').textContent = customer.name;
        document.getElementById('display-email').textContent = customer.email;
        document.getElementById('display-phone').textContent = customer.phone;
        document.getElementById('display-address').textContent = customer.address;
        document.getElementById('display-notes').textContent = customer.notes || 'None';
    }
    
    // Setup Paystack payment
    const paystackBtn = document.getElementById('paystack-btn');
    if (paystackBtn) {
        paystackBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty! Please add items first.');
                window.location.href = 'menu.html';
                return;
            }
            
            if (!customer.email) {
                alert('Customer information is missing. Please go back and fill the form.');
                return;
            }
            
            // Generate reference
            const reference = 'OD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            
            // Setup Paystack
            const handler = PaystackPop.setup({
                key: 'pk_live_6b1543665f3fd0ec08938ff844c42f571fc6d089',
                email: customer.email,
                amount: total * 100,
                currency: 'GHS',
                ref: reference,
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Customer Name",
                            variable_name: "customer_name",
                            value: customer.name
                        },
                        {
                            display_name: "Phone Number",
                            variable_name: "phone_number",
                            value: customer.phone
                        },
                        {
                            display_name: "Delivery Address",
                            variable_name: "delivery_address",
                            value: customer.address
                        },
                        {
                            display_name: "Special Notes",
                            variable_name: "special_notes",
                            value: customer.notes || "None"
                        },
                        {
                            display_name: "Order Items",
                            variable_name: "order_items",
                            value: cart.map(item => `${item.quantity}x ${item.name}`).join(', ')
                        }
                    ]
                },
                callback: function(response) {
                    // Payment successful
                    handlePaymentSuccess(response, customer, cart);
                },
                onClose: function() {
                    alert('Payment window closed. You can complete your payment later.');
                }
            });
            
            handler.openIframe();
        });
    }
}

// ====== HANDLE PAYMENT SUCCESS ======
function handlePaymentSuccess(response, customer, cart) {
    // Save order details
    const orderDetails = {
        reference: response.reference,
        customer: customer,
        cart: cart,
        total: cart.reduce((sum, item) => sum + item.totalPrice, 0),
        date: new Date().toISOString(),
        status: 'paid'
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
    
    // Show success message
    const successMsg = document.getElementById('success-message');
    if (successMsg) {
        successMsg.innerHTML = `
            <h3>✅ Payment Successful!</h3>
            <p>Thank you ${customer.name}!</p>
            <p><strong>Reference:</strong> ${response.reference}</p>
            <p><strong>Amount:</strong> GH₵${orderDetails.total.toFixed(2)}</p>
            <p>Your order will be delivered to:</p>
            <p><strong>${customer.address}</strong></p>
            <p>We will contact you at ${customer.phone} for confirmation.</p>
        `;
        successMsg.style.display = 'block';
    }
    
    // Clear cart
    cart = [];
    localStorage.removeItem('cart');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartTotal');
    localStorage.removeItem('paymentData');
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = 'thank-you.html?ref=' + response.reference;
    }, 5000);
}

// ====== CART MANAGEMENT FUNCTIONS ======
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Error loading cart:', e);
            cart = [];
        }
    }
    
    // Backward compatibility
    if (!cart || cart.length === 0) {
        const oldCart = localStorage.getItem('cartItems');
        if (oldCart) {
            try {
                cart = JSON.parse(oldCart);
                localStorage.setItem('cart', oldCart);
            } catch (e) {
                cart = [];
            }
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    const total = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    localStorage.setItem('cartTotal', total.toString());
    
    updateCartBadge();
}

function removeItemFromCart(index) {
    if (index >= 0 && index < cart.length) {
        const itemName = cart[index].name;
        cart.splice(index, 1);
        saveCart();
        updateFoodPageCartSummary();
        showToast(`${itemName} removed from cart`, 'success');
    }
}

// ====== COMMON ELEMENTS ======
function setupCommonElements() {
    // Add cart badge to navigation
    addCartBadge();
    
    // Setup any global event listeners
    setupGlobalEventListeners();
}

function addCartBadge() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    // Check if badge already exists
    if (document.querySelector('.cart-badge')) return;
    
    // Find or create cart link
    let cartLink = document.querySelector('a[href*="menu.html"]');
    if (!cartLink) {
        // Create cart link
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="menu.html" style="position: relative;">
                🛒 Cart
                <span class="cart-badge" style="
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: var(--primary);
                    color: white;
                    font-size: 0.7rem;
                    padding: 2px 6px;
                    border-radius: 10px;
                    min-width: 18px;
                    text-align: center;
                    display: none;
                ">0</span>
            </a>
        `;
        navLinks.appendChild(li);
        cartLink = li.querySelector('a');
    } else {
        // Add badge to existing cart link
        cartLink.innerHTML = `
            🛒 Cart
            <span class="cart-badge" style="
                position: absolute;
                top: -8px;
                right: -8px;
                background: var(--primary);
                color: white;
                font-size: 0.7rem;
                padding: 2px 6px;
                border-radius: 10px;
                min-width: 18px;
                text-align: center;
                display: none;
            ">0</span>
        `;
    }
    
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function setupGlobalEventListeners() {
    // Add any global event listeners here
}

// ====== UTILITY FUNCTIONS ======
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 
                     type === 'error' ? 'var(--danger)' : 'var(--dark-light)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        border-left: 4px solid ${type === 'success' ? 'var(--success)' : 
                              type === 'error' ? 'var(--danger)' : 'var(--accent)'};
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    // Add animation styles if not present
    if (!document.getElementById('toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ====== EXPORT FUNCTIONS FOR GLOBAL USE ======
window.removeItemFromCart = removeItemFromCart;
window.addCurrentFoodItemToCart = addCurrentFoodItemToCart;
window.processFoodPageOrder = processFoodPageOrder;
window.getCart = () => cart;
window.clearCart = () => {
    cart = [];
    saveCart();
    showToast('Cart cleared!', 'success');
    updateFoodPageCartSummary();
};

// ====== INITIALIZATION ======
// Make sure cart is displayed on page load
setTimeout(() => {
    if (document.querySelector('.customer-form-section')) {
        updateFoodPageCartSummary();
    }
}, 100);