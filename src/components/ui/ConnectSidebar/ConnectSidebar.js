import React, { useState } from 'react';
import PersonCard from '../cards/PersonCard';
import { useDispatch } from 'react-redux';
import { createUserConnection, followUnfollowUsers, suggestedUser, } from '../../../redux/Users/userSlice';
import { useNavigate, } from 'react-router-dom';
import { toast } from 'sonner';


const PeopleToConnect = ({ data, activeTab, setActiveTab }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [connectedIds, setConnectedIds] = useState([]);
  const [loading, setLoading] = useState(false)

  const [loadingIds, setLoadingIds] = useState([]);

  const handleConnect = async (data) => {

    if (!data?.user_path) {
      navigate(`/user/profile/${data?.first_name}/${data?._id}`);

    } else {
      let name = data?.user_path === 'Companies' ? 'companies' : 'institutions'
      navigate(`/user/view-details/${name}/${data?._id}`)
    }
  };

  // const handleConnectUser = async (data) => {
  //   const userId = data._id;

  //   if (data?.user_path === 'Companies' || data?.user_path === "Institutions") {
  //     await dispatch(followUnfollowUsers({
  //       target_id: data?._id,
  //       target_model: data?.user_path
  //     })).unwrap();
  //   } else {
  //     try {
  //       setLoading(true);
  //       setLoadingIds(prev => [...prev, userId]);
  //       const res = await dispatch(createUserConnection({ connection_user_id: data?._id })).unwrap();
  //       if (res) {
  //         setConnectedIds(prev => [...prev, userId]);
  //         dispatch(suggestedUser({ page: 1, size: 10 }));
  //         toast.success(res?.message);
  //       }
  //     } catch (error) {
  //       toast.error(error);
  //     } finally {
  //       setLoading(false);
  //       setLoadingIds(prev => prev.filter(id => id !== userId));
  //     }
  //   }
  // }

  const handleConnectUser = async (data) => {
    const userId = data._id;

    try {
      setLoading(true);
      setLoadingIds(prev => [...prev, userId]);

      switch (data?.user_path) {
        case "Companies":
        case "Institutions": {
          const res = await dispatch(followUnfollowUsers({
            target_id: userId,
            target_model: data?.user_path
          })).unwrap();

          if (res) {
            dispatch(suggestedUser({ page: 1, size: 10, type: data?.user_path.toLowerCase() }));
            toast.success(res?.message || "Action completed successfully");
          }
          break;
        }

        default: {
          const res = await dispatch(createUserConnection({
            connection_user_id: userId
          })).unwrap();

          if (res) {
            setConnectedIds(prev => [...prev, userId]);
            dispatch(suggestedUser({ page: 1, size: 10 }));
            toast.success(res?.message);
          }
          break;
        }
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
      setLoadingIds(prev => prev.filter(id => id !== userId));
    }
  };


  return (
    <div className="overflow-hidden bg-[#FFFFFF] rounded-2xl  p-2">
      <div className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl p-1 flex">
        {[
          { key: "user", label: "User" },
          { key: "companies", label: "Companies" },
          { key: "institutions", label: "Institute" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 
        ${activeTab === tab.key
                ? "bg-white text-[#2563EB] shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>


      <div>
        {data && data?.length > 0 ? data?.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            isConnected={connectedIds.includes(person._id)}
            isLoading={loadingIds.includes(person._id)}
            handleConnect={handleConnect}
            handleConnectUser={handleConnectUser}
            loading={loading}
          />
        )) : <></>}
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <button className="w-full font-medium text-blue-600 transition-colors hover:text-blue-700"
          onClick={() => navigate(`/user/suggested-users?tab=${activeTab}`)}>
          Explore
        </button>
      </div>
    </div>
  );
};

export default PeopleToConnect;