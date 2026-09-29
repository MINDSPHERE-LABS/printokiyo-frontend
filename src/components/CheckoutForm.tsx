import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, Globe, Compass, ShoppingBag, CreditCard, ArrowLeft, X, ShieldCheck, QrCode } from 'lucide-react';
import type { Product, StoreSettings } from '../types';
import { createRazorpayPaymentLink } from '../api/payment';
import { getImageUrl } from '../utils/image';
import { getEffectivePrice } from '../utils/price';
import { calculateCartItems, groupCalculatedCartItems } from '../utils/cartOffers';
import { BrandBuffer } from './BrandBuffer';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutFormProps {
  cart: Product[];
  token: string | null;
  initialName?: string;
  initialEmail?: string;
  initialPhone: string;
  onBack: () => void;
  onRemoveItem: (index: number) => void;
  onSyncCart?: (newCart: Product[]) => void;
  onSubmit: (details: {
    name: string;
    email: string;
    phone: string;
    address: string;
    paymentMethod: string;
    paymentDetails?: any;
  }) => Promise<void> | void;
  storeSettings?: StoreSettings;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cart,
  token,
  initialName,
  initialEmail,
  initialPhone,
  onBack,
  onRemoveItem,
  onSyncCart,
  onSubmit,
  storeSettings
}) => {
  const cleanInitialName = (initialName && initialName !== 'Guest' && initialName.toLowerCase() !== 'guest') ? initialName : '';
  const [name, setName] = useState(cleanInitialName);
  const [email, setEmail] = useState(initialEmail || '');
  const [phone, setPhone] = useState(initialPhone || '');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay_upi' | 'cod'>('razorpay_upi');

  const threshold = storeSettings?.delivery_charge_threshold ?? 999;
  const charge = storeSettings?.delivery_charge ?? 70;
  const codFee = storeSettings?.cod_fee ?? 40;
  const codEnabled = storeSettings?.cod_enabled ?? true;

  const isCodDisabledForCart = cart.some(item => Boolean(item.disable_cod));
  const isCodAvailable = codEnabled && !isCodDisabledForCart;

  React.useEffect(() => {
    if (!isCodAvailable && paymentMethod === 'cod') {
      setPaymentMethod('razorpay_upi');
    }
  }, [isCodAvailable, paymentMethod]);

  const calculatedCart = calculateCartItems(cart);
  const groupedCart = groupCalculatedCartItems(calculatedCart);
  const subtotal = calculatedCart.reduce((sum, item) => sum + item.final_price, 0);
  const shippingCost = subtotal > threshold ? 0 : charge;
  const codFeeCost = (paymentMethod === 'cod' && isCodAvailable) ? codFee : 0;
  const grandTotal = subtotal + shippingCost + codFeeCost;

  // Automatic Pincode Lookup (Fetches City & State from India Post API)
  React.useEffect(() => {
    const cleanPincode = pinCode.trim();
    if (cleanPincode.length === 6 && /^[1-9][0-9]{5}$/.test(cleanPincode)) {
      setIsFetchingPincode(true);
      setPincodeStatus("Detecting location...");
      
      fetch(`https://api.postalpincode.in/pincode/${cleanPincode}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            const detectedCity = po.District || po.Name || "";
            const detectedState = po.State || "";

            if (detectedCity) setCity(detectedCity);
            if (detectedState) setStateVal(detectedState);
            setPincodeStatus(`✨ Auto-detected: ${detectedCity}, ${detectedState}`);
          } else {
            setPincodeStatus("⚠️ Location not found for this pincode");
          }
        })
        .catch((err) => {
          console.error("Pincode fetch error:", err);
          setPincodeStatus(null);
        })
        .finally(() => {
          setIsFetchingPincode(false);
        });
    } else {
      setPincodeStatus(null);
    }
  }, [pinCode]);



  // Auto-fill saved shipping address from previous orders
  React.useEffect(() => {
    const savedAddressStr = localStorage.getItem('mwm_saved_address');
    if (savedAddressStr) {
      try {
        const saved = JSON.parse(savedAddressStr);
        if (saved.name && !name) setName(saved.name);
        if (saved.street && !street) setStreet(saved.street);
        if (saved.apartment && !apartment) setApartment(saved.apartment);
        if (saved.city && !city) setCity(saved.city);
        if (saved.stateVal && !stateVal) setStateVal(saved.stateVal);
        if (saved.pinCode && !pinCode) setPinCode(saved.pinCode);
      } catch (e) {}
    }
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    if (phone.length < 10) {
      alert('Please enter a valid mobile number.');
      return;
    }
    if (!street.trim() || !city.trim() || !stateVal.trim() || pinCode.length !== 6) {
      alert('Please fill in all required shipping address fields.');
      return;
    }

    // Validate missing customization photo/info for custom items in cart
    const missingInfoItem = cart.find(item => Boolean(item.has_custom_options && item.allow_photo_upload && !item.custom_photo));
    if (missingInfoItem) {
      alert(`⚠️ Please provide required customization information for "${missingInfoItem.title}". Upload your photo before placing the order.`);
      return;
    }

    // Save address locally for auto-fill on next checkout
    try {
      localStorage.setItem('mwm_saved_address', JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        street: street.trim(),
        apartment: apartment.trim(),
        city: city.trim(),
        stateVal: stateVal.trim(),
        pinCode: pinCode.trim()
      }));
    } catch (e) {}

    const fullAddress = `${street}${apartment ? `, ${apartment}` : ''}, ${city}, ${stateVal} - ${pinCode}`;
    const fullPhone = phone;

    if (paymentMethod === 'cod') {
      setIsProcessingPayment(true);
      try {
        await onSubmit({
          name,
          email,
          phone: fullPhone,
          address: fullAddress,
          paymentMethod: 'Cash on Delivery'
        });
      } catch (err: any) {
        console.error('COD order creation failed:', err);
        alert(err.message || 'Failed to place Cash on Delivery order.');
        setIsProcessingPayment(false);
      }
      return;
    }

    // Razorpay Hosted Redirect Checkout
    setIsProcessingPayment(true);
    try {
      if (!token) {
        alert('Authentication session expired. Please log in again.');
        setIsProcessingPayment(false);
        return;
      }

      const origin = window.location.origin + window.location.pathname;
      const receipt = `rcpt_${Date.now()}`;

      // 1. Create order in MongoDB with status "Pending Payment" before redirecting
      try {
        await onSubmit({
          name: name.trim(),
          email: email.trim(),
          phone: fullPhone,
          address: fullAddress,
          paymentMethod: 'Razorpay UPI',
          paymentDetails: {
            order_id: receipt,
            status: 'Pending Payment',
            payment_status: 'pending'
          }
        });
      } catch (err: any) {
        console.error('Failed to save pending order to database:', err);
      }

      // Save custom photos in sessionStorage safely during payment session
      cart.forEach((item, idx) => {
        if (item.custom_photo) {
          try {
            sessionStorage.setItem(`mwm_custom_photo_${idx}`, item.custom_photo);
          } catch (e) {}
        }
      });

      // Save clean order context locally without heavy Base64 image data
      const cleanCartForStorage = cart.map((item, idx) => ({
        id: item.id || (item as any)._id,
        title: item.title,
        price: getEffectivePrice(item),
        selected_size: item.selected_size,
        disable_cod: item.disable_cod,
        custom_photo: item.custom_photo || undefined,
        storage_photo_key: item.custom_photo ? `mwm_custom_photo_${idx}` : undefined,
        thumbnail: typeof item.thumbnail === 'string' && item.thumbnail.startsWith('data:') ? item.thumbnail.slice(0, 60) + '...' : item.thumbnail
      }));

      const pendingOrder = {
        orderId: receipt,
        name: name.trim(),
        email: email.trim(),
        phone: fullPhone,
        address: fullAddress,
        cart: cleanCartForStorage,
        grandTotal
      };
      
      try {
        localStorage.setItem('mwm_pending_order', JSON.stringify(pendingOrder));
      } catch (e) {
        console.warn('LocalStorage pending order save fallback:', e);
      }

      const linkRes = await createRazorpayPaymentLink(token, {
        amount: grandTotal,
        receipt: receipt,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        callback_url: origin,
        address: fullAddress,
        items: cart.map((it) => ({
          product_id: it.id || (it as any)._id,
          title: it.title,
          price: getEffectivePrice(it),
          thumbnail: typeof it.thumbnail === 'string' && it.thumbnail.startsWith('data:') ? it.thumbnail.slice(0, 60) : it.thumbnail
        }))
      });

      if (!linkRes || !linkRes.success || !linkRes.short_url) {
        alert(linkRes?.error || 'Failed to generate Razorpay payment gateway link.');
        setIsProcessingPayment(false);
        return;
      }

      // Direct hosted gateway redirect
      window.location.href = linkRes.short_url;
    } catch (err: any) {
      console.error('Razorpay redirect error:', err);
      alert(err.message || 'Error redirecting to Razorpay payment gateway.');
      setIsProcessingPayment(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full flex flex-col lg:flex-row gap-6 text-left animate-in fade-in duration-300">
      {/* Left side: Checkout Form details */}
      <div className="flex-1 flex flex-col gap-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 self-start text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={12} />
          <span>Back to Cart</span>
        </button>

        <h2 className="text-xl font-display font-black text-black">Delivery Address</h2>

        {/* Contact info section */}
        <div className="bg-white border border-gray-150 p-4 rounded-2xl flex flex-col gap-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-black border-b border-gray-100 pb-1.5">Contact Details</h3>
          
          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase font-bold text-black">Full Name *</label>
            <div className="relative">
              <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-white border border-gray-300 text-xs font-semibold pl-8 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-black placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase font-bold text-black">Email Address *</label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white border border-gray-300 text-xs font-semibold pl-8 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-black placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase font-bold text-black">Mobile Number *</label>
            <div className="relative">
              <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                required
                maxLength={15}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                placeholder="+919999999999"
                className="w-full bg-white border border-gray-300 text-xs font-semibold pl-8 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-black placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Address details section */}
        <div className="bg-white border border-gray-150 p-4 rounded-2xl flex flex-col gap-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-black border-b border-gray-100 pb-1.5">Shipping Location</h3>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase font-bold text-black">Flat / House No. / Street Address *</label>
            <div className="relative">
              <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
              <input
                type="text"
                name="address"
                autoComplete="address-line1"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. 102, Bluebell Residency, Ring Road"
                className="w-full bg-white border border-gray-300 text-xs font-semibold pl-8 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-black placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] uppercase font-bold text-black">Apartment / Suite / Unit (Optional)</label>
            <div className="relative">
              <Building size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
              <input
                type="text"
                name="apartment"
                autoComplete="address-line2"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder="e.g. Phase 2, near City Park"
                className="w-full bg-white border border-gray-300 text-xs font-semibold pl-8 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-black placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-black">City *</label>
              <div className="relative">
                <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
                <input
                  type="text"
                  name="city"
                  autoComplete="address-level2"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full bg-white border border-gray-300 text-xs font-semibold pl-8 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-black placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-black">State *</label>
              <div className="relative">
                <Compass size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
                <input
                  type="text"
                  name="state"
                  autoComplete="address-level1"
                  required
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full bg-white border border-gray-300 text-xs font-semibold pl-8 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-black placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-[9px] uppercase font-bold text-black">Pin Code (6 digits) *</label>
              {isFetchingPincode && (
                <span className="text-[8px] font-bold text-gray-500 animate-pulse">Detecting location...</span>
              )}
            </div>
            <div className="relative">
              <Compass size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
              <input
                type="text"
                name="postal-code"
                autoComplete="postal-code"
                required
                maxLength={6}
                pattern="[0-9]{6}"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 400001"
                className="w-full bg-white border border-gray-300 text-xs font-semibold pl-8 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-black placeholder-gray-400"
              />
            </div>
            {pincodeStatus && (
              <span className={`text-[9.5px] font-bold mt-0.5 block ${pincodeStatus.includes('✨') ? 'text-green-700' : 'text-amber-600'}`}>
                {pincodeStatus}
              </span>
            )}
          </div>
        </div>

        {/* UPI Payment selection */}
        <div className="bg-white border border-gray-150 p-4 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-black border-b border-gray-100 pb-1.5 flex-grow">Payment Option</h3>
            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
              <ShieldCheck size={11} />
              <span>RAZORPAY TEST MODE</span>
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Razorpay UPI */}
            <label 
              onClick={() => setPaymentMethod('razorpay_upi')}
              className={`flex items-start gap-3 p-3.5 border rounded-2xl cursor-pointer transition-all ${
                paymentMethod === 'razorpay_upi'
                  ? 'border-black bg-gray-50 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="razorpay_upi"
                checked={paymentMethod === 'razorpay_upi'}
                onChange={() => setPaymentMethod('razorpay_upi')}
                className="accent-black mt-0.5"
              />
              <div className="flex flex-col text-left flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-black">UPI Payment (GPay, PhonePe, Paytm, QR Code)</span>
                  <QrCode size={14} className="text-black" />
                </div>
                <span className="text-[9px] font-semibold text-gray-800 mt-0.5">
                  Instant settlement via Razorpay UPI Gateway Test Mode. Supports GPay, PhonePe, BHIM & UPI Intent.
                </span>
              </div>
            </label>

            {/* Cash on Delivery option (Grayed out if disabled for cart item or store setting) */}
            {isCodDisabledForCart ? (
              <div className="flex items-start gap-3 p-3.5 border border-red-200 bg-red-50/70 rounded-2xl opacity-80 cursor-not-allowed select-none">
                <input type="radio" disabled checked={false} className="mt-0.5 cursor-not-allowed" />
                <div className="flex flex-col text-left flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 line-through">Cash on Delivery (COD)</span>
                    <span className="text-[8.5px] font-black text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
                      COD UNAVAILABLE
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-red-700 mt-0.5">
                    Customized / Lithophane items require upfront online payment. Please pay via UPI.
                  </span>
                </div>
              </div>
            ) : isCodAvailable ? (
              <label 
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-start gap-3 p-3.5 border rounded-2xl cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-black bg-gray-50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-black mt-0.5"
                />
                <div className="flex flex-col text-left flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black">Cash on Delivery (COD)</span>
                    <span className="text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      + ₹{codFee} COD Fee
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold text-gray-800 mt-0.5">
                    Pay cash upon delivery (+ ₹{codFee} COD handling fee).
                  </span>
                </div>
              </label>
            ) : null}
          </div>
        </div>
      </div>

      {/* Right side: Summary Card */}
      <div className="w-full lg:w-80 flex flex-col gap-4 self-start">
        <div className="bg-white border border-gray-150 p-4 rounded-3xl flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-black border-b border-gray-100 pb-2.5 flex items-center gap-1.5">
            <ShoppingBag size={14} className="text-black" />
            <span>Order Summary</span>
          </h3>

          {/* Cart Items list */}
          <div className="flex flex-col gap-3.5 max-h-56 overflow-y-auto pr-1">
            {groupedCart.map((group) => (
              <div key={group.group_id} className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 shrink-0">
                  <img src={getImageUrl(group.custom_photo || group.thumbnail)} alt={group.title} className="w-9 h-9 object-cover bg-gray-50 p-0.5 rounded-lg border border-gray-200" />
                  {group.custom_photo && (
                    <span className="absolute -top-1 -right-1 text-[8px] bg-blue-600 text-white rounded-full px-1 font-bold">📸</span>
                  )}
                </div>
                <div className="flex-grow min-w-0 text-left">
                  <h4 className="text-[10px] font-extrabold text-black truncate leading-normal">{group.title}</h4>
                  {group.selected_size && (
                    <span className="text-[8.5px] font-bold text-blue-700 block">📐 {group.selected_size}</span>
                  )}
                  <div className="flex items-center gap-1 mt-0.5">
                    {group.is_free ? (
                      <>
                        <span className="text-[8.5px] text-gray-400 line-through">₹{group.original_unit_price.toLocaleString('en-IN')}</span>
                        <span className="text-[8px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">FREE</span>
                      </>
                    ) : (
                      <span className="text-[9px] text-black font-black">₹{group.total_final_price.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls (- QTY +) */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (group.cart_indices.length > 0) {
                        onRemoveItem(group.cart_indices[group.cart_indices.length - 1]);
                      }
                    }}
                    className="px-1.5 py-0.5 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors font-bold text-[10px] cursor-pointer"
                    title="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-1.5 py-0.5 text-[9px] font-black text-gray-900 select-none min-w-[14px] text-center">
                    {group.quantity}
                  </span>
                  {onSyncCart && (
                    <button
                      type="button"
                      onClick={() => {
                        const itemToAdd: Product = { ...group.sample_item };
                        delete (itemToAdd as any).cart_index;
                        delete (itemToAdd as any).original_unit_price;
                        delete (itemToAdd as any).final_price;
                        delete (itemToAdd as any).is_free;
                        delete (itemToAdd as any).offer_applied;
                        onSyncCart([...cart, itemToAdd]);
                      }}
                      className="px-1.5 py-0.5 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors font-bold text-[10px] cursor-pointer"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    group.cart_indices.forEach((idx) => onRemoveItem(idx));
                  }}
                  className="p-1 text-gray-600 hover:text-red-650 transition-colors shrink-0 cursor-pointer"
                  title="Remove group"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Price Calculations */}
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] font-black text-black">
              <span>Cart Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black text-black">
              <span>Delivery Charges</span>
              <span className="font-extrabold">{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
            </div>
            {paymentMethod === 'cod' && codFeeCost > 0 && (
              <div className="flex justify-between items-center text-[10px] font-black text-amber-700 bg-amber-50/90 px-2 py-1 rounded-lg border border-amber-200/80">
                <span>COD Convenience Fee</span>
                <span>+ ₹{codFeeCost}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-xs font-black text-black border-t border-gray-100 pt-2.5">
              <span>Grand Total</span>
              <span className="font-black text-black">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessingPayment}
            className="w-full py-3 bg-[#041E42] text-white rounded-xl text-xs font-bold hover:bg-[#082a56] disabled:bg-gray-400 transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-2"
          >
            <CreditCard size={14} />
            <span>
              {isProcessingPayment 
                ? 'Connecting Razorpay...' 
                : paymentMethod === 'razorpay_upi'
                  ? `Pay ₹${grandTotal.toLocaleString('en-IN')} via Razorpay UPI`
                  : `Place COD Order (₹${grandTotal.toLocaleString('en-IN')})`}
            </span>
          </button>
        </div>
      </div>
      {isProcessingPayment && <BrandBuffer fullScreen message="Connecting Razorpay Payment Gateway..." />}
    </form>
  );
};
