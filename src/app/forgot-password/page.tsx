'use client';

import React, { useState } from 'react';
import { useAuth, useSignIn } from '@clerk/nextjs';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  // If the user is already signed in, redirect them to the home page
  if (isSignedIn) {
    router.push('/');
  }

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      .then(() => {
        setSuccessfulCreation(true);
        setError('');
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result?.status === 'needs_second_factor') {
          setSecondFactor(true);
          setError('');
        } else if (result?.status === 'complete') {
          if (setActive) {
            setActive({ session: result.createdSessionId });
          } else {
            console.error('setActive is not defined');
          }
          setPasswordResetSuccess(true);
          setError('');
        } else {
          setError('Unexpected response from the server.');
        }
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <div
      style={{
        margin: 'auto',
        maxWidth: '500px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '2em',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: '1.5em',
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        Forgot Password?
      </h1>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
        }}
        onSubmit={!successfulCreation ? create : reset}
      >
        {!successfulCreation && (
          <>
            <label
              htmlFor="email"
              style={{
                fontSize: '1em',
                fontWeight: '500',
                color: '#555',
              }}
            >
              Provide your email address
            </label>
            <input
              type="email"
              placeholder="e.g john@doe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '0.75em',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '1em',
                color: '#333',
              }}
            />
            <button
              style={{
                padding: '0.75em',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1em',
              }}
            >
              Send password reset code
            </button>
            {error && (
              <p
                style={{
                  color: 'red',
                  fontSize: '0.9em',
                }}
              >
                {error}
              </p>
            )}
          </>
        )}

        {successfulCreation && (
          <>
            <label
              htmlFor="password"
              style={{
                fontSize: '1em',
                fontWeight: '500',
                color: '#555',
              }}
            >
              Enter your new password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: '0.75em',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '1em',
                color: '#333',
              }}
            />
            <label
              htmlFor="password"
              style={{
                fontSize: '1em',
                fontWeight: '500',
                color: '#555',
              }}
            >
              Enter the password reset code that was sent to your email
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                padding: '0.75em',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '1em',
                color: '#333',
              }}
            />
            <button
              style={{
                padding: '0.75em',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1em',
              }}
            >
              Reset
            </button>
            {error && (
              <p
                style={{
                  color: 'red',
                  fontSize: '0.9em',
                }}
              >
                {error}
              </p>
            )}
          </>
        )}
        {passwordResetSuccess && <p>You have successfully changed your password!</p>}
        {secondFactor && <p>2FA is required, but this UI does not handle that.</p>}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
