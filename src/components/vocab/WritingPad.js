"use client";

import { useRef, useEffect, useCallback } from 'react';

export default function WritingPad({ word, pinyin, onClear }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const pathsRef = useRef([]);
  const currentPathRef = useRef(null);

  const getPoint = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX == null || clientY == null) return null;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const drawReference = useCallback((ctx) => {
    if (!word || !ctx) return;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
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
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    pathsRef.current = [];
    currentPathRef.current = null;
    redraw();
  }, [word, redraw]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    const p = getPoint(e);
    if (!p) return;
    isDrawing.current = true;
    currentPathRef.current = [p];
    pathsRef.current.push(currentPathRef.current);
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
    redraw();
    onClear?.();
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
      <button
        type="button"
        onClick={handleClear}
        className="mt-3 w-full py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
      >
        Xóa nét
      </button>
    </div>
  );
}
