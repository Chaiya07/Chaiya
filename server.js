import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});
app.get("/success", (req, res) => {
    res.sendFile("success.html", { root: "public" });
});
app.get("/cancel", (req, res) => {
    res.sendFile("cancel.html", { root: "public" });
});

console.log("Stripe API Key:", process.env.stripe_api); // ตรวจสอบว่าได้คีย์ไหม
console.log("Domain:", process.env.DOMAIN); // ตรวจสอบค่า DOMAIN

let stripeGateway = new Stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;

app.post("/stripe-checkout", async (req, res) => {
    console.log("Request body:", req.body); // ดูว่า frontend ส่งอะไรมาบ้าง
    const lineItems = req.body.items.map((item) => {
        const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "") * 100);
        console.log("item-price:", item.price);
        console.log("unitAmount:", unitAmount);
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.title,
                    images: [item.productImg]
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,
        };
    });
    console.log("lineItems:", lineItems);

    const session = await stripeGateway.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${DOMAIN}/success`,
        cancel_url: `${DOMAIN}/cancel`,
        line_items: lineItems,
        billing_address_collection: "required"
    });
    res.json(session.url);
});

console.log("Starting server...");
app.listen(3000, () => {
    console.log("listening on port 3000;");
});