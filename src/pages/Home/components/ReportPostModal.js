import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { RiVerifiedBadgeLine } from "react-icons/ri";

const REPORT_REASONS_ENUM = {
  MISGUIDE: 'Misguide',
  NUDITY: 'Nudity',
  SCAM: 'Scam',
  ILLEGAL: 'Illegal',
  SUICIDE_OR_SELF_INJURY: 'Suicide or self-injury',
  VIOLENCE: 'Violence',
  HATE_SPEECH: 'Hate speech',
  SOMETHING_ELSE: 'Something else',
};

export default function ReportPostModal({
  onClose,
  onSubmit,
  onCancel
}) {
  const [currentModal, setCurrentModal] = useState('report');
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const reasons = [
    { id: REPORT_REASONS_ENUM.MISGUIDE, label: 'Misguide', color: 'glassy-card glassy-text-primary' },
    { id: REPORT_REASONS_ENUM.NUDITY, label: 'Nudity', color: 'glassy-card glassy-text-primary' },
    { id: REPORT_REASONS_ENUM.SCAM, label: 'Scam', color: 'glassy-card glassy-text-primary' },
    { id: REPORT_REASONS_ENUM.ILLEGAL, label: 'Illegal', color: 'glassy-card glassy-text-primary' },
    { id: REPORT_REASONS_ENUM.SUICIDE_OR_SELF_INJURY, label: 'Suicide or self-injury', color: 'glassy-card glassy-text-primary' },
    { id: REPORT_REASONS_ENUM.VIOLENCE, label: 'Violence', color: 'glassy-card glassy-text-primary' },
    { id: REPORT_REASONS_ENUM.HATE_SPEECH, label: 'Hate speech', color: 'glassy-card glassy-text-primary' },
    { id: REPORT_REASONS_ENUM.SOMETHING_ELSE, label: 'Something else', color: 'glassy-card glassy-text-primary' }
  ];

  const handleReasonClick = (reasonId) => {
    setSelectedReason(reasonId === selectedReason ? '' : reasonId);
  };

  const handleSubmit = () => {
    if (!selectedReason) {
      return;
    }

    const reasonText = selectedReason === REPORT_REASONS_ENUM.SOMETHING_ELSE
      ? customReason
      : `This post violates our community guidelines for ${selectedReason}`;

    onSubmit(selectedReason, reasonText);
    setCurrentModal('thank-you');
  };

  const handleCancel = () => {
    setSelectedReason('');
    setCustomReason('');
    onCancel?.();
  };

  const handleClose = () => {
    setCurrentModal('report');
    setSelectedReason('');
    setCustomReason('');
    onClose();
  };

  if (currentModal === 'thank-you') {
    return (
      <div className="fixed inset-0 glassy-card/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="glassy-card rounded-xl max-w-xl w-full p-8 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 glassy-text-secondary hover:glassy-text-secondary transition-colors"
          >
            <RxCross2 size={24} />
          </button>

          <div className="text-center">
            <div className="mx-auto w-20 h-20 glassy-card rounded-full flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <RiVerifiedBadgeLine className=" text-blue-600" size={24} />
              </div>
            </div>

            <h2 className="text-xl font-semibold glassy-text-primary mb-4">
              Thank you for submitting a report
            </h2>

            <p className="glassy-text-secondary leading-relaxed">
              Your report has been submitted. Our team will review it shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 glassy-card/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glassy-card rounded-xl max-w-2xl w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 glassy-text-secondary hover:glassy-text-secondary transition-colors"
        >
          <RxCross2 size={24} />
        </button>

        <h1 className="text-2xl font-semibold glassy-text-primary mb-8">Report Post</h1>

        <div className="space-y-3 mb-8 space-x-5">
          {reasons.map((reason) => (
            <button
              key={reason.id}
              onClick={() => handleReasonClick(reason.id)}
              className={`text-left px-4 py-3 rounded-full text-sm font-medium transition-all ${selectedReason === reason.id
                ? 'bg-pink-200 text-pink-800 border-2 border-pink-300'
                : reason.color + ' hover:opacity-80'
                }`}
            >
              {reason.label}
            </button>
          ))}
        </div>

        {selectedReason === REPORT_REASONS_ENUM.SOMETHING_ELSE && (
          <div className="mb-8">
            <h3 className="text-lg font-medium glassy-text-primary mb-2">Reason</h3>
            <p className="glassy-text-secondary text-sm mb-4">
              Please let us know the reason for reporting this post.
            </p>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Enter your reason..."
              className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 glassy-card glassy-text-primary rounded-lg font-medium hover:glassy-card transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || (selectedReason === REPORT_REASONS_ENUM.SOMETHING_ELSE && !customReason)}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${!selectedReason || (selectedReason === REPORT_REASONS_ENUM.SOMETHING_ELSE && !customReason)
              ? 'glassy-card glassy-text-secondary cursor-not-allowed'
              : 'bg-blue-600 glassy-text-primary hover:bg-blue-700'
              }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}