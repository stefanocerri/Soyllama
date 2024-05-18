import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React, { useEffect, useMemo } from 'react';

export type Props = {
    active: boolean;
    text: string;
    children?: React.ReactNode;
}

const MaskText: React.FC<Props> = ({ active , text , children }) => {

    const maxLineLength = 30; // Mssimo numero di caratteri per linea

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
    }, []);

    const animation = {
        initial: { y: "100%" },
        enter: (i: number) => ({ y: "0%", transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1], delay: 0.075 * i } }),
        exit: (i: number) => ({ y: "100%", transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1], delay: 0.075 * (3 - i) } })
    };

    const { ref, inView } = useInView({
        threshold: 0.75,
        triggerOnce: false,
        skip: !active
    });

    return (
        <div ref={ref}>
            {lines.map((line, index) => (
                <div key={index} className="overflow-hidden">
                    <motion.p
                        custom={index}
                        variants={animation}
                        initial="initial"
                        animate={active ? "enter" : "exit"}
                        className='text-7xl'
                    >
                        {line}
                    </motion.p>
                </div>
            ))}
        </div>
    );
}

export default MaskText;
