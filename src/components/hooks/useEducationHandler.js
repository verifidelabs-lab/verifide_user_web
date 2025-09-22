// useEducationFormHandlers.js
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { getAllDegree, getAllFieldsOfStudy, getAllSkillList } from '../../redux/education/educationSlice';

import { getAllIndustry, getAllProfileRole, getAllWorkSkillList } from '../../redux/work/workSlice';

export const useEducationFormHandlers = (setFormData, setLoading, setError, setAddModalState, setIsCreatedByUser, setIsCreatedByUserForFields,
  setIsCreatedByUserForIndustry, setIsCreatedByUserFor,setIsCreateByUser
) => {
  const dispatch = useDispatch();

  const fetchDependentData = async (field, value, is_created_by_users) => {

    console.log("value-22222", field, is_created_by_users)



    switch (field) {
      case 'institution_id':
        setIsCreatedByUser(is_created_by_users);
        break;

      case 'degree_id':
        setIsCreatedByUserForFields(is_created_by_users);
        break;

      case 'company_id':
        setIsCreatedByUserForIndustry(is_created_by_users);
        setIsCreateByUser(is_created_by_users)
      
        break;

      case 'industries_id':
        setIsCreatedByUserFor(is_created_by_users);
        break;

      default:
        break;
    }


    setLoading(true);
    try {
      switch (field) {
        case 'institution_id':
          await dispatch(getAllDegree({ institution_id: value, created_by_users: is_created_by_users }));
          break;
        case 'degree_id':
          await dispatch(getAllFieldsOfStudy({ degree_id: value, created_by_users: is_created_by_users }));
          break;
        case 'field_of_studies':
          await dispatch(getAllSkillList({ study_id: value, created_by_users: is_created_by_users }));
          break;
        case 'company_id':
          await dispatch(getAllIndustry({ company_id: value, created_by_users: is_created_by_users }));
          break;
        case 'industries_id':
          await dispatch(getAllProfileRole({ industry_id: value, created_by_users: is_created_by_users }));
          break;
        case 'profile_role_id':
          await dispatch(getAllWorkSkillList({ profile_role_id: value, created_by_users: is_created_by_users }));
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error(`Failed to fetch ${field} data`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = async (field, selected) => {
    console.log(field,selected)
    const exists = Array.isArray(selected) ? selected?.find(e => e.value === 'ADD') : selected?.value === 'ADD';
    if (exists) {
      let modalType = '';
      switch (field) {
        case 'institution_id':
          modalType = 'company';
          break;
        case 'degree_id':
          modalType = 'degree';
          break;
        case 'field_of_studies':
          modalType = 'field';
          break;
        case 'skills_acquired':
          modalType = 'skill';
          break;
        case 'company_id':
          modalType = 'companies';
          break;
        case 'industries_id':
          modalType = 'industries';
          break;
        case 'profile_role_id':
          modalType = "profile-roles";
          break;
        default:
          break;
      }

      setAddModalState({
        isOpen: true,
        type: modalType,
        field: field
      });
      return;
    }


    try {
      const isArrayField = field === 'skills_acquired';
      const is_created_by_users = selected?.created_by_users
      const value = isArrayField
        ? Array.isArray(selected)
          ? selected.map(e => e?.value).filter(Boolean)
          : []
        : selected?.value || '';

      const clearFields = {
        institution_id: { degree_id: '', field_of_studies: '', skills_acquired: [] },
        degree_id: { field_of_studies: '', skills_acquired: [] },
        field_of_studies: { skills_acquired: [] }
      };

      setFormData(prev => ({
        ...prev,
        [field]: value,
        ...(clearFields[field] || {})
      }));

      // setError(prev => ({
      //   ...prev,
      //   [field]: ''
      // }));

      if (
        !isArrayField &&
        value &&
        ['institution_id', 'degree_id', 'field_of_studies', 'company_id', 'industries_id', 'profile_role_id'].includes(field)
      ) {
        await fetchDependentData(field, value, is_created_by_users);
      }
    } catch (error) {
      // console.error(`handleSelectChange error for ${field}:`, error);
      // setError(prev => ({
      //   ...prev,
      //   [field]: 'Invalid selection'
      // }));
      toast.error(`Error processing ${field} selection`);
    }
  };

  return { handleSelectChange, fetchDependentData };
};
