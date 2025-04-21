// Handle quantity changes and price updates
document.addEventListener('DOMContentLoaded', function() {
    // Clear any previous payment data when starting a new order
    sessionStorage.removeItem('paymentDetails');
    sessionStorage.removeItem('orderDetails');
    
    const basePrice = 1299;
    const quantitySelect = document.getElementById('quantity');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const completeOrderBtn = document.getElementById('complete-order-btn');

    function formatPrice(price) {
        return '₹' + price.toLocaleString('en-IN') + '.00';
    }

    function updatePrices() {
        const quantity = parseInt(quantitySelect.value);
        const subtotal = basePrice * quantity;
        const total = subtotal; // Since shipping is free

        subtotalElement.textContent = formatPrice(subtotal);
        totalElement.textContent = formatPrice(total);
        completeOrderBtn.textContent = `COMPLETE ORDER - ${formatPrice(total)}`;
    }

    // Update prices when quantity changes
    quantitySelect.addEventListener('change', updatePrices);

    // Initialize prices
    updatePrices();

    // Handle form submission and Google Sheets integration
    const addressForm = document.getElementById('addressForm');
    
    addressForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get and validate form data
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const pincode = document.getElementById('pincode').value.trim();
        const quantity = document.getElementById('quantity').value;

        // Basic validation
        if (!name || !phone || !email || !address || !city || !state || !pincode) {
            alert('Please fill in all required fields');
            return;
        }

        // Phone number validation
        if (!/^\d{10}$/.test(phone)) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Pincode validation
        if (!/^\d{6}$/.test(pincode)) {
            alert('Please enter a valid 6-digit pincode');
            return;
        }

        // Get form data
        const formData = {
            name: name,
            phone: phone,
            email: email,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
            landmark: document.getElementById('landmark').value.trim(),
            quantity: quantity,
            total: totalElement.textContent,
            timestamp: new Date().toLocaleString(),
            orderStatus: 'pending',
            paymentMethod: 'pending',
            orderId: 'ORD' + Math.floor(Math.random() * 1000000)
        };

        try {
            // Show loading state
            const submitButton = document.getElementById('complete-order-btn');
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;

            // First store data in sessionStorage
            sessionStorage.setItem('orderDetails', JSON.stringify(formData));

            // Then send initial data to Google Sheets (Sheet4 for pending orders)
            await fetch('https://script.google.com/macros/s/AKfycbzgsqR8bxhrjapBRhPCFT1hT3Dk7xCrAQYOD5XPneTibbhxqz8EfvEawU1a7v6xng8ccQ/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            // Finally redirect to payment page
            window.location.href = 'payment.html';
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your order. Please try again.');
            // Reset button state on error
            submitButton.textContent = `COMPLETE ORDER - ${totalElement.textContent}`;
            submitButton.disabled = false;
        }
    });
}); 