import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Génère les initiales d'un nom complet
export function getInitiales(name: string) {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('')
}

// Étiquettes lisibles pour les rôles de projet
export const roleLabels: Record<string, string> = {
  OWNER: 'Propriétaire',
  ADMIN: 'Administrateur',
  CONTRIBUTOR: 'Contributeur',
}
