"use client"


import { FC, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { initialPhrases } from "./phrases";
import EvasiveImage from "./components/EvasiveImage";
import { ShaderPlane } from "./components/ShaderPlane";

const Home: FC = () => {
  const [phrases, setPhrases] = useState<string[]>([]);
  const [clicked, setClicked] = useState(false);

  const handleImageClick = () => {
    let newIndex, newText;
    do {
      newIndex = Math.floor(Math.random() * initialPhrases.length);
      newText = initialPhrases[newIndex];
    } while (phrases.includes(newText));

    const newPhrases = [...phrases, newText];
    if (newPhrases.length > 3) {
      newPhrases.shift();
    }
    setPhrases(newPhrases);
    setClicked(true); // Imposta a true dopo il primo clic
  };

  return (
    <>
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(window.devicePixelRatio || 1);
        }}
      >
        <ShaderPlane />
      </Canvas>
      <div className="absolute inset-0 z-2">
        <EvasiveImage onImageClick={handleImageClick} >
            <AnimatePresence>
                {!clicked && ( // Renderizza solo se non è stato cliccato
                <motion.div
                  key="click-me"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.2, 1], color: ['#ff0000', '#00ff00', '#0000ff'], transition: { repeat: Infinity, duration: 0.5 } }}
                  className="text-lg lg:text-8xl"
                  onClick={() => setClicked(true)} // Imposta a true quando viene cliccato
                >
                  Click me
                </motion.div>
              )}
            </AnimatePresence>
        </EvasiveImage>
      </div>
      <div className="w-full overflow-hidden p-12 absolute top-0 left-0 z-1">
        <AnimatePresence>

          <motion.div
            key="phrases-container"
            initial={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -30, transition: { duration: 0.5 } }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start justify-end space-y-16"
          >
            {phrases.map((phrase, index) => (
              <motion.div
                key={phrase}
                initial={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -30, transition: { duration: 0.5 } }}
                transition={{ duration: 0.5 }}
                className={`${index === phrases.length - 1 ? 'text-blue-500 ' : 'text-black'} text-lg lg:text-8xl`}
              >
                {phrase}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default Home;
