import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiUrl, BaseUrl } from "../components/hooks/axiosProvider";
import Button from "../components/ui/Button/Button";

const UserCertificate = () => {
    const { id } = useParams(); // from URL /certtificate-view/:id
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUserData] = useState(null)

    // helper: convert timestamp → readable date
    const convertTimestampToDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const fetchData = async () => {
        try {
            const res = await fetch(
                `${apiUrl}user/certifications/view?certificate_id=${id}`,
                { method: "GET" }
            );
            if (!res.ok) throw new Error("Failed to fetch");

            const result = await res.json();
            if (result.error) throw new Error(result.message);

            setData(result.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!data) return null;
    console.log("datadatadatadata", data)
    const username = `${data.user_id?.first_name} ${data.user_id?.last_name}`;
    const certificateName = data?.name ||"Essential Business Communication Skills"; // or from API if you have
    const issueBy = data.issuing_organization;
    const skills = data.skills_acquired;
    const date = data.issue_date;
    const certificateUrlOrNumber = data.credential_id;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-50">

            <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo.png"
                            alt="logo"
                            className="md:h-8 h-6 md:w-full w-28  transition-transform duration-300 hover:scale-105"
                        />
                    </div>

                </div>
                <div className="flex items-center space-x-6">

                    {(isUserData) ? (
                        <>
                            <ul className='flex justify-start items-center gap-6 font-semibold text-sm'>
                                <li >
                                    <Link to={`/user/feed`} className='hover:text-blue-500 bg-gray-50 rounded-full transition-all duration-300 hover:scale-100'>Home</Link>
                                </li>
                                <li className='md:block hidden'>
                                    <Link to={`/user/profile`} className='hover:text-blue-500 bg-gray-50 rounded-full transition-all duration-300 hover:scale-100'>Profile</Link>
                                </li>
                                <li className='md:block hidden'>
                                    <Link to={`/user/connections`} className='hover:text-blue-500 bg-gray-50 rounded-full transition-all duration-300 hover:scale-100'>Connections</Link>
                                </li>
                            </ul>
                            <div className='flex justify-start gap-2 items-center'>
                                <img src={isUserData.personalInfo?.profile_picture_url} alt='user' className='w-8 h-8 rounded-full border' />
                                <h2>{isUserData.personalInfo?.username}</h2>
                            </div>
                        </>
                    ) :
                        <Button>
                            <Link to={`${BaseUrl}`}>Sign In</Link>
                        </Button>
                    }


                </div>
            </nav>
            <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-white">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <img src="/logo.png" alt="Watermark" className="w-96 h-96 object-contain" />
                </div>

                {/* Header */}
                <div className="bg-blue-400 px-8 py-6 flex justify-center border-b border-gray-200 relative z-10">
                    <div className="flex items-center space-x-2">
                        <img src="/logo.png" alt="logo" className="" />
                        <span className="text-white text-2xl font-semibold">Learning</span>
                    </div>
                </div>

                {/* Body */}
                <div className="px-12 py-10 relative z-10">
                    {/* Title */}
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-semibold text-gray-800 leading-relaxed max-w-2xl mx-auto">
                            Verifide Learning {certificateName} <br /> Professional Certificate
                        </h1>
                        <p className="mt-3 text-gray-600 text-sm italic">
                            This is to certify that <span className="font-semibold text-gray-900">{username}</span> successfully
                            completed the learning path.
                        </p>
                    </div>

                    {/* Certificate Name */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-blue-700 leading-relaxed max-w-2xl mx-auto">
                            {certificateName}
                        </h2>
                        <p className="mt-2 text-gray-500 text-sm">Issued by {issueBy}</p>
                    </div>

                    {/* Date */}
                    <div className="text-center mb-8">
                        <p className="text-gray-700 text-lg font-medium">
                            Awarded on {convertTimestampToDate(date)}
                        </p>
                    </div>

                    {/* Skills */}
                    {skills?.length > 0 && (
                        <div className="text-center mb-10">
                            <h3 className="text-gray-700 mb-4 text-base font-semibold">Top Skills Covered</h3>
                            <div className="flex justify-center flex-wrap gap-3">
                                {skills.slice(0, 3).map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center mt-12 border-t pt-6">
                        <p className="text-sm text-gray-600 tracking-wide">
                            Certificate ID: <span className="font-medium text-gray-800">{certificateUrlOrNumber}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCertificate;
