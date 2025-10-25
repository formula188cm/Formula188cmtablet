document.addEventListener('DOMContentLoaded', function() {
    // Payment method switching
    const methodBtns = document.querySelectorAll('.method-btn');
    const sections = {
        bank: document.getElementById('bank-section'),
        upi: document.getElementById('upi-section'),
        online: document.getElementById('online-section'),
        qr: document.getElementById('qr-section')
    };
    methodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (btn.classList.contains('disabled')) return;
            methodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            Object.keys(sections).forEach(key => sections[key].style.display = 'none');
            sections[btn.getAttribute('data-method')].style.display = 'block';
            if (btn.getAttribute('data-method') === 'upi') {
                // Generate dynamic UPI QR code
                generateUPIQR();
            }
        });
    });
    // Copy to clipboard
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-btn')) {
            const val = e.target.getAttribute('data-copy');
            navigator.clipboard.writeText(val);
            e.target.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                e.target.innerHTML = '<i class="fas fa-copy"></i>';
            }, 1200);
        }
    });
    // UPI Payment button handler
    document.getElementById('upi-pay-btn').addEventListener('click', function() {
        const upiId = 'ayushyaduvanshi56441@okicici';
        const amount = '1099';
        const payeeName = 'Ayush Kumar';
        const transactionRef = 'FORMULA188CM';
        
        // Detect user agent to provide PhonePe-specific links
        const userAgent = navigator.userAgent.toLowerCase();
        const isAndroid = userAgent.includes('android');
        const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');
        
        // Try multiple UPI deep link formats with PhonePe-specific formats
        const upiLinks = [
            // Standard UPI format
            `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tr=${transactionRef}`,
            // PhonePe specific format
            `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tr=${transactionRef}`,
            // Alternative PhonePe format
            `phonepe://pay?pa=${upiId}&am=${amount}&cu=INR`,
            // Standard without transaction ref
            `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`,
            // Minimal format
            `upi://pay?pa=${upiId}&am=${amount}&cu=INR`,
            // Very minimal
            `upi://pay?pa=${upiId}&am=${amount}`,
            // PhonePe minimal
            `phonepe://pay?pa=${upiId}&am=${amount}`
        ];
        
        let linkIndex = 0;
        const tryNextLink = () => {
            if (linkIndex < upiLinks.length) {
                const link = upiLinks[linkIndex];
                const timeout = setTimeout(() => {
                    linkIndex++;
                    tryNextLink();
                }, 2000);
                
                window.location.href = link;
                
                // Clear timeout if user navigates away
                window.addEventListener('beforeunload', () => clearTimeout(timeout));
            } else {
                // Enhanced fallback with PhonePe-specific instructions
                const fallbackMessage = `UPI app could not be opened automatically. Please try one of these methods:

Method 1 - Manual UPI Entry:
1. Open your UPI app (PhonePe/Google Pay/Paytm)
2. Enter UPI ID: ${upiId}
3. Enter amount: ₹${amount}
4. Complete the payment

Method 2 - For PhonePe specifically:
1. Open PhonePe app
2. Go to "Send Money"
3. Enter UPI ID: ${upiId}
4. Enter amount: ₹${amount}
5. Add note: ${transactionRef}
6. Complete payment

Method 3 - Use QR Code:
Scan the QR code below with your UPI app

Method 4 - Contact Support:
WhatsApp: 8989252740 for assistance`;
                
                alert(fallbackMessage);
            }
        };
        
        tryNextLink();
    });

    // PhonePe specific button handler
    document.getElementById('phonepe-pay-btn').addEventListener('click', function() {
        const upiId = 'ayushyaduvanshi56441@okicici';
        const amount = '1099';
        const payeeName = 'Ayush Kumar';
        const transactionRef = 'FORMULA188CM';
        
        // PhonePe specific deep link formats
        const phonepeLinks = [
            // PhonePe direct format
            `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tr=${transactionRef}`,
            // PhonePe with minimal parameters
            `phonepe://pay?pa=${upiId}&am=${amount}&cu=INR`,
            // PhonePe with just UPI ID and amount
            `phonepe://pay?pa=${upiId}&am=${amount}`,
            // Alternative PhonePe format
            `phonepe://send?pa=${upiId}&am=${amount}`,
            // Standard UPI format as fallback
            `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tr=${transactionRef}`
        ];
        
        let linkIndex = 0;
        const tryNextLink = () => {
            if (linkIndex < phonepeLinks.length) {
                const link = phonepeLinks[linkIndex];
                const timeout = setTimeout(() => {
                    linkIndex++;
                    tryNextLink();
                }, 2000);
                
                window.location.href = link;
                
                // Clear timeout if user navigates away
                window.addEventListener('beforeunload', () => clearTimeout(timeout));
            } else {
                // PhonePe specific fallback instructions
                const phonepeMessage = `PhonePe could not be opened automatically. Please try these PhonePe-specific methods:

Method 1 - Direct PhonePe Entry:
1. Open PhonePe app
2. Tap "Send Money"
3. Enter UPI ID: ${upiId}
4. Enter amount: ₹${amount}
5. Add note: ${transactionRef}
6. Complete payment

Method 2 - PhonePe QR Scanner:
1. Open PhonePe app
2. Tap "Scan & Pay"
3. Scan the QR code below

Method 3 - PhonePe Mobile Number:
1. Open PhonePe app
2. Go to "Send Money"
3. Enter mobile number: 8989252740
4. Enter amount: ₹${amount}
5. Complete payment

Method 4 - Contact Support:
WhatsApp: 8989252740 for assistance`;
                
                alert(phonepeMessage);
            }
        };
        
        tryNextLink();
    });

    // Thank you alert
    document.getElementById('bank-paid-btn').addEventListener('click', function() {
        alert('Thank you for your payment! Please send the payment screenshot to WhatsApp: 8989252740 or Email: formula188cm@gmail.com');
    });
    document.getElementById('upi-paid-btn').addEventListener('click', function() {
        alert('Thank you for your payment! Please send the payment screenshot to WhatsApp: 8989252740 or Email: formula188cm@gmail.com');
    });

    // Function to generate UPI QR code
    function generateUPIQR() {
        const upiId = 'ayushyaduvanshi56441@okicici';
        const payeeName = 'Ayush Kumar';
        const amount = '1099';
        const transactionRef = 'FORMULA188CM';
        
        // Create UPI payment string
        const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tr=${transactionRef}`;
        
        // Generate QR code using QRious
        const qr = new QRious({
            element: document.getElementById('upi-qr'),
            value: upiString,
            size: 200,
            background: 'white',
            foreground: 'black'
        });
    }
}); 