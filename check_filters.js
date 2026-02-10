// Native fetch in Node 18+

async function checkFilters() {
    try {
        const url = 'http://67.217.62.150:3000/api/profesionales/verificados';
        console.log(`Fetching from: ${url}`);

        const res = await fetch(url);
        if (!res.ok) {
            console.log(`Error: ${res.status} ${res.statusText}`);
            return;
        }

        const data = await res.json();
        console.log(`Total professionals: ${data.length}`);

        const professions = new Map();
        const cities = new Map();
        const provinces = new Map();

        data.forEach(p => {
            if (p.profesion) {
                professions.set(p.profesion.id, p.profesion.nombre);
            }
            if (p.ciudad) {
                cities.set(p.ciudad.id, p.ciudad.nombre);
                if (p.ciudad.provincia) {
                    provinces.set(p.ciudad.provincia.id, p.ciudad.provincia.nombre);
                }
            }
        });

        console.log("\n--- REAL PROFESSIONS IN DB ---");
        [...professions.entries()].sort((a, b) => a[0] - b[0]).forEach(([id, name]) => console.log(`${id}: ${name}`));

        console.log("\n--- REAL CITIES IN DB ---");
        [...cities.entries()].sort((a, b) => a[0] - b[0]).forEach(([id, name]) => console.log(`${id}: ${name}`));

        console.log("\n--- REAL PROVINCES IN DB ---");
        [...provinces.entries()].sort((a, b) => a[0] - b[0]).forEach(([id, name]) => console.log(`${id}: ${name}`));

    } catch (error) {
        console.error("Error:", error);
    }
}

checkFilters();
