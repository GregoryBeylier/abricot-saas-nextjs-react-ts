'use client'

import { useState } from 'react'
import { Sparkles, Trash2, Pencil, Check, X } from 'lucide-react'
import { fetchCreateTask, Projects } from '@/lib/api'
import { useModal } from '@/components/providers/ModalProvider'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'

interface GeneratedTask {
  title: string
  description: string
}

interface Props {
  project: Projects
  tasks: GeneratedTask[]
}

export default function ModalIATasks({ project, tasks: initialTasks }: Props) {
  const [tasks, setTasks] = useState<GeneratedTask[]>(initialTasks)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [erreur, setErreur] = useState('')
  const [prompt, setPrompt] = useState('')

  const { setOpenModal } = useModal()
  const queryClient = useQueryClient()

  const handleDelete = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const handleEditStart = (index: number) => {
    setEditingIndex(index)
    setEditTitle(tasks[index].title)
    setEditDescription(tasks[index].description)
  }

  const handleEditSave = (index: number) => {
    const updated = [...tasks]
    updated[index] = { title: editTitle, description: editDescription }
    setTasks(updated)
    setEditingIndex(null)
  }

  const handleGenerateMore = async () => {
    if (!prompt.trim()) return
    setLoadingMore(true)
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
      setTasks((prev) => [...prev, ...data.tasks])
      setPrompt('')
    } catch {
      setErreur('Une erreur est survenue.')
    } finally {
      setLoadingMore(false)
    }
  }

  const handleAddAll = async () => {
    if (tasks.length === 0) return
    setLoading(true)
    setErreur('')

    try {
      // Créer toutes les tâches en parallèle
      await Promise.all(
        tasks.map((task) =>
          fetchCreateTask(project.id, {
            title: task.title,
            description: task.description,
          })
        )
      )
      queryClient.invalidateQueries({ queryKey: ['project-tasks', project.id] })
      setOpenModal(false)
    } catch {
      setErreur('Une erreur est survenue lors de la création des tâches.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-[var(--color-abricot)]" />
        <h1 className="font-semibold text-xl">Vos tâches...</h1>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-1">
        {tasks.map((task, index) => (
          <div key={index} className="border rounded-xl p-4 bg-white">
            {editingIndex === index ? (
              // Mode édition
              <div className="flex flex-col gap-2">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-semibold text-sm border-b border-gray-300 outline-none pb-1"
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="text-sm text-gray-500 outline-none border-b border-gray-200 pb-1"
                />
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleEditSave(index)}
                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700"
                  >
                    <Check size={14} /> Sauvegarder
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} /> Annuler
                  </button>
                </div>
              </div>
            ) : (
              // Mode affichage
              <>
                <p className="font-semibold text-sm mb-1">{task.title}</p>
                <p className="text-sm text-gray-500 mb-3">{task.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <button
                    onClick={() => handleDelete(index)}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} /> Supprimer
                  </button>
                  <span>|</span>
                  <button
                    onClick={() => handleEditStart(index)}
                    className="flex items-center gap-1 hover:text-gray-600 transition-colors"
                  >
                    <Pencil size={13} /> Modifier
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {erreur && <p className="text-red-500 text-sm mt-3">{erreur}</p>}

      <Button
        onClick={handleAddAll}
        disabled={tasks.length === 0 || loading}
        className="mt-6 w-full h-12 rounded-xl bg-[#1F1F1F] text-white"
      >
        {loading ? 'Création en cours...' : `+ Ajouter les tâches`}
      </Button>

      {/* Input pour générer d'autres tâches */}
      <div className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 mt-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Décrivez les tâches que vous souhaitez ajouter..."
          className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-700 placeholder:text-gray-400 min-h-[40px] max-h-[80px]"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleGenerateMore()
            }
          }}
        />
        <button
          onClick={handleGenerateMore}
          disabled={!prompt.trim() || loadingMore}
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            prompt.trim() && !loadingMore
              ? 'bg-[var(--color-abricot)] text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loadingMore ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-lg leading-none">+</span>
          )}
        </button>
      </div>
    </>
  )
}
