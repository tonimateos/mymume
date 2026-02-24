
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

    const BASE_COLORS = [
        { main: '#FFDBAC', shadow: '#F1C27D' },
        { main: '#F1C27D', shadow: '#E0AC69' },
        { main: '#E0AC69', shadow: '#8D5524' },
        { main: '#8D5524', shadow: '#5D3A1A' },
        { main: '#C68642', shadow: '#A06E35' }
    ];

    const HAIR_COLORS = [
        { main: '#090806', light: '#2C1608' }, // blackish
        { main: '#2C1608', light: '#4E2708' }, // brown
        { main: '#B1B1B1', light: '#D6D6D6' }, // grey
        { main: '#D6B483', light: '#E7D1B1' }, // blonde
        { main: '#A56B46', light: '#C48A69' }, // ginger
        { main: '#5D3A1A', light: '#7A4D23' }  // dark brown
    ];

    const EYE_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#000000'];
    const OUTFIT_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    const GADGET_COLORS = ['#94A3B8', '#475569', '#1E293B', '#F8FAFC', '#DC2626', '#FACC15'];

    const layers = useMemo(() => {
        const baseIdx = hash % BASE_COLORS.length;
        const eyeIdx = (hash >> 2) % 6;
        const eyeColorIdx = (hash >> 4) % EYE_COLORS.length;
        const faceIdx = (hash >> 6) % 4;
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
            faceIdx,
            hairIdx,
            hair: HAIR_COLORS[hairColorIdx],
            outfitIdx,
            outfitColor: OUTFIT_COLORS[outfitColorIdx],
            gadgetIdx,
            gadgetColor: GADGET_COLORS[gadgetColorIdx]
        };
    }, [hash]);

    const { base, eyeIdx, eyeColor, faceIdx, hairIdx, hair, outfitIdx, outfitColor, gadgetIdx, gadgetColor } = layers;

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
                {/* BODY SHADOW */}
                <path d="M10 8h12v18H10z" fill={base.shadow} />
                <path d="M11 26h3v4h-3z M18 26h3v4h-3z" fill={base.shadow} />

                {/* BODY MAIN */}
                <path d="M11 8h10v18H11z" fill={base.main} />
                <path d="M11 26h2v3h-2z M18 26h2v3h-2z" fill={base.main} />

                {/* ARMS */}
                <path d="M8 10h2v8H8z" fill={base.main} />
                <path d="M22 10h2v8h-2z" fill={base.main} />
                <path d="M8 10h1v8h-1z" fill={base.shadow} opacity="0.4" />
                <path d="M23 10h1v8h-1z" fill={base.shadow} opacity="0.4" />

                {/* OUTFIT */}
                {outfitIdx === 0 && ( // T-Shirt with highlights
                    <>
                        <path d="M10 20h12v6H10z" fill={outfitColor} />
                        <path d="M8 10h2v4H8z M22 10h2v4h-2z" fill={outfitColor} />
                        <path d="M10 20h12v1H10z" fill="#fff" opacity="0.1" />
                    </>
                )}
                {outfitIdx === 1 && ( // Hoodie with depth
                    <>
                        <path d="M10 18h12v8H10z" fill={outfitColor} />
                        <path d="M8 10h2v6H8z M22 10h2v6h-2z" fill={outfitColor} />
                        <path d="M15 18h2v8h-2z" fill="#000" opacity="0.1" /> {/* Zip line */}
                        <path d="M14 18h4v1h-4z" fill="#fff" opacity="0.1" /> {/* Shoulder light */}
                    </>
                )}
                {outfitIdx === 2 && ( // Overall / Techwear
                    <>
                        <path d="M10 18h12v8H10z" fill={outfitColor} />
                        <path d="M10 18h1v8h-1z M21 18h1v8h-1z" fill="#000" opacity="0.2" /> {/* Side straps */}
                        <path d="M13 21h6v2h-6z" fill="#000" opacity="0.1" /> {/* Pocket detail */}
                    </>
                )}
                {outfitIdx === 3 && ( // Scarf / High Collar
                    <>
                        <path d="M10 18h12v8H10z" fill={outfitColor} />
                        <path d="M10 16h12v3H10z" fill={outfitColor} /> {/* Extra collar height */}
                        <path d="M10 16h12v1H10z" fill="#fff" opacity="0.1" />
                    </>
                )}

                {/* EYES LAYER [NEW] */}
                {eyeIdx === 0 && ( // Normal Detailed
                    <>
                        <rect x="12" y="12" width="3" height="3" fill="#fff" />
                        <rect x="17" y="12" width="3" height="3" fill="#fff" />
                        <rect x="13" y="13" width="2" height="2" fill={eyeColor} />
                        <rect x="18" y="13" width="2" height="2" fill={eyeColor} />
                        <rect x="14" y="13" width="1" height="1" fill="#fff" opacity="0.6" />
                        <rect x="19" y="13" width="1" height="1" fill="#fff" opacity="0.6" />
                    </>
                )}
                {eyeIdx === 1 && ( // Winking
                    <>
                        <rect x="12" y="12" width="3" height="3" fill="#fff" />
                        <path d="M17 14h3v1h-3z" fill="#000" opacity="0.5" /> {/* Closed eye */}
                        <rect x="13" y="13" width="2" height="2" fill={eyeColor} />
                        <rect x="14" y="13" width="1" height="1" fill="#fff" opacity="0.6" />
                    </>
                )}
                {eyeIdx === 2 && ( // Sunglasses
                    <>
                        <path d="M11 12h10v4H11z" fill="#1e1e1e" />
                        <path d="M11 12h10v1H11z" fill="#fff" opacity="0.1" /> {/* Shine */}
                        <path d="M12 13h3v2h-3z M17 13h3v2h-3z" fill="#000" /> {/* Lens depth */}
                    </>
                )}
                {eyeIdx === 3 && ( // Robot / Cyber
                    <>
                        <rect x="12" y="13" width="3" height="2" fill={eyeColor} fillOpacity="0.3" />
                        <rect x="17" y="13" width="3" height="2" fill={eyeColor} fillOpacity="0.3" />
                        <rect x="13" y="13" width="1" height="1" fill={eyeColor} />
                        <rect x="18" y="13" width="1" height="1" fill={eyeColor} />
                        <rect x="11" y="14" width="10" height="1" fill={eyeColor} opacity="0.2" /> {/* Scanner line */}
                    </>
                )}
                {eyeIdx === 4 && ( // Angry / Determined
                    <>
                        <path d="M12 11l3 1v2h-3z M17 12l3-1v3h-3z" fill="#fff" />
                        <path d="M11 11l4 1 M17 12l4-1" stroke="#000" strokeWidth="1" strokeOpacity="0.4" /> {/* Eyebrows */}
                        <rect x="13" y="13" width="1" height="1" fill={eyeColor} />
                        <rect x="18" y="13" width="1" height="1" fill={eyeColor} />
                    </>
                )}
                {eyeIdx === 5 && ( // Sleepy / Bored
                    <>
                        <rect x="12" y="13" width="3" height="1" fill="#fff" />
                        <rect x="17" y="13" width="3" height="1" fill="#fff" />
                        <rect x="13" y="13" width="1" height="1" fill={eyeColor} />
                        <rect x="18" y="13" width="1" height="1" fill={eyeColor} />
                        <path d="M12 12h3v1h-3z M17 12h3v1h-3z" fill="#000" opacity="0.2" /> {/* Lids */}
                    </>
                )}

                {/* FACE (Mouths) */}
                {faceIdx === 0 && <path d="M14 20h4v1h-4z" fill="#000" opacity="0.3" />} {/* Neutral */}
                {faceIdx === 1 && <path d="M13 20h1v1h4v-1h1v2h-6z" fill="#000" opacity="0.4" />} {/* Big Smile */}
                {faceIdx === 2 && <path d="M15 20h2v1h-2z" fill="#000" opacity="0.5" />} {/* Small mouth */}
                {faceIdx === 3 && <path d="M14 21h4v1h-4z" fill="#000" opacity="0.2" />} {/* Lower mouth */}

                {/* HAIR */}
                {hairIdx === 0 && ( // Spiky with highlights
                    <>
                        <path d="M10 6h12v5H10z" fill={hair.main} />
                        <path d="M11 5h2v1h-2z M15 5h2v1h-2z M19 5h2v1h-2z" fill={hair.light} />
                    </>
                )}
                {hairIdx === 1 && ( // Long Flowing
                    <>
                        <path d="M10 6h12v4H10z" fill={hair.main} />
                        <path d="M9 10h2v10H9z M21 10h2v10h-2z" fill={hair.main} />
                        <path d="M11 6h10v1H11z" fill={hair.light} opacity="0.3" />
                    </>
                )}
                {hairIdx === 2 && ( // Afro / Volume
                    <>
                        <circle cx="16" cy="11" r="7" fill={hair.main} />
                        <circle cx="16" cy="11" r="5" fill={hair.light} opacity="0.1" />
                    </>
                )}
                {hairIdx === 3 && ( // Side swept
                    <>
                        <path d="M9 6h14v4H9z" fill={hair.main} />
                        <path d="M9 10h4v5H9z" fill={hair.main} />
                        <path d="M14 6h9v1h-9z" fill={hair.light} opacity="0.4" />
                    </>
                )}
                {hairIdx === 4 && ( // Top-knot / Mohawk
                    <>
                        <path d="M14 2h4v8h-4z" fill={hair.main} />
                        <path d="M13 10h6v1h-6z" fill={hair.main} />
                        <path d="M15 2h2v4h-2z" fill={hair.light} opacity="0.3" />
                    </>
                )}

                {/* GADGETS */}
                {gadgetIdx === 1 && ( // Tech Headphones
                    <>
                        <path d="M10 5h12v2h-12z" fill={gadgetColor} />
                        <path d="M8 12h3v7H8z M21 12h3v7h-3z" fill={gadgetColor} />
                        <path d="M8 13h1v5H8z M23 13h1v5h-1z" fill="#fff" opacity="0.2" />
                    </>
                )}
                {gadgetIdx === 2 && ( // Shoulder Radio
                    <>
                        <path d="M3 21h7v8H3z" fill={gadgetColor} />
                        <rect x="4" y="23" width="2" height="2" fill="#000" opacity="0.3" />
                        <rect x="7" y="23" width="2" height="2" fill="#000" opacity="0.3" />
                        <path d="M4 20h5v1H4z" fill="#000" opacity="0.2" />
                    </>
                )}
                {gadgetIdx === 3 && ( // Musical Core (Glowing Note)
                    <>
                        <path d="M25 5h4v2h-2v4h2v2h-4V5z" fill={gadgetColor} className="animate-pulse" />
                        <path d="M26 6h1v1h-1z" fill="#fff" opacity="0.5" />
                    </>
                )}
                {gadgetIdx === 4 && ( // Data Watch / Pip-boy style
                    <>
                        <rect x="22" y="14" width="3" height="4" fill={gadgetColor} />
                        <rect x="23" y="15" width="1" height="2" fill="#4ade80" />
                    </>
                )}
                {gadgetIdx === 5 && ( // Floating Synth Cubes
                    <>
                        <rect x="4" y="4" width="2" height="2" fill={gadgetColor} />
                        <rect x="26" y="20" width="2" height="2" fill={gadgetColor} />
                        <rect x="4" y="24" width="2" height="2" fill={gadgetColor} opacity="0.5" />
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
