
async function checkPonencias() {
    try {
        const url = 'http://67.217.62.150:3000/api/ponencias';
        console.log(`Fetching from: ${url}`);

        const res = await fetch(url);
        if (!res.ok) {
            console.log(`Error: ${res.status} ${res.statusText}`);
            const text = await res.text();
            console.log(text);
            return;
        }

        const data = await res.json();
        console.log("Status Code:", res.status);
        if (Array.isArray(data)) {
            console.log("Count:", data.length);
            if (data.length > 0) {
                console.log("First item sample:", JSON.stringify(data[0], null, 2));
            } else {
                console.log("Empty array returned");
            }
        } else {
            console.log("Response is not an array. Structure:", JSON.stringify(data, null, 2));
        }

    } catch (err) {
        console.error(err);
    }
}

checkPonencias();
