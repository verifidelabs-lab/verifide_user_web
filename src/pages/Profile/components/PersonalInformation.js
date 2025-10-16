import React, { useState, useRef, useEffect } from "react";
import Button from "../../../components/ui/Button/Button";
import CustomInput from "../../../components/ui/Input/CustomInput";
import CustomDateInput from "../../../components/ui/Input/CustomDateInput";
import selectJson from "../../../components/utils/selectJson.json";
import FilterSelect2 from "../../../components/ui/Input/FilterSelect2";
import { BiEditAlt, BiLeftArrowAlt } from "react-icons/bi";
import { MdOutlineContentCopy } from "react-icons/md";
import { toast } from "sonner";
import { BaseUrl } from "../../../components/hooks/axiosProvider";

const PersonalInformation = ({
  formData,
  error,
  isExtended,
  setIsExtended,
  setFormData,
  stateList,
  citiesList,
  loading,
  handleChange,
  countryList,
  handleSelectChange,
  handleSubmit,
  setErrors,
}) => {
  const getFormValue = (path) => {
    const keys = path.split(".");
    let value = formData;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return "";
    }
    return value || "";
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
  const inputRefs = {
    first_name: useRef(null),
    last_name: useRef(null),
    username: useRef(null),
    birth_date: useRef(null),
    gender: useRef(null),
    country: useRef(null),
    state: useRef(null),
    city: useRef(null),
    pin_code: useRef(null),
    address_line_1: useRef(null),
    headlineyy: useRef(null),
  };

  // scroll to first error field
  useEffect(() => {
    if (error && Object.keys(error).length > 0) {
      const firstErrorKey = Object.keys(error)[0];
      if (inputRefs[firstErrorKey]?.current) {
        inputRefs[firstErrorKey].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        inputRefs[firstErrorKey].current.focus?.();
      }
    }
  }, [error]);
  const handleToggle = () => {
    setIsExtended(!isExtended);
  };

  return (
    <div className="flex flex-col gap-6 bg-white border rounded-2xl">
      <div className="p-8 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#000000E6]">
            Personal Info
          </h3>

          {!isExtended ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggle}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={isExtended ? "Collapse form" : "Expand form"}
              >
                {isExtended ? (
                  <div></div>
                ) : (
                  <BiEditAlt className="text-blue-500 " size={22} />
                )}
              </button>
            </div>
          ) : (
            <Button
              variant="zinc"
              rounded="full"
              icon={<BiLeftArrowAlt />}
              onClick={() => setIsExtended((prev) => !prev)}
            >
              Back
            </Button>
          )}
        </div>

        {/* First 4 fields - always visible */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4 items-end lg:grid-cols-4 md:grid-cols-2 pb-4">
          <CustomInput
            label="First Name"
            ref={inputRefs.first_name}
            name="first_name"
            placeholder="John"
            value={getFormValue("first_name")}
            onChange={(e) => handleChange("first_name", e.target.value)}
            className="h-10 w-full"
            required
            error={error?.first_name}
          />
          <CustomInput
            label="Last Name"
            ref={inputRefs.last_name}
            placeholder="Doe"
            name="last_name"
            value={getFormValue("last_name")}
            onChange={(e) => handleChange("last_name", e.target.value)}
            className="h-10 w-full"
            required
            error={error?.last_name}
          />
          <div className="relative">
            <CustomInput
              label="User Name"
              ref={inputRefs.username}
              name="username"
              placeholder="Doe"
              value={getFormValue("username")}
              onChange={(e) => handleChange("username", e.target.value)}
              className="h-10 w-full"
              required
              error={error?.username}
            />
            <span className="text-blue-500 text-[10px] font-medium top-[75px] absolute flex items-center gap-1">
              <a
                href={`${BaseUrl}user-details/${formData?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {`${BaseUrl}${formData?.username}`}
              </a>

              <MdOutlineContentCopy
                className="cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={async () => {
                  try {
                    const url = `${BaseUrl}user-details/${formData?.username}`;
                    await navigator.clipboard.writeText(url);
                    toast.success("URL copied to clipboard!");
                  } catch (err) {
                    console.error("Failed to copy: ", err);
                  }
                }}
              />
            </span>
          </div>
          <CustomDateInput
            label="Date of birth"
            name="birth_date"
            ref={inputRefs.birth_date}
            value={getFormValue("birth_date")}
            onChange={(e) => handleChange("birth_date", e.target.value)}
            className="h-10 w-full"
            type="date"
            required
            error={error?.birth_date}
            allowFutureDate={false}
            dobRange={true}
          />
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExtended ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className={`pt-6 ${isExtended ? "block" : "hidden"}`}>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4 items-end lg:grid-cols-4 md:grid-cols-2 mt-6">
              <FilterSelect2
                label="Gender"
                name="gender"
                ref={inputRefs.gender}
                selectedOption={
                  selectJson?.gender?.find(
                    (opt) => opt.value === getFormValue("gender")
                  ) || null
                }
                onChange={(option) => {
                  setFormData((prev) => ({
                    ...prev,
                    gender: option?.value || "",
                  }));
                  setErrors({});
                }}
                options={selectJson?.gender || []}
                required
                error={error?.gender}
                isClearable={false}
              />
              <FilterSelect2
                label="Country"
                name="country"
                ref={inputRefs.country}
                selectedOption={
                  countryList?.find(
                    (opt) =>
                      opt.label ==
                      getNestedValue(formData, "address.country.name")
                  ) || null
                }
                onChange={(option) => handleSelectChange("country", option)}
                options={countryList || []}
                required
                isClearable={false}
                error={error?.["address.country.name"]}
              />
              <FilterSelect2
                label="State"
                name="state"
                ref={inputRefs.state}
                selectedOption={
                  stateList?.find(
                    (opt) =>
                      opt.label ===
                      getNestedValue(formData, "address.state.name")
                  ) || null
                }
                onChange={(option) => handleSelectChange("state", option)}
                options={stateList || []}
                required
                error={error?.["address.state.name"]}
                isClearable={false}
              />
              <FilterSelect2
                label="City"
                name="city"
                ref={inputRefs.city}
                selectedOption={
                  citiesList?.find(
                    (opt) =>
                      opt?.label ===
                      getNestedValue(formData, "address.city.name")
                  ) || null
                }
                onChange={(option) => handleSelectChange("city", option)}
                options={citiesList || []}
                required
                error={error?.["address.city.name"]}
                isClearable={false}
              />
            </div>

            <div className="grid md:grid-cols-3 grid-cols-1 gap-5 mt-6">
              <CustomInput
                label="Pin Code "
                name="pin_code"
                ref={inputRefs.pin_code}
                placeholder="Enter PinCode"
                value={formData?.address?.pin_code}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      pin_code: e.target.value,
                    },
                  }))
                }
                className="h-10 w-full"
                required
                error={error?.["address.pin_code"]}
              />

              <CustomInput
                label="Address "
                ref={inputRefs.address_line_1}
                placeholder="Enter Address"
                value={formData?.address?.address_line_1}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      address_line_1: e.target.value,
                    },
                  }))
                }
                className="h-10 w-full"
                name="address_line_1"
                required
                error={error?.["address.address_line_1"]}
                maxLength="100"
              />

              <CustomInput
                label="Headline"
                ref={inputRefs.headline}
                placeholder="ex-Management Executive at Zara"
                value={getFormValue("headline")}
                onChange={(e) => handleChange("headline", e.target.value)}
                className="h-10 w-full"
                name="headline"
                required
                error={error?.headline}
                maxLength={100}
                minLength={5}
              />
            </div>

            <div className="mt-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Professional Bio *
              </label>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-lg"
                placeholder="Write a short professional biography (min 10 and max 500)"
                value={getFormValue("summary")}
                onChange={(e) => handleChange("summary", e.target.value)}
                maxLength={500}
              />
              <p className="text-red-500 text-xs">{error?.summary}</p>
            </div>

            <div className="flex items-center justify-end mt-6 gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsExtended((prev) => !prev)}
              >
                Close
              </Button>

              <Button type="button" onClick={handleSubmit} loading={loading}>
                Update
              </Button>
            </div>
          </div>
          <div></div>
        </div>

        {/* Show the edit button at the bottom when not extended */}
      </div>
    </div>
  );
};

export default PersonalInformation;
