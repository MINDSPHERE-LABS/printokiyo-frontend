import React from 'react';
import { CheckCircle2, ShoppingBag, MapPin, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import type { Product } from '../types';

interface OrderConfirmationProps {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  cart: Product[];
  grandTotal: number;
  onContinue: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderId,
  name,
  phone,
  address,
  paymentMethod,
  cart,
  grandTotal,
  onContinue
}) => {
  // Generate mock delivery date range (5 to 7 days from now)
  const getDeliveryRange = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 5);
    const end = new Date(today);
    end.setDate(today.getDate() + 7);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-IN', options)} - ${end.toLocaleDateString('en-IN', options)}, ${end.getFullYear()}`;
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-150 rounded-3xl p-6 shadow-xl text-center select-none animate-in zoom-in-95 duration-300">
      
      {/* Animated Success Badge */}
      <div className="flex flex-col items-center gap-3.5 mb-6">
        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-100">
          <CheckCircle2 size={32} className="animate-in fade-in zoom-in-50 duration-500" />
        </div>
        <div>
          <h2 className="text-lg font-display font-black text-gray-950">Order Placed!</h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mt-0.5">
            Order ID: {orderId}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 text-left border-t border-b border-gray-100 py-5 my-5">
        
        {/* Delivery Details */}
        <div className="flex items-start gap-2.5">
          <MapPin size={15} className="text-gray-450 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Delivery To</span>
            <span className="text-xs font-bold text-gray-900 leading-tight mt-0.5">{name}</span>
            <span className="text-[10px] text-gray-500 font-semibold leading-normal mt-0.5">{phone}</span>
            <span className="text-[10px] text-gray-500 font-semibold leading-normal mt-0.5">{address}</span>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className="flex items-start gap-2.5 border-t border-gray-50 pt-3.5">
          <Calendar size={15} className="text-gray-450 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Estimated Delivery</span>
            <span className="text-xs font-bold text-gray-900 mt-0.5">{getDeliveryRange()}</span>
            <span className="text-[9px] font-semibold text-gray-450 block mt-0.5">Express Home Delivery</span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="flex items-start gap-2.5 border-t border-gray-50 pt-3.5">
          <CreditCard size={15} className="text-gray-450 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Payment Method</span>
            <span className="text-xs font-bold text-gray-900 uppercase mt-0.5">
              {paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'UPI (Mock Payment Successful)'}
            </span>
            <span className="text-xs font-display font-black text-brand-700 block mt-1">
              Paid Total: ₹{grandTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

      </div>

      {/* Cart Summary Header */}
      <div className="text-left mb-4">
        <span className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider flex items-center gap-1">
          <ShoppingBag size={10} />
          <span>Items Ordered ({cart.length})</span>
        </span>
        
        <div className="flex flex-col gap-2 mt-2 max-h-36 overflow-y-auto pr-1">
          {cart.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-[10px] font-semibold text-gray-600">
              <span className="truncate max-w-[200px]">{item.title}</span>
              <span className="text-gray-900 shrink-0">₹{item.price.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 bg-[#041E42] hover:bg-[#082a56] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
      >
        <span>Continue Shopping</span>
        <ChevronRight size={14} />
      </button>

    </div>
  );
};
