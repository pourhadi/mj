'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [isResending, setIsResending] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  // Get the email from the URL if it exists
  const email = searchParams.get('email');

  useEffect(() => {
    const checkInterval = setInterval(checkEmailVerification, 2000); // Check every 2 seconds
    return () => clearInterval(checkInterval);
  }, []);

  useEffect(() => {
    if (pollCount > 150) { // Stop polling after 5 minutes (150 * 2 seconds)
      clearInterval(checkInterval);
      setVerificationStatus('error');
      setError('Verification timeout. Please try again.');
    }
  }, [pollCount]);

  async function checkEmailVerification() {
    if (!email) return;

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (user?.email_confirmed_at) {
        setVerificationStatus('success');
        // Wait a moment before redirecting to allow the user to see the success message
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setPollCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Verification check error:', error);
      setVerificationStatus('error');
    }
  }

  async function handleResendVerification() {
    if (!email || isResending) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      alert('Verification email has been resent. Please check your inbox.');
      // Reset the poll count when resending
      setPollCount(0);
    } catch (error) {
      console.error('Resend verification error:', error);
      setError(error instanceof Error ? error.message : 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <p className="text-red-600">Invalid verification request</p>
              <Link
                href="/auth/signin"
                className="mt-4 inline-block text-blue-600 hover:text-blue-500"
              >
                Return to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {verificationStatus === 'pending' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-sm text-gray-600">
                    Waiting for email verification...
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    We sent a verification email to{' '}
                    <span className="font-medium text-gray-900">{email}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Click the link in the email to verify your account.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="flex flex-col space-y-4">
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? 'Sending...' : 'Resend verification email'}
                  </button>

                  <Link
                    href="/auth/signin"
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Return to sign in
                  </Link>
                </div>
              </div>
            )}

            {verificationStatus === 'success' && (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="mt-4 text-sm font-medium text-gray-900">
                  Email verified successfully!
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Redirecting to dashboard...
                </p>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="mt-4 text-sm font-medium text-gray-900">
                  Verification failed
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Please try verifying your email again or contact support.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}