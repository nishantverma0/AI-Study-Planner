🤖 AI-Powered Study Planner
An intelligent web application that uses the Google Gemini API to generate personalized, dynamic study schedules. Users can input their subjects, topics, and deadlines to receive an optimized study plan displayed on an interactive calendar.

✨ Features
Dynamic Subject Forms: Easily add or remove multiple subjects with varying topics and difficulty levels.

AI-Powered Schedule Generation: Leverages the Gemini API to create a balanced and prioritized study plan based on user input.

Interactive Calendar View: Displays the generated schedule on a FullCalendar component, allowing users to drag, drop, and resize study sessions.

Persistent Sessions: Uses Firebase Authentication (Anonymous) to create a unique session for each user.

Real-time Data Sync: Saves and syncs the user's study plan in real-time with Firestore, so their schedule is always up-to-date.

Secure API Handling: All calls to the Gemini API are handled securely through a Next.js API route, ensuring API keys are never exposed to the client.

🛠️ Tech Stack
Framework: Next.js (with React)

Styling: Tailwind CSS

Backend & Database: Firebase (Authentication and Firestore)

AI Model: Google Gemini API

Calendar: FullCalendar

📂 Project Structure
A brief overview of the key files and folders in this project:

/
├── app/
│   ├── api/genrate-plan/route.js  # Secure server-side route to call the Gemini API
│   └── page.js                    # Main application component and logic
├── components/
│   ├── Header.js                  # The top navigation header
│   ├── StudyCalendar.js           # The interactive calendar component
│   └── StudyPlanForm.js           # The form for user input
├── lib/
│   └── firebase.js                # Firebase initialization and configuration
├── .env.local                     # For storing secret API keys and environment variables
└── jsconfig.json                  # Configures path aliases for cleaner imports

🚀 Getting Started
Follow these instructions to set up and run the project locally.

1. Prerequisites
Node.js (v18 or later)

npm or yarn

2. Installation
Clone the repository and install the dependencies:

git clone [https://github.com/your-username/study-planner.git](https://github.com/your-username/study-planner.git)
cd study-planner
npm install

3. Configuration
You will need to set up API keys for both Firebase and Google Gemini.

Create a .env.local file in the root of the project.

Add your Firebase configuration:

Go to your Firebase project settings.

Under "Your apps," find your web app's SDK configuration.

Copy the keys into your .env.local file, prefixing each with NEXT_PUBLIC_.

Add your Google Gemini API key:

Go to Google AI Studio and create an API key.

Add it to your .env.local file.

Your final .env.local file should look like this:

# Firebase Keys (for the browser)
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Gemini API Key (for the server ONLY)
GEMINI_API_KEY="your_secret_gemini_api_key"

Enable Firebase Services:

In the Firebase Console, go to Authentication -> Sign-in method and enable the Anonymous provider.

Go to Firestore Database and create a database.

4. Run the Development Server
Start the application:

npm run dev

Open http://localhost:3000 in your browser to see the result.

Usage
Enter Subjects: Fill in the "Subject Name" and "Key Topics" for at least one subject.

Add More Subjects: Click "Add Another Subject" if needed.

Set Deadline: Choose your exam deadline from the date picker.

Generate Plan: Click "Generate Study Plan" and wait for the AI to create your schedule.

Interact with Calendar: View