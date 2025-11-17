import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPublic, createApiThunkPrivate } from '../../../src/components/hooks/apiThunk';

const initialState = {
    loginData: {}, adminProfileData: {}, registerData: {}, getProfileData: {},
    profileImageUpdated: false
}

export const login = createApiThunkPublic('login', '/user/auth/login', 'POST')
export const termsAndConditions = createApiThunkPublic('termsAndConditions', 'user/auth/settings?type=terms-and-conditions', 'GET')

export const adminProfile = createApiThunkPrivate('adminProfile', '/admin/authorization/profile', 'GET')
export const adminChangePassword = createApiThunkPrivate('adminChangePassword', '/admin/authorization/change-password', 'POST')
export const verifyEmail = createApiThunkPublic('verifyEmail', '/admin/authorization/forgot-password', 'POST')
export const verifyOtp = createApiThunkPublic('verifyOtp', '/admin/authorization/verify-forgot-password-otp', 'POST')
// export const resetPassword = createApiThunkPublic('resetPassword', '/admin/authorization/reset-password', 'POST')
export const updateProfile = createApiThunkPrivate('updateProfile', '/admin/authorization/update-profile', 'POST')
export const changePassword = createApiThunkPrivate('changePassword', '/user/auth/change-password', 'POST')

export const institutionTypePublic = createApiThunkPublic('institutionTypePublic', '/institutions/authorization/institution-types', 'GET')
export const institutionDegreePublic = createApiThunkPublic('institutionDegreePublic', '/institutions/authorization/degrees', 'GET')
export const institutionsRegister = createApiThunkPublic('institutionsRegister', '/institutions/authorization/register', 'POST')
export const institutionsRegisterVerifyOtp = createApiThunkPublic('institutionsRegisterVerifyOtp', '/institutions/authorization/verify-register-otp', 'POST')
export const instituteProfile = createApiThunkPrivate('instituteProfile', '/institutions/authorization/profile', 'GET')



export const register = createApiThunkPublic('register', '/user/auth/register', 'POST')
export const verifyRegisterOtp = createApiThunkPublic('verifyRegisterOtp', '/user/auth/verify-register', 'POST')

export const profileRoleUpdate = createApiThunkPrivate('profileRoleUpdate', '/admin/profile-roles/update', 'POST')
export const profileRoleList = createApiThunkPrivate('profileRoleList', '/admin/profile-roles/list', 'GET')
export const profileRoleEnableDisable = createApiThunkPrivate('profileRoleEnableDisable', '/admin/profile-roles/enable-disable', 'POST')
export const profileRoleDelete = createApiThunkPrivate('profileRoleDelete', '/admin/profile-roles/soft-delete', 'DELETE')

export const addEducation = createApiThunkPrivate('addEducation', 'user/educations/add-education-details', 'POST')
export const addWorkExp = createApiThunkPrivate('addWorkExp', 'user/work-experience/add-work-experience-details', 'POST')
export const getProfile = createApiThunkPrivate('getProfile', '/user/profiles/get-profile', 'GET')
export const userProfileUpdate = createApiThunkPrivate('userProfileUpdate', '/user/profiles/update-profile', 'POST')
export const forgotPassword = createApiThunkPublic('forgotPassword', '/user/auth/forgot-password', 'POST')
export const verifyPassword = createApiThunkPublic('verifyPassword', '/user/auth/verify-forgot-password-otp', 'POST')
export const resetPassword = createApiThunkPublic('resetPassword', '/user/auth/reset-password', 'POST')
export const addProject = createApiThunkPrivate('addProject', 'user/projects/add-project-details', 'POST')
export const addCertification = createApiThunkPrivate('addCertification', '/user/certifications/add-certification-details', 'POST')
export const updateProfileImage = createApiThunkPrivate('updateProfileImage', '/user/profiles/update-profile-image', 'POST')

export const updateFrameStatus = createApiThunkPrivate('updateFrameStatus', '/user/profiles/update-frame-status', 'POST')

export const switchAccount = createApiThunkPrivate('switchAccount', '/user/auth/switch-account', 'POST')
export const switchAccountCompany = createApiThunkPrivate('switchAccountCompany', '/user/auth/switch-to-company', 'POST')
export const switchAccountInstitution = createApiThunkPrivate('switchAccountInstitution', '/user/auth/switch-to-instution', 'POST')

export const fetchLoginCredentials = createApiThunkPublic('loginCredentials', '/user/auth/login-credentials', 'POST')
export const registerWithGoogle = createApiThunkPublic('registerWithGoogle', '/user/auth/register-with-google', 'POST')

export const companyRegister = createApiThunkPublic('companyRegister', '/companies/authorization/register', 'POST')
export const companyIndustries = createApiThunkPublic('companyIndustries', '/companies/authorization/industries', 'GET')
export const companyRegisterVerifyOtp = createApiThunkPublic('companyRegisterVerifyOtp', '/companies/authorization/verify-register-otp', 'POST')

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateProfileImageLocally: (state, action) => {
            if (state.getProfileData?.data?.data?.personalInfo) {
                state.getProfileData.data.data.personalInfo.profile_picture_url = action.payload;
                state.profileImageUpdated = !state.profileImageUpdated;
            }
        },

        resetProfileImageUpdate: (state) => {
            state.profileImageUpdated = false;
        }
    },
    extraReducers: builder => {
        createExtraReducersForThunk(builder, login, 'loginData')
        createExtraReducersForThunk(builder, adminProfile, 'adminProfileData')
        createExtraReducersForThunk(builder, register, 'registerData')
        createExtraReducersForThunk(builder, getProfile, 'getProfileData')
        createExtraReducersForThunk(builder, fetchLoginCredentials, 'loginData')
        createExtraReducersForThunk(builder, companyRegister, 'companyRegisterData')
        createExtraReducersForThunk(builder, instituteProfile, 'instituteProfileData')






        builder.addCase(updateProfileImage.fulfilled, (state, action) => {
            if (action.payload?.data?.imageURL) {
                if (state.getProfileData?.data?.data?.personalInfo) {
                    state.getProfileData.data.data.personalInfo.profile_picture_url = action.payload.data.imageURL;
                    state.profileImageUpdated = !state.profileImageUpdated;
                }
            }
        });


    }
})

export const { updateProfileImageLocally, resetProfileImageUpdate } = authSlice.actions;

export default authSlice.reducer