'use client'; // Add this because we are using a hook

import { motion } from 'framer-motion';
import Link from 'next/link';

import { HorizonIcon } from '../../shared/icons';
import { useDeveloperMode } from '../context/developer-mode-context'; // Import the hook

export const Overview = () => {
    const { isDeveloperMode } = useDeveloperMode(); // Use the hook
    //const { isDeveloperMode, toggleDeveloperMode } = { isDeveloperMode: true, toggleDeveloperMode: () => {} };

    return (
        <motion.div
            key="overview"
            className="max-w-xl m-auto"
            initial={{ opacity: 0, scale: 0.80 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.80 }}
            transition={{ delay: 0.2 }}
        >
            <div className="rounded-xl p-3 flex flex-col gap-2 sm:gap-5 leading-relaxed text-center bg-JupGradient1 shadow-xl text-black max-w-xl">
                {/* Icon */}
                <p className="flex flex-row justify-center gap-4 items-center">
                    <HorizonIcon size={80} className="drop-shadow-lg sm:size-24" />
                </p>

                {isDeveloperMode ? (
                    <>
                        {/* Developer Mode Title */}
                        <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Jupiter Horizon - Developer Mode 🛠️
                        </p>
                        {/* Developer Mode Subtitle */}
                        <p className="text-base sm:text-lg font-medium">
                            Ready to explore the technical side?
                        </p>
                        {/* Developer Mode Description */}
                        <p className="text-xs sm:text-sm leading-relaxed">
                            Ask about APIs, SDKs, smart contracts, or specific code implementations within the Jupiverse. Let's build! 🚀
                        </p>
                    </>
                ) : (
                    <>
                        {/* Original Title */}
                        <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Jupiter Horizon
                        </p>
                        {/* Original Subtitle */}
                        <p className="text-base sm:text-lg font-medium">
                            Your AI guide to the Jupiverse!
                        </p>
                        {/* Original Description */}
                        <p className="text-xs sm:text-sm leading-relaxed">
                            I'm here to help you understand and explore all things Jupiter—trading, staking, $JUP, governance, and more.
                            Your go-to source for the knowledge and tools you need to thrive in the Jupiverse. 🪐
                        </p>
                    </>
                )}
            </div>
        </motion.div>
    );
};