"use client"

import React, { FC, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

type Props = {
    children?: React.ReactNode
};

const Popup: FC<Props> = ({ children }) => {


    return (
        <div className='absolute left-12 top-12 rounded-lg bg-green-200 p-6 text-black'>
            {children}
        </div>
    );
};

export default Popup;