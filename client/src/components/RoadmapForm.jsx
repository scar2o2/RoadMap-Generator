import React, { useState } from 'react';

export default function RoadmapForm({ onResult }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e?.preventDefault();
    setError('');
    if (!topic.trim()) return setError('Please enter a topic');
    setLoading(true);
    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      onResult(data);
    } catch (err) {
      setError(err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="p-4 bg-white rounded-lg shadow" onSubmit={submit}>
      <label className="block mb-2 font-medium">What do you want to learn?</label>
      <input
        value={topic}
        onChange={e => setTopic(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        placeholder="e.g. 'React performance optimization'"/>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
          {loading ? 'Generating…' : 'Generate Roadmap'}
        </button>
        <button type="button" onClick={() => { setTopic(''); setError(''); }} className="px-4 py-2 border rounded">
          Reset
        </button>
      </div>
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </form>
  );
}
