import React, { useState, useEffect } from 'react';
import { X, Phone, Key, AlertCircle, ArrowLeft, Clock, RotateCw, CheckCircle2, MessageCircle } from 'lucide-react';
import { sendOTP, verifyOTP } from '../api/auth';
import type { UserProfile } from '../api/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'input' | 'otp'>('input');
  
  // Input fields
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [waNotice, setWaNotice] = useState<string | null>(null);

  // 2-Minute Timer state (120 seconds)
  const [timerSeconds, setTimerSeconds] = useState<number>(120);
  const [isTimerExpired, setIsTimerExpired] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(0);

  // 2-Minute OTP Countdown Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isOpen && step === 'otp') {
      setTimerSeconds(120);
      setIsTimerExpired(false);

      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            setIsTimerExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimerSeconds(120);
      setIsTimerExpired(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, step, timerKey]);

  const formatTimer = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    onClose();
    setStep('input');
    setErrorMsg(null);
    setSuccessMsg(null);
    setWaNotice(null);
    setOtpCode('');
  };

  const handleResendOTP = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpCode('');
    try {
      await sendOTP(`+91${phone}`);
      setTimerKey((k) => k + 1);
      setSuccessMsg('New 6-digit OTP code sent to your WhatsApp!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend WhatsApp OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Request OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setWaNotice(null);
    try {
      await sendOTP(`+91${phone}`);
      setStep('otp');
      setTimerKey((k) => k + 1);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send WhatsApp verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate OTP & Authenticate
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isTimerExpired) {
      setErrorMsg('Verification code has expired. Please click "Resend OTP" to get a new code.');
      return;
    }
    if (!otpCode.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await verifyOTP(`+91${phone}`, otpCode.trim());
      onSuccess(response.token, response.user);
      handleClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div 
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      />

      {/* Auth Modal Box */}
      <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="text-left">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
              {step === 'input' ? 'LOGIN WITH WHATSAPP' : 'VERIFY OTP CODE'}
            </h3>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Back navigation button during OTP entry */}
        {step === 'otp' && (
          <button 
            onClick={() => {
              setStep('input');
              setErrorMsg(null);
              setSuccessMsg(null);
              setWaNotice(null);
              setOtpCode('');
            }}
            className="inline-flex items-center gap-1.5 self-start text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 select-none transition-colors -mt-1"
          >
            <ArrowLeft size={12} />
            <span>Change Phone Number</span>
          </button>
        )}

        {/* Step 1: Input details form */}
        {step === 'input' ? (
          <div className="flex flex-col gap-4">
            {/* Informative message box */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 flex flex-col gap-1 text-left">
              <p className="text-[11px] text-emerald-900 leading-normal font-semibold flex items-center gap-1.5">
                <MessageCircle size={15} className="text-emerald-600 shrink-0" />
                <span>Enter your 10-digit mobile number to receive your instant WhatsApp login code.</span>
              </p>
              {waNotice && (
                <p className="text-[9px] text-amber-800 bg-amber-100/80 p-2 rounded-lg font-bold leading-normal mt-1 border border-amber-200">
                  {waNotice}
                </p>
              )}
            </div>

            {/* Error Callout */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-[10px] font-semibold flex items-start gap-2 animate-in fade-in">
                <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSendOTP} className="flex flex-col gap-3.5 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-gray-400">Mobile Number</label>
                <div className="relative flex items-center">
                  <Phone size={13} className="absolute left-3 text-gray-400" />
                  <span className="absolute left-8 text-xs font-bold text-gray-700 select-none">+91</span>
                  <input 
                    type="tel" 
                    required 
                    autoFocus
                    maxLength={10}
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => {
                      const cleanVal = e.target.value.replace(/[^0-9]/g, '');
                      setPhone(cleanVal);
                    }}
                    placeholder="9876543210"
                    className="w-full bg-white border border-gray-200 text-xs font-semibold pl-16 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#041E42]/20 focus:border-[#041E42]"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full py-3 bg-[#041E42] hover:bg-[#082a56] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold mt-1 transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-[0.99]"
              >
                {loading ? 'Sending OTP on WhatsApp...' : 'Send WhatsApp OTP'}
              </button>
            </form>
          </div>
        ) : (
          /* Step 2: Verification code form with 2-Minute Receiving Timer */
          <div className="flex flex-col gap-3.5 text-left">
            {/* WhatsApp Receiving Status & 2-Minute Countdown Card */}
            <div className="bg-gradient-to-br from-emerald-55 via-emerald-50/70 to-teal-50 border border-emerald-200/90 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <MessageCircle size={17} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950">
                      WhatsApp Verification
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">
                      +91 {phone}
                    </span>
                  </div>
                </div>

                {/* Live 2-Minute Timer Countdown Pill */}
                {!isTimerExpired ? (
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-emerald-300 shadow-xs">
                    <Clock size={12} className="text-emerald-600 animate-pulse" />
                    <span className="font-mono text-[11px] font-black text-emerald-900 tracking-wider">
                      {formatTimer(timerSeconds)}
                    </span>
                  </div>
                ) : (
                  <span className="text-[9.5px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                    Expired
                  </span>
                )}
              </div>

              {/* Countdown progress bar & receiving status description */}
              {!isTimerExpired ? (
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <div className="flex items-center justify-between text-[10px] text-emerald-900 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                      </span>
                      <span>Receiving OTP on WhatsApp in: <strong>{formatTimer(timerSeconds)}</strong></span>
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                      2 min window
                    </span>
                  </div>

                  {/* Visual 2-minute countdown bar */}
                  <div className="w-full bg-emerald-200/80 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(timerSeconds / 120) * 100}%` }}
                    />
                  </div>

                  <p className="text-[9.5px] text-emerald-800/90 leading-normal">
                    Please check your WhatsApp app. Delivery usually arrives within 5–30 seconds.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-1.5 pt-0.5 text-[10px] text-red-700 font-semibold">
                  <AlertCircle size={13} className="shrink-0 text-red-500 mt-0.5" />
                  <span>2 minutes passed. Your OTP code has expired. Please click "Resend OTP Now" below.</span>
                </div>
              )}
            </div>

            {/* Resend Success Message */}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2 rounded-xl text-[10px] font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Error Callout */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-[10px] font-semibold flex items-start gap-2 animate-in fade-in">
                <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="flex flex-col gap-3.5 text-left">
              {/* Highlighted 6-Digit OTP Input Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black tracking-wider text-gray-700 flex items-center justify-between">
                  <span>Enter 6-Digit OTP Code</span>
                  <span className="text-[9px] font-bold text-[#041E42] bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    6 DIGITS
                  </span>
                </label>
                <div className="relative">
                  <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    inputMode="numeric"
                    autoFocus
                    required 
                    maxLength={6}
                    disabled={isTimerExpired || loading}
                    value={otpCode}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                      setOtpCode(clean);
                    }}
                    placeholder={isTimerExpired ? "OTP EXPIRED" : "• • • • • •"}
                    className={`w-full text-base font-black tracking-[0.45em] text-center pl-10 pr-3 py-3 rounded-2xl transition-all shadow-sm focus:outline-none ${
                      isTimerExpired 
                        ? 'bg-gray-100 border-2 border-red-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border-2 border-[#041E42] text-gray-900 shadow-slate-100 focus:border-blue-700 focus:ring-4 focus:ring-blue-500/15'
                    }`}
                  />
                </div>
              </div>

              {/* Resend OTP Section with 2-Minute Throttling */}
              <div className="flex items-center justify-between px-1 text-[10px]">
                <span className="text-gray-500 font-medium">
                  Didn't receive code?
                </span>
                {!isTimerExpired ? (
                  <span className="font-semibold text-gray-400 flex items-center gap-1 select-none">
                    <Clock size={11} className="text-gray-400" />
                    <span>Resend OTP in <strong className="font-mono text-gray-700">{formatTimer(timerSeconds)}</strong></span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="font-bold text-[#041E42] hover:text-blue-700 flex items-center gap-1.5 underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    <RotateCw size={11} className={loading ? 'animate-spin' : ''} />
                    <span>Resend OTP Now</span>
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading || isTimerExpired || otpCode.length !== 6}
                className="w-full py-3.5 bg-[#041E42] hover:bg-[#082a56] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-[0.99]"
              >
                {loading ? 'LOGGING IN...' : isTimerExpired ? 'OTP EXPIRED' : 'VERIFY & LOGIN'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
