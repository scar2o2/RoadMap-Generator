import React from 'react';

export default function RoadmapView({ data }) {
  if (!data) return null;
  // if model returned "raw" fallback, show that text
  if (data.raw) {
    return (
      <div className="mt-4 p-4 bg-white rounded shadow">
        <h3 className="font-semibold">Raw output</h3>
        <pre className="whitespace-pre-wrap">{data.raw}</pre>
      </div>
    );
  }

  const r = data.roadmap || data;
  return (
    <div className="mt-4 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">{r.title || 'Roadmap'}</h2>
      <p className="mt-2">{r.overview}</p>

      <section className="mt-4">
        <h3 className="font-semibold">Prerequisites</h3>
        <ul className="list-disc ml-5">
          {(r.prerequisites || []).map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </section>

      <section className="mt-4">
        <h3 className="font-semibold">Milestones</h3>
        <ol className="list-decimal ml-5">
          {(r.milestones || []).map((m, i) =>
            <li key={i} className="mb-2">
              <strong>Week {m.week}:</strong> {m.objective}
              <div className="text-sm text-slate-600">Deliverable: {m.deliverable}</div>
            </li>
          )}
        </ol>
      </section>

      <section className="mt-4">
        <h3 className="font-semibold">Resources</h3>
        <ul className="ml-5">
          {(r.resources || []).map((rs, i) =>
            <li key={i}><a href={rs.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600">{rs.title}</a> — {rs.type} {rs.notes ? `• ${rs.notes}` : ''}</li>
          )}
        </ul>
      </section>
    </div>
  );
}
