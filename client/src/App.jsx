import { useState } from "react";
import Roadmap from "./RoadMap";

function App() {
  const [topic, setTopic] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setRoadmap([]);

    fetch(`${import.meta.env.VITE_API_URL}/api/roadmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.roadmap) {
          setRoadmap(data.roadmap);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Custom Learning Roadmap</h1>

      {/* Input box + button */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter a topic (e.g. React, AI, Cybersecurity...)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="border border-gray-400 rounded-lg px-4 py-2 w-80"
        />
        <button
          onClick={handleGenerate}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
        >
          Generate
        </button>
      </div>

      {/* Status */}
      {loading && <p>⏳ Generating roadmap...</p>}

      {/* Roadmap */}
      {roadmap.length > 0 && <Roadmap roadmap={roadmap} />}
    </div>
  );
}

export default App;
