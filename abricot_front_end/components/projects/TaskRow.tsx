'use client'
import { fetchRemoveTask, fetchCreateComment, fetchDeleteComment, fetchProfile, type Projects, type ProjectTask } from '@/lib/api'
import StatusBadge from '@/components/ui/StatusBadge'
import { Calendar, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getInitiales } from '@/lib/utils'
import { JSX, useState } from 'react'
import { useModal } from '@/components/providers/ModalProvider'
import ModalEditTask from '../modal/ModalEditTask'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface TaskRowProps {
  task: ProjectTask
  project: Projects
  userRole: string
}

export default function TaskRow({ task, project, userRole }: TaskRowProps) {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [openCommentMenu, setOpenCommentMenu] = useState<string | null>(null)

  const { setContentModal, setOpenModal } = useModal()

  const queryClient = useQueryClient()

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  })
  const currentUser = profileData?.data?.user

  const { mutate: deleteComment } = useMutation({
    mutationFn: (commentId: string) => fetchDeleteComment(project.id, task.id, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', project.id] })
      setOpenCommentMenu(null)
    },
  })

  const { mutate: sendComment, isPending: isSending } = useMutation({
    mutationFn: () => fetchCreateComment(project.id, task.id, { content: commentContent }),
    onSuccess: () => {
      setCommentContent('')
      queryClient.invalidateQueries({ queryKey: ['project-tasks', project.id] })
    },
  })

  const { mutate: mutateRemoveProject } = useMutation({
    mutationFn: () => fetchRemoveTask(project.id, task.id),
    // onSuccess est appelé lorsque la modification echoue
    onSuccess: (data) => {
      setOpenModal(false)
      queryClient.invalidateQueries({ queryKey: ['project-tasks', project.id] })
    },
    onError: () => console.error('Erreur suppression'),
  })

  return (
    <div className="relative bg-white rounded-xl border p-6 flex flex-col md:flex-row justify-between gap-4 min-w-[130px] w-full overflow-visible">
      <div className="flex flex-col flex-1">
        <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center items-start pr-10 md:pr-0">
          <h2 className="font-medium break-words min-w-0">{task.title}</h2>
          <StatusBadge status={task.status} />
        </div>
        <p className="mb-5 text-sm text-gray-500 break-words">{task.description}</p>
        <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
          Échéance :
          <Calendar size={16} className="text-gray-400" />
          {task.dueDate
            ? format(new Date(task.dueDate), 'd MMM', { locale: fr })
            : 'Aucune'}
        </div>
        <div className=" mb-5 flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          Assigné à :
          {task.assignees.map((assignee) => (
            <div key={assignee.id} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium uppercase ${assignee.user.email === currentUser?.email ? 'bg-[#D3590B]/10 text-gray-900' : 'bg-gray-200 text-gray-600'}`}>
                {assignee.user.name
                  ? getInitiales(assignee.user.name)
                  : getInitiales(assignee.user.email)}
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                {assignee.user.name ?? assignee.user.email}
              </div>
            </div>
          ))}
        </div>
        <div
          className="border-t pt-3 flex justify-between items-center cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          Commentaires ({task.comments.length})
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {open && (
          <div className="mt-3 flex flex-col gap-3">
            {task.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold uppercase flex-shrink-0 ${comment.author.email === currentUser?.email ? 'bg-[#D3590B]/10 text-gray-900' : 'bg-gray-200 text-gray-600'}`}>
                  {getInitiales(comment.author.name ?? comment.author.email)}
                </div>
                <div className="flex-1 min-w-0 bg-gray-50 rounded-xl px-3 py-2">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                      <p className="text-sm font-medium text-zinc-800 truncate">
                        {comment.author.name ?? comment.author.email}
                      </p>
                      <p className="text-xs text-gray-400 whitespace-nowrap">
                        {format(new Date(comment.createdAt), 'd MMM, HH:mm', { locale: fr })}
                      </p>
                    </div>
                    {(comment.author.email === currentUser?.email || userRole === 'ADMIN') && (
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() => setOpenCommentMenu(openCommentMenu === comment.id ? null : comment.id)}
                          className="text-gray-400 hover:text-gray-600 text-lg leading-none px-1"
                        >
                          ···
                        </button>
                        {openCommentMenu === comment.id && (
                          <div className="absolute right-0 top-6 bg-white rounded-xl shadow-lg border p-1 z-50 min-w-[140px]">
                            <button
                              onClick={() => deleteComment(comment.id)}
                              className="w-full px-3 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-lg text-left"
                            >
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 break-words">{comment.content}</p>
                </div>
              </div>
            ))}

            {/* Input ajout commentaire */}
            <div className="flex items-start gap-3 mt-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D3590B] to-[#E8843F] flex items-center justify-center text-xs font-semibold uppercase text-white flex-shrink-0 mt-2">
                {currentUser ? getInitiales(currentUser.name ?? currentUser.email) : '?'}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-gray-300 min-h-[60px]"
                  rows={2}
                />
                <button
                  onClick={() => sendComment()}
                  disabled={!commentContent.trim() || isSending}
                  className="self-end px-5 py-2 rounded-xl bg-gray-200 text-gray-500 text-sm font-medium disabled:opacity-50 enabled:bg-[#1F1F1F] enabled:text-white transition-colors"
                >
                  {isSending ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="absolute top-4 right-4 md:relative md:top-auto md:right-auto">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0"
        >
          <MoreHorizontal size={16} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-0 mt-8 bg-white rounded-xl shadow-lg border p-2 flex flex-col gap-1 min-w-[180px] z-50">
            {userRole === 'ADMIN' && (
              <button
                onClick={() => {
                  if (!project) return
                  setContentModal(
                    <ModalEditTask task={task} project={project} />
                  )
                  setOpenModal(true)
                  setMenuOpen(false)
                }}
                className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg text-left"
              >
                Modifier la tâche
              </button>
            )}
            <button
              onClick={() => {
                mutateRemoveProject()
              }}
              className="px-4 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-lg text-left"
            >
              Supprimer la tâche
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
