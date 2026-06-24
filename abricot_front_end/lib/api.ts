import Cookie from 'js-cookie'
import type { Status } from '@/components/ui/StatusBadge'

// ─── Wrapper HTTP ───────────────────────────────────────────────────────────

// URL de base de l'API
const API_BASE_URL = 'http://localhost:8000'

// Options acceptées par le wrapper apiRequest
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  // Ajoute l'en-tête Authorization avec le token (true par défaut)
  auth?: boolean
}

// Wrapper centralisé : construit l'URL, pose les en-têtes (et le token si besoin),
// envoie la requête et renvoie une promesse résolue avec le JSON de la réponse.
function apiRequest<T = any>(
  path: string,
  { method = 'GET', body, auth = true }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (auth) {
    headers.Authorization = `Bearer ${Cookie.get('token')}`
  }

  return fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  }).then((response) => response.json() as Promise<T>)
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

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

// Récupère le profil de l'utilisateur connecté — GET /auth/profile
export function fetchProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>('/auth/profile')
}

// Authentifie l'utilisateur — POST /auth/login
export function fetchLogin(data: { email: string; password: string }) {
  return apiRequest('/auth/login', { method: 'POST', body: data, auth: false })
}

// Enregistre un nouvel utilisateur — POST /auth/register
export function fetchRegister(data: { email: string; password: string }) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: data,
    auth: false,
  })
}

// ─── Auth — Modification ──────────────────────────────────────────────────────

// Met à jour le profil de l'utilisateur connecté — PUT /auth/profile
export function fetchUpdateProfile(data: { email?: string; name?: string }) {
  return apiRequest('/auth/profile', { method: 'PUT', body: data })
}

// Met à jour le mot de passe de l'utilisateur connecté — PUT /auth/password
export function fetchUpdatePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  return apiRequest('/auth/password', { method: 'PUT', body: data })
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

// Type représentant une tâche assignée
export interface Task {
  id: string
  title: string
  description: string
  status: Status
  dueDate: string | null
  comments: { id: string }[]
  projectId: string
  assignees: {
    id: string
    user: {
      id: string
      email: string
      name: string | null
    }
  }[]
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

// Récupère les tâches assignées à l'utilisateur connecté — GET /dashboard/assigned-tasks
export function fetchAssignedTasks(): Promise<AssignedTasksResponse> {
  return apiRequest<AssignedTasksResponse>('/dashboard/assigned-tasks')
}

// Récupère les projets qui contiennent des tâches assignées — GET /dashboard/projects-with-tasks
export function fetchProjectsWithTasks(): Promise<ProjectsWithTasksResponse> {
  return apiRequest<ProjectsWithTasksResponse>('/dashboard/projects-with-tasks')
}

// ─── Projets ──────────────────────────────────────────────────────────────────

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
  completedTasks: number
  userRole: string
}

// Type de réponse pour la liste des projets de l'utilisateur
export interface ProjectsResponse {
  data: {
    projects: Projects[]
  }
}

// Type représentant un assigné d'une tâche de projet
export interface Assignee {
  id: string
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

// Récupère tous les projets de l'utilisateur connecté — GET /projects
export function fetchProjects(): Promise<ProjectsResponse> {
  return apiRequest<ProjectsResponse>('/projects')
}

// Récupère les tâches d'un projet spécifique — GET /projects/{id}/tasks
export function fetchProjectTasks(
  projectId: string
): Promise<ProjectTasksResponse> {
  return apiRequest<ProjectTasksResponse>(`/projects/${projectId}/tasks`)
}

// ─── CreateProject  ──────────────────────────────────────────────────────────────────

export interface CreateProjectBody {
  name: string
  description?: string
  contributors?: string[]
}

export interface CreateProjectResponse {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    description: string
    ownerId: string
    owner: {
      id: string
      email: string
      name: string
    }
    members: {
      id: string
      role: string
      user: {
        id: string
        email: string
        name: string
      }
    }[]
  }
}

// Crée un nouveau projet — POST /projects
export function fetchCreateProject(
  data: CreateProjectBody
): Promise<CreateProjectResponse> {
  return apiRequest<CreateProjectResponse>('/projects', {
    method: 'POST',
    body: data,
  })
}

// ─── Modification du projets  ──────────────────────────────────────────────────────────────────

export interface UpdateProjectBody {
  name?: string
  description?: string
}

export interface UpdateProjectBodyResponse {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    description: string
    ownerId: string
    owner: {
      id: string
      email: string
      name: string
    }
    members: {
      id: string
      role: string
      user: {
        id: string
        email: string
        name: string
      }
    }[]
  }
}

// met à jour le titre et la description
export function fetchUpdateProject(
  projectId: string,
  data: UpdateProjectBody
): Promise<UpdateProjectBodyResponse> {
  return apiRequest<UpdateProjectBodyResponse>(`/projects/${projectId}`, {
    method: 'PUT',
    body: data,
  })
}

//supprime le projets complet
export async function fetchDeleteProject(
  projectId: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/projects/${projectId}`, { method: 'DELETE', auth: true })
}

// ─── Contributeurs ───────────────────────────────────────────────────────────

export interface AddContributorBody {
  email: string
  role?: 'ADMIN' | 'CONTRIBUTOR'
}

export interface AddContributorResponse {
  success: boolean
  message: string
}

//pour ajouter dans un projet existant
export function fetchAddContributor(
  projectId: string,
  data: AddContributorBody
): Promise<AddContributorResponse> {
  return apiRequest<AddContributorResponse>(
    `/projects/${projectId}/contributors`,
    {
      method: 'POST',
      body: data,
    }
  )
}

//pour supprimer dans un projet existant
export function fetchRemoveContributor(
  projectId: string,
  userId: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/projects/${projectId}/contributors/${userId}`, {
    method: 'DELETE',
  })
}

// ─── Recherche un utlisateur  ──────────────────────────────────────────────────────────────────

export interface SearchUserProject {
  id: string
  email: string
  name: string
}

export interface SearchUserProjectResponse {
  success: boolean
  message: string
  data: {
    users: SearchUserProject[]
  }
}

// pour la création du projet
export function fetchSearchUsersProject(
  query: string
): Promise<SearchUserProjectResponse> {
  return apiRequest<SearchUserProjectResponse>(`/users/search?query=${query}`)
}

// ─── créer un tâche ───────────────────────────────────────────────────────────

export interface AddTaskBody {
  title: string
  description?: string
  dueDate?: string
  assigneeIds?: string[]
}

export interface AddTaskBodyResponse {
  success: boolean
  message: string
}

export function fetchCreateTask(
  projectId: string,
  data: AddTaskBody
): Promise<AddTaskBodyResponse> {
  return apiRequest<AddTaskBodyResponse>(`/projects/${projectId}/tasks`, {
    method: 'POST',
    body: data,
  })
}

export interface UpdateTaskBody {
  title?: string
  description?: string
  dueDate?: string
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE'
  assigneeIds?: string[]
}

export interface UpdateTaskBodyResponse {
  success: boolean
  message: string
}

export function fetchUpdateTask(
  projectId: string,
  taskId: string,
  data: UpdateTaskBody
): Promise<UpdateTaskBodyResponse> {
  return apiRequest<UpdateTaskBodyResponse>(
    `/projects/${projectId}/tasks/${taskId}`,
    {
      method: 'PUT',
      body: data,
    }
  )
}

//pour supprimer dans une tâche existant
export function fetchRemoveTask(
  projectId: string,
  taskId: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/projects/${projectId}/tasks/${taskId}`, {
    method: 'DELETE',
  })
}
