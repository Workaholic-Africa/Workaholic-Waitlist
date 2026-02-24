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
        let isPartnerChecked = false;

        userTypePartner.addEventListener('click', function (e) {
            if (isPartnerChecked) {
                // Was checked, so uncheck it
                this.checked = false;
                isPartnerChecked = false;
                partnerFields.classList.add('d-none');
                if (companyNameInput) companyNameInput.required = false;
                if (companyLocationInput) companyLocationInput.required = false;
            } else {
                // Was not checked, so check it
                this.checked = true;
                isPartnerChecked = true;
                partnerFields.classList.remove('d-none');
                if (companyNameInput) companyNameInput.required = true;
                if (companyLocationInput) companyLocationInput.required = true;
            }
        });

        // Ensure state sync if reset happens externally
        waitlistModalElement.addEventListener('hidden.bs.modal', () => {
            isPartnerChecked = false;
        });
    }

    // Initialize Supabase
    const supabaseUrl = 'https://nilfyfnerndwvxlvepcb.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbGZ5Zm5lcm5kd3Z4bHZlcGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0Mjk3NzgsImV4cCI6MjA4NzAwNTc3OH0.lBMFZWfoCB0hrQyZkXavPDi2fgFU5cB03ozg6CD0TeM'
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

    // Handle form submission
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = waitlistForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'Joining...';
            btn.disabled = true;

            // Collect Data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const city = document.getElementById('city').value;

            // Determine User Type & Workspace Details
            let userType = 'client';
            let workspaceName = null;
            let workspaceLocation = null;

            if (userTypePartner && userTypePartner.checked) {
                userType = 'partner';
                workspaceName = document.getElementById('companyName').value;
                workspaceLocation = document.getElementById('companyLocation').value;
            }

            // Insert into Supabase
            const { data, error } = await supabaseClient
                .from('waitlist')
                .insert([
                    {
                        name,
                        email,
                        phone,
                        city,
                        user_type: userType,
                        workspace_name: workspaceName,
                        workspace_location: workspaceLocation
                    },
                ])

            if (error) {
                console.error('Error inserting data:', error);
                alert(`Something went wrong: ${error.message || 'Unknown error'}`);
                btn.innerHTML = originalText;
                btn.disabled = false;
            } else {
                alert('Success! You have been added to the waitlist.');
                waitlistModal.hide();
                waitlistForm.reset();

                // Reset dynamic fields
                if (partnerFields) partnerFields.classList.add('d-none');
                if (userTypePartner) {
                    userTypePartner.checked = false;
                    // Reset internal state for toggle logic if it exists
                    // Note: We can't access isPartnerChecked here easily as it's scoped, 
                    // but the hidden.bs.modal listener handles the state reset anyway.
                }

                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // Clear form when modal is closed (cancelled)
    if (waitlistModalElement) {
        waitlistModalElement.addEventListener('hidden.bs.modal', () => {
            if (waitlistForm) {
                waitlistForm.reset();
                if (partnerFields) partnerFields.classList.add('d-none');

                // Explicitly uncheck the radio button
                if (userTypePartner) userTypePartner.checked = false;
            }
        });
    }
});
