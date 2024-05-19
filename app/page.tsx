"use client";import { FC, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { initialPhrases } from "./phrases";
import EvasiveImage from "./components/EvasiveImage";
import { ShaderPlane } from "./components/ShaderPlane";

const Home: FC = () => {
  const [phrases, setPhrases] = useState<string[]>([]);

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
  };

  return (
    <>
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh' , zIndex: -1}}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(window.devicePixelRatio || 1);
        }}
      >
        <ShaderPlane />
      </Canvas>
      <div>
        <EvasiveImage onImageClick={handleImageClick} />
        <div className="w-full overflow-hidden p-12 absolute top-0 left-0 z-1">
          <div className="flex flex-col items-start justify-end h-full space-y-16">
            <AnimatePresence>
              {phrases.map((phrase, index) => (
                <motion.div
                  key={phrase}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30, transition: { duration: 0.5 } }}
                  transition={{ duration: 0.5 }}
                  className="text-blue-500 text-lg lg:text-6xl"
                >
                  {phrase}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
