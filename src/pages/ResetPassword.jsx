import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { confirmResetPassword } = useAuth();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!oobCode) setError('Invalid or missing reset code. Please request a new password reset link.');
  }, [oobCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters long'); return; }
    if (!oobCode) { setError('Invalid reset code'); return; }
    setLoading(true);
    try {
      await confirmResetPassword(oobCode, newPassword);
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(error.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-black">Lenzli</h1>
            <p className="text-gray-500 text-sm mt-1">Set a new password</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
          <h2 className="text-2xl font-bold mb-6 text-black">Reset Password</h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">{error}</div>
          )}
          {message && (
            <div className="mb-4 p-3 rounded-xl border border-green-200 bg-green-50 text-green-600 text-sm">{message}</div>
          )}

          {oobCode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">New Password</label>
                <input
                  type="password" required value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-gray-900"
                  placeholder="••••••••" minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">Confirm Password</label>
                <input
                  type="password" required value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-gray-900"
                  placeholder="••••••••" minLength={6}
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold hover:bg-gray-800 transition-all shadow-subtle disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-4">Invalid reset link. Please request a new password reset.</p>
              <Link
                to="/forgot-password"
                className="inline-block rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold hover:bg-gray-800 transition-all shadow-subtle"
              >
                Request New Reset Link
              </Link>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-black font-semibold hover:underline">Log in</Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-black transition font-medium">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
