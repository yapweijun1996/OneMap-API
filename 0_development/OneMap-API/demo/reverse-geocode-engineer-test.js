import { getOneMapToken, reverseGeocode } from './reverse-geocode-engineer-lib.js';

const elEmail = document.getElementById('email');
const elPassword = document.getElementById('password');
const elSave = document.getElementById('save-creds');
const elStatus = document.getElementById('status');
const elOutput = document.getElementById('json-output');

// Load credentials from localStorage
const storedEmail = localStorage.getItem('onemap_test_email');
const storedPassword = localStorage.getItem('onemap_test_password');

if (storedEmail) elEmail.value = storedEmail;
if (storedPassword) elPassword.value = storedPassword;

elSave.addEventListener('click', () => {
    localStorage.setItem('onemap_test_email', elEmail.value);
    localStorage.setItem('onemap_test_password', elPassword.value);
    checkAndRun();
});

async function checkAndRun() {
    elStatus.textContent = 'Checking parameters...';
    elOutput.textContent = '';

    // Parse query string: ?coordinate=1.31,103.86
    const params = new URLSearchParams(window.location.search);
    const coordinate = params.get('coordinate'); // "lat, lng"

    if (!coordinate) {
        elStatus.textContent = 'Guidance: Add ?coordinate=lat,lng to the URL to test.';
        return;
    }

    const email = elEmail.value.trim();
    const password = elPassword.value.trim();

    if (!email || !password) {
        elStatus.innerHTML = '<span class="error">Missing credentials. Please enter OneMap Email/Password above and click "Save & Retry".</span>';
        return;
    }

    try {
        elStatus.textContent = 'Authenticating (getting token)...';

        // 1. Get Token
        const tokenRes = await getOneMapToken({ email, password });
        const token = tokenRes.access_token;
        if (!token) {
            throw new Error('Authentication failed: No access_token received.');
        }

        // 2. Parse Coordinate
        const parts = coordinate.split(',').map(s => s.trim());
        if (parts.length !== 2) {
            throw new Error(`Invalid coordinate format: "${coordinate}". Expected "lat,lng"`);
        }
        const lat = parts[0];
        const lng = parts[1];

        elStatus.textContent = `Reverse Geocoding (${lat}, ${lng})...`;

        // 3. Reverse Geocode
        const result = await reverseGeocode({
            lat,
            lng,
            token,
            buffer: 50,
            addressType: 'All' // Default to All
        });

        // 4. Output
        elStatus.innerHTML = '<span class="success">Done</span>';
        elOutput.textContent = JSON.stringify(result.raw, null, 2);

    } catch (err) {
        console.error(err);
        const setErr = (msg) => elStatus.innerHTML = `<span class="error">${msg}</span>`;

        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
            setErr('Unauthorized. Please check your Email/Password.');
        } else {
            setErr(`Error: ${err.message}`);
        }
    }
}

// Run immediately on load
checkAndRun();
