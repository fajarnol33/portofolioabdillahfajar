// components/AddKaryaModal.tsx
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import { FaTrash, FaPlus } from 'react-icons/fa';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface Karya {
  id: string;
  title: string;
  description: string;
  longDesc: string;
  media: MediaItem[];
  tools: string[] | string; // Izinkan tools bisa string atau array
}

interface AddKaryaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  karyaToEdit?: Karya | null;
}

export default function AddKaryaModal({
  isOpen,
  onClose,
  onSuccess,
  karyaToEdit,
}: AddKaryaModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [tools, setTools] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      if (karyaToEdit) {
        setTitle(karyaToEdit.title);
        setDescription(karyaToEdit.description);
        setLongDesc(karyaToEdit.longDesc || '');
        setMedia(karyaToEdit.media || []);

        // --- START OF FIX ---
        // Logika ini sekarang bisa menangani 'tools' baik sebagai array maupun string
        let toolsString = '';
        if (Array.isArray(karyaToEdit.tools)) {
          // Jika data sudah benar (array), gabungkan menjadi string
          toolsString = karyaToEdit.tools.join(', ');
        } else if (typeof karyaToEdit.tools === 'string') {
          // Jika data ternyata string, langsung gunakan
          toolsString = karyaToEdit.tools;
        }
        setTools(toolsString);
        // --- END OF FIX ---
      } else {
        // Reset form untuk entri baru
        setTitle('');
        setDescription('');
        setLongDesc('');
        setMedia([]);
        setTools('');
        setError('');
      }
    }
  }, [isOpen, karyaToEdit]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

    setIsUploading(true);
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, file);

    if (uploadError) {
      setError('Gagal upload gambar: ' + uploadError.message);
      setIsUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(fileName);
    setMedia([...media, { type: 'image', url: publicUrl }]);
    setIsUploading(false);
  };

  const addVideoUrl = () => {
    const url = prompt('Masukkan URL video (YouTube, GDrive, dll):');
    if (url) {
      setMedia([...media, { type: 'video', url }]);
    }
  };

  const removeMediaItem = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (media.length === 0) {
      setError('Harap tambahkan setidaknya satu gambar atau video.');
      setIsSubmitting(false);
      return;
    }

    // Logika ini sudah benar, mengubah string dari input menjadi array untuk disimpan
    const toolsArray = tools
      .split(',')
      .map((tool) => tool.trim())
      .filter(Boolean);

    const karyaData = {
      title,
      description,
      longDesc,
      media,
      tools: toolsArray,
    };

    const { error: actionError } = karyaToEdit
      ? await supabase.from('karya').update(karyaData).eq('id', karyaToEdit.id)
      : await supabase.from('karya').insert([karyaData]);

    if (actionError) {
      setError('Gagal menyimpan data: ' + actionError.message);
    } else {
      onSuccess();
      onClose();
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-custom-dark text-white border border-white/10 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {karyaToEdit ? 'Edit Karya' : 'Tambah Karya Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Judul Karya"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 rounded-md p-2"
            required
          />
          <textarea
            placeholder="Deskripsi Singkat (untuk kartu)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full bg-gray-800 rounded-md p-2"
            required
          />
          <textarea
            placeholder="Deskripsi Panjang (untuk popup detail)"
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            rows={5}
            className="w-full bg-gray-800 rounded-md p-2"
          />
          <input
            type="text"
            placeholder="Tools (pisahkan dengan koma)"
            value={tools}
            onChange={(e) => setTools(e.target.value)}
            className="w-full bg-gray-800 rounded-md p-2"
          />

          <div className="space-y-3">
            <h3 className="font-semibold">Media (Gambar & Video)</h3>
            {media.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="p-2 bg-gray-700 rounded-md text-xs">
                  {item.type}
                </span>
                <input
                  type="text"
                  value={item.url}
                  readOnly
                  className="flex-grow bg-gray-900 rounded-md p-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeMediaItem(index)}
                  className="bg-red-800 p-2 rounded hover:bg-red-700"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <label className="flex-1 text-center py-2 px-4 rounded-md border-0 text-sm font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100 cursor-pointer">
              {isUploading ? 'Mengupload...' : 'Tambah Gambar'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={addVideoUrl}
              className="flex-1 py-2 px-4 rounded-md border-0 text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100"
            >
              <FaPlus className="inline-block mr-1" /> Tambah Video
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:bg-cyan-800"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
