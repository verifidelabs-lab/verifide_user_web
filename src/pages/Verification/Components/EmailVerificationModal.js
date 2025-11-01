import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CustomInput from '../../../components/ui/Input/CustomInput';
import { convertTimestampToDate } from '../../../components/utils/globalFunction';

const EmailVerificationModal = ({
    isOpen,
    onClose,
    profileData,
    mailData,
    institutionForm,
    onSubmit
}) => {
    const [letterContent, setLetterContent] = useState('');
    const [subject, setSubject] = useState('Verification Request');
    const [fromEmail, setFromEmail] = useState('');
    const [isCustomFrom, setIsCustomFrom] = useState(false);

    useEffect(() => {
        if (!mailData) return;

        const institutionOrCompany = mailData?.companyName || mailData?.degree;

        const content = `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
        <p>Dear <strong>${institutionForm?.name || "To Whom It May Concern"}</strong>,</p>

        <p>
          I am writing to formally verify the 
          <strong>${mailData?.companyName ? "Professional" : "Educational"}</strong> 
          details of the candidate mentioned below. Kindly confirm the accuracy of the information provided:
        </p>

        <h3 style="margin-top:20px; margin-bottom:10px; color:#1d4ed8;">Candidate Profile Details</h3>
        <ul style="padding-left:20px; margin-bottom:20px;">
          <li><strong>Full Name:</strong> ${profileData?.first_name || ""} ${profileData?.last_name || ""}</li>
          <li><strong>Gender:</strong> ${profileData?.gender || "N/A"}</li>
          <li><strong>Date of Birth:</strong> ${profileData?.birth_date ? convertTimestampToDate(profileData.birth_date) : "N/A"}</li>
          <li><strong>Headline:</strong> ${profileData?.headline || "N/A"}</li>
          <li><strong>Summary:</strong> ${profileData?.summary || "N/A"}</li>
          <li><strong>Status:</strong> ${profileData?.frame_status || "N/A"}</li>
          <li><strong>Verified:</strong> ${profileData?.is_verified ? "✅ Yes" : " No"}</li>
          <li><strong>Profile Views:</strong> ${profileData?.profile_views || 0}</li>
          <li><strong>Followers:</strong> ${profileData?.follower_count || 0}</li>
          <li><strong>Connections:</strong> ${profileData?.connection_count || 0}</li>
        ${profileData?.profile_picture_url
                ? `<li><strong>Profile Picture:</strong><br/>
          <img 
            src="${profileData?.profile_picture_url}" 
            alt="profile" 
            style="width:40px; height:40px; border-radius:50%; object-fit:cover; margin-top:6px;" 
          />
        </li>`
                : ""
            }
        </ul>

        <h3 style="margin-top:20px; margin-bottom:10px; color:#1d4ed8;">Verification Details</h3>
        <ul style="padding-left:20px; margin-bottom:20px;">
          <li><strong>Candidate Username:</strong> ${profileData?.username}</li>
          <li><strong>Duration:</strong> 
            ${mailData?.start_date ? convertTimestampToDate(mailData.start_date) : "N/A"} - 
            ${mailData?.end_date ? convertTimestampToDate(mailData.end_date) : "Present"}
          </li>
          <li><strong>${mailData?.companyName ? "Company" : "Institute"}:</strong> ${institutionOrCompany}</li>
        </ul>

        <p>This verification is requested for official purposes. Please confirm at your earliest convenience.</p>

        <p>Thank you for your assistance.</p>

        <p style="margin-top:30px;">
          Sincerely,<br/>
          <strong>${profileData?.username}</strong><br/>
          <span style="color:#555;">[Your Title / Position]</span><br/>
          <a href="mailto:${profileData?.email}" style="color:#2563eb; text-decoration:none;">${profileData?.email}</a>
        </p>
      </div>
    `;

        setLetterContent(content);
        setFromEmail(profileData?.email || '');
    }, [mailData, institutionForm, profileData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            content: letterContent,
            subject,
            from: isCustomFrom ? fromEmail : profileData?.email
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 glassy-card bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="glassy-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold glassy-text-primary">Preview the mail</h2>
                    <button
                        onClick={onClose}
                        className="glassy-text-secondary hover:glassy-text-primary"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                    
                        <div>
                            <label className="block text-sm font-medium glassy-text-primary mb-1">From</label>
                            <div className="grid grid-cols-2">
                                <CustomInput
                                    type="email"
                                    value={fromEmail}
                                    onChange={(e) => setFromEmail(e.target.value)}
                                    disabled={!isCustomFrom}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:glassy-card"
                                    required
                                />
                                <label className="ml-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isCustomFrom}
                                        onChange={() => setIsCustomFrom(!isCustomFrom)}
                                        className="mr-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm glassy-text-primary">Custom email</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium glassy-text-primary mb-1">Subject</label>
                            <CustomInput
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Email Body Editor */}
                        <div>
                            <label className="block text-sm font-medium glassy-text-primary mb-1">Email Body</label>
                            <ReactQuill
                                value={letterContent}
                                onChange={setLetterContent}
                                theme="snow"
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, false] }],
                                        ["bold", "italic", "underline", "strike"],
                                        [{ list: "ordered" }, { list: "bullet" }],
                                        ["link", "image"],
                                        ["clean"]
                                    ],
                                }}
                                className="h-64 mb-12"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium glassy-text-primary glassy-card hover:glassy-card rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium glassy-text-primary bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                            Send Verification Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default EmailVerificationModal;