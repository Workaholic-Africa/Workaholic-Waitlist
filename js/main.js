document.addEventListener('DOMContentLoaded', () => {
    console.log('Workaholic Waitlist App Initialized');

    // Initialize Bootstrap modal instance if needed for programmatic control
    const waitlistModalElement = document.getElementById('waitlistModal');
    const waitlistModal = new bootstrap.Modal(waitlistModalElement);

    // Dynamic Form Logic
    const userTypeSelect = document.getElementById('userType');
    const clientFields = document.getElementById('clientFields');
    const partnerFields = document.getElementById('partnerFields');

    // Inputs
    const cityInput = document.getElementById('city');
    const companyNameInput = document.getElementById('companyName');
    const companyLocationInput = document.getElementById('companyLocation');

    if (userTypeSelect) {
        userTypeSelect.addEventListener('change', function () {
            const value = this.value;

            // Reset all first
            clientFields.classList.add('d-none');
            partnerFields.classList.add('d-none');

            // Remove required attributes from hidden fields
            if (cityInput) cityInput.required = false;
            if (companyNameInput) companyNameInput.required = false;
            if (companyLocationInput) companyLocationInput.required = false;

            if (value === 'client') {
                clientFields.classList.remove('d-none');
                if (cityInput) cityInput.required = true;
            } else if (value === 'partner') {
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

            // Basic check so we don't submit if user type isn't selected (though HTML required handles this)
            if (!userTypeSelect.value) {
                alert('Please select a user type.');
                return;
            }

            const btn = waitlistForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'Joining...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Success! You have been added to the waitlist.');
                waitlistModal.hide();
                waitlistForm.reset();

                // Reset dynamic fields manually on reset
                clientFields.classList.add('d-none');
                partnerFields.classList.add('d-none');

                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1000);
        });
    }
});
