'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface PromptFormProps {
  onSubmit: (prompt: string, options: GenerationOptions) => Promise<void>;
  isGenerating: boolean;
}

export interface GenerationOptions {
  style?: string;
  ratio?: '1:1' | '16:9' | '9:16';
  quality?: 'standard' | 'hd';
}

export function PromptForm({ onSubmit, isGenerating }: PromptFormProps) {
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<GenerationOptions>({
    style: 'natural',
    ratio: '1:1',
    quality: 'standard',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    await onSubmit(prompt, options);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-gray-700"
        >
          Image Description
        </label>
        <div className="mt-1">
          <textarea
            id="prompt"
            name="prompt"
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Describe the image you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Be specific and descriptive for better results.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label
            htmlFor="style"
            className="block text-sm font-medium text-gray-700"
          >
            Style
          </label>
          <select
            id="style"
            name="style"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={options.style}
            onChange={(e) =>
              setOptions({ ...options, style: e.target.value })
            }
            disabled={isGenerating}
          >
            <option value="natural">Natural</option>
            <option value="artistic">Artistic</option>
            <option value="cinematic">Cinematic</option>
            <option value="anime">Anime</option>
            <option value="digital-art">Digital Art</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="ratio"
            className="block text-sm font-medium text-gray-700"
          >
            Aspect Ratio
          </label>
          <select
            id="ratio"
            name="ratio"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={options.ratio}
            onChange={(e) =>
              setOptions({
                ...options,
                ratio: e.target.value as GenerationOptions['ratio'],
              })
            }
            disabled={isGenerating}
          >
            <option value="1:1">Square (1:1)</option>
            <option value="16:9">Landscape (16:9)</option>
            <option value="9:16">Portrait (9:16)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="quality"
            className="block text-sm font-medium text-gray-700"
          >
            Quality
          </label>
          <select
            id="quality"
            name="quality"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={options.quality}
            onChange={(e) =>
              setOptions({
                ...options,
                quality: e.target.value as GenerationOptions['quality'],
              })
            }
            disabled={isGenerating}
          >
            <option value="standard">Standard</option>
            <option value="hd">HD</option>
          </select>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!prompt.trim() || isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </button>
      </div>
    </form>
  );
}