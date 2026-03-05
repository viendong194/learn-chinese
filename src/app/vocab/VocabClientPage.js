"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'hsk-vocab-learned';
const PREMIUM_KEY = 'hsk-vocab-premium';
const FREE_CARD_LIMIT = 10;
const UNLOCK_PRICE = 50000;

function getWordId(level, item) {
  return `${level}-${item.stt}`;
}

function loadLearnedIds() {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveLearnedIds(ids) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch (_) {}
}

function isPremiumUnlocked() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(PREMIUM_KEY) === 'true';
  } catch {
    return false;
  }
}

function setPremiumUnlocked() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PREMIUM_KEY, 'true');
  } catch (_) {}
}

function SpeakerIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function VocabClientPage({ levels, vocab }) {
  const [selectedLevel, setSelectedLevel] = useState(levels[0] || 'HSK 1');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [learnedIds, setLearnedIds] = useState(() => new Set());
  const [hideLearned, setHideLearned] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paymentCode, setPaymentCode] = useState('');
  const [unlockCodeInput, setUnlockCodeInput] = useState('');
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkError, setCheckError] = useState('');

  useEffect(() => {
    setLearnedIds(loadLearnedIds());
    setIsPremium(isPremiumUnlocked());
  }, []);

  useEffect(() => {
    if (showPaywall && !paymentCode) {
      const id = Math.random().toString(36).slice(2, 10).toUpperCase();
      const code = `SEVQR-${id}`;
      setPaymentCode(code);
      setUnlockCodeInput(code);
      setCheckError('');
    }
  }, [showPaywall, paymentCode]);

  const speak = useCallback((text) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.9;
    u.onstart = () => setSpeaking(true);
    u.onend = u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, []);

  const rawList = useMemo(() => {
    const arr = vocab[selectedLevel] || [];
    if (shuffle) {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
    return arr;
  }, [selectedLevel, vocab, shuffle]);

  const list = useMemo(() => {
    if (!hideLearned) return rawList;
    return rawList.filter((item) => !learnedIds.has(getWordId(selectedLevel, item)));
  }, [rawList, hideLearned, learnedIds, selectedLevel]);

  const listForDisplay = useMemo(() => {
    if (isPremium) return list;
    return list.slice(0, FREE_CARD_LIMIT);
  }, [list, isPremium]);

  const current = listForDisplay[index];
  const total = listForDisplay.length;
  const isLocked = !isPremium && list.length > FREE_CARD_LIMIT;

  const learnedCount = useMemo(() => {
    return rawList.filter((item) => learnedIds.has(getWordId(selectedLevel, item))).length;
  }, [rawList, learnedIds, selectedLevel]);

  const isCurrentLearned = current ? learnedIds.has(getWordId(selectedLevel, current)) : false;

  const toggleLearned = useCallback((e) => {
    e?.stopPropagation();
    if (!current) return;
    const id = getWordId(selectedLevel, current);
    setLearnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveLearnedIds(next);
      return next;
    });
    if (hideLearned && index >= total - 1) setIndex(Math.max(0, total - 2));
  }, [current, selectedLevel, hideLearned, total, index]);

  const goPrev = () => {
    setIndex((i) => (i <= 0 ? total - 1 : i - 1));
    setFlipped(false);
  };
  const goNext = () => {
    if (isLocked && index === FREE_CARD_LIMIT - 1) {
      setShowPaywall(true);
      return;
    }
    setIndex((i) => (i >= total - 1 ? 0 : i + 1));
    setFlipped(false);
  };

  const handleUnlock = () => {
    setPremiumUnlocked();
    setIsPremium(true);
    setShowPaywall(false);
  };

  const handleCheckUnlock = async () => {
    const code = unlockCodeInput.trim();
    if (!code) {
      setCheckError('Vui lòng nhập mã chuyển khoản.');
      return;
    }
    setCheckLoading(true);
    setCheckError('');
    try {
      const res = await fetch(`/api/vocab/check-unlock?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.unlocked) {
        setPremiumUnlocked();
        setIsPremium(true);
        setShowPaywall(false);
      } else {
        setCheckError(data.error || 'Chưa nhận được thanh toán. Vui lòng thử lại sau vài phút.');
      }
    } catch (e) {
      setCheckError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setCheckLoading(false);
    }
  };

  if (!current) {
    const allLearned = hideLearned && list.length === 0 && rawList.length > 0;
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        {allLearned ? (
          <>
            <p className="text-gray-700 font-medium mb-2">Bạn đã thuộc hết từ trong cấp độ này!</p>
            <p className="text-gray-500 text-sm mb-4">Tắt &quot;Chỉ xem chưa thuộc&quot; để ôn lại toàn bộ.</p>
            <button
              type="button"
              onClick={() => { setHideLearned(false); setIndex(0); }}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700"
            >
              Xem tất cả
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-4">Chưa có dữ liệu từ vựng. Chạy: node scripts/excel-to-json.js</p>
            <Link href="/" className="text-orange-600 font-medium hover:underline">← Về trang chủ</Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50/30 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Breadcrumb / Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 text-sm font-medium mb-6 transition">
          ← Trang chủ
        </Link>

        {/* Level selector */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm font-bold text-gray-500">Cấp độ:</span>
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setIndex(0);
                setFlipped(false);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedLevel === level
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              {level}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={shuffle}
              onChange={(e) => {
                setShuffle(e.target.checked);
                setIndex(0);
                setFlipped(false);
              }}
              className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-600">Xáo trộn</span>
          </label>
        </div>

        {isLocked && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm text-amber-800">
              Bạn đang dùng thử <strong>{FREE_CARD_LIMIT} thẻ đầu</strong>. Mở khóa toàn bộ với <strong>{UNLOCK_PRICE.toLocaleString('vi-VN')}đ</strong>.
            </p>
            <button
              type="button"
              onClick={() => setShowPaywall(true)}
              className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-bold hover:bg-amber-700"
            >
              Mở khóa ngay
            </button>
          </div>
        )}

        {/* Learned filter + count */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <p className="text-gray-500 text-sm">
            Đã thuộc: <span className="font-bold text-orange-600">{learnedCount}</span> / {rawList.length}
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hideLearned}
              onChange={(e) => {
                setHideLearned(e.target.checked);
                setIndex(0);
              }}
              className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-600">Chỉ xem chưa thuộc</span>
          </label>
        </div>

        {/* Counter */}
        <p className="text-center text-gray-500 text-sm mb-4">
          {index + 1} / {total}
        </p>

        {/* Đã thuộc button */}
        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={toggleLearned}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isCurrentLearned
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-green-400 hover:bg-green-50 hover:text-green-700'
            }`}
          >
            <CheckIcon className="w-5 h-5" />
            {isCurrentLearned ? 'Đã thuộc' : 'Đánh dấu đã thuộc'}
          </button>
        </div>

        {/* Flashcard */}
        <div
          className="relative aspect-[4/3] max-h-[320px] w-full max-w-md mx-auto cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={() => setFlipped((f) => !f)}
        >
          <div
            className="relative w-full h-full rounded-2xl shadow-xl transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front: word + pinyin */}
            <div
              className="absolute inset-0 rounded-2xl bg-white border border-gray-100 flex flex-col items-center justify-center p-8"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <p className="text-6xl md:text-7xl font-bold text-gray-900 mb-3">{current.word}</p>
              <div className="flex items-center gap-2">
                <p className="text-xl text-orange-600 font-medium">{current.pinyin}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); speak(current.word); }}
                  className={`p-2 rounded-full transition-colors ${speaking ? 'bg-orange-100 text-orange-600' : 'text-orange-500 hover:bg-orange-50'}`}
                  aria-label="Phát âm"
                >
                  <SpeakerIcon className="w-6 h-6" />
                </button>
              </div>
              {current.type && (
                <span className="mt-2 text-xs text-gray-400 font-medium">{current.type}</span>
              )}
              <p className="mt-4 text-sm text-gray-400">Nhấn hoặc chạm để xem nghĩa</p>
            </div>

            {/* Back: meaning + tip */}
            <div
              className="absolute inset-0 rounded-2xl bg-orange-600 text-white flex flex-col items-center justify-center p-8"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <p className="text-4xl md:text-5xl font-bold mb-2">{current.word}</p>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-lg text-orange-100">{current.pinyin}</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); speak(current.word); }}
                  className={`p-1.5 rounded-full transition-colors ${speaking ? 'bg-white/20' : 'hover:bg-white/10'}`}
                  aria-label="Phát âm"
                >
                  <SpeakerIcon className="w-5 h-5 text-white" />
                </button>
              </div>
              <p className="text-2xl font-bold mb-4">{current.meaning}</p>
              {current.tip && (
                <p className="text-sm text-orange-100/90 leading-relaxed text-center max-h-24 overflow-y-auto">
                  {current.tip}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={goPrev}
            className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center text-2xl font-bold transition-all shadow-sm"
            aria-label="Từ trước"
          >
            ←
          </button>
          <button
            onClick={() => setFlipped((f) => !f)}
            className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition"
          >
            {flipped ? 'Xem chữ' : 'Xem nghĩa'}
          </button>
          <button
            onClick={goNext}
            className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center text-2xl font-bold transition-all shadow-sm"
            aria-label="Từ tiếp"
          >
            →
          </button>
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPaywall(false)}>
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mở khóa toàn bộ từ vựng HSK</h3>
            <p className="text-gray-600 text-sm mb-4">
              Chuyển khoản <strong>{UNLOCK_PRICE.toLocaleString('vi-VN')}đ</strong> với nội dung bên dưới. Sau khi chuyển, nhấn &quot;Kiểm tra &amp; Mở khóa&quot; để kích hoạt (thường trong 1–2 phút).
            </p>
            <div className="flex justify-center mb-3">
              <img
                src={`https://img.vietqr.io/image/ICB-106883335692-compact2.jpg?amount=${UNLOCK_PRICE}&addInfo=${encodeURIComponent(paymentCode || 'SEVQR')}&accountName=MR%20CHINESE`}
                alt="QR chuyển khoản"
                className="w-48 h-48 object-contain border border-gray-200 rounded-xl"
              />
            </div>
            <p className="text-xs text-gray-600 text-center mb-1">
              Nội dung chuyển khoản (bắt buộc):
            </p>
            <p className="text-center font-mono font-bold text-orange-600 mb-4 break-all px-2">
              {paymentCode || '...'}
            </p>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã của bạn (sau khi đã chuyển)</label>
              <input
                type="text"
                value={unlockCodeInput}
                onChange={(e) => setUnlockCodeInput(e.target.value)}
                placeholder="SEVQR-XXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            {checkError && (
              <p className="text-sm text-red-600 mb-3">{checkError}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPaywall(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                Để sau
              </button>
              <button
                type="button"
                onClick={handleCheckUnlock}
                disabled={checkLoading}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 disabled:opacity-60"
              >
                {checkLoading ? 'Đang kiểm tra...' : 'Kiểm tra & Mở khóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
