export type MemoryCategory =
  | 'General'
  | 'Study'
  | 'Finance'
  | 'Travel'
  | 'Work'
  | 'Shopping'
  | 'Health'
  | 'Personal'
  | 'Media';

export type ProcessingLocation = 'device' | 'cloud';
export type BuildStatus = 'built' | 'started' | 'next' | 'planned';

export interface CapturedMemory {
  id: string;
  title: string;
  subtitle: string;
  category: MemoryCategory;
  contentType: string;
  capturedAt: string;
  description: string;
}

export interface LocalAction {
  label: string;
  detail: string;
  free: boolean;
}

export interface LocalAnalysis {
  summary: string;
  confidence: number;
  detectedText: string[];
  localSignals: string[];
  actions: LocalAction[];
}

export interface Capability {
  id: string;
  title: string;
  scope: string;
  adapter: string;
  cost: string;
  location: ProcessingLocation;
  status: BuildStatus;
}

export const memoryCategories: MemoryCategory[] = [
  'General',
  'Study',
  'Finance',
  'Travel',
  'Work',
  'Shopping',
  'Health',
  'Personal',
  'Media',
];

export const capturedMemories: CapturedMemory[] = [
  {
    id: 'study-whiteboard',
    title: 'Neural Network Architectures',
    subtitle: '4 concepts found - Whiteboard scan',
    category: 'Study',
    contentType: 'Screenshot',
    capturedAt: 'Today, 9:14 AM',
    description:
      'Deep learning lecture board with feedforward layers, recurrent loops, attention blocks, and an exam note for July 18.',
  },
  {
    id: 'coffee-receipt',
    title: 'Blue Bottle Coffee',
    subtitle: '$4.75 - Finance tracker',
    category: 'Finance',
    contentType: 'Receipt',
    capturedAt: 'Today, 10:14 AM',
    description:
      'Receipt from Blue Bottle Cafe for a decaf latte. Merchant, amount, tax, and card total detected locally.',
  },
  {
    id: 'rome-flight',
    title: 'Rome Flight Ticket - AZ402',
    subtitle: 'Gate B12 - July 14',
    category: 'Travel',
    contentType: 'Ticket',
    capturedAt: 'Yesterday, 6:42 PM',
    description:
      'Flight ticket from Rome FCO to New York JFK with gate B12, boarding date July 14, seat 12A, and airline code AZ402.',
  },
  {
    id: 'project-wireframes',
    title: 'Project Alpha Wireframes',
    subtitle: 'Dashboard specs - Work',
    category: 'Work',
    contentType: 'Image',
    capturedAt: 'Monday, 3:20 PM',
    description:
      'Dashboard wireframe capture with grid notes, analytics cards, product requirements, and a handoff deadline.',
  },
  {
    id: 'headphones-price',
    title: 'Noise Cancelling Headphones',
    subtitle: '$299 - Shopping alert',
    category: 'Shopping',
    contentType: 'Product',
    capturedAt: 'Sunday, 11:05 AM',
    description:
      'Product screenshot for Sony WH-1000XM4 in silver with a 10 percent price drop and comparison notes.',
  },
  {
    id: 'workout-plan',
    title: 'Weekly Workout Schedule',
    subtitle: '3 active reminders - Health',
    category: 'Health',
    contentType: 'Note',
    capturedAt: 'Saturday, 8:30 AM',
    description:
      'Workout plan with cardio Monday and Wednesday, strength Tuesday and Thursday, plus hydration target.',
  },
  {
    id: 'lake-como',
    title: 'Sunset over Lake Como',
    subtitle: 'Favorite - Media memory',
    category: 'Media',
    contentType: 'Photo',
    capturedAt: 'Last week',
    description:
      'Vacation photo candidate for gallery cleaner. Similar trip images are grouped for duplicate review.',
  },
  {
    id: 'newsletter-ideas',
    title: 'Ideas for newsletter post',
    subtitle: 'Draft note - Personal',
    category: 'Personal',
    contentType: 'Note',
    capturedAt: 'Last week',
    description:
      'Draft topics about offline-first databases, private AI workflows, and on-device memory search.',
  },
];

export const processingPipeline = [
  {
    step: 1,
    name: 'Capture',
    freeEngine: 'Local intake for screenshots, photos, receipts, notes, links, and PDFs.',
    premiumEngine: 'Optional encrypted sync queue for cross-device access.',
  },
  {
    step: 2,
    name: 'Understand',
    freeEngine: 'On-device OCR, labels, dates, amounts, and content type classification.',
    premiumEngine: 'Cloud vision and document reasoning when the user asks for deeper help.',
  },
  {
    step: 3,
    name: 'Organize',
    freeEngine: 'Local categories, tags, duplicate hints, and smart collections.',
    premiumEngine: 'Unlimited collections and shared memory spaces.',
  },
  {
    step: 4,
    name: 'Connect',
    freeEngine: 'Local links by time, category, merchant, date, and repeated entities.',
    premiumEngine: 'Semantic graph search across encrypted cloud memories.',
  },
  {
    step: 5,
    name: 'Act',
    freeEngine: 'Reminders, expense drafts, study queues, and cleanup suggestions.',
    premiumEngine: 'AI chat, multi-file reasoning, code generation, and agent mode.',
  },
];

export const freeOnDeviceCapabilities: Capability[] = [
  {
    id: 'screenshot-analysis',
    title: 'Screenshot analysis',
    scope: 'Detects likely content type, visible text hints, dates, prices, and next actions.',
    adapter: 'Google ML Kit Text Recognition v2 on Android, Apple Vision on iOS phase 2.',
    cost: '$0',
    location: 'device',
    status: 'started',
  },
  {
    id: 'ocr',
    title: 'OCR text extraction',
    scope: 'Turns screenshots, receipts, slides, whiteboards, and documents into searchable text.',
    adapter: 'ML Kit OCR now, VisionKit and Apple Vision later.',
    cost: '$0',
    location: 'device',
    status: 'next',
  },
  {
    id: 'image-recognition',
    title: 'Image and object recognition',
    scope: 'Labels products, places, documents, whiteboards, scenes, and gallery subjects.',
    adapter: 'ML Kit Image Labeling and Object Detection.',
    cost: '$0',
    location: 'device',
    status: 'next',
  },
  {
    id: 'duplicates',
    title: 'Duplicate detection',
    scope: 'Groups exact duplicates, near duplicates, burst shots, and blurry photos for review.',
    adapter: 'Perceptual hash plus local sharpness scoring.',
    cost: '$0',
    location: 'device',
    status: 'planned',
  },
  {
    id: 'receipt-scanning',
    title: 'Receipt scanning',
    scope: 'Extracts merchant, amount, dates, subscription hints, and budget categories.',
    adapter: 'Local OCR plus rules, cloud fallback only when the user chooses.',
    cost: '$0',
    location: 'device',
    status: 'started',
  },
  {
    id: 'automatic-reminders',
    title: 'Automatic reminders',
    scope: 'Finds flights, exams, bills, renewals, and medication schedules in captured text.',
    adapter: 'Local date/entity extraction and local notifications.',
    cost: '$0',
    location: 'device',
    status: 'planned',
  },
  {
    id: 'smart-organization',
    title: 'Smart organization',
    scope: 'Places captures into Study, Finance, Travel, Work, Shopping, Health, Personal, or Media.',
    adapter: 'Local classifier and user-correctable tags.',
    cost: '$0',
    location: 'device',
    status: 'built',
  },
  {
    id: 'local-search',
    title: 'Local memory search',
    scope: 'Searches titles, OCR text, tags, actions, and related memories offline.',
    adapter: 'SQLite FTS or local index adapter.',
    cost: '$0',
    location: 'device',
    status: 'next',
  },
];

export const premiumCloudCapabilities: Capability[] = [
  {
    id: 'memory-chat',
    title: 'AI conversations with memories',
    scope: 'Ask questions about captures and get streamed answers with citations.',
    adapter: 'Supabase Edge Function proxy to cloud LLMs.',
    cost: 'Pro',
    location: 'cloud',
    status: 'planned',
  },
  {
    id: 'deep-docs',
    title: 'Deep document understanding',
    scope: 'Summaries, contract simplification, key dates, table extraction, and study notes.',
    adapter: 'Cloud vision and document reasoning.',
    cost: 'Pro',
    location: 'cloud',
    status: 'planned',
  },
  {
    id: 'multi-file',
    title: 'Multi-file reasoning',
    scope: 'Connects receipts, tickets, PDFs, photos, and notes across a project or trip.',
    adapter: 'pgvector search plus cloud reasoning.',
    cost: 'Pro',
    location: 'cloud',
    status: 'planned',
  },
  {
    id: 'study-assistant',
    title: 'Study assistant',
    scope: 'Generates flashcards, quizzes, mind maps, weak topic reviews, and study plans.',
    adapter: 'Cloud LLM generation with local spaced repetition.',
    cost: 'Student or Pro',
    location: 'cloud',
    status: 'planned',
  },
  {
    id: 'code-generation',
    title: 'Code generation',
    scope: 'Turns captured snippets, diagrams, and notes into working code or explanations.',
    adapter: 'Cloud LLM with per-day free limits.',
    cost: 'Pro',
    location: 'cloud',
    status: 'planned',
  },
  {
    id: 'cross-device',
    title: 'Cross-device intelligence',
    scope: 'Encrypted memory sync across Android, iOS, tablet, desktop, and web.',
    adapter: 'Supabase, encrypted storage, and opt-in sync.',
    cost: 'Pro',
    location: 'cloud',
    status: 'planned',
  },
];

export const freeToolStack = [
  {
    name: 'React Native + Expo SDK 56',
    use: 'Cross-platform app shell, routing, native tabs, web preview, and Expo Go testing.',
    cost: 'Free',
  },
  {
    name: 'Google ML Kit',
    use: 'Android-first OCR, document scanning, barcode scanning, object detection, and image labels.',
    cost: 'Free',
  },
  {
    name: 'Apple Vision + VisionKit',
    use: 'iOS phase 2 OCR, document detection, barcode scanning, and image analysis.',
    cost: 'Free',
  },
  {
    name: 'SQLite + encrypted local store',
    use: 'Offline-first captures, OCR text, tags, reminders, receipts, and search index.',
    cost: 'Free',
  },
  {
    name: 'Android Keystore + biometrics',
    use: 'Private encryption keys, protected tokens, and vault unlock.',
    cost: 'Free',
  },
  {
    name: 'Supabase free tier',
    use: 'Opt-in sync, auth, pgvector, storage, and Edge Functions after local-first flows work.',
    cost: 'Free tier',
  },
  {
    name: 'RevenueCat free tier',
    use: 'Subscription entitlement checks once premium cloud features are ready.',
    cost: 'Free to launch tier',
  },
];

export const buildPlanPhases = [
  {
    phase: 'Phase 0',
    weeks: 'Weeks 1-2',
    title: 'Foundation',
    status: 'started' as BuildStatus,
    progress: 65,
    focus: 'Expo app, folder structure, design tokens, branded UI, privacy model, and plan-backed data.',
  },
  {
    phase: 'Phase 1',
    weeks: 'Weeks 3-6',
    title: 'Core capture + search',
    status: 'next' as BuildStatus,
    progress: 25,
    focus: 'Capture intake, on-device understanding, local search, timeline, and detail views.',
  },
  {
    phase: 'Phase 2',
    weeks: 'Weeks 7-10',
    title: 'Gallery cleaner + polish',
    status: 'planned' as BuildStatus,
    progress: 5,
    focus: 'Duplicate review, onboarding, reminders, offline security, and local encryption.',
  },
  {
    phase: 'Phase 3',
    weeks: 'Weeks 11-14',
    title: 'AI actions + graph',
    status: 'planned' as BuildStatus,
    progress: 0,
    focus: 'Receipt actions, ticket actions, knowledge graph, screenshot chat, and expense tracker.',
  },
  {
    phase: 'Phase 4',
    weeks: 'Weeks 15-18',
    title: 'Study mode + voice',
    status: 'planned' as BuildStatus,
    progress: 0,
    focus: 'Whiteboard tools, flashcards, quizzes, mind maps, study analytics, and voice assistant.',
  },
  {
    phase: 'Phase 5',
    weeks: 'Weeks 19-21',
    title: 'Payments + paywall',
    status: 'planned' as BuildStatus,
    progress: 0,
    focus: 'RevenueCat products, entitlements, feature gates, experiments, and analytics.',
  },
  {
    phase: 'Phase 6',
    weeks: 'Weeks 22-26',
    title: 'Launch',
    status: 'planned' as BuildStatus,
    progress: 0,
    focus: 'Store listing, beta testing, bug fixing, launch campaign, reviews, and KPI tracking.',
  },
];

export const startedInventory = [
  'Expo SDK 56 project with Expo Router and native tab shell',
  'Nexora app name, Android package, icon assets, and splash setup',
  'Custom dark design tokens, glass cards, animated category background, and smart cards',
  'Home feed prototype with categories and sample captures',
  'Feature, core, service, and UI folders matching the master plan',
];

export const privacyRules = [
  'On-device analysis is the default path.',
  'Cloud sync stays off until the user explicitly enables it.',
  'No automatic deletion. Every cleanup action needs confirmation.',
  'Show what the AI found and why it suggested an action.',
  'Store first, sync later. Local data is the source of truth.',
];

export const freeTierRules = [
  { label: 'Captures', free: '500 per month', pro: 'Unlimited' },
  { label: 'Search history', free: 'Last 30 days', pro: 'All time' },
  { label: 'Smart collections', free: '3 collections', pro: 'Unlimited' },
  { label: 'Receipt tracking', free: '5 per month', pro: 'Unlimited' },
  { label: 'Gallery cleaner', free: 'Basic 100 photos', pro: 'Full library' },
  { label: 'AI chat', free: '10 per day', pro: 'Unlimited' },
];

export function analyzeCaptureOffline(capture: CapturedMemory): LocalAnalysis {
  const text = `${capture.title} ${capture.subtitle} ${capture.description}`.toLowerCase();
  const detectedText = [
    capture.title,
    capture.subtitle,
    ...capture.description
      .split(/[.,]/)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 3),
  ];

  const localSignals: string[] = [capture.contentType, capture.category];
  const actions: LocalAction[] = [];

  if (/\$\d|receipt|merchant|amount|tax|subscription/.test(text)) {
    localSignals.push('amount detected', 'merchant detected');
    actions.push({
      label: 'Draft expense',
      detail: 'Create a local expense entry before any sync.',
      free: true,
    });
  }

  if (/flight|gate|ticket|exam|deadline|july|monday|wednesday|thursday/.test(text)) {
    localSignals.push('date detected', 'reminder candidate');
    actions.push({
      label: 'Create reminder',
      detail: 'Queue a local notification after user confirmation.',
      free: true,
    });
  }

  if (/lecture|study|flashcard|whiteboard|exam|concept|neural/.test(text)) {
    localSignals.push('study material');
    actions.push({
      label: 'Build study queue',
      detail: 'Extract key terms for basic offline review.',
      free: true,
    });
  }

  if (/duplicate|photo|gallery|trip|image|sunset/.test(text)) {
    localSignals.push('gallery cleaner candidate');
    actions.push({
      label: 'Review similar photos',
      detail: 'Group likely matches and require confirmation before deletion.',
      free: true,
    });
  }

  if (actions.length === 0) {
    actions.push({
      label: 'Add to smart collection',
      detail: 'Save category, title, and searchable local notes.',
      free: true,
    });
  }

  return {
    summary: `Local analysis classified this ${capture.contentType.toLowerCase()} as ${capture.category.toLowerCase()} and found ${localSignals.length} usable signals without a cloud call.`,
    confidence: Math.min(94, 72 + localSignals.length * 4),
    detectedText,
    localSignals: Array.from(new Set(localSignals)),
    actions,
  };
}
