
import crypto from "crypto"
import razorpay from "../utils/razorpay.js"

export const create_order = async ( req , res) => {
 console.log("in create order")
     try {
    const { amount } = req.body;
  console.log("amount " , amount)
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    });
     console.log("order : " , order)
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
  
}


export const verify_payment = async ( req , res) => {
   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", `${process.env.RAZORPAY_KEY_SECRET}`)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // 🔓 Verified! Now give credits to user
    console.log("Payment verified successfully");
    res.send({ success: true });
  } else {
    res.status(400).send({ success: false, message: "Invalid signature" });
  }
}