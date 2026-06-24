'use client'
import type { Task } from '@/lib/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import StatusBadge from '@/components/ui/StatusBadge'
import { Folder, Calendar, MessageSquare } from 'lucide-react'
import { useModal } from '@/components/providers/ModalProvider'
import ModalViewTask from '@/components/modal/ModalViewTask'
import { Button } from '@/components/ui/button'

interface TaskCardProps {
  task: Task
  variant_style?: string
  projectName?: string
}

export default function TaskCard({
  task,
  variant_style,
  projectName,
}: TaskCardProps) {
  const { setOpenModal, setContentModal } = useModal()

  const handleVoir = () => {
    setContentModal(<ModalViewTask task={task} projectName={projectName} />)
    setOpenModal(true)
  }

  return (
    <>
      {variant_style === 'flex-col' ? (
        <div className="flex flex-col gap-5 px-2">
          <div className="flex justify-between items-center">
            <h2 className="font-medium truncate max-w-[60%]">{task.title}</h2>
            <StatusBadge status={task.status} />
          </div>
          <p className="text-gray-500 text-sm truncate max-w-[60%]">
            {task.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Folder size={16} className="text-gray-400" fill="currentColor" />
            <span className="truncate max-w-[90px]">{projectName}</span>
            <span>|</span>
            <Calendar size={16} className="text-gray-400" />
            <span>
              {task.dueDate
                ? format(new Date(task.dueDate), 'd MMM', { locale: fr })
                : ''}
            </span>
            <span>|</span>
            <MessageSquare
              size={16}
              className="text-gray-400"
              fill="currentColor"
            />
            <span>{task.comments.length}</span>
          </div>
          <Button
            onClick={handleVoir}
            className="self-start h-[40px] rounded-[10px] px-[32px] bg-[#1F1F1F] text-white flex items-center"
          >
            Voir
          </Button>
        </div>
      ) : (
        <div className="flex flex-col min-[321px]:flex-row justify-between h-full gap-4">
          <div className="flex flex-col justify-between py-2 flex-1 min-w-0">
            <div>
              <h2 className="font-medium line-clamp-2 min-[321px]:line-clamp-1">
                {task.title}
              </h2>
              <p className="text-gray-500 text-sm line-clamp-1">
                {task.description}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 flex-wrap gap-y-1">
              <Folder
                size={16}
                className="text-gray-400 flex-shrink-0"
                fill="currentColor"
              />
              <span className="hidden min-[321px]:inline whitespace-nowrap">
                {projectName}
              </span>
              <span>|</span>
              <Calendar size={16} className="text-gray-400 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {task.dueDate
                  ? format(new Date(task.dueDate), 'd MMM', { locale: fr })
                  : ''}
              </span>
              <span>|</span>
              <MessageSquare
                size={16}
                className="text-gray-400 flex-shrink-0"
                fill="currentColor"
              />
              <span>{task.comments.length}</span>
            </div>
          </div>
          <div className="flex min-[321px]:flex-col items-center min-[321px]:items-end justify-between py-2 min-h-[80px] min-[321px]:min-h-[120px] flex-shrink-0">
            <StatusBadge status={task.status} />
            <Button
              onClick={handleVoir}
              className="self-start h-[40px] rounded-[10px] px-[32px] bg-[#1F1F1F] text-white flex items-center"
            >
              Voir
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
