// redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { persistStore, persistReducer } from 'redux-persist';

import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import educationReducer from './education/educationSlice'
import workReducer from './work/workSlice'
import cscReducer from './Global Slice/cscSlice'
import verificationReducer from './Verification/Verification'
import userReducer from './Users/userSlice'
import courseReducer from './course/courseSlice'
import companyCourseReducer from './CompanySlices/courseSlice'
import companiesReducer from './CompanySlices/companiesSlice'
import userCompaniesReducer from './slices/companiesSlice'
// import instituteReducer from './slices/instituteSlice'
import industryReducer from './Industry Slice/industrySlice'
import assessmentReducer from './assessments/assessmentSlice'
import companyAuth from './CompanySlices/CompanyAuth'
const rootReducer = combineReducers({
  auth: authReducer,
  companies: companiesReducer,
  userCompanies: userCompaniesReducer,
  companyAuth: companyAuth,
  // institute: instituteReducer,
  industry: industryReducer,
  educations: educationReducer,
  work: workReducer,
  global: cscReducer,
  verification: verificationReducer,
  user: userReducer,
  course: courseReducer,
  companyCourse: companyCourseReducer,
  assessments: assessmentReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
