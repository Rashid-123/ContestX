
import crypto from "crypto"
import razorpay from "../utils/razorpay.js"
import User from '../models/User.js';

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


// export const verify_payment = async ( req , res) => {
//    const { razorpay_order_id, razorpay_payment_id, razorpay_signature , creditsPurchased } = req.body;
//      const userId = req.user.id;

  // const body = razorpay_order_id + "|" + razorpay_payment_id;
  // const expectedSignature = crypto
  //   .createHmac("sha256", `${process.env.RAZORPAY_KEY_SECRET}`)
  //   .update(body.toString())
  //   .digest("hex");

//   if (expectedSignature === razorpay_signature) {
//     // 🔓 Verified! Now give credits to user
//     console.log("Payment verified successfully");

    


//     res.send({ success: true });
//   } else {
//     res.status(400).send({ success: false, message: "Invalid signature" });
//   }
// }



export const verify_payment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, creditsPurchased } = req.body;
  const userId = req.user.id;

  // const body = razorpay_order_id + "|" + razorpay_payment_id;
  // const expectedSignature = crypto
  //   .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  //   .update(body.toString())
  //   .digest("hex");

    const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", `${process.env.RAZORPAY_KEY_SECRET}`)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    console.log("✅ Payment verified successfully");

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // If user.credits is null or undefined, initialize to 0
      user.credits = (user.credits || 0) + Number(creditsPurchased);
      await user.save();

      res.json({
        success: true,
        message: `${creditsPurchased} credits added.`,
        credits: user.credits,
      });
    } catch (err) {
      console.error("Error updating user credits:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
};