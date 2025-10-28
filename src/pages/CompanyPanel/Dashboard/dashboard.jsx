import React, { useCallback, useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Mail, MapPin, Shield } from 'lucide-react';
import PeopleToConnect from '../../../components/ui/ConnectSidebar/ConnectSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { suggestedUser } from '../../../redux/Users/userSlice';
import { verificationCenterList } from '../../../redux/CompanySlices/courseSlice';
import { Link } from 'react-router-dom';
import NoDataFound from '../../../components/ui/No Data/NoDataFound';

const CompanyDashboard = ({
  companiesProfileData,
  searchAppearancesChange = 32.6,
  newFollowersChange = -32.6,
}) => {

  const dispatch = useDispatch();
  const selector = useSelector((state) => state.companyCourse);
  const { getVerificationCenterList: { data } = {} } = selector || {};
  const actionsToShow = data?.data?.list?.length > 0 && data?.data?.list;

  const userSelector = useSelector((state) => state.user);
  const { suggestedUserData: { data: suggestedUsers } = {} } = userSelector || {};

  const [activeTab, setActiveTab] = useState('user');

  useEffect(() => {
    dispatch(suggestedUser({ page: 1, size: 10, type: activeTab }));
  }, [dispatch, activeTab]);

  const fetchRequestList = useCallback(async (page = 1) => {
    const payload = {
      page: 1,
      size: 5,
      status: "PENDING",
      document_model: ""
    };
    try {
      await dispatch(verificationCenterList(payload)).unwrap();
    } catch (error) {
      console.log("error", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchRequestList(1);
  }, [fetchRequestList]);

  const MetricCard = ({ value, label }) => (
    <div className="glassy-card rounded-2xl p-6 shadow-md border border-var(--border-color) hover:shadow-lg transition-all duration-200">
      <div>
        <div className="text-3xl font-bold glassy-text-primary mb-1">{value}</div>
        <div className="text-sm glassy-text-secondary font-medium">{label}</div>
      </div>
    </div>
  );

  const ActionCard = ({ action }) => (
    <div className="glassy-card rounded-2xl p-5 shadow-md border border-var(--border-color) hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0">
            <img
              src={'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
              alt="User avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold glassy-text-primary mb-1 text-sm">
              {action?.user_id?.first_name} {action?.user_id?.last_name}
            </h3>
            <p className="text-sm glassy-text-secondary leading-relaxed">
              {"Your verification request is pending approval."}
            </p>
          </div>
        </div>
        <button className={`glassy-button ml-4 flex-shrink-0`}>
          <Link to={"/company/verification"}>Verify Now</Link>
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen ">
      <div className="flex flex-col md:flex-row w-full mx-auto gap-6">
        {/* Left Section */}
        <div className="xl:w-[75%] lg:w-[70%] md:w-[60%] w-full space-y-6">
          {/* Header */}
          <div className="glassy-card p-6 rounded-2xl shadow-md border border-var(--border-color)">
            <h1 className="text-2xl font-bold glassy-text-primary mb-2">Track Performance</h1>
            <p className="glassy-text-secondary">
              Grow your Page 3x faster by leveraging insights and analytics
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
              <MetricCard value={companiesProfileData?.employee_count} label="Employers" />
              <MetricCard value={companiesProfileData?.follower_count} label="Followers" />
            </div>
          </div>

          {/* Actions Section */}
          <div className="glassy-card p-6 rounded-2xl shadow-md border border-var(--border-color)">
            <h2 className="text-xl font-bold glassy-text-primary mb-2">Today's actions</h2>
            <p className="glassy-text-secondary mb-6">
              Pages that complete these actions regularly grow 4x faster
            </p>
            <div className="space-y-4">
              {actionsToShow && actionsToShow.length > 0 ? (
                actionsToShow.map((action) => <ActionCard key={action.id} action={action} />)
              ) : (
                <NoDataFound />
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:w-[25%] lg:w-[30%] md:w-[40%] hidden md:block">
          <div className="sticky top-6 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto hide-scrollbar">
            <PeopleToConnect
              data={suggestedUsers?.data?.list || []}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
