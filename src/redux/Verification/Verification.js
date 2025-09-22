import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPrivate } from '../../../src/components/hooks/apiThunk';

const initialState = {
    verificationTabCountData: {},
}


export const verificationTabCount = createApiThunkPrivate('verificationTabCount', '/user/verification-center/tab-counts', 'GET')
export const verificationCount = createApiThunkPrivate('verificationCount', '/user/verification-center/verifications-counts', 'post')
export const verificationCenterDocumentDetails = createApiThunkPrivate('verificationCenterDocumentDetails', '/user/verification-center/get-document-details', 'post')
export const verifyRequest = createApiThunkPrivate('verifyRequest', '/user/verification-center/create-verification-request', 'post')
export const assessmentsForSkills = createApiThunkPrivate('assessmentsForSkills', '/user/verification-center/assessments-for-skill-verification', 'post')
export const startAssessment = createApiThunkPrivate('startAssessment', '/user/verification-center/start-assessment-for-skill-verification', 'post')
export const submitAnswer = createApiThunkPrivate('submitAnswer', '/user/verification-center/submit-or-update-answer', 'post')
export const declareResult = createApiThunkPrivate('declareResult', '/user/verification-center/declare-assessment-result', 'post')
export const updateIdentityDocument = createApiThunkPrivate('updateIdentityDocument', '/user/verification-center/update-identity-document', 'post')
export const addIdentityDocument = createApiThunkPrivate('addIdentityDocument', '/user/verification-center/add-identity-document', 'post')


export const verificationByOtp = createApiThunkPrivate('verificationByOtp', '/user/verification-center/send-mobile-otp', 'post')

export const verifyMobByOtp = createApiThunkPrivate('verifyMobByOtp', '/user/verification-center/verify-mobile-otp', 'post')

export const verificationDashboardCount = createApiThunkPrivate('verificationDashboardCount', '/user/verification-center/dashboard', 'GET')






const verificationSlice = createSlice({
    name: 'verification',
    initialState,
    extraReducers: builder => {
        createExtraReducersForThunk(builder, verificationTabCount, 'verificationTabCountData')

    }
})

export default verificationSlice.reducer