/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BiArrowBack, BiSearch } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import {
  blockUnblockUser,
  clearChats,
  createUserConnection,
  messageChatUser,
  messageConnectionChatUser,
  userChatList,
} from "../../redux/Users/userSlice";
import { toast } from "sonner";
import {
  uploadImageDirectly,
  uploadPdfDirectly,
  uploadVideoDirectly,
} from "../../components/utils/globalFunction";
import { FiMoreVertical } from "react-icons/fi";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import ContactItem from "./ContactList";
import { getCookie } from "../../components/utils/cookieHandler";
import { ROLES } from "../../utils/utils";

export default function Message({
  profileData,
  instituteProfileData,
  companiesProfileData,
  socket,
}) {
  const userRole = Number(getCookie("ROLE"));

  const profileDataId = [ROLES.COMPANIES, ROLES.COMPANIES_ADMIN].includes(
    userRole
  )
    ? companiesProfileData
    : [ROLES.INSTITUTIONS, ROLES.INSTITUTIONS_ADMIN].includes(userRole)
    ? instituteProfileData
    : profileData;
  const { id, isConnected } = useParams();
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [chatLoading, setChatLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const fileInputRef = useRef();
  const [mediaPreview, setMediaPreview] = useState({
    file_url: null,
    file_type: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const messagesEndRef = useRef(null);
  const [isMenuShow, setIsMenuShow] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // New state for reply
  const currentUserId = profileDataId?._id;

  const getFileTypeFromUrl = (url) => {
    if (!url) return null;

    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension))
      return "image";
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(extension))
      return "video";
    if (extension === "pdf") return "pdf";
    return null;
  };

  const defaultInterviewData = {
    share_id: null,
    share_path: "",
    content: "",
    select_date: null,
    select_time: null,
    meeting_url: "",
    image_urls: [],
    tags: [],
    user_details: {},
    job_details: {
      _id: null,
      job_type: "",
      job_location: "",
      work_location: "",
      pay_type: "",
      salary_range: "",
      company: {
        name: "",
        logo_url: "",
      },
      industry: {
        name: "",
      },
      job_title_details: {
        name: "",
      },
      required_skills: [],
    },
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const normalizeMessage = useCallback((msg) => {
  //   const uniqueId = msg._id || msg.id || `temp_${Date.now()}_${Math.random()}_${msg.sender_id}`;

  //   let fileType = 'text';

  //   if (msg.file_type === 'shared-interview') {
  //     fileType = 'shared-interview';
  //   } else if (msg.shared_data && (msg.shared_data.content || msg.shared_data.image_urls?.length > 0)) {
  //     fileType = 'shared-post';
  //   } else if (msg.file_type) {
  //     fileType = msg.file_type;
  //   } else if (msg.file_url) {
  //     fileType = getFileTypeFromUrl(msg.file_url);
  //   }

  //   return {
  //     ...msg,
  //     id: uniqueId,
  //     _id: msg._id || uniqueId,
  //     timestamp: msg.createdAt || msg.timestamp || Date.now(),
  //     file_type: fileType,
  //     shared_data: fileType === 'shared-interview'
  //       ? { ...defaultInterviewData, ...msg.shared_data }
  //       : msg.shared_data || { image_urls: [], content: "", tags: [], share_id: null },
  //     // Include reply data if exists
  //     isReplied: msg.isReplied || false,
  //     chat_id: msg.chat_id || null,
  //     reply_to: msg.reply_to || null
  //   };
  // });

  const normalizeMessage = useCallback(
    (msg) => {
      const uniqueId =
        msg._id ||
        msg.id ||
        `temp_${Date.now()}_${Math.random()}_${msg.sender_id}`;

      let fileType = "text";

      if (msg.file_type === "shared-interview") {
        fileType = "shared-interview";
      } else if (
        msg.shared_data &&
        (msg.shared_data.content || msg.shared_data.image_urls?.length > 0)
      ) {
        fileType = "shared-post";
      } else if (msg.file_type) {
        fileType = msg.file_type;
      } else if (msg.file_url) {
        fileType = getFileTypeFromUrl(msg.file_url);
      }

      // Handle reply data
      const replyData = msg.replyChat
        ? {
            isReplied: true,
            chat_id: msg.replyChat._id,
            reply_to: normalizeMessage(msg.replyChat),
          }
        : {
            isReplied: msg.isReplied || false,
            chat_id: msg.chat_id || null,
            reply_to: msg.reply_to || null,
          };

      return {
        ...msg,
        id: uniqueId,
        _id: msg._id || uniqueId,
        timestamp: msg.createdAt || msg.timestamp || Date.now(),
        file_type: fileType,
        shared_data:
          fileType === "shared-interview"
            ? { ...defaultInterviewData, ...msg.shared_data }
            : msg.shared_data || {
                image_urls: [],
                content: "",
                tags: [],
                share_id: null,
              },
        ...replyData,
        isRead: msg.isRead !== undefined ? msg.isRead : false,
        isPending: msg.isPending || false,
      };
    },
    [defaultInterviewData]
  );

  const fetchUserList = async () => {
    setLoading(true);
    try {
      const res = await dispatch(messageConnectionChatUser()).unwrap();
      setContacts(res?.data || []);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserList();
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (id || isConnected === "true") {
      const targetContact = contacts.find(
        (contact) => contact.connectionUserId === id
      );
      if (targetContact) {
        handleContactClick(targetContact);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts, id, isConnected]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // New function to handle reply
  const handleReply = (message) => {
    setReplyingTo(message);
    setIsMenuShow(false);
  };

  // New function to cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
  };

  // const handleContactClick = useCallback(async (contactData) => {
  //   setIsMenuShow(false)
  //   if (!contactData?.connectionUserId) {
  //     toast.error('Invalid contact data');
  //     return;
  //   }

  //   setChatLoading(true);
  //   setMediaPreview({ file_url: null, file_type: null });
  //   setReplyingTo(null); // Clear reply when switching contacts

  //   try {
  //     if (socket) {
  //       socket.emit("unsubscribe-from-chat", selectedContact?.connectionUserId);
  //       socket.emit("subscribe-to-chat", contactData.connectionUserId);
  //     }

  //     setSelectedContact(contactData);
  //     setMessages([]);

  //     const res = await dispatch(userChatList({
  //       receiver_id: contactData.connectionUserId,
  //       page: 1,
  //       size: 100
  //     })).unwrap();

  //     const normalizedMessages = (res?.data || []).map(normalizeMessage);
  //     setMessages(normalizedMessages);

  //     if (isMobileView) {
  //       setShowChat(true);
  //     }
  //   } catch (error) {
  //     console.error('Failed to load chat:', error);
  //     toast.error('Failed to load chat messages');
  //   } finally {
  //     setChatLoading(false);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch, socket, isMobileView, selectedContact]);

  const handleContactClick = useCallback(
    async (contactData) => {
      setIsMenuShow(false);
      console.log("This is the contact Data", contactData);
      if (!contactData?.connectionUserId) {
        toast.error("Invalid contact data");
        return;
      }

      setChatLoading(true);
      setMediaPreview({ file_url: null, file_type: null });
      setReplyingTo(null); // Clear reply when switching contacts

      try {
        // Unsubscribe from previous chat if exists
        if (socket && selectedContact?.connectionUserId) {
          socket.emit(
            "unsubscribe-from-chat",
            selectedContact.connectionUserId
          );
        }

        // Subscribe to new chat
        if (socket) {
          socket.emit("subscribe-to-chat", contactData.connectionUserId);
        }

        setSelectedContact(contactData);
        setMessages([]); // Clear previous messages

        // Fetch chat history
        const res = await dispatch(
          userChatList({
            receiver_id: contactData.connectionUserId,
            page: 1,
            size: 1000,
          })
        ).unwrap();

        const normalizedMessages = (res?.data || []).map((msg) => {
          const normalized = normalizeMessage(msg);

          if (normalized.isReplied && normalized.chat_id) {
            const repliedMsg = res.data.find(
              (m) => m._id === normalized.chat_id || m.id === normalized.chat_id
            );
            if (repliedMsg) {
              normalized.reply_to = normalizeMessage(repliedMsg);
            }
          }

          return normalized;
        });

        setMessages(normalizedMessages);

        if (isMobileView) {
          setShowChat(true);
        }
      } catch (error) {
        console.error("Failed to load chat:", error);
        toast.error("Failed to load chat messages");
      } finally {
        setChatLoading(false);
      }
    },
    [socket, dispatch, isMobileView, normalizeMessage]
  );

  useEffect(() => {
    return () => {
      if (
        mediaPreview.file_url &&
        typeof mediaPreview.file_url === "string" &&
        mediaPreview.file_url.startsWith("blob:")
      ) {
        URL.revokeObjectURL(mediaPreview.file_url);
      }

      if (socket && selectedContact?.connectionUserId) {
        socket.emit("unsubscribe-from-chat", selectedContact.connectionUserId);
      }
    };
  }, [mediaPreview.file_url, socket, selectedContact]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = null;

    if (
      mediaPreview.file_url &&
      typeof mediaPreview.file_url === "string" &&
      mediaPreview.file_url.startsWith("blob:")
    ) {
      URL.revokeObjectURL(mediaPreview.file_url);
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    const fileName = file.name.toLowerCase();
    const isImage = /\.(png|jpg|jpeg|gif|webp)$/.test(fileName);
    const isPdf = /\.pdf$/.test(fileName);
    const isVideo = /\.(mp4|mov|avi|mkv|webm)$/.test(fileName);

    if (!isImage && !isPdf && !isVideo) {
      toast.error(
        "Unsupported file type. Please upload an image, PDF, or video."
      );
      return;
    }

    let previewUrl = null;
    if (isImage || isVideo) {
      previewUrl = URL.createObjectURL(file);
      setMediaPreview({
        file_url: previewUrl,
        file_type: isImage ? "image" : "video",
      });
    } else if (isPdf) {
      setMediaPreview({
        file_url: file.name,
        file_type: "pdf",
      });
    }

    setLoading2(true);
    setUploadProgress(0);

    try {
      let result;
      const onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      };

      if (isImage) {
        result = await uploadImageDirectly(
          file,
          "CHAT_MEDIA",
          onUploadProgress
        );
      } else if (isPdf) {
        result = await uploadPdfDirectly(file, "CHAT_MEDIA", onUploadProgress);
      } else if (isVideo) {
        result = await uploadVideoDirectly(
          file,
          "CHAT_MEDIA",
          onUploadProgress
        );
      }

      if (result?.data?.imageURL) {
        setMediaPreview({
          file_url: result.data.imageURL,
          file_type: isImage ? "image" : isPdf ? "pdf" : "video",
        });
        toast.success("File uploaded successfully");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMediaPreview({ file_url: null, file_type: null });
      toast.error(error?.message || "Failed to upload file");
    } finally {
      setLoading2(false);
      setUploadProgress(0);
    }
  };

  const handleSendMessage = useCallback(async () => {
    const ROLE_NAMES = {
      1: "SUPER_ADMIN",
      2: "ADMIN",
      3: "Companies",
      4: "Institutions",
      5: "Users",
      6: "RECRUITERS",
      7: "COMPANIES_ADMIN",
      8: "INSTITUTIONS_ADMIN",
    };

    setIsMenuShow(false);
    if (!selectedContact?.connectionUserId) {
      toast.error("No contact selected");
      return;
    }

    if ((!messageInput.trim() && !mediaPreview.file_url) || sendingMessage) {
      return;
    }

    setSendingMessage(true);
    const messageText = messageInput.trim();
    const accessMode = Number(getCookie("ROLE"));
    const senderModel = ROLE_NAMES[accessMode] || "Users"; // fallback to Users
    console.log("this is the selected contact", selectedContact);
    try {
      const messagePayload = {
        id: `temp_${Date.now()}_${Math.random()}_${currentUserId}`,
        receiverId: selectedContact.connectionUserId,
        receiver_id: selectedContact.connectionUserId,
        sender_id: currentUserId,
        sender_model: senderModel, // 👈 add this
        receiver_model: selectedContact?.type,
        message: messageText,
        file_url: mediaPreview.file_url || null,
        file_type: mediaPreview.file_url ? mediaPreview.file_type : "text",
        timestamp: Date.now(),
        createdAt: Date.now(),
        isRead: false,
        isPending: true,
        shared_data: {
          image_urls: [],
          content: "",
          tags: [],
          share_id: null,
        },
        // Reply data
        isReplied: !!replyingTo,
        chat_id: replyingTo?._id || null,
        reply_to: replyingTo || null,
      };

      const normalizedMessage = normalizeMessage(messagePayload);
      setMessages((prev) => [...prev, normalizedMessage]);

      setMessageInput("");
      setMediaPreview({ file_url: null, file_type: null });
      setReplyingTo(null);

      if (socket) {
        socket.emit("send-chat-message", messagePayload);
        socket.on("message-delivered", (msg) => {
          // console.log("after receipt msg :---->", msg);

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];

            const lastPendingIndex = updatedMessages.findIndex(
              (m) => m.isPending === true
            );

            if (lastPendingIndex !== -1) {
              updatedMessages[lastPendingIndex] = {
                ...updatedMessages[lastPendingIndex],
                _id: msg._id,
              };
            }

            return updatedMessages;
          });
        });
      } else {
        throw new Error("Socket not available");
      }
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
      setMessages((prev) => prev.filter((msg) => !msg.isPending));
    } finally {
      setSendingMessage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    messageInput,
    selectedContact,
    socket,
    currentUserId,
    mediaPreview,
    sendingMessage,
    replyingTo,
  ]);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (msg) => {
      console.log("Incoming message-----:", msg);

      if (!selectedContact) return;

      const isForCurrentChat =
        (msg.receiver_id === currentUserId &&
          msg.sender_id === selectedContact.connectionUserId) ||
        (msg.sender_id === currentUserId &&
          msg.receiver_id === selectedContact.connectionUserId);

      if (!isForCurrentChat) return;

      const normalizedMessage = normalizeMessage(msg);

      setMessages((prev) => {
        const filtered = prev.filter((m) => {
          if (
            m.isPending &&
            m.message === msg.message &&
            m.file_url === msg.file_url &&
            m.sender_id === msg.sender_id
          ) {
            return false;
          }
          return true;
        });

        const exists = filtered.some((m) => {
          if (
            m._id === normalizedMessage._id &&
            normalizedMessage._id !== normalizedMessage.id
          ) {
            return true;
          }

          if (
            normalizedMessage.file_type === "shared-post" &&
            m.file_type === "shared-post"
          ) {
            const timeDiff = Math.abs(
              (m.timestamp || m.createdAt) -
                (normalizedMessage.timestamp || normalizedMessage.createdAt)
            );
            const sameContent =
              JSON.stringify(m.shared_data) ===
              JSON.stringify(normalizedMessage.shared_data);
            const sameSender = m.sender_id === normalizedMessage.sender_id;
            const sameReceiver =
              m.receiver_id === normalizedMessage.receiver_id;

            if (timeDiff < 1000 && sameContent && sameSender && sameReceiver) {
              return true;
            }
          }

          return false;
        });

        if (exists) {
          console.log("Message already exists, not adding duplicate");
          return filtered;
        }

        // console.log("Adding new message to chat");
        return [...filtered, normalizedMessage];
      });

      if (msg._id && msg.receiver_id === currentUserId) {
        socket.emit("mark-as-read", { chatId: msg._id });
      }
    };

    socket.on("receive-message", handleIncomingMessage);

    return () => {
      socket.off("receive-message", handleIncomingMessage);
    };
  }, [socket, currentUserId, selectedContact, normalizeMessage]);

  const handleBackClick = () => {
    setShowChat(false);
    setSelectedContact(null);
    setMediaPreview({ file_url: null, file_type: null });
    setReplyingTo(null); // Clear reply when going back
  };

  const filteredContacts = useMemo(
    () =>
      contacts.filter(
        (contact) =>
          contact.first_name
            ?.toLowerCase()
            .includes(searchKeyword.toLowerCase()) ||
          contact.last_name?.toLowerCase().includes(searchKeyword.toLowerCase())
      ),
    [contacts, searchKeyword]
  );

  const handleShowOption = () => {
    setIsMenuShow(!isMenuShow);
  };

  const handleUserAction = async (action) => {
    setIsMenuShow(false);

    if (action === "BLOCK") {
      const newStatus = selectedContact?.isBlocked ? "unblock" : "block";
      let PAYLOAD = {
        user_id: selectedContact?.connectionUserId,
        status: newStatus,
      };
      try {
        const res = await dispatch(blockUnblockUser(PAYLOAD)).unwrap();
        setSelectedContact((prev) => ({
          ...prev,
          isBlocked: !prev.isBlocked,
        }));
        setContacts((prev) =>
          prev.map((contact) =>
            contact.connectionUserId === selectedContact.connectionUserId
              ? { ...contact, isBlocked: false, isBlockedByYou: false }
              : contact
          )
        );
        const result = await dispatch(messageChatUser()).unwrap();
        setContacts(result?.data || []);
        toast.info(res?.message);
      } catch (error) {
        toast.error(error);
      }
    } else if (action === "CLEAR") {
      await dispatch(
        clearChats({ receiver_id: selectedContact?.connectionUserId })
      ).unwrap();
      setMessages([]);
      setReplyingTo(null); // Clear reply when clearing chat
    } else {
      toast.info("Ops something went wrong");
    }
  };

  const renderMessages = () => {
    if (chatLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="glassy-text-secondary text-sm">No messages yet</div>
          <div className="glassy-text-secondary text-xs mt-1">
            Send a message to start the conversation
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="text-center mb-4">
          <span className="text-xs glassy-text-secondary glassy-card px-3 py-1 rounded-full shadow-sm">
            Today
          </span>
        </div>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id || msg._id}
            msg={msg}
            isOwn={msg.sender_id === currentUserId}
            onReply={handleReply}
            messages={messages}
            user_id={selectedContact}
          />
        ))}
        <div ref={messagesEndRef} />
      </>
    );
  };

  const onDelete = async (data) => {
    try {
      const res = await dispatch(
        createUserConnection({ connection_user_id: data?.connectionUserId })
      ).unwrap();
      if (res) toast.success(res?.message || "User disconnected!");
      fetchUserList();
    } catch (e) {
      toast.error("Failed to disconnect");
    } finally {
    }
  };

  if (isMobileView) {
    return (
      <div className="h-screen glassy-card flex flex-col">
        {!showChat ? (
          <>
            <div className="p-4 border-b border-gray-200 sticky top-0 glassy-card z-10">
              <h1 className="text-xl font-bold glassy-text-primary">
                Messages
              </h1>
              <div className="relative mt-2">
                <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 glassy-text-secondary" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 glassy-input-notification border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <ContactItem
                    key={contact.connectionUserId}
                    contact={contact}
                    onClick={handleContactClick}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 glassy-card rounded-full flex items-center justify-center mb-4">
                    <BiSearch className="w-8 h-8 glassy-text-secondary" />
                  </div>
                  <p className="glassy-text-secondary text-center">
                    No conversations found
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 glassy-card sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <button onClick={handleBackClick} className="p-1">
                  <BiArrowBack className="w-5 h-5 glassy-text-secondary" />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="glassy-text-primary text-sm font-semibold">
                    {(selectedContact?.first_name?.[0] || "?").toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-base font-semibold glassy-text-primary capitalize">
                    {selectedContact?.first_name} {selectedContact?.last_name}
                  </h2>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-1 hover:glassy-card rounded-full">
                  <FiMoreVertical
                    className="w-5 h-5 glassy-text-secondary"
                    onClick={() => handleShowOption()}
                  />
                </button>
              </div>

              {isMenuShow && (
                <div className="absolute md:right-0 right-[40px] md:mt-20 mt-16 w-32 glassy-card border border-gray-200 rounded-xl shadow-lg z-50 transform transition-all duration-200 ease-in-out">
                  <ul className="text-xs font-medium divide-y divide-gray-100">
                    <li
                      className="px-4 py-1.5 cursor-pointer hover:glassy-card hover:text-red-500 flex items-center gap-2 transition-colors duration-150"
                      onClick={() => handleUserAction("BLOCK")}
                    >
                      {selectedContact?.isBlocked ? "UnBlock" : "Block"}
                    </li>
                    <li
                      className="px-4 py-1.5 cursor-pointer hover:glassy-card hover:text-blue-500 flex items-center gap-2 transition-colors duration-150"
                      onClick={() => handleUserAction("CLEAR")}
                    >
                      Clear
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 ">
              {renderMessages()}
            </div>

            <MessageInput
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              handleKeyPress={handleKeyPress}
              sendingMessage={sendingMessage}
              handleSendMessage={handleSendMessage}
              mediaPreview={mediaPreview}
              setMediaPreview={setMediaPreview}
              uploadProgress={uploadProgress}
              loading={loading}
              contacts={selectedContact}
              replyingTo={replyingTo}
              cancelReply={cancelReply}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-[92vh] p-4">
      <div className="glassy-card h-full rounded-xl shadow-sm overflow-hidden">
        <div className="flex h-full">
          {/* Left Sidebar: Conversations */}
          <div className="w-1/3  flex flex-col glassy-card">
            <div className="p-4  ">
              <h1 className="text-xl font-bold glassy-text-primary">
                Messages
              </h1>
              <div className="relative mt-3">
                <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 glassy-text-secondary" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 glassy-input-notification text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <ContactItem
                    key={contact.connectionUserId}
                    contact={contact}
                    isSelected={
                      selectedContact?.connectionUserId ===
                      contact.connectionUserId
                    }
                    onClick={handleContactClick}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-card-unread">
                    <BiSearch className="w-8 h-8 glassy-text-secondary" />
                  </div>
                  <p className="glassy-text-secondary text-center">
                    No conversations found
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Chat */}
          <div className="flex-1 flex flex-col">
            {selectedContact ? (
              <>
                <div className="flex items-center justify-between p-4  relative">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-card-unread rounded-full flex items-center justify-center">
                      {selectedContact?.profile_picture_url ? (
                        <img
                          src={selectedContact?.profile_picture_url}
                          alt="user"
                          className="rounded-full"
                        />
                      ) : (
                        <span className="glassy-text-primary text-sm font-semibold rounded-full">
                          <img
                            src="/0684456b-aa2b-4631-86f7-93ceaf33303c.png"
                            alt="default logo"
                            className="rounded-full"
                          />
                        </span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold glassy-text-primary capitalize">
                        {selectedContact.first_name} {selectedContact.last_name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button className="p-1 rounded-full hover:bg-button-hover/20">
                      <FiMoreVertical
                        className="w-5 h-5 glassy-text-primary"
                        onClick={() => handleShowOption()}
                      />
                    </button>
                  </div>

                  {isMenuShow && (
                    <div className="absolute md:right-0 right-[88px] md:mt-20 mt-16 w-32 glassy-card-header border rounded-xl shadow-lg z-50 transform transition-all duration-200 ease-in-out">
                      <ul className="text-xs font-medium divide-y divide-gray-100">
                        <li
                          className="px-4 py-1.5 cursor-pointer hover:bg-button-hover/20 hover:text-red-500 flex items-center gap-2 transition-colors duration-150 glassy-text-primary"
                          onClick={() => handleUserAction("BLOCK")}
                        >
                          {selectedContact?.isBlocked ? "UnBlock" : "Block"}
                        </li>
                        <li
                          className="px-4 py-1.5 cursor-pointer hover:bg-button-hover/20 hover:text-blue-500 flex items-center gap-2 transition-colors duration-150 glassy-text-primary"
                          onClick={() => handleUserAction("CLEAR")}
                        >
                          Clear
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {renderMessages()}
                </div>

                <MessageInput
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  messageInput={messageInput}
                  setMessageInput={setMessageInput}
                  handleKeyPress={handleKeyPress}
                  sendingMessage={sendingMessage}
                  handleSendMessage={handleSendMessage}
                  mediaPreview={mediaPreview}
                  setMediaPreview={setMediaPreview}
                  uploadProgress={uploadProgress}
                  loading={loading2}
                  contacts={selectedContact}
                  replyingTo={replyingTo}
                  cancelReply={cancelReply}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-6 max-w-md">
                  <div className="w-20 h-20 bg-card-unread rounded-full flex items-center justify-center mx-auto mb-6">
                    <BiSearch className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold glassy-text-primary mb-2">
                    Select a chat to start messaging
                  </h3>
                  <p className="text-sm glassy-text-secondary mb-4">
                    Choose from your existing conversations or start a new one
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
