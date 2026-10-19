import React, { useState, useEffect } from 'react';
import { Key, X, Check, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { getGeminiApiKey, setCustomGeminiApiKey } from '../../services/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [hasCustomKey, setHasCustomKey] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const existing = localStorage.getItem('poyalo_custom_gemini_key') || '';
      setApiKeyInput(existing);
      setHasCustomKey(Boolean(existing && existing.length > 10));
      setTestResult(null);
      setToast(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKeyInput.trim();
    setCustomGeminiApiKey(trimmed);
    setHasCustomKey(Boolean(trimmed && trimmed.length > 10));
    setToast(trimmed ? '✅ Custom Gemini Key saved securely to your browser!' : 'ℹ️ Custom key removed. Using built-in offline engine.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleClear = () => {
    setApiKeyInput('');
    setCustomGeminiApiKey('');
    setHasCustomKey(false);
    setTestResult(null);
    setToast('ℹ️ Key cleared. POYALO will use the deterministic offline engine.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleTestKey = async () => {
    const keyToTest = apiKeyInput.trim() || getGeminiApiKey();
    if (!keyToTest) {
      setTestResult({ success: false, message: 'Please enter a Gemini API key to test.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      let res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyToTest}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with OK' }] }]
        })
      });

      if (!res.ok) {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${keyToTest}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with OK' }] }]
          })
        });
      }

      if (res.ok) {
        setTestResult({ success: true, message: 'Google Gemini API connection verified! Key is active.' });
      } else {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `Google API returned status ${res.status}`;
        setTestResult({ success: false, message: errMsg });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: `Network error: ${err.message}` });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#FFFFFF] border-[2.5px] border-[#111827] rounded-2xl shadow-[6px_6px_0px_#111827] p-5 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#111827]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#1B3FFF] text-white flex items-center justify-center border-2 border-[#111827] shadow-[2px_2px_0px_#111827]">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-[#111827]">POYALO AI ENGINE</h3>
              <p className="text-[10px] font-mono text-gray-500">Dual-Mode: Offline Engine + Live Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border-2 border-[#111827] bg-[#FDFBF7] hover:bg-gray-100 flex items-center justify-center shadow-[1.5px_1.5px_0px_#111827] active:translate-x-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Engine Status Banner */}
        <div className="mt-4 p-3 rounded-xl border-2 border-[#111827] bg-[#F0FDF4] shadow-[2px_2px_0px_#111827] space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-mono font-black text-xs text-emerald-950 uppercase">
              Deterministic Engine: 100% Operational
            </span>
          </div>
          <p className="text-[10px] font-mono text-emerald-800 leading-relaxed">
            POYALO automatically synthesizes multi-day itineraries, comic lore, and cultural myths locally without depending on external servers.
          </p>
        </div>

        {/* Custom API Key Input */}
        <div className="mt-4 space-y-2">
          <label className="block font-mono font-black text-xs text-[#111827] uppercase">
            Custom Google Gemini Key (Optional):
          </label>
          <div className="relative">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste AIzaSy... key (stored locally)"
              className="w-full px-3 py-2 bg-[#FDFBF7] border-2 border-[#111827] rounded-xl font-mono text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1B3FFF] shadow-inner"
            />
          </div>
          <p className="text-[9px] font-mono text-gray-500">
            🔒 Stored strictly in your browser’s localStorage. Never sent to GitHub or shared.
          </p>
        </div>

        {/* Test Result Banner */}
        {testResult && (
          <div className={`mt-3 p-2.5 rounded-xl border-2 border-[#111827] text-xs font-mono font-bold flex items-start space-x-2 shadow-[2px_2px_0px_#111827] ${
            testResult.success ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
          }`}>
            {testResult.success ? <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />}
            <span className="text-[11px] leading-tight">{testResult.message}</span>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="mt-3 p-2 bg-blue-100 border border-[#111827] rounded-lg text-blue-900 text-[11px] font-mono font-bold">
            {toast}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-between gap-2 pt-3 border-t-2 border-gray-100">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={isTesting}
            className="px-3 py-2 bg-[#FEF3C7] hover:bg-amber-200 border-2 border-[#111827] rounded-xl text-xs font-mono font-black shadow-[2px_2px_0px_#111827] active:translate-x-0.5 flex items-center space-x-1 disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-amber-700" />
            <span>{isTesting ? 'TESTING...' : 'TEST KEY'}</span>
          </button>

          <div className="flex items-center space-x-2">
            {hasCustomKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2.5 py-2 bg-gray-100 hover:bg-gray-200 border-2 border-[#111827] rounded-xl text-xs font-mono font-bold text-gray-700 shadow-[1.5px_1.5px_0px_#111827] active:translate-x-0.5"
              >
                CLEAR
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-[#1B3FFF] hover:bg-[#1532CC] text-white border-2 border-[#111827] rounded-xl text-xs font-mono font-black shadow-[2px_2px_0px_#111827] active:translate-x-0.5"
            >
              SAVE KEY
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
