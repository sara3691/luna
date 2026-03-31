import React from 'react';
import { motion } from 'framer-motion';

interface GlassContainerProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ children, className = "", delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            className={`glass-card p-8 ${className}`}
        >
            {children}
        </motion.div>
    );
};
