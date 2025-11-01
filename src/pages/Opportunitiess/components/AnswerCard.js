// components/AnswerCard.jsx
import React from "react";

const AnswerCard = ({ question, correctOptions, selectedOptions, questionType, index }) => {
    const renderAnswer = () => {

        if (!correctOptions && !selectedOptions) {
            return <p className="text-sm glassy-text-secondary">No answer provided</p>;
        }


        if (questionType === "single_choice") {
            return (
                <div className="space-y-2">
                    <div>
                        <p className="text-xs font-medium glassy-text-secondary"> Answer:</p>
                        <p className="text-sm   py-1.5 rounded">
                            {correctOptions?.[0] || "Not specified"}
                        </p>
                    </div>
 <div>
                        <p className="text-xs font-medium glassy-text-secondary"> Selected Answer:</p>
                        <p className="text-sm   py-1.5 rounded">
                            {selectedOptions?.[0] || "Not specified"}
                        </p>
                    </div>

                </div>
                
            );
        }

        return (
            <div className="space-y-2">
                {correctOptions && (
                    <div>
                        <p className="text-xs font-medium glassy-text-secondary">Correct Options:</p>
                        <ul className="list-disc pl-5">
                            {correctOptions.map((option, i) => (
                                <li key={i} className="text-sm text-green-600">{option}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {selectedOptions && (
                    <div>
                        <p className="text-xs font-medium glassy-text-secondary">Selected Options:</p>
                        <ul className="list-disc pl-5">
                            {selectedOptions.map((option, i) => (
                                <li key={i} className="text-sm glassy-text-primary">{option}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="glassy-card rounded-xl border  space-y-2 mb-4 last:mb-0">
            <p className="text-sm font-medium glassy-text-primary bg-[#F2F2F7] p-3">
                {index + 1}. {question}
            </p>
            <div className="mt-2 p-3">{renderAnswer()}</div>
        </div>
    );
};

export default AnswerCard;