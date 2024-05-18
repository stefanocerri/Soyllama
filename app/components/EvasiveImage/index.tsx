"use client";

import { useEffect, useState, FC } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type EvasiveImageProps = {
  onImageClick: () => void;
};

const EvasiveImage: FC<EvasiveImageProps> = ({ onImageClick }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startMoving, setStartMoving] = useState(false);
  const [isMoving, setIsMoving] = useState(true);
  const [pauseMovement, setPauseMovement] = useState(false); // Stato per gestire le pause

  const centerImage = () => {
    const windowX = window.innerWidth / 2 - 50;
    const windowY = window.innerHeight / 2 - 50;
    setPosition({ x: windowX, y: windowY });
  };

  useEffect(() => {
    centerImage();
    window.addEventListener('resize', centerImage);
    const timer = setTimeout(() => setStartMoving(true), 1000);

    return () => {
      window.removeEventListener('resize', centerImage);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let interval:  NodeJS.Timeout;
    if (startMoving && isMoving && !pauseMovement) {
      interval = setInterval(randomMove, 300);
    }
    return () => clearInterval(interval);
  }, [startMoving, isMoving, pauseMovement]);

  const randomMove = () => {
    if (Math.random() < 0.10) { // 10% di probabilità di pausa
      setPauseMovement(true);
      setTimeout(() => setPauseMovement(false), 500); // Pausa di 500ms
      return;
    }

    const windowX = window.innerWidth - 100;
    const windowY = window.innerHeight - 100;
    const newX = Math.random() * windowX;
    const newY = Math.random() * windowY;
    setPosition({ x: newX, y: newY });
  };

  const handleClick = () => {
    onImageClick();
    setIsMoving(false);
    setTimeout(() => {
      setIsMoving(true);
    }, 100);
  };

  return (
    <motion.div
      className="fixed"
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      style={{
        width: 100,
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={handleClick}
    >
      <Image
        src="/assets/images/prova.jpg"
        alt="Immagine Elusiva"
        width={100}
        height={100}
        objectFit="cover"
        className='cursor-pointer'
      />
    </motion.div>
  );
};

export default EvasiveImage;
