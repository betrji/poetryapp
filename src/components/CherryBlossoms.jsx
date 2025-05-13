import { useEffect, useState } from 'react';

function CherryBlossoms() {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Create random petals
    const createPetals = () => {
      const totalPetals = window.innerWidth < 768 ? 18 : 36;
      const newPetals = [];

      for (let i = 0; i < totalPetals; i++) {
        const size = Math.random() * 16 + 8; // 8-24px
        const drift = Math.random() > 0.5 ? 1 : -1;
        newPetals.push({
          id: `petal-${i}`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 8 + 10}s`, // 10-18s
          animationDelay: `${Math.random() * 10}s`,
          opacity: Math.random() * 0.5 + 0.5, // 0.5-1.0
          size: `${size}px`,
          rotate: `${Math.random() * 360}deg`,
          scale: `${0.85 + Math.random() * 0.3}`,
          drift,
        });
      }

      setPetals(newPetals);
    };

    createPetals();

    // Re-create petals when window is resized
    window.addEventListener('resize', createPetals);
    return () => window.removeEventListener('resize', createPetals);
  }, []);

  return (
    <div className="create-petals">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="blossom-petal-modern"
          style={{
            left: petal.left,
            animationDuration: petal.animationDuration,
            animationDelay: petal.animationDelay,
            opacity: petal.opacity,
            width: petal.size,
            height: petal.size,
            transform: `rotate(${petal.rotate}) scale(${petal.scale})`,
            filter: 'drop-shadow(0 2px 6px rgba(236,72,153,0.18))',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            <path d="M12 2C11.5 3.5 13 5.5 13 5.5C13 5.5 12.5 8 14 9.5C15.5 11 17.5 11 17.5 11C17.5 11 18 13 16 15C14 17 12 17 12 17C12 17 10 17 8 15C6 13 6.5 11 6.5 11C6.5 11 8.5 11 10 9.5C11.5 8 11 5.5 11 5.5C11 5.5 12.5 3.5 12 2Z" fill="#F472B6"/>
            <ellipse cx="12" cy="12" rx="2.5" ry="1.2" fill="#FBCFE8" fillOpacity="0.7"/>
          </svg>
        </div>
      ))}
    </div>
  );
}

export default CherryBlossoms; 