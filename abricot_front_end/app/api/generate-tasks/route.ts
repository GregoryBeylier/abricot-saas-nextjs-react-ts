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
              text: `Tu es un assistant de gestion de projet. Décompose la demande suivante en tâches concrètes et distinctes.

Demande : "${prompt}"

Règles strictes :
- Chaque tâche doit être UNIQUE et couvrir un aspect différent de la demande
- Aucune répétition : ne reformule pas la même tâche avec des mots différents
- Sois spécifique : "Responsive navbar mobile" plutôt que "Faire le responsive"
- Entre 4 et 8 tâches maximum
- Si la demande est simple, génère moins de tâches plutôt que d'en inventer

Retourne UNIQUEMENT un tableau JSON valide contenant des objets avec exactement deux champs :
- "title" : titre court et spécifique (string, max 60 caractères)
- "description" : ce que la tâche implique concrètement en 1 phrase (string)

La réponse doit commencer par [ et finir par ]. Aucun texte avant ou après. Aucun markdown.

Exemple pour "faire le responsive mobile" :
[{"title":"Responsive navbar mobile","description":"Adapter la barre de navigation pour les petits écrans avec menu hamburger."},{"title":"Responsive page dashboard","description":"Passer les cartes en colonne unique sur mobile."},{"title":"Responsive formulaires","description":"Adapter les inputs et boutons pour les écrans tactiles."}]`
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
