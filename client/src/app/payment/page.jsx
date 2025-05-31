// // PaymentPage.js
// "use client"

// import axios from "axios";

// export default function purchase() {
//     const loadRazorpayScript = () => {
//         return new Promise((resolve) => {
//             const script = document.createElement("script");
//             script.src = "https://checkout.razorpay.com/v1/checkout.js";
//             script.onload = () => resolve(true);
//             script.onerror = () => resolve(false);
//             document.body.appendChild(script);
//         });
//     };

//     const handleBuyCredits = async () => {
//         console.log("in handle credits")
//         const res = await loadRazorpayScript();
//         console.log("after script")
//         if (!res) {
//             alert("Razorpay SDK failed to load. Check your internet.");
//             return;
//         }

//         // Create order on backend
//         const { data } = await axios.post("http://localhost:5000/api/payment/create-order", {
//             amount: 10,
//         });
//         console.log("after backend")
//         const options = {
//             key: `${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}`,
//             amount: data.amount,
//             currency: data.currency,
//             order_id: data.id,
//             name: "NextStep",
//             description: "Buy Credits",
//             handler: async function (response) {
//                 // Send response to backend for verification
//                 await axios.post("http://localhost:5000/api/payment/verify", {
//                     razorpay_order_id: response.razorpay_order_id,
//                     razorpay_payment_id: response.razorpay_payment_id,
//                     razorpay_signature: response.razorpay_signature,
//                 });
//                 alert("Payment Successful!");
//             },
//             prefill: {
//                 name: "Test User",
//                 email: "test@example.com",
//             },
//         };
//         console.log("after options")
//         const rzp = new window.Razorpay(options);
//         rzp.open();
//     };



//     return (
//         <div style={{ padding: 40 }}>
//             <h2>Buy Credits</h2>

//             <button onClick={handleBuyCredits}>Pay ₹500</button>
//         </div>
//     );
// };



"use client";

import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function Payment() {
    const { token, user, setuser } = useAuth();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleBuyCredits = async (amount, credits) => {
        const res = await loadRazorpayScript();
        if (!res) {
            alert("Razorpay SDK failed to load. Check your internet.");
            return;
        }

        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`,
                { amount }, // amount in rupees
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const options = {
                key: process.env.NEXT_PUBLIC_TEST_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                order_id: data.id,
                name: "NextStep",

                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/verify`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                creditsPurchased: credits,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        // ✅ Log the successful response
                        console.log("Payment verification response:", verifyRes.data);

                        alert(`Payment successful! ${credits} credits added.`);
                    } catch (error) {
                        console.error("Error verifying payment:", error);
                        alert("Payment verification failed. Please contact support.");
                    }
                },

                prefill: {
                    name: user?.name || "Test User",
                    email: user?.email || "test@example.com",
                },
                theme: {
                    color: "#6366f1",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Something went wrong during payment. Please try again.");
        }
    };

    return (
        <div style={{ padding: "2rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <h2>Buy Credits</h2>

            <div style={{ border: "1px solid #ccc", padding: "2rem", borderRadius: "8px", width: "250px" }}>
                <h3>50 Credits</h3>
                <p>Price: ₹100</p>
                <button onClick={() => handleBuyCredits(100, 50)}>Buy Now</button>
            </div>

            <div style={{ border: "1px solid #ccc", padding: "2rem", borderRadius: "8px", width: "250px" }}>
                <h3>110 Credits</h3>
                <p>Price: ₹200</p>
                <button onClick={() => handleBuyCredits(200, 110)}>Buy Now</button>
            </div>
        </div>
    );
}
