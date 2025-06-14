// components/AddSkillModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  skillToEdit?: Skill | null;
}

export default function AddSkillModal({
  isOpen,
  onClose,
  onSuccess,
  skillToEdit,
}: AddSkillModalProps) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState(80);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && skillToEdit) {
      setName(skillToEdit.name);
      setLevel(skillToEdit.level);
    } else {
      setName('');
      setLevel(80);
      setError('');
    }
  }, [isOpen, skillToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const supabase = createClient();
    const skillData = { name, level };
    let query;

    if (skillToEdit) {
      // Mode EDIT
      query = await supabase
        .from('skills')
        .update(skillData)
        .eq('id', skillToEdit.id);
    } else {
      // Mode TAMBAH
      query = await supabase.from('skills').insert([skillData]);
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

  if (!isOpen) return null;

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
            {skillToEdit ? 'Edit Skill' : 'Tambah Skill Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Nama Skill
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Level Keahlian (0-100)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              className="mt-1 block w-full"
            />
            <p className="text-center font-bold text-lg mt-2">{level}%</p>
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
