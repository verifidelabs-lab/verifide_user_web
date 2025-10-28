import React from 'react';
import { BiPaperclip, BiSend, BiX, BiFile, BiImage, BiVideo, BiBlock } from 'react-icons/bi';
import { FaRegSmile } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = ({
    fileInputRef,
    handleFileChange,
    messageInput,
    setMessageInput,
    handleKeyPress,
    sendingMessage,
    handleSendMessage,
    mediaPreview,
    setMediaPreview,
    uploadProgress,
    loading,
    contacts,
    onUnblock,
    replyingTo,
    cancelReply
}) => {

    const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
    const textAreaRef = React.useRef(null);

    const clearMediaPreview = () => {
        if (mediaPreview.file_url && typeof mediaPreview.file_url === 'string' && mediaPreview.file_url.startsWith('blob:')) {
            URL.revokeObjectURL(mediaPreview.file_url);
        }
        setMediaPreview({ file_url: null, file_type: null });
    };

    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'image':
                return <BiImage className="w-5 h-5 text-green-600" />;
            case 'video':
                return <BiVideo className="w-5 h-5 text-purple-600" />;
            case 'pdf':
                return <BiFile className="w-5 h-5 text-red-600" />;
            default:
                return <BiFile className="w-5 h-5 text-gray-600" />;
        }
    };

    const renderReplyPreview = () => {
        if (!replyingTo) return null;

        const getReplyText = () => {
            if (replyingTo.message) return replyingTo.message;
            if (replyingTo.file_type === 'image') return '📷 Image';
            if (replyingTo.file_type === 'video') return '🎥 Video';
            if (replyingTo.file_type === 'pdf') return '📄 PDF';
            if (replyingTo.file_type === 'shared-post') return '📝 Shared Post';
            if (replyingTo.file_type === 'shared-interview') return '📅 Interview Scheduled';
            return 'Message';
        };

        return (
            <div className="px-4 py-3   ">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                            <div>
                                <p className="text-xs font-medium text-blue-700">
                                    Replying to {replyingTo.sender_id === contacts?.connectionUserId ? contacts?.first_name : 'You'}
                                </p>
                                <p className="text-sm text-gray-600 truncate max-w-xs">
                                    {getReplyText()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={cancelReply}
                        className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                    >
                        <BiX className="w-4 h-4 text-blue-500" />
                    </button>
                </div>
            </div>
        );
    };

    const handleEmojiClick = (emojiData) => {
        const cursorPos = textAreaRef.current.selectionStart;
        const textBefore = messageInput.slice(0, cursorPos);
        const textAfter = messageInput.slice(cursorPos);
        const newText = textBefore + emojiData.emoji + textAfter
        setMessageInput(newText);
        setTimeout(() => {
            textAreaRef.current.focus();
            textAreaRef.current.selectionStart = cursorPos + emojiData.emoji.length;
            textAreaRef.current.selectionEnd = cursorPos + emojiData.emoji.length;
        }, 0);

        setShowEmojiPicker(false);
    };


    const renderMediaPreview = () => {
        if (!mediaPreview.file_url) return null;

        return (
            <div className="px-4 py-3     ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {mediaPreview.file_type === 'image' && typeof mediaPreview.file_url === 'string' && mediaPreview.file_url.startsWith('blob:') ? (
                            <img
                                src={mediaPreview.file_url}
                                alt="Preview"
                                className="w-12 h-12 object-cover rounded-lg"
                            />
                        ) : mediaPreview.file_type === 'video' && typeof mediaPreview.file_url === 'string' && mediaPreview.file_url.startsWith('blob:') ? (
                            <video
                                src={mediaPreview.file_url}
                                className="w-12 h-12 object-cover rounded-lg"
                                muted
                            />
                        ) : (
                            <div className="w-12 h-12  rounded-lg flex items-center justify-center">
                                {getFileIcon(mediaPreview.file_type)}
                            </div>
                        )}

                        <div className="flex-1">
                            <p className="text-sm font-medium glassy-text-primary">
                                {mediaPreview.file_type === 'pdf'
                                    ? mediaPreview.file_url
                                    : `${mediaPreview.file_type.charAt(0).toUpperCase() + mediaPreview.file_type.slice(1)} file`
                                }
                            </p>
                            {loading && (
                                <div className="mt-1">
                                    <div className="text-xs glassy-text-secondary mb-1">
                                        Uploading... {uploadProgress}%
                                    </div>
                                    <div className="w-full  rounded-full h-1">
                                        <div
                                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={clearMediaPreview}
                        className="p-1 hover: rounded-full transition-colors"
                        disabled={loading}
                    >
                        <BiX className="w-5 h-5 glassy-text-secondary" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            {!contacts?.isBlocked ? (
                <div className="border-t  glassy-card">
                    {/* Reply Preview */}
                    {renderReplyPreview()}

                    {/* Media Preview */}
                    {renderMediaPreview()}

                    <div className="p-4">
                        <div className="flex items-end space-x-3">
                            {/* File attachment button */}
                            <div className="relative">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 glassy-text-secondary hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                    disabled={loading || sendingMessage}
                                >
                                    <BiPaperclip className="w-5 h-5" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*,video/*,.pdf"
                                    className="hidden"
                                    disabled={loading || sendingMessage}
                                />
                            </div>

                            <div className="flex-1 relative">
                                <textarea
                                    value={messageInput}
                                    ref={textAreaRef}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={replyingTo ? "Reply to message..." : "Type a message..."}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 min-h-[40px] glassy-input"
                                    rows={1}
                                    disabled={loading || sendingMessage}
                                    style={{
                                        height: 'auto',
                                        minHeight: '40px',
                                        maxHeight: '128px',
                                        overflowY: messageInput.split('\n').length > 3 ? 'auto' : 'hidden'
                                    }}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                                    }}
                                />
                                <span
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="absolute right-3 top-2.5 glassy-text-secondary cursor-pointer hover:text-gray-700"
                                >
                                    <FaRegSmile size={20} />
                                </span>

                                {showEmojiPicker && (
                                    <div className="absolute bottom-full mb-2 right-0 z-50">
                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSendMessage}
                                disabled={(!messageInput.trim() && !mediaPreview.file_url) || sendingMessage || loading}
                                className={`p-2 rounded-full transition-all duration-200 ${(!messageInput.trim() && !mediaPreview.file_url) || sendingMessage || loading
                                    ? ' text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 glassy-text-primary hover:bg-blue-600 transform hover:scale-105'
                                    }`}
                            >
                                {sendingMessage ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <BiSend className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border-t  glassy-card">
                    <div className="p-6 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <BiBlock className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-lg font-medium glassy-text-primary">
                                {contacts?.isBlockedByYou ? "You blocked this user" : "You've been blocked"}
                            </h3>
                            <p className="glassy-text-secondary max-w-md text-center">
                                {contacts?.isBlockedByYou
                                    ? "You won't be able to send or receive messages from this user until you unblock them."
                                    : "This user has blocked you. You can't send messages to them."}
                            </p>

                            {contacts?.isBlockedByYou && onUnblock && (
                                <button
                                    onClick={onUnblock}
                                    className="mt-4 px-6 py-2 bg-blue-500 glassy-text-primary rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Unblock User
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MessageInput;