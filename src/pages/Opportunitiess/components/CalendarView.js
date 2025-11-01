import { useState, useEffect } from "react";
import moment from "moment-timezone";

const CalendarView = ({ jobs }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("month"); // 'month', 'week', 'day'

  // Process job data into calendar events
  useEffect(() => {
    const processEvents = () => {
      const newEvents = jobs
        .map((job) => {
          if (job.interviewDetails && job.interviewDetails.select_date) {
            return {
              id: job._id,
              title: `${job.user_id.first_name} ${job.user_id.last_name} - ${job.job_details.job_title}`,
              start: new Date(job.interviewDetails.select_date),
              end: new Date(job.interviewDetails.select_date + 3600000), // 1 hour duration
              job: job,
            };
          }
          return null;
        })
        .filter((event) => event !== null);

      setEvents(newEvents);
    };

    processEvents();
  }, [jobs]);

  // Navigation functions
  const next = () => {
    if (view === "month") {
      setCurrentDate(currentDate.clone().add(1, "month"));
    } else if (view === "week") {
      setCurrentDate(currentDate.clone().add(1, "week"));
    } else {
      setCurrentDate(currentDate.clone().add(1, "day"));
    }
  };

  const prev = () => {
    if (view === "month") {
      setCurrentDate(currentDate.clone().subtract(1, "month"));
    } else if (view === "week") {
      setCurrentDate(currentDate.clone().subtract(1, "week"));
    } else {
      setCurrentDate(currentDate.clone().subtract(1, "day"));
    }
  };

  const goToToday = () => {
    setCurrentDate(moment());
  };

  // Render month view
  const renderMonthView = () => {
    const startOfMonth = currentDate.clone().startOf("month");
    const endOfMonth = currentDate.clone().endOf("month");
    const startDay = startOfMonth.day();
    const daysInMonth = currentDate.daysInMonth();

    const weeks = [];
    let days = [];

    // Add empty cells for days before the start of the month
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 p-1 border border-gray-200 glassy-card"
        ></div>
      );
    }

    // Add cells for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = currentDate.clone().date(day);
      const dayEvents = events.filter((event) =>
        moment(event.start).isSame(date, "day")
      );

      days.push(
        <div
          key={day}
          className={`h-24 p-1 border border-gray-200 ${
            moment().isSame(date, "day") ? "glassy-card" : ""
          }`}
        >
          <div className="flex justify-between">
            <span
              className={`text-sm font-medium ${
                moment().isSame(date, "day") ? "text-blue-600" : ""
              }`}
            >
              {day}
            </span>
            {day === 1 && <span className="text-xs glassy-text-secondary">{date.format('MMM')}</span>}
          </div>
          <div className="mt-1 overflow-y-auto max-h-16">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="text-xs p-1 mb-1 glassy-card rounded cursor-pointer hover:bg-blue-200"
                onClick={() => {
                  setSelectedEvent(event);
                  setIsModalOpen(true);
                }}
              >
                {moment(event.start).format("HH:mm")} - {event.title}
              </div>
            ))}
          </div>
        </div>
      );

      // Start a new row each week
      if ((startDay + day) % 7 === 0 || day === daysInMonth) {
        weeks.push(
          <div key={day} className="grid grid-cols-7">
            {days}
          </div>
        );
        days = [];
      }
    }

    return (
      <div>
        <div className="grid grid-cols-7 glassy-card font-medium text-center py-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div>{weeks}</div>
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const startOfWeek = currentDate.clone().startOf("week");
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.clone().add(i, "days");
      const dayEvents = events.filter((event) =>
        moment(event.start).isSame(day, "day")
      );

      days.push(
        <div
          key={i}
          className="flex-1 border-r border-gray-200 last:border-r-0"
        >
          <div
            className={`text-center p-2 font-medium ${
              moment().isSame(day, "day") ? "glassy-card" : ""
            }`}
          >
            <div>{day.format("ddd")}</div>
            <div
              className={`text-lg ${
                moment().isSame(day, "day") ? "text-blue-600 font-bold" : ""
              }`}
            >
              {day.format("D")}
            </div>
          </div>
          <div className="p-2 h-96 overflow-y-auto">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="p-2 mb-2 glassy-card rounded cursor-pointer hover:bg-blue-200"
                onClick={() => {
                  setSelectedEvent(event);
                  setIsModalOpen(true);
                }}
              >
                <div className="font-medium">
                  {moment(event.start).format("HH:mm")}
                </div>
                <div className="text-sm">{event.title}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <div className="flex">{days}</div>;
  };

  // Render day view
  const renderDayView = () => {
    const dayEvents = events.filter((event) =>
      moment(event.start).isSame(currentDate, "day")
    );

    return (
      <div className="p-4">
        <div className="text-xl font-bold mb-4">
          {currentDate.format("dddd, MMMM D, YYYY")}
        </div>
        <div className="space-y-4">
          {dayEvents.length > 0 ? (
            dayEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:glassy-card"
                onClick={() => {
                  setSelectedEvent(event);
                  setIsModalOpen(true);
                }}
              >
                <div className="font-medium text-lg">
                  {moment(event.start).format("HH:mm")} -{" "}
                  {moment(event.end).format("HH:mm")}
                </div>
                <div className="glassy-text-primary">{event.title}</div>
                <div className="text-sm glassy-text-secondary mt-2">
                  Meeting URL: {event.job.interviewDetails.meeting_url}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center glassy-text-secondary py-8">
              No interviews scheduled for this day
            </div>
          )}
        </div>
      </div>
    );
  };

  // Event details modal
  const renderEventModal = () => {
    if (!selectedEvent) return null;

    const job = selectedEvent.job;

    return (
      <div className="fixed inset-0 glassy-card bg-opacity-50 flex items-center justify-center z-50">
        <div className="glassy-card rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Interview Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="glassy-text-secondary hover:glassy-text-primary"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium glassy-text-primary mb-2">
                  Candidate Information
                </h3>
                <div className="flex items-center mb-4">
                  <img
                    src={
                      job.user_id.profile_picture_url ||
                      "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium">
                      {job.user_id.first_name} {job.user_id.last_name}
                    </div>
                    <div className="text-sm glassy-text-secondary">{job.user_id.headline}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm glassy-text-secondary">Summary</div>
                  <div className="text-sm">{job.user_id.summary}</div>
                </div>

                <div className="mb-4">
                  <div className="text-sm glassy-text-secondary mb-1">Top Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {job.user_id.topSkills.slice(0, 5).map((skill) => (
                      <span
                        key={skill._id}
                        className="px-2 py-1 glassy-card text-blue-800 text-xs rounded-full"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium glassy-text-primary mb-2">
                  Interview Details
                </h3>

                <div className="mb-4">
                  <div className="text-sm glassy-text-secondary">Job Title</div>
                  <div className="font-medium">{job.job_details.job_title}</div>
                </div>

                <div className="mb-4">
                  <div className="text-sm glassy-text-secondary">Date & Time</div>
                  <div className="font-medium">
                    {moment(job.interviewDetails.select_date).format(
                      "MMMM D, YYYY"
                    )}{" "}
                    at{" "}
                    {moment(job.interviewDetails.select_time).format("h:mm A")}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm glassy-text-secondary">Meeting URL</div>
                  <a
                    href={job.interviewDetails.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {job.interviewDetails.meeting_url}
                  </a>
                </div>

                <div className="mb-4">
                  <div className="text-sm glassy-text-secondary">Status</div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-green-100 text-green-800">
                    {job.status}
                  </div>
                </div>

                {job.reviews && job.reviews.length > 0 && (
                  <div>
                    <h4 className="font-medium glassy-text-primary mb-2">Reviews</h4>
                    <div className="space-y-2">
                      {job.reviews.map((review, index) => (
                        <div key={index} className="text-sm p-2 glassy-card rounded">
                          <div className="glassy-text-secondary">{moment(review.date).format('MMM D, YYYY')}</div>
                          <div>{review.remarks}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 glassy-card glassy-text-primary rounded hover:glassy-card"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <a
                href={job.interviewDetails.meeting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 glassy-text-primary rounded hover:bg-blue-700"
              >
                Join Meeting
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="glassy-card rounded-lg shadow-md overflow-hidden">
        {/* Calendar Header */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button onClick={prev} className="p-2 rounded hover:glassy-card">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button onClick={next} className="p-2 rounded hover:glassy-card">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <h2 className="text-xl font-semibold">
              {view === "month"
                ? currentDate.format("MMMM YYYY")
                : view === "week"
                ? `${currentDate
                    .clone()
                    .startOf("week")
                    .format("MMM D")} - ${currentDate
                    .clone()
                    .endOf("week")
                    .format("MMM D, YYYY")}`
                : currentDate.format("MMMM D, YYYY")}
            </h2>

            <button
              onClick={goToToday}
              className="ml-4 px-3 py-1 text-sm border border-gray-300 rounded hover:glassy-card"
            >
              Today
            </button>
          </div>

          <div className="flex space-x-2 mt-2 md:mt-0">
            <button
              onClick={() => setView("day")}
              className={`px-3 py-1 text-sm rounded ${
                view === "day"
                  ? "glassy-card text-blue-800"
                  : "hover:glassy-card"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-3 py-1 text-sm rounded ${
                view === "week"
                  ? "glassy-card text-blue-800"
                  : "hover:glassy-card"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView("month")}
              className={`px-3 py-1 text-sm rounded ${
                view === "month"
                  ? "glassy-card text-blue-800"
                  : "hover:glassy-card"
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Calendar Body */}
        <div className="p-4">
          {view === "month" && renderMonthView()}
          {view === "week" && renderWeekView()}
          {view === "day" && renderDayView()}
        </div>
      </div>

      {/* Event Modal */}
      {isModalOpen && renderEventModal()}
    </div>
  );
};

export default CalendarView;
