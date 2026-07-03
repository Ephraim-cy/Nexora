import type { BuildStatus, MemoryCategory } from './nexora-ai-architecture';

export type WorkflowState = 'ready' | 'scanning' | 'review' | 'blocked';

export interface CaptureSource {
  id: string;
  label: string;
  category: MemoryCategory;
  adapter: string;
  state: WorkflowState;
  detail: string;
  signal: string;
  accent: string;
}

export interface IntakeItem {
  id: string;
  title: string;
  source: string;
  category: MemoryCategory;
  progress: number;
  step: string;
  detail: string;
  localSignals: string[];
}

export interface CleanerGroup {
  id: string;
  title: string;
  category: MemoryCategory;
  count: number;
  recommendedKeep: string;
  savings: string;
  reason: string;
  confidence: number;
  items: string[];
}

export interface PrivacyControl {
  id: string;
  label: string;
  detail: string;
  enabled: boolean;
  status: BuildStatus;
}

export const captureSources: CaptureSource[] = [
  {
    id: 'camera',
    label: 'Camera capture',
    category: 'General',
    adapter: 'Expo camera adapter placeholder',
    state: 'ready',
    detail: 'Snap receipts, notes, labels, whiteboards, and product screenshots into the local queue.',
    signal: 'Manual intake',
    accent: '#36d5ff',
  },
  {
    id: 'photos',
    label: 'Photo import',
    category: 'Media',
    adapter: 'Expo ImagePicker and MediaLibrary phase',
    state: 'ready',
    detail: 'Select images from the device, then classify and index them locally before sync.',
    signal: 'Gallery source',
    accent: '#4ade80',
  },
  {
    id: 'screenshots',
    label: 'Screenshots',
    category: 'Work',
    adapter: 'Screen capture listener phase',
    state: 'scanning',
    detail: 'Watch screenshot imports and route them through OCR, labels, and smart collections.',
    signal: 'Fast OCR path',
    accent: '#7c6cff',
  },
  {
    id: 'docs',
    label: 'PDF and docs',
    category: 'Study',
    adapter: 'Document picker phase',
    state: 'review',
    detail: 'Queue files for local metadata, lightweight text extraction, and premium deep reads later.',
    signal: 'Document memory',
    accent: '#facc15',
  },
  {
    id: 'clipboard',
    label: 'Clipboard/link',
    category: 'Personal',
    adapter: 'Share extension phase',
    state: 'ready',
    detail: 'Save pasted text, URLs, confirmation numbers, ideas, and quick notes as private memories.',
    signal: 'Quick save',
    accent: '#fb7185',
  },
];

export const intakeQueue: IntakeItem[] = [
  {
    id: 'linear-algebra-board',
    title: 'Linear Algebra Chapter 3 board',
    source: 'Screenshot',
    category: 'Study',
    progress: 82,
    step: 'OCR text extraction',
    detail: '24 terms found, 3 flashcard candidates, due date detected.',
    localSignals: ['whiteboard', 'study material', 'date'],
  },
  {
    id: 'carrefour-receipt',
    title: 'Carrefour grocery receipt',
    source: 'Camera',
    category: 'Finance',
    progress: 68,
    step: 'Receipt fields',
    detail: '$56.70 total, 5 line items, grocery category suggested.',
    localSignals: ['merchant', 'amount', 'items'],
  },
  {
    id: 'dubai-flight',
    title: 'Dubai flight confirmation',
    source: 'PDF import',
    category: 'Travel',
    progress: 45,
    step: 'Reminder candidates',
    detail: 'Flight code, destination, and departure date are ready for review.',
    localSignals: ['ticket', 'date', 'destination'],
  },
];

export const intakeSteps = [
  {
    label: 'Capture',
    detail: 'Bring content in from camera, screenshots, gallery, docs, links, and share sheet.',
  },
  {
    label: 'Understand',
    detail: 'Run free local OCR, labels, dates, prices, and content classification.',
  },
  {
    label: 'Review',
    detail: 'Show the user exactly what was found before creating reminders or expense drafts.',
  },
  {
    label: 'Save',
    detail: 'Store searchable memory data locally, with optional encrypted sync later.',
  },
];

export const cleanerStats = [
  { label: 'Review sets', value: '9', detail: 'duplicates and similar photos' },
  { label: 'Possible savings', value: '1.8 GB', detail: 'requires confirmation' },
  { label: 'Auto deleted', value: '0', detail: 'privacy rule enforced' },
];

export const cleanerGroups: CleanerGroup[] = [
  {
    id: 'dubai-burst',
    title: 'Dubai skyline burst',
    category: 'Travel',
    count: 12,
    recommendedKeep: 'IMG_7421',
    savings: '384 MB',
    reason: 'Same scene, sharpness winner found locally.',
    confidence: 91,
    items: ['IMG_7418', 'IMG_7419', 'IMG_7420', 'IMG_7421'],
  },
  {
    id: 'receipt-duplicates',
    title: 'Receipt duplicates',
    category: 'Finance',
    count: 6,
    recommendedKeep: 'Carrefour receipt - cropped',
    savings: '42 MB',
    reason: 'Exact OCR text and matching totals across copies.',
    confidence: 88,
    items: ['full photo', 'cropped copy', 'screenshot copy'],
  },
  {
    id: 'blurred-notes',
    title: 'Blurred lecture notes',
    category: 'Study',
    count: 8,
    recommendedKeep: 'Whiteboard final shot',
    savings: '216 MB',
    reason: 'Low sharpness score on seven images.',
    confidence: 79,
    items: ['blurred start', 'partial board', 'final board'],
  },
];

export const cleanerRules = [
  'Never delete automatically.',
  'Keep the sharpest and most complete copy selected by default.',
  'Show why photos were grouped before asking for confirmation.',
  'Run exact duplicate checks free on device before premium cloud analysis.',
];

export const privacyControls: PrivacyControl[] = [
  {
    id: 'on-device-ai',
    label: 'On-device AI first',
    detail: 'OCR, labels, receipts, reminders, and local search run locally by default.',
    enabled: true,
    status: 'built',
  },
  {
    id: 'cloud-sync',
    label: 'Cloud sync',
    detail: 'Encrypted cross-device memory stays off until the user enables premium sync.',
    enabled: false,
    status: 'planned',
  },
  {
    id: 'private-previews',
    label: 'Hide sensitive previews',
    detail: 'Mask receipts, IDs, tickets, and medical notes in app previews.',
    enabled: true,
    status: 'started',
  },
  {
    id: 'local-reminders',
    label: 'Local reminders',
    detail: 'Create reminders from detected dates only after user review.',
    enabled: true,
    status: 'planned',
  },
];

export const privacyActions = [
  {
    label: 'Export local memories',
    detail: 'Prepare a JSON or ZIP export from the private store.',
    status: 'planned' as BuildStatus,
  },
  {
    label: 'Delete all local data',
    detail: 'Requires confirmation and biometric unlock once the vault exists.',
    status: 'planned' as BuildStatus,
  },
  {
    label: 'Review cloud permissions',
    detail: 'Shows sync, AI chat, and cross-device scopes before premium features run.',
    status: 'started' as BuildStatus,
  },
];

export const permissionCards = [
  {
    label: 'Photos',
    detail: 'Needed only when importing or cleaning the gallery.',
    state: 'Ask when used',
  },
  {
    label: 'Notifications',
    detail: 'Used for reminders created from captured dates.',
    state: 'Optional',
  },
  {
    label: 'Camera',
    detail: 'Used for receipts, documents, labels, and quick capture.',
    state: 'Ask when used',
  },
];
