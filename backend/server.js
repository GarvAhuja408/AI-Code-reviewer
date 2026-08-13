const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

app.get("/", (req, res) => {
    res.send("AI Code Reviewer Backend Running");
});

app.post("/api/review", async (req, res) => {
    try {
        const { code, language, action } = req.body;

        if (!code) {
            return res.status(400).json({
                message: "Code is required"
            });
        }

        let prompt;

        if (action === "fix") {
            prompt = `
You are an expert ${language} programmer.

Review the EXACT code provided below.

Find:
- Syntax errors
- Logical errors
- Runtime errors
- Bad practices

IMPORTANT:
- Treat the provided code as the only source of truth.
- Only report errors that actually exist.
- Do not invent missing semicolons, brackets, parentheses, quotes, or other syntax.
- If the code is correct, clearly say "No errors found."
- Provide corrected code only if a correction is actually needed.
- Keep the answer concise.

Use exactly this format:

PROBLEM:
Explain the actual problem briefly.
If there is no problem, write:
No errors found.

FIX:
Provide ONLY the corrected ${language} code.
If no fix is required, write:
No changes required.

SUGGESTIONS:
- Give 1 or 2 useful suggestions.
- Do not suggest unrelated changes.

COMPLEXITY:
Time: O(...)
Space: O(...)

Do not use Markdown.
Do not use tables.
Do not use #, ##, ###, ** or backticks.

CODE:
${code}
`;
        } else if (action === "explain") {
            prompt = `
You are an expert ${language} programmer.

Explain the EXACT code provided below.

IMPORTANT:
- Treat the provided code as the only source of truth.
- Carefully inspect the actual code.
- Do not invent errors.
- Do not claim something is missing unless it is actually missing.
- Do not modify or reconstruct the code.
- If the code is syntactically correct, say:
"The code is syntactically correct."
- Only give suggestions that are relevant to the actual code.
- Keep the explanation concise.

Use this format:

WHAT THE CODE DOES:
Brief explanation.

HOW IT WORKS:
Explain the important steps.

IMPORTANT CONCEPTS:
- Concept 1
- Concept 2
- Concept 3

COMPLEXITY:
Time: O(...)
Space: O(...)

SUGGESTIONS:
Give 1 or 2 useful suggestions.
If the code is already correct, say:
No major improvements are required.

Do not use Markdown.
Do not use tables.
Do not use #, ##, ###, ** or backticks.

CODE START
${code}
CODE END
`;
        } else {
            return res.status(400).json({
                message: "Invalid action"
            });
        }

        const response = await client.responses.create({
            model: "openai/gpt-oss-20b",
            input: prompt
        });

        const result = response.output_text;

        if (action === "fix") {
            const problemMatch = result.match(
                /PROBLEM:\s*([\s\S]*?)(?=\s*FIX:)/i
            );

            const fixedCodeMatch = result.match(
                /FIX:\s*([\s\S]*?)(?=\s*SUGGESTIONS:)/i
            );

            const suggestionsMatch = result.match(
                /SUGGESTIONS:\s*([\s\S]*?)(?=\s*COMPLEXITY:)/i
            );

            const complexityMatch = result.match(
                /COMPLEXITY:\s*([\s\S]*)/i
            );

            let fixedCode = fixedCodeMatch
                ? fixedCodeMatch[1].trim()
                : "";

            fixedCode = fixedCode
                .replace(/^```[a-zA-Z]*\n/, "")
                .replace(/\n```$/, "")
                .trim();

            res.json({
                result: problemMatch
                    ? problemMatch[1].trim()
                    : result,

                fixedCode: fixedCode,

                suggestions: suggestionsMatch
                    ? suggestionsMatch[1].trim()
                    : "",

                complexity: complexityMatch
                    ? complexityMatch[1].trim()
                    : ""
            });
        } else {
            res.json({
                result: result
            });
        }

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});