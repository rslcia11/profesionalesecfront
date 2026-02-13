async function testArticulos() {
    try {
        const res = await fetch('http://67.217.62.150:3000/api/articulos');
        console.log(`Status: ${res.status}`);
        const data = await res.json();
        console.log(`Total articles: ${Array.isArray(data) ? data.length : 'not array'}`);
        console.log(JSON.stringify(data, null, 2).substring(0, 2000));
    } catch (e) {
        console.log('Error:', e.message);
    }
}
testArticulos();
