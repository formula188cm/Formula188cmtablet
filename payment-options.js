document.addEventListener('DOMContentLoaded', function() {
    // Payment method switching
    const methodBtns = document.querySelectorAll('.method-btn');
    const sections = {
        bank: document.getElementById('bank-section'),
        upi: document.getElementById('upi-section'),
        online: document.getElementById('online-section')
    };
    methodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (btn.classList.contains('disabled')) return;
            methodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            Object.keys(sections).forEach(key => sections[key].style.display = 'none');
            sections[btn.getAttribute('data-method')].style.display = 'block';
            if (btn.getAttribute('data-method') === 'upi') {
                // Generate QR code for UPI
                new QRious({
                    element: document.getElementById('upi-qr'),
                    value: 'upi://pay?pa=ayushyaduvanshi56441@okhdfcbank&pn=Formula188cm',
                    size: 160
                });
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
    // Thank you alert
    document.getElementById('bank-paid-btn').addEventListener('click', function() {
        alert('Thank you for your payment! Please send the payment screenshot to WhatsApp: 8989252740 or Email: formula188cm@gmail.com');
    });
    document.getElementById('upi-paid-btn').addEventListener('click', function() {
        alert('Thank you for your payment! Please send the payment screenshot to WhatsApp: 8989252740 or Email: formula188cm@gmail.com');
    });
}); 