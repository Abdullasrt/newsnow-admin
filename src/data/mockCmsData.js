// Mock CMS Data for Media, Team, Comments, Curation, and Audit Logs

export const INITIAL_MEDIA_ASSETS = [
  {
    id: 'media-1',
    title: 'Infopark Photonics Lab Cleanroom',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    size: '2.4 MB',
    dimensions: '3840 x 2160',
    credit: 'Photo by Rahul Menath / News Now Bureau',
    license: 'Staff Wire Photography',
    tags: ['Tech', 'Infopark', 'Cleanroom', 'Hardware'],
    uploadedAt: '2026-10-10'
  },
  {
    id: 'media-2',
    title: 'Kochi Water Metro Electric Ferry at Marine Drive',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80',
    size: '1.8 MB',
    dimensions: '2560 x 1440',
    credit: 'AP Images / Licensed',
    license: 'Licensed / Associated Press',
    tags: ['Kerala', 'Transit', 'Electric', 'Water Metro'],
    uploadedAt: '2026-10-11'
  },
  {
    id: 'media-3',
    title: 'South Asian Semiconductor Market Growth Infographic',
    type: 'infographic',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
    size: '890 KB',
    dimensions: '1920 x 1080',
    credit: 'News Now Graphics Intelligence Unit',
    license: 'Exclusive Newsroom Copyright',
    tags: ['Infographic', 'Charts', 'Economy', 'Semiconductor'],
    uploadedAt: '2026-10-09'
  },
  {
    id: 'media-4',
    title: 'CIAL Solar Hydro Farm Aerial Shot',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=400&q=80',
    size: '3.1 MB',
    dimensions: '4000 x 3000',
    credit: 'Creative Commons BY-SA 4.0 / CIAL PR',
    license: 'Creative Commons BY-SA',
    tags: ['Science', 'Solar', 'CIAL', 'Green Energy'],
    uploadedAt: '2026-10-08'
  },
  {
    id: 'media-5',
    title: 'Kerala Deep-Tech Sovereign Policy Whitepaper 2026',
    type: 'document',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    thumbnail: '',
    size: '4.6 MB',
    dimensions: '42 Pages PDF',
    credit: 'Department of Electronics & IT, GoK',
    license: 'Public Domain / Open Data',
    tags: ['Document', 'PDF', 'Policy', 'Whitepaper'],
    uploadedAt: '2026-10-05'
  },
  {
    id: 'media-6',
    title: 'Arabian Sea Marine Bio-Reserve Drone Footage',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    size: '18.4 MB',
    dimensions: '1080p MP4 (1m 45s)',
    credit: 'Marine Fisheries Bureau',
    license: 'Editorial Fair Use',
    tags: ['Video', 'Marine', 'Ecology', 'Kerala'],
    uploadedAt: '2026-10-04'
  }
];

export const INITIAL_TEAM_MEMBERS = [
  {
    id: 'team-1',
    name: 'Arun Varma',
    email: 'editor@newsnow.in',
    role: 'Chief Editor',
    bureau: 'Kochi HQ & Executive Desk',
    bio: 'Veteran investigative journalist covering South Asian deep-tech governance, sovereign silicon, and coastal infrastructure for over two decades.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    handle: '@arun_varma',
    linkedin: 'linkedin.com/in/arunvarma',
    storiesCount: 42,
    status: 'active'
  },
  {
    id: 'team-2',
    name: 'Ananya Nambiar',
    email: 'ananya.n@newsnow.in',
    role: 'Desk Editor',
    bureau: 'Kochi Infopark Bureau',
    bio: 'Lead tech editor tracking fabless chip startups, RISC-V architectures, and venture capital flows across South India.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    handle: '@ananya_tech',
    linkedin: 'linkedin.com/in/ananyanambiar',
    storiesCount: 38,
    status: 'active'
  },
  {
    id: 'team-3',
    name: 'Dr. Madhavan Pillai',
    email: 'm.pillai@newsnow.in',
    role: 'Reporter / Staff Writer',
    bureau: 'Thiruvananthapuram Bureau',
    bio: 'Physicist turned science journalist specializing in quantum computing, green hydrogen grids, and space telemetry.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    handle: '@madhavan_p',
    linkedin: 'linkedin.com/in/madhavanpillai',
    storiesCount: 29,
    status: 'active'
  },
  {
    id: 'team-4',
    name: 'Rahul Menath',
    email: 'rahul.menath@newsnow.in',
    role: 'Reporter / Staff Writer',
    bureau: 'National Bureau (Bengaluru & Delhi)',
    bio: 'Business & regulatory correspondent with deep access into corporate boardrooms, logistics hubs, and fiscal policies.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    handle: '@rahul_econ',
    linkedin: 'linkedin.com/in/rahulmenath',
    storiesCount: 24,
    status: 'active'
  },
  {
    id: 'team-5',
    name: 'Sujata Nair',
    email: 'sujata.nair@newsnow.in',
    role: 'Desk Editor',
    bureau: 'Trivandrum Press Club',
    bio: 'Senior political analyst, veteran legislative observer, and constitutional policy specialist.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    handle: '@sujata_policy',
    linkedin: 'linkedin.com/in/sujatanair',
    storiesCount: 31,
    status: 'active'
  },
  {
    id: 'team-6',
    name: 'Devika Krishnan',
    email: 'devika.guest@gmail.com',
    role: 'Guest Contributor',
    bureau: 'Malabar & Calicut Arts Bureau',
    bio: 'Visiting cultural essayist, documentary researcher, and coastal literary historian.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    handle: '@devika_k',
    linkedin: 'linkedin.com/in/devikakrishnan',
    storiesCount: 6,
    status: 'active'
  }
];

export const INITIAL_COMMENTS = [
  {
    id: 'comment-1',
    articleId: '1',
    articleTitle: 'The Silicon Coast: How Kochi & Technopark Are Spearheading India’s Deep-Tech Hardware Renaissance',
    author: 'Prof. K. R. Menon',
    email: 'krmenon@iitm.ac.in',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=128&q=80',
    comment: 'The photonics wafer fabrication data cited here aligns exactly with our lab tests at IIT Madras. Kerala’s packaging ecosystem is surprisingly mature.',
    status: 'approved',
    pinned: true,
    timestamp: '2 hours ago',
    likes: 34
  },
  {
    id: 'comment-2',
    articleId: '2',
    articleTitle: 'Navigating the Backwaters: The Engineering Marvel of Kochi Water Metro’s Electric Fleet',
    author: 'Capt. Sunil Nambiar',
    email: 'sunil.transit@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=128&q=80',
    comment: 'The fast-charging automated pantograph system at Fort Kochi terminal is unprecedented in tropical maritime logistics. Kudos to the KMRL engineers.',
    status: 'approved',
    pinned: false,
    timestamp: '4 hours ago',
    likes: 18
  },
  {
    id: 'comment-3',
    articleId: '1',
    articleTitle: 'The Silicon Coast: How Kochi & Technopark Are Spearheading India’s Deep-Tech Hardware Renaissance',
    author: 'Anonymous User',
    email: 'cryptoleak49@temp.net',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80',
    comment: 'Buy cheap crypto coins immediately! Click link: bit.ly/spam-coins-free-crypto-now',
    status: 'flagged',
    pinned: false,
    timestamp: '5 hours ago',
    likes: 0
  },
  {
    id: 'comment-4',
    articleId: '3',
    articleTitle: 'Quantum Horizons: How India’s Sovereign Semiconductor Mission Took Root in Thiruvananthapuram',
    author: 'Dr. Sarah Jenkins',
    email: 'sjenkins@cam.ac.uk',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80',
    comment: 'Would love to see a follow-up dispatch regarding cryogenic dilution refrigeration imports and helium-3 availability for these qubit processors.',
    status: 'pending',
    pinned: false,
    timestamp: '30 mins ago',
    likes: 5
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'audit-1',
    timestamp: '10 mins ago',
    user: 'Arun Varma (Chief Editor)',
    action: 'Published Live Dispatch',
    target: 'The Silicon Coast: How Kochi & Technopark Are Spearheading India’s Deep-Tech Hardware Renaissance',
    type: 'publish'
  },
  {
    id: 'audit-2',
    timestamp: '42 mins ago',
    user: 'Ananya Nambiar (Desk Editor)',
    action: 'Approved Review Dispatch',
    target: 'Navigating the Backwaters: The Engineering Marvel of Kochi Water Metro',
    type: 'approval'
  },
  {
    id: 'audit-3',
    timestamp: '1 hour ago',
    user: 'Dr. Madhavan Pillai (Staff Writer)',
    action: 'Submitted Dispatch for Editorial Review',
    target: 'Quantum Horizons: How India’s Sovereign Semiconductor Mission Took Root',
    type: 'review_submission'
  },
  {
    id: 'audit-4',
    timestamp: '2 hours ago',
    user: 'Arun Varma (Chief Editor)',
    action: 'Pushed Live Ticker Bulletin',
    target: 'Kochi Infopark deep-tech startup closes ₹350 Cr Series B',
    type: 'breaking'
  },
  {
    id: 'audit-5',
    timestamp: '4 hours ago',
    user: 'System Bot',
    action: 'Automated Snapshot Backup Created',
    target: 'Full Newsroom JSON Snapshot #10481',
    type: 'system'
  }
];

export const ROLE_PERMISSIONS = {
  'Super Admin': {
    canPublishLive: true,
    canApproveReviews: true,
    canEditSettings: true,
    canManageStaff: true,
    canDeleteArticles: true,
    canCurateLayout: true,
    canAccessAuditLogs: true,
    badge: 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
  },
  'Chief Editor': {
    canPublishLive: true,
    canApproveReviews: true,
    canEditSettings: true,
    canManageStaff: true,
    canDeleteArticles: true,
    canCurateLayout: true,
    canAccessAuditLogs: true,
    badge: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
  },
  'Desk Editor': {
    canPublishLive: true,
    canApproveReviews: true,
    canEditSettings: false,
    canManageStaff: false,
    canDeleteArticles: false,
    canCurateLayout: true,
    canAccessAuditLogs: false,
    badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
  },
  'Reporter / Staff Writer': {
    canPublishLive: false,
    canApproveReviews: false,
    canEditSettings: false,
    canManageStaff: false,
    canDeleteArticles: false,
    canCurateLayout: false,
    canAccessAuditLogs: false,
    badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
  },
  'Guest Contributor': {
    canPublishLive: false,
    canApproveReviews: false,
    canEditSettings: false,
    canManageStaff: false,
    canDeleteArticles: false,
    canCurateLayout: false,
    canAccessAuditLogs: false,
    badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
  }
};
