"use client";

import { useRef, useEffect, useCallback, useState } from 'react';

const SIZE = 320;

export default function WritingPad({ word, pinyin, onClear }) {
  const containerRef = useRef(null);
  const writerMountRef = useRef(null);
  const writerRef = useRef(null);
  const [useQuizMode, setUseQuizMode] = useState(true);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);

  const char = word ? word[0] : '';

  useEffect(() => {
    if (!char || !writerMountRef.current || !useQuizMode) {
      setLoading(false);
      return;
    }
    setIsCorrect(false);
    setLoading(true);
    const el = writerMountRef.current;
    el.innerHTML = '';
    const targetId = `hw-${Date.now()}`;
    const div = document.createElement('div');
    div.id = targetId;
    div.style.width = `${SIZE}px`;
    div.style.height = `${SIZE}px`;
    div.style.margin = '0 auto';
    el.appendChild(div);

    let writer;
    import('hanzi-writer').then((module) => {
      const HanziWriter = module.default;
      writer = HanziWriter.create(targetId, char, {
        width: SIZE,
        height: SIZE,
        padding: 10,
        showCharacter: false,
        showOutline: true,
        outlineColor: '#ddd',
        strokeColor: '#333',
        drawingColor: '#1f2937',
        drawingWidth: 4,
        highlightColor: '#22c55e',
        highlightCompleteColor: '#22c55e',
        highlightOnComplete: true,
        showHintAfterMisses: 2,
      });
      writerRef.current = writer;
      writer.quiz({
        onComplete: () => {
          setIsCorrect(true);
        },
      });
      setLoading(false);
    }).catch(() => setLoading(false));

    return () => {
      writerRef.current = null;
      if (writer && typeof writer.cancelQuiz === 'function') writer.cancelQuiz();
    };
  }, [char, useQuizMode]);

  const handleReset = () => {
    setIsCorrect(false);
    if (writerRef.current) {
      writerRef.current.quiz({
        onComplete: () => setIsCorrect(true),
      });
    }
    onClear?.();
  };

  if (!word) return null;

  if (!useQuizMode) {
    return <WritingPadFree word={word} pinyin={pinyin} onClear={onClear} onSwitchMode={() => setUseQuizMode(true)} />;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {pinyin && (
        <p className="text-center text-orange-600 font-medium mb-2">{pinyin}</p>
      )}
      <div
        ref={containerRef}
        className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center ${
          isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
        }`}
      >
        <div ref={writerMountRef} className="w-full flex justify-center" />
        {loading && (
          <p className="text-gray-400 text-sm py-2">Đang tải...</p>
        )}
        {isCorrect && !loading && (
          <p className="text-center text-green-600 font-bold py-2">Đúng rồi!</p>
        )}
      </div>
      {word.length > 1 && (
        <p className="text-center text-xs text-gray-400 mt-1">
          Đang kiểm tra chữ đầu: {char}
        </p>
      )}
      <p className="text-center text-sm text-gray-500 mt-2">
        Viết theo thứ tự nét. Viết đúng sẽ đổi màu xanh.
      </p>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
        >
          Làm lại
        </button>
        <button
          type="button"
          onClick={() => setUseQuizMode(false)}
          className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
        >
          Tự do (không kiểm tra)
        </button>
      </div>
    </div>
  );
}

function WritingPadFree({ word, pinyin, onClear, onSwitchMode }) {
  const canvasRef = useRef(null);
  const logicalSizeRef = useRef({ w: 300, h: 300 });
  const isDrawing = useRef(false);
  const pathsRef = useRef([]);
  const currentPathRef = useRef(null);
  const [strokeCount, setStrokeCount] = useState(0);

  const getPoint = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX == null || clientY == null) return null;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const drawReference = useCallback((ctx) => {
    if (!word || !ctx) return;
    const { w, h } = logicalSizeRef.current;
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#666';
    const size = Math.min(w, h) * 0.55;
    ctx.font = `${size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(word, w / 2, h / 2);
    ctx.restore();
  }, [word]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawReference(ctx);
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    pathsRef.current.forEach((path) => {
      if (path.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      path.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
  }, [drawReference]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    const logicalW = rect.width;
    const logicalH = rect.height;
    logicalSizeRef.current = { w: logicalW, h: logicalH };
    canvas.width = Math.round(logicalW * dpr);
    canvas.height = Math.round(logicalH * dpr);
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    pathsRef.current = [];
    currentPathRef.current = null;
    setStrokeCount(0);
    redraw();
  }, [word, redraw]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    const p = getPoint(e);
    if (!p) return;
    isDrawing.current = true;
    currentPathRef.current = [p];
    pathsRef.current.push(currentPathRef.current);
    setStrokeCount(pathsRef.current.length);
  };

  const handlePointerMove = (e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const p = getPoint(e);
    if (!p || !currentPathRef.current) return;
    currentPathRef.current.push(p);
    redraw();
  };

  const handlePointerUp = (e) => {
    e.preventDefault();
    isDrawing.current = false;
    currentPathRef.current = null;
  };

  const handleClear = () => {
    pathsRef.current = [];
    setStrokeCount(0);
    redraw();
    onClear?.();
  };

  const handleUndo = () => {
    if (pathsRef.current.length === 0) return;
    pathsRef.current.pop();
    setStrokeCount(pathsRef.current.length);
    redraw();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {pinyin && (
        <p className="text-center text-orange-600 font-medium mb-2">{pinyin}</p>
      )}
      <div className="relative rounded-2xl border-2 border-gray-200 bg-white overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          className="w-full aspect-square block touch-none"
          style={{ touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      <p className="text-center text-sm text-gray-500 mt-2">
        Dùng chuột (PC) hoặc ngón tay (điện thoại) để viết theo chữ mờ
      </p>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={handleUndo}
          disabled={strokeCount === 0}
          className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hoàn tác
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
        >
          Xóa hết
        </button>
        <button
          type="button"
          onClick={onSwitchMode}
          className="flex-1 py-2.5 rounded-xl border-2 border-orange-200 text-orange-600 font-medium hover:bg-orange-50"
        >
          Bật kiểm tra đúng/sai
        </button>
      </div>
    </div>
  );
}
