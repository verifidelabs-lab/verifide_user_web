import React, { useState } from 'react';
import { FiX, FiSend, FiSearch, FiCheck } from 'react-icons/fi';
import { sharePost } from '../../../redux/Users/userSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import Button from '../../../components/ui/Button/Button';

const ShareModal = ({ post, onClose, userData, hanleCopyLink }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  const filteredUsers = userData.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user) => {
    const isSelected = selectedUsers.some(u => u.connectionUserId === user.connectionUserId);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter(u => u.connectionUserId !== user.connectionUserId));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.connectionUserId !== userId));
  };

  const handleSendPost = () => {
    if (selectedUsers.length === 0) return;
    const payload = {
      post_id: post._id,
      recipient_user_ids: selectedUsers.map(user => user.connectionUserId)
    };
    dispatch(sharePost(payload))
      .then((res) => {
        if (!res?.payload?.error) {
          toast.success(res?.payload?.message || 'Post shared successfully!');
        } else {
          toast.error(res?.payload?.message || 'Failed to share post');
        }
      })
      .catch((error) => {
        toast.error('Failed to share post', error);
      });

    onClose();
  };


  return (
    <div className="fixed inset-0 glassy-modal backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="glassy-card rounded-xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4  border-gray-200">
          <h2 className="text-lg font-semibold glassy-text-primary capitalize">Share with</h2>
          <button
            onClick={onClose}
            className="p-2   rounded-full transition-colors"
          >
            <FiX size={20} className="glassy-text-secondary" />
          </button>
        </div>

        <div className="p-4  border-gray-200 flex justify-between items-center">
          <div className="relative md:w-auto w-52">
            <FiSearch size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 glassy-text-secondary" />
            <input
              type="text"
              placeholder="Search connections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent glassy-input-notification"
            />
          </div>
          <Button onClick={() => hanleCopyLink(post)} size='sm'>Copy Link</Button>
        </div>

        {selectedUsers.length > 0 && (
          <div className="p-3  border-gray-200 glassy-card">
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(user => (
                <div
                  key={user.connectionUserId}
                  className="flex items-center gap-2  glassy-card text-blue-800 px-3 py-1.5 rounded-full text-sm"
                >
                  {user.profile_picture_url ?
                    <img
                      src={user.profile_picture_url || "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-5 h-5 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";
                      }}
                    /> :
                    <img
                      src={"/0684456b-aa2b-4631-86f7-93ceaf33303c.png"}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"

                    />
                  }
                  <span className="font-medium">{user.first_name}</span>
                  <button
                    onClick={() => handleRemoveUser(user.connectionUserId)}
                    className="text-blue-600 hover:text-blue-800 rounded-full p-0.5"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full glassy-text-secondary p-6">
              <FiSearch size={32} className="mb-3 text-gray-300" />
              <p>No connections found</p>
              <p className="text-sm glassy-text-secondary mt-1">Try a different search term</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredUsers.map(user => {
                const isSelected = selectedUsers.some(u => u.connectionUserId === user.connectionUserId);
                return (
                  <li
                    key={user.connectionUserId}
                    className="  transition-colors"
                  >
                    <button
                      onClick={() => handleUserSelect(user)}
                      className="w-full flex items-center gap-3 p-3 text-left"
                    >
                      <div className="relative">
                        {user.profile_picture_url ?

                          <img
                            src={user.profile_picture_url || "/0684456b-aa2b-4631-86f7-93ceaf33303c.png"}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/0684456b-aa2b-4631-86f7-93ceaf33303c.png";
                            }}
                          />
                          :

                          <img
                            src="/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"

                          />

                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium glassy-text-primary truncate">
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className="text-sm glassy-text-secondary truncate">
                          {user.headline || "No headline"}
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected
                          ? ' border-blue-500'
                          : 'border-gray-300 hover:border-blue-300'
                          }`}
                      >
                        {isSelected && <FiCheck size={12} className="glassy-text-primary" />}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="p-4  border-gray-200 glassy-card">
          <button
            onClick={handleSendPost}
            disabled={selectedUsers.length === 0}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center glassy-button gap-2 transition-all ${selectedUsers.length > 0
              ? ' glassy-text-primary hover:glassy-text-primary shadow'
              : ' glassy-text-secondary cursor-not-allowed'
              }`}
          >
            <FiSend size={18} />
            {selectedUsers.length > 0 ? (
              <>
                Send to {selectedUsers.length} {selectedUsers.length === 1 ? 'person' : 'people'}
              </>
            ) : (
              'Select people to share with'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;