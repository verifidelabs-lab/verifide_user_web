import React, { useCallback, useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Mail, MapPin, Shield } from 'lucide-react';
import PeopleToConnect from '../../../components/ui/ConnectSidebar/ConnectSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { suggestedUser } from '../../../redux/Users/userSlice';
import { verificationCenterList } from '../../../redux/CompanySlices/courseSlice';
import { Link } from 'react-router-dom';

const CompanyDashboard = ({
    searchAppearances = 57,
    searchAppearancesChange = 32.6,
    newFollowers = 200,
    newFollowersChange = -32.6,
    postImpressions = 344,
    postImpressionsChange = 113.7,
    pageVisitors = 7,
    actions = [],
}) => {
    const defaultActions = [
        {
            id: 1,
            avatar:
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            title: 'New verify request from Asif Ali',
            description: 'Your verification request is pending approval.',
            buttonText: 'Verify Now',
            buttonColor: 'bg-blue-600 hover:bg-blue-700',
        },
    ];

    // const actionsToShow = actions.length > 0 ? actions  : defaultActions;

    const MetricCard = ({ value, label, change, isPositive }) => (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
                <div className="text-sm text-blue-600 font-medium">{label}</div>
            </div>
            {change !== null && (
                <div className="flex items-center text-sm">
                    {isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span
                        className={`font-medium mr-1 ${isPositive ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {change}%
                    </span>
                    <span className="text-gray-500">last 7 days</span>
                </div>
            )}
            {change === null && (
                <div className="text-sm text-gray-500">Last 7 days</div>
            )}
        </div>
    );

    const ActionCard = ({ action }) => {
        return (
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">

                            <img
                                src={'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
                                }
                                alt="User avatar"
                                className="w-12 h-12 rounded-full object-cover"
                            />

                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                                {action?.user_id?.first_name} {action?.user_id?.last_name}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {"Your verification request is pending approval."}
                            </p>
                        </div>
                    </div>
                    <button
                        className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ml-4 flex-shrink-0 ${action.buttonColor}`}
                    >
                        <Link to={"/company/verification"}>
                            Verify Now
                        </Link>
                    </button>
                </div>
            </div>
        );
    };

    const [activeTab, setActiveTab] = useState('user');
    const dispatch = useDispatch()
    const selector = useSelector((state) => state.companyCourse);

    const { getVerificationCenterList: { data } = {} } = selector || {};
    const actionsToShow = data?.data?.list?.length > 0 ? data?.data?.list : defaultActions;

    const userSelector = useSelector((state) => state.user);
    const { suggestedUserData: { data: suggestedUsers } = {} } =
        userSelector || {};
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
            console.log("error", error)
        } finally {
        }
    }, [dispatch]);
    useEffect(() => {
        fetchRequestList(1, "");
    }, [fetchRequestList]);
    return (
        <div className="bg-[#F6FAFD] p-6 min-h-screen">
            <div className="flex flex-col md:flex-row w-full mx-auto gap-6">
                {/* Left Section */}
                <div className="xl:w-[75%] lg:w-[70%] md:w-[60%] w-full space-y-6">
                    {/* Header */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Track Performance
                        </h1>
                        <p className="text-gray-600">
                            Grow your Page 3x faster by leveraging insights and analytics
                        </p>
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
                            <MetricCard
                                value={searchAppearances}
                                label="Search appearances"
                                change={searchAppearancesChange}
                                isPositive={searchAppearancesChange > 0}
                            />
                            <MetricCard
                                value={newFollowers}
                                label="New followers"
                                change={newFollowersChange}
                                isPositive={newFollowersChange > 0}
                            />
                            <MetricCard
                                value={postImpressions}
                                label="Post impressions"
                                change={postImpressionsChange}
                                isPositive={postImpressionsChange > 0}
                            />
                            <MetricCard value={pageVisitors} label="Page visitors" change={null} />
                        </div>
                    </div>



                    {/* Actions Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Today's actions
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Pages that complete these actions regularly grow 4x faster
                        </p>

                        <div className="space-y-4">
                            {actionsToShow.map((action) => (
                                <ActionCard key={action.id} action={action} />
                            ))}
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
