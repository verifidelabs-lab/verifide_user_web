

import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPrivate } from '../../../src/components/hooks/apiThunk';

const initialState = {
    userCourseListData: {},
}


export const userCourseList = createApiThunkPrivate('userCourseList', '/user/course/list', 'GET')
export const addBookmarked = createApiThunkPrivate('addBookmarked', '/user/course/add-on-bookmarked', 'POST')
export const getCourseDetails = createApiThunkPrivate('getCourseDetails', '/user/course/get-course-details', 'POST')
export const addEnroll = createApiThunkPrivate('addEnroll', '/user/course/add-course-enroll', 'POST')
export const addCourseEnroll = createApiThunkPrivate('addCourseEnroll', '/user/course/assessments-for-course-verification', 'POST')
export const startAssessment = createApiThunkPrivate('startAssessment', '/user/course/start-assessment-for-course-verification', 'POST')
export const submitAndUpdateQuestion = createApiThunkPrivate('submitAndUpdateQuestion', '/user/course/submit-or-update-course-answer', 'POST')
export const declareResult = createApiThunkPrivate('declareResult', '/user/course/declare-course-assessment-result', 'POST')






const courseSlice = createSlice({
    name: 'course',
    initialState,
    extraReducers: builder => {
        createExtraReducersForThunk(builder, userCourseList, 'userCourseListData')

    }
})

export default courseSlice.reducer