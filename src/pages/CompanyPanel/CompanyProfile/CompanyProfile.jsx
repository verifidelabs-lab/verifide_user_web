import React, { useEffect, useState } from 'react';
import {
  Edit,
  Globe,
  Phone,
  Mail,
  Users,
  Calendar,
  MapPin,
  Building,
  Award,
  Camera,
  Save,
  X,
  CheckCircle
} from 'lucide-react';
import PeopleToConnect from '../../../components/ui/ConnectSidebar/ConnectSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { suggestedUser } from '../../../redux/Users/userSlice';
import { companiesProfile } from '../../../redux/CompanySlices/CompanyAuth';
import { Link } from 'react-router-dom';

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [editMode, setEditMode] = useState({});
  const [agencyData, setAgencyData] = useState(
    {});

  const [activeTab1, setActiveTab1] = useState('user');
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const { suggestedUserData: { data: suggestedUsers } = {} } = userSelector || {};

  useEffect(() => {
    dispatch(suggestedUser({ page: 1, size: 10, type: activeTab1 }));
  }, [dispatch, activeTab1]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'The Future of UX Design',
      content: 'Exploring emerging trends in user experience design and how they shape digital experiences...',
      date: '2025-09-20',
      author: 'Musemind Team'
    },
    {
      id: 2,
      title: 'Building Digital Products That Scale',
      content: 'Our comprehensive approach to creating scalable digital solutions for modern businesses...',
      date: '2025-09-18',
      author: 'Design Team'
    }
  ]);

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior UX Designer',
      location: 'Dubai, UAE',
      type: 'Full-time',
      description: 'We are looking for a Senior UX Designer to join our growing team and help shape the future of digital experiences...'
    },
    {
      id: 2,
      title: 'Frontend Developer',
      location: 'Remote',
      type: 'Full-time',
      description: 'Join our development team to build amazing digital experiences using cutting-edge technologies...'
    }
  ]);

  const [people, setPeople] = useState([
    {
      id: 1,
      name: 'John Smith',
      position: 'Creative Director',
      bio: 'Leading creative vision with 10+ years of experience in digital design and user experience.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      position: 'UX Research Lead',
      bio: 'Passionate about user research and data-driven design decisions that create meaningful experiences.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c46c?w=400&h=400&fit=crop&crop=face'
    }
  ]);

  const updateAgencyData = (field, value) => {
    setAgencyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const EditableField = ({
    value,
    onSave,
    field,
    multiline = false,
    placeholder = "Enter text...",
    type = "text",
    className = ""
  }) => {
    const [tempValue, setTempValue] = useState(value);
    const [editing, setEditing] = useState(false);

    const handleSave = () => {
      onSave(field, tempValue);
      setEditing(false);
    };

    const handleCancel = () => {
      setTempValue(value);
      setEditing(false);
    };

    if (editing) {
      return (
        <div className="space-y-3">
          {multiline ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={multiline === true ? 4 : multiline}
              placeholder={placeholder}
            />
          ) : (
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={placeholder}
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 flex items-center gap-2 transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`group relative ${className}`}>
        <div className={multiline ? "whitespace-pre-wrap" : ""}>{value}</div>
        <button
          onClick={() => setEditing(true)}
          className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-blue-400"
        >
          <Edit size={16} />
        </button>
      </div>
    );
  };
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const res = await dispatch(companiesProfile()).unwrap();
        const data = res?.data;

        if (data) {
          setAgencyData({
            name: data.display_name || data.name || '',
            tagline: '', // no tagline in API, you can set default or empty
            overview: data.description || '',
            description: data.description || '',
            workDescription: '', // no workDescription in API
            website: data.website_url || '',
            phone: data.phone_no || '',
            industry: data.industry?.map(i => i.name).join(', ') || '',
            founded: data.founded_year ? new Date(data.founded_year * 1000).getFullYear().toString() : '',
            companySize: data.company_size || '',
            verifiedSince: data.verified_at ? new Date(data.verified_at).toLocaleDateString() : '',
            followers: data.follower_count ? `${data.follower_count} Followers` : '0 Followers',
            employees: data.employee_count ? `${data.employee_count} Employees` : '0 Employees',
            specialties: data.specialties || [],
            logo: data.logo_url || ''
          });
        }
      } catch (error) {
        console.error("Failed to fetch company profile:", error);
      }
    };

    fetchCompanyProfile();
  }, [dispatch]);
  // Header
  const Header = () => (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-black text-2xl font-bold transform -skew-x-12">M</div>
            </div>
            <button className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={20} />
            </button>
          </div>

          <div>
            <h1 className="text-xl font-semibold mb-1">
              <EditableField
                value={agencyData.name}
                onSave={updateAgencyData}
                field="name"
                placeholder="Enter agency name"
                className="text-gray-900"
              />
            </h1>
            <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
              <EditableField
                value={agencyData.tagline}
                onSave={updateAgencyData}
                field="tagline"
                multiline={2}
                placeholder="Enter tagline"
                className="text-gray-500"
              />
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span>{agencyData.industry}</span>
              <span>•</span>
              <span>{agencyData.founded}</span>
              <span>•</span>
              <span>{agencyData.followers}</span>
            </div>
          </div>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" >
          <Link to={"/company/update-profile"} >
            Edit Page
          </Link>
        </button>
      </div>
    </div>
  );

  // Navigation
  const Navigation = () => (
    <div className="mt-6">
      <nav className="flex border-b border-gray-200">
        {['Home', 'About', 'Posts', 'Jobs', 'People'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 text-sm font-medium transition-colors ${activeTab === tab
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-blue-600'
              }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );

  // ---- TABS ----
  const HomeTab = () => (
    <div className="mt-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
          Overview <Edit className="text-gray-400" size={16} />
        </h2>
        <div className="text-gray-600 space-y-2">
          <EditableField
            value={agencyData.overview}
            onSave={updateAgencyData}
            field="overview"
            multiline={2}
          />
          <EditableField
            value={agencyData.description}
            onSave={updateAgencyData}
            field="description"
            multiline={4}
          />
          <EditableField
            value={agencyData.workDescription}
            onSave={updateAgencyData}
            field="workDescription"
            multiline={4}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Globe className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Website</div>
                <EditableField
                  value={agencyData.website}
                  onSave={updateAgencyData}
                  field="website"
                  type="url"
                  className="text-blue-600"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Phone</div>
                <EditableField
                  value={agencyData.phone}
                  onSave={updateAgencyData}
                  field="phone"
                  type="tel"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Verified since</div>
                <EditableField
                  value={agencyData.verifiedSince}
                  onSave={updateAgencyData}
                  field="verifiedSince"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Industry</div>
                <EditableField
                  value={agencyData.industry}
                  onSave={updateAgencyData}
                  field="industry"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Company size</div>
                <EditableField
                  value={agencyData.companySize}
                  onSave={updateAgencyData}
                  field="companySize"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-gray-400 mt-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs mb-1">Founded</div>
                <EditableField
                  value={agencyData.founded}
                  onSave={updateAgencyData}
                  field="founded"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {agencyData.specialties?.map((s, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs border border-gray-200">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AboutTab = () => (
    <div className="mt-6 space-y-6 text-gray-700">
      <h2 className="text-2xl font-bold text-gray-900">About Musemind</h2>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Our Mission</h3>
        <EditableField
          value="To build designs that don't just look good but truly resonate with users and transform brands through human-centered digital experiences."
          onSave={updateAgencyData}
          field="mission"
          multiline={3}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Our Vision</h3>
        <EditableField
          value="To be the leading global UX design agency that creates meaningful digital products for the future."
          onSave={updateAgencyData}
          field="vision"
          multiline={3}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Global Presence</h3>
        <p>With offices in Dubai, Berlin, Riyadh, Dhaka, London, and New York, we bring diverse perspectives to every project.</p>
      </div>
    </div>
  );

  // PostsTab, JobsTab, PeopleTab code is similar to your original but with white theme and gray tones
  // For brevity, I can provide all of them if you want, fully styled in the white theme.
  // -------------------- POSTS TAB --------------------
  const PostsTab = ({ posts, setPosts }) => {
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    const addPost = () => {
      if (newPost.title && newPost.content) {
        setPosts(prev => [
          ...prev,
          {
            id: Date.now(),
            ...newPost,
            date: new Date().toISOString().split('T')[0],
            author: 'Musemind Team'
          }
        ]);
        setNewPost({ title: '', content: '' });
        setShowAddForm(false);
      }
    };

    return (
      <div className="bg-white-900 text-black min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Posts</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add New Post
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Add New Post</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Post title"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost(prev => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Post content"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost(prev => ({ ...prev, content: e.target.value }))
                  }
                  rows={4}
                  className="w-full p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addPost}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-white-600 text-black rounded hover:bg-white-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {posts.map(post => (
            <div key={post.id} className="bg-white-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-400 text-sm mb-3">
                By {post.author} • {new Date(post.date).toLocaleDateString()}
              </p>
              <p className="text-gray-300">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const JobsTab = ({ jobs, setJobs }) => {
    const [newJob, setNewJob] = useState({ title: '', location: '', type: 'Full-time', description: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    const addJob = () => {
      if (newJob.title && newJob.location && newJob.description) {
        setJobs(prev => [...prev, { id: Date.now(), ...newJob }]);
        setNewJob({ title: '', location: '', type: 'Full-time', description: '' });
        setShowAddForm(false);
      }
    };

    return (
      <div className="bg-white-900 text-black min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Open Positions</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add New Job
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Add New Job</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Job title"
                  value={newJob.title}
                  onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                  className="p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newJob.location}
                  onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                  className="p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newJob.type}
                  onChange={(e) => setNewJob(prev => ({ ...prev, type: e.target.value }))}
                  className="p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <textarea
                placeholder="Job description"
                value={newJob.description}
                onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full mb-4 p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button onClick={addJob} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Post Job</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Cancel</button>
              </div>
            </div>
          )}

          {jobs.map(job => (
            <div key={job.id} className="bg-white-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <div className="flex items-center gap-4 text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} /> {job.location}
                    </span>
                    <span className="px-2 py-1 bg-blue-600 text-white rounded rounded text-white">{job.type}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Apply Now</button>
              </div>
              <p className="text-gray-600 text-sm">{job.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };


  const PeopleTab = ({ people, setPeople }) => {
    const [newPerson, setNewPerson] = useState({ name: '', position: '', bio: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    const addPerson = () => {
      if (newPerson.name && newPerson.position && newPerson.bio) {
        setPeople(prev => [
          ...prev,
          {
            id: Date.now(),
            ...newPerson,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face'
          }
        ]);
        setNewPerson({ name: '', position: '', bio: '' });
        setShowAddForm(false);
      }
    };

    return (
      <div className="bg-white-900 text-black min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Our Team</h2>
            <button onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Team Member</button>
          </div>

          {showAddForm && (
            <div className="px-4 py-2 bg-white-600 text-black rounded hover:bg-white-700">
              <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full name" value={newPerson.name} onChange={(e) => setNewPerson(prev => ({ ...prev, name: e.target.value }))} className="p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="Position" value={newPerson.position} onChange={(e) => setNewPerson(prev => ({ ...prev, position: e.target.value }))} className="p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <textarea placeholder="Bio" value={newPerson.bio} onChange={(e) => setNewPerson(prev => ({ ...prev, bio: e.target.value }))} rows={3} className="w-full p-3 bg-white-700 border border-gray-600 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="flex gap-2">
                  <button onClick={addPerson} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Member</button>
                  <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.map(person => (
              <div key={person.id} className="bg-white-800 rounded-lg p-6 border border-gray-700 text-center">
                <img src={person.avatar} alt={person.name} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="text-lg font-semibold mb-1">{person.name}</h3>
                <p className="text-blue-400 mb-3">{person.position}</p>
                <p className="text-gray-600 text-sm">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };


  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Home': return <HomeTab />;
      case 'About': return <AboutTab />;
      // case 'Posts': return <PostsTab setPosts={setPosts} />;
      case 'Posts': return <PostsTab posts={posts} setPosts={setPosts} />;
      case 'Jobs': return <JobsTab jobs={jobs} setJobs={setJobs} />;
      case 'People': return <PeopleTab people={people} setPeople={setPeople} />;
      default: return <HomeTab />;
    }
  };

  return (
    <div className="bg-gray-50   p-6">
      <div className="flex flex-col md:flex-row gap-6   ">
        <div className="w-full md:w-3/4 space-y-6">
          <Header />
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <Navigation />
            {renderActiveTab()}
          </div>
        </div>
        <div className="w-full md:w-1/4 hidden md:block">
          <div className="sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <PeopleToConnect
              data={suggestedUsers?.data?.list || []}
              activeTab={activeTab1}
              setActiveTab={setActiveTab1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
