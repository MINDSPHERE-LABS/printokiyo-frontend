import React from 'react';
import { CheckCircle2, Truck, MapPin, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../utils/image';

interface OrderSuccessModalProps {
  order: any;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-center animate-in zoom-in-95 slide-in-from-bottom-6 duration-300 z-10 border border-gray-100">
        
        {/* Animated Green Checkmark Icon */}
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600 border border-green-200 shadow-sm animate-bounce">
          <CheckCircle2 size={36} strokeWidth={2.5} />
        </div>

        {/* Title */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            ORDER CONFIRMED
          </span>
          <h2 className="text-xl font-display font-black text-gray-955 mt-2">
            Thank You For Your Order!
          </h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Order ID: <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">#{order.order_id || order.id || 'MWM-ORDER'}</span>
          </p>
        </div>

        {/* Order Details Breakdown Box */}
        <div className="bg-gray-50/90 rounded-2xl p-4 border border-gray-200/80 text-left flex flex-col gap-3">
          
          {/* Customer Details */}
          <div className="flex flex-col gap-1 text-[11px] font-semibold text-gray-700 border-b border-gray-200 pb-2.5">
            <div className="flex items-center gap-1.5 font-bold text-gray-900">
              <Truck size={13} className="text-blue-600 shrink-0" />
              <span>Deliver To: {order.name}</span>
            </div>
            <div className="flex items-start gap-1.5 text-gray-600 text-[10px] pl-4">
              <MapPin size={11} className="shrink-0 mt-0.5" />
              <span className="leading-tight">{order.address}</span>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
            {order.items && order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-gray-200">
                <img 
                  src={getImageUrl(item.custom_photo || item.thumbnail)} 
                  alt={item.title} 
                  className="w-8 h-8 object-cover rounded-lg bg-gray-50 border border-gray-150" 
                />
                <div className="flex-grow min-w-0">
                  <h4 className="text-[10px] font-black text-gray-900 truncate">{item.title}</h4>
                  {item.selected_size && (
                    <span className="text-[8.5px] font-bold text-blue-700 block">📐 {item.selected_size}</span>
                  )}
                  {item.custom_photo && (
                    <span className="text-[8.5px] font-bold text-green-700 block">📸 Custom Photo Attached</span>
                  )}
                </div>
                <span className="text-xs font-black text-gray-900">₹{(item.price || 0).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* Grand Total & Payment Method */}
          <div className="flex justify-between items-center border-t border-gray-200 pt-2 text-xs font-black">
            <span className="text-gray-600">Total Paid ({order.payment_method || 'Order'}):</span>
            <span className="text-gray-955 text-sm">₹{(order.grand_total || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-[#041E42] hover:bg-[#082a56] text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue Shopping</span>
          <ArrowRight size={14} />
        </button>

      </div>
    </div>
  );
};
