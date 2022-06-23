require('dotenv').config();
const express = require('express');
const cors = require('cors');

const {
  env: {
    STRIPE_PUBLIC_KEY: stripePublicKey,
    STRIPE_SECRET_KEY: stripeSecretKey,
  },
} = process;

const stripe = require('stripe')(stripeSecretKey);

const app = express();
app.set('port', 5000);
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const products = new Map([
  [1, { price: 1000, name: 'Learn React' }],
  [2, { price: 20000, name: 'Learn JS' }],
]);

app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: 'http://localhost:5000/success',
      cancel_url: 'http://localhost:5000/cancel',
      line_items: items.map((item) => {
        const product = products.get(item.id);

        return {
          price_data: {
            currency: 'usd',
            product_data: { name: product.name },
            unit_amount: product.price,
          },
          quantity: item.quantity,
        };
      }),
    });

    res.json({ checkoutURL: session.url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
});

app.get('/success', (req, res) => {
  res.json({ message: 'Success' });
});

app.get('/cancel', (req, res) => {
  res.json({ message: 'Canceled' });
});

app.listen(app.get('port'), () =>
  console.log(`http://localhost:${app.get('port')}`)
);
