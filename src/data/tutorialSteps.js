export const dashboardTourSteps = [
  {
    target: "[data-tour='header-home']",
    content: "This is your **Home feed**. Here you can see all updates, posts, and notifications relevant to you. Use it to stay up-to-date with your network and activities.",
    placement: "bottom",
    page: "/user/feed",
  },
  {
    target: "[data-tour='header-courses']",
    content: "This is the **Courses section**. You can explore recommended courses based on your interests and skill levels. Click a course to see details and enroll.",
    placement: "bottom",
    page: "/user/course/recommended",
  },
  {
    target: "[data-tour='header-assessment']",
    content: "Here you can access **Assessments**. Take these tests to evaluate your current skills and track your progress over time.",
    placement: "bottom",
    page: "/user/assessment",
  },
  {
    target: "[data-tour='header-opportunities']",
    content: "This is the **Opportunities section**. Find job openings, projects, or internships relevant to your profile. Click on an opportunity for details.",
    placement: "bottom",
    page: "/user/opportunitiess",
  },
  {
    target: "[data-tour='opportunity-filter']",
    content: "Use these **filters** to quickly narrow down opportunities. Filter by location, skills, or type to find the most relevant options.",
    placement: "right",
    page: "/user/opportunitiess",
  },
  {
    target: "[data-tour='opportunity-card']",
    content: "Each **opportunity card** shows a summary of the position or project. Click on it to view full details including description, requirements, and application steps.",
    placement: "top",
    page: "/user/opportunitiess",
  },
  {
    target: "[data-tour='apply-button']",
    content: "Click this **Apply button** to submit your application for the opportunity. Make sure your profile is updated to increase your chances of selection.",
    placement: "top",
    page: "/user/opportunitiess",
  },
  {
    target: "[data-tour='header-quest']",
    content: "This is your **Quests section**. Track challenges, learning tasks, and gamified activities. Completing quests can help you gain experience and badges.",
    placement: "bottom",
    page: "/user/quest",
  },
];

export const profileTourSteps = [
  {
    target: "[data-tour='profile-dropdown']",
    content: "Click your **profile avatar** to open the dropdown menu. Here you can manage your personal account, access settings, or switch between multiple accounts.",
    placement: "left",
    page: "/user/feed",
  },
  {
    target: "[data-tour='companies-dropdown']",
    content: "This is the **Companies dropdown**. Click here to view all companies you belong to. You can also switch between companies or manage their settings.",
    placement: "right",
    page: "/user/feed",
  },
  {
    target: "[data-tour='company-list']",
    content: "Here is the **list of your registered companies**. Select any company to switch your account context and manage company-specific features.",
    placement: "right",
    page: "/user/feed",
  },
  {
    target: "[data-tour='institutions-dropdown']",
    content: "This is the **Institutions dropdown**. Click to view all institutions you are connected to. You can manage each institution or switch your account context.",
    placement: "right",
    page: "/user/feed",
  },
  {
    target: "[data-tour='institution-list']",
    content: "Here is the **list of institutions** you belong to or manage. Select any institution to switch your account or manage institution-specific features.",
    placement: "right",
    page: "/user/feed",
  },
];


export const opportunitiesTourSteps = [
  {
    target: "[data-tour='opportunity-filter']",
    content: "Use the **filter panel** to quickly sort opportunities. You can filter by skills, job type, location, or other criteria to find the most suitable options.",
    placement: "right",
    page: "/user/opportunitiess",
  },
  {
    target: "[data-tour='opportunity-card']",
    content: "Each **opportunity card** gives a summary of a position or project. Click the card to view full details, including description, requirements, and deadlines.",
    placement: "top",
    page: "/user/opportunitiess",
  },
  {
    target: "[data-tour='apply-button']",
    content: "Click the **Apply button** to submit your application for the opportunity. Ensure your profile and documents are updated before applying.",
    placement: "top",
    page: "/user/opportunitiess",
  },
];


// Courses Page Steps
export const coursesTourSteps = [
  {
    target: "[data-tour='course-list']",
    content: "Here are your recommended courses.",
    placement: "top",
    page: "/user/course/recommended",
  },
  // {
  //   target: "[data-tour='course-card']",
  //   content: "Click a course to see details and enroll.",
  //   placement: "top",
  //   page: "/user/course/recommended",
  // },
  // {
  //   target: "[data-tour='enroll-button']",
  //   content: "Enroll in a course using this button.",
  //   placement: "top",
  //   page: "/user/course/recommended",
  // },
];

// Assessment Page Steps
export const assessmentTourSteps = [
  // {
  //   target: "[data-tour='assessment-list']",
  //   content: "View all available assessments here.",
  //   placement: "right",
  //   page: "/user/assessment",
  // },
  {
    target: "[data-tour='start-assessment']",
    content: "Click to start an assessment and test your skills.",
    placement: "top",
    page: "/user/assessment",
  },
];

// Full Automated Tour (merge all in order)
export const fullTourSteps = [
  ...dashboardTourSteps,
    ...profileTourSteps,
  // ...coursesTourSteps,
  // ...opportunitiesTourSteps,
  // ...assessmentTourSteps,
];
