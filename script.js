
        // ------------------------------------------ //
        // A. DEMO PRODUCT DATA ARRAY                 //
        // ------------------------------------------ //
        // An array of objects. Easy to edit or add new items later.
        const demoProducts = [
            {
                id: 1,
                name: "AURA Soundscape Wireless Headphones",
                category: "Audio",
                price: 249.99,
                description: "Over-ear active noise-canceling headphones with studio sound and custom LED accents.",
                image: "images/headphones.png",
                fallbackImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 2,
                name: "KINETIC Alloy Mechanical Keyboard",
                category: "Peripherals",
                price: 189.99,
                description: "Hot-swappable tactile mechanical switch keyboard with ambient RGB lighting and custom oak casing.",
                image: "images/keyboard.png",
                fallbackImage: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 3,
                name: "MATRIX Cyber-Chrono Smartwatch",
                category: "Wearables",
                price: 299.99,
                description: "Full touchscreen hybrid health tracker, custom UI, featuring matte-black titanium construction.",
                image: "images/smartwatch.png",
                fallbackImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 4,
                name: "VECTOR Topo-Cork Desk Pad",
                category: "Office Gear",
                price: 49.99,
                description: "Full-desk geographic topography mouse mat constructed from dark compressed natural cork.",
                image: "images/deskpad.png",
                fallbackImage: "https://images.unsplash.com/photo-1632292224971-0d45778aba36?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 5,
                name: "ORBIT Smart Ambient LED Lamp",
                category: "Lighting",
                price: 89.99,
                description: "Adjustable circular smart desk lamp casting colorful gradient workspace glow reflections.",
                image: "images/lamp.png",
                fallbackImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 6,
                name: "APEX Prime Ergonomic Mouse",
                category: "Peripherals",
                price: 79.99,
                description: "Highly responsive precision wireless gaming mouse featuring carbon fiber grip overlays.",
                image: "images/mouse.png",
                fallbackImage: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80"
            }
        ];

        // ------------------------------------------ //
        // B. STATE MANAGEMENT                        //
        // ------------------------------------------ //
        // The active list of items the user has added to their cart.
        // It retrieves any previously saved items from local storage, or defaults to an empty array [].
        let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

        // ------------------------------------------ //
        // C. INITIALIZATION FUNCTION                 //
        // ------------------------------------------ //
        // This function triggers as soon as the web page finishes loading.
        window.addEventListener('DOMContentLoaded', () => {
            renderProducts(); // Creates all product cards and displays them in HTML
            updateCartUI();   // Loads saved cart items and updates the cart side-panel layout
        });

        // ------------------------------------------ //
        // D. PRODUCT RENDER LOGIC                    //
        // ------------------------------------------ //
        // Loops through the products array and prints them inside the HTML grid container.
        function renderProducts() {
            const grid = document.getElementById('productsGrid');
            grid.innerHTML = ''; // Clears container before printing

            demoProducts.forEach(product => {
                // Creates a new empty div element
                const card = document.createElement('div');
                card.className = 'product-card'; // Assigns our modern styling class

                // Sets the inner HTML layout for each individual product
                card.innerHTML = `
                    <div class="product-image-box">
                        <span class="product-tag">Exclusive</span>
                        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='${product.fallbackImage}';">
                    </div>
                    <div class="product-info">
                        <span class="product-category">${product.category}</span>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                        <div class="product-footer">
                            <span class="product-price">$${product.price.toFixed(2)}</span>
                            <!-- Button calls the addToCart() function passing the specific product ID -->
                            <button class="btn-add" onclick="addToCart(${product.id})">
                                <i class="fa-solid fa-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                `;

                // Appends/adds the product card into the main products grid
                grid.appendChild(card);
            });
        }

        // ------------------------------------------ //
        // E. ADD TO CART FUNCTIONALITY               //
        // ------------------------------------------ //
        function addToCart(productId) {
            // 1. Searches our products database array to find the selected product object
            const product = demoProducts.find(p => p.id === productId);
            if (!product) return;

            // 2. Checks if the item already exists in the current cart array
            const existingCartItem = cart.find(item => item.id === productId);

            if (existingCartItem) {
                // If it is in the cart, simply increase the quantity value by 1
                existingCartItem.quantity += 1;
            } else {
                // If it is new, insert a copy of product details + custom quantity field into cart array
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    fallbackImage: product.fallbackImage,
                    quantity: 1
                });
            }

            // 3. Save the updated cart array directly inside the browser's Local Storage
            saveCartToLocalStorage();

            // 4. Update the cart overlay elements & totals in the Sidebar
            updateCartUI();

            // 5. Display a beautiful toast popup showing item was added
            showToast(`${product.name} added to cart!`);

            // 6. Visual Badge Pop Effect: temporarily grows badge size in the navbar
            const badge = document.getElementById('cartBadge');
            badge.classList.add('badge-pop');
            setTimeout(() => {
                badge.classList.remove('badge-pop');
            }, 300);
        }

        // ------------------------------------------ //
        // F. CART QUANTITY & REMOVE LOGIC            //
        // ------------------------------------------ //
        
        // Allows incrementing or decrementing quantities inside the cart sidebar
        function changeQuantity(productId, delta) {
            const cartItem = cart.find(item => item.id === productId);
            if (!cartItem) return;

            cartItem.quantity += delta;

            // If quantity drops to 0, completely remove it from the cart
            if (cartItem.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveCartToLocalStorage();
                updateCartUI();
            }
        }

        // Completely deletes a product item from the cart
        function removeFromCart(productId) {
            const item = cart.find(i => i.id === productId);
            // Re-assigns cart variable to a filtered version containing everything except our target ID
            cart = cart.filter(item => item.id !== productId);
            
            saveCartToLocalStorage();
            updateCartUI();

            if (item) {
                showToast(`Removed ${item.name} from cart.`);
            }
        }

        // ------------------------------------------ //
        // G. CART CALCULATIONS & UI DRAWING          //
        // ------------------------------------------ //
        // Re-draws the list of items in the cart sidebar, updates item counter badge and subtotal price.
        function updateCartUI() {
            const cartList = document.getElementById('cartItemsList');
            const subtotalEl = document.getElementById('cartSubtotal');
            const badgeEl = document.getElementById('cartBadge');
            const checkoutBtn = document.getElementById('checkoutBtn');

            // 1. Calculate the total quantity count for the Navbar badge
            let totalItems = 0;
            cart.forEach(item => totalItems += item.quantity);
            badgeEl.textContent = totalItems;

            // 2. Clear out older lists before updating
            cartList.innerHTML = '';

            // 3. Handle Empty State
            if (cart.length === 0) {
                cartList.innerHTML = `
                    <div class="empty-cart-state">
                        <i class="fa-solid fa-basket-shopping"></i>
                        <h4>Your Cart is Empty</h4>
                        <p>Discover tech items in our collection and add them here!</p>
                    </div>
                `;
                subtotalEl.textContent = "$0.00";
                checkoutBtn.disabled = true; // Prevents checkout when empty
                return;
            }

            // 4. Draw items
            let runningTotal = 0;
            checkoutBtn.disabled = false;

            cart.forEach(item => {
                // Calculate total item cost (Price * Qty)
                const itemTotalCost = item.price * item.quantity;
                runningTotal += itemTotalCost;

                // Create individual cart card element
                const cartCard = document.createElement('div');
                cartCard.className = 'cart-item';

                cartCard.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null; this.src='${item.fallbackImage}';">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                `;

                cartList.appendChild(cartCard);
            });

            // Set final calculated subtotal
            subtotalEl.textContent = `$${runningTotal.toFixed(2)}`;
        }

        // ------------------------------------------ //
        // H. LOCALSTORAGE FUNCTIONS                  //
        // ------------------------------------------ //
        // Saves current cart state in LocalStorage (requires converting the JS Array to a String)
        function saveCartToLocalStorage() {
            localStorage.setItem('aura_cart', JSON.stringify(cart));
        }

        // ------------------------------------------ //
        // I. SIDEBAR TOGGLE MECHANICS                //
        // ------------------------------------------ //
        // Controls opening and closing of the side cart pane
        function toggleCart(open) {
            const drawer = document.getElementById('cartDrawer');
            const overlay = document.getElementById('cartOverlay');

            if (open) {
                drawer.classList.add('active');
                overlay.classList.add('active');
            } else {
                drawer.classList.remove('active');
                overlay.classList.remove('active');
            }
        }

        // ------------------------------------------ //
        // J. CHECKOUT & ORDERS PROCESS               //
        // ------------------------------------------ //
        function checkout() {
            if (cart.length === 0) return;

            // 1. Gather Order Metadata Details to store
            const newOrder = {
                orderId: "AURA-" + Math.floor(Math.random() * 900000 + 100000), // Random Order Receipt ID
                timestamp: new Date().toISOString(),
                items: cart,
                totalAmount: cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
            };

            // 2. Fetch past orders from localStorage or default to empty list
            const pastOrders = JSON.parse(localStorage.getItem('aura_orders')) || [];
            
            // 3. Add our new order data to the list
            pastOrders.push(newOrder);

            // 4. Save new orders list in localStorage
            localStorage.setItem('aura_orders', JSON.stringify(pastOrders));

            // 5. Clear cart array & update browser local storage
            cart = [];
            saveCartToLocalStorage();
            updateCartUI();

            // 6. Close the Cart side-panel
            toggleCart(false);

            // 7. Show Checkout Success Modal Popup
            const successModal = document.getElementById('successModalOverlay');
            successModal.classList.add('active');
        }

        function closeSuccessModal() {
            const successModal = document.getElementById('successModalOverlay');
            successModal.classList.remove('active');
        }

        // ------------------------------------------ //
        // K. FLOATING TOAST FEEDBACK NOTIFICATIONS   //
        // ------------------------------------------ //
        // Spawns a floating notification bubble on the bottom-right corner of the window
        function showToast(message) {
            const container = document.getElementById('toastContainer');
            
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                <span>${message}</span>
            `;

            container.appendChild(toast);

            // Small delay to trigger smooth transition class
            setTimeout(() => {
                toast.classList.add('show');
            }, 50);

            // Automatically hides and destroys the toast item after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove(); // Removes node from DOM
                }, 400);
            }, 3000);
        }

        // Helper to smooth scroll to top on header clicks
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }