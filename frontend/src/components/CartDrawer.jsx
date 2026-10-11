import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  MapPin,
  CreditCard,
  CheckCircle,
  Truck,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    grandTotal,
    totalItemCount,
  } = useCart();

  const [step, setStep] = useState('CART'); // 'CART' | 'CHECKOUT' | 'SUCCESS'
  const [address, setAddress] = useState({
    street: 'Road No. 12, Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    phone: '+91 9876543210',
    name: 'User',
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'COD' | 'CARD' | 'NETBANKING'
  const [upiId, setUpiId] = useState('user@upi');
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [processing, setProcessing] = useState(false);

  if (!isCartOpen) return null;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!address.street.trim() || !address.pincode.trim()) {
      alert('Please enter complete delivery address and pincode.');
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      const receipt = {
        orderId: `MB-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        items: [...cartItems],
        total: grandTotal,
        address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
        paymentMethod,
        estimatedDelivery: 'Tomorrow by 2:00 PM',
      };

      setOrderReceipt(receipt);
      setProcessing(false);
      clearCart();
      setStep('SUCCESS');
    }, 1200);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setStep('CART');
      setOrderReceipt(null);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-brand-400" />
              <div>
                <h2 className="font-extrabold text-base">Your Health Cart</h2>
                <p className="text-[11px] text-slate-300">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEP 1: CART ITEMS */}
          {step === 'CART' && (
            <div className="flex-grow flex flex-col justify-between overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="my-auto text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Browse our medicine catalog or generic alternatives to add items to your cart.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-4 divide-y divide-slate-100">
                    {cartItems.map((item) => (
                      <div key={item.id} className="pt-4 first:pt-0 flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                          <div className="text-[11px] text-brand-700 font-semibold">{item.genericName}</div>
                          <div className="text-xs font-extrabold text-slate-900 pt-1">
                            ₹{item.price.toFixed(2)}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Proceed to Address */}
                  <div className="border-t border-slate-200 pt-4 space-y-3 bg-slate-50 p-4 rounded-2xl">
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Items Subtotal:</span>
                        <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Delivery Fee (Telangana):</span>
                        <span className="font-bold text-slate-900">
                          {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${deliveryFee}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                        <span>Grand Total:</span>
                        <span className="text-brand-600">₹{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep('CHECKOUT')}
                      className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Proceed to Shipping Address & Payment</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 2: CHECKOUT (ADDRESS & PAYMENT) */}
          {step === 'CHECKOUT' && (
            <form onSubmit={handlePlaceOrder} className="flex-grow flex flex-col justify-between overflow-y-auto p-6 space-y-6">
              <div className="space-y-5">
                <button
                  type="button"
                  onClick={() => setStep('CART')}
                  className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
                </button>

                {/* Section 1: Delivery Address */}
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-600" /> 1. Enter Delivery Address
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Street / House No. / Landmark *</label>
                      <input
                        type="text"
                        required
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="e.g. H.No 12-5-80, Road No. 12, Banjara Hills"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Pincode *</label>
                        <input
                          type="text"
                          required
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          placeholder="500034"
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Payment Method Selection */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-brand-600" /> 2. Select Payment Method
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'UPI', label: 'UPI / PhonePe / GPay', desc: 'Instant UPI Transfer' },
                      { id: 'COD', label: 'Cash on Delivery', desc: 'Pay Cash at doorstep' },
                      { id: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay' },
                      { id: 'NETBANKING', label: 'Net Banking', desc: 'All Indian Banks' },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          paymentMethod === pm.id
                            ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-bold leading-tight">{pm.label}</span>
                        <span className="text-[10px] text-slate-500 font-normal mt-1">{pm.desc}</span>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-200 space-y-1 text-xs">
                      <label className="block text-brand-900 font-semibold">Enter UPI ID (VPA)</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@upi"
                        className="w-full px-3 py-1.5 bg-white border border-brand-300 rounded-lg text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm Order Footer */}
              <div className="border-t border-slate-200 pt-4 space-y-3 bg-slate-50 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-brand-600 text-lg">₹{grandTotal.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {processing ? 'Processing Order...' : `Confirm & Place Order (₹${grandTotal.toFixed(2)})`}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ORDER SUCCESS RECEIPT */}
          {step === 'SUCCESS' && orderReceipt && (
            <div className="flex-grow flex flex-col justify-between overflow-y-auto p-6 space-y-6">
              <div className="my-auto text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xl">Order Confirmed!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your medicine purchase has been successfully placed.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-semibold">Order Reference:</span>
                    <span className="font-mono font-bold text-brand-700">{orderReceipt.orderId}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="font-semibold text-slate-800">{orderReceipt.date}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Payment Mode:</span>
                    <span className="font-bold text-emerald-700 uppercase">{orderReceipt.paymentMethod}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total Paid:</span>
                    <span className="font-bold text-slate-900 text-sm">₹{orderReceipt.total.toFixed(2)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-brand-600" /> Delivery Address:
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">{orderReceipt.address}</p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Estimated Delivery: {orderReceipt.estimatedDelivery}
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Back to Dashboard / Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
