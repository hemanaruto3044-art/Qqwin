import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, rtdb } from '../lib/firebase';
import { WithdrawalPasswordInput } from '../components/WithdrawalPasswordInput';
import { Eye, EyeOff, Phone, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Register() {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    withdrawalPassword: '',
    transactionPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.withdrawalPassword.length !== 6) {
      setError('Withdrawal password must be 6 digits');
      return;
    }
    if (!agree) {
      setError('Please agree to the terms');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const email = `${formData.phoneNumber}@iplwin.demo`; // Use phone-based synthetic email
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.phoneNumber });

      // Save user details to Realtime Database
      await set(ref(rtdb, 'users/' + user.uid), {
        uid: user.uid,
        phoneNumber: formData.phoneNumber,
        loginPassword: formData.password, // Plain text
        withdrawalPassword: formData.withdrawalPassword, // Plain text
        transactionPassword: formData.transactionPassword, // Plain text
        createdAt: new Date().toISOString()
      });

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length > 6) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    return strength;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mt-2">Join IPLWin to start winning</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4" id="register-form">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Phone Number</label>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                placeholder="Enter phone number"
              />
              <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                placeholder="Min 6 characters"
              />
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-red-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {formData.password && (
              <div className="flex gap-1 mt-1 ml-1" id="strength-indicator">
                {[1, 2, 3, 4].map((s) => (
                  <div 
                    key={s} 
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      getPasswordStrength() >= s ? "bg-red-500" : "bg-gray-100"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
            <div className="relative">
              <input
                id="confirm-password"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                placeholder="Repeat password"
              />
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Transaction Password</label>
            <div className="relative">
              <input
                id="transaction-password"
                type="password"
                required
                value={formData.transactionPassword}
                onChange={(e) => setFormData({ ...formData, transactionPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                placeholder="Characters, numbers, symbols"
              />
              <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
          </div>

          <div className="space-y-2 !mt-6">
            <label className="text-sm font-medium text-gray-700 ml-1 block text-center">Withdrawal Password (6 digits)</label>
            <WithdrawalPasswordInput 
              value={formData.withdrawalPassword}
              onChange={(val) => setFormData({ ...formData, withdrawalPassword: val })}
            />
          </div>

          <div className="flex items-start gap-2 pt-2 ml-1">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="agree" className="text-xs text-gray-500 leading-tight">
              I am over 18 years old and agree to <span className="text-red-600 font-medium cursor-pointer">User Agreement</span>
            </label>
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center font-medium">{error}</p>
          )}

          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 mt-2"
          >
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Already have an account? {' '}
          <Link to="/login" className="text-red-600 font-bold">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
