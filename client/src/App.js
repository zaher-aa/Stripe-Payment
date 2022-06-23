import axios from 'axios';

function App() {
  const items = [
    { id: 1, quantity: 2 },
    { id: 2, quantity: 5 },
  ];

  const checkout = async () => {
    try {
      const {
        data: { checkoutURL },
      } = await axios.post('http://localhost:5000/create-checkout-session', {
        items,
      });

      window.location.href = checkoutURL;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <button onClick={checkout}>Checkout</button>
    </>
  );
}

export default App;
