export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).end("Method not allowed");
    }
  
    const { link, description, goal, challenge, tone } = req.body;
  
    const prompt = `
  You are a product strategist AI assistant. A user is building a new project. Based on the info below, generate:
  1. A short summary of their goal
  2. 3–5 high-value scopes with titles + short descriptions
  3. A suggested 3-phase roadmap (1–2 sprints per phase)
  
  Respond in plain JSON format with keys: goalSummary, scopes, roadmap.
  
  Project Link: ${link || "none"}
  Project Description: ${description}
  Current Goal: ${goal}
  Challenge: ${challenge || "none"}
  Preferred Tone: ${tone}
  `;
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });
  
      const data = await response.json();
      const aiMessage = data.choices[0].message.content;
      const parsed = JSON.parse(aiMessage);
  
      res.status(200).json(parsed);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong generating your skope." });
    }
  }
  