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
    
    // Update summary section
    document.getElementById('summaryQuantity').textContent = orderDetails.quantity;
    document.getElementById('summaryTotal').textContent = orderDetails.total;

    // Payment links for different quantities
    const paymentLinks = {
        1: "https://rzp.io/rzp/TWF5xmG1",  // Link for ₹999
        2: "https://rzp.io/rzp/fDZQCst",  // Link for ₹1,998
        3: "https://rzp.io/rzp/XfMvJv2",  // Link for ₹2,997
        4: "https://rzp.io/rzp/OHLRJvIc"   // Link for ₹3,996
    };

    // Handle payment selection and order placement
    document.getElementById('placeOrderBtn').addEventListener('click', async function() {
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        
        if (!selectedPayment) {
            alert('Please select a payment method to continue');
            return;
        }

        try {
            // Show loading state
            const placeOrderBtn = document.getElementById('placeOrderBtn');
            const originalText = placeOrderBtn.textContent;
            placeOrderBtn.textContent = 'Processing...';
            placeOrderBtn.disabled = true;

            if (selectedPayment.value === 'online') {
                // Get the appropriate payment link based on quantity
                const quantity = parseInt(orderDetails.quantity);
                const paymentLink = paymentLinks[quantity];
                
                if (paymentLink) {
                    // Update order status before redirecting
                    orderDetails.paymentMethod = 'online';
                    orderDetails.orderStatus = 'payment_pending';
                    orderDetails.paymentTimestamp = new Date().toLocaleString();
                    
                    // Update Google Sheet with payment attempt
                    await updateOrderStatus(orderDetails);
                    
                    // Redirect to payment page
                    window.location.href = paymentLink;
                } else {
                    throw new Error('Invalid quantity selected');
                }
            } else {
                // Handle COD payment
                orderDetails.paymentMethod = 'cod';
                orderDetails.orderStatus = 'pending';
                orderDetails.paymentTimestamp = new Date().toLocaleString();
                
                // Update Google Sheet with COD order
                await updateOrderStatus(orderDetails);
                
                // Redirect to thank you page
                window.location.href = 'thank-you.html';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error processing your payment. Please try again.');
        } finally {
            // Reset button state
            placeOrderBtn.textContent = originalText;
            placeOrderBtn.disabled = false;
        }
    });

    // Add visual feedback for payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            this.querySelector('input[type="radio"]').checked = true;
        });
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