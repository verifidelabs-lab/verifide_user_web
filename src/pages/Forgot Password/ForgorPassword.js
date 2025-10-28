import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import useFormHandler from "../../components/hooks/useFormHandler";
import CustomInput from "../../components/ui/Input/CustomInput";
import Button from "../../components/ui/Button/Button";
import PasswordInput from "../../components/ui/Input/PasswordInput";
import TeamCard from "../../components/ui/cards/TeamCard";
import {
  forgotPassword,
  resetPassword,
  verifyPassword,
} from "../../redux/slices/authSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formData, setFormData, errors, setErrors, handleChange } =
    useFormHandler({
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
      token: "",
    });

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const formRef = useRef(null);
  const otpInputRefs = useRef([]);

  // Custom animation handler
  useEffect(() => {
    const animateForm = async () => {
      if (formRef.current) {
        setIsAnimating(true);
        formRef.current.style.opacity = "0";
        formRef.current.style.transform = "translateX(20px)";

        await new Promise((resolve) => setTimeout(resolve, 150));

        formRef.current.style.transition =
          "opacity 0.3s ease-out, transform 0.3s ease-out";
        formRef.current.style.opacity = "1";
        formRef.current.style.transform = "translateX(0)";

        setTimeout(() => {
          setIsAnimating(false);
          formRef.current.style.transition = "";
        }, 300);
      }
    };

    animateForm();
  }, [step]);

  const validateEmail = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validateOTP = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.otp) {
      newErrors.otp = "OTP is required";
      valid = false;
    } else if (formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validatePassword = () => {
    let valid = true;
    const newErrors = {};

    const password = formData.password;

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
      valid = false;
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
      valid = false;
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number";
      valid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character";
      valid = false;
    }
    if (password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setIsLoading(true);
    try {
      const res = await dispatch(
        forgotPassword({ email: formData.email })
      ).unwrap();
      toast.success(res?.message);
      setFormData((prev) => ({ ...prev, token: res?.data?.redisToken }));
      setStep(2);
    } catch (error) {
      toast.error(error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    if (!validateOTP()) return;

    setIsLoading(true);

    try {
      const response = await dispatch(
        verifyPassword({
          redisToken: formData?.token,
          otp: formData.otp,
        })
      ).unwrap();
      toast.success(response?.message);
      // console.log(response?.data?.redisToken)
      setFormData((prev) => ({ ...prev, token: response?.data?.redisToken }));
      setStep(3);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsLoading(true);

    try {
      const response = await dispatch(
        resetPassword({
          redisToken: formData.token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })
      ).unwrap();
      toast.success(response?.message);
      navigate("/login");
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return;

    const otpArray = formData.otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("").slice(0, 6);

    setFormData((prev) => ({ ...prev, otp: newOtp }));

    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !formData.otp[index] &&
      index > 0 &&
      otpInputRefs.current[index - 1]
    ) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text/plain")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pasteData.length === 6) {
      setFormData((prev) => ({ ...prev, otp: pasteData }));
      if (otpInputRefs.current[5]) {
        otpInputRefs.current[5].focus();
      }
    }
  };

  const teamMembers = [
    {
      name: "Evelyn Brightwood",
      role: "Quality Assurance Specialist",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      position:
        "top-8 left-[40%] sm:top-16 sm:left-[40%] md:top-32 md:left-[40%] transform -translate-x-1/2",
    },
    {
      name: "Jasper Holloway",
      role: "Quality Improvement Manager",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      position: "top-12 right-8 sm:top-20 sm:right-20 md:top-40 md:right-40",
    },
    {
      name: "Sophie Nightingale",
      role: "Patient Rights Advocate",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      position:
        "top-[30%] left-4 sm:top-[32%] sm:left-12 md:top-[38%] md:left-28",
    },
    {
      name: "Clara Windermere",
      role: "Product Quality Supervisor",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      position: "top-[35%] left-1/2 transform -translate-x-1/2",
    },
    {
      name: "Fella Ravenswood",
      role: "Product Quality Engineer",
      image:
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face",
      position:
        "top-[50%] right-6 sm:top-[55%] sm:right-16 md:top-[60%] md:right-24",
    },
    {
      name: "Maximilian Thorne",
      role: "Quality Control Inspector",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      position:
        "bottom-8 left-8 sm:bottom-16 sm:left-20 md:bottom-32 md:left-36",
    },
  ];

  const renderStepOne = () => (
    <div className="w-full flex items-center justify-center p-4 sm:p-6">
      <div
        ref={formRef}
        className="w-full max-w-sm sm:max-w-md border-[0.5px] glassy-card border-gray-200 shadow-sm rounded-xl p-6 sm:p-8"
        style={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
        }}
      >
        <div className="text-center mb-6">
          <img
            src="/headerlogo-D3k-kYIk 2.png"
            alt="logo"
            className="mx-auto w-40 h-8 sm:w-48 sm:h-10 my-2"
          />
          <p className="text-gray-600 text-sm sm:text-base">
            Learn More. Earn More
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold glassy-text-primary py-3">
            Forgot Password
          </h1>
          <p className="glassy-text-secondary text-sm sm:text-base mb-4">
            Enter your email to receive a verification code
          </p>
        </div>
        <form onSubmit={handleSubmitEmail} className="space-y-6">
          <CustomInput
            type="email"
            name="email"
            placeholder="Enter your Email"
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e)}
            error={errors.email}
            className="w-full h-10 border rounded-md p-2"
            required
            autoFocus
          />
          <div className="flex justify-center items-center">
            <Button
              type="submit"
              className="w-full py-2.5 sm:py-3"
              disabled={isLoading || isAnimating}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
          <div className="text-center pt-2">
            <span className="glassy-text-secondary text-sm sm:text-base">
              Back to?{" "}
            </span>
            <Link
              to="/login"
              className="text-blue-600 text-sm sm:text-base font-medium hover:underline transition-colors"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="w-full flex items-center justify-center p-4 sm:p-6">
      <div
        ref={formRef}
        className="w-full max-w-sm sm:max-w-md border-[0.5px] glassy-card border-gray-200 shadow-sm rounded-xl p-6 sm:p-8"
        style={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
        }}
      >
        <div className="text-center mb-6">
          <img
            src="/headerlogo-D3k-kYIk 2.png"
            alt="logo"
            className="mx-auto w-40 h-8 sm:w-48 sm:h-10 my-2"
          />
          <p className="text-gray-600 text-sm sm:text-base">
            Learn More. Earn More
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold glassy-text-primary py-3">
            Verify OTP
          </h1>
          <p className="glassy-text-secondary text-sm sm:text-base mb-4">
            We've sent a 6-digit code to {formData.email}
          </p>
        </div>
        <form onSubmit={handleSubmitOTP} className="space-y-6">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
              Verification Code
            </label>
            <div className="flex justify-between space-x-2 sm:space-x-3">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={formData.otp[index] || ""}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  onPaste={handleOtpPaste}
                  className="w-full h-12 sm:h-14 text-center text-lg sm:text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="mt-2 text-sm text-red-600">{errors.otp}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-2.5 sm:py-3"
            disabled={isLoading || isAnimating}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
          <div className="text-center pt-1">
            <span className="glassy-text-secondary text-sm sm:text-base">
              Didn't receive code?{" "}
            </span>
            <button
              type="button"
              className="text-blue-600 text-sm sm:text-base font-medium hover:underline transition-colors"
              onClick={handleSubmitEmail}
              disabled={isLoading}
            >
              Resend
            </button>
          </div>
          <div className="text-center pt-1">
            <span className="glassy-text-secondary text-sm sm:text-base">
              Back to?{" "}
            </span>
            <Link
              to="/login"
              className="text-blue-600 text-sm sm:text-base font-medium hover:underline transition-colors"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="w-full flex items-center justify-center p-4 sm:p-6">
      <div
        ref={formRef}
        className="w-full max-w-sm sm:max-w-md border-[0.5px] glassy-card border-gray-200 md:shadow-sm shadow-none rounded-xl p-6 sm:p-8"
        style={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
        }}
      >
        <div className="text-center mb-6">
          <img
            src="/headerlogo-D3k-kYIk 2.png"
            alt="logo"
            className="mx-auto w-40 h-8 sm:w-48 sm:h-10 my-2"
          />
          <p className="text-gray-600 text-sm sm:text-base">
            Learn More. Earn More
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold glassy-text-primary py-3">
            Reset Password
          </h1>
          <p className="glassy-text-secondary text-sm sm:text-base mb-4">
            Create a new password for your account
          </p>
        </div>

        <form
          onSubmit={handleSubmitPassword}
          className="flex flex-col gap-10 space-y-3"
        >
          <PasswordInput
            type="password"
            name="password"
            placeholder="Enter New Password"
            label="New Password"
            value={formData.password}
            onChange={(e) => handleChange("password", e)}
            error={errors.password}
            className="w-full h-11 sm:h-12"
          />

          <PasswordInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e)}
            error={errors.confirmPassword}
            className="w-full h-11 sm:h-12"
          />

          <div className="text-xs sm:text-sm glassy-text-secondary bg-gray-50 p-3 rounded-lg mt-5">
            <p className="font-medium mb-1">Password must contain:</p>
            <ul className="grid grid-cols-2 gap-1">
              <li
                className={`flex items-center ${
                  formData.password.length >= 8 ? "text-green-600" : ""
                }`}
              >
                <span className="mr-1">•</span> 8+ characters
              </li>
              <li
                className={`flex items-center ${
                  /[a-z]/.test(formData.password) ? "text-green-600" : ""
                }`}
              >
                <span className="mr-1">•</span> Lowercase letter
              </li>
              <li
                className={`flex items-center ${
                  /[A-Z]/.test(formData.password) ? "text-green-600" : ""
                }`}
              >
                <span className="mr-1">•</span> Uppercase letter
              </li>
              <li
                className={`flex items-center ${
                  /[0-9]/.test(formData.password) ? "text-green-600" : ""
                }`}
              >
                <span className="mr-1">•</span> Number
              </li>
              <li
                className={`flex items-center ${
                  /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                    ? "text-green-600"
                    : ""
                }`}
              >
                <span className="mr-1">•</span> Special character
              </li>
              <li
                className={`flex items-center ${
                  formData.password &&
                  formData.password === formData.confirmPassword
                    ? "text-green-600"
                    : ""
                }`}
              >
                <span className="mr-1">•</span> Passwords match
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isAnimating}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>

          <div className="text-center pt-2">
            <span className="glassy-text-secondary text-sm sm:text-base">
              Back to?{" "}
            </span>
            <Link
              to="/login"
              className="text-blue-600 text-sm sm:text-base font-medium hover:underline transition-colors"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="gradient-background h-full relative hidden lg:block overflow-hidden">
          {step === 2 && (
            <div className="h-full relative">
              {teamMembers.map((member, index) => (
                <TeamCard
                  key={index}
                  name={member.name}
                  role={member.role}
                  image={member.image}
                  position={member.position}
                />
              ))}

              {/* Animated decorative elements */}
              <div className="absolute top-1/4 right-1/4 w-32 h-32 glassy-card bg-opacity-10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-1/3 left-1/4 w-24 h-24 glassy-card bg-opacity-5 rounded-full blur-lg animate-pulse delay-300"></div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center p-0 sm:p-4 lg:p-8 transition-all duration-300">
          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderStepThree()}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
