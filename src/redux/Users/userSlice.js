import { createSlice } from "@reduxjs/toolkit";
import {
  createExtraReducersForThunk,
  createApiThunkPrivate,
  createApiThunkPublic,
} from "../../../src/components/hooks/apiThunk";

const initialState = {
  suggestedUserData: {},
  termsAndConditionsData: {},
  getPostListData: {},
  getPostOnHomeData: {},
  jobScreeningQuestionData: {},
  notificationsData: {},
  getFollowingListData: {},
  getFollowingListByUserIdData: {},
};

export const suggestedUser = createApiThunkPrivate(
  "suggestedUser",
  "/user/profiles/suggested-connections",
  "GET"
);
export const termsAndConditions = createApiThunkPrivate(
  "termsAndConditions",
  "/user/profiles/settings?type=terms-and-conditions",
  "GET"
);
export const viewUserProfile = createApiThunkPrivate(
  "viewUserProfile",
  "/user/profiles/view-user-profile",
  "GET"
);
export const createUserConnection = createApiThunkPrivate(
  "createUserConnection",
  "/user/profiles/create-user-connections",
  "POST"
);
export const messageChatUser = createApiThunkPrivate(
  "messageChatUser",
  "/user/profiles/user-connections-list",
  "GET"
);
export const connectionListByUserId = createApiThunkPrivate(
  "connectionListByUserId",
  "/user/profiles/user-connections-list-by-user-id",
  "GET"
);
export const messageConnectionChatUser = createApiThunkPrivate(
  "messageConnectionChatUser",
  "/user/profiles/user-connections-list-for-chat",
  "GET"
);
export const userChatList = createApiThunkPrivate(
  "userChatList",
  "/user/profiles/user-connections-chat-list",
  "GET"
);
export const createPost = createApiThunkPrivate(
  "createPost",
  "/user/post/create",
  "POST"
);
export const updatePost = createApiThunkPrivate(
  "updatePost",
  "/user/post/update",
  "POST"
);
export const enableDisablePost = createApiThunkPrivate(
  "enableDisablePost",
  "/user/post/enable-disable",
  "POST"
);
export const getPostList = createApiThunkPrivate(
  "getPostList",
  "/user/post/list",
  "GET"
);
export const deletePost = createApiThunkPrivate(
  "deletePost",
  "/user/post/soft-delete",
  "DELETE"
);
export const followUnfollowUsers = createApiThunkPrivate(
  "followUnfollowUsers",
  "/user/followings/follow-unfollow",
  "POST"
);
export const likeDislikePostComment = createApiThunkPrivate(
  "likeDislikePost",
  "/user/post/like-dislike",
  "POST"
);
export const commentOnPost = createApiThunkPrivate(
  "commentPost",
  "/user/post/add-comment-on-post",
  "POST"
);
export const replyToComment = createApiThunkPrivate(
  "replyToComment",
  "/user/post/reply-to-comment",
  "POST"
);
export const getReplyOnPost = createApiThunkPrivate(
  "replyOnPost",
  "/user/post/replies-on-comment",
  "POST"
);
export const getCommentOnPost = createApiThunkPrivate(
  "createPost",
  "/user/post/comments-on-post",
  "POST"
);
export const getPostOnHome = createApiThunkPrivate(
  "getLikeOnPost",
  "/user/post/post-list",
  "GET",
  true
);
export const uploadImage = createApiThunkPrivate(
  "uploadImage",
  "/global-module/upload",
  "POST"
);
export const jobScreeningQuestion = createApiThunkPrivate(
  "jobScreeningQuestion",
  "/user/jobs/job-screening-questions",
  "POST"
);
export const applyJobApplication = createApiThunkPrivate(
  "applyJobApplication",
  "/user/jobs/apply-job-application",
  "POST"
);
export const addBookmarked = createApiThunkPrivate('addBookmarked', '/user/jobs/add-on-bookmarked', 'POST')
export const notificationsList = createApiThunkPrivate(
  "notificationsList",
  "/global-module/notifications/list",
  "GET"
);
export const notificationsMarkAsRead = createApiThunkPrivate(
  "notificationsMarkAsRead",
  "/global-module/notifications/markAsRead",
  "POST"
);
export const notificationsMarkAllRead = createApiThunkPrivate(
  "notificationsMarkAllRead",
  "/global-module/notifications/markAllRead",
  "POST"
);
export const adminUsersDetails = createApiThunkPrivate(
  "adminUsersDetails",
  "/user/profiles/admin-details",
  "GET"
);
export const sharePost = createApiThunkPrivate(
  "sharePost",
  "/user/post/share-post",
  "POST"
);
export const reportPost = createApiThunkPrivate(
  "reportPost",
  "/user/post/report-post",
  "POST"
);
export const blockUnblockUser = createApiThunkPrivate(
  "blockUnblockUser",
  "/user/profiles/block-unblock-connection",
  "POST"
);
export const clearChats = createApiThunkPrivate(
  "clearChats",
  "/user/profiles/clear-chats",
  "POST"
);
export const getPostDetails = createApiThunkPublic(
  "getPostDetails",
  "/user/post/get-post-details",
  "GET"
);
export const addOneData = createApiThunkPrivate(
  "addOneData",
  "/user/profiles/add-ons-data",
  "POST"
);
export const getFollowingList = createApiThunkPrivate(
  "getFollowingList",
  "/user/followings/list",
  "GET"
);
export const getFollowingListbyUserId = createApiThunkPrivate(
  "getFollowingListByUserId",
  "/user/followings/list-by-user-id",
  "GET"
);
export const voteOnPoll = createApiThunkPrivate(
  "voteOnPoll",
  "/user/post/vote-on-poll",
  "POST"
);

export const viewCompanyInstituteProfile = createApiThunkPrivate(
  "viewCompanyInstituteProfile",
  "/user/profiles/view-org-profile",
  "GET"
);
export const unreadCount = createApiThunkPrivate(
  "unreadCount",
  "/user/profiles/unread-counts",
  "GET"
);

export const deleteComment = createApiThunkPrivate(
  "deleteComment",
  "/user/post/delete-comment",
  "POST"
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Add this reducer to handle like updates
    updatePostLike: (state, action) => {
      const { postId, isLiked, likeCount } = action.payload;

      if (state.getPostOnHomeData?.data?.data?.list) {
        const postIndex = state.getPostOnHomeData.data.data.list.findIndex(
          (post) => post._id === postId
        );

        if (postIndex !== -1) {
          state.getPostOnHomeData.data.data.list[postIndex] = {
            ...state.getPostOnHomeData.data.data.list[postIndex],
            isLiked: isLiked,
            like_count: likeCount,
          };
        }
      }

      if (state.getPostListData?.data?.data?.list) {
        const postIndex = state.getPostListData.data.data.list.findIndex(
          (post) => post._id === postId
        );

        if (postIndex !== -1) {
          state.getPostListData.data.data.list[postIndex] = {
            ...state.getPostListData.data.data.list[postIndex],
            isLiked: isLiked,
            like_count: likeCount,
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    createExtraReducersForThunk(builder, suggestedUser, "suggestedUserData");
    createExtraReducersForThunk(
      builder,
      termsAndConditions,
      "termsAndConditionsData"
    );
    createExtraReducersForThunk(builder, getPostList, "getPostListData");
    createExtraReducersForThunk(builder, getPostOnHome, "getPostOnHomeData");
    createExtraReducersForThunk(
      builder,
      notificationsList,
      "notificationsData"
    );
    createExtraReducersForThunk(
      builder,
      jobScreeningQuestion,
      "jobScreeningQuestionData"
    );
    createExtraReducersForThunk(
      builder,
      getFollowingList,
      "getFollowingListData"
    );
    createExtraReducersForThunk(
      builder,
      getFollowingListbyUserId,
      "getFollowingListByUserIdData"
    );
  },
});

export const { updatePostLike } = userSlice.actions;

export default userSlice.reducer;
