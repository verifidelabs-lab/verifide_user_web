import React from "react";
import FilterSelect2 from "../../../../components/ui/Input/FilterSelect2";
import CustomInput from "../../../../components/ui/Input/CustomInput";
import CustomDateInput from "../../../../components/ui/Input/CustomDateInput";
import FilterSelect from "../../../../components/ui/Input/FilterSelect";
import selectJson from "../../../../components/utils/selectJson.json";
import { useEffect } from "react";

const StepFirst = ({
  allCompanies,
  allIndustry,
  formData,
  setFormData,
  handleInputChange,
  handleSelectChange,
  errors,
  setAddModalState,
  countryList,
  handleLocationSelectChange,
  getNestedValue,
  stateList,
  citiesList,
  setInputField,
  isCreatableIndustry,
  getSelectedOption,
}) => {
  return (
    <div className="space-y-8">
      {/* Company & Industry Section */}
      <div className="glassy-card p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold glassy-text-primary capitalize border-b pb-2">
          Company & Industry
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <FilterSelect
              options={allCompanies || []}
              label="Company Name"
              className="w-full"
              placeholder="Select Company"
              onChange={(selected) =>
                handleSelectChange("company_id", selected)
              }
              selectedOption={allCompanies.find(
                (opt) => opt.value === formData.company_id
              )}
              required
              error={errors?.company_id}
              onCreateOption={(inputValue, field) => {
                console.log(
                  "this is the inputalue and field",
                  field,
                  inputValue
                );

                setAddModalState({ isOpen: true, type: "companies", field });
                setInputField((prev) => ({ ...prev, name: inputValue }));
              }}
              isClearable
              isCreatedByUser
              isDisabled={formData.company_id}
            />
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-3">
            {/* <FilterSelect
              // label="Industry Name"
              name="industry_id"
              placeholder="Select Industry"
              // options={allIndustry}
              // selectedOption={getSelectedOption(
              //   allIndustry,
              //   formData?.industry_id
              // )}
              onChange={(selected) =>
                handleSelectChange("industry_id", selected)
              }
              error={errors.industry_id}
              className="w-full h-10"
              required
              // onCreateOption={(inputValue, field) => {
              //   setAddModalState({
              //     isOpen: true,
              //     type: "industries",
              //     field: field,
              //   });
              //   setInputField((prev) => ({ ...prev, name: inputValue }));
              // }}
              isClearable
              isDisabled={!formData?.industry_id}
              disabledTooltip="Please select first Company"
              isCreatedByUser={isCreatableIndustry}
            /> */}
            <FilterSelect
              label="Industry Name"
              name="industry_id"
              placeholder="Select Industry"
              options={allIndustry}
              // selectedOption={getSelectedOption(
              //   allIndustry,
              //   formData?.industry_id
              // )}
              selectedOption={allIndustry.find(
                (opt) => opt.value === formData.industry_id
              )}
              onChange={(selected) =>
                handleSelectChange("industry_id", selected)
              }
              error={errors.industry_id}
              className="w-full h-10"
              required
              // onCreateOption={(inputValue, field) => {
              //   setAddModalState({
              //     isOpen: true,
              //     type: "industries",
              //     field: field,
              //   });
              //   setInputField((prev) => ({ ...prev, name: inputValue }));
              // }}
              isClearable={false}
              isDisabled={!formData?.company_id}
              disabledTooltip="Please select first Company"
              isCreatedByUser={isCreatableIndustry}
            />
            {/* <FilterSelect
              options={allIndustry || []}
              label="Industry Name"
              className="w-full"
              placeholder="Select Industry"
              onChange={(selected) =>
                handleSelectChange("", selected)
              }
              selectedOption={allIndustry.find(
                (opt) => opt.value === formData.industry_id
              )}
              required
              error={errors?.industry_id}
              onCreateOption={(inputValue, field) => {
                setAddModalState({ isOpen: true, type: "industries", field });
                setInputField((prev) => ({ ...prev, name: inputValue }));
              }}
              isClearable
              isCreatedByUser={isCreatableIndustry}
              isDisabled={!formData.company_id}
              disabledTooltip={`first select Company name`}
            /> */}

            <CustomInput
              type="number"
              value={formData?.current_openings}
              label="Available Opening"
              onChange={(e) =>
                handleInputChange("current_openings", e.target.value)
              }
              name="current_openings"
              className="w-full h-12 border rounded-lg px-4"
              placeholder={`Enter number of available posts `}
              required
              error={errors?.current_openings}
            />
          </div>
        </div>
      </div>

      {/* Job Details Section */}
      <div className="glassy-card p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold glassy-text-primary capitalize border-b pb-2">
          Job Details
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <FilterSelect
            label="Job Type"
            options={selectJson?.Job_Type_List || []}
            placeholder="Select Job Type"
            onChange={(selected) => handleSelectChange("job_type", selected)}
            selectedOption={selectJson?.Job_Type_List.find(
              (opt) => opt.value === formData.job_type
            )}
            required
            error={errors?.job_type}
          />

          <FilterSelect
            label="Location Type"
            options={selectJson?.Job_Location_List || []}
            placeholder="Select Location"
            onChange={(selected) =>
              handleSelectChange("job_location", selected)
            }
            selectedOption={selectJson?.Job_Location_List.find(
              (opt) => opt.value === formData.job_location
            )}
            required
            error={errors?.job_location}
          />

          <FilterSelect
            label="Pay Type"
            options={selectJson?.Job_Pay_Type_List || []}
            placeholder="Select Pay Type"
            onChange={(selected) => handleSelectChange("pay_type", selected)}
            selectedOption={selectJson?.Job_Pay_Type_List.find(
              (opt) => opt.value === formData.pay_type
            )}
            required
            error={errors?.pay_type}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {!(
            formData.job_type === "internship" || formData.pay_type === "unpaid"
          ) && (
              <CustomInput
                label="Salary Range"
                placeholder="e.g. ₹30,000 - ₹50,000"
                value={formData.salary_range}
                onChange={(e) =>
                  handleInputChange("salary_range", e.target.value)
                }
                required
                error={errors?.salary_range}
                className="h-10 w-full"
              />
            )}

          <CustomDateInput
            label="Job Start Date"
            value={formData?.start_date}
            onChange={(e) => handleInputChange("start_date", e.target.value)}
            required
            error={errors?.start_date}
            allowPastDate={false}
          />

          <CustomDateInput
            label="Job End Date"
            value={formData?.end_date}
            onChange={(e) => handleInputChange("end_date", e.target.value)}
            required
            error={errors?.end_date}
            allowPastDate={false}
            minDateOverride={formData?.start_date}
          />
        </div>
      </div>

      {/* Location Section */}
      <div className="glassy-card p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold glassy-text-primary capitalize border-b pb-2">
          Location
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          <FilterSelect2
            label="Country"
            selectedOption={
              countryList?.find(
                (opt) =>
                  opt.label === getNestedValue(formData, "address.country.name")
              ) || null
            }
            onChange={(option) => handleLocationSelectChange("country", option)}
            options={countryList || []}
            required
            isClearable={false}
            error={errors?.country}
          />

          <FilterSelect2
            label="State"
            selectedOption={
              stateList?.find(
                (opt) =>
                  opt.label === getNestedValue(formData, "address.state.name")
              ) || null
            }
            onChange={(option) => handleLocationSelectChange("state", option)}
            options={stateList || []}
            required
            isClearable={false}
            error={errors?.state}
          />

          <FilterSelect2
            label="City"
            selectedOption={
              citiesList?.find(
                (opt) =>
                  opt?.label === getNestedValue(formData, "address.city.name")
              ) || null
            }
            onChange={(option) => handleLocationSelectChange("city", option)}
            options={citiesList || []}
            required
            isClearable={false}
            error={errors?.city}
          />

          <CustomInput
            label="Pin Code"
            placeholder="e.g. 696969"
            value={formData?.address?.pin_code}
            className="w-full h-10"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, pin_code: e.target.value },
              }))
            }
            required
            error={errors?.pin_code}
          />
        </div>
      </div>
    </div>
  );
};

export default StepFirst;
