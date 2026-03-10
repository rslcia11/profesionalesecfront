export async function getAddressFromCoordinates(lat: number, lng: number): Promise<{
    address: string
    reference?: string
    province?: string
    city?: string
}> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
                headers: {
                    "User-Agent": "ProfesionalesEc/1.0",
                    "Accept-Language": "es"
                }
            }
        )

        if (!response.ok) throw new Error("Geocoding failed")

        const data = await response.json()
        const addr = data.address || {}

        // Construct a clean address string
        const street = addr.road || addr.pedestrian || addr.street || ""
        const number = addr.house_number || ""
        const suburb = addr.suburb || addr.neighbourhood || ""

        let fullAddress = street
        if (number) fullAddress += ` ${number}`
        if (suburb) fullAddress += `, ${suburb}`

        try {
            // Intenta obtener calles transversales dentro de un pequeño recuadro (aprox 20-30 metros)
            const margin = 0.0002;
            const bbox = `${lng - margin},${lat - margin},${lng + margin},${lat + margin}`;
            const mapRes = await fetch(`https://api.openstreetmap.org/api/0.6/map?bbox=${bbox}`, {
                headers: {
                    "User-Agent": "ProfesionalesEc/1.0"
                }
            });
            if (mapRes.ok) {
                const xmlText = await mapRes.text();
                // Parse XML manually simply for performance & browser compatibility
                // looking for <way> ... <tag k="name" v="..."/> ... </way>
                const ways = xmlText.split("<way");
                const streetNames = new Set<string>();
                
                for (let i = 1; i < ways.length; i++) {
                    const wayBody = ways[i];
                    if (wayBody.includes('k="highway"')) {
                        const nameMatch = wayBody.match(/<tag k="name" v="([^"]+)"/);
                        if (nameMatch && nameMatch[1]) {
                            const foundStreet = nameMatch[1];
                            // Exclude the main street we already have
                            if (foundStreet.toLowerCase() !== street.toLowerCase()) {
                                streetNames.add(foundStreet);
                            }
                        }
                    }
                }
                
                const intersections = Array.from(streetNames);
                if (intersections.length > 0) {
                    // Si encontramos 1 o 2 intersecciones, las agregamos con "y"
                    if (intersections.length <= 2) {
                         fullAddress += ` y ${intersections.join(" y ")}`;
                    } else {
                         // Si hay muchas tomamos solo la primera para evitar sobrecargar la dirección
                         fullAddress += ` y ${intersections[0]}`;
                    }
                }
            }
        } catch (err) {
            console.error("Error fetching intersections:", err);
            // Ignore error, main address is safe
        }

        // Use other fields for reference if needed
        const reference = addr.public_building || addr.landmark || ""
        const province = addr.state || addr.region || ""
        const city = addr.city || addr.town || addr.village || addr.municipality || ""

        return {
            address: fullAddress || "Ubicación seleccionada",
            reference: reference,
            province,
            city
        }
    } catch (error) {
        console.error("Error fetching address:", error)
        return { address: "" }
    }
}

export async function getCoordinatesFromAddress(query: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
            {
                headers: {
                    "User-Agent": "ProfesionalesEc/1.0",
                    "Accept-Language": "es"
                }
            }
        )

        if (!response.ok) throw new Error("Geocoding failed")

        const data = await response.json()
        if (data && data.length > 0) {
            return {
                lat: Number.parseFloat(data[0].lat),
                lng: Number.parseFloat(data[0].lon)
            }
        }
        return null
    } catch (error) {
        console.error("Error fetching coordinates:", error)
        return null
    }
}
