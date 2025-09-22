import React, { useState } from 'react';
import useFormHandler from '../../components/hooks/useFormHandler';
import CustomInput from '../../components/ui/Input/CustomInput';
import Button from '../../components/ui/Button/Button';
import { toast } from 'sonner';
import { changePassword } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const ChangePassword = () => {
    const dispatch = useDispatch()
    const {
        formData,
        handleChange,
        errors,
        setErrors,
        resetForm,
    } = useFormHandler({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters long';
        } else if (formData.newPassword === formData.currentPassword) {
            newErrors.newPassword = 'New password cannot be the same as current password';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm password is required';
        } else if (formData.confirmPassword !== formData.newPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            setIsSubmitting(true)
            const res = await dispatch(changePassword(formData)).unwrap()
            resetForm()
            toast.success(res?.message)
        } catch (error) {
            toast.error(error)
            setIsSubmitting(false)
        } finally {
            setIsSubmitting(false)
            resetForm()
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center  p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm transition-all duration-500 hover:shadow-purple-300 ">
                <div className="p-8 animate-fade-in">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Change Password</h2>
                        <p className="text-gray-600 mt-2">Secure your account with a new password</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <CustomInput
                                type="password"
                                className={`w-full h-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
                                value={formData?.currentPassword}
                                onChange={(e) => handleChange('currentPassword', e.target.value)}
                                placeholder="Enter password"
                            />
                            {errors.currentPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <CustomInput
                                type="password"
                                className={`w-full h-10 ${errors.newPassword ? 'border-red-500' : ''}`}
                                value={formData?.newPassword}
                                onChange={(e) => handleChange('newPassword', e.target.value)}
                                placeholder="Enter password"

                            />
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <CustomInput
                                type="password"
                                className={`w-full h-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                value={formData?.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                placeholder="Enter password"

                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div>
                            <Button type="submit" loading={isSubmitting} className='w-full' >
                                {isSubmitting ? 'Updating...' : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
