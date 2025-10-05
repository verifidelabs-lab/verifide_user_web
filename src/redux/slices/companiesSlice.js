import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPrivate } from '../../components/hooks/apiThunk';

// API Thunks
export const getCompaniesList = createApiThunkPrivate('getCompaniesList', '/user/companies/list', 'GET');
export const createCompany = createApiThunkPrivate('createCompany', '/user/companies/create', 'POST');
export const updateCompany = createApiThunkPrivate('updateCompany', '/user/companies/update', 'POST');
export const deleteCompany = createApiThunkPrivate('deleteCompany', '/user/companies/soft-delete', 'DELETE');
export const getCompanyDetails = createApiThunkPrivate('getCompanyDetails', '/user/companies/single-document', 'GET', 'true');
export const verifyCompany = createApiThunkPrivate('verifyCompany', '/user/companies/verify-company', 'POST');
export const updateCompanyPassword = createApiThunkPrivate('updateCompanyPassword', '/user/companies/update-password', 'POST');
export const companyAddOnsData = createApiThunkPrivate('companyAddOnsData', '/user/companies/add-ons-data', 'POST');

// Initial State
const initialState = {
    companiesList: {},
    companyDetails: {},
    companyAddOns: {},
    actionStatus: {}, // For create/update/delete/verify actions
};

// Slice
const companiesSlice = createSlice({
    name: 'companies',
    initialState,
    reducers: {
        // Local updates
        addCompanyToList: (state, action) => {
            if (state.companiesList?.data?.data?.list) {
                state.companiesList.data.data.list.unshift(action.payload);
            }
        },
        updateCompanyInList: (state, action) => {
            const updated = action.payload;
            if (state.companiesList?.data?.data?.list) {
                const index = state.companiesList.data.data.list.findIndex(c => c._id === updated._id);
                if (index !== -1) state.companiesList.data.data.list[index] = updated;
            }
        },
        removeCompanyFromList: (state, action) => {
            const id = action.payload;
            if (state.companiesList?.data?.data?.list) {
                state.companiesList.data.data.list = state.companiesList.data.data.list.filter(c => c._id !== id);
            }
        }
    },
    extraReducers: (builder) => {
        // List & Details
        createExtraReducersForThunk(builder, getCompaniesList, 'companiesList');
        createExtraReducersForThunk(builder, getCompanyDetails, 'companyDetails');

        // Create Company: also push to companiesList automatically
        builder.addCase(createCompany.fulfilled, (state, action) => {
            state.actionStatus = action.payload;
            const newCompany = action.payload?.data;
            if (newCompany && state.companiesList?.data?.data?.list) {
                state.companiesList.data.data.list.unshift(newCompany);
            }
        });

        // Other actions
        createExtraReducersForThunk(builder, updateCompany, 'actionStatus');
        createExtraReducersForThunk(builder, deleteCompany, 'actionStatus');
        createExtraReducersForThunk(builder, verifyCompany, 'actionStatus');
        createExtraReducersForThunk(builder, updateCompanyPassword, 'actionStatus');
        createExtraReducersForThunk(builder, companyAddOnsData, 'companyAddOns');
    }
});

export const { addCompanyToList, updateCompanyInList, removeCompanyFromList } = companiesSlice.actions;
export default companiesSlice.reducer;
