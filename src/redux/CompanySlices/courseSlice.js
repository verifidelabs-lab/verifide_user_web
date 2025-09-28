import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPrivate } from '../../../src/components/hooks/apiThunk';

const initialState = {
    getCourseCategoryData: {},
    getCourseManagementData: {},
    getSubAdminListData: {},
    getCompaniesSubAdminListData: {},
    getInstituteSubAdminListData: {},
    getSkillsData: {},
    getAllSkillsSuggestionData: {},
    getLevelsData: {},
    getUserListData: {},
    getVerificationCenterList: {},
    getAssessmentsListData: {},
    cmsListData: {},
    cmsContentListData: {},
    promotionListData: {},
    getPostsData: {}
}

export const courseCategoryCreate = createApiThunkPrivate('courseCategoryCreate', '/global-module/course-categories/create', 'POST')
export const courseCategoryUpdate = createApiThunkPrivate('courseCategoryUpdate', '/global-module/course-categories/update', 'POST')
export const getCourseCategory = createApiThunkPrivate('getCourseCategory', '/global-module/course-categories/list', 'GET')
export const getCourseCategorySingleDoc = createApiThunkPrivate('getCourseCategorySingleDoc', '/global-module/course-categories/single-document', 'GET')
export const courseCategoryDelete = createApiThunkPrivate('courseCategoryDelete', '/global-module/course-categories/soft-delete', 'DELETE')
export const courseCategoryEnableDisable = createApiThunkPrivate('courseCategoryEnableDisable', '/global-module/course-categories/enable-disable', 'POST')

export const getCourseCategoryALLData = createApiThunkPrivate('getCourseCategoryALLData', '/global-module/course-categories/all-documents', 'GET')
export const courseManagementCreate = createApiThunkPrivate('courseManagementCreate', '/global-module/course/create', 'POST')
export const courseManagementUpdate = createApiThunkPrivate('courseManagementUpdate', '/global-module/course/update', 'POST')
export const getCourseManagement = createApiThunkPrivate('getCourseManagement', '/global-module/course/list', 'GET')
export const getCourseManagementSingleDoc = createApiThunkPrivate('getCourseManagementSingleDoc', '/global-module/course/single-document', 'GET')
export const courseManagementDelete = createApiThunkPrivate('courseManagementDelete', '/global-module/course/soft-delete', 'DELETE')
export const courseManagementEnableDisable = createApiThunkPrivate('courseManagementEnableDisable', '/global-module/course/enable-disable', 'POST')


export const skillsCreate = createApiThunkPrivate('skillsCreate', '/admin/skills/create', 'POST')
export const skillsUpdate = createApiThunkPrivate('skillsUpdate', '/admin/skills/update', 'POST')
export const getSkills = createApiThunkPrivate('getSkills', '/admin/skills/list', 'GET')
export const skillsSuggestionDelete = createApiThunkPrivate('skillsSuggestionDelete', '/admin/skills/soft-delete', 'DELETE')
export const skillsSuggestionEnableDisable = createApiThunkPrivate('skillsSuggestionEnableDisable', '/admin/skills/enable-disable', 'POST')
export const getAllSkillsSuggestion = createApiThunkPrivate('getAllSkillsSuggestion', '/admin/skills/all-documents', 'GET')
export const skillsAddOnsData = createApiThunkPrivate('skillsAddOnsData', '/admin/skills/add-ons-data', 'POST')

export const subAdminCreate = createApiThunkPrivate('subAdminCreate', '/admin/sub-admin/create', 'POST')
export const subAdminUpdate = createApiThunkPrivate('subAdminUpdate', '/admin/sub-admin/update', 'POST')
export const subAdminUpdatePassword = createApiThunkPrivate('subAdminUpdatePassword', '/admin/sub-admin/update-password', 'POST')
export const subAdminList = createApiThunkPrivate('subAdminList', '/admin/sub-admin/list', 'GET')
export const subAdminEnableDisable = createApiThunkPrivate('subAdminEnableDisable', '/admin/sub-admin/enable-disable', 'POST')


export const companiesSubAdminCreate = createApiThunkPrivate('companiesSubAdminCreate', '/companies/sub-admin/create', 'POST')
export const companiesSubAdminUpdate = createApiThunkPrivate('companiesSubAdminUpdate', '/companies/sub-admin/update', 'POST')
export const companiesSubAdminUpdatePassword = createApiThunkPrivate('companiesSubAdminUpdatePassword', '/companies/sub-admin/update-password', 'POST')
export const companiesSubAdminList = createApiThunkPrivate('companiesSubAdminList', '/companies/sub-admin/list', 'GET')
export const companiesSubAdminEnableDisable = createApiThunkPrivate('companiesSubAdminEnableDisable', '/companies/sub-admin/enable-disable', 'POST')

export const institutionsSubAdminCreate = createApiThunkPrivate('institutionsSubAdminCreate', '/institutions/sub-admin/create', 'POST')
export const institutionsSubAdminUpdate = createApiThunkPrivate('institutionsSubAdminUpdate', '/institutions/sub-admin/update', 'POST')
export const institutionsSubAdminUpdatePassword = createApiThunkPrivate('institutionsSubAdminUpdatePassword', '/institutions/sub-admin/update-password', 'POST')
export const institutionsSubAdminList = createApiThunkPrivate('institutionsSubAdminList', '/institutions/sub-admin/list', 'GET')
export const institutionsSubAdminEnableDisable = createApiThunkPrivate('institutionsSubAdminEnableDisable', '/institutions/sub-admin/enable-disable', 'POST')

export const levelCreate = createApiThunkPrivate('levelCreate', '/admin/levels/create', 'POST')
export const levelUpdate = createApiThunkPrivate('levelUpdate', '/admin/levels/update', 'POST')
export const getLevels = createApiThunkPrivate('getLevels', '/admin/levels/list', 'GET')
export const levelDelete = createApiThunkPrivate('levelDelete', '/admin/levels/soft-delete', 'DELETE')
export const levelEnableDisable = createApiThunkPrivate('levelEnableDisable', '/admin/levels/enable-disable', 'POST')
export const getAllLevel = createApiThunkPrivate('getAllLevel', '/admin/levels/all-documents', 'GET')
export const levelsAddOnsData = createApiThunkPrivate('levelsAddOnsData', '/admin/levels/add-ons-data', 'POST')


export const getUserList = createApiThunkPrivate('getUserList', '/admin/users/list', 'GET')
export const getUserSingleDoc = createApiThunkPrivate('getUserSingleDoc', '/admin/users/single-document', 'GET')
export const userEnableDisable = createApiThunkPrivate('userEnableDisable', '/admin/users/enable-disable', 'POST')


export const verificationCenterList = createApiThunkPrivate('verificationCenterList', '/global-module/verification-center/list', 'GET')
export const verificationCenterSingleDoc = createApiThunkPrivate('verificationCenterSingleDocList', '/global-module/verification-center/single-document', 'GET')
export const assignVerificationCenter = createApiThunkPrivate('assignVerificationCenter', '/global-module/verification-center/assign-request-to-admin', 'POST')
export const updateVerificationCenter = createApiThunkPrivate('updateVerificationCenter', '/global-module/verification-center/update-request-status', 'POST')
export const getAllAdminListData = createApiThunkPrivate('getAllAdminListData', '/admin/sub-admin/all-documents', 'GET')
export const getAllCompaniesAdminListData = createApiThunkPrivate('getAllCompaniesAdminListData', '/companies/sub-admin/all-documents', 'GET')
export const getAllInstitutionsAdminListData = createApiThunkPrivate('getAllInstitutionsAdminListData', '/institutions/sub-admin/all-documents', 'GET')

export const assessmentsSingleDocList = createApiThunkPrivate('assessmentsSingleDocList', '/global-module/assessments/single-document', 'GET')
export const assessmentsALLDocList = createApiThunkPrivate('assessmentsALLDocList', '/global-module/assessments/all-documents', 'GET')
export const assessmentsList = createApiThunkPrivate('assessmentsList', '/global-module/assessments/list', 'GET')
export const assessmentsEnableDisable = createApiThunkPrivate('assessmentsEnableDisable', '/global-module/assessments/enable-disable', 'POST')
export const assessmentsDelete = createApiThunkPrivate('assessmentsDelete', '/global-module/assessments/soft-delete', 'DELETE')
export const assessmentsCreate = createApiThunkPrivate('assessmentsCreate', '/global-module/assessments/create', 'POST')
export const assessmentsUpdate = createApiThunkPrivate('assessmentsUpdate', '/global-module/assessments/update', 'POST')
export const getALLCoursesDocList = createApiThunkPrivate('getALLCoursesDocList', '/global-module/course/all-documents', 'GET')


export const cmsList = createApiThunkPrivate('cmsList', '/admin/cms/fetch-category', 'POST')
export const cmsCreate = createApiThunkPrivate('cmsCreate', '/admin/cms/create-cms-category', 'POST')
export const cmsUpdate = createApiThunkPrivate('cmsUpdate', '/admin/cms/update-cms-category', 'POST')

export const cmsContentCreate = createApiThunkPrivate('cmsContentCreate', '/admin/cms/create-cms-content', 'POST')
export const cmsContentUpdate = createApiThunkPrivate('cmsContentUpdate', '/admin/cms/update-cms-content', 'POST')
export const cmsContentSoftDelete = createApiThunkPrivate('cmsContentSoftDelete', '/admin/cms/delete-content', 'DELETE')
export const cmsContentList = createApiThunkPrivate('cmsContentList', '/admin/cms/content-list', 'GET')
export const cmsContentEnableDisable = createApiThunkPrivate('cmsContentEnableDisable', '/admin/cms/enable-disable-content', 'POST')

export const promotionCreate = createApiThunkPrivate('promotionCreate', '/global-module/promotion-banner/create', 'POST')
export const promotionUpdate = createApiThunkPrivate('promotionUpdate', '/global-module/promotion-banner/update', 'POST')
export const promotionSoftDelete = createApiThunkPrivate('promotionSoftDelete', '/global-module/promotion-banner/soft-delete', 'DELETE')
export const promotionList = createApiThunkPrivate('promotionList', '/global-module/promotion-banner/list', 'GET')
export const promotionListSingleDoc = createApiThunkPrivate('promotionListSingleDoc', '/global-module/promotion-banner/single-document', 'GET')
export const promotionEnableDisable = createApiThunkPrivate('promotionEnableDisable', '/global-module/promotion-banner/enable-disable', 'POST')

export const getSinglePost = createApiThunkPrivate('getSinglePost', '/admin/post/single-document', 'GET')
export const getPosts = createApiThunkPrivate('getPosts', '/admin/post/list', 'GET')
export const postDelete = createApiThunkPrivate('postDelete', '/admin/post/soft-delete', 'DELETE')

export const getAdminPermissonList = createApiThunkPrivate('getAdminPermissonList', '/admin/sub-admin/permissions', 'GET')
export const getCompaniesPermissionList = createApiThunkPrivate('getCompaniesPermissionList', '/companies/sub-admin/permissions', 'GET')
export const getInstitutionsPermissionList = createApiThunkPrivate('getInstitutionsPermissionList', '/institutions/sub-admin/permissions', 'GET')
export const adminUpdatePermission = createApiThunkPrivate('adminUpdatePermission', '/admin/sub-admin/update-permission', 'POST')
export const companiesUpdatePermission = createApiThunkPrivate('companiesUpdatePermission', '/companies/sub-admin/update-permission', 'POST')
export const instituteUpdatePermission = createApiThunkPrivate('instituteUpdatePermission', '/institutions/sub-admin/update-permission', 'POST')



const courseSlice = createSlice({
    name: 'course',
    initialState,
    extraReducers: builder => {
        createExtraReducersForThunk(builder, getCourseCategory, 'getCourseCategoryData')
        createExtraReducersForThunk(builder, getCourseManagement, 'getCourseManagementData')
        createExtraReducersForThunk(builder, getSkills, 'getSkillsData')
        createExtraReducersForThunk(builder, subAdminList, 'getSubAdminListData')
        createExtraReducersForThunk(builder, companiesSubAdminList, 'getCompaniesSubAdminListData')
        createExtraReducersForThunk(builder, institutionsSubAdminList, 'getInstituteSubAdminListData')
        createExtraReducersForThunk(builder, getAllSkillsSuggestion, 'getAllSkillsSuggestionData')
        createExtraReducersForThunk(builder, getLevels, 'getLevelsData')
        createExtraReducersForThunk(builder, getUserList, 'getUserListData')
        createExtraReducersForThunk(builder, verificationCenterList, 'getVerificationCenterList')
        createExtraReducersForThunk(builder, assessmentsList, 'getAssessmentsListData')
        createExtraReducersForThunk(builder, cmsList, 'cmsListData')
        createExtraReducersForThunk(builder, cmsContentList, 'cmsContentListData')
        createExtraReducersForThunk(builder, promotionList, 'promotionListData')
        createExtraReducersForThunk(builder, getPosts, 'getPostsData')
    }
})

export default courseSlice.reducer