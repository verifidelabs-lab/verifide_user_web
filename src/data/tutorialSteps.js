// Dashboard Header Steps
export const dashboardTourSteps = [
  {
    target: "[data-tour='header-home']",
    content: "This is your home feed where you see all updates.",
    placement: "bottom",
    page: "/user/feed",
  },
  {
    target: "[data-tour='header-courses']",
    content: "Check out recommended courses here.",
    placement: "bottom",
    page: "/user/course/recommended",
  },
  {
    target: "[data-tour='header-assessment']",
    content: "Take assessments to evaluate your skills.",
    placement: "bottom",
    page: "/user/assessment",
  },
  {
    target: "[data-tour='header-opportunities']",
    content: "Explore opportunities and jobs here.",
    placement: "bottom",
    page: "/user/opportunitiess",
  },
  {
    target: "[data-tour='header-quest']",
    content: "Your quests and challenges appear here.",
    placement: "bottom",
    page: "/user/quest",
  },
];

// Opportunities Page Steps
export const opportunitiesTourSteps = [
  {
    target: "[data-tour='opportunity-filter']",
    content: "Use these filters to find opportunities faster.",
    placement: "right",
    page: "/user/opportunitiess",
  },
  {
    target: "[data-tour='opportunity-card']",
    content: "Click a card to see full details of the opportunity.",
    placement: "top",
    page: "/user/opportunitiess",
  },
  {
    target: "[data-tour='apply-button']",
    content: "Apply to opportunities using this button.",
    placement: "left",
    page: "/user/opportunitiess",
  },
];

// Courses Page Steps
export const coursesTourSteps = [
  {
    target: "[data-tour='course-list']",
    content: "Here are your recommended courses.",
    placement: "right",
    page: "/user/course/recommended",
  },
  {
    target: "[data-tour='course-card']",
    content: "Click a course to see details and enroll.",
    placement: "top",
    page: "/user/course/recommended",
  },
  {
    target: "[data-tour='enroll-button']",
    content: "Enroll in a course using this button.",
    placement: "left",
    page: "/user/course/recommended",
  },
];

// Assessment Page Steps
export const assessmentTourSteps = [
  {
    target: "[data-tour='assessment-list']",
    content: "View all available assessments here.",
    placement: "right",
    page: "/user/assessment",
  },
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
  // ...coursesTourSteps,
  ...opportunitiesTourSteps,
  // ...assessmentTourSteps,
];
