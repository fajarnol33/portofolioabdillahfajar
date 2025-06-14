// app/page.tsx
'use client';

import { Suspense, lazy, useState, useEffect } from 'react';
import Image, { ImageLoaderProps } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaGithub, FaLinkedin, FaLink } from 'react-icons/fa';
import AnimatedDivider from '@/components/AnimatedDivider';
import { createClient } from '@/utils/supabase/client';
import TypewriterEffect from '@/components/TypewriterEffect';
import HeroMathGraph from '@/components/HeroMathGraph';
import { fadeIn, staggerContainer, bounceIn, zoomIn } from '@/utils/motion';

// ... (interface definitions)
interface MediaItem {
  type: 'image' | 'video';
  url: string;
}
interface Experience {
  id: string;
  title: string;
  company: string;
  year_start: string;
  year_end: string;
  description: string;
}
interface Karya {
  id: string;
  title: string;
  description: string;
  longDesc: string;
  tools: string[];
  media: MediaItem[];
}
interface Skill {
  id: string;
  name: string;
  level: number;
}
interface SocialLink {
  name: string;
  url: string;
}
interface SiteSettings {
  id: number;
  gradient_titles: string;
  profile_description: string;
  profile_photo_url: string;
  about_description: string;
  about_photo_url: string;
  cv_url: string;
  social_links: SocialLink[];
}
interface PageData {
  settings: SiteSettings;
  experiences: Experience[];
  karya: Karya[];
  skills: Skill[];
}

const getSocialIcon = (name: string) => {
  if (!name) return <FaLink size={30} />;
  const lowerName = name.toLowerCase();
  if (lowerName.includes('github')) return <FaGithub size={30} />;
  if (lowerName.includes('linkedin')) return <FaLinkedin size={30} />;
  if (lowerName.includes('instagram')) return <FaInstagram size={30} />;
  return <FaLink size={30} />;
};

const ProjectModal = lazy(() => import('@/components/ProjectModal'));
const ModalLoading = () => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999]">
    <p>Loading project...</p>
  </div>
);

const defaultData: PageData = {
  settings: {
    id: 0,
    gradient_titles: 'Judul Belum Diatur',
    profile_description: 'Deskripsi profil belum diatur di halaman admin.',
    profile_photo_url: '/placeholder.svg',
    about_description:
      'Deskripsi "Tentang Saya" belum diatur di halaman admin.',
    about_photo_url: '/placeholder.svg',
    cv_url: '#',
    social_links: [],
  },
  experiences: [],
  karya: [],
  skills: [],
};

const supabaseImageLoader = ({ src }: ImageLoaderProps) => {
  return src;
};

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Karya | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<PageData>(defaultData);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const supabase = createClient();
      try {
        const { data: settings, error: settingsError } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
        const { data: experiences, error: expError } = await supabase
          .from('experience')
          .select('*')
          .order('created_at', { ascending: false });
        const { data: karya, error: karyaError } = await supabase
          .from('karya')
          .select('id, title, description, longDesc, tools, media')
          .order('created_at', { ascending: false });
        const { data: skills, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .order('created_at', { ascending: false });

        if (settingsError) throw settingsError;
        if (expError) throw expError;
        if (karyaError) throw karyaError;
        if (skillsError) throw skillsError;

        const sanitizedKarya = (karya || []).map((k) => ({
          ...k,
          media: Array.isArray(k.media) ? k.media : [],
        }));

        setPageData({
          settings: settings || defaultData.settings,
          experiences: experiences || [],
          karya: sanitizedKarya,
          skills: skills || [],
        });
      } catch (error) {
        console.error('Gagal mengambil data dari Supabase:', error);
        setPageData(defaultData);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const { settings, experiences, karya, skills } = pageData;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-dark text-white">
        Memuat data...
      </div>
    );
  }

  return (
    <div className="text-white font-sans relative z-10 overflow-x-hidden">
      <nav className="w-full backdrop-blur-md bg-custom-dark/50 border-b border-white/10 px-4 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="text-xl font-bold">Abdillah Fajar</div>
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#beranda"
              className="hover:text-cyan-400 transition-colors"
            >
              Beranda
            </a>
            <a
              href="#tentang"
              className="hover:text-cyan-400 transition-colors"
            >
              Tentang
            </a>
            <a
              href="#pengalaman"
              className="hover:text-cyan-400 transition-colors"
            >
              Pengalaman
            </a>
            <a href="#karya" className="hover:text-cyan-400 transition-colors">
              Karya
            </a>
            <a href="#skill" className="hover:text-cyan-400 transition-colors">
              Skill
            </a>
            <a href="#kontak" className="hover:text-cyan-400 transition-colors">
              Kontak
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 md:px-10">
        <section
          id="beranda"
          className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-center gap-10 pt-32"
        >
          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            animate="show"
            className="md:w-1/2 flex flex-col"
          >
            <Suspense fallback={<div className="w-full h-64" />}>
              <motion.div
                variants={fadeIn('down')}
                className="w-full max-w-lg mx-auto md:mx-0"
              >
                <HeroMathGraph />
              </motion.div>
              <div className="text-center md:text-left">
                <TypewriterEffect
                  sequence={settings.gradient_titles
                    .split('\n')
                    .filter(Boolean)
                    .flatMap((text) => [text, 4000])}
                />
              </div>
            </Suspense>
            {/* --- START OF FIX --- */}
            <motion.p
              variants={fadeIn('up')}
              className="border border-white/10 p-4 rounded-md mt-6 bg-white/5 text-justify"
            >
              {/* Kelas text-center dan md:text-left dihapus agar text-justify berlaku */}
              {/* --- END OF FIX --- */}
              {settings.profile_description || 'Deskripsi profil belum diatur.'}
            </motion.p>
            <motion.div
              variants={staggerContainer(0.2, 0.5)}
              initial="hidden"
              animate="show"
              className="flex items-center justify-center md:justify-start space-x-4 mt-6"
            >
              {settings.social_links.map((link) => (
                <motion.a
                  key={link.name}
                  variants={zoomIn(0, 0.5)}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getSocialIcon(link.name)}
                </motion.a>
              ))}
              <motion.a
                variants={zoomIn(0, 0.5)}
                href={settings.cv_url}
                className="ml-4 px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition-colors"
                download
              >
                Unduh CV
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div variants={zoomIn(0.2, 1)} initial="hidden" animate="show">
            <div className="w-60 h-60 md:w-72 md:h-72 relative">
              <Image
                loader={supabaseImageLoader}
                src={settings.profile_photo_url || '/placeholder.svg'}
                alt="Foto Profil Abdillah Fajar"
                fill
                className="rounded-full object-cover"
                priority
                sizes="(max-width: 768px) 240px, 288px"
              />
            </div>
          </motion.div>
        </section>

        <AnimatedDivider />

        <section
          id="tentang"
          className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-16 py-24 border border-white/10 rounded-xl p-8 bg-black/20"
        >
          <motion.div
            variants={fadeIn('right')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="flex-shrink-0"
          >
            <div className="w-60 h-80 md:w-72 md:h-96 relative">
              <Image
                loader={supabaseImageLoader}
                src={settings.about_photo_url || '/placeholder.svg'}
                alt="Foto tentang saya"
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 240px, 288px"
              />
            </div>
          </motion.div>
          <motion.div
            variants={staggerContainer(0.2, 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="md:w-1/2"
          >
            <motion.h2
              variants={fadeIn('left')}
              className="text-4xl font-semibold mb-4"
            >
              Tentang Saya
            </motion.h2>
            <motion.p
              variants={fadeIn('left', 'tween', 0.2, 0.75)}
              className="p-4 rounded-md text-gray-300 text-justify"
            >
              {settings.about_description ||
                "Deskripsi 'Tentang Saya' belum diatur."}
            </motion.p>
          </motion.div>
        </section>

        <AnimatedDivider />

        <section
          id="pengalaman"
          className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 py-24"
        >
          <div className="md:w-1/2">
            <motion.h2
              variants={bounceIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="text-4xl font-semibold mb-8 text-center md:text-left"
            >
              Pengalaman
            </motion.h2>
            <motion.div
              variants={staggerContainer(0.2, 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-6 text-center md:text-left"
            >
              {experiences.length > 0 ? (
                experiences.map((exp) => (
                  <motion.div key={exp.id} variants={fadeIn('right')}>
                    <h3 className="text-xl font-bold">{exp.title}</h3>
                    <p className="text-gray-400">
                      {exp.company} | {exp.year_start} - {exp.year_end}
                    </p>
                    <p className="text-gray-300 text-justify">
                      {exp.description}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400">
                  Belum ada data pengalaman yang ditambahkan.
                </p>
              )}
            </motion.div>
          </div>
          <motion.div
            variants={fadeIn('left')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="w-full md:w-1/2 flex items-center justify-center"
          >
            <div className="w-full max-w-md">
              <Suspense fallback={<div className="w-full h-64" />}>
                <HeroMathGraph />
              </Suspense>
            </div>
          </motion.div>
        </section>

        <AnimatedDivider />

        <section
          id="karya"
          className="min-h-screen py-24 border border-white/10 rounded-xl p-8 bg-black/20"
        >
          <motion.h2
            variants={bounceIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="text-4xl font-semibold mb-8 text-center"
          >
            Karya
          </motion.h2>
          <motion.div
            variants={staggerContainer(0.2, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {karya.length > 0 ? (
              karya.map((item) => (
                <motion.div
                  key={item.id}
                  variants={zoomIn(0, 0.5)}
                  onClick={() => setSelectedProject(item)}
                  className="bg-gray-800/50 text-white p-4 rounded-lg border border-white/10 cursor-pointer hover:border-white/30 transition-colors"
                >
                  <div className="w-full h-48 bg-gray-700 rounded-lg relative overflow-hidden">
                    {item.media && item.media.length > 0 ? (
                      <Image
                        loader={supabaseImageLoader}
                        src={
                          item.media.find((m) => m.type === 'image')?.url ||
                          '/placeholder.svg'
                        }
                        alt={`Thumbnail for ${item.title}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700"></div>
                    )}
                  </div>
                  <h4 className="font-bold mt-4">{item.title}</h4>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </motion.div>
              ))
            ) : (
              <div className="text-center col-span-full py-10">
                <p className="text-gray-500">
                  Belum ada data karya yang ditambahkan.
                </p>
              </div>
            )}
          </motion.div>
        </section>

        <AnimatedDivider />

        <section id="skill" className="min-h-screen py-24">
          <motion.h2
            variants={bounceIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="text-4xl font-semibold mb-12 text-center"
          >
            Skill
          </motion.h2>
          <motion.div
            variants={staggerContainer(0.3, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-8 max-w-2xl mx-auto"
          >
            {skills.length > 0 ? (
              skills.map((skill) => (
                <motion.div key={skill.id} variants={fadeIn('up')}>
                  <h4 className="text-lg font-semibold mb-2">{skill.name}</h4>
                  <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
                    <motion.div
                      className="h-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  Belum ada data skill yang ditambahkan.
                </p>
              </div>
            )}
          </motion.div>
        </section>

        <AnimatedDivider />

        <section
          id="kontak"
          className="min-h-screen py-24 border border-white/10 rounded-xl p-8 bg-black/20 flex flex-col items-center justify-center"
        >
          <motion.h2
            variants={bounceIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="text-4xl font-semibold mb-8 text-center"
          >
            Hubungi Saya
          </motion.h2>
          <motion.form
            action="https://formspree.io/f/YOUR_FORMSPREE_ID"
            method="POST"
            variants={staggerContainer(0.2, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="w-full max-w-lg space-y-6"
          >
            <motion.div variants={fadeIn('up')}>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Nama
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              />
            </motion.div>
            <motion.div variants={fadeIn('up')}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              />
            </motion.div>
            <motion.div variants={fadeIn('up')}>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-300"
              >
                Pesan
              </label>
              <textarea
                name="message"
                id="message"
                rows={5}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              ></textarea>
            </motion.div>
            <motion.div variants={fadeIn('up')} className="text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors font-semibold"
              >
                Kirim Pesan
              </button>
            </motion.div>
          </motion.form>
        </section>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <Suspense fallback={<ModalLoading />}>
            <ProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
