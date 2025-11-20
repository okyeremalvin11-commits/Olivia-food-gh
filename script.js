document.addEventListener("DOMContentLoaded", () => {
    let cart = [];
    let total = 0;

    const buttons = document.querySelectorAll('.add-to-cart');
    const cartList = document.getElementById("cart-items");
    const totalDisplay = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkout-btn");

    // Add items to cart
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.menu-item');
            const itemName = card.querySelector('.label').textContent;
            const priceText = card.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace('GH₵',''));
            cart.push({ name: itemName, price });
            total += price;
            updateCart();
        });
    });

    function updateCart() {
        cartList.innerHTML = "";

        const groupedCart = cart.reduce((acc, item) => {
            const existing = acc.find(i => i.name === item.name);
            if (existing) {
                existing.count += 1;
                existing.totalPrice += item.price;
            } else {
                acc.push({ ...item, count: 1, totalPrice: item.price });
            }
            return acc;
        }, []);

        groupedCart.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.count}x ${item.name} - GH₵${item.totalPrice.toFixed(2)}`;
            cartList.appendChild(li);
        });

        totalDisplay.textContent = `Total: GH₵${total.toFixed(2)}`;
    }

    checkoutBtn.addEventListener("click", () => {
        if(cart.length === 0) {
            alert("Your cart is empty! Please add some food.");
            return;
        }

        const groupedCart = cart.reduce((acc, item) => {
            const existing = acc.find(i => i.name === item.name);
            if (existing) {
                existing.count += 1;
                existing.totalPrice += item.price;
            } else {
                acc.push({ name: item.name, price: item.price, count: 1, totalPrice: item.price });
            }
            return acc;
        }, []);

        localStorage.setItem("cartItems", JSON.stringify(groupedCart));
        localStorage.setItem("cartTotal", total.toFixed(2));

        window.location.href = "payment.html";
    });
});
