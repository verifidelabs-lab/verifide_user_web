import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPrivate } from '../../../src/components/hooks/apiThunk';

const initialState = {
    getDegreeListData: {}, getFieldsOfStudyData: {}, getAllDegreeListData: {}, dashboardBarChartsData: {}, dashboardUserLineChartsData: {}, dashboardOrgLineChartsData: {},
    getAllModulePermissionData: {}, updateModulePermissionData:{}
}

export const getDegreeList = createApiThunkPrivate('getDegreeList', '/admin/degrees/list', 'GET')
export const degreeCreate = createApiThunkPrivate('degreeCreate', '/admin/degrees/create', 'POST')
export const degreeUpdate = createApiThunkPrivate('degreeUpdate', '/admin/degrees/update', 'POST')
export const degreeDelete = createApiThunkPrivate('degreeDelete', '/admin/degrees/soft-delete', 'DELETE')
export const degreeEnableDisable = createApiThunkPrivate('degreeEnableDisable', '/admin/degrees/enable-disable', 'POST')
export const degreeAddOnData = createApiThunkPrivate('degreeAddOnData', '/admin/degrees/add-ons-data', 'POST')
export const getAllDegreeList = createApiThunkPrivate('getAllDegreeList', '/admin/degrees/all-documents', 'GET')
export const getAllFieldsOfStudy = createApiThunkPrivate('getAllFieldsOfStudy', '/admin/fields-of-studies/all-documents', 'GET')
export const getFieldsOfStudy = createApiThunkPrivate('getFieldsOfStudy', '/admin/fields-of-studies/list', 'GET')
export const fieldsOfStudyCreate = createApiThunkPrivate('fieldsOfStudyCreate', '/admin/fields-of-studies/create', 'POST')
export const fieldsOfStudyUpdate = createApiThunkPrivate('fieldsOfStudyUpdate', '/admin/fields-of-studies/update', 'POST')
export const fieldsOfStudyDelete = createApiThunkPrivate('fieldsOfStudyDelete', '/admin/fields-of-studies/soft-delete', 'DELETE')
export const fieldsOfStudyEnableDisable = createApiThunkPrivate('fieldsOfStudyEnableDisable', '/admin/fields-of-studies/enable-disable', 'POST')
export const fieldsOfStudyAdsOnData = createApiThunkPrivate('fieldsOfStudyAdsOnData', '/admin/fields-of-studies/add-ons-data', 'POST')
export const dashboardCounts = createApiThunkPrivate('dashboardCounts', '/global-module/dashboard/counts', 'GET')
export const dashboardPieCharts = createApiThunkPrivate('dashboardPieCharts', '/global-module/dashboard/request-pie-charts', 'GET')
export const dashboardBarCharts = createApiThunkPrivate('dashboardBarCharts', '/global-module/dashboard/request-bar-charts', 'GET')
export const dashboardOrgLineCharts = createApiThunkPrivate('dashboardOrgLineCharts', '/global-module/dashboard/org-line-charts', 'GET') 
export const dashboardUserLineCharts = createApiThunkPrivate('dashboardUserLineCharts', '/global-module/dashboard/user-line-charts', 'GET')

export const getAllModulePermission = createApiThunkPrivate('getAllModulePermission', '/admin-users/getAllModulePermission', 'GET')
export const updateModulePermission = createApiThunkPrivate('updateModulePermission', '/admin-users/updateModulePermission', 'PUT')


const degreeSlice = createSlice({
    name: 'degree',
    initialState,
    extraReducers: builder => {
        createExtraReducersForThunk(builder, getDegreeList, 'getDegreeListData')
        createExtraReducersForThunk(builder, getAllFieldsOfStudy, 'getAllFieldsOfStudyData')
        createExtraReducersForThunk(builder, getFieldsOfStudy, 'getFieldsOfStudyData')
        createExtraReducersForThunk(builder, getAllDegreeList, 'getAllDegreeListData')
        createExtraReducersForThunk(builder, dashboardCounts, 'dashboardCountsData')
        createExtraReducersForThunk(builder, dashboardPieCharts, 'dashboardPieChartsData')
        createExtraReducersForThunk(builder, dashboardBarCharts, 'dashboardBarChartsData')
        createExtraReducersForThunk(builder, dashboardUserLineCharts, 'dashboardUserLineChartsData')
        createExtraReducersForThunk(builder, dashboardOrgLineCharts, 'dashboardOrgLineChartsData')
        createExtraReducersForThunk(builder, getAllModulePermission, 'getAllModulePermissionData')
        createExtraReducersForThunk(builder, updateModulePermission, 'updateModulePermissionData')
    }
})

export default degreeSlice.reducer