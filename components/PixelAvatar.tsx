
import React, { useMemo } from 'react';

interface PixelAvatarProps {
    seed: string;
    size?: number;
    className?: string;
}

const PixelAvatar: React.FC<PixelAvatarProps> = ({ seed, size = 64, className = "" }) => {
    const hash = useMemo(() => {
        let h = 0;
        for (let i = 0; i < seed.length; i++) {
            h = (h << 5) - h + seed.charCodeAt(i);
            h |= 0;
        }
        return Math.abs(h);
    }, [seed]);

    const BASE_COLORS = ['#FFDBAC', '#F1C27D', '#E0AC69', '#8D5524', '#C68642'];
    const HAIR_COLORS = ['#090806', '#2C1608', '#4E2708', '#B1B1B1', '#D6B483', '#A56B46'];
    const OUTFIT_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    const GADGET_COLORS = ['#94A3B8', '#475569', '#1E293B', '#F8FAFC', '#DC2626', '#FACC15'];

    const layers = useMemo(() => {
        const baseIdx = hash % BASE_COLORS.length;
        const faceIdx = (hash >> 2) % 4;
        const hairIdx = (hash >> 4) % 4;
        const hairColorIdx = (hash >> 6) % HAIR_COLORS.length;
        const outfitIdx = (hash >> 8) % 3;
        const outfitColorIdx = (hash >> 10) % OUTFIT_COLORS.length;
        const gadgetIdx = (hash >> 12) % 5;
        const gadgetColorIdx = (hash >> 14) % GADGET_COLORS.length;

        return {
            baseColor: BASE_COLORS[baseIdx],
            faceIdx,
            hairIdx,
            hairColor: HAIR_COLORS[hairColorIdx],
            outfitIdx,
            outfitColor: OUTFIT_COLORS[outfitColorIdx],
            gadgetIdx,
            gadgetColor: GADGET_COLORS[gadgetColorIdx]
        };
    }, [hash]);

    const { baseColor, faceIdx, hairIdx, hairColor, outfitIdx, outfitColor, gadgetIdx, gadgetColor } = layers;

    return (
        <div
            className={`relative inline-block overflow-hidden ${className}`}
            style={{ width: size, height: size, imageRendering: 'pixelated' }}
        >
            <svg
                viewBox="0 0 32 32"
                className="w-full h-full animate-bob-pixelated"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* BODY / BASE (Higher Rez 32x32) */}
                <path d="M10 8h12v18H10z" fill={baseColor} /> {/* Torso */}
                <path d="M11 26h3v4h-3z" fill={baseColor} /> {/* Left Leg */}
                <path d="M18 26h3v4h-3z" fill={baseColor} /> {/* Right Leg */}
                <path d="M8 10h2v8H8z" fill={baseColor} opacity="0.9" /> {/* Left Arm */}
                <path d="M22 10h2v8h-2z" fill={baseColor} opacity="0.9" /> {/* Right Arm */}

                {/* OUTFIT (32x32) */}
                {outfitIdx === 0 && ( // T-Shirt
                    <path d="M10 20h12v6H10z M8 10h2v4H8z M22 10h2v4h-2z" fill={outfitColor} />
                )}
                {outfitIdx === 1 && ( // Hoodie with Detail
                    <>
                        <path d="M10 18h12v8H10z M8 10h2v6H8z M22 10h2v6h-2z" fill={outfitColor} />
                        <path d="M15 18h2v4h-2z" fill="#000" opacity="0.1" /> {/* Zip/Detail */}
                    </>
                )}
                {outfitIdx === 2 && ( // Overall / Jacket
                    <>
                        <path d="M10 18h12v8H10z" fill={outfitColor} />
                        <path d="M11 18h1v8h-1z M20 18h1v8h-1z" fill="#000" opacity="0.15" /> {/* Straps */}
                    </>
                )}

                {/* FACE (32x32) */}
                {/* Eyes - with pupils now */}
                <rect x="13" y="13" width="2" height="2" fill="#fff" />
                <rect x="17" y="13" width="2" height="2" fill="#fff" />
                <rect x="14" y="14" width="1" height="1" fill="#000" />
                <rect x="18" y="14" width="1" height="1" fill="#000" />

                {/* Mouth */}
                {faceIdx === 0 && <path d="M15 18h2v1h-2z" fill="#000" opacity="0.4" />}
                {faceIdx === 1 && <path d="M14 18h1v1h2v-1h1v2h-4z" fill="#000" opacity="0.5" />}
                {faceIdx === 2 && <path d="M14 19h4v1h-4z" fill="#000" opacity="0.3" />}
                {faceIdx === 3 && <path d="M16 18h2v1h-2z" fill="#000" opacity="0.4" />}

                {/* HAIR (32x32) */}
                {hairIdx === 0 && ( // Short/Spiky
                    <path d="M10 6h12v3H10z M11 5h1v1h-1z M14 5h1v1h-1z M17 5h1v1h-1z M20 5h1v1h-1z" fill={hairColor} />
                )}
                {hairIdx === 1 && ( // Long
                    <path d="M10 6h12v3H10z M10 9h2v8h-2z M20 9h2v8h-2z" fill={hairColor} />
                )}
                {hairIdx === 2 && ( // Pompadour/Volume
                    <path d="M10 4h12v5H10z M11 3h10v1H11z" fill={hairColor} />
                )}
                {hairIdx === 3 && ( // Beanie/Cap
                    <path d="M10 6h12v4H10z" fill={hairColor} />
                )}

                {/* MUSIC GADGETS (32x32) */}
                {gadgetIdx === 1 && ( // Headphones
                    <>
                        <path d="M11 5h10v2h-10z" fill={gadgetColor} /> {/* Band */}
                        <path d="M10 12h3v6h-3z M19 12h3v6h-3z" fill={gadgetColor} /> {/* Cups */}
                    </>
                )}
                {gadgetIdx === 2 && ( // Retro Boombox
                    <>
                        <path d="M2 22h8v8H2z" fill={gadgetColor} />
                        <rect x="3" y="24" width="2" height="2" rx="1" fill="#000" opacity="0.4" /> {/* Speaker L */}
                        <rect x="7" y="24" width="2" height="2" rx="1" fill="#000" opacity="0.4" /> {/* Speaker R */}
                        <path d="M4 21h4v1H4z" fill="#000" opacity="0.2" /> {/* Handle */}
                    </>
                )}
                {gadgetIdx === 3 && ( // Floating Music Notes
                    <>
                        <path d="M24 6h4v2h-2v4h2v2h-4V6z" fill={gadgetColor} opacity="0.8" />
                        <path d="M4 4h2v1h-1v2h1v1H4V4z" fill={gadgetColor} opacity="0.6" />
                    </>
                )}
                {gadgetIdx === 4 && ( // Portable Player
                    <>
                        <path d="M14 22h4v7h-4z" fill={gadgetColor} />
                        <rect x="15" y="23" width="2" height="2" fill="#fff" opacity="0.3" /> {/* Screen */}
                        <circle cx="16" cy="27" r="1.5" fill="#000" opacity="0.2" /> {/* Wheel */}
                    </>
                )}
            </svg>

            <style jsx>{`
                @keyframes bob-pixelated {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(2px); }
                }
                .animate-bob-pixelated {
                    animation: bob-pixelated 1s infinite;
                    animation-timing-function: steps(4);
                }
            `}</style>
        </div>
    );
};

export default PixelAvatar;
