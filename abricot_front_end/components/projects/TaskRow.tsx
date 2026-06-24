'use client'
import type { Projects, ProjectTask } from '@/lib/api'
import StatusBadge from '@/components/ui/StatusBadge'
import { Calendar, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getInitiales } from '@/lib/utils'
import { JSX, useState } from 'react'
import { useModal } from '@/components/providers/ModalProvider'
import ModalEditTask from '../modal/ModalEditTask'

interface TaskRowProps {
  task: ProjectTask
  project: Projects
}

export default function TaskRow({ task, project }: TaskRowProps) {
  const [open, setOpen] = useState(false)

  const { setContentModal, setOpenModal } = useModal()

  return (
    <div className="bg-white rounded-xl border p-6 flex flex-col md:flex-row justify-between gap-4 min-w-[130px] w-full">
      <div className="flex flex-col flex-1">
        <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center items-start">
          <h2 className="font-medium">{task.title}</h2>
          <StatusBadge status={task.status} />
        </div>
        <p className="mb-5 text-sm text-gray-500">{task.description}</p>
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
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium uppercase">
                {assignee.user.name ? getInitiales(assignee.user.name) : '?'}
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                {assignee.user.name}
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
      </div>
      <button className="w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 self-end md:self-auto">
        <MoreHorizontal
          size={16}
          onClick={() => {
            if (!project) return
            setContentModal(<ModalEditTask task={task} project={project} />)
            setOpenModal(true)
          }}
        />
      </button>
    </div>
  )
}
