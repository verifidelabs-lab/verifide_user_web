import React, { useState } from 'react';
import { BiChevronRight, BiPlus, BiStar, BiTrash } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';

const BuyCoursePopup = ({ isOpen, setIsOpen }) => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    creditCards: true,
    upi: true
  });
  const [creditCards, setCreditCards] = useState([
    {
      id: 'axis',
      name: 'Axis Bank',
      number: '**** **** **** 8395',
      logo: 'mastercard.png'
    },
    {
      id: 'hdfc',
      name: 'HDFC Bank',
      number: '**** **** **** 6246',
      logo: 'visa.png'
    }
  ]);
  const [upiOptions, setUpiOptions] = useState([
    {
      id: 'googlepay',
      name: 'Google Pay',
      logo: 'goolepay.png'
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      logo: 'phonepay.png'
    }
  ]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showAddUpiModal, setShowAddUpiModal] = useState(false);
  const [newCard, setNewCard] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });
  const [newUpi, setNewUpi] = useState({
    id: '',
    name: '',
    upiId: ''
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAddCard = () => {
    const newId = `card-${Date.now()}`;
    setCreditCards([...creditCards, {
      id: newId,
      name: newCard.name,
      number: `**** **** **** ${newCard.number.slice(-4)}`,
      logo: 'default-card.png'
    }]);
    setNewCard({ name: '', number: '', expiry: '', cvv: '' });
    setShowAddCardModal(false);
  };

  const handleAddUpi = () => {
    const newId = `upi-${Date.now()}`;
    setUpiOptions([...upiOptions, {
      id: newId,
      name: newUpi.name,
      logo: 'default-upi.png'
    }]);
    setNewUpi({ id: '', name: '', upiId: '' });
    setShowAddUpiModal(false);
  };

  const handleRemoveCard = (id, e) => {
    e.stopPropagation();
    setCreditCards(creditCards.filter(card => card.id !== id));
    if (selectedPayment === id) {
      setSelectedPayment('');
    }
  };

  const handleRemoveUpi = (id, e) => {
    e.stopPropagation();
    setUpiOptions(upiOptions.filter(upi => upi.id !== id));
    if (selectedPayment === id) {
      setSelectedPayment('');
    }
  };


  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold">Buy Course</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full cursor-pointer p-1"
            >
              <RxCross2 className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white">
            <div className='border border-[#918e8e34] flex p-3 gap-4 rounded-lg shadow'>
              <div className="flex-shrink-0 overflow-hidden">
                <img
                  src="/Placeholder 4.png"
                  alt="Course Thumbnail"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col flex-1 justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-800">4.6</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <BiStar key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(1.2K)</span>
                </div>
                <h3 className="font-semibold text-base text-[#000000E6] mb-2">
                  Certified Life Coach Training (Beginner to Advanced)
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Communication</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Negotiation</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">10+</span>
                </div>
                <div className="text-blue-600  text-lg font-semibold border border-blue-500 p-2 rounded-md w-28 flex items-center justify-center">₹1149.00</div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Credit/Debit Cards */}
            <div>
              <button
                onClick={() => toggleSection('creditCards')}
                className="flex items-center justify-between w-full text-left font-medium mb-3"
              >
                <span>Credit & Debit Cards</span>
                <BiPlus className={`w-4 h-4 transition-transform ${expandedSections.creditCards ? 'rotate-45' : ''}`} />
              </button>

              {expandedSections.creditCards && (
                <div className="space-y-3 border border-[#918e8e34] flex flex-col p-3 gap-4 rounded-lg">
                  {creditCards.map((card) => (
                    <div key={card.id} className='flex items-center justify-between mx-4'>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <img
                          src={`/Img/${card.logo}`}
                          alt={card.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.target.src = '/Img/default-card.png';
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{card.name}</div>
                          <div className="text-xs text-gray-500">{card.number}</div>
                        </div>
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleRemoveCard(card.id, e)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <BiTrash className="w-4 h-4" />
                        </button>
                        <input
                          type="radio"
                          name="payment"
                          value={card.id}
                          checked={selectedPayment === card.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setShowAddCardModal(true)}
                    className="flex items-center justify-center gap-2 text-gray-600 text-sm mt-3"
                  >
                    <BiPlus className="w-4 h-4 bg-[#715EFE1A] text-blue-600 rounded-full" />
                    Add New Card
                  </button>
                </div>
              )}
            </div>

            {/* UPI */}
            <div>
              <button
                onClick={() => toggleSection('upi')}
                className="flex items-center justify-between w-full text-left font-medium mb-3"
              >
                <span>UPI</span>
                <BiPlus className={`w-4 h-4 transition-transform ${expandedSections.upi ? 'rotate-45' : ''}`} />
              </button>

              {expandedSections.upi && (
                <div className="space-y-3 border border-[#918e8e34] flex flex-col p-3 gap-4 rounded-lg shadow'">
                  {upiOptions.map((option) => (
                    <div key={option.id} className='flex items-center justify-between mx-4'>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <img
                          src={`/Img/${option.logo}`}
                          alt={option.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.target.src = '/Img/default-upi.png';
                          }}
                        />
                        <span className="text-sm font-medium">{option.name}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleRemoveUpi(option.id, e)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <BiTrash className="w-4 h-4" />
                        </button>
                        <input
                          type="radio"
                          name="payment"
                          value={option.id}
                          checked={selectedPayment === option.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setShowAddUpiModal(true)}
                    className="flex items-center justify-center gap-2 text-gray-600 text-sm mt-3"
                  >
                    <BiPlus className="w-4 h-4 bg-[#715EFE1A] text-blue-600 rounded-full" />
                    Add New UPI
                  </button>
                </div>
              )}
            </div>

            {/* More Payment Options */}
            <div>
              <div className="font-medium mb-3">More Payment Options</div>
              <button className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <img src='/Img/bank.png' alt='Net Banking' className="w-6 h-6" />
                  <span className="text-sm font-medium">Net Banking</span>
                </div>
                <BiChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="px-6 py-4 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">₹999.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax & Fees</span>
              <span className="font-medium">₹150.00</span>
            </div>
            <div className="flex justify-between pt-3">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">₹1149.00</span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="font-bold text-lg">₹1149.00</div>
                <div className="text-sm text-gray-600">Bill will be Send on email</div>
              </div>
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                disabled={!selectedPayment}
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Add New Card</h3>
              <button onClick={() => setShowAddCardModal(false)} className="text-gray-500">
                <RxCross2 className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowAddCardModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCard}
                disabled={!newCard.name || !newCard.number || !newCard.expiry || !newCard.cvv}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add UPI Modal */}
      {showAddUpiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Add New UPI</h3>
              <button onClick={() => setShowAddUpiModal(false)} className="text-gray-500">
                <RxCross2 className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI App Name</label>
                <input
                  type="text"
                  value={newUpi.name}
                  onChange={(e) => setNewUpi({ ...newUpi, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. Google Pay, PhonePe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <input
                  type="text"
                  value={newUpi.upiId}
                  onChange={(e) => setNewUpi({ ...newUpi, upiId: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="yourname@upi"
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowAddUpiModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUpi}
                disabled={!newUpi.name || !newUpi.upiId}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Add UPI
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BuyCoursePopup;
