import React, { useEffect, useState, useCallback } from "react";
import { BiArrowBack, BiX } from "react-icons/bi";
import CustomInput from "../../../components/ui/Input/CustomInput";
import {
  getAllCompanies,
  getAllIndustry,
  getAllProfileRole,
  getAllWorkSkillList,
  updateCompanyData,
  updateIndustryData,
  updateProfileRoleData,
} from "../../../redux/work/workSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  arrayTransform,
  arrayTransform2,
  convertToTimestamp,
} from "../../../components/utils/globalFunction";
import {
  cities,
  countries,
  jobsCreate,
  jobsSingleDocument,
  jobsUpdate,
  state,
  updateMasterIndustryData,
  updateMasterSkillData,
} from "../../../redux/Global Slice/cscSlice";
import { toast } from "sonner";
import Button from "../../../components/ui/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from "../../../components/utils/cookieHandler";
import Modal from "../../../components/ui/Modal/Modal";
import {
  getAllDegree,
  getAllFieldsOfStudy,
  getAllSkillList,
  updateDegreeData,
  updateFieldsOfStudyData,
  updateSkillsData,
} from "../../../redux/education/educationSlice";
import { addOneData } from "../../../redux/Users/userSlice";
import { useLocationFormHandlers } from "../../../components/hooks/useLocationFormHandlers";
import StepFirst from "./Components/StepFirst";
import StepSecond from "./Components/StepSecond";
import { companiesProfile } from "../../../redux/CompanySlices/CompanyAuth";
import CustomFileInput from "../../../components/ui/Input/CustomFileInput";
// import moment from 'moment-timezone';

const PostJob = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const companiesProfileData = useSelector(
    (state) => state.companyAuth?.companiesProfileData?.data?.data || {}
  );
  console.log("this is te company prifie data", companiesProfileData);
  console.log("This is the company");
  const workSelector = useSelector((state) => state.work);
  const industrySelector = useSelector((state) => state.global);
  const countriesSelector = useSelector((state) => state.global);
  const allCompanies = arrayTransform2(
    workSelector?.getAllCompaniesData?.data?.data || []
  );
  const allIndustry = arrayTransform(
    workSelector?.getAllIndustryData?.data?.data || []
  );
  const allSkills = arrayTransform(
    industrySelector?.masterSkillsData?.data?.data?.list || []
  );
  const allProfileRoles = arrayTransform(
    workSelector?.getAllProfileRoleData?.data?.data || []
  );
  console.log("this is the prifiles roles", allProfileRoles);
  const countryList = arrayTransform(
    countriesSelector?.countriesData?.data?.data || []
  );
  const stateList = arrayTransform(
    countriesSelector?.stateData?.data?.data || []
  );
  const citiesList = arrayTransform(
    countriesSelector?.citiesData?.data?.data || []
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [accessMode, setAccessMode] = useState(getCookie("ACCESS_MODE"));
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [screeningQuestions, setScreeningQuestions] = useState([
    {
      question: "",
      question_type: "single_choice",
      options: [],
      option_format: "alphabetically",
      correct_options: [],
      verification_type: "auto",
      time_limit: 2,
    },
  ]);
  const [errors, setErrors] = useState({});
  const [inputFields, setInputFields] = useState({
    name: "",
    logo_url: "",
  });
  const [addModalState, setAddModalState] = useState({
    isOpen: false,
    type: "",
    field: "",
  });
  const [formData, setFormData] = useState({
    company_id: companiesProfileData._id || "",
    industry_id: "",
    job_type: "",
    job_location: "",
    pay_type: "",
    salary_range: "",
    job_title: "",
    job_description: "",
    start_date: "",
    end_date: "",
    current_openings: "",
    required_skills: [],
    address: {
      country: {
        name: "",
        dial_code: "",
        short_name: "",
        emoji: "🇮",
      },
      state: {
        name: "",
        code: "",
      },
      city: {
        name: "",
      },
      pin_code: "",
    },
    screening_questions: screeningQuestions || [],
    isDisable: false,
    isShareAsPost: false,
  });
  useEffect(() => {
    setFormData({
      ...formData,
      company_id: companiesProfileData?._id,
    });
  }, [companiesProfileData?._id]);
  const [isCreatableIndustry, setIsCreatbleIndustry] = useState(true);

  const { handleLocationSelectChange } = useLocationFormHandlers(
    setFormData,
    formData,
    setErrors
  );

  // Handle access mode changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newAccessMode = getCookie("ACCESS_MODE");
      const activeMode = getCookie("ACTIVE_MODE");
      setAccessMode(newAccessMode);
      if (newAccessMode === 5) {
        navigate(`/user/opportunitiess`);
      }
      // if(activeMode === "company"){
      //     navigate("/company/opportunities")
      // }
    };

    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);
  const getSelectedOption = useCallback((options, value) => {
    if (!value) return null;
    const id = value._id ? value._id : value;
    return options.find((option) => option.value === id) || null;
  }, []);
  // Fetch initial data
  useEffect(() => {
    dispatch(getAllCompanies());
    dispatch(countries());
    dispatch(companiesProfile());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getAllIndustry({
        company_id: companiesProfileData?._id,
        created_by_users: companiesProfileData?.created_by_users,
      })
    );
  }, [dispatch, companiesProfileData?._id]);
  // Populate selected skills from skill IDs
  const populateSelectedSkills = useCallback(
    (skillIds) => {
      if (allSkills.length > 0 && skillIds.length > 0) {
        const matchedSkills = allSkills.filter((skill) =>
          skillIds.includes(skill.value)
        );
        setSelectedSkills(matchedSkills);
      }
    },
    [allSkills]
  );

  const country_id = formData?.address?.country?.short_name;
  const city_code = formData?.address?.state?.name;

  const fetchJobData = useCallback(async () => {
    try {
      const res = await dispatch(
        jobsSingleDocument({
          _id: id || companiesProfileData._id,
          populate: "company_id:created_by_users|industry_id:created_by_users",
        })
      ).unwrap();
      const jobData = res?.data;

      const addressData = jobData.work_location ||
        jobData.address || {
        country: { name: "", dial_code: "", short_name: "", emoji: "🇮" },
        state: { name: "", code: "" },
        city: { name: "" },
        pin_code: "",
      };

      setFormData({
        ...jobData,
        address: addressData,
        company_id: res?.data?.company_id?._id,
        industry_id: res?.data?.industry_id?._id,
        start_date: res?.data?.start_date
          ? new Date(res.data.start_date).toISOString().split("T")[0]
          : "",
        end_date: res?.data?.end_date
          ? new Date(res.data.end_date).toISOString().split("T")[0]
          : "",
      });

      if (res?.data?.company_id) {
        dispatch(
          getAllIndustry({
            company_id: res?.data?.company_id?._id,
            created_by_users: true,
          })
        );
        // setIsCreatbleIndustry(res?.data?.company_id?.created_by_users);
      }

      if (res?.data?.industry_id) {
        dispatch(
          getAllProfileRole({
            industry_id: res?.data?.industry_id?._id,
            created_by_users: res?.data?.industry_id?.created_by_users,
          })
        );
      }

      if (
        jobData.screening_questions &&
        jobData.screening_questions.length > 0
      ) {
        setScreeningQuestions(jobData.screening_questions);
      }

      if (jobData.required_skills && jobData.required_skills.length > 0) {
        populateSelectedSkills(jobData.required_skills);
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
      toast.error(error?.message || "Failed to fetch job data");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, companiesProfileData, dispatch]);

  useEffect(() => {
    if (country_id) {
      dispatch(state({ country_code: country_id }));
    }
    if (city_code) {
      dispatch(cities({ state_name: city_code }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, country_id, city_code]);

  // Fetch job data when component mounts with an ID
  useEffect(() => {
    if (id) {
      fetchJobData();
    }
  }, [id, fetchJobData]);
  useEffect(() => {
    if (
      id &&
      allSkills.length > 0 &&
      formData.required_skills.length > 0 &&
      selectedSkills.length === 0
    ) {
      populateSelectedSkills(formData.required_skills);
    }
  }, [
    allSkills,
    formData.required_skills,
    id,
    populateSelectedSkills,
    selectedSkills.length,
  ]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.company_id) newErrors.company_id = "Company is required";
      if (!formData.industry_id) newErrors.industry_id = "Industry is required";
      if (!formData.job_type) newErrors.job_type = "Job type is required";
      if (!formData.job_location)
        newErrors.job_location = "Job location is required";
      if (!formData.pay_type) newErrors.pay_type = "Pay type is required";
      if (
        !formData.salary_range &&
        !(formData.job_type === "internship" || formData.pay_type === "unpaid")
      ) {
        newErrors.salary_range = "Salary range is required";
      }

      if (!formData.start_date) newErrors.start_date = "Start date is required";
      if (!formData.end_date) newErrors.end_date = "End date is required";
      if (!formData.current_openings)
        newErrors.current_openings = "current opening is required";

      if (!formData.address?.country?.name)
        newErrors.country = "Country is required";
      if (!formData.address?.state?.name) newErrors.state = "State is required";
      if (!formData.address?.city?.name) newErrors.city = "City is required";
      if (!formData.address?.pin_code)
        newErrors.pin_code = "Pin No is required";
    }

    if (step === 2) {
      if (!formData.job_title) newErrors.job_title = "Job title is required";
      if (!formData.job_description)
        newErrors.job_description = "Job description is required";
      if (formData.job_description && formData.job_description.length < 50) {
        newErrors.job_description =
          "Description should be at least 50 characters";
      }
      if (formData.required_skills.length === 0) {
        newErrors.required_skills = "At least one skill is required";
      }
    }

    if (step === 3) {
      if (screeningQuestions.length === 0) {
        newErrors.screening_questions =
          "At least one screening question is required";
      } else {
        screeningQuestions.forEach((q, qIndex) => {
          if (!q.question || q.question.trim() === "") {
            newErrors[`screening_question_${qIndex}`] = "Question is required";
          } else if (q.question.trim().length < 10) {
            newErrors[`screening_question_${qIndex}`] =
              "Question must be at least 10 characters long";
          }
          // For theoretical questions, no additional validation needed beyond the question text
          if (q.question_type === "theoretical") {
            return;
          }

          if (q.options.length < 2) {
            newErrors[`screening_options_${qIndex}`] =
              "At least two options are required";
          }

          q.options.forEach((option, oIndex) => {
            if (!option || option.trim() === "") {
              newErrors[`screening_option_${qIndex}_${oIndex}`] =
                "Option cannot be empty";
            }
          });

          if (q.correct_options.length === 0) {
            newErrors[`screening_correct_${qIndex}`] =
              "At least one correct option is required";
          }
        });
      }
    }
    console.log("this s the new error s", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [field]: value || "",
      };

      let newErrors = { ...errors };

      // 🔁 Auto-clear end_date if it's before the new start_date
      if (field === "start_date" && prev.end_date) {
        const newStart = new Date(value);
        const oldEnd = new Date(prev.end_date);

        if (oldEnd < newStart) {
          updatedFormData.end_date = ""; // Clear invalid end_date
          newErrors.end_date =
            "End date cleared because it was before Start date";
        }
      }

      // ✅ Validation: Ensure end_date is not before start_date
      if (updatedFormData.start_date && updatedFormData.end_date) {
        const start = new Date(updatedFormData.start_date);
        const end = new Date(updatedFormData.end_date);

        if (end < start) {
          newErrors.end_date = "End date cannot be before Start date";
        } else {
          delete newErrors.start_date;
          delete newErrors.end_date;
        }
      }

      setErrors(newErrors);
      return updatedFormData;
    });

    // Clear individual field error if user fixed it
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  const handleAddItem = async () => {
    try {
      let type = "";
      let updateAction = null;
      let selectField = addModalState.field;
      switch (addModalState.type) {
        case "industries":
          type = "industries";
          updateAction = updateIndustryData;
          break;
        case "profile-roles":
          type = "profile-roles";
          updateAction = updateProfileRoleData;
          break;
        case "skill":
          type = "skills";
          updateAction = updateMasterSkillData;
          break;
        default:
          return;
      }

      setLoading(true);
      const res = await dispatch(addOneData({ type, ...inputFields })).unwrap();
      setLoading(false);

      const newItem = {
        _id: res.data._id,
        name: res.data.name,
        created_by_users: res.data.created_by_users,
      };

      // ✅ 1. Update Redux (adds item to dropdown)
      dispatch(updateAction(newItem));
      console.log(
        "This is the add formdata int the market place ",
        selectField,
        type,
        updateAction
      );

      // ✅ 2. Update local form + selection instantly (even if Redux was empty)
      if (selectField === "required_skills") {
        const newSkillOption = {
          value: newItem._id,
          label: newItem.name,
          created_by_users: newItem.created_by_users,
        };

        setFormData((prev) => ({
          ...prev,
          required_skills: [...(prev.required_skills || []), newItem._id],
        }));

        setSelectedSkills((prev) => [...(prev || []), newSkillOption]);
      } else {
        setFormData((prev) => ({
          ...prev,
          [selectField]: newItem._id,
        }));
      }

      // ✅ 3. Close modal and reset
      setAddModalState({ isOpen: false, type: "", field: "" });
      setInputFields({ name: "", logo_url: "" });
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = async (field, selectedOption) => {
    const value = selectedOption?.value || ""; // ✅ use empty string if null
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    console.log("field, selectedOption", field, selectedOption);
    if (field === "company_id") {
      setIsCreatbleIndustry(true);
    }

    switch (field) {
      case "institution_id":
        await dispatch(
          getAllDegree({
            institution_id: value,
            created_by_users: selectedOption?.created_by_users,
          })
        );
        break;
      case "degree_id":
        await dispatch(
          getAllFieldsOfStudy({
            degree_id: value,
            created_by_users: selectedOption?.created_by_users,
          })
        );
        break;
      case "field_of_studies":
        await dispatch(
          getAllSkillList({
            study_id: value,
            created_by_users: selectedOption?.created_by_users,
          })
        );
        break;
      case "company_id":
        await dispatch(
          getAllIndustry({
            company_id: value,
            created_by_users: selectedOption?.created_by_users,
          })
        );
        break;
      case "industry_id":
        await dispatch(
          getAllProfileRole({
            industry_id: value,
            created_by_users: selectedOption?.created_by_users,
          })
        );
        break;
      case "profile_role_id":
        await dispatch(
          getAllWorkSkillList({
            profile_role_id: value,
            created_by_users: selectedOption?.created_by_users,
          })
        );
        break;
      default:
        break;
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSkillSelect = (selectedOption) => {
    if (
      selectedOption &&
      !formData.required_skills.includes(selectedOption.value)
    ) {
      setFormData((prev) => ({
        ...prev,
        required_skills: [...prev.required_skills, selectedOption.value],
      }));
      setSelectedSkills((prev) => [...prev, selectedOption]);

      if (errors.required_skills) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.required_skills;
          return newErrors;
        });
      }
    }
  };

  const removeSkill = (skillId) => {
    setFormData((prev) => ({
      ...prev,
      required_skills: prev.required_skills.filter((id) => id !== skillId),
    }));
    setSelectedSkills((prev) =>
      prev.filter((skill) => skill.value !== skillId)
    );
  };

  const handleScreeningQuestionChange = (index, field, value) => {
    const updatedQuestions = [...screeningQuestions];

    // Update question type logic
    if (field === "question_type") {
      updatedQuestions[index][field] = value;

      // Reset options & correct_options if switching to theoretical
      if (value === "theoretical") {
        updatedQuestions[index].options = [];
        updatedQuestions[index].correct_options = [];
      } else {
        // Ensure these keys exist for single/multi choice
        if (!updatedQuestions[index].options)
          updatedQuestions[index].options = [];
        if (!updatedQuestions[index].correct_options)
          updatedQuestions[index].correct_options = [];
      }
    } else if (field === "options") {
      // Update options and remove any correct_options not in options
      updatedQuestions[index].options = value;
      updatedQuestions[index].correct_options = updatedQuestions[
        index
      ].correct_options.filter((opt) => value.includes(opt));
    } else {
      updatedQuestions[index][field] = value;
    }

    setScreeningQuestions(updatedQuestions);

    // Clear errors if any
    if (field === "question" && errors[`screening_question_${index}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`screening_question_${index}`];
        return newErrors;
      });
    }
  };

  const addScreeningQuestion = () => {
    setScreeningQuestions([
      ...screeningQuestions,
      {
        question: "",
        question_type: "single_choice",
        options: [],
        correct_options: [],
        option_format: "alphabetically",
        verification_type: "auto",
        time_limit: 2,
      },
    ]);
  };

  const removeScreeningQuestion = (index) => {
    const updatedQuestions = [...screeningQuestions];
    updatedQuestions.splice(index, 1);
    setScreeningQuestions(updatedQuestions);

    const newErrors = { ...errors };
    Object.keys(newErrors).forEach((key) => {
      if (
        key.startsWith(`screening_question_${index}`) ||
        key.startsWith(`screening_options_${index}`) ||
        key.startsWith(`screening_correct_${index}`) ||
        key.startsWith(`screening_option_${index}_`)
      )
        delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...screeningQuestions];
    updatedQuestions[questionIndex].options.push("");
    setScreeningQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...screeningQuestions];
    const removedOption = updatedQuestions[questionIndex].options.splice(
      optionIndex,
      1
    )[0];

    // Remove from correct_options if it exists
    updatedQuestions[questionIndex].correct_options = updatedQuestions[
      questionIndex
    ].correct_options.filter((opt) => opt !== removedOption);

    setScreeningQuestions(updatedQuestions);

    // Clear error for this option
    const optionErrorKey = `screening_option_${questionIndex}_${optionIndex}`;
    if (errors[optionErrorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[optionErrorKey];
        return newErrors;
      });
    }
  };

  const toggleCorrectOption = (questionIndex, optionValue) => {
    const updatedQuestions = [...screeningQuestions];
    const question = updatedQuestions[questionIndex];

    if (question.question_type === "single_choice") {
      question.correct_options = [optionValue];
    } else if (question.question_type === "multi_choice") {
      if (question.correct_options.includes(optionValue)) {
        question.correct_options = question.correct_options.filter(
          (opt) => opt !== optionValue
        );
      } else {
        question.correct_options.push(optionValue);
      }
    }

    setScreeningQuestions(updatedQuestions);

    // Clear error if exists
    const correctErrorKey = `screening_correct_${questionIndex}`;
    if (errors[correctErrorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[correctErrorKey];
        return newErrors;
      });
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) setCurrentStep(currentStep + 1);
    } else {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const element = document.querySelector(
          `[data-error="${firstErrorKey}"]`
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getNestedValue = (obj, path, fallback = "") => {
    const keys = path.split(".");
    let value = obj;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return fallback;
    }
    return value || fallback;
  };
  const formatScreeningQuestionsForSubmit = (questions) => {
    return questions.map((q) => {
      const base = {
        question: q.question,
        question_type: q.question_type,
        verification_type: q.verification_type,
        time_limit: q.time_limit,
        option_format: q.option_format || "alphabetically", // ✅ always present
      };

      if (["single_choice", "multi_choice"].includes(q.question_type)) {
        return {
          ...base,
          options: q.options,
          correct_options: q.correct_options,
        };
      }

      // For theoretical, only send base keys
      return base;
    });
  };

  const handleSubmit = async () => {
    console.log("this is te error", errors);
    const isValid = validateStep(3);

    // 🚫 Stop if validation failed
    if (!isValid) {
      // Wait a tiny bit for setErrors to apply before accessing them
      setTimeout(() => {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
          const element = document.querySelector(`[data-error="${firstErrorKey}"]`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, 100);
      return;
    }

    setIsSubmitting(true);

    const finalData = {
      company_id: formData?.company_id || "",
      industry_id: formData?.industry_id || "",
      job_type: formData?.job_type || "",
      job_location: formData?.job_location || "",
      pay_type: formData?.pay_type || "",
      salary_range: formData?.salary_range || "",
      job_title: formData?.job_title || "",
      job_description: formData?.job_description || "",
      required_skills: formData?.required_skills || [],
      work_location: formData?.address || "",
      isDisable: false,
      screening_questions:
        formatScreeningQuestionsForSubmit(screeningQuestions),
      start_date: convertToTimestamp(formData?.start_date) || "",
      end_date: convertToTimestamp(formData?.end_date) || "",
      isShareAsPost: formData?.isShareAsPost,
      current_openings: formData?.current_openings,
    };

    if (id) {
      finalData._id = id;
    }

    const action = id ? jobsUpdate : jobsCreate;

    try {
      const activeMode = getCookie("ACTIVE_MODE") === "company";
      const res = await dispatch(action(finalData)).unwrap();
      toast.success(
        res?.message ||
        res?.success ||
        (id ? "Job updated successfully!" : "Job posted successfully!")
      );

      // Reset form and navigate
      setCurrentStep(1);
      if (activeMode) {
        navigate("/company/opportunities");
      } else {
        navigate(`/user/opportunitiess`);
      }

      setFormData({
        company_id: "",
        industry_id: "",
        job_type: "",
        job_location: "",
        pay_type: "",
        salary_range: "",
        job_title: "",
        job_description: "",
        required_skills: [],
        address: {
          country: { name: "", dial_code: "", short_name: "", emoji: "🇮" },
          state: { name: "", code: "" },
          city: { name: "" },
          pin_code: "",
        },
        screening_questions: [],
        isDisable: false,
        start_date: "",
        end_date: "",
      });

      setSelectedSkills([]);
      setScreeningQuestions([
        {
          question: "",
          question_type: "single_choice",
          options: [],
          option_format: "alphabetically",
          correct_options: [],
          verification_type: "auto",
          time_limit: 2,
        },
      ]);
      setErrors({});
    } catch (error) {
      console.error("Error submitting job:", error);
      toast.error(
        error?.message ||
        (id
          ? "Failed to update job. Please try again."
          : "Failed to post job. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-3">
      <StepFirst
        allCompanies={allCompanies}
        allIndustry={allIndustry}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        errors={errors}
        setAddModalState={setAddModalState}
        countryList={countryList}
        handleLocationSelectChange={handleLocationSelectChange}
        getNestedValue={getNestedValue}
        stateList={stateList}
        citiesList={citiesList}
        setInputField={setInputFields}
        isCreatableIndustry={isCreatableIndustry}
        getSelectedOption={getSelectedOption}
      />
    </div>
  );

  const renderStep2 = () => (
    <StepSecond
      handleSelectChange={handleSelectChange}
      allProfileRoles={allProfileRoles}
      allSkills={allSkills}
      formData={formData}
      errors={errors}
      setAddModalState={setAddModalState}
      handleInputChange={handleInputChange}
      selectedSkills={selectedSkills}
      removeSkill={removeSkill}
      handleSkillSelect={handleSkillSelect}
      setInputField={setInputFields}
      isCreatableIndustry={isCreatableIndustry}
      getSelectedOption={getSelectedOption}
    />
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Screening Questions <span className="text-red-500">*</span>
        </label>
        <p className="text-sm glassy-text-secondary mb-4">
          Add screening questions to filter candidates. All questions are
          required.
        </p>

        {errors.screening_questions && (
          <p className="text-sm text-red-500 mb-4 bg-red-50 p-2 rounded-md">
            {errors.screening_questions}
          </p>
        )}

        {screeningQuestions.map((question, qIndex) => {
          const questionError = errors[`screening_question_${qIndex}`];
          const optionsError = errors[`screening_options_${qIndex}`];
          const correctError = errors[`screening_correct_${qIndex}`];

          return (
            <div
              key={qIndex}
              className={`mb-6 p-4 border rounded-lg ${questionError || optionsError || correctError
                ? "border-red-300 bg-red-50"
                : "border-gray-200"
                }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">
                  Question {qIndex + 1} <span className="text-red-500">*</span>
                </h3>
                <button
                  onClick={() => removeScreeningQuestion(qIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <BiX className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-3">
                <CustomInput
                  key={qIndex}
                  value={question.question}
                  onChange={(e) =>
                    handleScreeningQuestionChange(
                      qIndex,
                      "question",
                      e.target.value
                    )
                  }
                  placeholder="Enter your question"
                  className="w-full h-10"
                  error={questionError}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type
                </label>
                <select
                  value={question.question_type}
                  onChange={(e) =>
                    handleScreeningQuestionChange(
                      qIndex,
                      "question_type",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="single_choice">Single Choice</option>
                  <option value="multi_choice">Multiple Choice</option>
                  <option value="theoretical">Theoretical</option>
                </select>
              </div>

              {question.question_type === "theoretical" ? (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Answer (Optional)
                  </label>
                  <textarea
                    value={question.expected_answer || ""}
                    onChange={(e) =>
                      handleScreeningQuestionChange(
                        qIndex,
                        "expected_answer",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Describe what you're looking for in an answer (optional)"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Options <span className="text-red-500">*</span>
                    </label>
                    {optionsError && (
                      <span className="text-sm text-red-500">
                        {optionsError}
                      </span>
                    )}
                  </div>

                  {question.options.map((option, oIndex) => {
                    const optionError =
                      errors[`screening_option_${qIndex}_${oIndex}`];

                    return (
                      <div key={oIndex} className="flex items-center">
                        <input
                          type={
                            question.question_type === "single_choice"
                              ? "radio"
                              : "checkbox"
                          }
                          checked={question.correct_options.includes(option)}
                          onChange={() => toggleCorrectOption(qIndex, option)}
                          className="mr-2 "
                          name={`question-${qIndex}`}
                        />
                        <div className="flex-1">
                          <CustomInput
                            value={option}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const updatedQuestions = [...screeningQuestions];
                              if (
                                updatedQuestions[
                                  qIndex
                                ].correct_options.includes(option)
                              ) {
                                const correctIndex =
                                  updatedQuestions[
                                    qIndex
                                  ].correct_options.indexOf(option);
                                updatedQuestions[qIndex].correct_options[
                                  correctIndex
                                ] = newValue;
                              }

                              updatedQuestions[qIndex].options[oIndex] =
                                newValue;
                              setScreeningQuestions(updatedQuestions);
                            }}
                            placeholder={`Option ${oIndex + 1}`}
                            error={optionError}
                            required
                          />
                        </div>
                        <button
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <BiX className="h-5 w-5" />
                        </button>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => addOption(qIndex)}
                    className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
                  >
                    + Add Option
                  </button>

                  {correctError && (
                    <p className="text-sm text-red-500 mt-2">{correctError}</p>
                  )}
                </div>
              )}

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Limit (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={question.time_limit}
                  onChange={(e) =>
                    handleScreeningQuestionChange(
                      qIndex,
                      "time_limit",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          );
        })}

        <button
          onClick={addScreeningQuestion}
          className="mt-2 text-blue-500 hover:text-blue-700 flex items-center"
        >
          <span className="text-lg mr-1">+</span> Add Another Question
        </button>
      </div>
      {!id && (
        <CustomInput
          type={`checkbox`}
          label={`Share As a post`}
          checked={formData?.isShareAsPost}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              isShareAsPost: e.target.checked,
            }))
          }
        />
      )}
    </div>
  );

  return (
    <div className="p-4">
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => navigate(-1)}
                className="p-1 rounded   glassy-text-primary"
              >
                <BiArrowBack size={32} />
              </button>
              <h1 className="text-2xl font-semibold glassy-text-primary">
                {id ? "Edit Job" : "Post a Job"}
              </h1>
              <span className="text-sm glassy-text-secondary">{currentStep}/3</span>
            </div>

            <div className="mb-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>

            <div className="flex justify-between mt-8 gap-3">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-500 glassy-text-primary rounded-md hover:bg-blue-600 ml-auto"
                >
                  Next
                </button>
              ) : (
                <>
                  <Button
                    onClick={handleSubmit}
                    loading={submitting}
                    className="px-4 py-2 bg-green-500 glassy-text-primary rounded-md hover:bg-green-600 ml-auto"
                  >
                    {id ? "Update Job" : "Post Job"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={addModalState.isOpen}
        title={`Add ${addModalState.type}`}
        onClose={() => {
          setAddModalState({ isOpen: false, type: "", field: "" });
          setInputFields({ name: "", logo_url: "" });
        }}
        handleSubmit={handleAddItem}
        loading={loading}
      >
        <div className="space-y-3">
          <CustomInput
            className="w-full h-10"
            label="Enter Name"
            required
            placeholder="Enter name"
            value={inputFields?.name}
            onChange={(e) =>
              setInputFields((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
      </Modal>
    </div>
  );
};

export default PostJob;
