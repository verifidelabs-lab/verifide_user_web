import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPrivate } from '../../../src/components/hooks/apiThunk';

const initialState = {
    instituteCollegeListData: {}, getAllDegreeData: {}, getAllFieldsOfStudyData: {}, getAllSkillListData: {},
    getAllEducationListData: {}, getAllExperienceListData: {}
}


export const instituteCollegeList = createApiThunkPrivate('instituteCollegeList', '/user/educations/institutions-list', 'GET')
export const getAllDegree = createApiThunkPrivate('getAllDegree', '/user/educations/degrees-list', 'GET', true)
export const getAllFieldsOfStudy = createApiThunkPrivate('getAllFieldsOfStudy', '/user/educations/field-of-studies-list', 'GET', true)
export const getAllSkillList = createApiThunkPrivate('getAllSkillList', '/user/educations/skills-list', 'GET', true)


export const getAllEducationList = createApiThunkPrivate('getAllEducationList', '/user/educations/education-list', 'GET')
export const getAllExperienceList = createApiThunkPrivate('getAllExperienceList', '/user/work-experience/experience-list', 'GET')
export const getAllProjectList = createApiThunkPrivate('getAllProjectList', '/user/projects/projects-list', 'GET')
export const getAllCertificateList = createApiThunkPrivate('getAllCertificateList', '/user/certifications/certifications-list', 'GET')

export const certificateShareAsPost = createApiThunkPrivate('certificateShareAsPost', '/user/certifications/share-as-post', 'POST')




///delete apis
export const deleteProjectById = createApiThunkPrivate('deleteProjectById', '/user/projects/soft-delete', 'DELETE')
export const deleteCertificationsById = createApiThunkPrivate('deleteCertificationsById', '/user/certifications/soft-delete', 'DELETE')
export const deleteWorkById = createApiThunkPrivate('deleteWorkById', '/user/work-experience/soft-delete', 'DELETE')
export const deleteEducationsById = createApiThunkPrivate('deleteEducationsById', '/user/educations/soft-delete', 'DELETE')


/// update apis

export const updateCertificationsById = createApiThunkPrivate('updateCertificationsById', '/user/certifications/update-certification-details', 'POST')
export const updateProjectById = createApiThunkPrivate('updateProjectById', '/user/projects/update-project-details', 'POST')
export const updateExperienceById = createApiThunkPrivate('updateExperienceById', '/user/work-experience/update-work-experience-details', 'POST')
export const updateEducationById = createApiThunkPrivate('updateEducationById', '/user/educations/update-education-details', 'POST')










const educationSlice = createSlice({
    name: 'education',
    initialState,
    reducers: {
        clearSkillListData: (state) => {
            state.getAllSkillListData = {};
        },
        updateDataCompany: (state, action) => {
            if (state.instituteCollegeListData.data?.data) {
                state.instituteCollegeListData.data.data = [
                    action.payload,
                    ...state.instituteCollegeListData.data.data
                ];
            }
        },
        updateDegreeData: (state, action) => {
            if (state.getAllDegreeData.data?.data) {
                state.getAllDegreeData.data.data = [
                    action.payload,
                    ...state.getAllDegreeData.data.data
                ];
            }
        },
        updateFieldsOfStudyData: (state, action) => {
            if (state.getAllFieldsOfStudyData.data?.data) {
                state.getAllFieldsOfStudyData.data.data = [
                    action.payload,
                    ...state.getAllFieldsOfStudyData.data.data
                ];
            }
        },
        updateSkillsData: (state, action) => {
            if (state.getAllSkillListData.data?.data) {
                state.getAllSkillListData.data.data = [
                    action.payload,
                    ...state.getAllSkillListData.data.data
                ];
            }
        }

    },
    extraReducers: builder => {
        createExtraReducersForThunk(builder, instituteCollegeList, 'instituteCollegeListData')
        createExtraReducersForThunk(builder, getAllFieldsOfStudy, 'getAllFieldsOfStudyData')
        createExtraReducersForThunk(builder, getAllSkillList, 'getAllSkillListData')
        createExtraReducersForThunk(builder, getAllDegree, 'getAllDegreeData')
        createExtraReducersForThunk(builder, getAllEducationList, 'getAllEducationListData')
        createExtraReducersForThunk(builder, getAllExperienceList, 'getAllExperienceListData')
        createExtraReducersForThunk(builder, getAllProjectList, 'getAllProjectListData')
        createExtraReducersForThunk(builder, getAllCertificateList, 'getAllCertificateListData')








    }
})

export const { clearSkillListData, updateDataCompany, updateDegreeData, updateFieldsOfStudyData, updateSkillsData } = educationSlice.actions;


export default educationSlice.reducer