'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { EXPLORER_URL } from '../../lib/constants';

function Confetti() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#22c55e', '#f59e0b', '#06b6d4'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="celebration">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti"
          style={{
            backgroundColor: p.color,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const txHash = searchParams.get('tx') || '';
  const balance = searchParams.get('balance') || '0';
  const amount = searchParams.get('amount') || '0';
  const address = searchParams.get('address') || '';

  const formattedBalance = !isNaN(parseFloat(balance))
    ? Number(balance).toLocaleString('en-US', { maximumFractionDigits: 4 })
    : balance;

  const truncate = (str) =>
    str ? `${str.slice(0, 10)}...${str.slice(-8)}` : '';

  return (
    <>
      <header className="header">
        <a href="/" className="brand">
          <span className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="url(#paint0_linear_logo_layout)"/>
              <path d="M13 3L6 13H11V21L18 11H13V3Z" fill="white"/>
              <defs>
                <linearGradient id="paint0_linear_logo_layout" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a855f7"/>
                  <stop offset="1" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span style={{ color: '#1a1b26' }}>transfr</span>
        </a>
        <nav>
          <ul className="nav-links">
            <li><a href="/send">Send</a></li>
          </ul>
        </nav>
      </header>
      <div className="page-container">
        <Confetti />

        <div className="card slide-up" style={{ textAlign: 'center' }}>
          <div className="success-icon">🎉</div>

          <h1 className="card-title">Claimed!</h1>
          <p className="card-subtitle">
            You successfully claimed {amount} ETH
          </p>

        <div className="amount-display">
          <div>
            <span className="amount-value">{formattedBalance}</span>
            <span className="amount-unit">ETH</span>
          </div>
          <p className="amount-label">Wallet Balance</p>
        </div>

        <div style={{ textAlign: 'left' }}>
          <div className="detail-row">
            <span className="detail-label">Transaction</span>
            <span className="detail-value">
              {txHash ? (
                <a
                  href={`${EXPLORER_URL}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncate(txHash)} ↗
                </a>
              ) : (
                '—'
              )}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Amount Claimed</span>
            <span className="detail-value">{amount} ETH</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Wallet</span>
            <span className="detail-value">
              {address ? (
                <a
                  href={`${EXPLORER_URL}/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncate(address)} ↗
                </a>
              ) : (
                '—'
              )}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Network</span>
            <span className="detail-value" style={{ fontFamily: 'var(--font-sans)' }}>
              Sepolia Testnet
            </span>
          </div>
        </div>

        <div className="btn-group" style={{ marginTop: '2rem' }}>
          <a href="/" className="btn btn-primary btn-full btn-lg">
            Send More ETH
          </a>
          {txHash && (
            <a
              href={`${EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-full"
            >
              View on Etherscan ↗
            </a>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="page-container">
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '2rem auto' }} />
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
