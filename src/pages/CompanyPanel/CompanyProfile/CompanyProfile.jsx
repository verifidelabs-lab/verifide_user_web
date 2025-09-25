import React, { useState } from 'react';
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
  Home,
  User,
  FileText,
  Briefcase,
  CheckCircle
} from 'lucide-react';

const CompanyProfile = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [editMode, setEditMode] = useState({});
  const [agencyData, setAgencyData] = useState({
    name: 'Musemind - Global UX Design Agency',
    tagline: 'An Experience Design Agency Focusing On Building Functional, Simple, Human-Centered Digital Products For Future.',
    overview: 'Musemind Is Creating Digital Experiences That Connect And Transform',
    description: 'With A Global Footprint In Dubai, Berlin, Riyadh, Dhaka, London, And New York, Musemind Is More Than A Web And UX Design Agency. We\'re A Collective Of UX Passionate Designers, Animators, Researchers, And Strategists, All Driven By A Shared Purpose: To Build Designs That Don\'t Just Look Good But Truly Resonate With Users And Transform Brands.',
    workDescription: 'Our Work Speaks For Itself: Trusted By Over 300 Clients From Innovative Startups Raising Millions To Established Fortune 100 Companies Like Microsoft, Salesforce, Indeed, Partner, Moley Pool, And Pool. We\'ve Been Privileged To Design For Businesses Across Diverse Industries Whether It\'s E-commerce, Metaverse, Tourism, AR/VR, Ed-Tech, Healthcare, Beauty, Or Agriculture, Our Cross-Industry Insights Empower Us To Bring Real Solutions That Elevate And Differentiate.',
    website: 'http://www.musemind.agency/',
    phone: '+971501968827',
    industry: 'Design Services',
    founded: '2020',
    companySize: '51-200 employees',
    verifiedSince: 'August 23, 2025',
    followers: '35K Followers',
    employees: '9,200 Employees',
    specialties: [
      'Networking Strategies',
      'Effective Communication',
      'Trust Development',
      'Conflict Resolution',
      'Team Collaboration',
      'Emotional Intelligence',
      'Interpersonal Skills',
      'Influence and Persuasion',
      'Negotiation Tactics',
      'Cultural Competence',
      'Building Rapport',
      'Feedback Mechanisms',
      'Mentorship Opportunities',
      'Community Engagement',
      'Long-term Partnerships',
      'Networking Events'
    ],
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop&crop=center'
  });

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
              className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={multiline === true ? 4 : multiline}
              placeholder={placeholder}
            />
          ) : (
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-2 transition-colors"
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


  // Main header with logo and company info
  const Header = () => (
    <div className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center">
                <div className="text-black text-2xl font-bold transform -skew-x-12">M</div>
              </div>
              <button className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                  className="text-white"
                />
              </h1>
              <p className="text-gray-300 text-sm max-w-xl leading-relaxed">
                <EditableField
                  value={agencyData.tagline}
                  onSave={updateAgencyData}
                  field="tagline"
                  multiline={2}
                  placeholder="Enter tagline"
                  className="text-gray-300"
                />
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span>Design Services</span>
                <span>•</span>
                <span>Dubai</span>
                <span>•</span>
                <span>35K Followers</span>
                <span>•</span>
                <span>9,200 Employees</span>
              </div>
            </div>
          </div>

          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Edit Page
          </button>
        </div>
      </div>
    </div>
  );

  // Navigation tabs
  const Navigation = () => (
    <div className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex">
          {['Home', 'About', 'Posts', 'Jobs', 'People'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm transition-colors ${activeTab === tab
                ? 'text-white border-b-2 border-white'
                : 'text-gray-300 hover:text-white'
                }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  const HomeTab = () => (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Overview Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Overview</h2>
              <Edit size={16} className="text-gray-400 cursor-pointer hover:text-white" />
            </div>

            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <p>
                <EditableField
                  value={agencyData.overview}
                  onSave={updateAgencyData}
                  field="overview"
                  multiline={2}
                  placeholder="Enter overview"
                  className="text-gray-300"
                />
              </p>

              <p>
                <EditableField
                  value={agencyData.description}
                  onSave={updateAgencyData}
                  field="description"
                  multiline={4}
                  placeholder="Enter description"
                  className="text-gray-300"
                />
              </p>

              <p>
                <EditableField
                  value={agencyData.workDescription}
                  onSave={updateAgencyData}
                  field="workDescription"
                  multiline={4}
                  placeholder="Enter work description"
                  className="text-gray-300"
                />
              </p>
            </div>
          </div>

          {/* Company Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Company info */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Globe className="text-gray-400 mt-0.5" size={16} />
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Website</div>
                    <div className="text-blue-400 hover:underline cursor-pointer">
                      <EditableField
                        value={agencyData.website}
                        onSave={updateAgencyData}
                        field="website"
                        type="url"
                        placeholder="Enter website URL"
                        className="text-blue-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-gray-400 mt-0.5" size={16} />
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Phone</div>
                    <div className="text-white">
                      <EditableField
                        value={agencyData.phone}
                        onSave={updateAgencyData}
                        field="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        className="text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-400 mt-0.5" size={16} />
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Verified page</div>
                    <div className="text-white">
                      <EditableField
                        value={agencyData.verifiedSince}
                        onSave={updateAgencyData}
                        field="verifiedSince"
                        placeholder="Enter verification date"
                        className="text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="text-gray-400 mt-0.5" size={16} />
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Industry</div>
                    <div className="text-white">
                      <EditableField
                        value={agencyData.industry}
                        onSave={updateAgencyData}
                        field="industry"
                        placeholder="Enter industry"
                        className="text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="text-gray-400 mt-0.5" size={16} />
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Company size</div>
                    <div className="text-white">
                      <EditableField
                        value={agencyData.companySize}
                        onSave={updateAgencyData}
                        field="companySize"
                        placeholder="Enter company size"
                        className="text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="text-gray-400 mt-0.5" size={16} />
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Founded</div>
                    <div className="text-white">
                      <EditableField
                        value={agencyData.founded}
                        onSave={updateAgencyData}
                        field="founded"
                        placeholder="Enter founding year"
                        className="text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Specialties */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {agencyData.specialties.slice(0, 16).map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs border border-gray-700"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AboutTab = () => (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">About Musemind</h2>
        <div className="space-y-8 text-gray-300">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Our Mission</h3>
            <EditableField
              value="To build designs that don't just look good but truly resonate with users and transform brands through human-centered digital experiences."
              onSave={updateAgencyData}
              field="mission"
              multiline={3}
              placeholder="Enter mission statement"
              className="text-gray-300"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Our Vision</h3>
            <EditableField
              value="To be the leading global UX design agency that creates meaningful digital products for the future."
              onSave={updateAgencyData}
              field="vision"
              multiline={3}
              placeholder="Enter vision statement"
              className="text-gray-300"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Global Presence</h3>
            <p>
              With offices in Dubai, Berlin, Riyadh, Dhaka, London, and New York, we bring diverse perspectives to every project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const PostsTab = () => {
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    const addPost = () => {
      if (newPost.title && newPost.content) {
        setPosts(prev => [...prev, {
          id: Date.now(),
          ...newPost,
          date: new Date().toISOString().split('T')[0],
          author: 'Musemind Team'
        }]);
        setNewPost({ title: '', content: '' });
        setShowAddForm(false);
      }
    };

    return (
      <div className="bg-gray-900 text-white min-h-screen">
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
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Add New Post</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Post title"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Post content"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addPost}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {posts.map(post => (
            <div key={post.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
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

  const JobsTab = () => {
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
      <div className="bg-gray-900 text-white min-h-screen">
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
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Add New Job</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Job title"
                  value={newJob.title}
                  onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                  className="p-3 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newJob.location}
                  onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                  className="p-3 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newJob.type}
                  onChange={(e) => setNewJob(prev => ({ ...prev, type: e.target.value }))}
                  className="p-3 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full mb-4 p-3 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={addJob}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Post Job
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {jobs.map(job => (
            <div key={job.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <div className="flex items-center gap-4 text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {job.location}
                    </span>
                    <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-sm">
                      {job.type}
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Apply Now
                </button>
              </div>
              <p className="text-gray-300">{job.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PeopleTab = () => {
    const [newPerson, setNewPerson] = useState({ name: '', position: '', bio: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    const addPerson = () => {
      if (newPerson.name && newPerson.position && newPerson.bio) {
        setPeople(prev => [...prev, {
          id: Date.now(),
          ...newPerson,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face'
        }]);
        setNewPerson({ name: '', position: '', bio: '' });
        setShowAddForm(false);
      }
    };

    return (
      <div className="bg-gray-900 text-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Our Team</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Team Member
            </button>
          </div>

          {showAddForm && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={newPerson.name}
                    onChange={(e) => setNewPerson(prev => ({ ...prev, name: e.target.value }))}
                    className="p-3 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={newPerson.position}
                    onChange={(e) => setNewPerson(prev => ({ ...prev, position: e.target.value }))}
                    className="p-3 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <textarea
                  placeholder="Bio"
                  value={newPerson.bio}
                  onChange={(e) => setNewPerson(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addPerson}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add Member
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.map(person => (
              <div key={person.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold mb-1">{person.name}</h3>
                <p className="text-blue-400 mb-3">{person.position}</p>
                <p className="text-gray-300 text-sm">{person.bio}</p>
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
      case 'Posts': return <PostsTab />;
      case 'Jobs': return <JobsTab />;
      case 'People': return <PeopleTab />;
      default: return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Navigation />
      {renderActiveTab()}
    </div>
  );
};

export default CompanyProfile;



