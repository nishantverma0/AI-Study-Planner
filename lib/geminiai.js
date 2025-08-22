import { GoogleGenerativeAI } from '@google/generative-ai';

// Access your API key from the server-side environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Check if the API key is available. If not, throw an error.
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set. Please set it in your .env.local file.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Export the configured model instance
export default model;