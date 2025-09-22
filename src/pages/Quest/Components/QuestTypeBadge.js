const QuestTypeBadge = ({ type }) => {
  const typeConfig = {
    "survey-polls": { color: "bg-purple-100 text-purple-700", label: "Survey & Polls" },
    "feedbacks": { color: "bg-amber-100 text-amber-700", label: "Feedback" },
    "sign-up": { color: "bg-blue-100 text-blue-700", label: "Sign Up" },
  };

  const config = typeConfig[type] || { color: "bg-gray-100 text-gray-700", label: type };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default QuestTypeBadge;