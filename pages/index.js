import { useState } from "react";
import { useRouter } from "next/router";


export default function Home() {
  const [formData, setFormData] = useState({
    link: "",
    description: "",
    goal: "",
    challenge: "",
    tone: "professional",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch("/api/generate-skope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log("AI Scope Response:", data);
      localStorage.setItem("skopeData", JSON.stringify(data));
      router.push("/dashboard");

      
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold font-mono font-m mb-4">Start Your Skope</h1>
        <p className="text-gray-600 mb-6">Tell us about your project and we'll scope it for you.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-mono font-medium text-gray-700">Project Link (optional)</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://www.yoursite.com"
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Project Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us what you're building and who it's for..."
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Current Goal</label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Select a goal</option>
              <option value="launch">Launch MVP</option>
              <option value="feedback">Get user feedback</option>
              <option value="scale">Scale product</option>
              <option value="improve">Improve UX</option>
              <option value="explore">Just exploring ideas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Biggest Challenge (optional)</label>
            <input
              type="text"
              name="challenge"
              value={formData.challenge}
              onChange={handleChange}
              placeholder="e.g. not sure what to prioritize"
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tone of Output</label>
            <select
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="technical">Technical</option>
              <option value="casual">Casual</option>
              <option value="surprise">Surprise me</option>
            </select>
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md transition ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Generating your Skope..." : "Generate My Skope"}
          </button>

        </form>
      </div>
    </main>
  );
}


