import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [skope, setSkope] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("skopeData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // 🔍 Some APIs store roadmap as a stringified JSON — so handle both cases
        const parsedRoadmap = typeof parsed.roadmap === "string"
          ? JSON.parse(parsed.roadmap)
          : parsed.roadmap;

        setSkope({ ...parsed, roadmap: parsedRoadmap });
      } catch (err) {
        console.error("Failed to parse local Skope data:", err);
      }
    }
  }, []);

  if (!skope) {
    return <div className="p-8 text-center">Loading your Skope...</div>;
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-mono mb-4">🧠 Your Skope Dashboard</h1>

        {/* 🎯 Goal Summary */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">🎯 Goal Summary</h2>
          <p className="bg-white p-4 rounded-md shadow">{skope.goalSummary}</p>
        </section>

        {/* 📦 Suggested Scopes */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">📦 Suggested Scopes</h2>
          <ul className="space-y-3">
            {skope.scopes?.map((scope, i) => (
              <li key={i} className="bg-white p-4 rounded-md shadow">
                <h3 className="font-bold">{scope.title}</h3>
                <p>{scope.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 🗺️ Suggested Roadmap */}
        <section>
          <h2 className="text-xl font-semibold mb-2">🗺️ Suggested Roadmap</h2>
          {Array.isArray(skope.roadmap) && skope.roadmap.length > 0 ? (
            <ol className="list-decimal ml-6 space-y-2 bg-white p-4 rounded-md shadow">
              {skope.roadmap.map((item, i) => (
                <li key={i}>
                  <strong>{item.phase}:</strong>
                  <ul className="ml-4 list-disc mt-1 space-y-1">
                    {item.sprints?.map((sprintObj, j) => {
                      const [_, sprintDesc] = Object.entries(sprintObj)[0];
                      return <li key={j}>{sprintDesc}</li>;
                    })}
                  </ul>
                </li>
              ))}
            </ol>
          ) : (
            <p className="italic text-gray-500">No roadmap data found.</p>
          )}
        </section>
      </div>
    </main>
  );
}
