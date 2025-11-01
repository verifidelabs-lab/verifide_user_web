import React, { useState } from "react";
import Modal from "../../components/ui/Modal/Modal";
import useFormHandler from "../../components/hooks/useFormHandler";
import CustomInput from "../../components/ui/Input/CustomInput";
const initialFormData = {
  name: "",
  display_name: "",
  description: "",
  website_url: "",
  logo_url: "",
  banner_image_url: "",
  industry: [],
  country_code: {
    name: "",
    dial_code: "",
    short_name: "",
    emoji: ""
  },
  phone_no: "",
  company_size: "",
  company_type: "",
  headquarters: {
    address_line_1: "",
    address_line_2: "",
    country: {
      name: "",
      dial_code: "",
      short_name: "",
      emoji: ""
    },
    state: {
      name: "",
      code: ""
    },
    city: {
      name: ""
    },
    pin_code: ""
  },
  founded_year: "",
  specialties: [""],
  follower_count: "",
  employee_count: "",
  linkedin_page_url: "",
  username: "",
  password: "",
  confirmPassword: "",
  email: ""
};

const CreateCompany = () => {
  const [modalState, setIsModalState] = useState({
    isOpen: false, type: null, data: null
  })
  const handleClose = () => {
    setIsModalState({ isOpen: false })
  }
  const { formData,  handleChange } = useFormHandler(initialFormData)
  return (
    <div className="glassy-card min-h-screen flex flex-col items-center py-10">
      {/* Title */}
      <h1 className="text-2xl font-semibold mb-2">Create a verified Page</h1>
      <p className="glassy-text-secondary mb-8 text-center max-w-lg">
        Connect with clients, employees, and the verified community. To get
        started, choose a page type.
      </p>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border rounded-lg p-6 shadow-sm hover:shadow-md glassy-card cursor-pointer text-center"
          onClick={() => setIsModalState({ isOpen: true, type: "Add Company" })}>
          <div className="text-4xl mb-3">🏢</div>
          <h2 className="font-semibold">Company</h2>
          <p className="text-sm glassy-text-secondary">
            Small, medium, and large businesses
          </p>
        </div>

        <div className="border rounded-lg p-6 shadow-sm hover:shadow-md glassy-card cursor-pointer text-center">
          <div className="text-4xl mb-3">📄</div>
          <h2 className="font-semibold">Showcase page</h2>
          <p className="text-sm glassy-text-secondary">
            Sub-pages associated with an existing page
          </p>
        </div>

        <div className="border rounded-lg p-6 shadow-sm hover:shadow-md glassy-card cursor-pointer text-center">
          <div className="text-4xl mb-3">🎓</div>
          <h2 className="font-semibold">Educational institution</h2>
          <p className="text-sm glassy-text-secondary">Schools and universities</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div>
          <img src="/Img/createe.png" alt="create" />
        </div>

        <div className="relative w-40 h-72 glassy-card border rounded-lg shadow-lg overflow-hidden">

          <div className="h-[400px]">
            <img src="https://static.licdn.com/aero-v1/sc/h/3v3wzhnr3kapuzwpk1zt6r1jt" alt="" />
          </div>
        </div>
      </div>
      <Modal isOpen={modalState.isOpen} onClose={handleClose} title={modalState.type}>
        <form  className="gap-3  grid grid-cols-2 items-end">
          {/* Basic Info */}
          <CustomInput label="Name" name="name" value={formData.name} onChange={handleChange} className="w-full h-10" />
          <CustomInput className="w-full h-10" label="Display Name" name="display_name" value={formData.display_name} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Description" name="description" value={formData.description} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Website URL" name="website_url" value={formData.website_url} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Logo URL" name="logo_url" value={formData.logo_url} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Banner Image URL" name="banner_image_url" value={formData.banner_image_url} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Industry" name="industry" value={formData.industry} onChange={handleChange} />

          {/* Contact */}
          <CustomInput className="w-full h-10" label="Phone No" name="phone_no" value={formData.phone_no} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />

          {/* Company Details */}
          <CustomInput className="w-full h-10" label="Company Size" name="company_size" value={formData.company_size} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Company Type" name="company_type" value={formData.company_type} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Founded Year" name="founded_year" value={formData.founded_year} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Specialties" name="specialties" value={formData.specialties} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Follower Count" name="follower_count" value={formData.follower_count} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Employee Count" name="employee_count" value={formData.employee_count} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="LinkedIn Page URL" name="linkedin_page_url" value={formData.linkedin_page_url} onChange={handleChange} />

          {/* Headquarters Address */}
          <h3 className="text-lg font-semibold pt-2">Headquarters</h3>
          <CustomInput className="w-full h-10" label="Address Line 1" name="headquarters.address_line_1" value={formData.headquarters.address_line_1} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Address Line 2" name="headquarters.address_line_2" value={formData.headquarters.address_line_2} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Country" name="headquarters.country.name" value={formData.headquarters.country.name} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="State" name="headquarters.state.name" value={formData.headquarters.state.name} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="City" name="headquarters.city.name" value={formData.headquarters.city.name} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Pin Code" name="headquarters.pin_code" value={formData.headquarters.pin_code} onChange={handleChange} />

          {/* Auth */}
          <h3 className="text-lg font-semibold pt-2">Account Setup</h3>
          <CustomInput className="w-full h-10" label="Username" name="username" value={formData.username} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
          <CustomInput className="w-full h-10" label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />

         
        </form>
      </Modal>
    </div>
  );
};

export default CreateCompany;
