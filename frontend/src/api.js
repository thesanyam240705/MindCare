export async function submitCheckIn(answers) {
  const response = await fetch('/api/check-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || 'Unable to submit check-in. Please try again.')
  }
  return payload
}

export async function getDailyAffirmation() {
  const response = await fetch('/api/affirmation')
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || 'Unable to load a daily affirmation.')
  }
  return payload.message
}
