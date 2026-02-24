
import React, { useState } from 'react';
import PixelAvatar from './PixelAvatar';

const AvatarTester = () => {
    const [seed, setSeed] = useState('tonimateos');

    const randomizeSeed = () => {
        const newSeed = Math.random().toString(36).substring(7);
        setSeed(newSeed);
    };

    return (
        <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-3xl max-w-sm mx-auto text-center space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Avatar System Tester</h2>

            <div className="flex justify-center p-8 bg-black/40 rounded-2xl border border-neutral-800 shadow-inner group">
                <PixelAvatar
                    seed={seed}
                    size={128}
                    className="transition-transform group-hover:scale-110 duration-500"
                />
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-2"> Current Seed </label>
                    <input
                        type="text"
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-green-500 transition-colors"
                    />
                </div>

                <button
                    onClick={randomizeSeed}
                    className="w-full py-3 bg-white text-black font-black rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                    <span>🎲 Randomize Seed</span>
                </button>
            </div>

            <div className="text-[10px] text-neutral-600 font-medium">
                Layers: Base • Face • Hair • Outfit
                <br />
                Animated with steps(4)
            </div>
        </div>
    );
};

export default AvatarTester;
