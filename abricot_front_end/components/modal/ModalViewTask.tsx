'use client'
import type { Task } from '@/lib/api'
import StatusBadge from '@/components/ui/StatusBadge'
import { Calendar, Folder, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getInitiales } from '@/lib/utils'

export default function ModalViewTask({
  task,
  projectName,
}: {
  task: Task
  projectName?: string
}) {
  return (
    <>
      <div className="flex flex-col px-8 pb-6 pt-6">
        <div className="flex flex-wrap items-center gap-3 pr-9">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 leading-tight">
            {task.title}
          </h1>
          <StatusBadge status={task.status} />
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
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#D3590B] to-[#E8843F] text-[11px] font-semibold uppercase text-white">
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

        <div className="mt-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              Commentaires
            </span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-100 px-1.5 text-[11px] font-semibold text-zinc-500">
              {task.comments.length}
            </span>
          </div>
          {task.comments.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-7">
              <MessageSquare size={22} className="text-zinc-300" />
              <span className="text-sm text-zinc-400">
                Aucun commentaire pour le moment
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
