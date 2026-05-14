async function testGet() {
    const res = await fetch('http://localhost:5000/api/v1/transactions');
    const text = await res.text();
    console.log(text);
}

testGet();
