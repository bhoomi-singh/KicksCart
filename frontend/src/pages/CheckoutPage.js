import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { MapPin, CreditCard, Truck, ChevronRight } from 'lucide-react';
import { createOrder } from '../store/slices/orderSlice';
import { selectCartTotal } from '../store/slices/cartSlice';
import api from '../utils/api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CARD_STYLE = {
  style: {
    base: { color: '#f5f5f5', fontFamily: 'Syne, sans-serif', fontSize: '15px', '::placeholder': { color: '#555555' } },
    invalid: { color: '#ff3b3b' },
  },
};

const SHIPPING_PRICE = 99;
const TAX_RATE = 0.18;

function CheckoutForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { items } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const subtotal = useSelector(selectCartTotal);
  const [step, setStep] = useState(1); // 1: address, 2: payment
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [processing, setProcessing] = useState(false);

  const shipping = subtotal > 2000 ? 0 : SHIPPING_PRICE;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: '', street: '', city: '',
    state: '', postalCode: '', country: 'India',
  });

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const required = ['fullName', 'phone', 'street', 'city', 'state', 'postalCode'];
    for (const f of required) {
      if (!address[f]) return toast.error(`Please fill in ${f.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return toast.error('Your cart is empty');
    setProcessing(true);

    const orderItems = items.map(item => ({
      product: item.product._id || item.product,
      name: item.product.name,
      image: item.product.images?.[0]?.url || '',
      price: item.price,
      size: item.size,
      quantity: item.quantity,
    }));

    const orderData = {
      orderItems, shippingAddress: address, paymentMethod,
      itemsPrice: subtotal, shippingPrice: shipping, taxPrice: tax, totalPrice: total,
    };

    try {
      // Create order first
      const orderResult = await dispatch(createOrder(orderData)).unwrap();

      if (paymentMethod === 'stripe') {
        if (!stripe || !elements) return;
        const { data } = await api.post('/payments/create-intent', { amount: total, orderId: orderResult._id });
        const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: { card: elements.getElement(CardElement) },
        });
        if (error) throw new Error(error.message);
        if (paymentIntent.status === 'succeeded') {
          await api.put(`/orders/${orderResult._id}/pay`, { id: paymentIntent.id, status: 'succeeded' });
          toast.success('Payment successful! 🎉');
          navigate(`/order-success/${orderResult._id}`);
        }
      } else {
        // COD
        toast.success('Order placed successfully!');
        navigate(`/order-success/${orderResult._id}`);
      }
    } catch (err) {
      toast.error(err?.message || err || 'Order failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 48 }}>
        <h1 className="display-md" style={{ marginBottom: 40 }}>Checkout</h1>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
          {[{ n: 1, label: 'Shipping' }, { n: 2, label: 'Payment' }].map((s, i) => (
            <React.Fragment key={s.n}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: s.n < step ? 'pointer' : 'default' }}
                onClick={() => s.n < step && setStep(s.n)}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, background: step >= s.n ? 'var(--accent)' : 'var(--bg-elevated)', color: step >= s.n ? '#000' : 'var(--gray-300)', transition: 'var(--transition)' }}>{s.n}</div>
                <span style={{ fontWeight: 600, fontSize: 14, color: step >= s.n ? 'var(--white)' : 'var(--gray-300)' }}>{s.label}</span>
              </div>
              {i === 0 && <ChevronRight size={16} color="var(--gray-500)" />}
            </React.Fragment>
          ))}
        </div>

        <div className="checkout-grid">
          <div>
            {/* Step 1: Shipping */}
            {step === 1 && (
              <form onSubmit={handleAddressSubmit}>
                <div className="checkout-section">
                  <h2 className="checkout-section-title"><MapPin size={20} color="var(--accent)" /> Shipping Address</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                      { key: 'fullName', label: 'Full Name', placeholder: 'John Doe', full: false },
                      { key: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210', full: false },
                      { key: 'street', label: 'Street Address', placeholder: '123 Main St, Apt 4B', full: true },
                      { key: 'city', label: 'City', placeholder: 'Mumbai', full: false },
                      { key: 'state', label: 'State', placeholder: 'Maharashtra', full: false },
                      { key: 'postalCode', label: 'Postal Code', placeholder: '400001', full: false },
                      { key: 'country', label: 'Country', placeholder: 'India', full: false },
                    ].map(field => (
                      <div key={field.key} className="form-group" style={{ gridColumn: field.full ? 'span 2' : 'span 1' }}>
                        <label className="form-label">{field.label}</label>
                        <input className="form-input" placeholder={field.placeholder}
                          value={address[field.key]} onChange={e => setAddress({ ...address, [field.key]: e.target.value })} />
                      </div>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  Continue to Payment <ChevronRight size={18} />
                </button>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div>
                <div className="checkout-section">
                  <h2 className="checkout-section-title"><CreditCard size={20} color="var(--accent)" /> Payment Method</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                    {[
                      { value: 'stripe', label: 'Credit / Debit Card', desc: 'Secure payment via Stripe' },
                      { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                    ].map(m => (
                      <label key={m.value} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, border: `1.5px solid ${paymentMethod === m.value ? 'var(--accent)' : 'var(--gray-700)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: paymentMethod === m.value ? 'var(--accent-glow)' : 'transparent', transition: 'var(--transition)' }}>
                        <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} style={{ accentColor: 'var(--accent)' }} />
                        <div>
                          <div style={{ fontWeight: 700 }}>{m.label}</div>
                          <div style={{ fontSize: 13, color: 'var(--gray-300)' }}>{m.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === 'stripe' && (
                    <div className="stripe-element">
                      <CardElement options={CARD_STYLE} />
                    </div>
                  )}
                </div>

                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handlePlaceOrder} disabled={processing || !stripe}>
                  {processing ? <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Processing…</> : `Place Order · ₹${total.toLocaleString()}`}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="checkout-section" style={{ position: 'sticky', top: 88 }}>
              <h2 className="checkout-section-title"><Truck size={20} color="var(--accent)" /> Order Summary</h2>
              {items.map(item => (
                <div key={item._id} className="order-summary-item">
                  <img src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/60'} alt={item.product?.name} className="order-summary-img" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.product?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-300)', fontFamily: 'var(--font-mono)' }}>Size: {item.size} × {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}

              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Subtotal', value: `₹${subtotal.toLocaleString()}` },
                  { label: 'Shipping', value: shipping === 0 ? 'FREE' : `₹${shipping}` },
                  { label: 'GST (18%)', value: `₹${tax.toLocaleString()}` },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--gray-300)' }}>
                    <span>{row.label}</span>
                    <span style={{ color: row.value === 'FREE' ? 'var(--accent)' : 'inherit' }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--gray-700)', fontWeight: 800, fontSize: 18 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: 28 }}>₹{total.toLocaleString()}</span>
                </div>
              </div>
              {shipping > 0 && <p style={{ fontSize: 12, color: 'var(--gray-300)', marginTop: 12, textAlign: 'center' }}>Free shipping on orders over ₹2,000</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
