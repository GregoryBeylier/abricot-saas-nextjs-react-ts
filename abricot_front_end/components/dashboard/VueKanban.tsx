'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAssignedTasks,
  fetchProjectsWithTasks,
  fetchUpdateTask,
  type AssignedTasksResponse,
  type ProjectsWithTasksResponse,
} from '@/lib/api'
import TaskCard from '@/components/dashboard/TaskCard'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
  useDraggable,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { GripVertical } from 'lucide-react'

// ─── Colonne droppable ────────────────────────────────────────────────────────

function DroppableColumn({
  id,
  title,
  count,
  children,
}: {
  id: string
  title: string
  count: number
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl p-6 w-1/3 min-w-[270px] md:overflow-y-auto md:max-h-[600px] scrollbar-hide transition-colors ${
        isOver
          ? 'bg-orange-50 ring-2 ring-[var(--color-abricot)]'
          : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-2 mb-8 pl-1 pt-5">
        <p className="font-semibold">{title}</p>
        <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-sm">
          {count}
        </span>
      </div>
      {children}
    </div>
  )
}

// ─── Carte draggable ──────────────────────────────────────────────────────────

function DraggableCard({
  task,
  projectName,
}: {
  task: any
  projectName: string
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id, data: { task } })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`border rounded-lg mb-4 overflow-hidden cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-30' : ''}`}
    >
      <div className="p-4">
        <TaskCard
          task={task}
          variant_style="flex-col"
          projectName={projectName}
        />
      </div>
    </div>
  )
}

// ─── Kanban principal ─────────────────────────────────────────────────────────

export default function VueKanban() {
  const queryClient = useQueryClient()
  const [activeTask, setActiveTask] = useState<any>(null)
  const [erreur, setErreur] = useState('')

  const { data } = useQuery<AssignedTasksResponse>({
    queryKey: ['tasks'],
    queryFn: fetchAssignedTasks,
  })

  const { data: projectsData } = useQuery<ProjectsWithTasksResponse>({
    queryKey: ['projects-with-tasks'],
    queryFn: fetchProjectsWithTasks,
  })

  const projects = projectsData?.data?.projects ?? []
  const projectNames = projects.reduce<Record<string, string>>(
    (acc, project) => {
      acc[project.id] = project.name
      return acc
    },
    {}
  )

  const tasks = data?.data?.tasks ?? []
  const todoTask = tasks.filter((t) => t.status === 'TODO')
  const inProgressTask = tasks.filter((t) => t.status === 'IN_PROGRESS')
  const doneTask = tasks.filter((t) => t.status === 'DONE')

  // Mise à jour du statut en base après le drop
  const { mutate: updateStatus } = useMutation({
    mutationFn: ({
      projectId,
      taskId,
      status,
    }: {
      projectId: string
      taskId: string
      status: 'TODO' | 'IN_PROGRESS' | 'DONE'
    }) => fetchUpdateTask(projectId, taskId, { status }),
    onSuccess: (data) => {
      if (data.success === false) {
        setErreur("Vous n'avez pas les droits pour modifier cette tâche.")
        setTimeout(() => setErreur(''), 3000)
      } else {
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
      }
    },
    onError: () => {
      setErreur("Vous n'avez pas les droits pour modifier cette tâche.")
      setTimeout(() => setErreur(''), 3000)
    },
  })

  // PointerSensor pour desktop, TouchSensor pour mobile,
  // KeyboardSensor pour une alternative clavier au glisser-déposer (WCAG).
  // distance: 10 évite les drags accidentels sur les clics de boutons
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 8 },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const task = tasks.find((t) => t.id === active.id)
if (!task) return

    const newStatus = over.id as 'TODO' | 'IN_PROGRESS' | 'DONE'
    if (task.status === newStatus) return

    updateStatus({ projectId: task.projectId, taskId: task.id, status: newStatus })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {erreur && (
        <p className="text-red-600 text-sm mb-3 text-center">{erreur}</p>
      )}
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-[860px]">
          <DroppableColumn id="TODO" title="À faire" count={todoTask.length}>
            {todoTask.map((task) => (
              <DraggableCard
                key={task.id}
                task={task}
                projectName={projectNames[task.projectId]}
              />
            ))}
          </DroppableColumn>

          <DroppableColumn
            id="IN_PROGRESS"
            title="En cours"
            count={inProgressTask.length}
          >
            {inProgressTask.map((task) => (
              <DraggableCard
                key={task.id}
                task={task}
                projectName={projectNames[task.projectId]}
              />
            ))}
          </DroppableColumn>

          <DroppableColumn id="DONE" title="Terminée" count={doneTask.length}>
            {doneTask.map((task) => (
              <DraggableCard
                key={task.id}
                task={task}
                projectName={projectNames[task.projectId]}
              />
            ))}
          </DroppableColumn>
        </div>
      </div>

      {/* Fantôme affiché pendant le drag */}
      <DragOverlay>
        {activeTask && (
          <div className="border rounded-lg p-4 bg-white shadow-xl opacity-90 cursor-grabbing">
            <TaskCard
              task={activeTask}
              variant_style="flex-col"
              projectName={projectNames[activeTask.projectId]}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
