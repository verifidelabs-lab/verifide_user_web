import React from 'react'
import CustomInput from '../Input/CustomInput'
import Button from '../Button/Button'
import FilterSelect from '../Input/FilterSelect'



const AlertModal = ({
  isOpen,
  onCancel,
  onConfirm,
  title = 'Are you sure you want to delete?',
  description = 'This action cannot be undone. Please confirm your decision.',
  isReason = false,
  inputValue = '',
  onInputChange = null,
  inputError = '',
  isDropDown = false,
  dropValue = '',
  onDropChange = null,
  dropError = '',
  dropOptions = [],
}) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 glassy-card bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
      <div className='glassy-card p-6 md:p-8 rounded-lg w-full lg:w-[500px] shadow-lg'>


        <div className='space-y-2 text-center mb-5'>
          <h2 className='md:text-lg text-sm glassy-text-primary font-bold'>{title}</h2>
          <p className='text-[#212121CC]/80 md:text-sm text-xs'>{description}</p>
        </div>

        {isReason && (
          <CustomInput
            type='textarea'
            id='reason'
            name='reason'
            label='Reason'
            placeholder='Enter reason'
            rows={3}
            value={inputValue}
            onChange={onInputChange}
            textareaClassName='border-white/15'
            labelClassName='glassy-text-primary/70'
            required
            errorMessage={inputError}
            maxLength={500}
          />
        )}
        {isDropDown && (
          <FilterSelect
            id='type'
            name='type'
            label='Type'
            placeholder='Select Type'
            required={true}
            options={dropOptions}
            value={dropValue}
            onChange={onDropChange}
            errorMessage={dropError}
          />
        )}


        <div className='flex justify-between place-items-center gap-3 pt-5'>
          <Button variant='secondary' type='button' onClick={onCancel}>Cancel</Button>
          <Button type='button' onClick={onConfirm}>Submit</Button>

        </div>
      </div>
    </div>
  )
}

export default AlertModal
