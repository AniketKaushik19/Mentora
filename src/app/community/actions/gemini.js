"use server"
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = process.env.GROQ_API_BASE_URL || "https://api.groq.com/openai/v1";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

function extractGroqText(responseJson) {
    if (!responseJson) return "";
    if (typeof responseJson.output_text === "string" && responseJson.output_text.trim()) {
        return responseJson.output_text.trim();
    }

    const output = responseJson.output;
    if (Array.isArray(output) && output.length > 0) {
        return output
            .map((item) => {
                if (typeof item === "string") return item;
                if (item?.content && Array.isArray(item.content)) {
                    return item.content.map((chunk) => chunk?.text || "").join("");
                }
                return "";
            })
            .join("")
            .trim();
    }

    return "";
}

async function callGroq(prompt, model = GROQ_MODEL) {
    if (!GROQ_API_KEY) {
        throw new Error("Missing GROQ_API_KEY environment variable")
    }

    const response = await fetch(`${GROQ_BASE_URL}/responses`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model,
            input: prompt,
            max_output_tokens: 1400,
        }),
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Groq API error: ${response.status} ${response.statusText} - ${errorDetails}`);
    }

    const json = await response.json();
    const text = extractGroqText(json);
    return text.replace(/```html|```/gi, "").trim();
}

export async function generateBlogContent(title, category = "", tags = []) {
    try {
        if (!title || title.trim().length === 0) {
            throw new Error("Title is required to generate content")
        }

        const prompt = `Write a comprehensive blog post with the title: "${title}"

${category ? `Category: ${category}` : ""}
${tags.length > 0 ? `Tags: ${tags.join(", ")}` : ""}

Requirements:
- Write engaging, informative content that matches the title
- Use proper HTML formatting with headers (h2, h3), paragraphs, lists, and emphasis
- Keep the content concise and limited to about 100 words only
- Write in a conversational yet professional tone
- Include up to 2 main sections with clear subheadings
- Include practical insights, examples, or actionable advice when relevant
- Use <h2> for main sections and <h3> for subsections
- Use <p> tags for paragraphs
- Use <ul> and <li> for bullet points when appropriate
- Use <strong> and <em> for emphasis
- Ensure the content is original and valuable to readers

Do not include the title in the content as it will be added separately.
Start directly with the introduction paragraph.`;

        const content = await callGroq(prompt);
        if (!content || content.length < 100) {
            throw new Error("Generated content is too short or empty")
        }

        return {
            success: true,
            content,
        }
    } catch (error) {
        console.error("Groq API Error:", error)
        if (error.message?.includes("Missing GROQ_API_KEY")) {
            return {
                success: false,
                error: "AI service is not configured. Please set GROQ_API_KEY.",
            }
        }
        if (error.message?.includes("quota") || error.message?.includes("limit")) {
            return {
                success: false,
                error: "AI service is temporarily unavailable. Please try again later.",
            }
        }

        return {
            success: false,
            error: error.message || "Failed to generate content. Please try again.",
        }
    }
}

export async function improveContent(currentContent, improvementType = "enhance") {
    try {
        if (!currentContent || currentContent.trim().length === 0) {
            throw new Error("Content is required for improvement")
        }

        let prompt = "";
        switch (improvementType) {
            case "expand":
                prompt = `Take this blog content and expand it with more details, examples, and insights:

${currentContent}

Requirements:
- Keep the existing structure and main points
- Add more depth and detail to each section
- Include practical examples and insights
- Maintain the original tone and style
- Return the improved content in the same HTML format`;
                break;
            case "simplify":
                prompt = `Take this blog content and make it more concise and easier to read:

${currentContent}

Requirements:
- Keep all main points but make them clearer
- Remove unnecessary complexity
- Use simpler language where possible
- Maintain the HTML formatting
- Keep the essential information`;
                break;
            default:
                prompt = `Improve this blog content by making it more engaging and well-structured:

${currentContent}

Requirements:
- Improve the flow and readability
- Add engaging transitions between sections
- Enhance with better examples or explanations
- Maintain the original HTML structure
- Keep the same length approximately
- Make it more compelling to read`;
        }

        const content = await callGroq(prompt);
        return {
            success: true,
            content,
        }
    } catch (error) {
        console.error("Content improvement error:", error)
        return {
            success: false,
            error: error.message || "Failed to improve content. Please try again.",
        }
    }
}
