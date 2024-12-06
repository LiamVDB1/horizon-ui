import { motion } from 'framer-motion';
import Link from 'next/link';

import { HorizonIcon } from './icons';

export const Overview = () => {
    return (
        <motion.div
            key="overview"
            className="max-w-xl mx-auto my-auto"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ delay: 0.5 }}
        >
            <div className="rounded-xl p-5 flex flex-col gap-5 leading-relaxed text-center bg-JupGradient1 shadow-xl text-black max-w-xl mx-auto">
                {/* Icon */}
                <p className="flex flex-row justify-center gap-4 items-center">
                    <HorizonIcon size={100} className="drop-shadow-lg" />
                </p>
                {/* Title */}
                <p className="text-4xl font-extrabold tracking-tight">
                    Jupiter Horizon
                </p>

                {/* Subtitle */}
                <p className="text-lg font-medium">
                    Your AI guide to the Jupiverse!
                </p>

                {/* Description */}
                <p className="text-sm leading-relaxed">
                    I’m here to help you understand and explore all things Jupiter—trading, staking, $JUP, governance, and more.
                    Your go-to source for the knowledge and tools you need to thrive in the Jupiverse. 🪐
                </p>

            </div>
        </motion.div>
    );
};