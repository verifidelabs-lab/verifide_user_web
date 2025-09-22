import React, { useState, useEffect } from "react";
import Button from "../Button";
import Form from "../Form/Form";
import Input from "./Input";
import { Link } from "react-router-dom";
import PasswordInput from "./PasswordInput";


const ResetPassword = ({
    title = "Enter OTP",
    onSubmit = () => { },
    onResend = () => { },
    onChange = () => { },
    otpLength = 6,
    formStateEmail,
    error = "",
    isLoading = false
}) => {
    const [otp, setOtp] = useState(new Array(otpLength).fill(""));
    const [timer, setTimer] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    useEffect(() => {
        let interval;
        if (isResendDisabled && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }
        if (timer === 0) setIsResendDisabled(false);
        return () => clearInterval(interval);
    }, [timer, isResendDisabled]);

    const handleChange = (element, index) => {
        if (/^\d$/.test(element.value) || element.value === "") {
            const newOtp = [...otp];
            newOtp[index] = element.value;
            setOtp(newOtp);
            onChange({ target: { name: "otp", value: newOtp } });

            if (element.value && index < otpLength - 1) {
                document.getElementById(`otp-${index + 1}`)?.focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);
            onChange({ target: { name: "otp", value: newOtp } });
            if (index > 0) {
                document.getElementById(`otp-${index - 1}`)?.focus();
            }
        }
    };

    const handleResend = (e) => {
        onResend(e);
        setTimer(60);
        setIsResendDisabled(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(otp);
    };

    return (
        <div className="flex justify-center items-center min-h-[500px]">
            <div className="px-40 py-10 sm:rounded-lg sm:px-10 min-w-2xl w-full max-w-md">
                <form className="space-y-16" onSubmit={handleSubmit}>
                
                    <Form onSubmit={()=>{}} title="Admin Forgot Password">
                        <PasswordInput
                            name="email"
                            label="New Password"
                            value={""}
                            placeholder="Enter Your New Password"
                            onChange={()=>{}}
                            error={""}
                        />
                         <PasswordInput
                            name="confirmPassword"
                            label="Confirm Password"
                            value={""}
                            placeholder="Enter Confirm Password"
                            onChange={()=>{}}
                            error={""}
                        />

                    </Form>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
