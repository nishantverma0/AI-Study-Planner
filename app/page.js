'use client';

import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

// CORRECTED: Using relative paths instead of aliases
import Header from '../components/Header';
import StudyPlanForm from '../components/StudyPlanForm';
import StudyCalendar from '../components/StudyCalendar';
import { db, auth } from '../lib/firebase'; 

export default function Home() {
  const [studyEvents, setStudyEvents] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Handles Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        try {
          const userCredential = await signInAnonymously(auth);
          setUserId(userCredential.user.uid);
        } catch (authError) {
          console.error("Anonymous sign-in failed:", authError);
          setError("Could not create a user session. Data will not be saved.");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Loads and listens for the user's study plan from Firestore
  useEffect(() => {
    if (!userId) return;
    const studyPlanDocRef = doc(db, 'studyPlans', userId);
    const unsubscribe = onSnapshot(studyPlanDocRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().events) {
        setStudyEvents(docSnap.data().events);
      } else {
        setStudyEvents([]);
      }
    }, (snapshotError) => {
      console.error("Firestore snapshot error:", snapshotError);
      setError("Failed to load study plan from the database.");
    });
    return () => unsubscribe();
  }, [userId]);

  // Saves the current study plan to Firestore
  const saveStudyPlanToFirestore = async (events) => {
    if (!userId) return;
    const studyPlanDocRef = doc(db, 'studyPlans', userId);
    try {
      await setDoc(studyPlanDocRef, { events: events });
    } catch (e) {
      console.error("Error saving to Firestore:", e);
      setError("Failed to save your plan.");
    }
  };

  // Calls the secure server-side API route to generate a new study plan
  const generateStudyPlan = async (subjects, deadline) => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/genrate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects, deadline }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate plan.');
      }
      const studyPlan = await response.json();
      setStudyEvents(studyPlan);
      await saveStudyPlanToFirestore(studyPlan);
    } catch (err) {
      setError(err.message);
      console.error('Detailed Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handles changes from the calendar (drag/drop, resize, delete)
  const handleEventChange = async (events) => {
    setStudyEvents(events);
    await saveStudyPlanToFirestore(events);
  };

  // The JSX for rendering the component UI
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Study Planner</h1>
          <p className="text-gray-600">
            Create personalized study schedules with AI. Enter your subjects, topics, and deadline to get an optimized plan.
          </p>
          {userId && (
            <p className="text-sm text-gray-500 mt-2">
              Your User ID: <span className="font-mono text-blue-700 break-all">{userId}</span>
            </p>
          )}
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert text-red-500 mr-2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <StudyPlanForm
              onGeneratePlan={generateStudyPlan}
              isGenerating={isGenerating}
            />
          </div>
          <div>
            <StudyCalendar
              events={studyEvents}
              onEventChange={handleEventChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
