export const randomPrompts = [
  "Create a comprehensive guide for starting a sustainable urban garden",
  "Develop a creative marketing strategy for a local coffee shop using social media",
  "Write a technical documentation for a REST API authentication system",
  "Design a user onboarding flow for a productivity mobile application",
  "Analyze market trends for electric vehicles in emerging economies",
  "Create an engaging email newsletter template for a fitness coaching business",
  "Develop a crisis communication plan for a small technology startup",
  "Write a compelling product description for an eco-friendly water bottle",
  "Design a customer feedback system for an e-commerce platform",
  "Create a content calendar for a personal finance education blog",
  "Develop a training program for remote team collaboration",
  "Write a proposal for implementing AI chatbots in customer service",
  "Design a reward system for a mobile gaming application",
  "Create a social media strategy for promoting mental health awareness",
  "Develop a workflow optimization plan for a creative agency",
  "Write a comprehensive review of emerging blockchain technologies",
  "Design an accessibility audit checklist for web applications",
  "Create a brand storytelling framework for artisan food producers",
  "Develop a data visualization strategy for quarterly business reports",
  "Write a user research methodology for understanding customer behavior"
];

export const getRandomPrompt = (): string => {
  return randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
};