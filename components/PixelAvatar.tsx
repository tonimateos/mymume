
import React, { useMemo } from 'react';

interface PixelAvatarProps {
    seed: string;
    size?: number;
    className?: string;
}

const BASE_COLORS = [
    { main: '#FFDBAC', shadow: '#F1C27D', highlight: '#FFE4C4' },
    { main: '#F1C27D', shadow: '#E0AC69', highlight: '#F5D0A9' },
    { main: '#E0AC69', shadow: '#8D5524', highlight: '#E7BD8B' },
    { main: '#8D5524', shadow: '#5D3A1A', highlight: '#A5734D' },
    { main: '#C68642', shadow: '#A06E35', highlight: '#D99F66' }
];

const HAIR_COLORS = [
    { main: '#090806', shadow: '#000000', highlight: '#2C1608' },
    { main: '#2C1608', shadow: '#1A0D05', highlight: '#4E2708' },
    { main: '#B1B1B1', shadow: '#8A8A8A', highlight: '#D6D6D6' },
    { main: '#D6B483', shadow: '#BFA173', highlight: '#E7D1B1' },
    { main: '#A56B46', shadow: '#8B5A3E', highlight: '#C48A69' }
];

const EYE_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#000000'];
const OUTFIT_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
const GADGET_COLORS = ['#94A3B8', '#475569', '#1E293B', '#F8FAFC', '#DC2626', '#FACC15'];

const PixelAvatar: React.FC<PixelAvatarProps> = ({ seed, size = 64, className = "" }) => {
    const hash = useMemo(() => {
        let h = 0;
        for (let i = 0; i < seed.length; i++) {
            h = (h << 5) - h + seed.charCodeAt(i);
            h |= 0;
        }
        return Math.abs(h);
    }, [seed]);

    const layers = useMemo(() => {
        const baseIdx = hash % BASE_COLORS.length;
        const eyeIdx = (hash >> 2) % 6;
        const eyeColorIdx = (hash >> 4) % EYE_COLORS.length;
        const hairIdx = (hash >> 8) % 5;
        const hairColorIdx = (hash >> 10) % HAIR_COLORS.length;
        const outfitIdx = (hash >> 12) % 4;
        const outfitColorIdx = (hash >> 14) % OUTFIT_COLORS.length;
        const gadgetIdx = (hash >> 16) % 6;
        const gadgetColorIdx = (hash >> 18) % GADGET_COLORS.length;

        return {
            base: BASE_COLORS[baseIdx],
            eyeIdx,
            eyeColor: EYE_COLORS[eyeColorIdx],
            hairIdx,
            hair: HAIR_COLORS[hairColorIdx],
            outfitIdx,
            outfitColor: OUTFIT_COLORS[outfitColorIdx],
            gadgetIdx,
            gadgetColor: GADGET_COLORS[gadgetColorIdx]
        };
    }, [hash]);

    const { base, eyeIdx, eyeColor, hairIdx, hair, outfitIdx, outfitColor, gadgetIdx, gadgetColor } = layers;

    return (
        <div
            className={`relative inline-block overflow-hidden ${className}`}
            style={{ width: size, height: size, imageRendering: 'pixelated' }}
        >
            <svg
                viewBox="0 0 64 64"
                className="w-full h-full animate-bob-pixelated"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* 64x64 ULTRA-HD PIXEL ART BASE */}
                {/* BODY SHADOW DEPTH */}
                <path d="M22 14h24v32H22z" fill={base.shadow} />
                <path d="M24 48h4v8h-4z M36 48h4v8h-4z" fill={base.shadow} />

                {/* BODY MAIN */}
                <path d="M23 14h20v32H23z" fill={base.main} />
                <path d="M24 48h3v7h-3z M36 48h3v7h-3z" fill={base.main} />

                {/* HIGHLIGHTS / RIM LIGHT */}
                <path d="M23 14h1v32h-1z M23 14h20v1h-20z" fill={base.highlight} opacity="0.4" />

                {/* ARMS (64x64 detail) */}
                <path d="M18 18h4v16h-4z" fill={base.main} /> {/* L Arm */}
                <path d="M42 18h4v16h-4z" fill={base.main} /> {/* R Arm */}
                <path d="M18 18h1v16h-1z" fill={base.highlight} opacity="0.3" />
                <path d="M45 18h1v16h-1z" fill={base.shadow} opacity="0.3" />

                {/* HAIR (64x64) */}
                {hairIdx === 0 && ( // Spiky Ultra
                    <>
                        <path d="M22 10h20v8H22z" fill={hair.main} />
                        <path d="M23 8h2v2h-2z M27 6h3v4h-3z M33 6h3v4h-3z" fill={hair.main} />
                        <path d="M22 10h20v1H22z" fill={hair.highlight} opacity="0.4" />
                        <path d="M22 17h20v1H22z" fill={hair.shadow} opacity="0.4" />
                    </>
                )}
                {hairIdx === 1 && ( // Long Voluminous
                    <>
                        <path d="M20 10h24v8H20z" fill={hair.main} />
                        <path d="M20 18h4v20h-4z M40 18h4v20h-4z" fill={hair.main} />
                        <path d="M20 10h1v28h-1z" fill={hair.highlight} opacity="0.3" />
                        <path d="M43 10h1v28h-1z" fill={hair.shadow} opacity="0.3" />
                    </>
                )}
                {hairIdx === 2 && ( // Pompadour High Def
                    <>
                        <path d="M20 6h24v12H20z" fill={hair.main} />
                        <path d="M21 4h22v2H21z" fill={hair.main} />
                        <path d="M20 6h24v2H20z" fill={hair.highlight} opacity="0.4" />
                        <path d="M20 16h24v2H20z" fill={hair.shadow} opacity="0.4" />
                    </>
                )}
                {hairIdx === 3 && ( // Side swept Flow
                    <>
                        <path d="M18 10h28v8H18z" fill={hair.main} />
                        <path d="M18 18h8v10h-8z" fill={hair.main} />
                        <path d="M18 10h28v2H18z" fill={hair.highlight} opacity="0.3" />
                        <path d="M25 18h1v10h-1z" fill={hair.shadow} opacity="0.2" />
                    </>
                )}
                {hairIdx === 4 && ( // Top-knot Technical
                    <>
                        <path d="M28 2h8v12h-8z" fill={hair.main} />
                        <path d="M26 10h12v4H26z" fill={hair.main} />
                        <path d="M28 2h1v12h-1z" fill={hair.highlight} opacity="0.3" />
                    </>
                )}

                {/* EYES (64x64 Detail Pass) */}
                {eyeIdx === 0 && ( // HD Normal
                    <>
                        <rect x="25" y="22" width="6" height="6" fill="#fff" />
                        <rect x="35" y="22" width="6" height="6" fill="#fff" />
                        <rect x="26" y="23" width="4" height="4" fill={eyeColor} />
                        <rect x="36" y="23" width="4" height="4" fill={eyeColor} />
                        <rect x="27" y="23" width="1" height="1" fill="#fff" opacity="0.8" />
                        <rect x="37" y="23" width="1" height="1" fill="#fff" opacity="0.8" />
                    </>
                )}
                {eyeIdx === 1 && ( // HD Winking
                    <>
                        <rect x="25" y="22" width="6" height="6" fill="#fff" />
                        <rect x="26" y="23" width="4" height="4" fill={eyeColor} />
                        <path d="M35 25h6v2h-6z" fill="#000" opacity="0.5" />
                        <rect x="27" y="23" width="1" height="1" fill="#fff" opacity="0.8" />
                    </>
                )}
                {eyeIdx === 2 && ( // HD Sunglasses
                    <>
                        <path d="M22 22h20v6H22z" fill="#1a1a1a" />
                        <path d="M23 23h18v1H23z" fill="#fff" opacity="0.15" />
                        <rect x="24" y="24" width="6" height="3" fill="#000" />
                        <rect x="34" y="24" width="6" height="3" fill="#000" />
                    </>
                )}
                {eyeIdx === 3 && ( // Cyber visor
                    <>
                        <rect x="23" y="22" width="18" height="6" fill={eyeColor} fillOpacity="0.2" />
                        <path d="M23 22h18v1H23z" fill={eyeColor} />
                        <rect x="25" y="24" width="2" height="2" fill={eyeColor} />
                        <rect x="37" y="24" width="2" height="2" fill={eyeColor} />
                        <path d="M23 25h18v1H23z" fill={eyeColor} opacity="0.1" className="animate-pulse" />
                    </>
                )}
                {eyeIdx === 4 && ( // Determined HD
                    <>
                        <path d="M25 21l3 1v4h-3z M36 22l3-1v4h-3z" fill="#fff" />
                        <rect x="26" y="23" width="2" height="2" fill={eyeColor} />
                        <rect x="37" y="23" width="2" height="2" fill={eyeColor} />
                        <path d="M24 20l4 1 M36 21l4-1" stroke="#000" strokeWidth="1" strokeOpacity="0.5" />
                    </>
                )}
                {eyeIdx === 5 && ( // Bored HD
                    <>
                        <rect x="25" y="24" width="6" height="2" fill="#fff" />
                        <rect x="35" y="24" width="6" height="2" fill="#fff" />
                        <rect x="27" y="24" width="2" height="2" fill={eyeColor} />
                        <rect x="37" y="24" width="2" height="2" fill={eyeColor} />
                        <path d="M25 22h6v2h-6z M35 22h6v2h-6z" fill="#000" opacity="0.2" />
                    </>
                )}

                {/* OUTFIT (64x64 HD Textures) */}
                {outfitIdx === 0 && ( // HD Tee
                    <>
                        <path d="M22 36h20v10H22z" fill={outfitColor} />
                        <path d="M18 18h4v8h-4z M42 18h4v8h-4z" fill={outfitColor} />
                        <path d="M22 36h20v2H22z" fill="#fff" opacity="0.1" />
                        <path d="M22 44h20v2H22z" fill="#000" opacity="0.1" />
                    </>
                )}
                {outfitIdx === 1 && ( // HD Hoodie
                    <>
                        <path d="M22 34h20v12H22z" fill={outfitColor} />
                        <path d="M18 18h4v12h-4z M42 18h4v12h-4z" fill={outfitColor} />
                        <path d="M30 34h4v12h-4z" fill="#000" opacity="0.1" /> {/* Zip */}
                        <path d="M22 34h20v1H22z" fill="#fff" opacity="0.1" />
                    </>
                )}
                {outfitIdx === 2 && ( // HD Tactical
                    <>
                        <path d="M22 34h20v12H22z" fill={outfitColor} />
                        <path d="M22 34h2v12h-2z M40 34h2v12h-2z" fill="#000" opacity="0.3" />
                        <rect x="28" y="38" width="8" height="4" fill="#000" opacity="0.1" />
                        <path d="M28 38h8v1h-8z" fill="#fff" opacity="0.1" />
                    </>
                )}
                {outfitIdx === 3 && ( // HD Tech Scarf
                    <>
                        <path d="M22 32h20v14H22z" fill={outfitColor} />
                        <path d="M22 32h20v5H22z" fill="#fff" opacity="0.2" />
                        <path d="M22 32h20v1H22z" fill="#fff" opacity="0.2" />
                        <path d="M22 36h20v1H22z" fill="#000" opacity="0.1" />
                    </>
                )}

                {/* GADGETS (64x64 HD Detail) */}
                {gadgetIdx === 1 && ( // HD Pro Headphones
                    <>
                        <path d="M20 10h24v4H20z" fill={gadgetColor} />
                        <path d="M17 24h6v12h-6z M41 24h6v12h-6z" fill={gadgetColor} />
                        <path d="M17 24h1v12h-1z" fill="#fff" opacity="0.3" />
                        <circle cx="20" cy="30" r="1.5" fill="#000" opacity="0.2" />
                        <circle cx="44" cy="30" r="1.5" fill="#000" opacity="0.2" />
                    </>
                )}
                {gadgetIdx === 2 && ( // HD Boombox
                    <>
                        <path d="M4 44h14v14H4z" fill={gadgetColor} />
                        <path d="M5 42h12v2H5z" fill="#000" opacity="0.3" /> {/* Handle */}
                        <circle cx="8" cy="49" r="2.5" fill="#000" opacity="0.4" />
                        <circle cx="14" cy="49" r="2.5" fill="#000" opacity="0.4" />
                        <rect x="8" y="54" width="6" height="2" fill="#000" opacity="0.2" />
                    </>
                )}
                {gadgetIdx === 3 && ( // Glowing Melody Note
                    <g className="animate-pulse">
                        <path d="M50 10h8v4h-4v8h4v4h-8V10z" fill={gadgetColor} />
                        <path d="M51 11h1v1h-1z" fill="#fff" opacity="0.6" />
                    </g>
                )}
                {gadgetIdx === 4 && ( // HD Wrist Device
                    <>
                        <path d="M46 28h6v8h-6z" fill={gadgetColor} />
                        <rect x="47" y="30" width="4" height="4" fill="#22c55e" opacity="0.4" />
                        <path d="M47 30h4v1h-4z" fill="#fff" opacity="0.3" />
                    </>
                )}
                {gadgetIdx === 5 && ( // Orbiting Synth Cubes
                    <g className="animate-pulse">
                        <rect x="8" y="8" width="4" height="4" fill={gadgetColor} />
                        <rect x="52" y="40" width="4" height="4" fill={gadgetColor} />
                        <rect x="8" y="52" width="4" height="4" fill={gadgetColor} opacity="0.5" />
                    </g>
                )}
            </svg>

            <style jsx>{`
                @keyframes bob-pixelated {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(2px); }
                }
                .animate-bob-pixelated {
                    animation: bob-pixelated 1.2s infinite;
                    animation-timing-function: steps(8); /* More fluid but still chunky */
                }
            `}</style>
        </div>
    );
};

export default PixelAvatar;
