export const randomPrompts = {
  text: [
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
  ],
  image: [
    "A futuristic cityscape at sunset with flying cars and neon lights",
    "Portrait of a wise old wizard with glowing eyes and mystical aura",
    "Minimalist logo design for a sustainable technology startup",
    "Abstract art representing digital transformation and innovation",
    "Product photography of a luxury smartwatch on marble surface",
    "Cozy coffee shop interior with warm lighting and vintage furniture",
    "Majestic mountain landscape with aurora borealis in the night sky",
    "Cyberpunk street scene with holographic advertisements",
    "Elegant fashion model in avant-garde clothing against urban backdrop",
    "Underwater scene with colorful coral reef and tropical fish",
    "Steampunk mechanical dragon with intricate brass details",
    "Modern architectural building with glass and steel geometric design",
    "Fantasy forest with magical creatures and glowing mushrooms",
    "Vintage car on a desert highway during golden hour",
    "Space station orbiting Earth with astronauts in the background",
    "Japanese garden with cherry blossoms and traditional bridge",
    "Post-apocalyptic wasteland with abandoned buildings and overgrown vegetation",
    "Luxury yacht sailing in crystal clear tropical waters",
    "Medieval castle on a cliff overlooking stormy seas",
    "High-tech laboratory with scientists working on advanced experiments"
  ],
  video: [
    "Time-lapse of a flower blooming from seed to full blossom in spring garden",
    "Cinematic trailer for a sci-fi adventure featuring space battles and alien worlds",
    "Step-by-step cooking tutorial showing how to make authentic Italian pasta",
    "Animated logo reveal with particle effects and dynamic typography",
    "Documentary-style interview setup with professional lighting and multiple camera angles",
    "Drone footage flying through a misty forest at dawn",
    "Product demonstration video showcasing a new smartphone's features",
    "Fashion runway show with models walking in slow motion",
    "Behind-the-scenes footage of a movie production with crew and equipment",
    "Workout routine video with energetic music and multiple exercise demonstrations",
    "Travel vlog exploring ancient temples in Southeast Asia",
    "Corporate presentation with animated charts and professional transitions",
    "Music video with synchronized dance choreography and colorful lighting",
    "Educational explainer video about renewable energy with animated graphics",
    "Sports highlight reel with dramatic slow-motion replays",
    "Art creation process showing a painter working on a large canvas",
    "Technology review video comparing different laptop models",
    "Wedding ceremony footage with emotional moments and beautiful scenery",
    "Gaming livestream with commentary and viewer interaction",
    "Virtual tour of a luxury real estate property with smooth camera movements"
  ]
};

export const getRandomPrompt = (category: 'text' | 'image' | 'video' = 'text'): string => {
  const prompts = randomPrompts[category];
  return prompts[Math.floor(Math.random() * prompts.length)];
};