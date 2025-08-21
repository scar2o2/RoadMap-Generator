import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/roadmap", async (req, res) => {
  const { topic } = req.body;

  const prompt = `
  Generate a detailed learning roadmap for: "${topic}".

  Format the response strictly as valid JSON in this structure:
  {
    "roadmap": [
      {
        "stage": "Stage 1",
        "heading": "Learn Basics of React",
        "description": "Understand JSX, components, and props.",
        "techStack": [
          {
            "name": "JSX",
            "topics": ["Syntax", "Embedding expressions", "Attributes"...]
          },
          {
            "name": "Components",
            "topics": ["Functional components", "Props", "Children"...]
          }
        ]
      }
    ]
  }

  Rules:
  - Give detailed Roadmap which covers everything from fundamentals to mastering the topic
  - Each roadmap step must have heading, description, and techStack.
  - techStack should be an array of objects.
  - Each techStack item must contain a "name" and an array of "topics".
  - Do not include markdown, code fences, or text outside JSON.
  `;

  try {
    const response = await model.generateContent(prompt);
    let text = response.response.text();

    console.log("🔍 RAW AI RESPONSE:", text);

    // Cleanup output (remove ```json, stray text, etc.)
    text = text.replace(/```json|```/g, "").trim();
    const match = text.match(/\{[\s\S]*\}/);

    let roadmap;
    try {
      roadmap = JSON.parse(match ? match[0] : text);
    } catch (e) {
      console.error("❌ JSON Parse Error:", e.message, text);
      roadmap = {
        roadmap: [
          {
            stage: "Error",
            heading: "Invalid JSON from AI",
            description: "Try again. AI response was not valid JSON.",
            techStack: [],
          },
        ],
      };
    }

    res.json(roadmap);
  } catch (err) {
    console.error("❌ API Error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000; // Use Render's assigned port
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

