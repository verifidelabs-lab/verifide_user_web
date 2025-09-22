import { useState } from 'react';
import { PollFormQue } from './PollFormQue';

const PollForm = ({ questions, setQuestions, errors }) => {

  const [responses, setResponses] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const addQuestion = (type) => {
    const newQuestion = {
      id: questions.length + 1,
      type,
      title: 'Untitled Question',
      isRequired: false,
      options: type === 'multi-choice' || type === 'checkbox' || type === 'dropdown'
        ? ['Option 1']
        : []
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestionTitle = (id, title) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, title } : q
    ));
  };

  const updateQuestionType = (id, type) => {
    setQuestions(questions.map(q =>
      q.id === id ? {
        ...q,
        type,
        options: (type === 'multi-choice' || type === 'checkbox' || type === 'dropdown') && q.options.length === 0
          ? ['Option 1']
          : q.options
      } : q
    ));
  };

  const toggleRequired = (id) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, isRequired: !q.isRequired } : q
    ));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? {
        ...q,
        options: [...q.options, `Option ${q.options.length + 1}`]
      } : q
    ));
  };

  const updateOption = (questionId, optionIndex, text) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = text;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const deleteQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const duplicateQuestion = (question) => {
    const newQuestion = {
      ...question,
      id: questions.length + 1
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const missingRequired = questions.filter(q =>
      q.isRequired && (!responses[q.id] || (Array.isArray(responses[q.id]) && responses[q.id].length === 0))
    );
    if (missingRequired.length > 0) {
      alert('Please fill in all required fields.');
      return;
    }
    console.log('Form responses:', responses);
    setFormSubmitted(true);
  };

  const resetForm = () => {
    setResponses({});
    setFormSubmitted(false);
  };

  return (
    <div className="">
      <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-300 p-6">
        {formSubmitted ? (
          <div className="text-center py-12">
            <div className="bg-blue-100 text-blue-800 p-4 rounded-full inline-block mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your response has been recorded.</h2>
            <p className="text-gray-600 mb-6">Thank you for completing the form.</p>
            <button
              onClick={resetForm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {questions.map((question, index) => (
              <PollFormQue
                key={question.id}
                question={question}
                index={index}
                response={responses[question.id] || ''}
                onTitleChange={(title) => updateQuestionTitle(question.id, title)}
                onTypeChange={(type) => updateQuestionType(question.id, type)}
                onRequiredChange={() => toggleRequired(question.id)}
                onOptionAdd={() => addOption(question.id)}
                onOptionChange={(optionIndex, text) => updateOption(question.id, optionIndex, text)}
                onDelete={() => deleteQuestion(question.id)}
                onDuplicate={() => duplicateQuestion(question)}
                onResponseChange={(value) => handleResponseChange(question.id, value)}
              />
            ))}

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addQuestion('short-answer')}
                className="flex items-center text-blue-600 hover:bg-blue-50 px-4 py-2 rounded"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add question
              </button>

              <button
                type="button"
                onClick={() => addQuestion('multi-choice')}
                className="flex items-center text-blue-600 hover:bg-blue-50 px-4 py-2 rounded"
              >
                Add multi choice
              </button>

              <button
                type="button"
                onClick={() => addQuestion('checkbox')}
                className="flex items-center text-blue-600 hover:bg-blue-50 px-4 py-2 rounded"
              >
                Add checkbox
              </button>
              <button
                type="button"
                onClick={() => addQuestion('checkbox')}
                className="flex items-center text-blue-600 hover:bg-blue-50 px-4 py-2 rounded"
              >
                Add Poll
              </button>
            </div>
          </form>
        )}
      </div>
      <span className='text-red-500 text-sm mt-2'>{errors?.surveyPolls}</span>
    </div>
  );
};



export default PollForm;