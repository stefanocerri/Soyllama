"use client"


import React, { useState, useEffect, FC } from 'react';
import EvasiveImage from './components/EvasiveImage';
import MaskText from './components/MaskText';

const Home: FC = () => {
  const [animateText, setAnimateText] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout; ;
    if (animateText) {
      timer = setTimeout(() => {
        setAnimateText(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [animateText]);

  const phrases = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "2Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "3Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  ]

  return (
    <>
      <EvasiveImage onImageClick={() => setAnimateText(true)} />
      <MaskText active={animateText} text={phrases[0]}/>
    </>
  );
};

export default Home;
