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
                // Show dynamic QR image based on amount
                updateQRCode();
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

    // Function to update QR code based on total amount
    function updateQRCode() {
        const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails')) || {};
        const quantity = parseInt(orderDetails.quantity) || 1;
        const basePrice = 1099;
        const total = basePrice * quantity;
        
        const qrImage = document.getElementById('upi-qr');
        if (qrImage) {
            let qrCodeFile = 'qr code.png.jpeg'; // Default QR code
            
            if (total === 2198) {
                qrCodeFile = '2198.jpeg';
            } else if (total === 3297) {
                qrCodeFile = '3297.jpeg';
            } else if (total === 4396) {
                qrCodeFile = '4396.jpeg';
            }
            // For 1099 and other amounts, use default QR code
            
            qrImage.src = qrCodeFile;
        }
    }

    // UPI App selection handling
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('upi-app-btn') || e.target.closest('.upi-app-btn')) {
            const btn = e.target.classList.contains('upi-app-btn') ? e.target : e.target.closest('.upi-app-btn');
            const appUrl = btn.getAttribute('data-url');
            const appName = btn.querySelector('span').textContent;
            
            // Try to open the UPI app
            try {
                window.location.href = appUrl;
                
                // Show feedback to user
                btn.style.background = '#e8f5e8';
                btn.style.borderColor = '#28a745';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    btn.style.background = '#fff';
                    btn.style.borderColor = '#e9ecef';
                }, 2000);
                
                // Show info message
                const infoDiv = document.querySelector('.upi-apps-section div[style*="margin-top:12px"]');
                if (infoDiv) {
                    const originalText = infoDiv.innerHTML;
                    infoDiv.innerHTML = `<i class="fas fa-check-circle" style="color: #28a745;"></i> Opening ${appName}...`;
                    infoDiv.style.color = '#28a745';
                    
                    setTimeout(() => {
                        infoDiv.innerHTML = originalText;
                        infoDiv.style.color = '#666';
                    }, 3000);
                }
                
            } catch (error) {
                console.error('Error opening UPI app:', error);
                alert(`Unable to open ${appName}. Please make sure the app is installed on your device.`);
            }
        }
    });
}); 