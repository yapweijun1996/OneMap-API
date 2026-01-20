// Auto-extracted from demo-tools.html to keep each file <= 300 lines.
        // WGS84 to SVY21 Conversion
        document.getElementById('btnWgsToSvy').addEventListener('click', async () => {
            const lat = parseFloat(document.getElementById('wgs84Lat').value);
            const lng = parseFloat(document.getElementById('wgs84Lng').value);

            if (!lat || !lng) {
                alert('Please enter valid latitude and longitude');
                return;
            }

            try {
                const response = await fetch(`https://www.onemap.gov.sg/api/common/convert/4326to3414?latitude=${lat}&longitude=${lng}`);
                const data = await response.json();

                const resultEl = document.getElementById('resultWgsToSvy');
                const resultTextEl = document.getElementById('resultWgsToSvyText');

                resultTextEl.textContent = `N: ${data.Y}, E: ${data.X}`;
                resultEl.classList.remove('hidden');
            } catch (error) {
                alert('Conversion failed: ' + error.message);
            }
        });

        // SVY21 to WGS84 Conversion
        document.getElementById('btnSvyToWgs').addEventListener('click', async () => {
            const north = parseFloat(document.getElementById('svy21North').value);
            const east = parseFloat(document.getElementById('svy21East').value);

            if (!north || !east) {
                alert('Please enter valid northing and easting values');
                return;
            }

            try {
                const response = await fetch(`https://www.onemap.gov.sg/api/common/convert/3414to4326?X=${east}&Y=${north}`);
                const data = await response.json();

                const resultEl = document.getElementById('resultSvyToWgs');
                const resultTextEl = document.getElementById('resultSvyToWgsText');

                resultTextEl.textContent = `Lat: ${data.latitude}, Lng: ${data.longitude}`;
                resultEl.classList.remove('hidden');
            } catch (error) {
                alert('Conversion failed: ' + error.message);
            }
        });

        // Batch Conversion
        document.getElementById('btnBatchConvert').addEventListener('click', async () => {
            const input = document.getElementById('batchInput').value.trim();
            const conversionType = document.getElementById('batchConversionType').value;
            const outputEl = document.getElementById('batchOutput');

            if (!input) {
                alert('Please enter coordinates to convert');
                return;
            }

            const lines = input.split('\n').filter(line => line.trim());
            const results = [];

            for (const line of lines) {
                const [val1, val2] = line.split(',').map(v => parseFloat(v.trim()));

                if (!val1 || !val2) {
                    results.push(`Error: Invalid format - ${line}`);
                    continue;
                }

                try {
                    let response, data;

                    if (conversionType === 'wgs-to-svy') {
                        response = await fetch(`https://www.onemap.gov.sg/api/common/convert/4326to3414?latitude=${val1}&longitude=${val2}`);
                        data = await response.json();
                        results.push(`${data.Y},${data.X}`);
                    } else {
                        response = await fetch(`https://www.onemap.gov.sg/api/common/convert/3414to4326?X=${val2}&Y=${val1}`);
                        data = await response.json();
                        results.push(`${data.latitude},${data.longitude}`);
                    }
                } catch (error) {
                    results.push(`Error: ${line}`);
                }
            }

            outputEl.value = results.join('\n');
        });

        // Copy batch results
        document.getElementById('btnCopyBatch').addEventListener('click', () => {
            const output = document.getElementById('batchOutput');
            if (!output.value) {
                alert('No results to copy');
                return;
            }

            output.select();
            document.execCommand('copy');

            const btn = document.getElementById('btnCopyBatch');
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });

        // Example fill functions
        window.fillWgs84Example = function () {
            document.getElementById('wgs84Lat').value = '1.283627';
            document.getElementById('wgs84Lng').value = '103.851959';
        };

        window.fillSvy21Example = function () {
            document.getElementById('svy21North').value = '29654.024';
            document.getElementById('svy21East').value = '30179.229';
        };

        // Enter key support
        ['wgs84Lat', 'wgs84Lng'].forEach(id => {
            document.getElementById(id).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') document.getElementById('btnWgsToSvy').click();
            });
        });

        ['svy21North', 'svy21East'].forEach(id => {
            document.getElementById(id).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') document.getElementById('btnSvyToWgs').click();
            });
        });
