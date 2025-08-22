'use client';
import { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function StudyCalendar({ events, onEventChange }) {
  const calendarRef = useRef(null);

  // Map the incoming events to FullCalendar's event object structure
  const formattedEvents = events.map(event => ({
    id: event.id || crypto.randomUUID(), // Use crypto.randomUUID() for better uniqueness
    title: event.title,
    start: event.start,
    end: event.end,
    description: event.description,
    backgroundColor: '#6366F1', // Tailwind's indigo-500
    borderColor: '#4F46E5',   // Tailwind's indigo-600
    textColor: '#ffffff',
  }));

  const handleEventChangeFC = (changeInfo) => {
    // This is called when an existing event is dragged or resized
    const updatedEvents = events.map(event =>
      event.id === changeInfo.event.id
        ? {
            ...event,
            title: changeInfo.event.title,
            start: changeInfo.event.startStr,
            end: changeInfo.event.endStr,
            description: changeInfo.event.extendedProps.description,
          }
        : event
    );
    onEventChange(updatedEvents);
  };

  const handleEventRemove = (removeInfo) => {
    // This is called automatically by FullCalendar when an event is removed
    const filteredEvents = events.filter(event => event.id !== removeInfo.event.id);
    onEventChange(filteredEvents);
  };

  const handleEventClick = (clickInfo) => {
    // Handle clicks on events, e.g., to delete
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove(); // This triggers the handleEventRemove callback
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Study Calendar</h2>
      {formattedEvents.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No study plan generated yet. Use the form on the left to create one!</p>
          {/* Inline SVG for calendar icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-x mx-auto mt-4 text-gray-400">
            <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m14.5 17.5-5-5"/><path d="m9.5 17.5 5-5"/>
          </svg>
        </div>
      ) : (
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          editable={true}
          selectable={true}
          weekends={true}
          events={formattedEvents}
          eventContent={(arg) => (
            <div className="p-1 text-xs">
              <div className="font-semibold">{arg.event.title}</div>
              {arg.event.extendedProps.description && (
                <div className="text-gray-100 hidden sm:block">{arg.event.extendedProps.description}</div>
              )}
            </div>
          )}
          eventDrop={handleEventChangeFC}
          eventResize={handleEventChangeFC}
          eventClick={handleEventClick}
          eventRemove={handleEventRemove} // Connect the event remove handler
          height="auto"
          contentHeight="auto"
          aspectRatio={1.8}
        />
      )}
    </div>
  );
}