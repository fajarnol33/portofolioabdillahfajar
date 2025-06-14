// components/ParticleBackground.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { type ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim'; // loadSlim adalah versi ringan, cocok untuk partikel simpel

const ParticleBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // Inisialisasi engine tsparticles dengan paket slim
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: '#191819', // Warna background, samakan dengan bg-custom-dark Anda
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'repulse', // Partikel akan menjauh saat didekati mouse
          },
        },
        modes: {
          repulse: {
            distance: 80,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: '#ffffff', // Warna partikel
        },
        links: {
          enable: false, // Kita tidak menggunakan garis penghubung agar terlihat bersih
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'out',
          },
          random: false,
          speed: 0.5, // Kecepatan gerak partikel
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 60, // Jumlah partikel
        },
        opacity: {
          value: 0.3, // Transparansi partikel
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 3 }, // Ukuran partikel akan random antara 1px dan 3px
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={options}
        className="fixed top-0 left-0 w-full h-full -z-10" // Class ini membuat background tetap di belakang konten lain
      />
    );
  }

  return <></>;
};

export default ParticleBackground;
