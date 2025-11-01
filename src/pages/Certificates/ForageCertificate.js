import React from "react";
const ForageCertificate = () => {
    return (
        <>
            <div className="max-w-4xl mx-auto glassy-card border-2 border-gray-300 rounded-lg shadow-lg p-8 font-sans mt-40">
                {/* Header */}
                <img src='/Frame 1000004906.png' alt="" className="pb-5" />
                <div className="max-w-3xl glassy-card pt-8">
                    {/* Name */}
                    <h1 className="text-5xl font-bold glassy-text-primary">Jane Smith</h1>

                    {/* Program Title */}
                    <h2 className="text-3xl font-extrabold text-whitemt-1">
                        Bank &amp; Merge Co Private Equity Program
                    </h2>

                    {/* Certificate of Completion */}
                    <p className="glassy-text-primary mt-6 font-medium text-2xl leading-relaxed">Certificate of Completion</p>
                    <p className="glassy-text-primary mt-1 font-medium text-xl">June 20th, 2019</p>

                    {/* Program Description */}
                    <div className="mt-6 text-sm glassy-text-primary leading-relaxed">
                        <p className="text-lg">
                            Over the period of May 2019 to June 2019, Jane Smith has completed practical tasks in:
                        </p>
                        <ul className="list-disc ml-6 mt-2 space-y-1 font-medium text-lg mt-5">
                            <li>LBO Target Characteristics</li>
                            <li>Leverage and Financial Returns</li>
                            <li>Basic Debt Structuring</li>
                            <li>Constructing an Investment Case</li>
                        </ul>
                    </div>

                    {/* Signature Section */}
                   

                </div>
                 <div className="mt-12 flex justify-end items-end gap-6">
                        <div className="text-center">
                            <div className="h-10"></div> {/* Placeholder for signature */}
                            <p className="font-medium">[e.g Jane Smith]</p>
                            <p className="text-sm glassy-text-secondary">[Title e.g Partner]</p>
                        </div>

                        <div className="">
                            <div className="h-10"></div> {/* Placeholder for signature */}
                            <p className="font-medium">Tom Brunskill</p>
                            <p className="text-sm glassy-text-secondary">CEO, Co-Founder of Forage</p>
                        </div>
                    </div>
            </div>
        </>
    )
}
export default ForageCertificate