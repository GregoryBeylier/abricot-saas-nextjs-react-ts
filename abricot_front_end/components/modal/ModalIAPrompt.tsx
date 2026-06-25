'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Projects } from '@/lib/api'
import { useModal } from '@/components/providers/ModalProvider'
import ModalIATasks from './ModalIATasks'

export default function ModalIAPrompt({ project }: { project: Projects }) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')

  const { setContentModal } = useModal()

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setErreur('')

    try {
      const res = await fetch('/api/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()

      if (data.error || !Array.isArray(data.tasks) || data.tasks.length === 0) {
        setErreur("L'IA n'a pas pu générer les tâches, reformulez votre demande.")
        return
      }

      // Passer à la modale suivante avec les tâches générées
      setContentModal(<ModalIATasks project={project} tasks={data.tasks} />)
    } catch {
      setErreur('Une erreur est survenue, veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-[400px]">
      <div className="flex items-center gap-2 mb-8">
        <Sparkles size={20} className="text-[var(--color-abricot)]" />
        <h1 className="font-semibold text-xl">Créer une tâche</h1>
      </div>

      <div className="flex flex-col gap-4 flex-1 justify-end">
        {erreur && <p className="text-red-500 text-sm">{erreur}</p>}

        <div className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Décrivez les tâches que vous souhaitez ajouter..."
            className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-700 placeholder:text-gray-400 min-h-[40px] max-h-[120px]"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleGenerate()
              }
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              prompt.trim() && !loading
                ? 'bg-[var(--color-abricot)] text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-lg leading-none">+</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
