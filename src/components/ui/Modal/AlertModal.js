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
    <div
      className={`fixed z-50 bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      style={{ top: '50%', left: '50%' }}
    >
      <div className='glassy-card p-6 md:p-8 rounded-lg w-full lg:w-[500px] shadow-lg'>


        <div className='space-y-2 text-center mb-5'>
          <h2 className='md:text-lg text-sm glassy-text-primary font-bold'>{title}</h2>
          <p className='glassy-text-secondary md:text-sm text-xs'>{description}</p>
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
