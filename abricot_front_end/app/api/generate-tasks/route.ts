import { NextRequest, NextResponse } from 'next/server'

// POST /api/generate-tasks
// Reçoit un prompt, envoie à Gemini, retourne une liste de tâches structurées
export async function POST(req: NextRequest) {
  const { prompt } = await req.json()

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt manquant' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Clé API manquante' }, { status: 500 })
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{
              text: `Tu es un assistant de gestion de projet. Génère une liste de tâches basée sur la demande suivante.

Demande : "${prompt}"

Retourne UNIQUEMENT un tableau JSON valide contenant des objets avec exactement deux champs :
- "title" : titre court de la tâche (string)
- "description" : explication en 1-2 phrases (string)

La réponse doit commencer par [ et finir par ]. Aucun texte avant ou après. Aucun markdown.

Exemple de format :
[{"title":"Créer la page login","description":"Formulaire avec email et mot de passe avec validation."},{"title":"Configurer le JWT","description":"Mise en place du token JWT stocké en cookie sécurisé."}]`
            }],
          },
        ],
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json({ error: 'Erreur Gemini', raw: data }, { status: 500 })
  }

  // Extraire le texte de la réponse Gemini
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  if (!text) {
    return NextResponse.json({ error: 'Réponse vide de Gemini', raw: data }, { status: 500 })
  }

  try {
    // Nettoyer le texte au cas où Gemini ajoute des backticks
    const cleaned = text.replace(/```json|```/g, '').trim()
    const tasks = JSON.parse(cleaned)
    return NextResponse.json({ tasks })
  } catch {
    return NextResponse.json({ error: 'Réponse IA invalide', raw: text }, { status: 500 })
  }
}
