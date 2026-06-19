import Cookie from 'js-cookie'
import type { Status } from '@/components/ui/StatusBadge'

// appel l'api pour récuperer les donées de l'utilisateur connecté
export async function fetchProfile() {
  const token = Cookie.get('token')
  const response = await fetch('http://localhost:8000/auth/profile', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  return await response.json()
}

// Interface pour les tâches
export interface Task {
  id: string
  title: string
  description: string
  status: Status
  dueDate: string | null
  comments: { id: string }[]
  projectId: string
}

// Interface pour les tâches
export interface AssignedTasksResponse {
  data: {
    tasks: Task[]
  }
}

export interface ProjectWithTasks {
  id: string
  name: string
  tasks: Task[]
}

export interface ProjectsWithTasksResponse {
  data: {
    projects: ProjectWithTasks[]
  }
}

// appel l'api pour récuperer les projets dans lesquls des tache on ete assignés
export async function fetchProjectsWithTasks() {
  const token = Cookie.get('token')
  const response = await fetch(
    'http://localhost:8000/dashboard/projects-with-tasks',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return await response.json()
}

// appel l'api pour récuperer les tache assignées de l'utilisateur connecté
export async function fetchAssignedTasks() {
  const token = Cookie.get('token')
  const response = await fetch(
    'http://localhost:8000/dashboard/assigned-tasks',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return await response.json()
}

// une interface d'un membre apartenant à un projet
export interface ProjectMember {
  id: string
  role: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

// un projet avec ses membres, son propriétaire et le rôle de l'utilisateur connecté

export interface Projects {
  id: string
  name: string
  description: string | null
  ownerId: string
  owner: {
    id: string
    email: string
    name: string | null
  }
  members: ProjectMember[]
  _count: { tasks: number }
  userRole: string
}

// Structure complète de la réponse retournée par l'endpoint GET
export interface ProjectsResponse {
  data: {
    projets: Projects[]
  }
}

export async function fetchProjects() {
  const token = Cookie.get('token')
  const response = await fetch('http://localhost:8000/projects', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  return await response.json()
}
