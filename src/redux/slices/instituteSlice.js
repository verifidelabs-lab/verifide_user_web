import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPrivate } from '../../../src/components/hooks/apiThunk';

const initialState = {
    instituteTypeData: {}, getAllInstituteTypeData: {}, institutionsList: {},
    institutionDetails: {},
    institutionAddOns: {},
    actionStatus: {}, // For create/update/delete/verify actions
}
export const instituteCreate = createApiThunkPrivate('instituteCreate', '/admin/institution-type/create', 'POST')
export const instituteUpdate = createApiThunkPrivate('instituteUpdate', '/admin/institution-type/update', 'POST')
export const instituteType = createApiThunkPrivate('instituteType', '/admin/institution-type/list', 'GET')
export const instituteDelete = createApiThunkPrivate('instituteDelete', '/admin/institution-type/soft-delete', 'DELETE')
export const instituteEnableDisable = createApiThunkPrivate('instituteEnableDisable', '/admin/institution-type/enable-disable', 'POST')

export const getAllInstituteType = createApiThunkPrivate('instituteCreate', '/admin/institution-type/all-documents', 'GET')


// API Thunks for Institutions creation
export const getInstitutionsList = createApiThunkPrivate('getInstitutionsList', '/user/institutions/list', 'GET');
export const createInstitution = createApiThunkPrivate('createInstitution', '/user/institutions/create', 'POST');
export const updateInstitution = createApiThunkPrivate('updateInstitution', '/user/institutions/update', 'POST');
export const deleteInstitution = createApiThunkPrivate('deleteInstitution', '/user/institutions/soft-delete', 'DELETE');
export const getInstitutionDetails = createApiThunkPrivate('getInstitutionDetails', '/user/institutions/single-document', 'GET', 'true');
export const verifyInstitution = createApiThunkPrivate('verifyInstitution', '/user/institutions/verify-institution', 'POST');
export const updateInstitutionPassword = createApiThunkPrivate('updateInstitutionPassword', '/user/institutions/update-password', 'POST');
export const institutionAddOnsData = createApiThunkPrivate('institutionAddOnsData', '/user/institutions/add-ons-data', 'POST');




const instituteSlice = createSlice({
    name: 'institute',
    initialState,
    reducers: {
        // Local updates
        addInstitutionToList: (state, action) => {
            if (state.institutionsList?.data?.data?.list) {
                state.institutionsList.data.data.list.unshift(action.payload);
            }
        },
        updateInstitutionInList: (state, action) => {
            const updated = action.payload;
            if (state.institutionsList?.data?.data?.list) {
                const index = state.institutionsList.data.data.list.findIndex(i => i._id === updated._id);
                if (index !== -1) state.institutionsList.data.data.list[index] = updated;
            }
        },
        removeInstitutionFromList: (state, action) => {
            const id = action.payload;
            if (state.institutionsList?.data?.data?.list) {
                state.institutionsList.data.data.list = state.institutionsList.data.data.list.filter(i => i._id !== id);
            }
        }
    },

    extraReducers: builder => {
        createExtraReducersForThunk(builder, instituteType, 'instituteTypeData')
        createExtraReducersForThunk(builder, getAllInstituteType, 'getAllInstituteTypeData')
        // List & Details
        createExtraReducersForThunk(builder, getInstitutionsList, 'institutionsList');
        createExtraReducersForThunk(builder, getInstitutionDetails, 'institutionDetails');

        // Create Institution: also push to institutionsList automatically
        builder.addCase(createInstitution.fulfilled, (state, action) => {
            state.actionStatus = action.payload;
            const newInstitution = action.payload?.data;
            if (newInstitution && state.institutionsList?.data?.data?.list) {
                state.institutionsList.data.data.list.unshift(newInstitution);
            }
        });

        // Other actions
        createExtraReducersForThunk(builder, updateInstitution, 'actionStatus');
        createExtraReducersForThunk(builder, deleteInstitution, 'actionStatus');
        createExtraReducersForThunk(builder, verifyInstitution, 'actionStatus');
        createExtraReducersForThunk(builder, updateInstitutionPassword, 'actionStatus');
        createExtraReducersForThunk(builder, institutionAddOnsData, 'institutionAddOns');

    }
})

export default instituteSlice.reducer