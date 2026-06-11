import { useEffect, useRef } from 'react';

const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, cx: 0, cy: 0 });

  useEffect(() => {
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    let raf: number;
    const loop = () => {
      pos.current.cx += (pos.current.x - pos.current.cx) * 0.14;
      pos.current.cy += (pos.current.y - pos.current.cy) * 0.14;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.cx}px`;
        cursorRef.current.style.top = `${pos.current.cy}px`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onEnter = () => document.body.classList.add('hovering');
    const onLeave = () => document.body.classList.remove('hovering');
    const bindHover = () => {
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    bindHover();
    document.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-dot" ref={dotRef} />
    </>
  );
}
