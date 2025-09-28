import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { adminLogin, companyLogin, instituteLogin } from "../../../redux/CompanySlices/CompanyAuth";
import { useEffect, useState } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Form from "../../../components/ui/InputAdmin/Form/Form";
import CustomInput from "../../../components/ui/InputAdmin/CustomInput";
import PasswordInput from "../../../components/ui/InputAdmin/PasswordInput";
import Button from "../../../components/ui/Button/Button";
import useFormHandler from "../../../components/hooks/useFormHandler";
import { getCookie, setCookie } from "../../../components/utils/cookieHandler";


const CompanyLogin = ({ role = "admin" }) => {
  const dispatch = useDispatch()

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillEmail = searchParams.get("email") || "";
  const { formData, errors, setErrors, handleChange } = useFormHandler({
    username: prefillEmail,  // Prefill here
    password: "",
  });
  const path = location.pathname.toLowerCase();

  const showInstitute = path.includes('/institute');
  const showCompany = path.includes('/companies');
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);


  const getLoginAction = () => {
    switch (role) {
      case "admin":
        return adminLogin;
      case "company":
        return companyLogin;
      case "institute":
        return instituteLogin;
      default:
        return adminLogin;
    }
  };

  const getDashboardPath = (mode) => {
    switch (mode) {
      case 1:
      case 2:
        return "/admin/dashboard";
      case 3:
      case 7:
        return "/company";
      case 4:
      case 8:
        return "/institute/dashboard";
      default:
        return "/admin/dashboard";
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.username || !formData.password) {
    setErrors({
      username: !formData.username ? "User ID is required" : "",
      password: !formData.password ? "Password is required" : "",
    });
    toast.error("Please fill all fields");
    return;
  }
  try {
    // Ensure user is logged in before company login
    const userToken = getCookie("VERIFIED_TOKEN");
    if (!userToken) {
      toast.error("Please login as a user first");
      return navigate("/login");
    }

    setIsLoading(true);
    const loginAction = getLoginAction();
    const payload = {
      username_email: formData.username,
      password: formData.password,
    };

    const res = await dispatch(loginAction(payload)).unwrap();
    if (res?.data?.token) {
      // Save company token separately
      setCookie('COMPANY_TOKEN', JSON.stringify(res.data.token));
      setCookie('COMPANY_ROLE', res.data.accessMode); // optional for role-based routing
      setCookie('ACTIVE_MODE', "company"); // optional for role-based routing
      toast.success(res?.message || 'Company login successful');

      // Navigate to company dashboard
      navigate("/company");
    }
  } catch (error) {
    console.log(error);
    toast.error(error || 'Invalid credentials or server error');
  } finally {
    setIsLoading(false);
  }
};


  const getForgotPasswordLink = () => {
    switch (role) {
      case "admin":
        return '/admin/forgot-password';
      case "company":
        return '/companies/forgot-password';
      case "institute":
        return '/institute/forgot-password';
      default:
        return '/admin/forgot-password';
    }
  };


  return (
    <div className="relative">
      <div className="  ">
        {/* <div
          className="gradient-background h-screen  md:block hidden "
          data-aos="fade-right"
          data-aos-duration="1000"
        >
          <div className="md:block hidden">
            <OrbitalMenu />
          </div>
        </div> */}

        <div
          className="flex items-center justify-center  h-screen "
          data-aos="fade-left"
          data-aos-duration="1000"

        >
          <Form onSubmit={handleSubmit}>
            <div
              className="leading-relaxed tracking-wider"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <h1 className="text-3xl font-semibold pt-5 pb-2 instrument-sans">
                Head Start Your CAREER
              </h1>
            </div>

            <CustomInput
              label="User Name /Email ID"
              name="username"
              placeholder="Enter your Username"
              value={formData?.username}
              onChange={(e) => handleChange("username", e)}
              error={errors.username}
              autoComplete="off"
              className="md:bg-white bg-white/40"
              readOnly={!!prefillEmail}  // if email comes from dropdown → disable editing
            />
            <PasswordInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter Your Password"
              value={formData?.password}
              onChange={(e) => handleChange("password", e)}
              error={errors.password}
              autoComplete="off"
            />

            <div
              className="flex justify-between"
              data-aos="fade-up"
              data-aos-delay="300"
            >

              <Link
                to={getForgotPasswordLink()}
                className="flex justify-end font-medium hover:underline text-sm text-[#2563EB]"
              >
                Forgot Password ?
              </Link>
            </div>
            <div
              className="w-full flex justify-center items-center"
              data-aos="fade-up"
              data-aos-delay="350"
            >
              <Button type="submit" className="w-full" loading={isLoading}>Submit</Button>
            </div>
            <div className="flex justify-center gap-4 items-center text-sm font-medium text-blue-600">
              {showInstitute && (
                <h3
                  className="hover:underline cursor-pointer"
                  onClick={() => navigate('/institute-register')}
                >
                  Sign up Institute
                </h3>
              )}

              {showCompany && (
                <h2
                  className="hover:underline cursor-pointer"
                  onClick={() => navigate('/companies-register')}
                >
                  Sign up Company
                </h2>
              )}

            </div>
          </Form>
        </div>
      </div>
    </div>

  );
};

export default CompanyLogin;