import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Payment.css';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key');  // Add to .env

function PaymentForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { api } = useAuth();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      // Create intent
      const { data: { clientSecret } } = await api.post('/payments/create-intent', { amount: 999 });  // $9.99
      // Confirm payment
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: 'Test User' },  // Enhance with form data
        },
      });
      if (stripeError) {
        setError(stripeError.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('Payment failed. Try again.');
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      {error && <p className="error">{error}</p>}
      <CardElement className="card-element" options={{ style: { base: { fontSize: '16px' } } }} />
      <button type="submit" disabled={!stripe || processing} className="pay-btn">
        {processing ? 'Processing...' : 'Pay $9.99 for Premium'}
      </button>
    </form>
  );
}

function Payment() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = () => {
    alert('Payment successful! Welcome to Premium.');
    navigate('/dashboard');
  };

  if (!user) return <div>Please log in.</div>;

  return (
    <div className="payment-container">
      <h2>Upgrade to Premium</h2>
      <p>Unlock unlimited chats and more!</p>
      <Elements stripe={stripePromise}>
        <PaymentForm onSuccess={handleSuccess} />
      </Elements>
      <button onClick={() => navigate('/')} className="back-btn">Cancel</button>
    </div>
  );
}

export default Payment;