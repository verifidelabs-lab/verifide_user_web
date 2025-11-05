/* eslint-disable default-case */
import React, { useEffect, useState } from "react";
import CustomInput from "../../components/ui/Input/CustomInput";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import useFormHandler from "../../components/hooks/useFormHandler";
import Button from "../../components/ui/Button/Button";
import Aos from "aos";
import FilterSelect from "../../components/ui/Input/FilterSelect";
import CourseCard from "../../components/ui/cards/CourseCard";
import CustomDateInput from "../../components/ui/Input/CustomDateInput";
import { SkillsCard } from "../../components/ui/cards/Card";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllDegree,
  getAllFieldsOfStudy,
  getAllSkillList,
  instituteCollegeList,
  updateDataCompany,
  updateDegreeData,
  updateFieldsOfStudyData,
  updateSkillsData,
} from "../../redux/education/educationSlice";
import {
  arrayTransform,
  convertToTimestamp,
  getDuration,
} from "../../components/utils/globalFunction";
// import Loader from '../Loader/Loader'
import { addEducation } from "../../redux/slices/authSlice";
import { toast } from "sonner";
import Modal from "../../components/ui/Modal/Modal";
// import CustomFileInput from '../../components/ui/Input/CustomFileInput'
import {
  updateCompanyData,
  updateIndustryData,
  updateProfileRoleData,
} from "../../redux/work/workSlice";
import { addOneData } from "../../redux/Users/userSlice";

const EducationDetails = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/user/feed"; // default if not present
  const navigate = useNavigate();
  const selector = useSelector((state) => state.educations);

  const [isCreatedByUser, setIsCreatedByUser] = useState(true);
  const [isCreatedByUserForFields, setIsCreatedByUserForFields] =
    useState(false);
  const [isCreatedByUserForSkill, setIsCreatedByUserForSkill] = useState(false);

  const collegeList = arrayTransform(
    selector?.instituteCollegeListData?.data?.data || []
  );
  const degreeList = arrayTransform(
    selector?.getAllDegreeData?.data?.data || []
  );
  const fieldsOfStudyList = arrayTransform(
    selector?.getAllFieldsOfStudyData?.data?.data || []
  );
  const skillsList = arrayTransform(
    selector?.getAllSkillListData?.data?.data || []
  );

  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [addModalState, setAddModalState] = useState({
    isOpen: false,
    type: "",
    field: "",
  });

  const [inputFields, setInputFields] = useState({
    name: "",
    logo_url: "",
  });

  const allSkills =
    selector?.getAllSkillListData?.data?.data?.map((e) => ({
      value: e?._id,
      label: e?.name,
      selection_count: e?.selection_count,
      isSuggested: e?.isSuggested,
    })) || [];

  useEffect(() => {
    Aos.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    dispatch(instituteCollegeList());
  }, [dispatch]);

  const getModalTitle = (type) => {
    switch (type) {
      case "company":
        return "Add Institution/College";
      case "degree":
        return "Add Degree";
      case "field":
        return "Add Field of Study";
      case "skill":
        return "Add Skill";
      case "companies":
        return "Add Company";
      case "industries":
        return "Add Industry";
      case "profile-roles":
        return "Add Profile Role";
      default:
        return `Add ${type}`;
    }
  };

  const { formData, setFormData, handleChange, errors, setErrors } =
    useFormHandler({
      institution_id: "",
      degree_id: "",
      field_of_studies: "",
      start_date: "",
      end_date: "",
      currently_available: false,
      duration: "",
      skills_acquired: [],
    });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.institution_id) {
      newErrors.institution_id = "College/University is required";
    }
    if (!formData.degree_id) {
      newErrors.degree_id = "Degree is required";
    }
    if (!formData.field_of_studies) {
      newErrors.field_of_studies = "Field of study is required";
    }
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }
    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_date >= formData.end_date
    ) {
      newErrors.end_date = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        skills_acquired: selectedSkills.map((skill) => skill.value),
        duration: getDuration(formData?.start_date, formData?.end_date),
        start_date: convertToTimestamp(formData?.start_date),
        end_date: convertToTimestamp(formData?.end_date),
      };
      if (!submissionData.skills_acquired.length) {
        delete submissionData.skills_acquired;
      }

      console.log("Form submission data:", submissionData);
      const res = await dispatch(addEducation(submissionData)).unwrap();
      toast.success(res?.message);

      // navigate("/work-experience");
      navigate(`/work-experience?redirect=${encodeURIComponent(redirectUrl)}`);
    } catch (error) {
      console.error("Error saving education details:", error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = async (field, selected) => {
    console.log(`Handling ${field} change:`, selected);

    if (field === "institution_id") {
      setIsCreatedByUser(selected?.created_by_users);
    } else if (field === "degree_id") {
      setIsCreatedByUserForFields(selected?.created_by_users);
    } else if (field === "field_of_studies") {
      setIsCreatedByUserForSkill(selected?.created_by_users);
    }

    const exists = Array.isArray(selected)
      ? selected?.find((e) => e.value === "ADD")
      : selected?.value === "ADD";
    if (exists) {
      let modalType = "";

      switch (field) {
        case "institution_id":
          modalType = "company";
          break;
        case "degree_id":
          modalType = "degree";
          break;
        case "field_of_studies":
          modalType = "field";
          break;
        case "skills_acquired":
          modalType = "skill";
          break;
        default:
          return;
      }

      setAddModalState({
        isOpen: true,
        type: modalType,
        field: field,
      });
      return; // Exit early since we're opening modal
    }

    const newErrors = { ...errors };
    delete newErrors[field];

    if (field === "institution_id") {
      setFormData((prev) => ({
        ...prev,
        institution_id: selected?.value || "",
        degree_id: "",
        field_of_studies: "",
        skills_acquired: [],
      }));

      delete newErrors.degree_id;
      delete newErrors.field_of_studies;
      delete newErrors.skills_acquired;

      setSelectedSkills([]);

      if (selected?.value) {
        setLoading(true);
        try {
          // setIsCreatedByUser(selected?.created_by_users)

          await dispatch(
            getAllDegree({
              institution_id: selected.value,
              created_by_users: selected?.created_by_users || null,
            })
          );
        } catch (error) {
          console.error("Error fetching degrees:", error);
          toast.error("Failed to fetch degrees");
        } finally {
          setLoading(false);
        }
      }
    } else if (field === "degree_id") {
      setFormData((prev) => ({
        ...prev,
        degree_id: selected?.value || "",
        field_of_studies: "",
        skills_acquired: [],
      }));

      delete newErrors.field_of_studies;
      delete newErrors.skills_acquired;

      setSelectedSkills([]);

      if (selected?.value) {
        setLoading(true);
        try {
          // setIsCreatedByUser(selected?.created_by_users)

          await dispatch(
            getAllFieldsOfStudy({
              degree_id: selected.value,
              created_by_users: selected?.created_by_users || null,
            })
          );
        } catch (error) {
          console.error("Error fetching fields of study:", error);
          toast.error("Failed to fetch fields of study");
        } finally {
          setLoading(false);
        }
      }
    } else if (field === "field_of_studies") {
      setFormData((prev) => ({
        ...prev,
        field_of_studies: selected?.value || "",
        skills_acquired: [],
      }));

      delete newErrors.skills_acquired;

      setSelectedSkills([]);

      if (selected?.value) {
        setLoading(true);
        try {
          // setIsCreatedByUser(selected?.created_by_users)

          await dispatch(
            getAllSkillList({
              study_id: selected.value,
              created_by_users: selected?.created_by_users || null,
            })
          );
        } catch (error) {
          console.error("Error fetching skills:", error);
          toast.error("Failed to fetch skills");
        } finally {
          setLoading(false);
        }
      }
    } else if (field === "skills_acquired") {
      const skillsArray = Array.isArray(selected)
        ? selected
        : selected
        ? [selected]
        : [];
      setSelectedSkills(skillsArray);
      setFormData((prev) => ({
        ...prev,
        skills_acquired: skillsArray.map((skill) => skill.value),
      }));

      // Clear skill error if skills are selected
      if (skillsArray.length > 0) {
        delete newErrors.skills_acquired;
      }
    }

    setErrors(newErrors);
  };

  const handleSkillClick = (skill) => {
    if (!skill) return;

    setSelectedSkills((prev) => {
      // Check if skill is already selected
      const isSelected = prev.some(
        (s) =>
          s.value === skill.value ||
          s.id === skill.value ||
          s.label === skill.label
      );

      if (isSelected) {
        // Remove skill if already selected
        return prev.filter(
          (s) =>
            s.value !== skill.value &&
            s.id !== skill.value &&
            s.label !== skill.label
        );
      } else {
        // Add skill if not selected
        return [
          ...prev,
          {
            value: skill.value,
            label: skill.label || skill.name,
            ...skill,
          },
        ];
      }
    });

    // Clear skill error if any
    if (errors.skills_acquired) {
      setErrors((prev) => ({ ...prev, skills_acquired: undefined }));
    }
  };

  const isSkillSelected = (skill) => {
    return selectedSkills.some(
      (s) =>
        s.value === skill.value ||
        s.id === skill.value ||
        s.label === skill.label
    );
  };

  const courses = [
    {
      id: 1,
      title: "Bootstrap 5 & iOS Development",
      author: "Kitani Studio",
      authorLink: "#",
      description: "Learn how to make web application with iOS Framework.",
      rating: 4,
      reviews: "1.2K",
      price: "24.92",
      originalPrice: "32.90",
      tags: ["Swift"],
      img: "/Placeholder 1.png",
    },
    {
      id: 2,
      title: "Website Dev Zero to Hero",
      author: "Kitani Studio",
      authorLink: "#",
      description:
        "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...",
      rating: 4,
      reviews: "1.2K",
      price: "24.92",
      originalPrice: "32.90",
      tags: ["UI", "UX", "Figma"],
      img: "/Placeholder 3.png",
    },
    {
      id: 3,
      verified: false,
      title: "WEBSITE DEV ZERO TO HERO",
      author: "Kiani Studio",
      category: "Design Fundamentals",
      description:
        "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...",
      ctaText: "MAKE UBER CLONE APP",
      price: "$24,92",
      originalPrice: "32,00",
      img: "/Placeholder 2.png",
      rating: 4,
    },
    {
      id: 4,
      verified: false,
      title: "WEBSITE DEV ZERO TO HERO",
      author: "Kiani Studio",
      category: "Design Fundamentals",
      description:
        "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator Now...",
      ctaText: "MAKE UBER CLONE APP",
      price: "$24,92",
      originalPrice: "32,00",
      img: "/Placeholder 4.png",
      rating: 4,
    },
  ];

  // const handleFileUpload2 = async (file) => {
  //     if (!file) {
  //         toast.error('Please select a file');
  //         return;
  //     }

  //     if (file.size > 5 * 1024 * 1024) {
  //         toast.error('File size must be less than 5MB');
  //         return;
  //     }

  //     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  //     if (!allowedTypes.includes(file.type)) {
  //         toast.error('Only image files (JPEG, PNG) are allowed');
  //         return;
  //     }

  //     setLoading(true);
  //     try {
  //         const result = await uploadImageDirectly(file, "ADDITIONAL_CERTIFICATIONS_MEDIA");

  //         if (result?.data?.imageURL) {
  //             setInputFields(prev => ({ ...prev, logo_url: result.data.imageURL }));

  //             toast.success(result?.message || 'Image uploaded successfully');
  //         } else {
  //             throw new Error('Upload failed');
  //         }
  //     } catch (error) {
  //         toast.error(error?.message || 'Failed to upload image');
  //     } finally {
  //         setLoading(false);
  //     }
  // }

  const handleAddItem = async () => {
    if (!inputFields.name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    setLoading(true);

    try {
      let type = "";
      let updateAction = null;

      switch (addModalState.type) {
        case "company":
          type = "institutions";
          updateAction = updateDataCompany;
          break;
        case "degree":
          type = "degrees";
          updateAction = updateDegreeData;
          break;
        case "field":
          type = "fields-of-studies";
          updateAction = updateFieldsOfStudyData;
          break;
        case "skill":
          type = "skills";
          updateAction = updateSkillsData;
          break;
        case "companies":
          type = "companies";
          updateAction = updateCompanyData;
          break;
        case "industries":
          type = "industries";
          updateAction = updateIndustryData;
          break;
        case "profile-roles":
          type = "profile-roles";
          updateAction = updateProfileRoleData;
          break;
        default:
          toast.error("Invalid item type");
          return;
      }

      const res = await dispatch(addOneData({ type, ...inputFields })).unwrap();

      if (updateAction) {
        dispatch(
          updateAction({
            _id: res.data._id,
            name: res.data.name,
            created_by_users: res?.data?.created_by_users,
          })
        );
      }

      const newOption = {
        value: res.data._id,
        label: res.data.name,
        created_by_users: res.data.created_by_users,
      };
      if (addModalState.field === "required_skills") {
        const newSkillOption = {
          value: newOption._id,
          label: newOption.name,
          created_by_users: newOption.created_by_users,
        };

        setFormData((prev) => ({
          ...prev,
          required_skills: [...(prev.required_skills || []), newOption._id],
        }));

        setSelectedSkills((prev) => [...(prev || []), newSkillOption]);
      }
      // Automatically select the newly created item
      handleSelectChange(addModalState.field, newOption);

      // Close modal and reset
      setAddModalState({ isOpen: false, type: "", field: "" });
      setInputFields({ name: "", logo_url: "" });

      toast.success(`${res.data.name} added successfully`);

      switch (addModalState.field) {
        case "institution_id":
          dispatch(instituteCollegeList());
          break;
        case "degree_id":
          if (formData.institution_id) {
            dispatch(
              getAllDegree({
                institution_id: formData.institution_id,
                created_by_users: isCreatedByUser || null,
              })
            );
          }
          break;
        case "field_of_studies":
          if (formData.degree_id) {
            dispatch(
              getAllFieldsOfStudy({
                degree_id: formData.degree_id,
                created_by_users: isCreatedByUserForFields || null,
              })
            );
          }
          break;
        case "skills_acquired":
          if (formData.field_of_studies) {
            dispatch(
              getAllSkillList({
                study_id: formData.field_of_studies,
                created_by_users: isCreatedByUserForFields || null,
              })
            );
          }
          break;
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error(error?.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  // const handleCreateCollege = async (inputValue) => {
  //     console.log("this is input", inputValue)
  //     const newCollege = {
  //         value: inputValue.toLowerCase().replace(/\s/g, '-'),
  //         label: inputValue
  //     };

  //     handleSelectChange("institution_id", newCollege);
  // };

  return (
    <>
      {/* <Loader loading={loading} /> */}
      <div className="min-h-screen glassy-card">
        <div className="flex flex-col md:flex-row">
          <div className="md:block hidden">
            {/* <div className="gradient-background flex gap-x-10 items-center justify-center h-screen ">
              {courses
                .filter((course) => course.id === 1)
                .map((course) => (
                  <CourseCard
                    key={course.id}
                    bannerImage={course.img}
                    verified={course.verified}
                    courseTitle={course.title}
                    author={course.author}
                    category={course.category}
                    description={course.description}
                    ctaText={course.ctaText}
                    price={course.price}
                    oldPrice={course.originalPrice}
                    rating={course?.rating}
                  />
                ))}
              <div className="space-y-10">
                {courses
                  .filter((course) => course.id === 2)
                  .map((course) => (
                    <CourseCard
                      key={course.id}
                      bannerImage={course.img}
                      verified={course.verified}
                      courseTitle={course.title}
                      author={course.author}
                      category={course.category}
                      description={course.description}
                      ctaText={course.ctaText}
                      price={course.price}
                      oldPrice={course.originalPrice}
                      rating={course?.rating}
                    />
                  ))}
                {courses
                  .filter((course) => course.id === 3)
                  .map((course) => (
                    <CourseCard
                      key={course.id}
                      bannerImage={course.img}
                      verified={course.verified}
                      courseTitle={course.title}
                      author={course.author}
                      category={course.category}
                      description={course.description}
                      ctaText={course.ctaText}
                      price={course.price}
                      oldPrice={course.originalPrice}
                      rating={course?.rating}
                    />
                  ))}
              </div>
              <div>
                {courses
                  .filter((course) => course.id === 4)
                  .map((course) => (
                    <CourseCard
                      key={course.id}
                      bannerImage={course.img}
                      verified={course.verified}
                      courseTitle={course.title}
                      author={course.author}
                      category={course.category}
                      description={course.description}
                      ctaText={course.ctaText}
                      price={course.price}
                      oldPrice={course.originalPrice}
                      rating={course?.rating}
                    />
                  ))}
              </div>
            </div> */}
             <div
          className="hidden md:block w-full h-screen"
          data-aos-duration="1000"
          data-aos-easing="ease-out-quart"
        >
          <img
            src="/edu-details-img.png"
            alt="Login illustration"
            className="w-full h-full object-cover"
          />

        </div>

          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center p-6">
            <div
              className="w-full max-w-lg border-[0.5px] glassy-card border-[#A9A9A9]/50 shadow-sm rounded-[10px] p-4"
              data-aos="fade-left"
            >
              <div className="text-center mb-4">
                <img
                  src="/Frame 1000004906.png"
                  alt="logo"
                  className="mx-auto max-w-56 h-10 my-2"
                />
                <p className="glassy-text-primary text-base font-normal">
                  Learn More. Earn More
                </p>
                <h1 className="text-3xl font-semibold glassy-text-primary py-3">
                  Education Details
                </h1>
                <p className="text-[#646464] text-base font-normal mb-3">
                  Fill the below Details
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <FilterSelect
                  label="College/ University Name"
                  name="institution_id"
                  placeholder="Select College/University"
                  selectedOption={
                    collegeList?.find(
                      (opt) => opt.value === formData?.institution_id
                    ) || null
                  }
                  options={collegeList || []}
                  error={errors.institution_id}
                  onChange={(selected) =>
                    handleSelectChange("institution_id", selected)
                  }
                  className="w-full h-10"
                  onCreateOption={(inputValue, field) => {
                    setAddModalState({
                      isOpen: true,
                      type: "company", // same as institution
                      field: field,
                    });
                    setInputFields((prev) => ({ ...prev, name: inputValue }));
                  }}
                  isClearable={true}
                  isCreatedByUser={true}
                />

                <FilterSelect
                  label="Degree"
                  name="degree_id"
                  placeholder="Select Degree"
                  options={degreeList || []}
                  selectedOption={
                    degreeList?.find(
                      (opt) => opt.value === formData?.degree_id
                    ) || null
                  }
                  onChange={(selected) =>
                    handleSelectChange("degree_id", selected)
                  }
                  error={errors.degree_id}
                  className="w-full h-10"
                  isDisabled={!formData.institution_id}
                  onCreateOption={(inputValue, field) => {
                    setAddModalState({
                      isOpen: true,
                      type: "degree", // same as institution
                      field: field,
                    });
                    setInputFields((prev) => ({ ...prev, name: inputValue }));
                  }}
                  isClearable={true}
                  isCreatedByUser={isCreatedByUser ? true : false}
                />

                <FilterSelect
                  label="Field of study"
                  name="field_of_studies"
                  options={fieldsOfStudyList || []}
                  placeholder="Select Field of Study"
                  selectedOption={
                    fieldsOfStudyList?.find(
                      (opt) => opt.value === formData?.field_of_studies
                    ) || null
                  }
                  onChange={(selected) =>
                    handleSelectChange("field_of_studies", selected)
                  }
                  error={errors.field_of_studies}
                  className="w-full h-10"
                  isDisabled={!formData.degree_id}
                  onCreateOption={(inputValue, field) => {
                    setAddModalState({
                      isOpen: true,
                      type: "field", // same as institution
                      field: field,
                    });
                    setInputFields((prev) => ({ ...prev, name: inputValue }));
                  }}
                  isClearable={true}
                  isCreatedByUser={isCreatedByUser ? true : false}
                />

                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                  <CustomDateInput
                    label="Start Date"
                    name="start_date"
                    type="date"
                    value={formData?.start_date}
                    onChange={(e) => handleChange("start_date", e.target.value)}
                    error={errors.start_date}
                    autoComplete="off"
                    className="w-full h-10"
                  />
                  <CustomDateInput
                    label="End Date"
                    name="end_date"
                    type="date"
                    value={formData?.end_date}
                    onChange={(e) => handleChange("end_date", e.target.value)}
                    error={errors.end_date}
                    autoComplete="off"
                    className="w-full h-10"
                    min={formData?.start_date}
                  />
                </div>

                <FilterSelect
                  label="Skills Acquired"
                  options={skillsList || []}
                  selectedOption={selectedSkills}
                  onChange={(selected) =>
                    handleSelectChange("skills_acquired", selected)
                  }
                  isMulti={true}
                  error={errors.skills_acquired}
                  placeholder="Select or search skills"
                  isDisabled={!formData.field_of_studies}
                  onCreateOption={(inputValue, field) => {
                    setAddModalState({
                      isOpen: true,
                      type: "skill", // same as institution
                      field: field,
                    });
                    setInputFields((prev) => ({ ...prev, name: inputValue }));
                  }}
                  isClearable={true}
                  isCreatedByUser={isCreatedByUser ? true : false}
                />

                <div className="max-w-lg overflow-hidden">
                  <SkillsCard
                    title="Suggested"
                    isSelected={isSkillSelected}
                    handleSkillClick={handleSkillClick}
                    selectedSkills={selectedSkills}
                    skills={allSkills || []}
                    limit={6}
                  />
                  {errors.skills_acquired && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.skills_acquired}
                    </p>
                  )}
                </div>

                <div className="flex justify-between place-items-center gap-4 py-5">
                  {/* <Button variant="outline" className="w-full" type="button">
                    Prev
                  </Button> */}
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() =>
                      navigate(
                        `/create-account?redirect=${encodeURIComponent(
                          redirectUrl
                        )}`
                      )
                    }
                  >
                    Prev
                  </Button>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Saving..." : "Next"}
                  </Button>
                </div>
              </form>

              <div className="mt-2 text-center text-base text-[#646464]">
                <Link
                  // to="/work-experience"
                  to={`/work-experience?redirect=${encodeURIComponent(
                    redirectUrl
                  )}`}
                  className="text-[#2563EB] hover:underline font-medium text-base hover:text-blue-500"
                >
                  Skip Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={addModalState.isOpen}
        title={getModalTitle(addModalState.type)}
        onClose={() => {
          setAddModalState({ isOpen: false, type: "", field: "" });
          setInputFields({ name: "", logo_url: "" });
        }}
        handleSubmit={handleAddItem}
        loading={loading} // Pass loading state to disable submit button
      >
        <div className="space-y-3">
          <CustomInput
            className="w-full h-10"
            label="Enter Name"
            required
            placeholder={`Enter ${addModalState.type} name`}
            value={inputFields?.name}
            onChange={(e) =>
              setInputFields((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
      </Modal>
    </>
  );
};

export default EducationDetails;
