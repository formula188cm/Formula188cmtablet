// Handle quantity changes and price updates
document.addEventListener('DOMContentLoaded', function() {
    // Clear any previous payment data when starting a new order
    sessionStorage.removeItem('paymentDetails');
    sessionStorage.removeItem('orderDetails');
    
    const quantitySelect = document.getElementById('quantity');
    const summaryQuantity = document.getElementById('summaryQuantity');
    const summaryTotal = document.getElementById('summaryTotal');
    const basePrice = 999; // Base price of the product

    quantitySelect.addEventListener('change', function() {
        const quantity = parseInt(this.value);
        const total = basePrice * quantity;
        
        // Update summary section
        summaryQuantity.textContent = quantity;
        summaryTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
    });

    // Handle form submission and Google Sheets integration
    const addressForm = document.getElementById('addressForm');
    
    addressForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form data
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
            total: summaryTotal.textContent,
            timestamp: new Date().toLocaleString(),
            orderStatus: 'pending',
            paymentMethod: 'pending'
        };

        try {
            // Show loading state
            const submitButton = document.querySelector('.continue-btn');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;

            // Send data to Google Sheets
            const response = await fetch('https://script.google.com/macros/s/AKfycbzBWLiNnFQQsaD8fWlquq3L3dbGklquj12ub0c79kcLWUZYuMmx1fEmdleB9odDUawJ/exec?sheet=Sheet4', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // Store data in sessionStorage for payment page
            sessionStorage.setItem('orderDetails', JSON.stringify(formData));
            
            // Redirect to payment page
            window.location.href = 'payment.html';
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your order. Please try again.');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}); 