import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { voteOnPoll } from '../../../redux/Users/userSlice';
import { useDispatch } from 'react-redux';
import moment from 'moment-timezone';

function Poll({ poll, postId, isSelfPost = false, updatedAt, isVoted: initialIsVoted, voting_index: initialVotingIndex }) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasVoted, setHasVoted] = useState(initialIsVoted);
    const [pollData, setPollData] = useState(poll);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
     
    useEffect(() => {
        setPollData(poll);
    }, [poll]);
    
    useEffect(() => {
        setHasVoted(initialIsVoted);
    }, [initialIsVoted]);

    const isPollExpired = useMemo(() => {
        if (!updatedAt) return false;
        const pollEndTime = new Date(updatedAt);
        pollEndTime.setDate(pollEndTime.getDate() + 7); 
        return new Date() > pollEndTime;
    }, [updatedAt]);

    const handleOptionSelect = (optionIndex) => {
        if (isPollExpired) {
            toast.error('This poll has ended');
            return;
        }
        if (hasVoted && !isSelfPost) {
            toast.error('You have already voted in this poll');
            return;
        }
        setSelectedOption(optionIndex);
    };

    const handleVoteSubmit = async () => {
        if (selectedOption === null) {
            toast.error('Please select an option first');
            return;
        }
        setIsSubmitting(true);
        try {
            await dispatch(voteOnPoll({ post_id: postId, option_index: selectedOption })).unwrap();
            const updatedOptions = pollData.options.map((option, index) =>
                index === selectedOption
                    ? { ...option, vote_count: option.vote_count + 1 }
                    : option
            );
            setPollData({ ...pollData, options: updatedOptions });
            setHasVoted(true);
            toast.success('Vote submitted successfully');
        } catch (error) {
            toast.error(error.message || 'Failed to submit vote');
            console.error('Voting error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculatePercentage = (voteCount) => {
        const totalVotes = pollData.options.reduce((sum, option) => sum + option.vote_count, 0);
        return totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
    };

    const totalVotes = useMemo(() => {
        return pollData.options.reduce((sum, option) => sum + option.vote_count, 0);
    }, [pollData.options]);

 
  const votingLengthDays = pollData.voting_length; 
  const votingDurationMs = votingLengthDays * 24 * 60 * 60 * 1000; 
  const endTime = new Date(new Date(updatedAt).getTime() + votingDurationMs);
  const formattedEndTime = moment(endTime).format("DD MMM YYYY, h:mm A");

    return (
      <div className="w-full mx-auto bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="mb-4">
          <div className="flex items-start gap-2 mb-2">
            <h3 className="text-gray-800 font-medium leading-tight">
              {pollData.question || 'What’s your opinion?'}
            </h3>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {pollData.options.map((option, index) => {
            const percentage = calculatePercentage(option.vote_count);
            const isSelected = selectedOption === index || (hasVoted && initialVotingIndex === index);
            const showResults = hasVoted || isSelfPost || isPollExpired;

            return (
              <div className="relative group">
                <button
                  onClick={() => handleOptionSelect(index)}
                  disabled={hasVoted || isPollExpired || isSelfPost}
                  className={`w-full px-4 py-3 text-left rounded-full border-2 transition-all duration-200 relative z-10
                   ${isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : showResults
                        ? 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                        : 'border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                    }`}
                >
                  <div className="flex items-center justify-between capitalize">
                    <span className="font-medium text-xs md:text-md break-words break-all">{option.text}</span>
                    {showResults && (
                      <span className="md:text-sm text-xs text-gray-600">
                        {percentage}% ({option.vote_count})
                      </span>
                    )}
                  </div>
                </button>
                {hasVoted && (
                  <div className="absolute top-full mt-1 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-md">
                    Already voted
                  </div>
                )}
              </div>
            );
          })}
        </div>

         {!hasVoted && !isPollExpired && !isSelfPost && selectedOption !== null && (
          <div className="flex justify-end mt-2">
            <button
              onClick={handleVoteSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Vote'
              )}
            </button>
          </div>
        )}
 
        <div className="text-sm text-gray-500 mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span>
            {isPollExpired
              ? `Poll ended • ${totalVotes} vote${totalVotes !== 1 ? 's' : ''}`
              : `${totalVotes} vote${totalVotes !== 1 ? 's' : ''} • Ends on ${formattedEndTime}`}
          </span>

        
        </div>
      </div>
    );
}

export default Poll;