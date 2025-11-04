import Modal from '../../../components/ui/Modal/Modal';
import { FaStar } from 'react-icons/fa';

const InterviewReviewModal = ({
  openInterview,
  setOpenInterview,
  handleSubmitInterview,
  loading,
  interviewer,
  setInterviewer,
  rating,
  hover,
  setHover,
  recommendationLevel,
  setRecommendationLevel,
  status,
  setStatus,
  remarks,
  setRemarks,
  setRating,
  hour,
  setHour,
  minute,
  setMinute,
  selectInterviewId
}) => {

  return (
    <Modal
      isOpen={openInterview}
      onClose={() => setOpenInterview(false)}
      title="Approve/Reject User"
      handleSubmit={handleSubmitInterview}
      loading={loading}
      buttonLabel={status==="rejected_in_interview" ? "Reject" : "Approve"}
    >
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold glassy-text-primary">Candidate Info: {selectInterviewId?.user_id?.first_name} {selectInterviewId?.user_id?.last_name}</h2>
        <div className="border-b pb-4 flex items-start gap-4">
          <div className="flex-1">
            <p className="text-sm glassy-text-secondary">{selectInterviewId?.user_id?.headline}</p>
            {selectInterviewId?.user_id?.topSkills?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectInterviewId.user_id.topSkills.map((skill) => (
                  <span
                    key={skill._id}
                    className="inline-block glassy-card text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1 text-sm glassy-text-primary">
          <p><strong>Position:</strong> {selectInterviewId?.job_details?.job_title || 'N/A'}</p>
          <p>
            <strong>Interview Date:</strong>{' '}
            {selectInterviewId?.interviewDetails?.select_date
              ? new Date(selectInterviewId.interviewDetails.select_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
              : 'N/A'}
          </p>

          <p>
            <strong>Time:</strong>{' '}
            {selectInterviewId?.interviewDetails?.select_time
              ? new Date(selectInterviewId.interviewDetails.select_time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })
              : 'N/A'}
          </p>

          {/* <p>
            <strong>Meeting Link:</strong>{' '}
            {selectInterviewId?.interviewDetails?.meeting_url ? (
              <a
                href={selectInterviewId.interviewDetails.meeting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Join Interview
              </a>
            ) : (
              'Not available'
            )}
          </p> */}
        </div>


        <div className="mt-6">
          <label className="block text-sm font-medium glassy-text-primary mb-3">Duration</label>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease hour"
                onClick={() => setHour((prev) => Math.max(1, prev - 1))}
                className="w-8 h-8 flex items-center justify-center text-lg glassy-card rounded-full hover:glassy-card transition"
              >
                &minus;
              </button>

              <input
                type="number"
                value={hour}
                min="1"
                max="12"
                onChange={(e) => {
                  const val = Math.min(12, Math.max(1, parseInt(e.target.value) || 1));
                  setHour(val);
                }}
                className="w-10 h-8 text-center text-sm border glassy-input-notification rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />

              <button
                type="button"
                aria-label="Increase hour"
                onClick={() => setHour((prev) => Math.min(12, prev + 1))}
                className="w-8 h-8 flex items-center justify-center text-lg glassy-card rounded-full hover:glassy-card transition"
              >
                +
              </button>

              <span className="text-sm glassy-text-secondary">hr</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease minute"
                onClick={() => setMinute((prev) => Math.max(0, prev - 1))}
                className="w-8 h-8 flex items-center justify-center text-lg glassy-card rounded-full hover:glassy-card transition"
              >
                &minus;
              </button>

              <input
                type="number"
                value={minute}
                min="0"
                max="59"
                onChange={(e) => {
                  const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                  setMinute(val);
                }}
                className="w-10 h-8 text-center text-sm border glassy-input-notification rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />

              <button
                type="button"
                aria-label="Increase minute"
                onClick={() => setMinute((prev) => Math.min(59, prev + 1))}
                className="w-8 h-8 flex items-center justify-center text-lg glassy-card rounded-full hover:glassy-card transition"
              >
                +
              </button>

              <span className="text-sm glassy-text-secondary">min</span>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium glassy-text-primary">Interview Conducted By</label>
        <input
          type="text"
          value={interviewer}
          onChange={(e) => setInterviewer(e.target.value)}
          placeholder="Jane Smith (Senior Frontend Engineer)"
          className="w-full border glassy-input rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium glassy-text-primary">Rate the Candidate</label>
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                  className="hidden"
                />
                <FaStar
                  className="text-2xl transition"
                  color={ratingValue <= (hover || rating) ? "#facc15" : "#e5e7eb"}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
          <span className="ml-3 text-sm glassy-text-secondary">
            {rating > 0 ? `${rating} / 5` : "Not rated"}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium glassy-text-primary">Recommendation</label>
        <select
          value={recommendationLevel}
          onChange={(e) => setRecommendationLevel(e.target.value)}
          className="w-full px-4 py-1.5 border glassy-input rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-transparent"
        >
          <option value="">Select a recommendation</option>
          <option value="strong_yes">Strong Yes</option>
          <option value="yes">Yes</option>
          <option value="maybe">Maybe</option>
          <option value="no">No</option>
          <option value="strong_no">Strong No</option>
        </select>
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium glassy-text-primary">Interview Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-1.5 border glassy-input rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-transparent"
        >
          <option value="">Select status</option>
          <option value="selected_in_interview">Approved</option>
          <option value="rejected_in_interview">Rejected</option>
        </select>
      </div>

      <div className="mt-3">
        <label htmlFor="remarks" className="block text-sm font-medium glassy-text-primary mb-1">
          Interviewer Feedback
        </label>
        <textarea
          id="remarks"
          rows="4"
          className="w-full px-4 py-2 border glassy-input rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Provide detailed feedback on the candidate’s performance..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        ></textarea>
      </div>
    </Modal>
  );
}

export default InterviewReviewModal;
