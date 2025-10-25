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
                // Show static QR image (no QRious)
                document.getElementById('upi-qr').src = 'qr code.png.jpeg';
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