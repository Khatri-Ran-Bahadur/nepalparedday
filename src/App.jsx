import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { members } from './data/members';
import './index.css';

function App() {
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date("2026-05-10T00:00:00");
      const now = new Date();
      const diff = target - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      setTimeLeft(`परेड सुरु हुन ${days} दिन बाँकी`);
    };
    calculateTime();
    const timer = setInterval(calculateTime, 86400000);
    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    setStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  useEffect(() => {
    if (!started) return;

    // Intro Animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".banner-container", { scale: 1.1, duration: 5, ease: "linear" })
        .from(".header-title-nepali", { y: -100, opacity: 0, duration: 2, ease: "expo.out" }, 0.5)
        .from(".countdown-timer", { scale: 0, opacity: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" }, 1)
        .from(".slogan-left", { x: -200, opacity: 0, rotate: -180, duration: 2, ease: "power4.out" }, 1.5)
        .from(".slogan-right", { x: 200, opacity: 0, rotate: 180, duration: 2, ease: "power4.out" }, 1.5);

      // Create initial blast
      createBlast();
    }, containerRef);

    return () => ctx.revert();
  }, [started]);

  const createBlast = () => {
    const pieces = 100;
    const colors = ['#dc2626', '#fbbf24', '#ffffff', '#ff69b4', '#4b0082'];

    for (let i = 0; i < pieces; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.width = Math.random() * 25 + 5 + 'px';
      p.style.height = p.style.width;
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.borderRadius = i % 3 === 0 ? '50%' : '10%';
      p.style.left = '50%';
      p.style.top = '50%';
      p.style.position = 'absolute';
      p.style.zIndex = '50';
      containerRef.current.appendChild(p);

      gsap.to(p, {
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 1500,
        rotate: Math.random() * 1000,
        opacity: 0,
        scale: 0.1,
        duration: 3 + Math.random() * 3,
        ease: "power3.out",
        onComplete: () => p.remove()
      });
    }
  };

  useEffect(() => {
    if (!started) return;

    const cards = sliderRef.current.querySelectorAll('.member-card');
    gsap.set(cards, { opacity: 0, scale: 0.8, rotateY: 90, z: -500, filter: "blur(0px)", visibility: 'hidden' });

    const currentCard = cards[currentIndex];
    const tl = gsap.timeline();

    tl.to(currentCard, {
      visibility: 'visible',
      opacity: 1,
      scale: 1,
      rotateY: 0,
      z: 0,
      filter: "blur(0px)",
      duration: 2,
      ease: "expo.out"
    })
      .to(currentCard, {
        opacity: 0,
        scale: 2,
        z: 1000,
        filter: "blur(20px)",
        duration: 1.5,
        delay: 5,
        onComplete: () => {
          gsap.set(currentCard, { visibility: 'hidden' });
          setCurrentIndex((prev) => (prev + 1) % members.length);
        }
      });

  }, [currentIndex, started]);

  return (
    <div className="banner-container" ref={containerRef}>
      {!started && (
        <div className="start-overlay">
          <button className="start-btn" onClick={handleStart}>
            शुभकामना सन्देश हेर्नुहोस् (Watch Wishes)
          </button>
        </div>
      )}

      {/* Background Song */}
      <audio ref={audioRef} loop>
        <source src="/टाढा भए पनि मुटुमा नेपाल छ.mp3" type="audio/mpeg" />
      </audio>

      <div className="top-section">
        <h1 className="header-title-nepali">नेपाल परेड डे</h1>
        <div className="countdown-timer">{timeLeft}</div>
      </div>

      <div className="tilted-slogan slogan-left">हाम्रो शान</div>
      <div className="tilted-slogan slogan-right">नेपाल को पहिचान</div>

      <div className="member-slider" ref={sliderRef}>
        {members.map((member) => (
          <div key={member.id} className="member-card">
            <div className="member-image-container">
              <img src={member.image} alt={member.name} className="member-image" />
            </div>
            <h1 className="member-name">{member.name}</h1>
            <div className="member-designation">{member.designation}</div>
            <div className="member-phone">📞 {member.phone}</div>
          </div>
        ))}
      </div>

      <div className="bottom-section" style={{ paddingBottom: '3rem' }}>
        <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px' }}>
          सन फ्रान्सिस्को, क्यालिफोर्निया • मे १०, २०२६
        </div>
        <div style={{ marginTop: '1.2rem', fontSize: '1.2rem', opacity: 0.9, fontWeight: 600 }}>
          गर्विलो नेपाली, अमेरिकामा एकजुट
        </div>
      </div>
    </div>
  );
}

export default App;
