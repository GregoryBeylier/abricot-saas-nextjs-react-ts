import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Génère les initiales d'un nom complet
export function getInitiales(name: string) {
  return name
    .split(' ')
    .map((part) => part[0]?.toUpperCase() ?? '')

    .join('')
}

// Étiquettes lisibles pour les rôles de projet
export const roleLabels: Record<string, string> = {
  OWNER: 'Propriétaire',
  ADMIN: 'Admin',
  CONTRIBUTOR: 'Contributeur',
}
