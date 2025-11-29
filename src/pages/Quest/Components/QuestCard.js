import {
  BiCalendar,
  BiCheck,
  BiChevronRight,
  BiEdit,
  BiImage,
  BiLink,
  BiPlus,
  BiPoll,
  BiTrash,
} from "react-icons/bi";
import PollFormUser from "./PollFormUser";
import { toast } from "sonner";
import QuestTypeBadge from "./QuestTypeBadge";
import { EngagementBadge, StatusBadge, SurveyButton } from "./StatusBadge";
import { useState } from "react";
import { formatDateByMomentTimeZone } from "../../../components/utils/globalFunction";
const getStatus = (startDate, endDate) => {
  const now = Date.now();
  if (now < startDate) {
    return "Upcoming";
  } else if (now >= startDate && now <= endDate) {
    return "Ongoing";
  } else {
    return "Ended";
  }
};
const QuestCard = ({
  quest,
  onEngage,
  onViewEngagement,
  onEdit,
  onDelete,
  onVote,
  accessMode,
  isLoading2,
  isCompany,
  isInstitution,
}) => {
  console.log("the quest data is", accessMode);
  const status = getStatus(quest.startDate, quest.endDate);
  const [votedOption, setVotedOption] = useState(null);
  const [pollExpanded, setPollExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleVoteClick = (questId, optionIndex) => {
    onVote(questId, optionIndex);
    setVotedOption(optionIndex);
  };

  console.log(status);

  return (
    <>
      <div className="relative glassy-card rounded-xl  border-[#D3D3D3] overflow-hidden  transition-all duration-300 transform hover:-translate-y-1 border ">
        <div className="h-48 relative overflow-hidden group cursor-pointer">
          {quest?.video ? (
            <video
              src={quest.video}
              className="w-full h-full object-cover"
              autoPlay={true}
              controls
              controlsList="nodownload"
              poster={quest.images?.[0]}
            />
          ) : quest.images?.length > 0 ? (
            <img
              src={quest.images[0] || "/Frame 1000004906.png"}
              alt={quest.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.style.background =
                  "linear-gradient(45deg, #f3f4f6, #e5e7eb)";
                e.target.src = "/Frame 1000004906.png";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center glassy-text-secondary bg-gradient-to-br from-gray-50 to-gray-100">
              <BiImage className="text-4xl" />
            </div>
          )}
          <StatusBadge status={status} />
          <EngagementBadge count={quest.engagement_count} />
          {/* <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div> */}
          <div className="!absolute glassy-card bottom-3 left-3 flex items-center glassy-text-primary p-1">
            {quest?.user_id?.profile_picture_url ? (
              <>
                <img
                  src={
                    quest.user_id.profile_picture_url ||
                    "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                  }
                  alt={quest.user_id.name}
                  className="w-6 h-6 rounded-full object-cover mr-2 border border-white"
                />
              </>
            ) : (
              <>
                <img
                  src={"/0684456b-aa2b-4631-86f7-93ceaf33303c.png"}
                  alt={quest.user_id.name}
                  className="w-6 h-6 rounded-full object-cover mr-2 border border-white"
                />
              </>
            )}

            <span className="text-xs font-medium">{quest.user_id.name}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg glassy-text-primary line-clamp-1 flex-1 mr-2 capitalize">
              {quest.title}
            </h3>
            <div className="flex justify-between items-center gap-2">
              <QuestTypeBadge type={quest.type} />
            </div>
          </div>
          <p className="glassy-text-secondary text-sm mb-3 line-clamp-2">
            {quest.description}
          </p>

          <div className="flex items-center text-xs glassy-text-secondary mb-3">
            <BiCalendar className="mr-1.5" />
            <span>
              {formatDateByMomentTimeZone(quest.startDate)} -{" "}
              {formatDateByMomentTimeZone(quest.endDate)}
            </span>
          </div>

          {quest.poll && quest.poll.options?.length > 0 && (
            <div className="mb-3 glassy-card rounded-lg border border-gray-100 overflow-hidden">
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => setPollExpanded(!pollExpanded)}
              >
                <div className="flex items-center text-sm font-medium glassy-text-primary">
                  <BiPoll className="mr-2 text-blue-500" />
                  <span>Community Poll ({quest.poll.total_votes} votes)</span>
                </div>
                {pollExpanded ? (
                  <BiChevronRight className="transform rotate-90 transition-transform glassy-text-secondary" />
                ) : (
                  <BiChevronRight className="transform -rotate-90 transition-transform glassy-text-secondary" />
                )}
              </div>

              {pollExpanded && (
                <div className="px-3 pb-3">
                  <div className="space-y-2">
                    {quest.poll.options.map((option, optIdx) => {
                      const percentage =
                        quest.poll.total_votes > 0
                          ? Math.round(
                              (option.vote_count / quest.poll.total_votes) * 100
                            )
                          : 0;

                      return (
                        <div
                          key={optIdx}
                          className="cursor-pointer"
                          onClick={() =>
                            quest?.isVoted
                              ? toast.info(
                                  "You are already vote in this poll !"
                                )
                              : handleVoteClick(quest._id, optIdx)
                          }
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm glassy-text-primary">
                              {option.text}
                            </span>
                            <span className="text-xs font-medium text-blue-600">
                              {percentage}%
                            </span>
                          </div>
                          <div className="w-full glassy-card rounded-full h-2">
                            <div
                              className="glassy-card0 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs glassy-text-secondary">
                              {votedOption === optIdx ? (
                                <span className="flex items-center text-green-600">
                                  <BiCheck className="mr-1" /> Voted
                                </span>
                              ) : null}
                            </span>
                            <span className="text-xs glassy-text-secondary">
                              {option.vote_count} vote
                              {option.vote_count !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {quest.link && (
            <a
              href={quest.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 mb-3 hover:text-blue-800 transition-colors truncate"
            >
              <BiLink />
              <span className="truncate">
                {quest.link.replace(/(^\w+:|^)\/\//, "")}
              </span>
            </a>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            {(accessMode === "6" || isCompany() || isInstitution()) && (
              <button
                className="text-xs glassy-text-secondary hover:text-blue-600 transition-colors flex items-center"
                onClick={() => onViewEngagement(quest)}
              >
                View details <BiChevronRight className="text-sm" />
              </button>
            )}

            <div className="flex items-center gap-2">
              {(quest.type === "sign-up" || quest.type === "feedbacks") && (
                <>
                  {accessMode === 5 ||
                  isCompany() ||
                  isInstitution() ||
                  status === "Ended" ||
                  quest?.isFullyFeedback
                    ? null
                    : !quest?.isEngaged && (
                        <button
                          className={`text-xs ${
                            status === "Upcoming"
                              ? "glassy-card cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                          } glassy-text-primary px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1`}
                          disabled={status === "Upcoming"}
                          onClick={() => onEngage(quest)}
                        >
                          <BiPlus className="text-sm" /> Start
                        </button>
                      )}
                </>
              )}

              {quest.type === "survey-polls" &&
                accessMode === 5 &&
                status === "Ongoing" &&
                !quest?.isVoted && (
                  <SurveyButton onClick={() => setShowForm(true)} />
                )}

              {(accessMode === "6" || isCompany() || isInstitution()) && (
                <>
                  {(status === "Upcoming" || status === "Ended") && (
                    <button
                      className="p-1.5 text-blue-500 hover:text-blue-700 hover:glassy-card rounded-lg transition-colors"
                      onClick={() => onEdit(quest._id)}
                      aria-label="Edit"
                    >
                      <BiEdit className="text-lg" />
                    </button>
                  )}

                  <button
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => onDelete(quest._id)}
                    aria-label="Delete"
                  >
                    <BiTrash className="text-lg" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        {/* {status === "Ended" && (
          <div className="!absolute inset-0 z-40 glassy-card flex items-center justify-center pointer-events-none rounded-xl">
            <img
              src="/endpreview.png"
              alt="Ended"
              className="object-contain opacity-80 transform rotate-[-20deg]"
            />
          </div>
        )} */}
      </div>
      {quest.type === "survey-polls" && (
        <PollFormUser
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          quest={quest}
        />
      )}
    </>
  );
};

export default QuestCard;
