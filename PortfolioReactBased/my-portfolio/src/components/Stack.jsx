
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import './Stack.css';

function CardRotate({ children, onSendToBack, sensitivity = 200 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_, info) {
    if (!info) return;
    const threshold = typeof sensitivity === 'number' && sensitivity > 0 ? sensitivity : 200;
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.offset.y) > threshold) {
      onSendToBack?.();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="card-rotate"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cardDimensions = { width: 208, height: 208 },
  cardsData = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false
}) {
  const [cards, setCards] = useState(cardsData || []);
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    setIsInitialMount(false);
  }, []);

  useEffect(() => {
    if (cardsData && Array.isArray(cardsData) && cardsData.length > 0) {
      setCards(cardsData);
    } else {
      setCards([]);
    }
  }, [cardsData]);

  const sendToBack = useCallback((id) => {
    if (!id) return;
    setCards(prev => {
      if (!Array.isArray(prev) || prev.length === 0) return prev;
      const newCards = [...prev];
      const index = newCards.findIndex(card => card && card.id === id);
      if (index === -1) return prev;
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  }, []);

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center text-[#a5a6f6] py-8">
        <p>No cards available.</p>
      </div>
    );
  }

  return (
    <div
      className="stack-container"
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
        perspective: 600
      }}
    >
      {cards.map((card, index) => {
        if (!card || !card.id) return null;
        
        const randomRotate = randomRotation ? Math.random() * 10 - 5 : 0;
        const scaleOffset = cards.length > 8 ? 0.04 : 0.06;
        const scale = 1 + index * scaleOffset - cards.length * scaleOffset;
        const entranceDelay = index * 0.08;

        return (
          <CardRotate key={card.id} onSendToBack={() => sendToBack(card.id)} sensitivity={sensitivity || 200}>
            <motion.div
              className="card"
              onClick={() => sendToBackOnClick && sendToBack(card.id)}
              animate={{
                rotateZ: (cards.length - index - 1) * 3 + randomRotate,
                scale: scale,
                transformOrigin: '90% 90%',
                opacity: 1
              }}
              initial={isInitialMount ? {
                rotateZ: (cards.length - index - 1) * 3 + randomRotate + 20,
                scale: scale * 0.8,
                opacity: 0,
                y: 50
              } : false}
              transition={{
                type: 'spring',
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
                delay: isInitialMount ? entranceDelay : 0,
                opacity: {
                  duration: 0.4,
                  delay: isInitialMount ? entranceDelay : 0
                }
              }}
              whileHover={{
                scale: scale * 1.05,
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 17
                }
              }}
              style={{
                width: cardDimensions.width,
                height: cardDimensions.height
              }}
            >
              <motion.img
                src={card.img}
                alt={card.alt || `Certificate ${card.id}`}
                className="card-image"
                initial={isInitialMount ? { scale: 1.1 } : false}
                animate={{ scale: 1 }}
                transition={isInitialMount ? {
                  duration: 0.6,
                  delay: entranceDelay + 0.2,
                  ease: "easeOut"
                } : {
                  duration: 0.3,
                  ease: "easeOut"
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}