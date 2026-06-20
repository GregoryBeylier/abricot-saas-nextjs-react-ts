import Cookie from 'js-cookie'
import type { Status } from '@/components/ui/StatusBadge'

// Authentifie l'utilisateur — POST /auth/login
export async function fetchLogin(data: { email: string; password: string }) {
  const res = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return await res.json()
}

// Enregistre un nouvel utilisateur — POST /auth/register
export async function fetchRegister(data: { email: string; password: string }) {
  const res = await fetch('http://localhost:8000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return await res.json()
}

// Récupère le profil de l'utilisateur connecté — GET /auth/profile
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

// Type de réponse pour le profil utilisateur
export interface UserProfile {
  data: {
    user: {
      id: string
      email: string
      name: string | null
    }
  }
}

// Type représentant une tâche assignée
export interface Task {
  id: string
  title: string
  description: string
  status: Status
  dueDate: string | null
  comments: { id: string }[]
  projectId: string
}

// Type de réponse pour les tâches assignées
export interface AssignedTasksResponse {
  data: {
    tasks: Task[]
  }
}
// Type représentant un projet contenant des tâches associées
export interface ProjectWithTasks {
  id: string
  name: string
  tasks: Task[]
}

// Type de réponse pour les projets et leurs tâches
export interface ProjectsWithTasksResponse {
  data: {
    projects: ProjectWithTasks[]
  }
}

// Récupère les projets qui contiennent des tâches assignées — GET /dashboard/projects-with-tasks
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

// Récupère les tâches assignées à l'utilisateur connecté — GET /dashboard/assigned-tasks
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

// Type représentant un membre d'un projet
export interface ProjectMember {
  id: string
  role: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

// Type représentant un projet avec ses informations, propriétaire, membres et rôle de l'utilisateur connecté

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

// Type de réponse pour la liste des projets de l'utilisateur
export interface ProjectsResponse {
  data: {
    projects: Projects[]
  }
}

// Récupère tous les projets de l'utilisateur connecté — GET /projects
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

// Type représentant un assigné d'une tâche de projet
export interface Assignee {
  id: string
  userId: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

// Type représentant une tâche appartenant à un projet
export interface ProjectTask {
  id: string
  title: string
  description: string
  status: Status
  priority: string
  dueDate: string | null
  projectId: string
  assignees: Assignee[]
  comments: { id: string }[]
}

// Type de réponse pour les tâches d'un projet
export interface ProjectTasksResponse {
  data: {
    tasks: ProjectTask[]
  }
}

// Récupère les tâches d'un projet spécifique — GET /projects/{id}/tasks
export async function fetchProjectTasks(projectId: string) {
  const token = Cookie.get('token')
  const response = await fetch(
    `http://localhost:8000/projects/${projectId}/tasks`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return await response.json()
}
