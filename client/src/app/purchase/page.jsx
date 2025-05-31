// PaymentPage.js
"use client"

import axios from "axios";

export default function purchase() {
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleBuyCredits = async () => {
        console.log("in handle credits")
        const res = await loadRazorpayScript();
        console.log("after script")
        if (!res) {
            alert("Razorpay SDK failed to load. Check your internet.");
            return;
        }

        // Create order on backend
        const { data } = await axios.post("http://localhost:5000/api/payment/create-order", {
            amount: 10,
        });
        console.log("after backend")
        const options = {
            key: `${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}`,
            amount: data.amount,
            currency: data.currency,
            order_id: data.id,
            name: "MyApp",
            description: "Buy Credits",
            handler: async function (response) {
                // Send response to backend for verification
                await axios.post("http://localhost:5000/api/payment/verify", {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                });
                alert("Payment Successful!");
            },
            prefill: {
                name: "Test User",
                email: "test@example.com",
            },
        };
        console.log("after options")
        const rzp = new window.Razorpay(options);
        rzp.open();
    };



    return (
        <div style={{ padding: 40 }}>
            <h2>Buy Credits</h2>
            <button onClick={handleBuyCredits}>Pay ₹500</button>
        </div>
    );
};

