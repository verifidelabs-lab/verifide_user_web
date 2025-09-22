import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPrivate } from '../../../src/components/hooks/apiThunk';

const initialState = {
    userAssessmentListData: {},
    getAssessmentsListData: {},
}


export const userAssessmentList = createApiThunkPrivate('userAssessmentList', '/user/assessments/list', 'GET');
export const startAssessment = createApiThunkPrivate('startAssessment', '/user/assessments/start-assessment', 'post')
export const getAssessmentDataByToken = createApiThunkPrivate('startAssessment', '/user/assessments/get-by-token', 'post')
export const submitAnswer = createApiThunkPrivate('submitAnswer', '/user/assessments/submit-or-update-answer', 'post')
export const declareResult = createApiThunkPrivate('declareResult', '/user/assessments/declare-assessment-result', 'post')


export const assessmentsSingleDocList = createApiThunkPrivate('assessmentsSingleDocList', '/global-module/assessments/single-document', 'GET')
export const assessmentsALLDocList = createApiThunkPrivate('assessmentsALLDocList', '/global-module/assessments/all-documents', 'GET')
export const assessmentsList = createApiThunkPrivate('assessmentsList', '/global-module/assessments/list', 'GET')
export const assessmentsEnableDisable = createApiThunkPrivate('assessmentsEnableDisable', '/global-module/assessments/enable-disable', 'POST')
export const assessmentsDelete = createApiThunkPrivate('assessmentsDelete', '/global-module/assessments/soft-delete', 'POST')
export const assessmentsCreate = createApiThunkPrivate('assessmentsCreate', '/global-module/assessments/create', 'POST')
export const assessmentsUpdate = createApiThunkPrivate('assessmentsUpdate', '/global-module/assessments/update', 'POST')
export const getALLCoursesDocList = createApiThunkPrivate('getALLCoursesDocList', '/global-module/course/all-documents', 'GET')

const courseSlice = createSlice({
    name: 'course',
    initialState,
    extraReducers: builder => {
        createExtraReducersForThunk(builder, userAssessmentList, 'userAssessmentListData')
        createExtraReducersForThunk(builder, assessmentsList, 'getAssessmentsListData')

    }
})

export default courseSlice.reducer