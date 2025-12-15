const searchIcon = document.querySelector(".search-icon");
const searchForm = document.querySelector(".search-form");
const menuIcon = document.querySelector(".menu-icon");
const navBar = document.querySelector(".navbar");
const cartIcon = document.querySelector(".cart-icon");
const cartItemsContainer = document.querySelector(".cart-items-container");

let cart = [];

//search form
searchIcon.addEventListener("click", () => {
    searchForm.classList.add("active");
    cartItemsContainer.classList.remove("active");
    navBar.classList.remove("active");
});

//menu
menuIcon.addEventListener("click", () => {
    navBar.classList.add("active");
    searchForm.classList.remove("active");
    cartItemsContainer.classList.remove("active");
});

//cart
cartIcon.addEventListener("click", () => {
    cartItemsContainer.classList.add("active");
    searchForm.classList.remove("active");
    navBar.classList.remove("active");
    displayCart();
});

window.onscroll = () => {
    cartItemsContainer.classList.remove("active");
    searchForm.classList.remove("active");
    navBar.classList.remove("active");
};

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    displayCart();
    updateCartCount();
    showNotification(name + " added to cart!");
}

// Remove from cart function
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    displayCart();
    updateCartCount();
    showNotification(name + " removed from cart!");
}

// Update quantity
function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            displayCart();
            updateCartCount();
        }
    }
}

// Display cart items
function displayCart() {
    const cartContainer = document.querySelector(".cart-items-container");

    if (cart.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.style.textAlign = 'center';
        emptyDiv.style.padding = '2rem';
        emptyDiv.style.color = '#666';
        const emptyText = document.createElement('p');
        emptyText.style.fontSize = '1.6rem';
        emptyText.textContent = 'Your cart is empty';
        emptyDiv.appendChild(emptyText);
        cartContainer.innerHTML = '';
        cartContainer.appendChild(emptyDiv);
        return;
    }

    cartContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        //Create cart item div
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';

        const removeSpan = document.createElement('span');
        removeSpan.className = 'fa-solid fa-times';
        removeSpan.onclick = function() { removeFromCart(item.name); };

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        const nameH3 = document.createElement('h3');
        nameH3.textContent = item.name;

        const priceDiv = document.createElement('div');
        priceDiv.className = 'price';
        priceDiv.textContent = '₹' + item.price + ' × ' + item.quantity + ' = ₹' + itemTotal;

        //Quantity controls
        const qtyControlsDiv = document.createElement('div');
        qtyControlsDiv.className = 'quantity-controls';

        const minusBtn = document.createElement('button');
        minusBtn.className = 'qty-btn';
        minusBtn.textContent = '-';
        minusBtn.onclick = function() { updateQuantity(item.name, -1); };

        const qtySpan = document.createElement('span');
        qtySpan.className = 'qty-display';
        qtySpan.textContent = item.quantity;

        const plusBtn = document.createElement('button');
        plusBtn.className = 'qty-btn';
        plusBtn.textContent = '+';
        plusBtn.onclick = function() { updateQuantity(item.name, 1); };

        qtyControlsDiv.appendChild(minusBtn);
        qtyControlsDiv.appendChild(qtySpan);
        qtyControlsDiv.appendChild(plusBtn);

        contentDiv.appendChild(nameH3);
        contentDiv.appendChild(priceDiv);
        contentDiv.appendChild(qtyControlsDiv);

        cartItemDiv.appendChild(removeSpan);
        cartItemDiv.appendChild(img);
        cartItemDiv.appendChild(contentDiv);

        cartContainer.appendChild(cartItemDiv);
    });

    //cart total
    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    const totalH3 = document.createElement('h3');
    totalH3.textContent = 'Total: ₹' + total;
    totalDiv.appendChild(totalH3);
    cartContainer.appendChild(totalDiv);

    //order button
    const orderBtn = document.createElement('a');
    orderBtn.href = '#';
    orderBtn.className = 'btn';
    orderBtn.textContent = 'Order now';
    orderBtn.onclick = checkout;
    cartContainer.appendChild(orderBtn);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const existingBadge = document.querySelector(".cart-badge");
    if (existingBadge) {
        existingBadge.remove();
    }
    if (totalItems > 0) {
        const badge = document.createElement("span");
        badge.className = "cart-badge";
        badge.textContent = totalItems;
        cartIcon.style.position = "relative";
        cartIcon.appendChild(badge);
    }
}

function showNotification(message) {
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
        existingNotification.remove();
    }
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show");
    }, 100);

    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

function checkout(e) {
    e.preventDefault();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => item.name + ' (x' + item.quantity + ')').join(", ");

    alert('Order Summary:\n\n' + itemsList + '\n\nTotal: ₹' + total + '\n\nThank you for your order!');

    cart = [];
    displayCart();
    updateCartCount();
}

//Initialize event listeners
document.addEventListener("DOMContentLoaded", function() {
    //cakes section
    const cakeCards = document.querySelectorAll(".cakes .cake-card");
    cakeCards.forEach(card => {
        const name = card.querySelector("h3").textContent;
        const priceText = card.querySelector(".price").textContent;
        const price = parseInt(priceText.replace("₹", ""));
        const image = card.querySelector("img").src;

        const button = card.querySelector(".btn");
        button.addEventListener("click", (e) => {
            e.preventDefault();
            addToCart(name, price, image);
        });
    });

    //pastries section
    const pastryCards = document.querySelectorAll(".pastry .pastry-card");
    pastryCards.forEach(card => {
        const name = card.querySelector("h3").textContent;
        const priceText = card.querySelector(".price").textContent;
        const price = parseInt(priceText.replace("₹", ""));
        const image = card.querySelector("img").src;

        const cartButton = card.querySelector(".icons a.fa-basket-shopping");
        cartButton.addEventListener("click", (e) => {
            e.preventDefault();
            addToCart(name, price, image);
        });
    });

    displayCart();
});