import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, User } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [currentScreen, setCurrentScreen] = useState('phone'); // 'phone', 'otp', 'signup'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // OTP countdown timer
  useEffect(() => {
    let timer;
    if (currentScreen === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentScreen, countdown]);

  // Reset modal state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentScreen('phone');
      setPhoneNumber('');
      setOtp(['', '', '', '']);
      setCountdown(30);
      setCanResend(false);
      setUserDetails({ name: '', email: '', phone: '' });
    }
  }, [isOpen]);

  // Handle phone number submission
  const handleSendOTP = () => {
    if (phoneNumber.length >= 10) {
      // Simulate API call to send OTP
      console.log('Sending OTP to:', phoneNumber);
      setCurrentScreen('otp');
      setCountdown(30);
      setCanResend(false);
    }
  };

  // Add keyboard support for OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-submit when all 4 digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 4) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = (otpValue = otp.join('')) => {
    console.log('Verifying OTP:', otpValue);

    // Simulate API call to verify OTP
    // If user exists, login success
    // If new user, go to signup screen

    // For demo: if OTP is 1234, simulate existing user, else new user
    if (otpValue === '1234') {
      // Existing user - login success
      onLoginSuccess({ phone: phoneNumber, name: 'John Doe' });
      onClose();
    } else {
      // New user - go to signup screen
      setUserDetails(prev => ({ ...prev, phone: phoneNumber }));
      setCurrentScreen('signup');
    }
  };

  // Handle signup completion
  const handleSignupComplete = () => {
    if (userDetails.name && userDetails.email) {
      console.log('Creating new account:', userDetails);

      // Simulate API call to create account
      onLoginSuccess(userDetails);
      onClose();
    }
  };

  // Handle resend OTP
  const handleResendOTP = (method = 'sms') => {
    console.log(`Resending OTP via ${method} to:`, phoneNumber);
    setCountdown(30);
    setCanResend(false);
    setOtp(['', '', '', '']);
    // Focus first OTP input
    setTimeout(() => {
      const firstInput = document.getElementById('otp-0');
      if (firstInput) firstInput.focus();
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        <div className='bg-white flex p-5'>
          <div className="hidden md:block md:w-1/2 relative">
            <img
              src="https://cdn.shopify.com/s/files/1/0420/7073/7058/files/login.jpg?v=1737548884&quality=80"
              alt="Fashion models"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0"></div>
          </div>

          {/* Right side - Auth Form */}
          <div className="w-full md:w-1/2 p-8 relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Phone Number Screen */}
            {currentScreen === 'phone' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl text-center font-bold mb-2">LOGIN OR SIGNUP</h2>
                  <p className="text-gray-600 text-center">Unlock coupons, profile and much more</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">+91   |</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter mobile number"
                      className="w-full pl-20 pr-4 py-4 border border-gray-300 focus:border-black focus:outline-none text-lg"
                      maxLength={10}
                    />
                  </div>

                  <button
                    onClick={handleSendOTP}
                    disabled={phoneNumber.length < 10}
                    className="w-full bg-black cursor-pointer text-white py-4 font-medium text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    SEND OTP
                  </button>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </div>
              </div>
            )}

            {/* OTP Verification Screen */}
            {currentScreen === 'otp' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl text-center font-bold mb-2">LOGIN OR SIGNUP</h2>
                  <p className="text-gray-600">
                    Enter 4-digit OTP sent to +91 {phoneNumber}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* OTP Input Boxes */}
                  <div className="flex justify-center space-x-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-14 h-14 text-center text-2xl font-medium border-2 border-gray-300 focus:border-black focus:outline-none"
                        maxLength={1}
                        inputMode="numeric"
                      />
                    ))}
                  </div>

                  {/* Resend Timer / Options */}
                  <div className="text-center">
                    {!canResend ? (
                      <p className="text-gray-600">
                        RESEND IN <span className="font-bold">00:{countdown.toString().padStart(2, '0')}</span>
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-gray-600 mb-3">Didn't receive OTP?</p>
                        <div className="flex justify-around m-5 gap-2">
                          <button
                            onClick={() => handleResendOTP('sms')}
                            className="bg-black text-white p-3 border border-black hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"

                          >
                            Get via SMS
                          </button>
                          <button
                            onClick={() => handleResendOTP('call')}
                            className="bg-black text-white p-3 border border-black hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
                          >
                            Get via Call
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Manual Verify Button */}
                  <button
                    onClick={() => handleVerifyOTP()}
                    disabled={otp.some(digit => digit === '')}
                    className="w-full bg-black text-white py-4 font-semibold text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    VERIFY OTP
                  </button>
                </div>
              </div>
            )}

            {/* Signup Details Screen */}
            {currentScreen === 'signup' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">COMPLETE YOUR PROFILE</h2>
                  <p className="text-gray-600">We need a few more details to create your account</p>
                </div>

                <div className="space-y-4">
                  {/* Name Input */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={userDetails.name}
                      onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 focus:border-black focus:outline-none text-lg"
                    />
                  </div>

                  {/* Phone Input (readonly) */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={`+91 ${phoneNumber}`}
                      readOnly
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 focus:border-black focus:outline-none text-lg"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={userDetails.email}
                      onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 focus:border-black focus:outline-none text-lg"
                    />
                  </div>

                  <button
                    onClick={handleSignupComplete}
                    disabled={!userDetails.name || !userDetails.email}
                    className="w-full bg-black cursor-pointer text-white py-4 font-semibold text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    CREATE ACCOUNT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Left side - Product Image */}

      </div>
    </div >
  );
};

export default AuthModal;