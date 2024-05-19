"use client"

import React, { FC, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

type Props = {
    active: boolean;
    text: string;
    children?: React.ReactNode;
};

const MaskText: FC<Props> = ({ active, text, children }) => {
    console.log(text, 'text');
    const maxLineLength = 30; // Massimo numero di caratteri per linea

    const lines = useMemo(() => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            if (currentLine.length + words[i].length + 1 <= maxLineLength) {
                currentLine += ' ' + words[i];
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);
        return lines;
    }, [text]);

    const animation = {
        initial: { y: "100%" },
        enter: (i: number) => ({ y: "0%", transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1], delay: 0.075 * i } }),
        exit: (i: number) => ({ y: "100%", transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1], delay: 0.075 * (lines.length - i) } })
    };

    const { ref, inView } = useInView({
        threshold: 0.75,
        triggerOnce: false,
        skip: !active
    });

    // Usiamo `active` direttamente per controllare le animazioni
    const shouldAnimate = active || inView;

    return (
        <div ref={ref}>
            {lines.map((line, index) => (
                <div key={index} className="overflow-hidden">
                    <motion.p
                        custom={index}
                        variants={animation}
                        initial="initial"
                        animate={shouldAnimate ? "enter" : "exit"}
                        className='text-7xl'
                    >
                        {line}
                    </motion.p>
                </div>
            ))}
        </div>
    );
};

export default MaskText;