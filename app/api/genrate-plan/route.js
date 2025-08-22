import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { subjects, deadline } = await request.json();

    // Basic server-side validation
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0 || !deadline) {
      return NextResponse.json({ error: 'Invalid input. Subjects and deadline are required.' }, { status: 400 });
    }

    // Construct the detailed prompt for the AI
    const formattedSubjects = subjects.map(s =>
        `- Subject: ${s.name}\n  Topics: ${s.topics}\n  Difficulty: ${s.difficulty}`
    ).join('\n');
    
    const prompt = `
    You are an expert study planner. Create a detailed study schedule for a student based on the following information:

    Subjects and Topics:
    ${formattedSubjects}

    Exam Deadline: ${deadline}

    Instructions:
    1. Generate a study plan that distributes study sessions for each topic across the days leading up to the deadline.
    2. Prioritize harder topics and allocate more time for them.
    3. Ensure a balanced schedule, mixing different subjects.
    4. Each study session should be an event with a 'title', 'start' (ISO 8601 date-time string, e.g., '2024-07-25T09:00:00'), 'end' (ISO 8601 date-time string), and 'description'.
    5. The 'title' should be concise (e.g., "Math: Limits").
    6. The 'description' should include the subject, specific topics, and suggested activities (e.g., "Review limits, practice problems, watch tutorial").
    7. Assume study sessions are typically 1-2 hours long, but adjust based on difficulty and total time available.
    8. Do not schedule sessions on the deadline day itself, as that's for the exam.
    9. Provide the output as a JSON array of study event objects.

    Example of an event object:
    {
      "title": "Physics: Kinematics",
      "start": "2024-07-26T10:00:00",
      "end": "2024-07-26T11:30:00",
      "description": "Review kinematics equations, solve projectile motion problems."
    }
    `;
    
    // Construct the full payload for the Gemini API
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        "title": { "type": "STRING" },
                        "start": { "type": "STRING" },
                        "end": { "type": "STRING" },
                        "description": { "type": "STRING" }
                    },
                    required: ["title", "start", "end", "description"]
                }
            }
        }
    };
    
    // Securely get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error:", errorText);
        return NextResponse.json({ error: `Gemini API request failed. Please check your API key and server logs.` }, { status: response.status });
    }

    const result = await response.json();

    // Add robust error handling for the API response structure
    if (!result.candidates || !result.candidates[0] || !result.candidates[0].content || !result.candidates[0].content.parts[0]) {
        console.error("Invalid response structure from Gemini API:", result);
        return NextResponse.json({ error: "Failed to generate plan due to an unexpected AI response format." }, { status: 500 });
    }

    const jsonString = result.candidates[0].content.parts[0].text;
    const studyPlan = JSON.parse(jsonString);

    return NextResponse.json(studyPlan);

  } catch (error) {
    console.error("Error in generate API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
