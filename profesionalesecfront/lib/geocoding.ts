export async function getAddressFromCoordinates(lat: number, lng: number): Promise<{
    address: string
    reference?: string
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

        // Use other fields for reference if needed
        const reference = addr.public_building || addr.landmark || ""

        return {
            address: fullAddress || "Ubicación seleccionada",
            reference: reference
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
