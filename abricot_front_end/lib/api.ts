import Cookie from 'js-cookie'

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
