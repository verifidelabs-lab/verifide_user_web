import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk,createApiThunkPrivate } from '../../../src/components/hooks/apiThunk';

const initialState = {
    getCompaniesListData: {},getCompaniesDetailsData:{}
}

export const getCompaniesList = createApiThunkPrivate('getCompaniesList', '/admin/companies/list', 'GET')
export const createCompanies = createApiThunkPrivate('createCompanies', '/admin/companies/create', 'POST')
export const updateCompanies = createApiThunkPrivate('updateCompanies', '/admin/companies/update', 'POST')
export const deleteCompanies = createApiThunkPrivate('deleteCompanies', '/admin/companies/soft-delete', 'DELETE')
export const getCompaniesDetails = createApiThunkPrivate('getCompaniesDetails', '/admin/companies/single-document', 'GET','true')
export const verifyCompanies = createApiThunkPrivate('verifyCompanies', '/admin/companies/verify-company', 'POST',)



const companiesSlice = createSlice({
    name: 'companies',
    initialState,
    extraReducers: builder => {
        createExtraReducersForThunk(builder, getCompaniesList, 'getCompaniesListData')
        createExtraReducersForThunk(builder, getCompaniesDetails, 'getCompaniesDetailsData')


    }
})

export default companiesSlice.reducer