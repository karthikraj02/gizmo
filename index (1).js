import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [follower, setFollower] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    let followerX = 0, followerY = 0;
    let rafId;

    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const animate = () => {
      followerX += (pos.x - followerX) * 0.12;
      followerY += (pos.y - followerY) * 0.12;
      setFollower({ x: followerX, y: followerY });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafId);
    };
  }, [pos.x, pos.y]);

  return (
    <>
      <div className={`cursor ${clicking ? 'clicking' : ''}`}
        style={{ left: pos.x - 6, top: pos.y - 6 }} />
      <div className={`cursor-follower ${clicking ? 'clicking' : ''}`}
        style={{ left: follower.x - 16, top: follower.y - 16 }} />
    </>
  );
};

export default CustomCursor;
