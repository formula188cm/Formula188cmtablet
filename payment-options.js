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
        
        // Try multiple UPI deep link formats
        const upiLinks = [
            `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tr=${transactionRef}`,
            `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`,
            `upi://pay?pa=${upiId}&am=${amount}&cu=INR`,
            `upi://pay?pa=${upiId}&am=${amount}`
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
                // Fallback: show manual instructions
                alert('UPI app could not be opened automatically. Please:\n\n1. Open your UPI app manually\n2. Enter UPI ID: ' + upiId + '\n3. Enter amount: ₹' + amount + '\n4. Complete the payment\n\nOr use the QR code below.');
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