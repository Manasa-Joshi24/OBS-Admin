async function testCreate() {
    const res = await fetch('http://localhost:5000/api/v1/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: '5a001b9c-9b9a-4c3d-8269-12a279076a8d',
            amount: 3500.00,
            transaction_type: 'UPI',
            reference_number: 'UPI-TEST-001',
            transaction_status: 'completed',
            sender_upi_id: 'test_sender@finova',
            receiver_upi_id: 'test_receiver@finova'
        })
    });
    const data = await res.json();
    console.log("Creation result:", data);
}

testCreate();
