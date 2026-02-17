document.addEventListener('DOMContentLoaded', () => {
    console.log('Workaholic Waitlist App Initialized');

    // Initialize Bootstrap modal instance if needed for programmatic control
    const waitlistModalElement = document.getElementById('waitlistModal');
    const waitlistModal = new bootstrap.Modal(waitlistModalElement);

    // Dynamic Form Logic
    const userTypePartner = document.getElementById('userTypePartner');
    const partnerFields = document.getElementById('partnerFields');

    // Inputs
    const cityInput = document.getElementById('city');
    const companyNameInput = document.getElementById('companyName');
    const companyLocationInput = document.getElementById('companyLocation');

    if (userTypePartner) {
        userTypePartner.addEventListener('change', function () {
            if (this.checked) {
                partnerFields.classList.remove('d-none');
                if (companyNameInput) companyNameInput.required = true;
                if (companyLocationInput) companyLocationInput.required = true;
            }
        });
    }

    // Handle form submission (simulation)
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = waitlistForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'Joining...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Success! You have been added to the waitlist.');
                waitlistModal.hide();
                waitlistForm.reset();

                // Reset dynamic fields manually on reset
                if (partnerFields) partnerFields.classList.add('d-none');

                // Explicitly uncheck the radio button just in case
                if (userTypePartner) userTypePartner.checked = false;

                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1000);
        });
    }
});
