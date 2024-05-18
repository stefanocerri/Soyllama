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
  const [pauseMovement, setPauseMovement] = useState(false);
  const [imageName, setImageName] = useState('front.jpg'); // stato per il nome dell'immagine

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
    let interval;
    if (startMoving && isMoving && !pauseMovement) {
      interval = setInterval(randomMove, 300);
    }
    return () => clearInterval(interval);
  }, [startMoving, isMoving, pauseMovement]);

  const randomMove = () => {
    if (Math.random() < 0.10) {
      setPauseMovement(true);
      setTimeout(() => setPauseMovement(false), 500);
      return;
    }

    const windowX = window.innerWidth - 100;
    const windowY = window.innerHeight - 100;
    const newX = Math.random() * windowX;
    const newY = Math.random() * windowY;
    setPosition({ x: newX, y: newY });

    // Determina il nome dell'immagine basato sulla posizione
    const thirdWindow = window.innerWidth / 3;
    if (newX < thirdWindow) {
      setImageName('sx.jpg');
    } else if (newX > 2 * thirdWindow) {
      setImageName('dx.jpg');
    } else {
      setImageName('front.jpg');
    }
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
        src={`/assets/images/${imageName}`}
        alt="Evasive Image"
        width={100}
        height={100}
        objectFit="cover"
        className='cursor-pointer'
      />
    </motion.div>
  );
};

export default EvasiveImage;
