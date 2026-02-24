
import React, { useMemo } from 'react';

interface PixelAvatarProps {
    seed: string;
    size?: number;
    className?: string;
}

const PixelAvatar: React.FC<PixelAvatarProps> = ({ seed, size = 64, className = "" }) => {
    // Simple hash function to get consistent indices from seed
    const hash = useMemo(() => {
        let h = 0;
        for (let i = 0; i < seed.length; i++) {
            h = (h << 5) - h + seed.charCodeAt(i);
            h |= 0; // Convert to 32bit integer
        }
        return Math.abs(h);
    }, [seed]);

    // Define Variations
    const BASE_COLORS = ['#FFDBAC', '#F1C27D', '#E0AC69', '#8D5524', '#C68642'];
    const HAIR_COLORS = ['#090806', '#2C1608', '#4E2708', '#B1B1B1', '#D6B483', '#A56B46'];
    const OUTFIT_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

    const layers = useMemo(() => {
        const baseIdx = hash % BASE_COLORS.length;
        const faceIdx = (hash >> 2) % 4; // 4 expressions
        const hairIdx = (hash >> 4) % 4; // 4 styles
        const hairColorIdx = (hash >> 6) % HAIR_COLORS.length;
        const outfitIdx = (hash >> 8) % 3; // 3 styles
        const outfitColorIdx = (hash >> 10) % OUTFIT_COLORS.length;

        return {
            baseColor: BASE_COLORS[baseIdx],
            faceIdx,
            hairIdx,
            hairColor: HAIR_COLORS[hairColorIdx],
            outfitIdx,
            outfitColor: OUTFIT_COLORS[outfitColorIdx]
        };
    }, [hash]);

    const { baseColor, faceIdx, hairIdx, hairColor, outfitIdx, outfitColor } = layers;

    return (
        <div
            className={`relative inline-block overflow-hidden ${className}`}
            style={{ width: size, height: size, imageRendering: 'pixelated' }}
        >
            <svg
                viewBox="0 0 16 16"
                className="w-full h-full animate-bob-pixelated"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* BASE / BODY */}
                <rect x="4" y="4" width="8" height="10" fill={baseColor} />
                <rect x="5" y="14" width="2" height="2" fill={baseColor} />
                <rect x="9" y="14" width="2" height="2" fill={baseColor} />

                {/* OUTFIT */}
                {outfitIdx === 0 && (
                    <path d="M4 10h8v4H4z" fill={outfitColor} /> // Simple shirt
                )}
                {outfitIdx === 1 && (
                    <path d="M4 10h3l1-1 1 1h3v4H4z" fill={outfitColor} /> // V-neck
                )}
                {outfitIdx === 2 && (
                    <>
                        <path d="M4 10h8v4H4z" fill={outfitColor} opacity="0.8" />
                        <path d="M6 10h4v1H6z" fill="#000" opacity="0.2" /> // Suspenders/Detail
                    </>
                )}

                {/* FACE */}
                {/* Eyes */}
                <rect x="6" y="7" width="1" height="1" fill="#000" />
                <rect x="9" y="7" width="1" height="1" fill="#000" />

                {/* Mouth/Expression */}
                {faceIdx === 0 && <rect x="7" y="9" width="2" height="1" fill="#000" opacity="0.5" />} // Neutral
                {faceIdx === 1 && <path d="M7 9h2v1H7z" fill="#000" opacity="0.6" />} // Smile
                {faceIdx === 2 && <rect x="7" y="10" width="2" height="1" fill="#000" opacity="0.4" />} // Low mouth
                {faceIdx === 3 && <rect x="8" y="9" width="1" height="1" fill="#000" opacity="0.5" />} // Side smirk

                {/* HAIR */}
                {hairIdx === 0 && ( // Short
                    <path d="M4 3h8v2H4z" fill={hairColor} />
                )}
                {hairIdx === 1 && ( // Long sides
                    <path d="M4 3h8v2H4z M4 5h1v4H4V5z M11 5h1v4h-1V5z" fill={hairColor} />
                )}
                {hairIdx === 2 && ( // Bowl cut
                    <path d="M4 3h8v3H4z" fill={hairColor} />
                )}
                {hairIdx === 3 && ( // Mohawkish
                    <path d="M7 2h2v3H7z M6 3h4v1H6z" fill={hairColor} />
                )}
            </svg>

            <style jsx>{`
        @keyframes bob-pixelated {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(2px); }
        }
        .animate-bob-pixelated {
          animation: bob-pixelated 1s infinite;
          animation-timing-function: steps(4); /* Chunky move */
        }
      `}</style>
        </div>
    );
};

export default PixelAvatar;
