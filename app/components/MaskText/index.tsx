"use client"

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React, { useEffect } from 'react';

export type Props = {
    active: boolean;
}

const MaskText: React.FC<Props> = ({ active }) => {
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

    const phrases = [
        "It is a long established fact",
        "that a reader will be distracted",
        "by the readable content of a page",
        "when looking at its layout."
    ];

    return (
        <div ref={ref}>
            {phrases.map((phrase, index) => (
                <div key={index} className="overflow-hidden">
                    <motion.p
                        custom={index}
                        variants={animation}
                        initial="initial"
                        animate={active ? "enter" : "exit"}
                        className='text-7xl'
                    >
                        {phrase}
                    </motion.p>
                </div>
            ))}
        </div>
    );
}

export default MaskText;
