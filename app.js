require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const Stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const app = express();

const merch = [
  {
    id: 1,
    title: "HISS - ORIGINAL CAT MERCH",
    price: 20.97,
    img_url:
      "https://mockup-api.teespring.com/v3/image/m_Sf1oHBb_5wJSlQ4Iulj-nIE_Q/560/560.jpg",
  },
  {
    id: 2,
    title: "IRON MEOWDEN - PAWERSLAVE",
    price: 37.69,
    img_url:
      "https://mockup-api.teespring.com/v3/image/llHuonlQpiX9rOR2Gpr2s-sLRds/560/560.jpg",
  },
  {
    id: 3,
    title: "MEOWTALLICA - MASTER OF KITTENS",
    price: 17.99,
    img_url:
      "https://vangogh.teespring.com/v3/image/NlBKwmjatyf2NI2nmu44aaaNl6c/560/560.jpg",
  },
  {
    id: 4,
    title: "CAT DIVISION - FURRY PLEASURES",
    price: 26.96,
    img_url:
      "https://vangogh.teespring.com/v3/image/IEuZs44vA6PNnpL5pr1YdTtgDOI/560/560.jpg",
  },
  {
    id: 5,
    title: "I DO WHAT I WANT - WITCH'S CAT",
    price: 23.97,
    img_url:
      "https://vangogh.teespring.com/v3/image/Yra2eOqc59nZidtR7FtBmjdWcVw/560/560.jpg",
  },
  {
    id: 6,
    title: "CAT DIVISION - FURRY PLEASURES",
    price: 17.97,
    img_url:
      "https://vangogh.teespring.com/v3/image/Yj66bYvpPbqD4VeVNBiGYl1NFF0/560/560.jpg",
  },
];

app.set("view-engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", {
    merch: merch,
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
  });
});

app.post("/create-checkout-session", async (req, res) => {
  const price = req.body.price;
  const session = await Stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Stubborn Attachments",
            images: ["https://i.imgur.com/EHyR2nP.png"],
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:4000/success.html`,
    cancel_url: `http://localhost:4000/cancel.html`,
  });

  res.json({ id: session.id });
});

app.listen(process.env.PORT, () => console.log("Server is running"));
