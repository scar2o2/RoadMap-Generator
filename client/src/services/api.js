// client/src/services/api.js
export async function generateRoadmap(topic) {
  const res = await fetch('/api/roadmap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Request failed');
  }
  return res.json();
}
