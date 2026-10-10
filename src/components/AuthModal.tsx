import React, { useState, useEffect } from 'react';
import { X, Phone, Key, AlertCircle, ArrowLeft, Clock, RotateCw } from 'lucide-react';
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
  const [waNotice, setWaNotice] = useState<string | null>(null);

  // 2-Minute Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(120);
  const [isTimerExpired, setIsTimerExpired] = useState<boolean>(false);

  // 2-Minute OTP Countdown Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (step === 'otp') {
      setTimerSeconds(120);
      setIsTimerExpired(false);

      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
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
  }, [step]);

  const formatTimer = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleResendOTP = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);
    setWaNotice(null);
    setOtpCode('');
    try {
      await sendOTP(`+91${phone}`);
      setTimerSeconds(120);
      setIsTimerExpired(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend WhatsApp OTP.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Step 1: Request OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setWaNotice(null);
    try {
      await sendOTP(`+91${phone}`);
      setStep('otp');
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
      setErrorMsg('Verification code has expired. Please click Resend to get a new code.');
      return;
    }
    if (!otpCode.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await verifyOTP(`+91${phone}`, otpCode.trim());
      onSuccess(response.token, response.user);
      // Reset state for future logins
      setStep('input');
      setPhone('');
      setOtpCode('');
      setWaNotice(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div 
        onClick={() => {
          onClose();
          setStep('input'); // Reset to input step on close
        }}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      />

      {/* Auth Modal Box */}
      <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div className="text-left">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-955">
              {step === 'input' ? 'LOGIN' : 'Enter Verification Code'}
            </h3>
          </div>
          <button 
            onClick={() => {
              onClose();
              setStep('input');
            }}
            className="p-1.5 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
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
              setWaNotice(null);
              setOtpCode('');
            }}
            className="inline-flex items-center gap-1.5 self-start text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-955 select-none transition-colors"
          >
            <ArrowLeft size={12} />
            <span>Edit Phone Number</span>
          </button>
        )}

        {/* Informative message box */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex flex-col gap-1 text-left">
          <p className="text-[10px] text-emerald-900 leading-normal font-semibold">
            {step === 'input' 
              ? 'Enter your 10-digit mobile number to receive your WhatsApp verification code.' 
              : `💬 A 6-digit verification code was sent to your WhatsApp on +91 ${phone}.`}
          </p>
          {waNotice && (
            <p className="text-[9px] text-amber-800 bg-amber-100/80 p-2 rounded-lg font-bold leading-normal mt-1 border border-amber-200">
              {waNotice}
            </p>
          )}
        </div>

        {/* Error Callout */}
        {errorMsg && (
          <div className="bg-red-50 text-red-750 px-3.5 py-2.5 rounded-xl text-[10px] font-semibold flex items-start gap-2 animate-in fade-in">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab-less step form */}
        {step === 'input' ? (
          /* Step 1: Input details form */
          <form onSubmit={handleSendOTP} className="flex flex-col gap-3.5 text-left">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-gray-400">Mobile Number</label>
              <div className="relative flex items-center">
                <Phone size={13} className="absolute left-3 text-gray-400" />
                <span className="absolute left-8 text-xs font-bold text-gray-700 select-none">+91</span>
                <input 
                  type="tel" 
                  required 
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(e) => {
                    const cleanVal = e.target.value.replace(/[^0-9]/g, '');
                    setPhone(cleanVal);
                  }}
                  placeholder="9999999999"
                  className="w-full bg-white border border-gray-200 text-xs font-semibold pl-16 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-955"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#041E42] hover:bg-[#082a56] disabled:bg-gray-400 text-white rounded-xl text-xs font-bold mt-2 transition-all flex items-center justify-center"
            >
              {loading ? 'Sending OTP...' : 'Send Verification OTP'}
            </button>
          </form>
        ) : (
          /* Step 2: Verification code form */
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-3.5 text-left">
            {/* Highlighted 6-Digit OTP Input Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-black tracking-wider text-blue-900 flex items-center justify-between">
                <span>Enter 6-Digit OTP Code</span>
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">REQUIRED</span>
              </label>
              <div className="relative">
                <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600" />
                <input 
                  type="text" 
                  required 
                  maxLength={6}
                  disabled={isTimerExpired}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder={isTimerExpired ? "OTP Expired" : "1 2 3 4 5 6"}
                  className={`w-full text-base font-black tracking-[0.35em] text-center pl-9 pr-3 py-3 rounded-2xl transition-all shadow-sm focus:outline-none ${
                    isTimerExpired 
                      ? 'bg-gray-100 border-2 border-red-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-50/30 border-2 border-blue-600 text-blue-950 shadow-blue-100 focus:border-blue-700 focus:ring-4 focus:ring-blue-500/20'
                  }`}
                />
              </div>
            </div>

            {/* 2-Minute Timer & Resend Controls BELOW OTP Input */}
            {!isTimerExpired ? (
              <div className="flex items-center justify-between text-[9px] font-semibold text-gray-500 bg-gray-50/90 px-3 py-2 rounded-xl border border-gray-200/80">
                <span className="flex items-center gap-1 text-gray-600">
                  <Clock size={12} className="text-blue-600 animate-pulse" />
                  <span>OTP code expires in:</span>
                </span>
                <span className="font-mono text-[9.5px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                  {formatTimer(timerSeconds)}
                </span>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[9px] font-semibold flex items-center justify-between animate-in fade-in">
                <span className="flex items-center gap-1 text-amber-900">
                  <AlertCircle size={13} className="text-amber-600 shrink-0" />
                  <span>OTP expired (2 min limit)</span>
                </span>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-[9px] font-bold text-white bg-[#041E42] hover:bg-[#082a56] disabled:bg-gray-400 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <RotateCw size={10} className={loading ? 'animate-spin' : ''} />
                  <span>Resend OTP</span>
                </button>
              </div>
            )}

            {/* Submit Button with LOGIN text */}
            <button 
              type="submit"
              disabled={loading || isTimerExpired}
              className="w-full py-3.5 bg-[#041E42] hover:bg-[#082a56] disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl text-xs font-black tracking-wider uppercase mt-1 transition-all flex items-center justify-center cursor-pointer shadow-md"
            >
              {loading ? 'LOGGING IN...' : isTimerExpired ? 'OTP EXPIRED' : 'LOGIN'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
