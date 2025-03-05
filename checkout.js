// Handle quantity changes and price updates
document.addEventListener('DOMContentLoaded', function() {
    const quantitySelect = document.getElementById('quantity');
    const summaryQuantity = document.getElementById('summaryQuantity');
    const summaryTotal = document.getElementById('summaryTotal');
    const basePrice = 1299; // Base price of the product

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
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            state: document.getElementById('state').value,
            landmark: document.getElementById('landmark').value,
            quantity: document.getElementById('quantity').value,
            total: summaryTotal.textContent,
            timestamp: new Date().toLocaleString()
        };

        console.log('Sending data:', formData); // Debug log

        try {
            // Send data to Google Sheets
            const response = await fetch('https://script.google.com/macros/s/AKfycbyCFdcuz5ps6oGfYnT47P0JY7ehWsqmJiTcpmZ_76lV-ErwNabd-ScjENpEEvO1LKt0Ug/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('Response received'); // Debug log
            
            // Store data in sessionStorage for payment page
            sessionStorage.setItem('orderDetails', JSON.stringify(formData));
            
            // Redirect to payment page
            window.location.href = 'payment.html';
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your order. Please try again.');
        }
    });
}); 