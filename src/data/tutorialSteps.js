export const dashboardTourSteps = [
  {
    target: '[data-tour="header-home"]',
    title: "🏠 Home",
    content: "Go to your dashboard feed from here",
    placement: "bottom",
    page: "/user/feed",        // <-- add this
  },
  {
    target: '[data-tour="header-courses"]',
    title: "📚 Courses",
    content: "Browse recommended courses to upskill",
    placement: "bottom",
    page: "/user/course/recommended",  // <-- add this
  },
  {
    target: '[data-tour="header-assessment"]',
    title: "🎯 Assessment",
    content: "Take assessments and track your progress",
    placement: "bottom",
    page: "/user/assessment",  // <-- add this
  },
  {
    target: '[data-tour="header-opportunities"]',
    title: "💼 Opportunities",
    content: "Find jobs or internships matching your profile",
    placement: "bottom",
    page: "/user/opportunitiess",  // <-- add this
  },
  {
    target: '[data-tour="header-quest"]',
    title: "🧩 Quest",
    content: "Create or participate in quests",
    placement: "bottom",
    page: "/user/quest",  // <-- add this
  },
];



export const opportunitiesTourSteps = [
  {
    target: '[data-tour="search-bar"]',
    content: "Search for jobs using keywords, job titles, company names, or skills.",
    placement: "bottom",
    disableBeacon: true,
    page: "/opportunitiess",
  },
  {
    target: '[data-tour="filters"]',
    content: "Use filters to narrow down your results.",
    placement: "right",
    page: "/opportunitiess",
  },
];

export const coursesTourSteps = [
  {
    target: '[data-tour="course-nav"]',
    content: "Browse courses by category.",
    placement: "bottom",
    disableBeacon: true,
    page: "/course/recommended",
  },
  {
    target: '[data-tour="course-card"]',
    content: "View detailed course information.",
    placement: "right",
    page: "/course/recommended",
  },
];

export const assessmentTourSteps = [
  {
    target: '[data-tour="test-categories"]',
    content: "Choose from various assessment types.",
    placement: "bottom",
    disableBeacon: true,
    page: "/assessment",
  },
  {
    target: '[data-tour="test-card"]',
    content: "View each assessment's details.",
    placement: "right",
    page: "/assessment",
  },
];
