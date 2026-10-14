/**
 * YOUR PORTFOLIO CONTENT — edit this file, then run `npm run build`.
 * All personal information, project cards, links and SEO copy live here.
 * Values marked CHANGE ME are deliberately placeholders; verify the examples
 * before publishing. Keep links empty ("") to hide them from visitors.
 */
export const portfolio = {
  site: {
    name: 'Eduard Abraham Z. Orcullo',
    initials: 'EAO',
    role: 'BSIT Student & Web / Mobile Developer',
    intro: 'I turn real-world challenges into thoughtful digital experiences.',
    tagline: 'Building useful things, with purpose and personality.',
    description:
      'I am a Bachelor of Science in Information Technology student focused on building web, mobile and practical software solutions. I enjoy turning ideas into working experiences that are clear, accessible and useful.',
    availability: 'Open to internships & collaborations',
    city: 'Daet, Camarines Norte',
    country: 'Philippines',
    email: 'eduardzantua6@gmail.com',
    phone: '0919 867 3605', // CHANGE ME; e.g., '+63 9XX XXX XXXX'; empty = not published
    photo: './assets/profile-placeholder.svg', // Replace with ./assets/my-photo.webp
    photoAlt: 'Stylized placeholder portrait — replace with a photo of yourself',
    resumePath: './assets/resume.pdf',
    cvPath: './assets/cv.pdf',
    websiteUrl: 'https://yourdomain.com', // CHANGE ME for sitemap / canonical / OG tags
    ogImage: './assets/og-image.png',
    // CHANGE ME: replace with verified URLs; blank links are hidden.
    socials: [
      { label: 'GitHub', icon: 'github', url: '' },
      { label: 'LinkedIn', icon: 'linkedin', url: '' },
      { label: 'Facebook', icon: 'facebook', url: '' },
      { label: 'Instagram', icon: 'instagram', url: '' },
    ],
  },

  about: {
    eyebrow: '01 / About',
    headline: 'A curious mind, a builder at heart.',
    paragraphs: [
      'I study Information Technology at Camarines Norte State College, where I explore how software can improve everyday experiences — from attendance systems to small-business tools.',
      'I like work that brings together practical engineering, considered interfaces, and a willingness to learn. Outside the screen, I enjoy motorcycle rides, exploring new places, and discovering good coffee.',
    ],
    interests: ['Web & mobile experiences', 'Human-centered design', 'Exploring new places', 'Motorcycle journeys', 'Coffee & creativity'],
    facts: [
      { label: 'Based in', value: 'Camarines Norte, PH' },
      { label: 'Currently', value: 'Studying BS Information Technology' },
      { label: 'Mindset', value: 'Always learning, always building' },
    ],
  },

  education: [
    {
      school: 'Camarines Norte State College',
      degree: 'Bachelor of Science in Information Technology',
      period: 'Start year – Present', // CHANGE ME
      location: 'Daet, Camarines Norte',
      details: 'Undergraduate studies with coursework and project work in software development, systems analysis and design, human-computer interaction, data analytics and mobile applications.',
      highlights: ['Mobile Applications', 'Human-Computer Interaction', 'Systems Analysis & Design', 'Data Scalability & Analytics'],
    },
    // Add other education entries here as needed.
  ],

  experience: [
    {
      role: 'Academic Software Developer',
      organization: 'Coursework & personal projects',
      period: 'Dates to confirm', // CHANGE ME
      type: 'Projects',
      description: 'Created and iterated on web, mobile and desktop solutions; explored authentication, database-backed features, responsive interfaces and end-user workflows.',
      bullets: ['Prototyped practical software features', 'Worked across UI, application logic and data storage', 'Tested and improved real-world user flows'],
    },
    {
      role: 'Student Leadership & Volunteer Activities',
      organization: 'Campus & NSTP activities',
      period: 'Dates to confirm', // CHANGE ME
      type: 'Leadership',
      description: 'Participated in student leadership and coordinated activities with peers during academic and service-oriented events.',
      bullets: ['Supported coordination and group communication', 'Helped organize collaborative tasks'],
    },
  ],

  skills: [
    { category: 'Programming', icon: 'code', items: ['JavaScript', 'Python', 'Java', 'Kotlin', 'SQL', 'HTML', 'CSS'] },
    { category: 'Frameworks & Platforms', icon: 'layers', items: ['React', 'Vite', 'Express', 'Capacitor', 'Android', 'Supabase'] },
    { category: 'Tools & Workflow', icon: 'terminal', items: ['Git & GitHub', 'Android Studio', 'VS Code', 'SQLite', 'PostgreSQL', '3ds Max'] },
    { category: 'Design & People', icon: 'pen', items: ['Responsive UI', 'UX Thinking', 'Prototyping', 'Collaboration', 'Problem Solving', 'Communication'] },
  ],

  projects: [
    {
      id: 'attendease',
      title: 'AttendEase',
      subtitle: 'Mobile attendance made practical.',
      category: 'Mobile',
      year: 'Academic project',
      badge: 'Featured',
      image: './assets/projects/attendease.svg',
      imageAlt: 'Illustrated mobile NFC attendance interface',
      summary: 'An NFC-based student attendance concept with mobile check-ins, roles, enrollment workflows and reporting features.',
      detail: 'A mobile-first attendance project exploring phone-to-phone NFC communication, Android host card emulation, instructor workflows, student enrollment, session management and Supabase-backed data. Replace this description with the exact features you have completed and tested.',
      contribution: ['Android and mobile experience', 'NFC / HCE experiments', 'Database-backed workflows'],
      tags: ['Android', 'Java', 'NFC / HCE', 'Supabase'],
      demo: '', // CHANGE ME: real deployed app URL, or leave blank
      github: '', // CHANGE ME: real repository URL, or leave blank
    },
    {
      id: 'blooming-memories',
      title: 'Blooming Memories',
      subtitle: 'A personal experience, designed with care.',
      category: 'Web',
      year: 'Personal project',
      badge: 'Personal',
      image: './assets/projects/blooming.svg',
      imageAlt: 'Illustrated pastel website with planner cards and flowers',
      summary: 'An interactive personal website centered on shared plans, customized experiences and memorable moments.',
      detail: 'A responsive web experience with editable activities, a date/time planner, shareable links and an email invitation flow. Verify which features are currently live before making public claims.',
      contribution: ['Interactive page layouts', 'Planning and share flows', 'Email integration'],
      tags: ['React', 'Vite', 'JavaScript', 'EmailJS'],
      demo: '',
      github: '',
    },
    {
      id: 'sari-sari-pos',
      title: 'Sari-Sari POS',
      subtitle: 'Everyday retail, less friction.',
      category: 'Systems',
      year: 'Software project',
      badge: 'Desktop',
      image: './assets/projects/pos.svg',
      imageAlt: 'Illustrated retail point of sale analytics dashboard',
      summary: 'A point-of-sale desktop application concept for sales, inventory and small-store operations.',
      detail: 'A small-business software project covering sales transactions, product management and inventory workflows. Use this case study to explain the real architecture, screenshots, measurable impact and testing.',
      contribution: ['POS interface exploration', 'Inventory workflows', 'Data management'],
      tags: ['Python', 'SQLite', 'Desktop UI'],
      demo: '',
      github: '',
    },
    {
      id: 'smart-menu',
      title: 'Smart Digital Menu',
      subtitle: 'Scan. Browse. Update.',
      category: 'Web',
      year: 'Concept',
      badge: 'Concept',
      image: './assets/projects/menu.svg',
      imageAlt: 'Illustrated QR and NFC-powered digital cafe menu',
      summary: 'A QR / NFC-accessible restaurant menu concept with a simple, editable management experience.',
      detail: 'A mobile-friendly online menu concept that guests can reach via a QR code, an NFC tag or a direct link, with admin-managed prices, categories, availability and photos. Mark the project as live only when deployed and verified.',
      contribution: ['Mobile-first menu interface', 'Content management planning', 'QR / NFC entry points'],
      tags: ['Web', 'Responsive UI', 'QR / NFC', 'CMS'],
      demo: '',
      github: '',
    },
  ],

  // Add verified records only. An empty array displays a neat empty state.
  certifications: [
    // Example format:
    // { title: 'Certification Name', issuer: 'Issuer', date: 'Month YYYY', url: 'https://valid-credential-url' },
  ],

  // Your on-page CV is generated automatically from the site data.
  cv: {
    objective: 'Information Technology student seeking opportunities to apply software development skills, contribute to useful projects and keep learning from experienced teams.',
    additional: ['Interested in web/mobile development and user-centered experiences.', 'Available for projects, collaborations and internship opportunities.'],
  },

  contact: {
    eyebrow: '08 / Contact',
    headline: 'Have an idea? Let’s make it happen.',
    description: 'Whether it’s a project, collaboration, internship or just a hello, I’d love to hear from you.',
    formspreeId: 'mvkzwlda', // CHANGE ME: your Formspree ID, e.g. 'abcdwxyz' (no secret keys needed)
    successMessage: 'Thanks for reaching out! Your message has been sent successfully.',
  },
};
