// app/admin/page.tsx
'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { createClient } from '@/utils/supabase/client';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const AddExperienceModal = lazy(() =>
  import('@/components/AddExperienceModal')
);
const AddKaryaModal = lazy(() => import('@/components/AddKaryaModal'));
const AddSkillModal = lazy(() => import('@/components/AddSkillModal'));
const ImageCropperModal = lazy(() => import('@/components/ImageCropperModal'));

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
  media: any[];
  tools: any[];
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
  intro_text: string;
  profile_description: string;
  profile_photo_url: string;
  about_description: string;
  about_photo_url: string;
  cv_url: string;
  social_links: SocialLink[];
}

const ModalLoading = () => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1002]">
    <p className="text-white">Loading Editor...</p>
  </div>
);

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [karya, setKarya] = useState<Karya[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const router = useRouter();
  const supabase = createClient();

  // State untuk Modals
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState<Experience | null>(
    null
  );
  const [isKaryaModalOpen, setIsKaryaModalOpen] = useState(false);
  const [karyaToEdit, setKaryaToEdit] = useState<Karya | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);

  // State untuk Image Cropper
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [cropperAspect, setCropperAspect] = useState(1);
  const [cropperCircular, setCropperCircular] = useState(false);
  const [cropperTarget, setCropperTarget] = useState<
    'profile' | 'about' | null
  >(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();
      setSettings(settingsData);

      const { data: expData } = await supabase
        .from('experience')
        .select('*')
        .order('created_at', { ascending: false });
      setExperiences(expData || []);

      const { data: karyaData } = await supabase
        .from('karya')
        .select('*')
        .order('created_at', { ascending: false });
      setKarya(karyaData || []);

      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false });
      setSkills(skillsData || []);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!settings) return;
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSocialLinkChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!settings) return;
    const { name, value } = e.target;
    const newLinks = [...settings.social_links];
    newLinks[index] = { ...newLinks[index], [name]: value };
    setSettings({ ...settings, social_links: newLinks });
  };

  const addSocialLink = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      social_links: [...settings.social_links, { name: '', url: '' }],
    });
  };

  const removeSocialLink = (index: number) => {
    if (!settings) return;
    const newLinks = settings.social_links.filter((_, i) => i !== index);
    setSettings({ ...settings, social_links: newLinks });
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const { error } = await supabase
      .from('site_settings')
      .update(settings)
      .eq('id', settings.id);
    if (error) alert('Gagal menyimpan pengaturan: ' + error.message);
    else alert('Pengaturan berhasil disimpan!');
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'profile' | 'about'
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setCropperSrc(reader.result as string)
      );
      reader.readAsDataURL(e.target.files[0]);

      if (target === 'profile') {
        setCropperAspect(1);
        setCropperCircular(true);
        setCropperTarget('profile');
      } else {
        setCropperAspect(3 / 4);
        setCropperCircular(false);
        setCropperTarget('about');
      }
    }
  };

  const handleCropAndUpload = async (blob: Blob) => {
    if (!cropperTarget || !settings) return;

    setIsUploading(true);
    setCropperSrc(null);

    const fileName = `${cropperTarget}-${Date.now()}.jpeg`;
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg',
      });

    if (uploadError) {
      alert('Gagal mengupload gambar: ' + uploadError.message);
      setIsUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(fileName);

    const fieldToUpdate =
      cropperTarget === 'profile' ? 'profile_photo_url' : 'about_photo_url';
    const updatedSettings = { ...settings, [fieldToUpdate]: publicUrl };

    const { error: dbError } = await supabase
      .from('site_settings')
      .update({ [fieldToUpdate]: publicUrl })
      .eq('id', settings.id);

    if (dbError) {
      alert('Gagal menyimpan URL gambar ke database: ' + dbError.message);
    } else {
      setSettings(updatedSettings);
      alert('Foto berhasil diperbarui!');
    }
    setIsUploading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDelete = async (table: string, id: string) => {
    if (confirm(`Anda yakin ingin menghapus item ini?`)) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) alert('Gagal menghapus: ' + error.message);
      else fetchData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading Admin Panel...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <div>
            <a
              href="/"
              target="_blank"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            >
              <FaEye className="inline-block mr-2" />
              Lihat Situs
            </a>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              <FaSignOutAlt className="inline-block mr-2" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Pengaturan Situs</h2>
          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="intro_text"
                className="block text-sm font-medium mb-1"
              >
                Teks Intro (pisahkan dengan baris baru untuk efek animasi)
              </label>
              <textarea
                id="intro_text"
                name="intro_text"
                rows={3}
                value={settings?.intro_text || ''}
                onChange={handleSettingsChange}
                className="w-full bg-gray-700 rounded-md p-2"
              />
            </div>
            <div>
              <label
                htmlFor="gradient_titles"
                className="block text-sm font-medium mb-1"
              >
                Judul Gradien di Beranda (pisahkan dengan baris baru)
              </label>
              <textarea
                name="gradient_titles"
                id="gradient_titles"
                rows={4}
                value={settings?.gradient_titles || ''}
                onChange={handleSettingsChange}
                className="w-full bg-gray-700 rounded-md p-2"
              />
            </div>
            <div>
              <label
                htmlFor="profile_description"
                className="block text-sm font-medium mb-1"
              >
                Deskripsi Profil
              </label>
              <textarea
                name="profile_description"
                id="profile_description"
                rows={4}
                value={settings?.profile_description || ''}
                onChange={handleSettingsChange}
                className="w-full bg-gray-700 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Foto Profil
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 'profile')}
                className="w-full bg-gray-700 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
              <p className="text-xs text-gray-400 mt-1">
                (Disarankan rasio 1:1, akan dipotong menjadi bulat)
              </p>
              {settings?.profile_photo_url && (
                <img
                  src={settings.profile_photo_url}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full mt-2 object-cover"
                />
              )}
            </div>
            <div>
              <label
                htmlFor="about_description"
                className="block text-sm font-medium mb-1"
              >
                Deskripsi Tentang Saya
              </label>
              <textarea
                name="about_description"
                id="about_description"
                rows={6}
                value={settings?.about_description || ''}
                onChange={handleSettingsChange}
                className="w-full bg-gray-700 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Foto Tentang Saya
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 'about')}
                className="w-full bg-gray-700 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              />
              <p className="text-xs text-gray-400 mt-1">
                (Disarankan rasio 3:4 atau vertikal)
              </p>
              {settings?.about_photo_url && (
                <img
                  src={settings.about_photo_url}
                  alt="About preview"
                  className="w-24 h-32 mt-2 rounded-lg object-cover"
                />
              )}
            </div>
            <div>
              <label
                htmlFor="cv_url"
                className="block text-sm font-medium mb-1"
              >
                URL Google Drive untuk CV (Pastikan "anyone with the link can
                view")
              </label>
              <input
                type="url"
                name="cv_url"
                id="cv_url"
                value={settings?.cv_url || ''}
                onChange={handleSettingsChange}
                className="w-full bg-gray-700 rounded-md p-2"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Link Sosial Media</h3>
              {settings?.social_links.map((link, index) => (
                <div key={index} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama (e.g., GitHub)"
                    value={link.name}
                    onChange={(e) => handleSocialLinkChange(index, e)}
                    className="w-1/3 bg-gray-700 p-2 rounded"
                  />
                  <input
                    type="url"
                    name="url"
                    placeholder="URL Lengkap"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, e)}
                    className="w-2/3 bg-gray-700 p-2 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="bg-red-800 p-2 rounded hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSocialLink}
                className="text-sm bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded"
              >
                <FaPlus className="inline-block mr-1" /> Tambah Link
              </button>
            </div>
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
            >
              Simpan Pengaturan
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Pengalaman</h2>
              <button
                onClick={() => {
                  setExperienceToEdit(null);
                  setIsExperienceModalOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded"
              >
                <FaPlus />
              </button>
            </div>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-gray-700 p-3 rounded-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{exp.title}</h3>
                    <p className="text-sm text-gray-400">{exp.company}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setExperienceToEdit(exp);
                        setIsExperienceModalOpen(true);
                      }}
                      className="p-2 bg-blue-600 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete('experience', exp.id)}
                      className="p-2 bg-red-600 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Karya</h2>
              <button
                onClick={() => {
                  setKaryaToEdit(null);
                  setIsKaryaModalOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded"
              >
                <FaPlus />
              </button>
            </div>
            <div className="space-y-4">
              {karya.map((k) => (
                <div
                  key={k.id}
                  className="bg-gray-700 p-3 rounded-md flex justify-between items-center"
                >
                  <h3 className="font-bold">{k.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setKaryaToEdit(k);
                        setIsKaryaModalOpen(true);
                      }}
                      className="p-2 bg-blue-600 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete('karya', k.id)}
                      className="p-2 bg-red-600 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Skill</h2>
              <button
                onClick={() => {
                  setSkillToEdit(null);
                  setIsSkillModalOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded"
              >
                <FaPlus />
              </button>
            </div>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-gray-700 p-3 rounded-md flex justify-between items-center"
                >
                  <h3 className="font-bold">{skill.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSkillToEdit(skill);
                        setIsSkillModalOpen(true);
                      }}
                      className="p-2 bg-blue-600 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete('skills', skill.id)}
                      className="p-2 bg-red-600 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<ModalLoading />}>
        {isExperienceModalOpen && (
          <AddExperienceModal
            isOpen={isExperienceModalOpen}
            onClose={() => setIsExperienceModalOpen(false)}
            onSuccess={fetchData}
            experienceToEdit={experienceToEdit}
          />
        )}
        {isKaryaModalOpen && (
          <AddKaryaModal
            isOpen={isKaryaModalOpen}
            onClose={() => setIsKaryaModalOpen(false)}
            onSuccess={fetchData}
            karyaToEdit={karyaToEdit}
          />
        )}
        {isSkillModalOpen && (
          <AddSkillModal
            isOpen={isSkillModalOpen}
            onClose={() => setIsSkillModalOpen(false)}
            onSuccess={fetchData}
            skillToEdit={skillToEdit}
          />
        )}
        {cropperSrc && (
          <ImageCropperModal
            src={cropperSrc}
            aspect={cropperAspect}
            circularCrop={cropperCircular}
            onClose={() => setCropperSrc(null)}
            onCropComplete={handleCropAndUpload}
          />
        )}
      </Suspense>

      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1003]">
          <div className="bg-white text-black p-4 rounded-lg">
            Uploading... Please wait.
          </div>
        </div>
      )}
    </div>
  );
}
