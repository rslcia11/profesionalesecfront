// Native fetch in Node 18+

async function checkApi() {
    try {
        const url = 'http://67.217.62.150:3000/api/profesionales/verificados';
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
        console.log("Count:", data.length);
        if (data.length > 0) {
            console.log("First item sample:", JSON.stringify(data[0], null, 2));

            // Check for approved ones specifically
            const approved = data.filter(p => p.verificado === true || p.estado_id === 3 || p.estado === 'aprobado');
            console.log("Approved Count in Response:", approved.length);
        } else {
            console.log("No data returned");
        }

        // Also try fetching WITHOUT filter to see what we get
        const urlAll = 'http://67.217.62.150:3000/api/profesionales/buscar';
        console.log(`\nFetching ALL from: ${urlAll}`);
        const resAll = await fetch(urlAll);
        const dataAll = await resAll.json();
        console.log("Total Count (No Filter):", dataAll.length);
        if (dataAll.length > 0) {
            console.log("First item (No Filter):", JSON.stringify(dataAll[0], null, 2));
            const approvedAll = dataAll.filter(p => p.verificado === true || p.estado_id === 3 || p.estado === 'aprobado');
            console.log("Approved Count in Full List:", approvedAll.length);

            if (approvedAll.length > 0) {
                console.log("Sample Approved Item:", JSON.stringify(approvedAll[0], null, 2));
            }
        }

    } catch (err) {
        console.error(err);
    }
}

checkApi();
