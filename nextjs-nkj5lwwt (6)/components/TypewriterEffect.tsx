'use client';
import { TypeAnimation } from 'react-type-animation';

// Kita ubah komponen ini untuk menerima 'sequence' sebagai properti (props)
interface TypewriterEffectProps {
  sequence: (string | number)[];
}

const TypewriterEffect = ({ sequence }: TypewriterEffectProps) => {
  // Jika sequence kosong, tampilkan judul default
  const displaySequence =
    sequence && sequence.length > 0 ? sequence : ['Judul Belum Diatur', 2000];

  return (
    <TypeAnimation
      sequence={displaySequence}
      wrapper="h1"
      speed={50}
      className="text-4xl md:text-5xl font-bold !leading-tight h-auto min-h-[3rem] md:min-h-[3.5rem] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
      repeat={Infinity}
    />
  );
};

export default TypewriterEffect;