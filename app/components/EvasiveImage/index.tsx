"use client";

import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type EvasiveImageProps = {
  onImageClick: () => void;
};

const EvasiveImage: FC<EvasiveImageProps> = ({ onImageClick }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [pauseMovement, setPauseMovement] = useState(false);
  const [imageName, setImageName] = useState('front.jpg'); // stato per il nome dell'immagine

  useEffect(() => {
    const centerImage = () => {
      const windowX = window.innerWidth / 2 - 50;
      const windowY = window.innerHeight / 2 - 50;
      setPosition({ x: windowX, y: windowY });
    };

    centerImage();
    window.addEventListener('resize', centerImage);
    const timer = setTimeout(() => setIsMoving(true), 1000);

    return () => {
      window.removeEventListener('resize', centerImage);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let interval:  NodeJS.Timeout;
    if (isMoving && !pauseMovement) {
      interval = setInterval(randomMove, 300); //da mettere 300
    }
    return () => clearInterval(interval);
  }, [isMoving, pauseMovement]);

  const randomMove = () => {
    if (Math.random() < 0.10) {
      setPauseMovement(true);
      setTimeout(() => setPauseMovement(false), 750);
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
      setImageName('sx.png');
    } else if (newX > 2 * thirdWindow) {
      setImageName('dx.png');
    } else {
      setImageName('front.png');
    }
  };

  const handleClick = () => {
    onImageClick();
    setIsMoving(false);
    setTimeout(() => setIsMoving(true), 100);
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
      onClick={handleClick}
      style={{
        width: 400,
        height: 400,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        src={`/assets/images/${imageName}`}
        alt="Evasive Image"
        width={400}
        height={400}
        objectFit="cover"
      />
    </motion.div>
  );
};

export default EvasiveImage;
