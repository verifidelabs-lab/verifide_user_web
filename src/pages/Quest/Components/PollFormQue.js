import { useState } from "react";
import { RxCopy } from "react-icons/rx";

export const PollFormQue = ({
  question, 
  response, 
  onTitleChange, 
  onTypeChange, 
  onRequiredChange, 
  onOptionAdd, 
  onOptionChange, 
  onDelete, 
  onDuplicate,
  onResponseChange
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const renderInput = () => {
    switch (question.type) {
      case 'short-answer':
        return (
          <input
            type="text"
            value={response}
            onChange={(e) => onResponseChange(e.target.value)}
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 cursor-not-allowed"
            placeholder="Your answer"
            disabled
          />
        );
      
      case 'poll':
        return (
          <div className="space-y-2 mt-2">
            {question.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center">
                <input
                  type="radio"
                  id={`q${question.id}_opt${optIndex}`}
                  name={`question_${question.id}`}
                  value={option}
                  checked={response === option}
                  onChange={() => onResponseChange(option)}
                  className="mr-2"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => onOptionChange(optIndex, e.target.value)}
                  className="p-1 border-b border-transparent hover:border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
            <div className="flex items-center mt-2">
              <input type="radio" disabled className="mr-2" />
              <button 
                type="button" 
                onClick={onOptionAdd}
                className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
              >
                Add option
              </button>
            </div>
          </div>
        );
      
      case 'multi-choice':
        return (
          <div className="space-y-2 mt-2">
            {question.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center">
                <input
                  type="radio"
                  id={`q${question.id}_opt${optIndex}`}
                  name={`question_${question.id}`}
                  value={option}
                  checked={response === option}
                  onChange={() => onResponseChange(option)}
                  className="mr-2"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => onOptionChange(optIndex, e.target.value)}
                  className="p-1 border-b border-transparent hover:border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
            <div className="flex items-center mt-2">
              <input type="radio" disabled className="mr-2" />
              <button 
                type="button" 
                onClick={onOptionAdd}
                className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
              >
                Add option
              </button>
            </div>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2 mt-2">
            {question.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center">
                <input
                  type="checkbox"
                  id={`q${question.id}_opt${optIndex}`}
                  name={`question_${question.id}`}
                  value={option}
                  checked={Array.isArray(response) && response.includes(option)}
                  onChange={(e) => {
                    const newValue = Array.isArray(response) ? [...response] : [];
                    if (e.target.checked) {
                      newValue.push(option);
                    } else {
                      const index = newValue.indexOf(option);
                      if (index > -1) newValue.splice(index, 1);
                    }
                    onResponseChange(newValue);
                  }}
                  className="mr-2"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => onOptionChange(optIndex, e.target.value)}
                  className="p-1 border-b border-transparent hover:border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
            <div className="flex items-center mt-2">
              <input type="checkbox" disabled className="mr-2" />
              <button 
                type="button" 
                onClick={onOptionAdd}
                className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
              >
                Add option
              </button>
            </div>
          </div>
        );
      
      case 'dropdown':
        return (
          <div className="mt-2">
            <select
              value={response}
              onChange={(e) => onResponseChange(e.target.value)}
              className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select an option</option>
              {question.options.map((option, optIndex) => (
                <option key={optIndex} value={option}>{option}</option>
              ))}
            </select>
            <div className="mt-2">
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center mb-1">
                  <span className="mr-2">{optIndex + 1}.</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => onOptionChange(optIndex, e.target.value)}
                    className="p-1 border-b border-transparent hover:border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
              <button 
                type="button" 
                onClick={onOptionAdd}
                className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded mt-1"
              >
                Add option
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-6 hover:border-gray-400 transition-colors">
      <div className="flex justify-between items-start mb-4">
        {isEditing ? (
          <input
            type="text"
            value={question.title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="text-lg font-medium w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
            autoFocus
          />
        ) : (
          <h2 
            className="text-sm  font-medium cursor-text p-2 hover:bg-gray-100 rounded border"
            onClick={() => setIsEditing(true)}
          >
            {question.title}
          </h2>
        )}
        
        <select
          value={question.type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="border border-gray-300 rounded p-1 text-sm bg-transparent outline-none focus:ring-1 focus:border-blue-400"
        >
          <option value="short-answer">Short answer</option>
           <option value="poll">Poll</option>
          <option value="multi-choice">Multiple choice</option>
          <option value="checkbox">Checkbox</option>
          <option value="dropdown">Dropdown</option>
        </select>
      </div>
      
      {renderInput()}
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center">
          <button 
            type="button" 
            onClick={onDuplicate}
            className="text-gray-900 hover:text-blue-600 p-1 rounded"
            title="Duplicate"
          >
            <RxCopy />
          </button>
          
          <button 
            type="button" 
            onClick={onDelete}
            className="text-gray-600 hover:text-red-600 p-1 rounded ml-2"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Required</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={question.isRequired}
              onChange={onRequiredChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};