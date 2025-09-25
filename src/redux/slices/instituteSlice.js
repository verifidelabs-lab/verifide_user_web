import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPrivate } from '../../../src/components/hooks/apiThunk';

const initialState = {
    instituteTypeData: {}, getAllInstituteTypeData: {}
}
export const instituteCreate = createApiThunkPrivate('instituteCreate', '/admin/institution-type/create', 'POST')
export const instituteUpdate = createApiThunkPrivate('instituteUpdate', '/admin/institution-type/update', 'POST')
export const instituteType = createApiThunkPrivate('instituteType', '/admin/institution-type/list', 'GET')
export const instituteDelete = createApiThunkPrivate('instituteDelete', '/admin/institution-type/soft-delete', 'DELETE')
export const instituteEnableDisable = createApiThunkPrivate('instituteEnableDisable', '/admin/institution-type/enable-disable', 'POST')

export const getAllInstituteType = createApiThunkPrivate('instituteCreate', '/admin/institution-type/all-documents', 'GET')






const instituteSlice = createSlice({
    name: 'institute',
    initialState,
    extraReducers: builder => {
        createExtraReducersForThunk(builder, instituteType, 'instituteTypeData')
        createExtraReducersForThunk(builder, getAllInstituteType, 'getAllInstituteTypeData')

    }
})

export default instituteSlice.reducer