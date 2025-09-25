import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPrivate } from '../../../src/components/hooks/apiThunk';

const initialState = {
    industriesDocumentsData: {}, industriesData: {}, badgeData: {}
}

export const industriesDocuments = createApiThunkPrivate('industriesDocuments', '/admin/industries/all-documents', 'GET')
export const industriesCreate = createApiThunkPrivate('industriesCreate', '/admin/industries/create', 'POST')
export const industriesUpdate = createApiThunkPrivate('industriesUpdate', '/admin/industries/update', 'POST')
export const industries = createApiThunkPrivate('industries', '/admin/industries/list', 'GET')
export const industriesDelete = createApiThunkPrivate('industriesDelete', '/admin/industries/soft-delete', 'DELETE')
export const industriesEnableDisable = createApiThunkPrivate('industriesEnableDisable', '/admin/industries/enable-disable', 'POST')


export const badgeCreate = createApiThunkPrivate('badgeCreate', '/admin/badges/create', 'POST')
export const badgeUpdate = createApiThunkPrivate('badgeUpdate', '/admin/badges/update', 'POST')
export const badge = createApiThunkPrivate('badge', '/admin/badges/list', 'GET')
export const badgeDelete = createApiThunkPrivate('badgeDelete', '/admin/badges/soft-delete', 'DELETE')
export const badgeEnableDisable = createApiThunkPrivate('badgeEnableDisable', '/admin/badges/enable-disable', 'POST')



const industrySlice = createSlice({
    name: 'industry',
    initialState,
    extraReducers: builder => {
        createExtraReducersForThunk(builder, industriesDocuments, 'industriesDocumentsData')
        createExtraReducersForThunk(builder, industries, 'industriesData')
        createExtraReducersForThunk(builder, badge, 'badgeData')


    }
})

export default industrySlice.reducer