import React, { useEffect, useRef, useState, useCallback } from "react";
import CustomInput from "../../components/ui/Input/CustomInput";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedinIn } from "react-icons/fa";
import useFormHandler from "../../components/hooks/useFormHandler";
import Button from "../../components/ui/Button/Button";
import Aos from "aos";
import CourseCard from "../../components/ui/cards/CourseCard";
import { useDispatch } from "react-redux";
import { register, verifyRegisterOtp } from "../../redux/slices/authSlice";
import { toast } from "sonner";
import {
  getCookie,
  setCookie,
  removeCookie,
} from "../../components/utils/cookieHandler";
import { apiUrl } from "../../components/hooks/axiosProvider";

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/user/feed"; // fallback

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOtpState, setIsOtpState] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [remainingTime, setRemainingTime] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpError, setOtpError] = useState("");
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  // Initialize AOS
  useEffect(() => {
    Aos.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
      offset: 50,
    });
  }, []);

  const { formData, handleChange, errors, setErrors } = useFormHandler({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    if (isOtpState && remainingTime > 0 && isResendDisabled) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOtpState, remainingTime, isResendDisabled]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // if (!formData.username?.trim()) {
    //     newErrors.username = 'Username is required'
    // } else if (formData.username.trim().length < 3) {
    //     newErrors.username = 'Username must be at least 3 characters long'
    // } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
    //     newErrors.username = 'Username can only contain letters, numbers, and underscores'
    // }
    if (!formData.username?.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    } else if (
      !/^(?!.*\.\..*)(?!.*\..*\..*)[a-zA-Z0-9_.]+$/.test(
        formData.username.trim()
      )
    ) {
      newErrors.username =
        "Username can only contain letters, numbers, underscores, and at most one dot (.)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // First name validation
    if (!formData.first_name?.trim()) {
      newErrors.first_name = "First name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.first_name.trim())) {
      newErrors.first_name = "First name can only contain letters and spaces";
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = "First name must be at least 2 characters long";
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = "Last name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.last_name.trim())) {
      newErrors.last_name = "Last name can only contain letters and spaces";
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = "Last name must be at least 2 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, setErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validate()) {
      // toast.error('Please fix the errors in the form')
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedData = {
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      };

      const res = await dispatch(register(sanitizedData)).unwrap();

      if (res?.data?.redisToken) {
        setCookie("register_token", res.data.redisToken, { expires: 1 });
        toast.success(
          res?.message || "Registration successful! Please verify your email."
        );
        setIsOtpState(true);
        setRemainingTime(120);
        setIsResendDisabled(true);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateOtp = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setOtpError("Please enter the complete 6-digit code");
      return false;
    }
    if (!/^\d{6}$/.test(otpValue)) {
      setOtpError("OTP must contain only numbers");
      return false;
    }
    setOtpError("");
    return true;
  };

  const handleOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    if (!validateOtp()) {
      return;
    }
    setIsSubmitting(true);
    setOtpError("");

    try {
      const redisToken = getCookie("register_token");

      const otpValue = otp.join("");
      const res = await dispatch(
        verifyRegisterOtp({
          redisToken: redisToken,
          otp: otpValue,
        })
      ).unwrap();

      toast.success(res?.message || "Email verified successfully!");
      // if (!res?.data?.user?.first_education_added) {
      //   navigate("/education-details");
      // } else if (!res?.data?.user?.first_experience_added) {
      //   navigate("/experience-details");
      // } else {
      //   navigate(redirectUrl);
      // }
      if (!res?.data?.user?.first_education_added) {
        navigate(
          `/education-details?redirect=${encodeURIComponent(redirectUrl)}`
        );
      } else if (!res?.data?.user?.first_experience_added) {
        navigate(
          `/experience-details?redirect=${encodeURIComponent(redirectUrl)}`
        );
      } else {
        navigate(redirectUrl);
      }

      removeCookie("register_token");
      setCookie("VERIFIED_TOKEN", JSON.stringify(res?.data?.token));
      setCookie("ACCESS_MODE", JSON.stringify(res?.data?.user?.accessMode));
    } catch (error) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").trim();
    const pasteNumbers = pasteData.replace(/\D/g, "").slice(0, 6);

    if (pasteNumbers.length === 6) {
      const newOtp = Array(6).fill("");
      pasteNumbers.split("").forEach((num, i) => {
        newOtp[i] = num;
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = num;
        }
      });
      setOtp(newOtp);
      setOtpError("");

      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }

      setTimeout(() => {
        handleOtpSubmit();
      }, 100);
    } else {
      toast.error("Please paste a valid 6-digit code");
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (value && isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value && newOtp.every((digit) => digit !== "")) {
      setTimeout(() => {
        handleOtpSubmit();
      }, 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (isSubmitting || isResendDisabled) return;
    setIsSubmitting(true);
    setOtpError("");

    try {
      const sanitizedData = {
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      };
      const res = await dispatch(register(sanitizedData)).unwrap();
      if (res?.data?.redisToken) {
        setCookie("register_token", res.data.redisToken, { expires: 1 });
        toast.success(res?.message || "Verification code sent successfully!");
        setRemainingTime(120);
        setIsResendDisabled(true);
        setOtp(Array(6).fill(""));
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (error) {
      toast.error(
        error?.message ||
          error ||
          "Failed to resend verification code. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleBackToRegistration = () => {
    setIsOtpState(false);
    setOtp(Array(6).fill(""));
    setOtpError("");
    removeCookie("register_token");
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
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

  const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}user/auth/google-login`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <div className="md:block hidden">
          <div className="gradient-background flex gap-x-10 items-center justify-center ">
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
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div
            className="w-full max-w-lg border-[0.5px] bg-[#FFFFFF] border-[#A9A9A9]/50 shadow-sm rounded-[10px] p-4"
            data-aos="fade-left"
          >
            <div className="text-center mb-4">
              <img
                src="/headerlogo-D3k-kYIk 2.png"
                alt="logo"
                className="mx-auto max-w-56 h-10 my-2"
              />
              <p className="text-[#000000] text-base font-normal">
                Learn More. Earn More
              </p>
              <h1 className="text-3xl font-semibold text-[#000000] py-3">
                {isOtpState ? "Verify Your Email" : "Create Account"}
              </h1>

              {!isOtpState && (
                <>
                  <p className="text-[#646464] text-base font-normal mb-3">
                    login with others
                  </p>

                  <div className="flex justify-center items-center gap-3">
                    {/* <button
                                            type="button"
                                            className="bg-white border border-[#EDEDED] w-24 h-14 flex justify-center items-center rounded-[10px] transition-all duration-300 hover:shadow-lg hover:border-[#0077B5]/30 hover:scale-105"
                                            style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}
                                            data-aos="zoom-in"
                                            data-aos-delay="150"
                                            disabled={isSubmitting}
                                        >
                                            <FaLinkedinIn className="text-[#0077B5] w-6 h-6 transition-transform duration-300 hover:scale-110" />
                                        </button> */}
                    <button
                      type="button"
                      className="bg-white border border-[#EDEDED] w-24 h-14 flex justify-center items-center rounded-[10px] transition-all duration-300 hover:shadow-lg hover:scale-105"
                      style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" }}
                      data-aos="zoom-in"
                      data-aos-delay="200"
                      disabled={isSubmitting}
                      onClick={() => handleGoogleLogin()}
                    >
                      <FcGoogle className="w-6 h-6 transition-transform duration-300 hover:scale-110" />
                    </button>
                  </div>

                  <div className="flex items-center w-full my-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-[#64646433] via-[#646464] to-[#64646433]"></div>
                    <span className="mx-2 text-[#646464] text-base font-medium transition-colors duration-300 hover:text-[#444]">
                      Or
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#64646433] via-[#646464] to-[#64646433]"></div>
                  </div>
                </>
              )}
            </div>

            {isOtpState ? (
              <div>
                <div className="text-center mb-6">
                  <p className="text-[#646464] text-sm mb-4">
                    We've sent a 6-digit verification code to
                  </p>
                  <p className="text-[#000000] font-medium mb-4">
                    {formData.email}
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit}>
                  <div
                    className="flex justify-center mb-4"
                    onPaste={handlePaste}
                  >
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
                        disabled={isSubmitting}
                        className={`w-12 h-12 mx-1 text-center text-xl bg-[#FFFFFF] border-2 rounded-lg focus:ring-2 focus:ring-blue-300/30 outline-none transition-all duration-200 ${
                          otpError
                            ? "border-red-500 focus:border-red-500"
                            : "border-blue-500 focus:border-purple-300"
                        } ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex justify-center items-center">
                    <Button
                      variant="zinc"
                      type="submit"
                      className="w-full mb-4"
                      disabled={
                        isSubmitting || otp.some((digit) => digit === "")
                      }
                    >
                      {isSubmitting ? "Verifying..." : "Verify Email"}
                    </Button>
                  </div>

                  <div className="text-center mb-4">
                    <p className="text-gray-500 text-sm">
                      Didn't receive the code?{" "}
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResendDisabled || isSubmitting}
                        className={`font-medium ${
                          isResendDisabled || isSubmitting
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-purple-600 hover:text-purple-800"
                        }`}
                      >
                        {isSubmitting ? "Sending..." : "Resend"}
                        {isResendDisabled &&
                          remainingTime > 0 &&
                          ` (${formatTime(remainingTime)})`}
                      </button>
                    </p>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleBackToRegistration}
                      disabled={isSubmitting}
                      className="text-lg text-gray-600 hover:text-gray-800 disabled:opacity-50 font-semibold"
                    >
                      ← Back to registration
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <CustomInput
                  label="First Name"
                  name="first_name"
                  placeholder="John"
                  value={formData?.first_name}
                  onChange={(e) => handleChange("first_name", e)}
                  error={errors.first_name}
                  autoComplete="given-name"
                  className="w-full h-10"
                  disabled={isSubmitting}
                />

                <CustomInput
                  label="Last Name"
                  name="last_name"
                  placeholder="Doe"
                  value={formData?.last_name}
                  onChange={(e) => handleChange("last_name", e)}
                  error={errors.last_name}
                  autoComplete="family-name"
                  className="w-full h-10"
                  disabled={isSubmitting}
                />

                <CustomInput
                  label="User Name"
                  name="username"
                  placeholder="johndoe123"
                  value={formData?.username}
                  onChange={(e) => handleChange("username", e)}
                  error={errors.username}
                  autoComplete="username"
                  className="w-full h-10"
                  disabled={isSubmitting}
                />

                <CustomInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData?.email}
                  onChange={(e) => handleChange("email", e)}
                  error={errors.email}
                  autoComplete="email"
                  className="w-full h-10"
                  disabled={isSubmitting}
                />

                <div className="flex justify-between place-items-center gap-4">
                  <CustomInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="*********"
                    value={formData?.password}
                    onChange={(e) => handleChange("password", e)}
                    error={errors.password}
                    autoComplete="new-password"
                    className="w-full h-10"
                    disabled={isSubmitting}
                  />
                  <CustomInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="*********"
                    value={formData?.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e)}
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                    className="w-full h-10"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="w-full flex justify-center item-center ">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center text-base text-[#646464]">
              Already have an account?{" "}
              <Link
                // to="/login"
                to={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
                className="font-medium text-[#000000] hover:text-blue-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
