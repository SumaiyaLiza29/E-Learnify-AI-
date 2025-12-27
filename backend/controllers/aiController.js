require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Simple topic filter (business rule)
 */
const isEducationalQuery = (text) => {
  const blockedKeywords = [
    "joke",
    "story",
    "girlfriend",
    "boyfriend",
    "dating",
    "hack",
    "cheat",
    "money",
    "business",
    "investment",
    "crypto",
    "politics",
    "religion",
    "adult",
  ];

  const lower = text.toLowerCase();
  return !blockedKeywords.some((word) => lower.includes(word));
};

/**
 * AI Tutor Controller
 */
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 🔒 BUSINESS RULE: Tutor only
    if (!isEducationalQuery(message)) {
      return res.status(403).json({
        success: false,
        reply:
          "❌ I am only available as a learning tutor. Please ask academic or study-related questions.",
      });
    }

    // 🧠 Tutor system instruction
    const response = await client.responses.create({
      model: "gpt-5-nano",
      input: [
        {
          role: "system",
          content:
            "You are an educational tutor for an e-learning platform. " +
            "You must only explain academic concepts, help with learning, " +
            "and guide students step by step. " +
            "Do not engage in casual conversation, personal advice, " +
            "business, politics, or entertainment.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      success: true,
      reply: response.output_text,
    });
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({
      success: false,
      error: "AI tutor service failed",
    });
  }
};

module.exports = { chatWithAI };
