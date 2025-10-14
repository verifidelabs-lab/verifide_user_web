import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPrivate } from '../../components/hooks/apiThunk';

const initialState = {
    getCompaniesListData: {}, getCompaniesDetailsData: {}, getListData: {}, getPostListData: {}, notificationsData: {}, getAssignedUsersData: {}, // ✅ new
}

export const getCompaniesList = createApiThunkPrivate('getCompaniesList', '/admin/companies/list', 'GET')
export const createCompanies = createApiThunkPrivate('createCompanies', '/admin/companies/create', 'POST')
export const updateCompanies = createApiThunkPrivate('updateCompanies', '/admin/companies/update', 'POST')
export const deleteCompanies = createApiThunkPrivate('deleteCompanies', '/admin/companies/soft-delete', 'DELETE')
export const getCompaniesDetails = createApiThunkPrivate('getCompaniesDetails', '/admin/companies/single-document', 'GET', 'true')
export const verifyCompanies = createApiThunkPrivate('verifyCompanies', '/admin/companies/verify-company', 'POST',)
export const updatePasswordCompanies = createApiThunkPrivate('updatePasswordCompanies', '/admin/companies/update-password', 'POST')
export const companiesAddOnsData = createApiThunkPrivate('companiesAddOnsData', '/admin/companies/add-ons-data', 'POST')



export const createInstitute = createApiThunkPrivate('createInstitute', '/admin/institutions/create', 'POST')
export const getList = createApiThunkPrivate('createInstitute', '/admin/institutions/list', 'GET')
export const updateInstitute = createApiThunkPrivate('updateInstitute', '/admin/institutions/update', 'POST')
export const deleteInstitute = createApiThunkPrivate('deleteInstitute', '/admin/institutions/soft-delete', 'DELETE')
export const verifyInstitute = createApiThunkPrivate('verifyInstitute', '/admin/institutions/verify-institutions', 'POST')
export const updatePasswordInstitute = createApiThunkPrivate('updatePasswordInstitute', '/admin/institutions/update-password', 'POST',)
export const instituteAddOnsData = createApiThunkPrivate('instituteAddOnsData', '/admin/institutions/add-ons-data', 'POST',)


export const getInstituteDetails = createApiThunkPrivate('getInstituteDetails', '/admin/institutions/single-document', 'GET', 'true')
export const createPost = createApiThunkPrivate('createPost', '/global-module/post/create', 'POST')
export const updatePost = createApiThunkPrivate('updatePost', '/global-module/post/update', 'POST')
export const enableDisablePost = createApiThunkPrivate('enableDisablePost', '/global-module/post/enable-disable', 'POST')
export const getPostList = createApiThunkPrivate('getPostList', '/global-module/post/list', 'GET')
export const deletePost = createApiThunkPrivate('deletePost', '/global-module/post/soft-delete', 'DELETE')
export const getCommentOnPost = createApiThunkPrivate('getCommentOnPost', '/global-module/post/comments-on-post', 'POST')
export const getReplyOnPost = createApiThunkPrivate('getReplyOnPost', '/global-module/post/replies-on-comment', 'POST')

export const notificationsList = createApiThunkPrivate('notificationsList', '/global-module/notifications/list', 'GET')
export const notificationsMarkAsRead = createApiThunkPrivate('notificationsMarkAsRead', '/global-module/notifications/markAsRead', 'POST')
export const notificationsMarkAllRead = createApiThunkPrivate('notificationsMarkAllRead', '/global-module/notifications/markAllRead', 'POST')

export const adminPermissions = createApiThunkPrivate('adminPermissions', '/admin/authorization/permissions', 'GET')
export const companiesPermissions = createApiThunkPrivate('companiesPermissions', '/companies/authorization/permissions', 'GET')
export const institutionsPermissions = createApiThunkPrivate('institutionsPermissions', '/institutions/authorization/permissions', 'GET')



// POST → Assign a user to company
export const assignUserToCompany = createApiThunkPrivate(
    'assignUserToCompany',
    '/companies/sub-admin/assign-user',
    'POST'
);

// GET → Get all assigned users
export const getAssignedUsers = createApiThunkPrivate(
    'getAssignedUsers',
    '/companies/sub-admin/assigned-users',
    'GET'
);

// DELETE → Remove assigned user
export const removeAssignedUser = createApiThunkPrivate(
    'removeAssignedUser',
    '/companies/sub-admin/remove-assigned-user',
    'DELETE'
);


const companiesSlice = createSlice({
    name: 'companies',
    initialState,
    extraReducers: builder => {
        createExtraReducersForThunk(builder, getCompaniesList, 'getCompaniesListData')
        createExtraReducersForThunk(builder, getCompaniesDetails, 'getCompaniesDetailsData')
        createExtraReducersForThunk(builder, getList, 'getListData')
        createExtraReducersForThunk(builder, getInstituteDetails, 'getInstituteDetailsData')
        createExtraReducersForThunk(builder, getPostList, 'getPostListData')
        createExtraReducersForThunk(builder, notificationsList, 'notificationsData')
        createExtraReducersForThunk(builder, getAssignedUsers, 'getAssignedUsersData');


    }
})

export default companiesSlice.reducer