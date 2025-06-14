// components/AddExperienceModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // PERBAIKAN: Impor 'createClient'

interface Experience {
  id: string;
  title: string;
  company: string;
  year_start: string;
  year_end: string;
  description: string;
}

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  experienceToEdit?: Experience | null;
}

export default function AddExperienceModal({
  isOpen,
  onClose,
  onSuccess,
  experienceToEdit,
}: AddExperienceModalProps) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [year_start, setYearStart] = useState('');
  const [year_end, setYearEnd] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && experienceToEdit) {
      setTitle(experienceToEdit.title);
      setCompany(experienceToEdit.company);
      setYearStart(experienceToEdit.year_start);
      setYearEnd(experienceToEdit.year_end);
      setDescription(experienceToEdit.description);
    } else {
      setTitle('');
      setCompany('');
      setYearStart('');
      setYearEnd('');
      setDescription('');
      setError('');
    }
  }, [isOpen, experienceToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Panggilan ini sekarang valid karena 'createClient' sudah diimpor
    const supabaseClient = createClient();
    const experienceData = {
      title,
      company,
      year_start,
      year_end,
      description,
    };
    let query;

    if (experienceToEdit) {
      query = await supabaseClient
        .from('experience')
        .update(experienceData)
        .eq('id', experienceToEdit.id);
    } else {
      query = await supabaseClient.from('experience').insert([experienceData]);
    }

    const { error: actionError } = query;

    if (actionError) {
      setError('Gagal menyimpan data: ' + actionError.message);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-custom-dark text-white border border-white/10 p-8 rounded-lg shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {experienceToEdit ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Judul Posisi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Nama Perusahaan
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-300">
                Tahun Mulai
              </label>
              <input
                type="text"
                value={year_start}
                onChange={(e) => setYearStart(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-300">
                Tahun Selesai
              </label>
              <input
                type="text"
                value={year_end}
                onChange={(e) => setYearEnd(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
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
