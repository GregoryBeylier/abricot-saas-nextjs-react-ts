'use client'

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE'

interface StatusBadgeProps {
  status: Status
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // mapping pour les états des tâches
  const statusLabels = {
    TODO: 'À faire',
    IN_PROGRESS: 'En cours',
    DONE: 'Terminée',
  }

  // mapping pour les couleurs des états des tâches
  const statusColors = {
    TODO: 'bg-red-100 text-red-700',
    IN_PROGRESS: 'bg-orange-100 text-orange-700',
    DONE: 'bg-green-100 text-green-700',
  }
  return (
    <span
      className={`inline-block flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}
