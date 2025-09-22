import React, { useEffect, useRef, useState } from 'react'
import { FaGraduationCap, FaRegStar } from 'react-icons/fa'
import { ProgressItem, TitleValue } from '../../components/ui/Title Value/TitleValue'
import { BiCheckCircle, BiMailSend, BiPhone, BiStar, BiUser } from 'react-icons/bi'
import { GiNetworkBars } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import {
  addIdentityDocument,
  assessmentsForSkills, declareResult, startAssessment, submitAnswer, updateIdentityDocument, verificationByOtp, verificationCenterDocumentDetails,
  verificationCount, verificationDashboardCount, verificationTabCount,
  verifyMobByOtp,
  verifyRequest,
} from '../../redux/Verification/Verification';
import { toast } from 'sonner';
import CategoryCard from '../../components/ui/cards/VerificationCategoryCard';
import SkeletonCard from '../../components/Loader/CardLoader';
import Modal from '../../components/ui/Modal/Modal';
import CustomInput from '../../components/ui/Input/CustomInput';
import useFormHandler from '../../components/hooks/useFormHandler';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import FilterSelect from '../../components/ui/Input/FilterSelect';
import FileUpload from '../../components/ui/Image/ImageUploadWithSelect';
import { arrayTransform, uploadImageDirectly, uploadPdfDirectly } from '../../components/utils/globalFunction';
import { countries } from '../../redux/Global Slice/cscSlice';
import { getProfile } from '../../redux/slices/authSlice';
import Button from '../../components/ui/Button/Button';
import { SkillsCard2 } from '../../components/ui/cards/Card';

const Verification = ({ headline }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const selector = useSelector(state => state.verification)
  const countriesSelector = useSelector(state => state.global)
  const { verificationTabCountData: { data } } = selector ? selector : {}
  const [verificationData, setVerificationData] = useState([])
  const [verificationDashboardData, setVerificationDashboardData] = useState([])

  const [activeTab, setActiveTab] = useState('categories');
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [otp, setOtp] = useState(Array(6).fill(''))

  const [modalState, setModalState] = useState({ isOpen: false, data: {}, tab: "", type: "" })
  const [selectOption, setSelectOption] = useState([])
  const [assessmentData, setAssessmentData] = useState([])
  const [searchParams, setSearchParams] = useSearchParams();
  const { formData, handleChange, errors, setErrors, resetForm, setFormData } = useFormHandler({
    email: "", otp: "", phone: "", skills: [], id_number: "",
    "country_code": {
      "name": "",
      "dial_code": "",
      "short_name": "",
      "emoji": ""
    }, token: ""
  })
  const [showAssessment, setShowAssessment] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [qa, setQa] = useState(null)
  const [isResultModal, setIsResultModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const [timerActive, setTimerActive] = useState(false);
  const [frontImage, setFrontImage] = useState('')
  const [backImage, setBackImage] = useState('')
  const [isRejected, setIsRejected] = useState({})
  const countryList = arrayTransform(countriesSelector?.countriesData?.data?.data || [])
  const [isOtp, setIsOtp] = useState(false)
  const inputRefs = useRef([]);
  const [isActionButtonForId, setIsActionButtonForId] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenData, setIsOpenData] = useState(null)


  const fetchTabData = () => {
    dispatch(verificationTabCount())
  }

  const fetchVerificationCount = async () => {
    setLoading(true)
    let tab = {
      tab: activeTab
    }
    try {
      const res = await dispatch(verificationCount(tab)).unwrap()
      setVerificationData(res?.data?.verifications || [])
      setLoading(false)
    } catch (error) {
      toast.error(error)
      setLoading(false)
    }
  }

  const fetchVerificationDashboardData = async () => {
    try {
      const res = await dispatch(verificationDashboardCount()).unwrap()
      setVerificationDashboardData(res?.data)
    } catch (error) {
      toast.error(error || ' Failed to fetch data !')
    }
  }

  useEffect(() => {
    fetchTabData()
    fetchVerificationCount()
    dispatch(countries())
    fetchVerificationDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showAssessment && currentQuestion) {
      setTimeLeft(60);
      setTimerActive(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAssessment, currentQuestionIndex]);

  // Timer countdown effect
  useEffect(() => {
    let interval = null;

    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            // Time's up - automatically move to next question
            setTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerActive, timeLeft]);

  const handleTimeUp = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      handleQuestionSubmit();
    } else {
      handleNextQuestion();
    }
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  const handleViewCertificate = (data) => {
    navigate(`/certtificate-view/${data}`)
  }

  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return { text: 'Verified', color: 'bg-green-100 text-green-600' };
      case 'unverified':
        return { text: 'Unverified', color: 'bg-gray-100 text-gray-600' };
      case 'pending':
        return { text: 'Pending', color: 'bg-orange-100 text-orange-600' };
      case 'under review':
        return { text: 'Under Review', color: 'bg-yellow-100 text-yellow-600' };
      case 'partial verified':
        return { text: 'Partial verified', color: 'bg-blue-100 text-blue-600' };
      case 'required':
        return { text: 'Required', color: 'bg-red-100 text-red-600' };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-600' };
    }
  }

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'email':
        return <BiMailSend className="w-6 h-6 text-blue-500" />;
      case 'phone':
        return <BiPhone className="w-6 h-6 text-blue-500" />;
      case 'education':
        return <FaGraduationCap className="w-6 h-6 text-blue-500" />;
      case 'skills':
        return <BiStar className="w-6 h-6 text-blue-500" />;
      case 'identity':
        return <BiUser className="w-6 h-6 text-blue-500" />;
      case 'certificate':
        return <BiCheckCircle className="w-6 h-6 text-blue-500" />;
      case 'experience':
        return <BiCheckCircle className="w-6 h-6 text-blue-500" />;
      case 'project':
        return <BiCheckCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <BiCheckCircle className="w-6 h-6 text-blue-500" />;
    }
  }


  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (value && isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }


  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };



  const tabs = [
    { name: "Categories", key: "categories" },
    { name: "Needs Verification", count: data?.data?.unverified || 0, key: "needVerification" },
    { name: "Pending Requests", count: data?.data?.pending || 0, key: "pendingRequest" },
    { name: "Verified", count: data?.data?.verified || 0, key: "verified" }
  ];

  const handleVerification = async (data) => {
    const tab = activeTab;
    const type = data?.type;

    console.log(tab, type)
    if (data?.type === 'education' || data?.type === 'experience' || data?.type === "certificate" || data?.type === "project") {
      navigate(`/user/verification-category?tab=${tab}&type=${type}`);
    } else {
      const res = await dispatch(verificationCenterDocumentDetails({
        "moduleType": type,
        "tab": activeTab
      })).unwrap()



      if (type === 'identity' && res?.data?.identity?.[0]?.status === 'requested') {
        toast.info("Your document already sent for verification")
      } else if (type === "identity" && res?.data?.identity?.[0]?.status === 'approved') {
        setFormData((prev) => ({ ...prev, id_number: res?.data?.identity[0]?.id_number }))
        setFrontImage(res?.data?.identity[0]?.front_side_file)
        setBackImage(res?.data?.identity[0]?.back_side_file)
        setModalState({ isOpen: true, tab: tab, data: data, type: type });
        setIsActionButtonForId(Array.isArray(res?.data?.identity) && res?.data?.identity[0]?.id_number ? false : true)
      } else if (tab === 'verified' && type === 'skills') {
        setIsOpen(true)
        setIsOpenData(res?.data?.skills)
      } else {
        const modifiedData = res?.data?.skills?.filter(item => !item?.is_verified).map((e) => ({
          value: e?.skill_id,
          label: e?.name
        }))
        setSelectOption(modifiedData)
        setModalState({ isOpen: true, tab: tab, data: data, type: type });
        setIsRejected(res?.data)
      }


    }
  };
  const resetOtpState = () => {
    setOtp(Array(6).fill(''));
    setIsOtp(false);
  };
  const handleClose = () => {
    setModalState({ isOpen: false, data: {}, type: "" })
    resetForm()
    setFrontImage("")
    setBackImage("")
    setErrors({})
    setIsOtp(false)
    resetOtpState()
  }

  const handleOtpSubmit = async () => {
    const newErrors = {};
    if (!formData?.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData?.country_code?.name) {
      newErrors.country_code = "Country code is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    let apiPayload = {
      "phone_number": formData?.phone,
      "country_code": formData?.country_code
    }
    try {
      const res = await dispatch(verificationByOtp(apiPayload)).unwrap()
      // console.log("res?.data", res?.data)
      toast.success(res?.message)
      if (res?.data?.token) {
        setIsOtp(true)
        setFormData((prev) => ({ ...prev, token: res?.data?.token }))
      }

    } catch (error) {
      toast.error(error)
    }
  }

  const handleSubmit = async () => {
    let newErrors = {};

    if (modalState.type === 'identity') {
      if (!formData?.id_number) {
        newErrors.id_number = "ID number is required";
      }

      if (!frontImage) {
        newErrors.frontImage = "Front image is required";
      }

      if (!backImage) {
        newErrors.backImage = "Back image is required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      try {
        let apiPayload = {
          "id_number": formData?.id_number,
          "front_side_file": frontImage,
          "back_side_file": backImage
        }
        if (isRejected?.identity[0]?.status === 'rejected') {
          apiPayload._id = isRejected?.identity[0]?._id
        }
        const action = isRejected?.identity[0]?.status === 'rejected' ? updateIdentityDocument : addIdentityDocument
        const res = await dispatch(action(apiPayload)).unwrap()
        if (res?.data) {
          let updateApiPayload = {
            document_id: res?.data?._id,
            "type": "identity-verifications",
            attach_file: []
          }
          dispatch(verifyRequest(updateApiPayload))
          toast.success(res?.message)
          handleClose()
          fetchTabData()
          fetchVerificationCount()
        }

      } catch (error) {
        toast.error(error || "An error accrued!")
      }

    } else if (modalState?.type === 'phone') {

      if (!isOtp) {
        handleOtpSubmit()
      } else if (isOtp) {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
          toast.error('Please enter a 6-digit OTP');
          return;
        }

        let apiPayload = {
          "token": formData?.token,
          "otp": otpValue
        }
        try {
          const res = await dispatch(verifyMobByOtp(apiPayload)).unwrap()
          toast.success(res?.message)
          // setModalState({isOpen:fals})
          handleClose()
          fetchVerificationCount()

        } catch (error) {
          toast.error(error)
        }

      }

    } else {

      let apiPayload = {
        skills: formData?.skills
      }
      try {
        const res = await dispatch(assessmentsForSkills(apiPayload)).unwrap()
        setAssessmentData(res?.data || [])
        if (res?.data.length === 0) {
          toast.info("No Assessment Available for this skills !")
        }
      } catch (error) {
        toast.error(error)
      }
    }


  }

  const handleSelectChange = (selected) => {
    setFormData((prev) => ({
      ...prev, skills: selected?.map(e => e?.value)
    }))
  }

  const handleAssessmentSelect = async (item) => {
    try {
      const res = await dispatch(startAssessment({
        skills: formData?.skills,
        assessment_id: item?._id
      })).unwrap()

      if (res?.data) {
        setShowAssessment(true)
        setCurrentQuestionIndex(0)
        setSelectedOptions([])
        setModalState({ isOpen: false })
        setQa(res?.data)
      }
    } catch (error) {
      toast.error(error || 'Failed to start assessment')
    }
  }



  const handleNextQuestion = async () => {


    try {
      const currentQuestion = qa?.questions?.[currentQuestionIndex];
      const payload = {
        question: currentQuestion?.question,
        selected_options: selectedOptions,
        skillToken: qa?.skillToken,
      };

      await dispatch(submitAnswer(payload)).unwrap();

      if (currentQuestionIndex < (qa?.questions?.length || 0) - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptions([]);
      } else {
        toast.success("Assessment completed successfully!");
        setShowAssessment(false);
      }
    } catch (error) {
      toast.error(error || "Failed to submit answer");
    }
  };

  const currentQuestion = qa?.questions?.[currentQuestionIndex] || {};
  const totalQuestions = qa?.questions?.length || 0;

  const handleQuestionSubmit = async () => {
    const payload = {
      question: currentQuestion?.question,
      selected_options: selectedOptions,
      skillToken: qa?.skillToken,
    };

    const response = await dispatch(submitAnswer(payload)).unwrap();
    toast.info(response?.message)
    if (response) {
      const res = await dispatch(declareResult({ skillToken: qa?.skillToken })).unwrap()
      toast.info(res?.message)
      setModalState({ data: res?.data })
      dispatch(getProfile())
      setIsResultModal(true)
      setShowAssessment(false)
      setQa(null)
      setTimeLeft(0)
    }

  }

  const handleFileUpload = async (documentType, file) => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    const allowedPdfType = "application/pdf";

    if (![...allowedImageTypes, allowedPdfType].includes(file.type)) {
      toast.error("Only image files (JPEG, PNG) or PDF are allowed");
      return;
    }

    if (documentType === "FRONT") {
      setLoading(true);
    } else {
      setLoading2(true);
    }

    try {
      let result;
      if (file.type === allowedPdfType) {
        // PDF upload
        result = await uploadPdfDirectly(file, "IDENTITY_VERIFICATION_MEDIA");
      } else {
        // Image upload
        result = await uploadImageDirectly(file, "IDENTITY_VERIFICATION_MEDIA");
      }

      if (documentType === "FRONT") {
        setFrontImage(result?.data?.fileURL || result?.data?.imageURL);
        setErrors({})
      } else if (documentType === "BACK") {
        setBackImage(result?.data?.fileURL || result?.data?.imageURL);
        setErrors({})

      }

      toast.success(result?.message || "File uploaded successfully");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(error?.message || "Failed to upload file");
    } finally {
      setLoading(false);
      setLoading2(false);
    }
  };


  const handleCountrySelect = (data) => {
    setFormData((prev) => ({
      ...prev, country_code: {
        "name": data?.label,
        "dial_code": data?.dial_code,
        "short_name": data?.short_name || "IN",
        "emoji": data?.emoji || "🇮🇳"
      }
    }))

  }


  return (
    <>
      <div className='p-4 bg-[#F6FAFD] space-y-3'>
        <nav className="flex justify-start items-center gap-2 mb-2 text-sm">
          <span className="text-gray-600">Home</span>
          <span className="text-gray-400">›</span>
          <span className="font-semibold text-base text-[#2563EB]">All Category</span>
        </nav>

        <div className='bg-[#FFFFFF] border border-[#00000033]/20 p-4 rounded-md'>
          <TitleValue title={`Verification Center`} desc={`Manager your Learning Activates for: ${headline ? headline : ""}`} />
          <div className='grid md:grid-cols-3 grid-cols-1 gap-3 mt-3'>
            <ProgressItem
              title={`${verificationDashboardData?.verification_percentage || "N/A"} %`}
              desc="Overall Verification"
              icon={<BiCheckCircle className="text-[#000000]" />}
              progress={45}
              bg={`bg-[#BCCFFA57]/30`}
            />
            <ProgressItem
              title={`${verificationDashboardData?.verification_rating || "0"} Star `}
              desc="Average Rating"
              icon={<FaRegStar className="text-[#000000]" />}
              progress={45}
              bg={`bg-[#FEA6131A]/10`}
            />
            <ProgressItem
              title={`${verificationDashboardData?.verification_strength || "N/A"} `}
              desc=" Verification Strength"
              icon={<GiNetworkBars className="text-[#000000]" />}
              progress={45}
              bg={`bg-[#00BA001A]/30`}
            />
          </div>
        </div>
        <div className='md:hidden block '>
          <div className=" flex  justify-evenly gap-4 overflow-hidden overflow-x-scroll  w-full ">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleTabChange(tab.key)}
                className={`relative   flex items-center gap-2 text-xs font-medium transition-colors ${activeTab === tab.key
                  ? "text-[#000000E6] border-b border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.name}
                {tab.count !== undefined && (
                  <span className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 text-xs">
                    {tab.count}
                  </span>
                )}

                {activeTab === tab.label && (
                  <span className="absolute left-0 -bottom-[1px] w-full h-[2px] bg-blue-500 rounded"></span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className='py-2 md:py-4 bg-[#FFFFFF] border border-[#00000033]/20 p-4 rounded-md'>
          <div className='md:block hidden'>
            <h2 className='text-[#000000] text-[22px] font-bold'>Verification Categories</h2>
            <div className="flex justify-between md:w-fit bg-[#F5F5F4] rounded-[10px] p-2 w-full flex-wrap ">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === tab.key
                    ? 'bg-white text-[#2563EB] border-b-2 border-[#2563EB] font-semibold shadow-sm'
                    : 'text-[#00000099]/60 font-medium'
                    }`}
                  onClick={() => handleTabChange(tab.key)}
                >
                  {tab.name}
                  {tab.count !== null && tab.count > 0 && (
                    <span
                      className={`ml-1.5 ${activeTab === tab.key ? 'text-gray-500' : 'text-gray-400'
                        }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {loading ? (
              Array.from({ length: verificationData?.length || 6 }).map((_, index) =>
                <SkeletonCard key={index} />)
            ) : verificationData && verificationData.length > 0 ? (
              verificationData.map((item, index) => (
                <CategoryCard
                  key={index}
                  item={item}
                  getIcon={getIcon}
                  statusInfo={getStatusInfo(item.status)}
                  onClick={handleVerification}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">No Data Found</div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalState?.isOpen}
        title={modalState.type}
        onClose={() => { setModalState({ isOpen: false }); resetForm(); setAssessmentData([]); setIsOtp(false) }}
        handleSubmit={handleSubmit}
        isActionButton={(assessmentData.length === 0 && isActionButtonForId) ? true : false}
      >
        <div className=''>
          {modalState.type === "skills" ? (
            <div className=' z-auto'>
              <FilterSelect
                options={selectOption}
                className="w-full h-10"
                onChange={handleSelectChange}
                selectedOption={selectOption?.find(opt => opt.value === formData?.skills)}
                isMulti
              />
            </div>
          ) :
            modalState?.type === 'identity' ?
              <div className='space-y-2'>
                {Array.isArray(isRejected?.identity) && isRejected?.identity[0]?.status === 'rejected' && (

                  <div>
                    <p className='capitalize'><span className='font-semibold text-sm text-amber-900 pr-2'>Reject Reason:-</span>{
                      Array.isArray(isRejected?.identity) && isRejected?.identity[0]?.rejection_reason}</p>
                  </div>
                )}

                <CustomInput
                  label="Identity No"
                  placeholder="eg:  acceptable IDs (Aadhaar, Driving License, etc.) "
                  value={formData?.id_number}
                  onChange={(e) => handleChange("id_number", e.target.value)}
                  name="id_number"
                  error={errors?.id_number}
                  className="h-10 w-full"
                  required
                />
                <div className=''>
                  <label className="text-base text-[#282828] font-medium mb-2">Front Image</label>
                  <FileUpload
                    inputId="front-upload"
                    onFileUpload={(file) => handleFileUpload("FRONT", file)}
                    file={frontImage}
                    setFile={setFrontImage}
                    isUploading={loading}
                  />
                  <p className='text-red-500 text-xs'>{errors?.frontImage}</p>
                </div>

                <div className="mt-6">
                  <label className="text-base text-[#282828] font-medium mb-2">Back Image</label>
                  <FileUpload
                    inputId="back-upload"
                    onFileUpload={(file) => handleFileUpload("BACK", file)}
                    file={backImage}
                    setFile={setBackImage}
                    isUploading={loading2}
                  />
                  <p className='text-red-500 text-xs'>{errors?.backImage}</p>

                </div>

              </div> :
              modalState?.type === 'phone' ?
                (
                  <div>
                    {isOtp ? (
                      <>

                        <labe className="text-base text-[#282828] font-medium  flex items-center gap-1 ">Enter 6 digit otp</labe>
                        <div className='flex justify-center items-center gap-2 mx-auto'>
                          {Array.from({ length: 6 }).map((_, index) => (
                            <input
                              key={index}
                              ref={(el) => (inputRefs.current[index] = el)}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              value={otp[index]}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(index, e)}
                              className={`w-12 h-12 text-center text-xl border-2 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition-all ${otp[index] ? 'border-blue-500' : 'border-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <div className='flex justify-center  items-center py-2 '>
                          <span onClick={() => handleOtpSubmit()} className='text-blue-500 hover:underline pb-1 cursor-pointer font-semibold text-lg '>Resend Otp</span>
                        </div>
                      </>
                    ) : (
                      <div className='space-y-4'>
                        <FilterSelect label='Select Country' options={countryList || []}
                          value={countryList.find(opt => opt.label === formData?.country_code?.name)}
                          onChange={(select) => handleCountrySelect(select)}
                          error={errors?.country_code}
                        />
                        {formData?.country_code?.name && (
                          <CustomInput type="number" value={formData?.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                            label={"Enter Phone Number"} className="w-full h-10" placeholder="Enter mobile no according to country"
                            error={errors?.phone}
                          />
                        )}
                      </div>
                    )}

                  </div>
                ) : (
                  <CustomInput
                    label="Email Address"
                    placeholder="Enter Email"
                    className="w-full h-10"
                    value={formData?.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                )}
        </div>

        <div className='my-2'>
          {assessmentData.length > 0 ? assessmentData.map((ele) => (
            <div
              key={ele._id}
              className='border rounded-lg p-2 my-2 cursor-pointer hover:bg-gray-100 transition'

            >
              <p className='font-semibold'>{ele?.title}</p>
              <p>{ele?.description}</p>
              <p>Level: {ele?.level_id?.name}</p>
              <p>Questions: {ele?.no_of_questions}</p>
              <p>Time Limit: {ele?.time_limit} mins</p>
              <p>Max Attempts: {ele?.max_attempts}</p>
              <p className='text-blue-500 cursor-pointer' onClick={() => handleAssessmentSelect(ele)}>Click here to start assessment</p>
            </div>
          )) : (
            <>
              {/* No Assessment available for selected skill */}
            </>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showAssessment}
        onClose={() => {
          setShowAssessment(false);
          setAssessmentData([]);
        }}
        title={`Assessment (Question ${currentQuestionIndex + 1} of ${totalQuestions})`}
        hideFooter
        handleSubmit={
          currentQuestionIndex === totalQuestions - 1
            ? handleQuestionSubmit
            : handleNextQuestion
        }
        buttonLabel={
          currentQuestionIndex === totalQuestions - 1
            ? "Submit Assessment"
            : "Next Question"
        }
        submitButtonDisabled={selectedOptions.length === 0}
        isActionButton={true}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    strokeWidth="4"
                    fill="none"
                    stroke="currentColor"
                    d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500"
                    strokeWidth="4"
                    strokeDasharray={`${((currentQuestionIndex + 1) / totalQuestions) * 100}, 100`}
                    fill="none"
                    strokeLinecap="round"
                    stroke="currentColor"
                    d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                  {currentQuestionIndex + 1}/{totalQuestions}
                </div>
              </div>
              <span className="text-xs text-blue-700 font-medium">Progress</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    strokeWidth="4"
                    fill="none"
                    stroke="currentColor"
                    d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`${timeLeft <= 10
                      ? 'text-red-500'
                      : timeLeft <= 30
                        ? 'text-orange-400'
                        : 'text-green-500'
                      }`}
                    strokeWidth="4"
                    strokeDasharray={`${(timeLeft / 60) * 100}, 100`}
                    fill="none"
                    strokeLinecap="round"
                    stroke="currentColor"
                    d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                  {timeLeft}s
                </div>
              </div>
              <span className="text-xs text-blue-700 font-medium">Timer</span>
            </div>


          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#000000E6]">
              {currentQuestion?.question}
            </h3>
            <p className="text-sm text-gray-500 italic">
              {currentQuestion?.question_type === 'multi_choice'
                ? 'Select all that apply'
                : 'Select one option'}
            </p>

            <div className="space-y-3">
              {currentQuestion?.options?.map((option, index) => {
                const isSelected = selectedOptions.includes(option);
                return (
                  <div
                    key={index}
                    className={`p-4 border rounded-xl cursor-pointer transition duration-300 ease-in-out 
                ${isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    onClick={() => {
                      if (currentQuestion.question_type === 'multi_choice') {
                        setSelectedOptions(prev =>
                          prev.includes(option)
                            ? prev.filter(item => item !== option)
                            : [...prev, option]
                        );
                      } else {
                        setSelectedOptions([option]);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <input
                        type={currentQuestion.question_type === 'multi_choice' ? 'checkbox' : 'radio'}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        readOnly
                      />
                      <label className="ml-3 block text-gray-700 text-sm font-medium">
                        {String.fromCharCode(65 + index)}. {option}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {timeLeft <= 10 && timeLeft > 0 && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg text-sm font-medium">
              ⚠️ Hurry up! Only {timeLeft} seconds left!
            </div>
          )}
        </div>
      </Modal>


      <Modal isOpen={isResultModal} title={`Result`} onClose={() => { setIsResultModal(false); setAssessmentData([]) }}
        isActionButton={false}>
        <div className="space-y-4 max-h-[40vh] overflow-hidden overflow-y-auto" >
          <div className="text-lg font-semibold">
            Total Questions: {modalState?.data?.total_questions}
          </div>
          <div className="text-lg font-semibold">
            Total Score: {modalState?.data?.total_score}
          </div>
          <div className={`text-lg font-semibold ${modalState?.data?.passed ? 'text-green-600' : 'text-red-600'}`}>
            {modalState?.data?.passed ? 'Status: Passed' : 'Status: Failed'}
          </div>
          {
            modalState?.data?.certificate_id && (
              <div>
                <Button onClick={() => handleViewCertificate(modalState?.data?.certificate_id)}>Certificate View</Button>
              </div>
            )
          }

          {modalState?.data?.answers?.map((answer, index) => (
            <div key={index} className="border p-3 rounded-md shadow-sm">
              <div className="font-medium text-base mb-1">
                Q{index + 1}: {answer.question}
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Type:</span> {answer.question_type}
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Options:</span>
                <ul className="list-disc ml-5">
                  {answer.options.map((opt, i) => (
                    <li key={i} className={answer.selected_options.includes(opt) ? 'font-semibold text-blue-600' : ''}>
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Selected:</span>{' '}
                {answer.selected_options.join(', ') || 'None'}
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Correct:</span>{' '}
                {answer.is_correct ? (
                  <span className="text-green-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-red-600 font-semibold">No</span>
                )}
              </div>
              <div className="text-sm">
                <span className="font-semibold">Score:</span> {answer.score}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={isOpen} title={`Verified Skills`} onClose={() => { setIsOpen(false); setIsOpenData(null) }}
        isActionButton={false}>
        <div className='space-y-2'>
          <SkillsCard2 skills={isOpenData || []} />
        </div>
      </Modal>

    </>
  )
}

export default Verification