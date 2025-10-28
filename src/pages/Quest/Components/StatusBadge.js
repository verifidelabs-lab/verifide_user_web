import { BiCalendar, BiMedal, BiRun, BiUser } from "react-icons/bi";

const SurveyButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2.5 py-1 rounded-full font-medium transition-colors"
    >
      Take Survey
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Ongoing: { color: "bg-green-500 glassy-text-primary", icon: <BiRun className="text-xs" /> },
    Upcoming: { color: "bg-blue-500 glassy-text-primary", icon: <BiCalendar className="text-xs" /> },
    Ended: { color: "bg-gray-500 glassy-text-primary", icon: <BiMedal className="text-xs" /> },
  };

  const config = statusConfig[status] || statusConfig.Ongoing;

  return (
    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold ${config.color} flex items-center gap-1 shadow-md z-10`}>
      {config.icon}
      <span>{status}</span>
    </div>
  );
};

const EngagementBadge = ({ count }) => (
  <div className="absolute top-4 left-4 glassy-card/80 glassy-text-primary px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-10 flex items-center gap-1">
    <BiUser className="text-xs" />
    <span>{count} Engaged</span>
  </div>
);


export { SurveyButton, StatusBadge, EngagementBadge };