import React, { useState, useEffect } from "react";
import Button from "../Button/Button";


const OtpForm = ({
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
            <div className="glassy-card py-8 px-4 shadow sm:rounded-lg sm:px-10 min-w-2xl w-full max-w-md">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h2 className="text-center text-2xl font-semibold glassy-text-primary">{title}</h2>

                    <div className="flex justify-center mb-4">
                        <img src="/Frame 1000004906.png" alt="logo" className="h-16 w-auto" />
                    </div>

                    <div className="pl-10 ">
                        <h1 class="text-2xl font-normal pb-2">Head Start Your <b>CAREER</b></h1>
                        <div className="pl-14">
                            <p className="text-sm font-normal text-[#646464] tracking-wider pl-3">OTP Verification</p>
                        </div>
                    </div>
                    <div className="flex justify-center gap-2 mt-2">
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                id={`otp-${idx}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                className={`w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:border-black ${error && digit.trim() === "" ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                        ))}
                    </div>

                    {error && (
                        <p className="text-xs text-red-500 text-center -mt-2">{error}</p>
                    )}
                    <div className="flex justify-center items-center gap-2 text-sm mt-4">
                        {!isResendDisabled ? (
                            <>
                                <span className="glassy-text-secondary">Didn't receive the code?</span>
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="font-semibold text-[#2563EB] hover:underline"
                                >
                                    Resend
                                </button>
                            </>
                        ) : (
                            <span className="glassy-text-secondary">Resend OTP in {timer}sec</span>
                        )}
                    </div>
                <Button></Button>
                </form>
            </div>
        </div>
    );
};

export default OtpForm;
