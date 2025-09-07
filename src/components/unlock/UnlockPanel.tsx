/*
  Gorstan – Interactive Game Framework
  Copyright © 2025 Geoff Webster. All Rights Reserved.

  This source code is proprietary and confidential.
  Unauthorised copying, distribution, modification, resale,
  reverse engineering, or use of this file, via any medium,
  is strictly prohibited without prior written consent
  from the copyright holder.

  Licensed access is granted only to authorised users who have
  purchased access to Gorstan through official channels.
  Such licence is strictly limited to running and playing the
  Gorstan game. No part of this source code may be used to
  create derivative works, other games, or redistributed in
  any form.

  Third-party libraries and assets are included under their
  respective licences as detailed in package.json and assets/.
*/

import React, { useState, useEffect } from 'react';
import { validateBetaCode, connectPatreon } from '@/lib/api';
import { useAccess } from '@/stores/access';
import { track } from '@/lib/analytics';
import { normalizeBetaCode } from '@/utils/betaCodes';

export const UnlockPanel: React.FC = () => {
  const { access, setAccess } = useAccess();
  const [tab, setTab] = useState<'patreon'|'beta'>('patreon');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isValidFormat, setIsValidFormat] = useState(false);

  // Real-time validation of beta code format
  useEffect(() => {
    const normalized = normalizeBetaCode(code);
    setIsValidFormat(!!normalized && normalized.length === 8);
  }, [code]);

  const formatBetaCode = (input: string) => {
    // Auto-format with GOR- prefix and validate
    const normalized = normalizeBetaCode(input);
    if (normalized) {
      return `GOR-${normalized}`;
    }
    return input.toUpperCase();
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCode(formatBetaCode(value));
    setMessage(null); // Clear message on input change
  };

  const submitCode = async () => {
    if (!isValidFormat) {
      setMessage('❌ Please enter a valid beta code format (8 characters)');
      return;
    }

    setLoading(true); 
    setMessage('🔍 Validating your beta code...');
    track('beta_validate_attempt', { code_prefix: code.substring(0, 7) });
    
    try {
      const res = await validateBetaCode({ code });
      if (res.ok && res.state) {
        const partial: any = { state: res.state, token: res.token || '', betaCode: code };
        if (res.expiresAt) partial.expiresAt = res.expiresAt;
        setAccess(partial);
        setMessage('✅ Beta code validated successfully! Welcome to Gorstan.');
        track('beta_validate_success', { tier: res.tier });
        setTimeout(()=> document.dispatchEvent(new CustomEvent('open-game-shell', { detail: { mode:'full' } })), 300);
      } else {
        setMessage('❌ ' + (res.message || 'Invalid beta code. Please check and try again.'));
        track('beta_validate_failed', { reason: 'invalid_code' });
      }
    } catch (e:any) {
      setMessage('⚠️ Validation failed. Please try again later.');
      track('beta_validate_error', { error: e.message });
    } finally { 
      setLoading(false); 
    }
  };

  const connect = async () => {
    setLoading(true); 
    setMessage('🔗 Connecting to Patreon...');
    track('unlock_view', { tab: 'patreon' });
    
    try {
      const res = await connectPatreon();
      if (res.ok) {
        setAccess({ state: 'patreon', token: res.token || '', patreonTier: res.tier || '' });
        setMessage('✅ Successfully connected to Patreon! Welcome to Gorstan.');
        track('patreon_connect_success', { tier: res.tier });
        setTimeout(()=> document.dispatchEvent(new CustomEvent('open-game-shell', { detail: { mode:'full' } })), 300);
      } else {
        setMessage('❌ Patreon connection failed. Please try again.');
        track('patreon_connect_failed');
      }
    } catch (e:any) {
      setMessage('⚠️ Connection failed. Please try again later.');
      track('patreon_connect_error', { error: e.message });
    } finally { 
      setLoading(false); 
    }
  };

  const getMessageStyle = () => {
    if (!message) return '';
    if (message.includes('✅')) return 'text-green-400';
    if (message.includes('❌')) return 'text-red-400';
    if (message.includes('⚠️')) return 'text-yellow-400';
    return 'text-blue-400'; // For loading states
  };

  return (
    <section id="unlock" className="py-16 px-4 bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-900 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-3">
            🎮 Unlock Full Game Access
          </h2>
          <p className="text-zinc-300 text-lg">Choose your preferred way to join the Gorstan community</p>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="flex gap-2 mb-8 p-1 bg-zinc-800/50 rounded-lg backdrop-blur-sm" role="tablist">
          <button 
            role="tab" 
            aria-selected={tab==='patreon'} 
            onClick={()=>{setTab('patreon'); setMessage(null);}} 
            className={`flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
              tab==='patreon'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25' 
                : 'bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-700/50'
            }`}
          >
            💎 Patreon Supporter
          </button>
          <button 
            role="tab" 
            aria-selected={tab==='beta'} 
            onClick={()=>{setTab('beta'); setMessage(null);}} 
            className={`flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
              tab==='beta'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25' 
                : 'bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-700/50'
            }`}
          >
            🔑 Beta Code
          </button>
        </div>

        {/* Enhanced Content Panels */}
        <div className="bg-zinc-800/30 backdrop-blur-sm rounded-xl p-8 border border-zinc-700/50">
          {tab === 'patreon' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">💎</div>
                <h3 className="text-xl font-semibold mb-2">Become a Supporter</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Join our community of supporters and unlock the full Gorstan experience. 
                  Cancel anytime, no questions asked.
                </p>
              </div>
              
              <div className="bg-zinc-700/30 rounded-lg p-4 border border-zinc-600/30">
                <h4 className="font-semibold text-amber-400 mb-2">✨ What you get:</h4>
                <ul className="text-sm text-zinc-300 space-y-1">
                  <li>• Full game access with all features</li>
                  <li>• Early access to new content</li>
                  <li>• Community Discord access</li>
                  <li>• Support indie development</li>
                </ul>
              </div>

              <button 
                disabled={loading} 
                onClick={connect} 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-amber-500/25 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? '🔗 Connecting...' : '💎 Connect with Patreon'}
              </button>
            </div>
          )}
          
          {tab === 'beta' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🔑</div>
                <h3 className="text-xl font-semibold mb-2">Enter Beta Code</h3>
                <p className="text-zinc-300">
                  Have a beta code? Enter it below to unlock full access.
                </p>
              </div>
              
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-zinc-300 mb-2 block">Beta Code</span>
                  <div className="relative">
                    <input 
                      value={code} 
                      onChange={handleCodeChange}
                      placeholder="GOR-XXXXXXXX" 
                      maxLength={12}
                      className={`w-full bg-zinc-700/50 border-2 rounded-lg px-4 py-3 text-lg font-mono tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                        isValidFormat 
                          ? 'border-green-500/50 bg-green-900/20' 
                          : code.length > 0 
                            ? 'border-red-500/50 bg-red-900/20' 
                            : 'border-zinc-600 focus:border-amber-500/50'
                      }`}
                    />
                    {code.length > 0 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isValidFormat ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-red-400">✗</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-zinc-400">
                    Format: GOR- followed by 8 characters
                  </div>
                </label>
                
                <button 
                  disabled={loading || !isValidFormat} 
                  onClick={submitCode} 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-amber-500/25 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? '🔍 Validating...' : '🔑 Validate Code'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Message Display */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg border backdrop-blur-sm ${getMessageStyle()} ${
            message.includes('✅') 
              ? 'bg-green-900/30 border-green-500/30' 
              : message.includes('❌') 
                ? 'bg-red-900/30 border-red-500/30'
                : message.includes('⚠️')
                  ? 'bg-yellow-900/30 border-yellow-500/30'
                  : 'bg-blue-900/30 border-blue-500/30'
          }`}>
            <div className="flex items-center gap-3" role="status">
              <span className="text-lg">{message.split(' ')[0]}</span>
              <span className="font-medium">{message.slice(message.indexOf(' ') + 1)}</span>
            </div>
          </div>
        )}

        {/* Enhanced Status Display */}
        <div className="mt-8 pt-6 border-t border-zinc-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-zinc-700/30 rounded-lg p-3 border border-zinc-600/30">
              <span className="text-zinc-400 block">Status:</span>
              <strong className="text-amber-400 capitalize">{access.state || 'Demo'}</strong>
            </div>
            {access.patreonTier && (
              <div className="bg-zinc-700/30 rounded-lg p-3 border border-zinc-600/30">
                <span className="text-zinc-400 block">Tier:</span>
                <strong className="text-amber-400 capitalize">{access.patreonTier}</strong>
              </div>
            )}
            {access.expiresAt && (
              <div className="bg-zinc-700/30 rounded-lg p-3 border border-zinc-600/30">
                <span className="text-zinc-400 block">Expires:</span>
                <strong className="text-amber-400">{new Date(access.expiresAt).toLocaleDateString()}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnlockPanel;
