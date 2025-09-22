import { createSlice } from '@reduxjs/toolkit';
import { createExtraReducersForThunk, createApiThunkPrivate } from '../../../src/components/hooks/apiThunk';

const initialState = {
    getAllCompaniesData: {}, getAllIndustryData: {}, getAllProfileRoleData: {}, getAllWorkSkillListData: {}
}


export const getAllCompanies = createApiThunkPrivate('getAllCompanies', '/user/work-experience/companies-list', 'GET')
export const getAllIndustry = createApiThunkPrivate('getAllIndustry', '/user/work-experience/industry-list', 'GET', true)
export const getAllProfileRole = createApiThunkPrivate('getAllProfileRole', '/user/work-experience/profile-roles-list', 'GET', true)
export const getAllWorkSkillList = createApiThunkPrivate('getAllWorkSkillList', '/user/work-experience/skills-list', 'GET', true)


const workSlice = createSlice({
    name: 'work',
    initialState,
    reducers: {
        clearWorkSkillListData: (state) => {
            state.getAllWorkSkillListData = {};
        },

        updateCompanyData: (state, action) => {
            if (state.getAllCompaniesData.data?.data) {
                state.getAllCompaniesData.data.data = [
                    action.payload,
                    ...state.getAllCompaniesData.data.data
                ];
            }
        },
        updateIndustryData: (state, action) => {
            if (state.getAllIndustryData.data?.data) {
                state.getAllIndustryData.data.data = [
                    action.payload,
                    ...state.getAllIndustryData.data.data
                ];
            }
        },

        updateProfileRoleData: (state, action) => {
            if (state.getAllProfileRoleData.data?.data) {
                state.getAllProfileRoleData.data.data = [
                    action.payload,
                    ...state.getAllProfileRoleData.data.data
                ];
            }
        },
        updateWorkSkillData: (state, action) => {
            if (state.getAllWorkSkillListData.data?.data) {
                state.getAllWorkSkillListData.data.data = [
                    action.payload,
                    ...state.getAllWorkSkillListData.data.data
                ];
            }
        }

    },
    extraReducers: builder => {
        createExtraReducersForThunk(builder, getAllCompanies, 'getAllCompaniesData')
        createExtraReducersForThunk(builder, getAllIndustry, 'getAllIndustryData')
        createExtraReducersForThunk(builder, getAllWorkSkillList, 'getAllWorkSkillListData')
        createExtraReducersForThunk(builder, getAllProfileRole, 'getAllProfileRoleData')




    }
})

export const { clearWorkSkillListData, updateCompanyData, updateIndustryData, updateProfileRoleData,updateWorkSkillData } = workSlice.actions;


export default workSlice.reducer