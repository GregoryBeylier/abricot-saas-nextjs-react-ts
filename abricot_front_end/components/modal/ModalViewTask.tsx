'use client'
import { useState } from 'react'
import type { Task } from '@/lib/api'
import { fetchCreateComment, fetchDeleteComment, fetchProjects } from '@/lib/api'
import ModalEditTask from '@/components/modal/ModalEditTask'
import StatusBadge from '@/components/ui/StatusBadge'
import { Calendar, Folder, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getInitiales } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchProfile } from '@/lib/api'
import { useModal } from '@/components/providers/ModalProvider'

export default function ModalViewTask({
  task,
  projectName,
}: {
  task: Task
  projectName?: string
}) {
  const [content, setContent] = useState('')
  const [openCommentMenu, setOpenCommentMenu] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { setContentModal } = useModal()

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  })

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  const currentUser = profileData?.data?.user
  const currentProject = projectsData?.data?.projects?.find((p) => p.id === task.projectId)
  const userRole = currentProject?.userRole
  const canEdit = userRole === 'ADMIN' || currentProject?.owner?.id === currentUser?.id

  const { mutate: deleteComment } = useMutation({
    mutationFn: (commentId: string) => fetchDeleteComment(task.projectId, task.id, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', task.projectId] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setOpenCommentMenu(null)
    },
  })

  const { mutate: sendComment, isPending } = useMutation({
    mutationFn: () =>
      fetchCreateComment(task.projectId, task.id, { content }),
    onSuccess: () => {
      setContent('')
      queryClient.invalidateQueries({ queryKey: ['project-tasks', task.projectId] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  return (
    <>
      <div className="flex flex-col px-8 pb-6 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pr-9">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 leading-tight">
              {task.title}
            </h1>
            <StatusBadge status={task.status} />
          </div>
          {canEdit && currentProject && (
            <button
              onClick={() =>
                setContentModal(
                  <ModalEditTask task={task as any} project={currentProject} />
                )
              }
              className="text-sm px-4 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-600 transition-colors"
            >
              Modifier
            </button>
          )}
        </div>

        {task.description && (
          <p className="mt-3.5 text-[15px] leading-relaxed text-zinc-500">
            {task.description}
          </p>
        )}

        <div className="my-6 h-px bg-zinc-100" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-3.5 py-3">
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[#D3590B]/10 text-[#D3590B]">
              <Folder size={17} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                Projet
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-zinc-800">
                {projectName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-3.5 py-3">
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[#D3590B]/10 text-[#D3590B]">
              <Calendar size={17} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                Échéance
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-zinc-800">
                {task.dueDate
                  ? format(new Date(task.dueDate), 'd MMMM yyyy', {
                      locale: fr,
                    })
                  : 'Aucune échéance'}
              </p>
            </div>
          </div>
        </div>

        {task.assignees.length > 0 && (
          <div className="mt-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              Assigné à
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {task.assignees.map((assignee) => (
                <div
                  key={assignee.id}
                  className="flex items-center gap-2.5 rounded-full border border-zinc-100 bg-zinc-50 py-[5px] pl-[5px] pr-3"
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold uppercase ${assignee.user.email === currentUser?.email ? 'bg-[#D3590B]/10 text-gray-900' : 'bg-zinc-200 text-zinc-600'}`}>
                    {getInitiales(assignee.user.name ?? assignee.user.email)}
                  </div>
                  <span className="text-sm font-medium text-zinc-700">
                    {assignee.user.name ?? assignee.user.email}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Commentaires ─── */}
        <div className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              Commentaires
            </span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-100 px-1.5 text-[11px] font-semibold text-zinc-500">
              {task.comments.length}
            </span>
          </div>

          {task.comments.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-7 mb-4">
              <MessageSquare size={22} className="text-zinc-300" />
              <span className="text-sm text-zinc-400">
                Aucun commentaire pour le moment
              </span>
            </div>
          )}

          {task.comments.length > 0 && (
            <div className="flex flex-col gap-3 mb-4">
              {task.comments.map((comment) => (
                <div key={comment.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold uppercase flex-shrink-0 ${comment.author.email === currentUser?.email ? 'bg-[#D3590B]/10 text-gray-900' : 'bg-zinc-200 text-zinc-600'}`}>
                    {getInitiales(comment.author.name ?? comment.author.email)}
                  </div>
                  <div className="flex-1 bg-zinc-50 rounded-xl px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-zinc-800">
                        {comment.author.name ?? comment.author.email}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-zinc-400">
                          {format(new Date(comment.createdAt), 'd MMM, HH:mm', { locale: fr })}
                        </p>
                        {(comment.author.email === currentUser?.email || canEdit) && (
                          <div className="relative">
                            <button
                              onClick={() => setOpenCommentMenu(openCommentMenu === comment.id ? null : comment.id)}
                              className="text-zinc-400 hover:text-zinc-600 text-lg leading-none px-1"
                            >
                              ···
                            </button>
                            {openCommentMenu === comment.id && (
                              <div className="absolute right-0 top-6 bg-white rounded-xl shadow-lg border p-1 z-50 min-w-[140px]">
                                <button
                                  onClick={() => deleteComment(comment.id)}
                                  className="w-full px-3 py-2 text-sm text-red-500 hover:bg-zinc-100 rounded-lg text-left"
                                >
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-500">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input ajout commentaire */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D3590B] to-[#E8843F] flex items-center justify-center text-xs font-semibold uppercase text-white flex-shrink-0 mt-2">
              {currentUser
                ? getInitiales(currentUser.name ?? currentUser.email)
                : '?'}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-zinc-300 min-h-[60px]"
                rows={2}
              />
              <button
                onClick={() => sendComment()}
                disabled={!content.trim() || isPending}
                className="self-end px-5 py-2 rounded-xl bg-zinc-200 text-zinc-500 text-sm font-medium disabled:opacity-50 enabled:bg-[#1F1F1F] enabled:text-white transition-colors"
              >
                {isPending ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
