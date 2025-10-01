import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPublic, createApiThunkPrivate } from '../../../src/components/hooks/apiThunk';

const initialState = {
  adminLoginData: {}, companyIndustryData: {}, adminProfileData: {}, profileRoleListData: {}, getAllProfileRoleListData: {}, companiesProfileData: {}, instituteProfileData: {}, sidebarPermissionsData: {},
}

export const adminLogin = createApiThunkPublic('adminLogin', '/admin/authorization/login', 'POST')
export const adminProfile = createApiThunkPrivate('adminProfile', '/admin/authorization/profile', 'GET')
export const adminChangePassword = createApiThunkPrivate('adminChangePassword', '/admin/authorization/change-password', 'POST')
export const verifyEmail = createApiThunkPublic('verifyEmail', '/admin/authorization/forgot-password', 'POST')
export const verifyOtp = createApiThunkPublic('verifyOtp', '/admin/authorization/verify-forgot-password-otp', 'POST')
export const resetPassword = createApiThunkPublic('resetPassword', '/admin/authorization/reset-password', 'POST')
export const updateProfile = createApiThunkPrivate('updateProfile', '/admin/authorization/update-profile', 'POST')

export const companyRegister = createApiThunkPublic('companyRegister', '/companies/authorization/register', 'POST')
export const companyIndustries = createApiThunkPublic('companyIndustries', '/companies/authorization/industries', 'GET')
export const companyRegisterVerifyOtp = createApiThunkPublic('companyRegisterVerifyOtp', '/companies/authorization/verify-register-otp', 'POST')

export const institutionTypePublic = createApiThunkPublic('institutionTypePublic', '/institutions/authorization/institution-types', 'GET')
export const institutionDegreePublic = createApiThunkPublic('institutionDegreePublic', '/institutions/authorization/degrees', 'GET')
export const institutionsRegister = createApiThunkPublic('institutionsRegister', '/institutions/authorization/register', 'POST')
export const institutionsRegisterVerifyOtp = createApiThunkPublic('institutionsRegisterVerifyOtp', '/institutions/authorization/verify-register-otp', 'POST')






export const profileRoleCreate = createApiThunkPrivate('profileRoleCreate', '/admin/profile-roles/create', 'POST')
export const profileRoleUpdate = createApiThunkPrivate('profileRoleUpdate', '/admin/profile-roles/update', 'POST')
export const profileRoleList = createApiThunkPrivate('profileRoleList', '/admin/profile-roles/list', 'GET')
export const profileRoleEnableDisable = createApiThunkPrivate('profileRoleEnableDisable', '/admin/profile-roles/enable-disable', 'POST')
export const profileRoleDelete = createApiThunkPrivate('profileRoleDelete', '/admin/profile-roles/soft-delete', 'DELETE')
export const getAllProfileRoleList = createApiThunkPrivate('getAllProfileRoleList', '/admin/profile-roles/all-documents', 'GET')
export const profileRoleAddOnData = createApiThunkPrivate('profileRoleAddOnData', '/admin/profile-roles/add-ons-data', 'POST')


export const instituteLogin = createApiThunkPublic('instituteLogin', '/institutions/authorization/login', 'POST')
export const instituteProfile = createApiThunkPrivate('instituteProfile', '/institutions/authorization/profile', 'GET')
export const verifyEmailInstitutions = createApiThunkPublic('verifyEmailInstitutions', '/institutions/authorization/forgot-password', 'POST')
export const verifyOtpInstitutions = createApiThunkPublic('verifyOtpInstitutions', '/institutions/authorization/verify-forgot-password-otp', 'POST')
export const resetPasswordInstitutions = createApiThunkPublic('resetPasswordInstitutions', '/institutions/authorization/reset-password', 'POST')
export const updateProfileInstitutions = createApiThunkPrivate('updateProfileInstitutions', '/institutions/authorization/update-profile', 'POST')

export const companyLogin = createApiThunkPublic('companyLogin', '/companies/authorization/login', 'POST')
export const companiesProfile = createApiThunkPrivate('companiesProfile', '/companies/authorization/profile', 'GET')
export const verifyEmailCompanies = createApiThunkPublic('verifyEmailCompanies', '/companies/authorization/forgot-password', 'POST')
export const verifyOtpCompanies = createApiThunkPublic('verifyOtpCompanies', '/companies/authorization/verify-forgot-password-otp', 'POST')
export const resetPasswordCompanies = createApiThunkPublic('resetPasswordCompanies', '/companies/authorization/reset-password', 'POST')
export const updateProfileCompanies = createApiThunkPrivate('updateProfileCompanies', '/companies/authorization/update-profile', 'POST')

export const adminSidebarPermissions = createApiThunkPrivate(
  'adminSidebarPermissions',
  '/admin/authorization/permissions',
  'GET',
);
export const companiesSidebarPermissions = createApiThunkPrivate(
  'companiesSidebarPermissions',
  '/companies/authorization/permissions',
  'GET',
);
export const institutionsSidebarPermissions = createApiThunkPrivate(
  'institutionsSidebarPermissions',
  '/institutions/authorization/permissions',
  'GET',
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: builder => {
    createExtraReducersForThunk(builder, adminLogin, 'adminLoginData')
    createExtraReducersForThunk(builder, adminProfile, 'adminProfileData')
    createExtraReducersForThunk(builder, profileRoleList, 'profileRoleListData')
    createExtraReducersForThunk(builder, getAllProfileRoleList, 'getAllProfileRoleListData')
    createExtraReducersForThunk(builder, companiesProfile, 'companiesProfileData')
    createExtraReducersForThunk(builder, instituteProfile, 'instituteProfileData')
    createExtraReducersForThunk(builder, adminSidebarPermissions, 'sidebarPermissionsData')
    createExtraReducersForThunk(builder, companiesSidebarPermissions, 'sidebarPermissionsData')
    createExtraReducersForThunk(builder, institutionsSidebarPermissions, 'sidebarPermissionsData')
    createExtraReducersForThunk(builder, companyRegister, 'companyRegisterData')
    createExtraReducersForThunk(builder, companyIndustries, 'companyIndustryData')

  }
})

export default authSlice.reducer