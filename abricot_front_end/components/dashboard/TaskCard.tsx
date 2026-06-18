import type { Task } from '@/lib/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/ui/StatusBadge'
import { Folder, Calendar, MessageSquare } from 'lucide-react'

interface TaskCardProps {
  task: Task
  variant_style?: string
}

export default function TaskCard({ task, variant_style }: TaskCardProps) {
  return (
    <>
      {variant_style === 'flex-col' ? (
        <div className="flex flex-col gap-5 px-2">
          <div className="flex justify-between items-center">
            <h2 className="font-medium truncate max-w-[60%] ">{task.title}</h2>
            <StatusBadge status={task.status} />
          </div>
          <p className="text-gray-500 text-sm truncate max-w-[60%]">
            {task.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Folder size={16} className="text-gray-400" fill="currentColor" />
            <span>Nom du projet</span>
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
          <Button className="self-start h-[40px] rounded-[10px] px-[32px] bg-[#1F1F1F] text-white">
            Voir
          </Button>
        </div>
      ) : (
        <div className="flex justify-between h-full">
          <div className="flex flex-col justify-between py-2">
            <div>
              <h2 className="font-medium">{task.title}</h2>
              <p className="text-gray-500 text-sm">{task.description}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Folder size={16} className="text-gray-400" fill="currentColor" />
              <span>Nom du projet</span>
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
          </div>
          <div className="flex flex-col items-end justify-between py-2">
            <StatusBadge status={task.status} />
            <Button className="h-[40px] rounded-[10px] px-[32px] bg-[#1F1F1F] text-white">
              Voir
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
