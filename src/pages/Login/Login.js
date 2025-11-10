/* eslint-disable react-hooks/exhaustive-deps */
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import OrbitalMenu from "./LoginSide";
import useFormHandler from "../../components/hooks/useFormHandler";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {
  fetchLoginCredentials,
  login,
  registerWithGoogle,
} from "../../redux/slices/authSlice";
import { setCookie } from "../../components/utils/cookieHandler";
import { useEffect, useState, useRef, useCallback } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import CustomInput from "../../components/ui/Input/CustomInput";
import { FaLinkedinIn } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Form from "../../components/ui/Form/Form";
import Button from "../../components/ui/Button/Button";
import { apiUrl } from "../../components/hooks/axiosProvider";

const loginEvents = [
  "email_not_found",
  "unverified_email",
  "disabled_user",
  "login_success",
  "new_comer",
  "server_error",
];

const Login = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { formData, errors, setErrors, handleChange } = useFormHandler({
    userName: "",
    password: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const redirectUrl = searchParams.get("redirect") || "/user/feed"; // fallback

  const userNameRef = useRef(null); // Ref for auto-focus
  const [googleLoginObject, setGoogleLoginObject] = useState({
    event: null,
    passkey: null,
    message: null,
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
      offset: 50,
    });
    const remembered = localStorage.getItem("rememberedUser");
    if (remembered) {
      const parsed = JSON.parse(remembered);
      handleChange("userName", { target: { value: parsed.userName } });
      handleChange("password", { target: { value: parsed.password } });
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (userNameRef.current) {
      userNameRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.password) {
      setErrors({
        userName: !formData.userName ? "User ID is required" : "",
        password: !formData.password ? "Password is required" : "",
      });
      toast.error("Please fill all fields");
      return;
    }
    try {
      setIsLoading(true);
      if (rememberMe) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({
            userName: formData.userName,
            password: formData.password,
          })
        );
      } else {
        localStorage.removeItem("rememberedUser");
      }
      const res = await dispatch(
        login({
          username_email: formData?.userName,
          password: formData?.password,
        })
      ).unwrap();

      if (res) {
        setCookie("VERIFIED_TOKEN", JSON.stringify(res?.data?.token));
        setCookie("ACCESS_MODE", res?.data?.user?.accessMode);
        setCookie("ACTIVE_MODE", "User");
        toast.success(res?.message || "Login successful");
        // navigate("/user/feed");
        navigate(redirectUrl, { replace: true });
      }
    } catch (error) {
      // console.log(error);
      toast.error(error?.message || "Invalid credentials or server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}user/auth/google-login`;
  };

  // useEffect(() => {
  //   const handleGoogleLogin = async () => {
  //     const event = searchParams.get('event');
  //     const passkey = searchParams.get('passkey');
  //     const message = searchParams.get('message');

  //     if (event) {
  //       setGoogleLoginObject({ event, passkey, message });

  //       if (event === 'login_success') {
  //         try {
  //           const response = await dispatch(
  //             fetchLoginCredentials({ redisToken: passkey })
  //           ).unwrap();

  //           if (!response.error) {
  //             setCookie("VERIFIED_TOKEN", JSON.stringify(response?.data?.token));
  //             setCookie("ACCESS_MODE", response?.data?.user?.accessMode);
  //             toast.success(message || "Login successful");
  //             navigate("/user/feed");
  //           } else {
  //             toast.error(response?.message || "Please try again later.");
  //             navigate("/");
  //           }
  //         } catch (error) {
  //           console.error("Error:", error);
  //           toast.error(error);
  //           navigate("/");
  //         }
  //       }
  //     }
  //   };

  //   handleGoogleLogin();
  // }, [searchParams, dispatch, navigate]);
  useEffect(() => {
    const event = searchParams.get("event");
    const passkey = searchParams.get("passkey");
    const message = searchParams.get("message");

    if (!event) return; // no google redirect -> skip

    setGoogleLoginObject({ event, passkey, message });

    const handleLogin = async () => {
      try {
        if (event === "login_success" && passkey) {
          const response = await dispatch(
            fetchLoginCredentials({ redisToken: passkey })
          ).unwrap();

          if (response?.data?.token) {
            setCookie("VERIFIED_TOKEN", JSON.stringify(response?.data?.token));
            setCookie("ACCESS_MODE", response?.data?.user?.accessMode);
            toast.success("Login successful 🎉");
            // navigate("/user/feed");
            navigate(redirectUrl, { replace: true });
          } else {
            toast.error(response?.message || "Something went wrong.");
            navigate("/login");
          }
        }

        if (event === "new_comer") {
          toast.info("Complete your signup to continue 🚀");
        }

        if (event === "server_error") {
          toast.error("Server error occurred. Please try again.");
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error during Google login.");
        navigate("/login");
      }
    };

    handleLogin();
  }, [searchParams]);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.username?.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, setErrors]);

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!validate()) {
      toast.error("Please fill all fields");
      return;
    }
    setIsLoading(true);
    try {
      const response = await dispatch(
        registerWithGoogle({
          redisToken: googleLoginObject.passkey,
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })
      ).unwrap();

      if (!response.error) {
        toast.success(response.message || "Login successful");
        setCookie("VERIFIED_TOKEN", JSON.stringify(response?.data?.token));
        setCookie("ACCESS_MODE", response?.data?.user?.accessMode);
        // if (!response?.data?.user?.first_education_added) {
        //   navigate("/education-details");
        // } else if (!response?.data?.user?.first_experience_added) {
        //   navigate("/experience-details");
        // } else {
          // navigate(`/user/feed`);
          navigate(redirectUrl, { replace: true });
        // }
      } else {
        toast.error(response?.message || "Please try again later.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (!googleLoginObject.event) {
        handleSubmit(e);
      } else {
        handleGoogleSubmit(e);
      }
    }
  };

  return (
    <div className=" ">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* <div
          className="p-5 h-screen md:block hidden"
          // data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-easing="ease-out-quart"
        >
          <div className="md:block hidden">
            <OrbitalMenu />
          </div> */}
        <div
          className="hidden md:block w-full h-screen"
          data-aos-duration="1000"
          data-aos-easing="ease-out-quart"
        >
          <img
            src="/Login-img.png"
            alt="Login illustration"
            className="w-full h-full object-cover"
          />

        </div>

        <div
          className="flex items-center justify-center h-screen  "
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-easing="ease-out-quart"
        >
          {googleLoginObject.event !== "new_comer" ? (
            <>
              <Form
                onSubmit={handleSubmit}
                className="w-full max-w-md px-4 sm:px-0"
              >
                <div
                  className="leading-relaxed break-words break-all  tracking-wider"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <h1 className="lg:text-4xl md:text-2xl text-xl font-semibold text-center pt-5 pb-2 instrument-sans glassy-text-primary">
                    Head Start Your CAREER
                  </h1>

                  <p className="glassy-text-primary text-base text-center pb-10 font-normal transition-colors duration-300 hover:text-[#444]">
                    Login with open account
                  </p>

                  <div className="flex justify-center items-center gap-3">
                    {/* <button
                      disabled
                      className="glassy-card border border-[#EDEDED] w-24 h-14 flex justify-center items-center rounded-[10px] transition-all duration-300
                     hover:shadow-lg hover:border-[#0077B5]/30 hover:scale-105 cursor-pointer"
                      style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" }}
                      data-aos="zoom-in"
                      data-aos-delay="150"
                    >
                      <FaLinkedinIn className="text-[#0077B5] w-6 h-6 transition-transform duration-300 hover:scale-110" />
                    </button> */}
                    <button
                      className="glassy-card border border-[#EDEDED] w-24 h-14 flex justify-center items-center rounded-[10px] transition-all duration-300 
                    hover:shadow-lg hover:scale-105 hover:border-[#0077B5]/30"
                      style={{ boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" }}
                      data-aos="zoom-in"
                      data-aos-delay="200"
                      onClick={() => handleGoogleLogin()}
                    >
                      <FcGoogle className="w-6 h-6 transition-transform duration-300 hover:scale-110" />
                    </button>
                  </div>

                  <div className="flex items-center w-full my-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-[#64646433] via-[#646464] to-[#64646433]"></div>
                    <span className="mx-2 glassy-text-primary text-base font-medium transition-colors duration-300 hover:text-[#444]">
                      Or
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#64646433] via-[#646464] to-[#64646433]"></div>
                  </div>
                </div>

                {[
                  "email_not_found",
                  "unverified_email",
                  "disabled_user",
                  "server_error",
                ].includes(googleLoginObject.event) && (
                    <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg shadow-sm mt-4">
                      {/* Warning symbol icon */}
                      <span role="img" aria-label="warning" className="text-2xl">
                        ⚠️
                      </span>
                      {/* The message from the Google login object */}
                      <p className="text-base glassy-text-primary font-medium">
                        {googleLoginObject.message}
                      </p>
                    </div>
                  )}

                <div data-aos="fade-up" data-aos-delay="200">
                  <CustomInput
                    ref={userNameRef} // Add ref for auto-focus
                    label="Email/UserId"
                    name="userName"
                    placeholder="Enter your Username"
                    value={formData?.userName}
                    onChange={(e) => handleChange("userName", e)}
                    error={errors.userName}
                    maxLength={50}
                    autoComplete="off"
                    className="transition-all duration-300 w-full h-11 focus-within:ring-2 focus-within:ring-blue-500/50"
                    onKeyPress={handleKeyPress} // Add key press handler
                  />
                </div>

                <div data-aos="fade-up" data-aos-delay="250">
                  <CustomInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter Your Password"
                    value={formData?.password}
                    onChange={(e) => handleChange("password", e)}
                    error={errors.password}
                    maxLength={50}
                    autoComplete="off"
                    className="transition-all w-full h-11 duration-300 focus-within:ring-2 focus-within:ring-blue-500/50"
                    onKeyPress={handleKeyPress} // Add key press handler
                  />
                </div>

                <div
                  className="flex justify-between mt-4"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <CustomInput
                    type="checkbox"
                    label="Remember me"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                  <Link
                    // to={"/forgot-password"}
                    to={`/forgot-password?redirect=${encodeURIComponent(
                      redirectUrl
                    )}`}
                    className="flex justify-end font-medium text-sm text-[#2563EB] hover:text-[#1d4ed8] transition-colors duration-300 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div
                  className="w-full flex justify-center items-center mt-6"
                  data-aos="fade-up"
                  data-aos-delay="350"
                >
                  <Button
                    type="submit"
                    className="w-40 transition-transform duration-300 hover:scale-[1.02] active:scale-100"
                    loading={isLoading}
                    onClick={handleSubmit}
                  >
                    Log In
                  </Button>
                </div>

                <div className="text-center">
                  <span className="glassy-text-primary text-base font-normal">
                    Don't have an account?
                  </span>{" "}
                  <span className="glassy-text-primary text-base font-medium hover:underline hover:cursor-pointer transition-all ease-out">
                    {/* <Link to="/create-account">Create account</Link> */}
                    <Link
                      to={`/create-account?redirect=${encodeURIComponent(
                        redirectUrl
                      )}`}
                    >
                      Create account
                    </Link>
                  </span>
                </div>
                {/* <div className="flex justify-center gap-4 items-center text-sm font-medium text-blue-600">
                <h2
                  className="hover:underline cursor-pointer"
                  onClick={() => window.open('https://dev-verified-admin.jamsara.com/companies/login', '_blank')}
                >
                  Log in Company
                </h2>
                |
                <h3
                  className="hover:underline cursor-pointer"
                  onClick={() => window.open('https://dev-verified-admin.jamsara.com/institute/login', '_blank')}
                >
                  Log in Institute
                </h3>
              </div> */}
              </Form>
            </>
          ) : (
            <>
              <Form
                onSubmit={handleGoogleSubmit}
                className="w-full max-w-md px-4 sm:px-0"
              >
                <div
                  className="leading-relaxed break-words break-all  tracking-wider"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <h1 className="lg:text-4xl md:text-2xl text-xl font-semibold text-center pt-5 pb-2 instrument-sans">
                    Head Start Your CAREER
                  </h1>

                  <p className="glassy-text-primary text-sm text-center pb-10 font-normal transition-colors duration-300 hover:text-[#444] flex items-center justify-center max-w-md">
                    {googleLoginObject.message}
                  </p>
                </div>

                <div data-aos="fade-up" data-aos-delay="200">
                  <CustomInput
                    ref={userNameRef}
                    label="User Id"
                    name="username"
                    placeholder="Enter your Username"
                    value={formData?.username}
                    onChange={(e) => handleChange("username", e)}
                    error={errors.username}
                    maxLength={50}
                    autoComplete="off"
                    className="transition-all duration-300 w-full h-11 focus-within:ring-2 focus-within:ring-blue-500/50"
                    onKeyPress={handleKeyPress}
                    required={true}
                  />
                </div>

                <div data-aos="fade-up" data-aos-delay="250">
                  <CustomInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter Your Password"
                    value={formData?.password}
                    onChange={(e) => handleChange("password", e)}
                    error={errors.password}
                    maxLength={50}
                    autoComplete="off"
                    className="transition-all w-full h-11 duration-300 focus-within:ring-2 focus-within:ring-blue-500/50"
                    onKeyPress={handleKeyPress}
                    required={true}
                  />
                </div>
                <div data-aos="fade-up" data-aos-delay="250">
                  <CustomInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Enter Your Confirm Password"
                    value={formData?.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e)}
                    error={errors.confirmPassword}
                    maxLength={50}
                    autoComplete="off"
                    className="transition-all w-full h-11 duration-300 focus-within:ring-2 focus-within:ring-blue-500/50"
                    onKeyPress={handleKeyPress}
                    required={true}
                  />
                </div>

                <div
                  className="w-full  flex justify-center items-center mt-6"
                  data-aos="fade-up"
                  data-aos-delay="350"
                >
                  <Button
                    type="submit"
                    className="w-full transition-transform duration-300 hover:scale-[1.02] active:scale-100"
                    loading={isLoading}
                    onClick={handleGoogleSubmit}
                  >
                    Submit
                  </Button>
                </div>

                <div className="text-center">
                  <span className="glassy-text-primary text-base font-normal">
                    Don't have an account?
                  </span>{" "}
                  <span className="glassy-text-primary text-base font-medium hover:underline hover:cursor-pointer transition-all ease-out">
                    <Link to="/create-account">Create account</Link>
                  </span>
                </div>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
