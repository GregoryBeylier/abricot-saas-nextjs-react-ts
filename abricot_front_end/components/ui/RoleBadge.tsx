'use client'
import { roleLabels } from '@/lib/utils'

interface RoleBadgeProps {
  role: string
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span className="bg-[#FFE8D9] text-[var(--color-abricot-text)] text-xs px-3 py-1 rounded-full">
      {roleLabels[role] ?? role}
    </span>
  )
}
