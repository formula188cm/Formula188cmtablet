document.addEventListener('DOMContentLoaded', function() {
    // Clear any previous payment data when starting a new payment
    sessionStorage.removeItem('paymentDetails');
    
    // Get order details from sessionStorage
    const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));
    
    if (!orderDetails) {
        // If no order details found, redirect back to checkout
        window.location.href = 'checkout.html';
        return;
    }

    // Define base prices
    const basePrice = 1299;
    const codPrice = 1499;
    
    // Update summary amounts based on payment method
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    // Function to update prices based on payment method
    function updatePrices(paymentMethod) {
        const quantity = parseInt(orderDetails.quantity);
        const pricePerUnit = paymentMethod === 'cod' ? codPrice : basePrice;
        const subtotal = pricePerUnit * quantity;
        
        subtotalElement.textContent = `₹${subtotal.toLocaleString()}.00`;
        totalElement.textContent = `₹${subtotal.toLocaleString()}.00`;
        
        // Update order details with new price
        orderDetails.total = `₹${subtotal.toLocaleString()}.00`;
    }

    // Define Razorpay payment links for different quantities
    const paymentLinks = {
        1: "https://rzp.io/rzp/EoY1KE3",  // Link for quantity 1 (₹1,299)
        2: "https://rzp.io/rzp/n5jCMCJ",   // Link for quantity 2 (₹2,598)
        3: "https://rzp.io/rzp/G86mtdCg",   // Link for quantity 3 (₹3,897)
        4: "https://rzp.io/rzp/JyeX9mZS"   // Link for quantity 4 (₹5,196)
    };

    // Payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    const proceedButton = document.getElementById('proceed-payment');

    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            // Add active class to selected method
            this.classList.add('active');
            // Enable proceed button
            proceedButton.disabled = false;
            // Select the radio input
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Update prices based on selected payment method
            updatePrices(radio.value);
        });
    });

    // Initialize prices with default payment method (online)
    updatePrices('online');

    // Function to send order data to appropriate sheet
    async function sendToSheet(data, sheetName) {
        try {
            await fetch('https://script.google.com/macros/s/AKfycbzgsqR8bxhrjapBRhPCFT1hT3Dk7xCrAQYOD5XPneTibbhxqz8EfvEawU1a7v6xng8ccQ/exec?sheet=' + sheetName, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Error sending data to sheet:', error);
        }
    }

    // Handle payment proceed button
    proceedButton.addEventListener('click', async function() {
        const selectedMethod = document.querySelector('input[name="payment"]:checked').value;

        if (selectedMethod === 'cod') {
            // For COD orders
            const paymentDetails = {
                method: 'cod',
                orderStatus: 'confirmed',
                timestamp: new Date().toLocaleString()
            };
            
            // Update order details with payment info
            const codOrderData = {
                ...orderDetails,
                paymentMethod: 'cod',
                orderStatus: 'confirmed',
                paymentTimestamp: new Date().toLocaleString()
            };

            // Send to Sheet5 for COD orders
            await sendToSheet(codOrderData, 'Sheet5');
            
            // Store payment details and redirect
            sessionStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
            window.location.href = 'thank-you.html';
        } else {
            // For online payment
                const quantity = parseInt(orderDetails.quantity);
                const paymentLink = paymentLinks[quantity];
                
                if (paymentLink) {
                // Update order details with payment info
                const onlineOrderData = {
                    ...orderDetails,
                    paymentMethod: 'online',
                    orderStatus: 'payment_pending',
                    paymentTimestamp: new Date().toLocaleString(),
                    razorpayLink: paymentLink
                };

                // Send to Sheet6 for online orders
                await sendToSheet(onlineOrderData, 'Sheet6');
                
                // Store payment details
                const paymentDetails = {
                    method: 'online',
                    orderStatus: 'payment_pending',
                    timestamp: new Date().toLocaleString(),
                    razorpayLink: paymentLink
                };
                sessionStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
                
                // Redirect to Razorpay payment page
                window.location.href = paymentLink;
            } else {
                alert('Invalid quantity selected');
            }
        }
    });
});

// Function to update order status in Google Sheets
async function updateOrderStatus(orderDetails) {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzBWLiNnFQQsaD8fWlquq3L3dbGklquj12ub0c79kcLWUZYuMmx1fEmdleB9odDUawJ/exec?sheet=Sheet4', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetails)
        });

        // Store payment details for thank you page
        sessionStorage.setItem('paymentDetails', JSON.stringify({
            method: orderDetails.paymentMethod,
            orderStatus: orderDetails.orderStatus,
            timestamp: orderDetails.paymentTimestamp
        }));
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}

// Function to handle successful payment
async function handlePaymentSuccess(response, orderDetails) {
    try {
        // Add payment details to order
        orderDetails.paymentMethod = 'online';
        orderDetails.orderStatus = 'completed';
        orderDetails.paymentTimestamp = new Date().toLocaleString();
        
        if (response) {
            orderDetails.razorpayPaymentId = response.razorpay_payment_id;
            orderDetails.razorpayOrderId = response.razorpay_order_id;
            orderDetails.razorpaySignature = response.razorpay_signature;
        }

        // Update Google Sheet with payment completion
        await updateOrderStatus(orderDetails);

        // Store payment details for thank you page
        sessionStorage.setItem('paymentDetails', JSON.stringify({
            method: 'online',
            orderStatus: 'completed',
            timestamp: orderDetails.paymentTimestamp,
            razorpayPaymentId: response ? response.razorpay_payment_id : null
        }));

        // Redirect to thank you page
        window.location.href = 'thank-you.html';

    } catch (error) {
        console.error('Error:', error);
        alert('There was an error processing your order. Please try again.');
    }
} 
