export type LabDepth = 'classroom' | 'system' | 'exhaustive';
export type KnowledgeLevel =
  | 'observable'
  | 'documented'
  | 'conceptual'
  | 'unknown';
export type CaseTag =
  | 'core'
  | 'optional'
  | 'security'
  | 'monetization'
  | 'intelligence'
  | 'administration'
  | 'integration'
  | 'service';

export type DepthActor = {
  id: string;
  label: string;
  kind: 'person' | 'external';
  role: 'primary' | 'secondary';
  tier: 1 | 2 | 3;
  description: string;
  goals: string[];
};

export type DepthCase = {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  tier: 1 | 2 | 3;
  tags: CaseTag[];
  primaryActors: string[];
  secondaryActors: string[];
  preconditions: string[];
  trigger: string;
  mainFlow: string[];
  alternateFlows: string[];
  exceptionFlows: string[];
  postconditions: string[];
  includes: string[];
  extends: string[];
  dataObjects: string[];
  supportingServices: string[];
  security: string[];
  privacy: string[];
  relatedScenarios: string[];
  confidence: KnowledgeLevel;
};

export type DepthRelationship = {
  source: string;
  target: string;
  type: 'association' | 'include' | 'extend' | 'generalization';
  reason: string;
};

export type ArchitectureStage = {
  label: string;
  responsibility: string;
  technology: string;
  confidence: KnowledgeLevel;
};

export type SequenceParticipant = {
  id: string;
  label: string;
  type: 'actor' | 'boundary' | 'control' | 'service' | 'data' | 'external';
  tier: 1 | 2 | 3;
  responsibility: string;
};

export type SequenceStep = {
  from: string;
  to: string;
  label: string;
  tier: 1 | 2 | 3;
  style: 'sync' | 'async' | 'return';
  fragment?: 'alt' | 'opt' | 'loop';
  guard?: string;
  why: string;
  data: string;
  failure: string;
  confidence: KnowledgeLevel;
};

export type DepthClassMember = {
  visibility: '+' | '-' | '#';
  name: string;
  type: string;
};

export type DepthClass = {
  id: string;
  label: string;
  stereotype:
    | 'entity'
    | 'value object'
    | 'boundary'
    | 'control'
    | 'service'
    | 'repository'
    | 'external';
  tier: 1 | 2 | 3;
  responsibility: string;
  attributes: DepthClassMember[];
  operations: DepthClassMember[];
  invariants: string[];
  confidence: KnowledgeLevel;
};

export type DepthClassRelationship = {
  source: string;
  target: string;
  type:
    | 'association'
    | 'aggregation'
    | 'composition'
    | 'inheritance'
    | 'dependency';
  label: string;
  sourceMultiplicity: string;
  targetMultiplicity: string;
  tier: 1 | 2 | 3;
  reason: string;
};

export type EvidenceSource = {
  label: string;
  url: string;
  proves: string;
  confidence: 'official product' | 'official engineering' | 'scope note';
};

type Archetype =
  | 'overview'
  | 'identity'
  | 'profile'
  | 'core'
  | 'discovery'
  | 'social'
  | 'lifecycle'
  | 'notifications'
  | 'safety'
  | 'money'
  | 'professional'
  | 'admin'
  | 'integration'
  | 'intelligence';

type ScenarioSeed = {
  id: string;
  name: string;
  archetype: Archetype;
  description: string;
  subject: string;
  core: string[];
};

type PlatformSeed = {
  id: string;
  name: string;
  category: string;
  description: string;
  primary: string[];
  professional: string;
  scenarios: ScenarioSeed[];
};

export type DepthScenario = ScenarioSeed & {
  actors: DepthActor[];
  cases: DepthCase[];
  relationships: DepthRelationship[];
  architecture: ArchitectureStage[];
  sequenceParticipants: SequenceParticipant[];
  sequence: Record<'main' | 'failure' | 'background', SequenceStep[]>;
  classes: DepthClass[];
  classRelationships: DepthClassRelationship[];
};

export type DepthPlatform = Omit<PlatformSeed, 'scenarios'> & {
  scenarios: DepthScenario[];
};

export const depthOrder: Record<LabDepth, 1 | 2 | 3> = {
  classroom: 1,
  system: 2,
  exhaustive: 3,
};

export const depthCopy: Record<LabDepth, { label: string; purpose: string }> = {
  classroom: {
    label: 'Classroom',
    purpose:
      'Realistic UML with enough detail to defend actors, goals and relationships.',
  },
  system: {
    label: 'System Design',
    purpose:
      'Adds services, failures, privacy, security, asynchronous work and external dependencies.',
  },
  exhaustive: {
    label: 'Near Exhaustive',
    purpose:
      'Adds operations, administration, reliability, analytics and platform behaviour without claiming private internals.',
  },
};

export const instagramEvidence: Record<string, EvidenceSource[]> = {
  overview: [
    {
      label: 'Instagram Teen Accounts',
      url: 'https://about.fb.com/news/2024/09/instagram-teen-accounts/',
      proves:
        'Private accounts limit who can see and interact with content. This supports keeping logged-out visitors separate from registered users.',
      confidence: 'official product',
    },
    {
      label: 'How AI powers Instagram experiences',
      url: 'https://ai.meta.com/blog/how-ai-powers-experiences-facebook-instagram-system-cards/',
      proves:
        'Instagram uses separate ranking systems for Feed, Stories, Explore, Reels, Search, Suggested Accounts and Notifications.',
      confidence: 'official engineering',
    },
  ],
  identity: [
    {
      label: 'Accounts Center',
      url: 'https://about.fb.com/news/2020/09/privacy-matters-accounts-center/',
      proves:
        'Accounts Center supports optional connected experiences, single sign-on, recovery and cross-posting across Meta products.',
      confidence: 'official product',
    },
    {
      label: 'Centralized account settings',
      url: 'https://about.fb.com/news/2023/01/centralizing-apps-settings-in-accounts-center/',
      proves:
        'Personal details, password and security, ad preferences and connected account settings are managed through Accounts Center.',
      confidence: 'official product',
    },
  ],
  safety: [
    {
      label: 'Instagram Teen Accounts',
      url: 'https://about.fb.com/news/2024/09/instagram-teen-accounts/',
      proves:
        'Teen Accounts use private-by-default, messaging, content and interaction restrictions with parental supervision controls.',
      confidence: 'official product',
    },
    {
      label: 'Recommendation Guidelines',
      url: 'https://about.fb.com/news/2020/08/recommendation-guidelines/',
      proves:
        'Content may be allowed on Instagram but still be ineligible for recommendation, so moderation and recommendation eligibility are separate decisions.',
      confidence: 'official product',
    },
  ],
  creator: [
    {
      label: 'Instagram Creator Marketplace',
      url: 'https://about.fb.com/news/2024/02/creator-marketplace-for-brands-and-creators-to-collaborate-on-instagram/',
      proves:
        'Creators join through the Professional Dashboard while brands use Meta Business Suite to search, contact and run partnership work.',
      confidence: 'official product',
    },
    {
      label: 'Instagram API',
      url: 'https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api',
      proves:
        'The Instagram API supports professional accounts for publishing, comments, mentions, hashtags and metrics.',
      confidence: 'official product',
    },
  ],
  advertising: [
    {
      label: 'Instagram Creator Marketplace',
      url: 'https://about.fb.com/news/2024/02/creator-marketplace-for-brands-and-creators-to-collaborate-on-instagram/',
      proves:
        'Brands and agencies work through Meta Business Suite while creators use Instagram professional tools and partnership ads.',
      confidence: 'official product',
    },
    {
      label: 'Instagram Reels ads',
      url: 'https://www.facebook.com/business/ads/facebook-instagram-reels-ads',
      proves:
        'Businesses and Meta Business Partners can create and manage Reels advertising and partnership campaigns.',
      confidence: 'official product',
    },
  ],
  integrations: [
    {
      label: 'Instagram API',
      url: 'https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api',
      proves:
        'External applications can serve professional accounts through documented permissions, publishing, comments, insights and webhook capabilities.',
      confidence: 'official product',
    },
    {
      label: 'Instagram content publishing API',
      url: 'https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api?entity=request-23987686-ab559ffb-8e2c-4b0a-b43a-5737b6d2f672',
      proves:
        'Publishing uses access tokens, professional accounts, media containers and documented publishing limits.',
      confidence: 'official product',
    },
  ],
  intelligence: [
    {
      label: 'Scaling Instagram Explore recommendations',
      url: 'https://engineering.fb.com/2023/08/09/ml-applications/scaling-instagram-explore-recommendations-system/',
      proves:
        'Explore uses retrieval, first-stage ranking, second-stage ranking and final reranking rather than one single algorithm.',
      confidence: 'official engineering',
    },
    {
      label: 'How Instagram suggests new content',
      url: 'https://engineering.fb.com/2020/12/10/web/how-instagram-suggests-new-content/',
      proves:
        'Suggested posts use candidate generation and selection, with relevance, freshness and engagement signals.',
      confidence: 'official engineering',
    },
    {
      label: 'How Meta AI ranks content',
      url: 'https://about.fb.com/news/2023/06/how-ai-ranks-content-on-facebook-and-instagram/',
      proves:
        'Ranking relies on multiple predictions and gives people controls such as feedback on recommendations.',
      confidence: 'official product',
    },
  ],
};

const evidence = (
  label: string,
  url: string,
  proves: string,
  confidence: EvidenceSource['confidence'] = 'official product',
): EvidenceSource => ({ label, url, proves, confidence });

export const platformEvidence: Record<
  string,
  Record<string, EvidenceSource[]>
> = {
  instagram: instagramEvidence,
  spotify: {
    overview: [
      evidence(
        'Spotify offline listening',
        'https://support.spotify.com/us/article/listen-offline/',
        'Premium listeners can download eligible albums, playlists and podcasts, subject to device and periodic online checks.',
      ),
      evidence(
        'Spotify Web API',
        'https://developer.spotify.com/documentation/web-api',
        'Authorized applications can work with Spotify catalog, profile, playlist and playback data through documented scopes.',
      ),
    ],
  },
  'apple-music': {
    overview: [
      evidence(
        'Apple Music SharePlay',
        'https://support.apple.com/en-us/108767',
        'A subscriber can start a shared listening session while other participants can control the shared queue from supported devices.',
      ),
      evidence(
        'MusicKit',
        'https://developer.apple.com/musickit/',
        'Authorized apps can integrate Apple Music catalog, library and playback capabilities through MusicKit.',
      ),
    ],
  },
  x: {
    overview: [
      evidence(
        'Using X',
        'https://help.x.com/en/using-x',
        'X documents posts, profiles, media, Spaces, Communities, direct messages and accessibility as separate product capabilities.',
      ),
      evidence(
        'X APIs',
        'https://help.x.com/en/rules-and-policies/x-api',
        'External developers register applications and receive only the public or user-authorized scopes granted to the app.',
      ),
    ],
  },
  threads: {
    overview: [
      evidence(
        'Threads and the fediverse',
        'https://about.fb.com/news/2024/06/what-is-the-fediverse/',
        'Public Threads profiles can opt into ActivityPub sharing so accounts on independent fediverse servers can follow and interact.',
      ),
      evidence(
        'Threads fediverse feed and search',
        'https://about.fb.com/news/2025/06/its-now-easier-see-more-fediverse-content-threads/',
        'Threads supports a dedicated fediverse feed and search for federated users when sharing is enabled.',
      ),
    ],
  },
  uber: {
    overview: [
      evidence(
        'Uber rider safety',
        'https://www.uber.com/gb/en/ride/safety/',
        'Uber documents rider, driver, support, emergency, trusted-contact and safety-tool interactions across a trip.',
      ),
      evidence(
        'Uber Driver API scopes',
        'https://developer.uber.com/docs/drivers/guides/scopes',
        'External driver applications use OAuth scopes for profile, payments and trip history.',
      ),
    ],
  },
  ola: {
    overview: [
      evidence(
        'Ola rider support and safety',
        'https://help.olacabs.com/support/dreport/360001506329',
        'Ola documents driver and vehicle verification, app navigation, trip sharing, emergency contacts and support.',
      ),
    ],
  },
  pinterest: {
    overview: [
      evidence(
        'Pinterest visual search',
        'https://help.pinterest.com/en/article/use-visual-search-features',
        'Members can search using images or image regions and can open similar or shoppable results.',
      ),
      evidence(
        'Pinterest ads',
        'https://help.pinterest.com/en/business/article/promoted-pins-overview',
        'Business accounts create paid Pins that may appear in home feeds, category feeds and relevant search results.',
      ),
    ],
  },
  zomato: {
    overview: [
      evidence(
        'Zomato order management API',
        'https://www.zomato.com/developer/integration/docs/api-documentation/order-management/',
        'Restaurant systems can confirm or reject orders, mark preparation states and coordinate pickup through documented APIs and webhooks.',
      ),
    ],
  },
  swiggy: {
    overview: [
      evidence(
        'Swiggy business model',
        'https://www.swiggy.com/corporate/our-business/',
        'Customers discover restaurants and place orders, restaurant partners prepare them, and delivery partners complete delivery.',
      ),
    ],
  },
  blinkit: {
    overview: [
      evidence(
        'Blinkit terms',
        'https://blinkit.com/terms',
        'Blinkit distinguishes customers, third-party sellers and independent delivery partners and documents order, delivery and payment responsibilities.',
      ),
    ],
  },
  instamart: {
    overview: [
      evidence(
        'Swiggy Instamart',
        'https://www.swiggy.com/corporate/our-business/',
        'Instamart orders are received by merchant partners, processed through dark stores and delivered by delivery partners.',
      ),
      evidence(
        'Instamart partner roles',
        'https://www.swiggy.com/instamart-partner',
        'Sellers, franchise partners, property partners and brands use separate partner flows around the Instamart network.',
      ),
    ],
  },
  chatgpt: {
    overview: [
      evidence(
        'ChatGPT learning center',
        'https://learn.chatgpt.com/',
        'Official ChatGPT guidance covers chats, files, projects, tools and workspace use.',
      ),
    ],
  },
  gemini: {
    overview: [
      evidence(
        'Gemini connected apps',
        'https://support.google.com/gemini/answer/14959807',
        'Workspace users can connect enabled Google services while administrators control availability and activity requirements.',
      ),
      evidence(
        'Gemini file analysis',
        'https://support.google.com/gemini/answer/14903178',
        'Gemini accepts supported files, Drive items, code folders and GitHub repositories subject to account settings.',
      ),
    ],
  },
  codex: {
    overview: [
      evidence(
        'Codex use cases',
        'https://developers.openai.com/codex/use-cases',
        'Codex supports repository analysis, implementation, testing, review, migrations, automation and tool-based workflows.',
      ),
    ],
  },
  'claude-code': {
    overview: [
      evidence(
        'Claude Code CLI reference',
        'https://docs.anthropic.com/en/docs/claude-code/cli-usage',
        'Claude Code provides interactive and print modes, session continuation, tool controls, MCP configuration and permission modes.',
      ),
      evidence(
        'Claude Code setup',
        'https://docs.anthropic.com/en/docs/claude-code/getting-started',
        'Claude Code runs locally with shell and network requirements and authenticates to Anthropic services.',
      ),
    ],
  },
};

const classroomAdds: Record<Archetype, string[]> = {
  overview: [
    'Register Account',
    'Login',
    'Manage Profile',
    'Search Platform',
    'View Recommendations',
    'Manage Preferences',
    'View Notifications',
    'Get Help',
    'Report a Problem',
    'Logout',
  ],
  identity: [
    'Register Account',
    'Verify Email',
    'Verify Phone',
    'Login',
    'Logout',
    'Reset Password',
    'Change Password',
    'Enable MFA',
    'Recover Account',
    'Manage Sessions',
    'Review Login Activity',
    'Deactivate Account',
    'Delete Account',
    'Switch Account',
    'Configure Privacy',
  ],
  profile: [
    'Create Profile',
    'Edit Profile',
    'Upload Profile Media',
    'Manage Preferences',
    'Manage Saved Information',
    'View History',
    'Manage Connections',
    'Block Account',
    'Download Account Data',
    'Switch Role',
    'Manage Visibility',
    'View Account Status',
    'Manage Devices',
    'Manage Language',
    'Delete Profile Data',
  ],
  core: [
    'Start Core Action',
    'Select Input',
    'Validate Input',
    'Configure Options',
    'Preview Request',
    'Submit Request',
    'Confirm Request',
    'View Status',
    'Cancel Request',
    'Retry Failed Request',
    'Save Draft',
    'Resume Draft',
    'Edit Result',
    'Share Result',
    'Delete Result',
  ],
  discovery: [
    'Open Discovery',
    'Enter Query',
    'View Suggestions',
    'Apply Filter',
    'Apply Sort',
    'Browse Category',
    'Open Result',
    'View History',
    'Clear History',
    'Save Search',
    'Follow Suggestion',
    'Hide Suggestion',
    'Mark Not Interested',
    'Refresh Results',
    'Provide Feedback',
  ],
  social: [
    'View Connections',
    'Follow Account',
    'Unfollow Account',
    'Send Request',
    'Accept Request',
    'Reject Request',
    'Remove Connection',
    'React',
    'Remove Reaction',
    'Comment',
    'Reply',
    'Edit Comment',
    'Delete Comment',
    'Share',
    'Save',
    'Block',
    'Report',
  ],
  lifecycle: [
    'Create Item',
    'Save Draft',
    'Submit Item',
    'View Status',
    'Edit Item',
    'Pause Item',
    'Resume Item',
    'Cancel Item',
    'Archive Item',
    'Restore Item',
    'Delete Item',
    'Share Item',
    'View History',
    'Retry Action',
    'Confirm Completion',
  ],
  notifications: [
    'Receive In-app Alert',
    'Receive Push Alert',
    'Receive Email Alert',
    'Receive SMS Alert',
    'Open Notification',
    'Mark Read',
    'Mark All Read',
    'Configure Notifications',
    'Disable Notification Type',
    'Pause Notifications',
    'Configure Email',
    'Configure Push',
    'Configure SMS',
    'View Notification History',
    'Clear Notification',
  ],
  safety: [
    'Configure Privacy',
    'Block Account',
    'Restrict Account',
    'Mute Account',
    'Report Account',
    'Report Content',
    'Report Message',
    'Hide Offensive Content',
    'Manage Hidden Words',
    'Control Sensitive Content',
    'Review Account Status',
    'Appeal Decision',
    'Review Safety Alert',
    'Confirm Identity',
    'Get Emergency Help',
  ],
  money: [
    'Add Payment Method',
    'Select Plan',
    'Start Purchase',
    'Apply Offer',
    'Confirm Price',
    'Authorize Payment',
    'View Receipt',
    'View Billing History',
    'Request Refund',
    'Cancel Subscription',
    'Resume Subscription',
    'Update Payment Method',
    'Download Invoice',
    'Resolve Failed Payment',
    'View Earnings',
  ],
  professional: [
    'Create Professional Profile',
    'Open Dashboard',
    'View Insights',
    'View Audience Metrics',
    'View Performance',
    'Schedule Work',
    'Manage Portfolio',
    'Manage Contact Options',
    'Promote Work',
    'Manage Monetization',
    'Manage Partnership',
    'Invite Collaborator',
    'Export Report',
    'Configure Availability',
    'Manage Professional Status',
  ],
  admin: [
    'Review Report',
    'Review Content',
    'Review Account',
    'Remove Content',
    'Restrict Content',
    'Warn User',
    'Suspend Account',
    'Restore Account',
    'Review Appeal',
    'Respond to Support Request',
    'Escalate Case',
    'Manage Policy',
    'Review Platform Analytics',
    'Investigate Abuse',
    'Manage Feature',
  ],
  integration: [
    'Grant Device Permission',
    'Capture Media',
    'Import Media',
    'Record Audio',
    'Retrieve Location',
    'Sync Contacts',
    'Authenticate Externally',
    'Retrieve External Content',
    'Process Payment',
    'Deliver Notification',
    'Upload File',
    'Retrieve File',
    'Share External Link',
    'Open Deep Link',
    'Revoke Integration',
  ],
  intelligence: [
    'Request Personalized Results',
    'Capture Context',
    'Collect Interaction Signal',
    'Retrieve Candidates',
    'Retrieve User Features',
    'Retrieve Item Features',
    'Predict Relevance',
    'Rank Candidates',
    'Apply Eligibility Rules',
    'Apply Safety Filter',
    'Diversify Results',
    'Serve Results',
    'Record Impression',
    'Record Interaction',
    'Capture Feedback',
  ],
};

const systemAdds: Record<Archetype, string[]> = {
  overview: [
    'Authorize Capability',
    'Apply Rate Limit',
    'Resolve Feature Flag',
    'Record Audit Event',
    'Handle Degraded Mode',
    'Route Support Case',
    'Measure Product Event',
    'Run Experiment',
    'Apply Regional Rule',
    'Synchronize Device State',
    'Process Background Job',
    'Recover Failed Operation',
  ],
  identity: [
    'Detect Suspicious Login',
    'Issue Login Challenge',
    'Validate Device',
    'Rotate Session Token',
    'Revoke Session',
    'Link External Identity',
    'Enforce Age Rule',
    'Send Security Alert',
    'Apply Account Restriction',
    'Review Compromise Signal',
    'Start Deletion Lifecycle',
    'Restore Recoverable Account',
    'Audit Credential Change',
  ],
  profile: [
    'Validate Unique Identity',
    'Resolve Privacy Policy',
    'Version Profile Change',
    'Synchronize Connected Account',
    'Moderate Profile Media',
    'Index Public Profile',
    'Invalidate Profile Cache',
    'Export Personal Data',
    'Apply Retention Rule',
    'Record Profile Audit',
    'Handle Role Approval',
    'Notify Connected Users',
  ],
  core: [
    'Authorize Core Action',
    'Create Idempotency Key',
    'Reserve Capacity',
    'Persist Source Record',
    'Process Input',
    'Run Policy Check',
    'Store Large Object',
    'Emit Domain Event',
    'Update Search Index',
    'Notify Interested User',
    'Compensate Partial Failure',
    'Measure Completion',
    'Apply Rate Limit',
    'Resolve Concurrent Edit',
    'Schedule Deferred Work',
  ],
  discovery: [
    'Normalize Query',
    'Run Autocomplete',
    'Retrieve Indexed Candidates',
    'Retrieve Personalized Candidates',
    'Enrich Result Metadata',
    'Apply Eligibility Filter',
    'Apply Policy Filter',
    'Rank Results',
    'Deduplicate Results',
    'Paginate Results',
    'Cache Result Page',
    'Record Impression',
    'Handle Empty Results',
    'Handle Search Timeout',
    'Update Search Index',
  ],
  social: [
    'Validate Relationship Rule',
    'Check Block Graph',
    'Store Idempotent Edge',
    'Update Counter Cache',
    'Generate Social Event',
    'Apply Comment Policy',
    'Detect Spam',
    'Rank Replies',
    'Notify Recipient',
    'Update Activity Feed',
    'Handle Private Account',
    'Resolve Concurrent Action',
    'Record Abuse Signal',
  ],
  lifecycle: [
    'Validate State Transition',
    'Acquire Version Lock',
    'Store State Change',
    'Generate Audit Event',
    'Update Derived View',
    'Schedule Expiry',
    'Run Retention Policy',
    'Emit Lifecycle Event',
    'Notify Stakeholder',
    'Retry Transition',
    'Compensate Failed Transition',
    'Reconcile State',
    'Measure Lifecycle Time',
  ],
  notifications: [
    'Generate Notification Event',
    'Check Eligibility',
    'Load Preferences',
    'Suppress Duplicate',
    'Apply Quiet Hours',
    'Prioritize Notification',
    'Batch Notifications',
    'Select Delivery Channel',
    'Render Template',
    'Deliver Push',
    'Deliver Email',
    'Deliver SMS',
    'Retry Delivery',
    'Record Delivery',
    'Measure Open',
  ],
  safety: [
    'Capture Evidence Snapshot',
    'Deduplicate Report',
    'Score Severity',
    'Prioritize Case',
    'Run Automated Detection',
    'Assign Human Review',
    'Apply Policy',
    'Record Enforcement',
    'Reduce Distribution',
    'Notify Affected Account',
    'Preserve Appeal Evidence',
    'Review Appeal',
    'Restore Content',
    'Audit Decision',
    'Apply Regional Policy',
  ],
  money: [
    'Tokenize Payment Method',
    'Calculate Tax',
    'Calculate Commission',
    'Create Payment Intent',
    'Run Fraud Check',
    'Authorize Payment',
    'Capture Payment',
    'Write Billing Ledger',
    'Activate Entitlement',
    'Schedule Renewal',
    'Handle Webhook',
    'Retry Failed Charge',
    'Issue Refund',
    'Reconcile Settlement',
    'Generate Invoice',
  ],
  professional: [
    'Verify Professional Eligibility',
    'Aggregate Analytics',
    'Apply Reporting Window',
    'Schedule Publication',
    'Validate Partnership',
    'Approve Monetization',
    'Calculate Earnings',
    'Export Analytics',
    'Protect Audience Privacy',
    'Detect Metric Abuse',
    'Manage Business Identity',
    'Record Professional Audit',
  ],
  admin: [
    'Authenticate Staff',
    'Authorize Internal Permission',
    'Assign Case Queue',
    'Prioritize Case',
    'Retrieve Evidence',
    'Apply Regional Policy',
    'Record Decision',
    'Require Dual Approval',
    'Escalate Specialist Case',
    'Audit Staff Action',
    'Notify User',
    'Measure Queue Health',
    'Restore Incorrect Action',
  ],
  integration: [
    'Request OAuth Consent',
    'Store Access Grant',
    'Refresh Access Token',
    'Validate External Payload',
    'Map External Identity',
    'Handle Permission Denial',
    'Handle Provider Timeout',
    'Retry Provider Request',
    'Revoke Access Grant',
    'Audit Data Exchange',
    'Apply Data Minimization',
    'Process Webhook',
    'Verify Webhook Signature',
  ],
  intelligence: [
    'Build Feature Profile',
    'Retrieve Multiple Candidate Sources',
    'Enrich Candidate Features',
    'Score Candidate',
    'Predict Engagement',
    'Predict Negative Feedback',
    'Apply Integrity Filter',
    'Apply Freshness Rule',
    'Apply Creator Constraint',
    'Combine Organic and Paid Inventory',
    'Calibrate Score',
    'Paginate Ranked Results',
    'Update Preference Profile',
    'Run Offline Evaluation',
    'Run Online Experiment',
  ],
};

const exhaustiveAdds: Record<Archetype, string[]> = {
  overview: [
    'Route Multi-region Request',
    'Check Service Health',
    'Apply Circuit Breaker',
    'Reconcile Eventual State',
    'Replay Failed Event',
    'Run Data Retention Job',
    'Handle Legal Request',
    'Export Compliance Record',
    'Manage Internal Permission',
    'Inspect Reliability Metric',
    'Roll Back Feature',
    'Manage Tenant Configuration',
    'Detect Platform Abuse',
    'Resolve Data Conflict',
    'Archive Audit History',
  ],
  identity: [
    'Evaluate Credential Stuffing Risk',
    'Check Compromised Password',
    'Bind Trusted Device',
    'Unbind Device',
    'Resolve Session Conflict',
    'Apply Parental Supervision',
    'Verify Government Identity',
    'Review Age Appeal',
    'Quarantine Compromised Account',
    'Restore Verified Ownership',
    'Purge Expired Identity Data',
    'Handle Legal Hold',
    'Reconcile Linked Accounts',
    'Review Identity Audit Trail',
    'Measure Authentication Funnel',
  ],
  profile: [
    'Merge Duplicate Profile',
    'Resolve Identity Collision',
    'Apply Field-level Visibility',
    'Moderate Historical Changes',
    'Rebuild Profile Index',
    'Purge Expired Personal Data',
    'Handle Legal Hold',
    'Migrate Profile Schema',
    'Reconcile Device Preference',
    'Measure Profile Funnel',
    'Test Profile Experiment',
    'Restore Previous Profile Version',
    'Manage Delegate Access',
    'Review Data Access Log',
    'Process Privacy Request',
  ],
  core: [
    'Shard Core Record',
    'Replicate Source State',
    'Detect Duplicate Submission',
    'Resume Chunked Upload',
    'Reprocess Failed Object',
    'Reconcile Derived State',
    'Replay Domain Event',
    'Apply Circuit Breaker',
    'Serve Degraded Response',
    'Run Disaster Recovery',
    'Enforce Regional Storage',
    'Purge Expired Data',
    'Handle Legal Hold',
    'Run Abuse Model',
    'Inspect Trace',
    'Run Capacity Protection',
    'Backfill Derived View',
    'Roll Back Release',
  ],
  discovery: [
    'Route Search Region',
    'Merge Federated Results',
    'Apply Language Analysis',
    'Correct Spelling',
    'Detect Query Abuse',
    'Apply Legal Removal',
    'Protect Sensitive Query',
    'Calibrate Ranking',
    'Run Interleaving Test',
    'Detect Index Lag',
    'Rebuild Index Partition',
    'Serve Stale Cache',
    'Fall Back to Trending',
    'Explain Empty Result',
    'Measure Search Satisfaction',
    'Purge Search History',
  ],
  social: [
    'Detect Coordinated Abuse',
    'Throttle Interaction Burst',
    'Quarantine Suspicious Edge',
    'Rebuild Graph Partition',
    'Reconcile Counter Drift',
    'Apply Teen Safety Rule',
    'Protect Restricted Account',
    'Handle Legal Removal',
    'Preserve Moderation Evidence',
    'Backfill Activity Feed',
    'Replay Notification Event',
    'Measure Relationship Quality',
    'Expire Temporary Restriction',
    'Restore Wrongly Removed Interaction',
    'Audit Graph Change',
  ],
  lifecycle: [
    'Enforce Cross-region Ordering',
    'Detect Stuck State',
    'Repair Invalid State',
    'Replay Lifecycle Event',
    'Backfill Timeline',
    'Apply Legal Hold',
    'Purge Expired Version',
    'Migrate State Schema',
    'Reconcile External Status',
    'Handle Provider Reversal',
    'Run Disaster Recovery',
    'Measure SLA Breach',
    'Escalate Stalled Item',
    'Restore Archived Version',
    'Audit Full Lifecycle',
  ],
  notifications: [
    'Route Delivery Region',
    'Apply Per-user Frequency Cap',
    'Apply Global Frequency Cap',
    'Detect Notification Abuse',
    'Protect Sensitive Preview',
    'Use Fallback Channel',
    'Replay Failed Batch',
    'Reconcile Provider Receipt',
    'Expire Stale Notification',
    'Delete Notification Data',
    'Run Delivery Experiment',
    'Measure Incremental Value',
    'Calibrate Priority',
    'Manage Provider Outage',
    'Audit Sensitive Alert',
  ],
  safety: [
    'Detect Coordinated Campaign',
    'Link Related Cases',
    'Apply Child Safety Escalation',
    'Apply Imminent Harm Protocol',
    'Handle Copyright Claim',
    'Handle Counter Notice',
    'Detect Impersonation',
    'Detect Fraud Network',
    'Preserve Legal Evidence',
    'Handle Law Enforcement Request',
    'Apply Transparency Notice',
    'Measure Policy Precision',
    'Review Model False Positive',
    'Calibrate Severity Model',
    'Run Moderator Quality Review',
    'Restrict Staff Access',
    'Restore Wrongly Penalized Account',
  ],
  money: [
    'Route Payment Region',
    'Apply Strong Customer Authentication',
    'Handle Currency Conversion',
    'Handle Chargeback',
    'Represent Dispute',
    'Detect Account Takeover',
    'Detect Promotion Abuse',
    'Split Settlement',
    'Hold Payout',
    'Release Payout',
    'Reconcile Processor Ledger',
    'Close Accounting Period',
    'Generate Tax Document',
    'Apply Financial Retention',
    'Handle Provider Outage',
    'Audit Manual Adjustment',
    'Measure Payment Funnel',
  ],
  professional: [
    'Segment Audience Cohort',
    'Attribute Conversion',
    'Protect Small Cohort',
    'Correct Analytics Lag',
    'Backfill Metric',
    'Detect Artificial Engagement',
    'Review Monetization Appeal',
    'Reconcile Earnings',
    'Handle Rights Claim',
    'Manage Regional Eligibility',
    'Run Creator Experiment',
    'Compare Content Cohorts',
    'Export Scheduled Report',
    'Audit Partnership Change',
    'Measure Tool Adoption',
  ],
  admin: [
    'Enforce Least Privilege',
    'Review Staff Access',
    'Expire Temporary Permission',
    'Redact Sensitive Evidence',
    'Apply Legal Hold',
    'Export Transparency Record',
    'Detect Insider Abuse',
    'Require Break-glass Approval',
    'Review Moderator Quality',
    'Calibrate Queue Priority',
    'Reassign Regional Case',
    'Replay Case Event',
    'Restore Corrupt Case',
    'Measure Policy Outcome',
    'Audit Full Case History',
  ],
  integration: [
    'Route Provider Region',
    'Rotate Client Secret',
    'Detect Token Theft',
    'Apply Scope Downgrade',
    'Quarantine Malformed Payload',
    'Replay Missed Webhook',
    'Deduplicate Webhook',
    'Reconcile Provider State',
    'Use Secondary Provider',
    'Apply Circuit Breaker',
    'Measure Provider SLA',
    'Delete Imported Data',
    'Handle User Data Request',
    'Audit Every Exchange',
    'Suspend Compromised Integration',
  ],
  intelligence: [
    'Monitor Feature Drift',
    'Monitor Score Drift',
    'Detect Training Serving Skew',
    'Apply Fairness Constraint',
    'Apply Regional Constraint',
    'Apply Exploration Policy',
    'Run Shadow Model',
    'Run Canary Model',
    'Fall Back to Heuristic',
    'Protect Sensitive Features',
    'Delete Training Signal',
    'Explain Recommendation Control',
    'Audit Model Version',
    'Measure Long-term Outcome',
    'Detect Feedback Loop',
    'Rebuild Embedding',
    'Backfill Features',
    'Recover Feature Store',
  ],
};

const architectureByType: Record<Archetype, ArchitectureStage[]> = {
  overview: [
    [
      'Client and gateway',
      'Receive the request and expose the public boundary.',
      'HTTPS, API gateway',
      'observable',
    ],
    [
      'Capability services',
      'Own the platform functions selected in this overview.',
      'service boundaries',
      'conceptual',
    ],
    [
      'Event pipeline',
      'Carry completed state changes to background consumers.',
      'event bus, queue',
      'conceptual',
    ],
    [
      'Data and analytics',
      'Store source state and measure product behaviour.',
      'database, object storage, warehouse',
      'conceptual',
    ],
  ].map(stage),
  identity: [
    [
      'Identity boundary',
      'Collect credentials, recovery proof or federated identity.',
      'OIDC, OAuth, WebAuthn',
      'documented',
    ],
    [
      'Risk and challenge',
      'Assess the login and request stronger proof when needed.',
      'risk scoring, OTP, MFA',
      'conceptual',
    ],
    [
      'Session authority',
      'Issue, rotate and revoke authenticated sessions.',
      'signed token, session store',
      'conceptual',
    ],
    [
      'Security events',
      'Notify the account and preserve an audit trail.',
      'event bus, audit log',
      'conceptual',
    ],
  ].map(stage),
  profile: [
    [
      'Profile boundary',
      'Validate visible profile and preference changes.',
      'API validation',
      'observable',
    ],
    [
      'Profile service',
      'Own the current profile and privacy fields.',
      'versioned record',
      'conceptual',
    ],
    [
      'Index and cache',
      'Refresh public discovery and cached profile reads.',
      'search index, cache invalidation',
      'conceptual',
    ],
    [
      'Privacy workflow',
      'Export, retain or delete personal data under policy.',
      'workflow, retention job',
      'conceptual',
    ],
  ].map(stage),
  core: [
    [
      'Client boundary',
      'Collect the user goal and input.',
      'web or mobile client',
      'observable',
    ],
    [
      'Core service',
      'Validate and own the main state transition.',
      'domain service, idempotency',
      'conceptual',
    ],
    [
      'Policy and processing',
      'Apply safety, eligibility and heavy processing.',
      'policy engine, worker queue',
      'conceptual',
    ],
    [
      'Storage and events',
      'Persist source state and emit follow-up work.',
      'database, object storage, event bus',
      'conceptual',
    ],
  ].map(stage),
  discovery: [
    [
      'Query boundary',
      'Normalize the query, context, filters and cursor.',
      'search API',
      'observable',
    ],
    [
      'Candidate retrieval',
      'Retrieve indexed and personalized candidates.',
      'inverted index, vector retrieval',
      'conceptual',
    ],
    [
      'Ranking and policy',
      'Score, filter, deduplicate and diversify results.',
      'ranking service, policy engine',
      'conceptual',
    ],
    [
      'Serving and feedback',
      'Hydrate the page, cache it and record response signals.',
      'cache, analytics event',
      'conceptual',
    ],
  ].map(stage),
  social: [
    [
      'Interaction boundary',
      'Check identity, visibility and relationship policy.',
      'authorization',
      'observable',
    ],
    [
      'Graph or interaction store',
      'Write the relationship or engagement once.',
      'graph edge, idempotency key',
      'conceptual',
    ],
    [
      'Derived updates',
      'Update counters, feeds and indexes after the write.',
      'event consumers',
      'conceptual',
    ],
    [
      'Recipient communication',
      'Notify the affected account under preference rules.',
      'notification service',
      'conceptual',
    ],
  ].map(stage),
  lifecycle: [
    [
      'Command boundary',
      'Validate the requested transition.',
      'state machine',
      'observable',
    ],
    [
      'State authority',
      'Persist the new source state with version control.',
      'transaction, optimistic concurrency',
      'conceptual',
    ],
    [
      'Workflow engine',
      'Schedule expiry, retry or compensation.',
      'workflow, queue',
      'conceptual',
    ],
    [
      'Audit and projection',
      'Update history, derived views and stakeholder alerts.',
      'audit log, event projection',
      'conceptual',
    ],
  ].map(stage),
  notifications: [
    [
      'Event source',
      'Emit a notification candidate after a state change.',
      'domain event',
      'conceptual',
    ],
    [
      'Decision layer',
      'Check preferences, priority, quiet hours and frequency.',
      'rules and ranking',
      'conceptual',
    ],
    [
      'Channel delivery',
      'Render and deliver through the selected provider.',
      'push, email, SMS',
      'documented',
    ],
    [
      'Receipt and learning',
      'Record delivery, open and downstream action.',
      'delivery receipt, analytics',
      'conceptual',
    ],
  ].map(stage),
  safety: [
    [
      'Report or detector',
      'Create a case from user evidence or an automated signal.',
      'case intake, classifier',
      'conceptual',
    ],
    [
      'Triage',
      'Deduplicate, score severity and prioritize review.',
      'queue, risk score',
      'conceptual',
    ],
    [
      'Decision',
      'Apply policy through automated or human review.',
      'policy engine, moderation console',
      'conceptual',
    ],
    [
      'Enforcement and appeal',
      'Apply the action, notify parties and preserve appeal evidence.',
      'audit log, workflow',
      'conceptual',
    ],
  ].map(stage),
  money: [
    [
      'Checkout boundary',
      'Collect plan, price and payment choice.',
      'checkout API',
      'observable',
    ],
    [
      'Payment and fraud',
      'Tokenize, authorize and assess risk.',
      'payment processor, fraud rules',
      'documented',
    ],
    [
      'Ledger and entitlement',
      'Record money movement before granting value.',
      'billing ledger, entitlement',
      'conceptual',
    ],
    [
      'Settlement and recovery',
      'Settle, refund, retry and reconcile external state.',
      'webhook, reconciliation job',
      'conceptual',
    ],
  ].map(stage),
  professional: [
    [
      'Professional boundary',
      'Expose role-specific tools and reports.',
      'dashboard API',
      'observable',
    ],
    [
      'Eligibility and policy',
      'Verify role, partnership and monetization rules.',
      'policy service',
      'conceptual',
    ],
    [
      'Analytics pipeline',
      'Aggregate events without exposing private individuals.',
      'stream, warehouse, OLAP',
      'conceptual',
    ],
    [
      'Scheduling and payouts',
      'Run deferred publication, reports or earnings workflows.',
      'scheduler, ledger',
      'conceptual',
    ],
  ].map(stage),
  admin: [
    [
      'Staff identity',
      'Authenticate staff and enforce least privilege.',
      'SSO, RBAC',
      'conceptual',
    ],
    [
      'Case workspace',
      'Retrieve prioritized cases and evidence.',
      'case management',
      'conceptual',
    ],
    [
      'Decision authority',
      'Record policy action and required approvals.',
      'policy engine, audit log',
      'conceptual',
    ],
    [
      'Quality and operations',
      'Measure queues, appeals and staff decision quality.',
      'analytics, quality review',
      'conceptual',
    ],
  ].map(stage),
  integration: [
    [
      'Permission boundary',
      'Obtain user or operator permission for data exchange.',
      'OAuth, device permission',
      'documented',
    ],
    [
      'Adapter',
      'Translate platform requests and external payloads.',
      'provider adapter',
      'conceptual',
    ],
    [
      'Reliability control',
      'Retry, deduplicate and reconcile provider state.',
      'queue, circuit breaker',
      'conceptual',
    ],
    [
      'Privacy and audit',
      'Minimize exchanged data and record access.',
      'scope, audit log',
      'conceptual',
    ],
  ].map(stage),
  intelligence: [
    [
      'Signal and profile',
      'Turn interactions and context into usable features.',
      'event stream, feature store',
      'conceptual',
    ],
    [
      'Candidate generation',
      'Retrieve several pools of eligible candidates.',
      'index, embeddings, graph',
      'conceptual',
    ],
    [
      'Scoring and ranking',
      'Predict outcomes and order candidates.',
      'ML inference, ranker',
      'conceptual',
    ],
    [
      'Policy and serving',
      'Filter, diversify, serve and record feedback.',
      'policy engine, cache, feedback loop',
      'conceptual',
    ],
  ].map(stage),
};

function stage(value: string[]): ArchitectureStage {
  return {
    label: value[0],
    responsibility: value[1],
    technology: value[2],
    confidence: value[3] as KnowledgeLevel,
  };
}

const sharedExternalActors: DepthActor[] = [
  actor(
    'identity-provider',
    'Identity Provider',
    'external',
    'secondary',
    2,
    'Authenticates an account when federated sign-in is chosen.',
    ['Return a valid identity assertion'],
  ),
  actor(
    'notification-provider',
    'Notification Provider',
    'external',
    'secondary',
    2,
    'Delivers push, email or SMS outside the platform boundary.',
    ['Deliver an eligible message'],
  ),
  actor(
    'payment-provider',
    'Payment Provider',
    'external',
    'secondary',
    2,
    'Authorizes, captures, refunds or rejects payment instructions.',
    ['Return a final payment state'],
  ),
  actor(
    'device-services',
    'Device Services',
    'external',
    'secondary',
    1,
    'Provides user-approved camera, microphone, media, location or contacts.',
    ['Supply selected device data'],
  ),
  actor(
    'support-staff',
    'Support or Operations Staff',
    'person',
    'primary',
    2,
    'Starts review, recovery and dispute goals through an internal interface.',
    ['Resolve a user or platform case'],
  ),
  actor(
    'regulator',
    'Legal or Compliance Authority',
    'external',
    'secondary',
    3,
    'Sends a valid legal or compliance request under a separate controlled process.',
    ['Receive a compliant response'],
  ),
  actor(
    'map-navigation-provider',
    'Map and Navigation Provider',
    'external',
    'secondary',
    2,
    'Returns geocoding, route, distance and navigation data across the selected product boundary.',
    ['Return an eligible route or location result'],
  ),
  actor(
    'catalog-rights-provider',
    'Catalog or Rights Provider',
    'external',
    'secondary',
    2,
    'Supplies licensed catalog metadata and territory or entitlement decisions.',
    ['Return eligible catalog and rights state'],
  ),
  actor(
    'connected-device-platform',
    'Connected Device Platform',
    'external',
    'secondary',
    2,
    'Receives authorized playback or session-control instructions on another device.',
    ['Play or control an authorized session'],
  ),
  actor(
    'source-control-host',
    'Source Control Host',
    'external',
    'secondary',
    1,
    'Supplies authorized repository state and accepts permitted branch, review or pull request operations.',
    ['Return or update authorized repository data'],
  ),
  actor(
    'connected-app-provider',
    'Connected App or Tool Provider',
    'external',
    'secondary',
    2,
    'Provides data or actions through an authorized app, extension, MCP server or product integration.',
    ['Return permitted tool data or action result'],
  ),
  actor(
    'emergency-services',
    'Emergency Services',
    'external',
    'secondary',
    2,
    'Receives a user-initiated emergency call or eligible location and trip context where supported.',
    ['Respond to an emergency request'],
  ),
  actor(
    'fediverse-server',
    'Fediverse Server',
    'external',
    'secondary',
    2,
    'Exchanges public profile, follow and post activity through the ActivityPub boundary when federation is enabled.',
    ['Exchange eligible federated activity'],
  ),
  actor(
    'restaurant-pos',
    'Restaurant POS System',
    'external',
    'secondary',
    2,
    'Receives restaurant orders and returns acceptance, preparation and pickup state through an integration.',
    ['Keep restaurant and platform order state aligned'],
  ),
];

function actor(
  id: string,
  label: string,
  kind: DepthActor['kind'],
  role: DepthActor['role'],
  tier: 1 | 2 | 3,
  description: string,
  goals: string[],
): DepthActor {
  return { id, label, kind, role, tier, description, goals };
}

function scenario(
  id: string,
  name: string,
  archetype: Archetype,
  subject: string,
  core: string[],
): ScenarioSeed {
  return {
    id,
    name,
    archetype,
    subject,
    core,
    description: `${name} models the goals, variations and supporting behaviour around ${subject}.`,
  };
}

const instagramScenarios: ScenarioSeed[] = [
  scenario(
    'overview',
    'Platform Overview',
    'overview',
    'the complete Instagram platform',
    [
      'Open Shared Public Post or Reel',
      'View Public Profile Preview',
      'Continue to Login',
      'Register Account',
      'Login',
      'View Feed',
      'Create Post',
      'Create Story',
      'Create Reel',
      'Go Live',
      'Follow User',
      'Like Content',
      'Comment on Content',
      'Save Content',
      'Share Content',
      'Send Message',
      'Explore Content',
      'View Insights',
      'Promote Content',
      'Moderate Content',
    ],
  ),
  scenario(
    'identity',
    'Authentication, Account and Identity',
    'identity',
    'account access and identity',
    [
      'Register Account',
      'Login',
      'Logout',
      'Reset Password',
      'Remember Login',
      'Recover Account',
      'Review Login Activity',
      'Manage Connected Meta Account',
      'Change Username',
      'Review Account Status',
    ],
  ),
  scenario(
    'content',
    'Content Creation and Publishing',
    'core',
    'posts and reels',
    [
      'Create Post',
      'Create Reel',
      'Select Media',
      'Capture Media',
      'Edit Image',
      'Edit Video',
      'Crop Media',
      'Apply Filter',
      'Add Caption',
      'Add Hashtags',
      'Tag People',
      'Add Location',
      'Add Music',
      'Add Collaborator',
      'Configure Audience',
      'Configure Comments',
      'Add Accessibility Information',
      'Preview Content',
      'Save Draft',
      'Schedule Publication',
      'View Publication Status',
      'Publish Content',
      'Edit Published Content',
      'Archive Content',
      'Delete Content',
    ],
  ),
  scenario(
    'discovery',
    'Feed, Explore, Search and Recommendation',
    'discovery',
    'feed and discovery',
    [
      'View Home Feed',
      'Refresh Feed',
      'Scroll Feed',
      'View Following Feed',
      'View Suggested Content',
      'Explore Content',
      'Search User',
      'Search Hashtag',
      'Search Place',
      'Search Content',
      'View Sponsored Content',
      'Provide Recommendation Feedback',
    ],
  ),
  scenario(
    'social',
    'Social Graph and Engagement',
    'social',
    'relationships and engagement',
    [
      'Send Follow Request',
      'Accept Follow Request',
      'Reject Follow Request',
      'Remove Follower',
      'Restrict User',
      'Unlike Content',
      'Mention User',
      'Tag User',
      'Unsave Content',
      'Create Collection',
      'Add to Collection',
      'View Followers',
      'View Following',
      'Pin Comment',
    ],
  ),
  scenario(
    'messaging',
    'Direct Messaging and Calls',
    'social',
    'messages, groups and calls',
    [
      'Open Inbox',
      'Search Conversation',
      'Start Conversation',
      'Select Recipient',
      'Send Text',
      'Send Photo',
      'Send Video',
      'Send Voice Message',
      'Send GIF',
      'Share Post',
      'Share Reel',
      'React to Message',
      'Reply to Message',
      'Forward Message',
      'Unsend Message',
      'Create Group',
      'Add Group Member',
      'Remove Group Member',
      'Mute Chat',
      'Pin Chat',
      'Start Video Call',
      'Start Audio Call',
      'Report Conversation',
    ],
  ),
  scenario(
    'stories-live',
    'Stories, Highlights and Live',
    'lifecycle',
    'stories, highlights and live sessions',
    [
      'Create Story',
      'Add Text',
      'Add Music',
      'Add Sticker',
      'Add Poll',
      'Add Question',
      'Add Link',
      'Select Story Audience',
      'Share to Close Friends',
      'Publish Story',
      'View Story',
      'Reply to Story',
      'React to Story',
      'Delete Story',
      'Archive Story',
      'Create Highlight',
      'Add to Highlight',
      'Start Live',
      'Join Live',
      'Comment on Live',
      'Invite Live Guest',
      'End Live',
    ],
  ),
  scenario(
    'safety',
    'Safety, Privacy and Moderation',
    'safety',
    'privacy and safety controls',
    [
      'Set Account Private',
      'Configure Comment Privacy',
      'Configure Mentions',
      'Configure Tags',
      'Hide Offensive Comments',
      'Manage Hidden Words',
      'Control Sensitive Content',
      'Report Post',
      'Report Comment',
      'Report Message',
      'Review Account Status',
      'Appeal Decision',
    ],
  ),
  scenario(
    'creator',
    'Creator and Professional Accounts',
    'professional',
    'professional accounts',
    [
      'Convert Account',
      'Open Professional Dashboard',
      'View Content Metrics',
      'View Reach',
      'View Engagement',
      'Schedule Content',
      'Manage Branded Content',
      'Collaborate on Content',
      'Configure Contact Options',
      'Promote Content',
      'Manage Creator Monetization',
      'Manage Partnership',
    ],
  ),
  scenario(
    'advertising',
    'Advertising and Business',
    'money',
    'advertising campaigns',
    [
      'Create Promotion',
      'Select Objective',
      'Select Content',
      'Define Audience',
      'Set Budget',
      'Set Duration',
      'Submit Promotion',
      'Review Promotion',
      'Deliver Ad',
      'View Ad',
      'Interact With Ad',
      'Track Performance',
      'Pause Promotion',
      'Resume Promotion',
      'Edit Promotion',
      'End Promotion',
      'View Billing',
    ],
  ),
  scenario(
    'notifications',
    'Notifications and Communications',
    'notifications',
    'Instagram notifications',
    [
      'Receive Like Notification',
      'Receive Comment Notification',
      'Receive Follow Notification',
      'Receive Mention Notification',
      'Receive Message Notification',
      'Receive Live Notification',
      'Receive Recommendation',
      'Receive Security Alert',
    ],
  ),
  scenario(
    'administration',
    'Administration and Platform Operations',
    'admin',
    'Instagram operations',
    [
      'Review Report',
      'Review Content',
      'Remove Content',
      'Restrict Content',
      'Warn User',
      'Suspend Account',
      'Restore Account',
      'Review Appeal',
      'Respond to Support Request',
      'Escalate Case',
      'Manage Policy',
      'Investigate Abuse',
      'Handle Impersonation',
    ],
  ),
  scenario(
    'integrations',
    'External Services and Integrations',
    'integration',
    'device and external integrations',
    [
      'Capture Media',
      'Import Media',
      'Record Audio',
      'Retrieve Location',
      'Sync Contacts',
      'Share Across Meta Services',
      'Retrieve Music',
      'Deliver Notification',
      'Upload Media',
      'Retrieve Media',
      'Share External Link',
      'Open Deep Link',
      'Import Contact Suggestions',
    ],
  ),
  scenario(
    'intelligence',
    'Recommendation, Ranking and ML',
    'intelligence',
    'feed, reels and Explore ranking',
    [
      'Request Feed',
      'Request Reels',
      'Request Explore',
      'Retrieve Followed Content',
      'Retrieve Recommended Content',
      'Retrieve Ads',
      'Predict Engagement',
      'Apply Integrity Filter',
      'Generate Final Ranking',
      'Update Preference Profile',
      'Hide Recommendation',
      'Mark Not Interested',
    ],
  ),
];

const spotifyScenarios: ScenarioSeed[] = [
  scenario(
    'overview',
    'Platform Overview',
    'overview',
    'the complete Spotify or Apple Music platform',
    [
      'Search Catalog',
      'Play Audio',
      'Manage Queue',
      'Save Track',
      'Create Playlist',
      'Follow Artist',
      'Follow Podcast',
      'Share Audio',
      'Download Offline',
      'View Recommendations',
      'Manage Subscription',
      'Publish Audio',
      'View Creator Analytics',
      'Transfer Playback',
    ],
  ),
  scenario(
    'identity',
    'Authentication, Account and Identity',
    'identity',
    'listener accounts and access',
    [
      'Create Listener Account',
      'Link Provider Account',
      'Manage Family Member',
      'Verify Student Status',
      'Recover Account',
      'Manage Logged-in Devices',
    ],
  ),
  scenario(
    'profile',
    'Profile, Preferences and Social Identity',
    'profile',
    'listener identity and preferences',
    [
      'Edit Display Name',
      'Change Profile Photo',
      'Manage Explicit Content',
      'Manage Language',
      'Manage Privacy',
      'Follow Listener',
      'View Listening History',
      'Manage Taste Profile',
    ],
  ),
  scenario('playback', 'Playback and Queue', 'core', 'audio playback', [
    'Select Track',
    'Start Playback',
    'Pause Playback',
    'Resume Playback',
    'Seek Position',
    'Skip Track',
    'Return to Previous Track',
    'Adjust Volume',
    'Enable Shuffle',
    'Enable Repeat',
    'View Lyrics',
    'Change Audio Quality',
    'Manage Queue',
    'Transfer Playback',
    'Start Radio',
    'Play Podcast Episode',
  ]),
  scenario(
    'library',
    'Library and Saved Content',
    'lifecycle',
    'personal music library',
    [
      'Save Track',
      'Remove Saved Track',
      'Save Album',
      'Remove Album',
      'Follow Artist',
      'Follow Podcast',
      'Save Episode',
      'Mark Episode Played',
      'Download Saved Content',
      'View Recently Played',
      'View Liked Songs',
      'Organize Library',
    ],
  ),
  scenario(
    'playlists',
    'Playlist Creation and Collaboration',
    'social',
    'playlists',
    [
      'Create Playlist',
      'Name Playlist',
      'Add Track',
      'Remove Track',
      'Reorder Track',
      'Edit Playlist Details',
      'Change Playlist Visibility',
      'Invite Collaborator',
      'Accept Collaboration',
      'Add Collaborative Track',
      'Remove Collaborator',
      'Share Playlist',
      'Create Playlist Folder',
      'Archive Playlist',
    ],
  ),
  scenario(
    'discovery',
    'Search, Browse and Discovery',
    'discovery',
    'catalog search and discovery',
    [
      'Search Track',
      'Search Album',
      'Search Artist',
      'Search Playlist',
      'Search Podcast',
      'Browse Genre',
      'Browse Mood',
      'Open Charts',
      'Open New Releases',
      'Use Voice Search',
      'View Search History',
      'Clear Search History',
    ],
  ),
  scenario(
    'recommendation',
    'Recommendation and Personalization',
    'intelligence',
    'personalized audio recommendations',
    [
      'Open Discover Weekly',
      'Open Daily Mix',
      'Open Release Radar',
      'Start Artist Radio',
      'Start Track Radio',
      'Hide Recommendation',
      'Improve Recommendation',
      'Block Artist',
      'Record Skip Signal',
      'Record Completion Signal',
      'Generate Personalized Playlist',
    ],
  ),
  scenario(
    'podcasts',
    'Podcasts, Audiobooks and Spoken Audio',
    'lifecycle',
    'spoken audio',
    [
      'Browse Podcasts',
      'Follow Show',
      'Open Episode',
      'Play Episode',
      'Change Playback Speed',
      'Set Sleep Timer',
      'Save Episode',
      'Download Episode',
      'View Transcript',
      'Resume Episode',
      'Rate Show',
      'Purchase Audiobook',
    ],
  ),
  scenario(
    'notifications',
    'Notifications and Release Communication',
    'notifications',
    'release and account notifications',
    [
      'Receive New Release Alert',
      'Receive Podcast Alert',
      'Receive Concert Alert',
      'Receive Playlist Update',
      'Receive Security Alert',
      'Receive Billing Alert',
    ],
  ),
  scenario(
    'subscription',
    'Subscription, Billing and Entitlement',
    'money',
    'paid plans and access',
    [
      'Compare Plans',
      'Start Premium Trial',
      'Upgrade Plan',
      'Downgrade Plan',
      'Join Family Plan',
      'Verify Student Plan',
      'Cancel Plan',
      'Resume Plan',
      'View Billing Date',
      'Redeem Gift Card',
    ],
  ),
  scenario(
    'artist',
    'Artist and Podcaster Platform',
    'professional',
    'creator publishing and analytics',
    [
      'Create Artist Profile',
      'Claim Artist Profile',
      'Upload Release',
      'Upload Podcast Episode',
      'Manage Metadata',
      'Schedule Release',
      'Pitch Track',
      'View Streams',
      'View Audience',
      'View Playlist Adds',
      'Manage Team Access',
      'Manage Merch Link',
    ],
  ),
  scenario(
    'devices',
    'External Devices and Integrations',
    'integration',
    'connected playback devices',
    [
      'Discover Device',
      'Connect Speaker',
      'Connect Car',
      'Connect Television',
      'Connect Game Console',
      'Use Voice Assistant',
      'Transfer Session',
      'Control Remote Playback',
      'Authorize External App',
      'Revoke External App',
    ],
  ),
  scenario(
    'administration',
    'Catalog, Rights and Platform Operations',
    'admin',
    'catalog and rights operations',
    [
      'Validate Release Metadata',
      'Resolve Rights Conflict',
      'Apply Territory Rule',
      'Remove Infringing Audio',
      'Review Creator Appeal',
      'Correct Catalog Match',
      'Handle Support Case',
      'Review Payment Dispute',
      'Audit Playback Abuse',
    ],
  ),
];

function standardScenarios(
  platform: string,
  coreAction: string,
  provider: string,
  professional: string,
  intelligence: string,
  extras: Partial<Record<Archetype, string[]>> = {},
): ScenarioSeed[] {
  const extra = (type: Archetype) => extras[type] ?? [];
  return [
    scenario(
      'overview',
      'Platform Overview',
      'overview',
      `the complete ${platform} platform`,
      [
        coreAction,
        `Search ${platform}`,
        `Manage ${platform} Account`,
        `View ${platform} History`,
        `Get ${platform} Support`,
        ...extra('overview'),
      ],
    ),
    scenario(
      'identity',
      'Authentication, Account and Identity',
      'identity',
      `${platform} account access`,
      [
        `Register for ${platform}`,
        `Login to ${platform}`,
        `Recover ${platform} Account`,
        ...extra('identity'),
      ],
    ),
    scenario(
      'profile',
      'Profile, Preferences and Roles',
      'profile',
      `${platform} profiles`,
      [
        `Edit ${platform} Profile`,
        `Manage ${platform} Preferences`,
        `View ${platform} History`,
        ...extra('profile'),
      ],
    ),
    scenario('core', 'Core Platform Operation', 'core', coreAction, [
      coreAction,
      `Configure ${coreAction}`,
      `Confirm ${coreAction}`,
      `Track ${coreAction}`,
      ...extra('core'),
    ]),
    scenario(
      'discovery',
      'Search, Discovery and Navigation',
      'discovery',
      `${platform} discovery`,
      [
        `Search ${platform}`,
        `Browse ${platform}`,
        `Filter ${platform} Results`,
        ...extra('discovery'),
      ],
    ),
    scenario(
      'interaction',
      'Communication and Interaction',
      'social',
      `${platform} interaction`,
      [
        `Share ${platform} Item`,
        `Contact ${provider}`,
        `Save ${platform} Item`,
        ...extra('social'),
      ],
    ),
    scenario(
      'lifecycle',
      'Core Item or Transaction Lifecycle',
      'lifecycle',
      `${platform} lifecycle`,
      [
        `Create ${platform} Item`,
        `Track ${platform} Status`,
        `Cancel ${platform} Item`,
        `Review ${platform} History`,
        ...extra('lifecycle'),
      ],
    ),
    scenario(
      'notifications',
      'Notifications and Event Communication',
      'notifications',
      `${platform} notifications`,
      [
        `Receive ${platform} Update`,
        `Receive ${platform} Alert`,
        ...extra('notifications'),
      ],
    ),
    scenario(
      'safety',
      'Privacy, Trust and Safety',
      'safety',
      `${platform} safety`,
      [
        `Report ${platform} Problem`,
        `Block ${platform} Account`,
        `Appeal ${platform} Decision`,
        ...extra('safety'),
      ],
    ),
    scenario(
      'money',
      'Monetization, Billing and Payments',
      'money',
      `${platform} payments`,
      [
        `Pay for ${platform}`,
        `View ${platform} Receipt`,
        `Request ${platform} Refund`,
        ...extra('money'),
      ],
    ),
    scenario(
      'professional',
      `${professional} Features`,
      'professional',
      `${professional} work`,
      [
        `Create ${professional} Profile`,
        `Open ${professional} Dashboard`,
        `View ${professional} Analytics`,
        ...extra('professional'),
      ],
    ),
    scenario(
      'admin',
      'Administration and Platform Operations',
      'admin',
      `${platform} operations`,
      [
        `Review ${platform} Case`,
        `Resolve ${platform} Dispute`,
        `Manage ${platform} Policy`,
        ...extra('admin'),
      ],
    ),
    scenario(
      'integration',
      'External Services and Integrations',
      'integration',
      `${platform} integrations`,
      [
        `Connect External Service`,
        `Exchange ${platform} Data`,
        `Revoke ${platform} Integration`,
        ...extra('integration'),
      ],
    ),
    scenario(
      'intelligence',
      'Recommendation, Ranking and Intelligence',
      'intelligence',
      intelligence,
      [
        `Request ${intelligence}`,
        `Generate ${intelligence}`,
        `Provide ${intelligence} Feedback`,
        ...extra('intelligence'),
      ],
    ),
  ];
}

const platformSeeds: PlatformSeed[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social content',
    description:
      'A social content platform with publishing, communication, advertising, moderation and personalized discovery.',
    primary: [
      'Visitor',
      'Registered User',
      'Creator or Professional User',
      'Advertiser or Business',
    ],
    professional: 'Creator or Professional User',
    scenarios: instagramScenarios,
  },
  {
    id: 'spotify',
    name: 'Spotify / Apple Music',
    category: 'Audio streaming',
    description:
      'An audio platform with catalog discovery, playback, playlists, subscriptions, connected devices and creator publishing.',
    primary: ['Guest', 'Listener', 'Premium Subscriber', 'Artist or Podcaster'],
    professional: 'Artist or Podcaster',
    scenarios: spotifyScenarios,
  },
  {
    id: 'x',
    name: 'X / Threads',
    category: 'Microblogging',
    description:
      'A public conversation platform with posting, feeds, social graphs, messaging, moderation and paid features.',
    primary: ['Visitor', 'Member', 'Creator or Organization', 'Advertiser'],
    professional: 'Creator or Organization',
    scenarios: standardScenarios(
      'X or Threads',
      'Publish Post',
      'Member',
      'Creator or Organization',
      'Timeline Ranking',
      {
        core: ['Create Thread', 'Quote Post', 'Schedule Post'],
        social: [
          'Reply to Post',
          'Repost',
          'Mention Account',
          'Send Direct Message',
        ],
        intelligence: [
          'Rank Replies',
          'Combine Followed and Recommended Posts',
        ],
      },
    ),
  },
  {
    id: 'uber',
    name: 'Uber / Ola',
    category: 'Mobility',
    description:
      'A mobility marketplace connecting riders and drivers through matching, navigation, pricing, safety and payments.',
    primary: ['Rider', 'Driver', 'Fleet Operator', 'Support Agent'],
    professional: 'Driver or Fleet Operator',
    scenarios: standardScenarios(
      'Uber or Ola',
      'Request Trip',
      'Driver',
      'Driver or Fleet Operator',
      'Driver Matching and ETA',
      {
        core: [
          'Select Pickup',
          'Select Destination',
          'Choose Ride Type',
          'Confirm Fare',
          'Match Driver',
          'Start Trip',
          'Complete Trip',
        ],
        lifecycle: ['Driver Arrives', 'Verify Trip PIN', 'Rate Trip'],
        safety: [
          'Share Trip Status',
          'Use Emergency Assistance',
          'Report Unsafe Trip',
        ],
        intelligence: [
          'Estimate Fare',
          'Predict ETA',
          'Detect Surge Condition',
        ],
      },
    ),
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    category: 'Visual discovery',
    description:
      'A visual discovery platform with pins, boards, search, recommendations, shopping and creator tools.',
    primary: ['Visitor', 'Member', 'Creator', 'Merchant'],
    professional: 'Creator or Merchant',
    scenarios: standardScenarios(
      'Pinterest',
      'Create and Save Pin',
      'Creator',
      'Creator or Merchant',
      'Pin and Board Recommendation',
      {
        core: ['Create Pin', 'Import Image', 'Add Link', 'Publish Pin'],
        social: ['Save Pin to Board', 'Create Board', 'Collaborate on Board'],
        intelligence: [
          'Visual Search',
          'Related Pin Ranking',
          'Shopping Recommendation',
        ],
      },
    ),
  },
  {
    id: 'zomato',
    name: 'Zomato / Swiggy',
    category: 'Food delivery',
    description:
      'A food marketplace coordinating customers, restaurants, delivery partners, support and payment providers.',
    primary: [
      'Customer',
      'Restaurant Partner',
      'Delivery Partner',
      'Support Agent',
    ],
    professional: 'Restaurant or Delivery Partner',
    scenarios: standardScenarios(
      'Zomato or Swiggy',
      'Order Food',
      'Restaurant',
      'Restaurant or Delivery Partner',
      'Restaurant Ranking and Delivery Assignment',
      {
        core: [
          'Choose Restaurant',
          'Add Item to Cart',
          'Customize Item',
          'Place Order',
        ],
        lifecycle: [
          'Restaurant Accepts Order',
          'Prepare Order',
          'Assign Delivery Partner',
          'Pick Up Order',
          'Deliver Order',
        ],
        money: ['Apply Coupon', 'Pay Cash on Delivery', 'Tip Delivery Partner'],
        intelligence: [
          'Rank Restaurants',
          'Predict Preparation Time',
          'Assign Delivery Partner',
        ],
      },
    ),
  },
  {
    id: 'blinkit',
    name: 'Instamart / Blinkit',
    category: 'Quick commerce',
    description:
      'A quick commerce platform coordinating customers, dark stores, pickers, delivery partners, inventory and payments.',
    primary: ['Customer', 'Store Picker', 'Delivery Partner', 'Store Manager'],
    professional: 'Store or Delivery Partner',
    scenarios: standardScenarios(
      'Instamart or Blinkit',
      'Order Groceries',
      'Store',
      'Store or Delivery Partner',
      'Inventory Ranking and Delivery Assignment',
      {
        core: [
          'Check Delivery Area',
          'Add Grocery to Cart',
          'Choose Substitution',
          'Place Grocery Order',
        ],
        lifecycle: [
          'Reserve Inventory',
          'Pick Items',
          'Pack Order',
          'Assign Rider',
          'Deliver Order',
        ],
        safety: ['Report Missing Item', 'Report Damaged Item'],
        intelligence: [
          'Predict Stock Availability',
          'Rank Grocery Items',
          'Batch Delivery Assignment',
        ],
      },
    ),
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'AI assistant',
    description:
      'A conversational AI product with chats, files, tools, search, image generation, memory, safety and paid plans.',
    primary: ['Visitor', 'User', 'Workspace Member', 'Workspace Administrator'],
    professional: 'Workspace Member or Administrator',
    scenarios: standardScenarios(
      'ChatGPT',
      'Start AI Conversation',
      'Assistant',
      'Workspace Member or Administrator',
      'Response Generation and Tool Selection',
      {
        core: [
          'Send Prompt',
          'Attach File',
          'Stream Response',
          'Regenerate Response',
          'Stop Generation',
        ],
        social: ['Share Conversation', 'Create Shared Link'],
        safety: ['Report Response', 'Manage Memory', 'Delete Conversation'],
        integration: ['Browse Web', 'Generate Image', 'Use Connected App'],
        intelligence: [
          'Build Context',
          'Select Tool',
          'Generate Response',
          'Cite Source',
        ],
      },
    ),
  },
  {
    id: 'gemini',
    name: 'Gemini',
    category: 'AI assistant',
    description:
      'A multimodal AI assistant connected with files, search, Google services, generation and workspace controls.',
    primary: ['Visitor', 'User', 'Workspace User', 'Workspace Administrator'],
    professional: 'Workspace User or Administrator',
    scenarios: standardScenarios(
      'Gemini',
      'Start Multimodal Conversation',
      'Assistant',
      'Workspace User or Administrator',
      'Response Generation and Extension Selection',
      {
        core: [
          'Send Prompt',
          'Attach Image',
          'Attach File',
          'Stream Response',
          'Regenerate Response',
        ],
        integration: [
          'Use Google Search',
          'Use Workspace Extension',
          'Export Response',
        ],
        safety: ['Report Response', 'Manage Activity'],
        intelligence: [
          'Build Multimodal Context',
          'Select Extension',
          'Ground Response',
        ],
      },
    ),
  },
  {
    id: 'codex',
    name: 'Codex',
    category: 'Coding agent',
    description:
      'A coding agent that reads repositories, edits files, runs commands, reviews changes and works with development tools.',
    primary: [
      'Developer',
      'Reviewer',
      'Repository Administrator',
      'Workspace Administrator',
    ],
    professional: 'Developer or Reviewer',
    scenarios: standardScenarios(
      'Codex',
      'Complete Coding Task',
      'Developer',
      'Developer or Reviewer',
      'Task Planning and Tool Selection',
      {
        core: [
          'Open Repository',
          'Inspect Code',
          'Plan Change',
          'Edit File',
          'Run Test',
          'Review Diff',
        ],
        lifecycle: [
          'Create Task',
          'Track Task',
          'Continue Task',
          'Complete Task',
        ],
        integration: [
          'Use Terminal',
          'Read Documentation',
          'Create Pull Request',
        ],
        safety: ['Request Approval', 'Protect Secret', 'Respect Sandbox'],
        intelligence: [
          'Interpret Request',
          'Select Tool',
          'Generate Patch',
          'Verify Result',
        ],
      },
    ),
  },
  {
    id: 'claude-code',
    name: 'Claude Code CLI',
    category: 'Coding agent',
    description:
      'A terminal coding agent that works with repositories, commands, tools, permissions and development workflows.',
    primary: [
      'Developer',
      'Reviewer',
      'Repository Administrator',
      'Tool Provider',
    ],
    professional: 'Developer or Reviewer',
    scenarios: standardScenarios(
      'Claude Code',
      'Complete Terminal Coding Task',
      'Developer',
      'Developer or Reviewer',
      'Task Planning and Tool Selection',
      {
        core: [
          'Start Session',
          'Inspect Repository',
          'Edit File',
          'Run Command',
          'Review Change',
        ],
        integration: ['Connect MCP Tool', 'Use Git', 'Use Shell'],
        safety: [
          'Request Tool Permission',
          'Protect Secret',
          'Respect Repository Boundary',
        ],
        intelligence: [
          'Interpret Task',
          'Plan Tool Calls',
          'Generate Edit',
          'Evaluate Command Output',
        ],
      },
    ),
  },
];

function replaceTerms(value: string, replacements: Array<[string, string]>) {
  return replacements.reduce(
    (current, [from, to]) => current.split(from).join(to),
    value,
  );
}

function individualizeScenarios(
  scenarios: ScenarioSeed[],
  replacements: Array<[string, string]>,
) {
  return scenarios.map((item) => ({
    ...item,
    name: replaceTerms(item.name, replacements),
    description: replaceTerms(item.description, replacements),
    subject: replaceTerms(item.subject, replacements),
    core: item.core.map((name) => replaceTerms(name, replacements)),
  }));
}

const expandedPlatformSeeds: PlatformSeed[] = platformSeeds.flatMap(
  (platform) => {
    if (platform.id === 'spotify')
      return [
        {
          ...platform,
          name: 'Spotify',
          description:
            'An audio streaming platform with catalog discovery, playback, playlists, podcasts, subscriptions, connected devices and creator tools.',
          scenarios: individualizeScenarios(platform.scenarios, [
            ['Spotify or Apple Music', 'Spotify'],
          ]),
        },
        {
          ...platform,
          id: 'apple-music',
          name: 'Apple Music',
          description:
            'An Apple audio service with catalog discovery, library management, playlists, downloads, SharePlay, connected devices and artist tools.',
          primary: ['Visitor', 'Listener', 'Apple Music Subscriber', 'Artist'],
          professional: 'Artist',
          scenarios: individualizeScenarios(platform.scenarios, [
            ['Spotify or Apple Music', 'Apple Music'],
          ]),
        },
      ];
    if (platform.id === 'x')
      return [
        {
          ...platform,
          name: 'X',
          description:
            'A public conversation platform with posts, feeds, communities, Spaces, messaging, subscriptions, advertising, moderation and developer APIs.',
          scenarios: individualizeScenarios(platform.scenarios, [
            ['X or Threads', 'X'],
          ]),
        },
        {
          ...platform,
          id: 'threads',
          name: 'Threads',
          description:
            'A public conversation platform with posts, replies, feeds, profiles, moderation and optional fediverse participation.',
          primary: [
            'Visitor',
            'Threads Member',
            'Creator',
            'Brand or Advertiser',
            'Fediverse User',
          ],
          professional: 'Creator or Brand',
          scenarios: individualizeScenarios(platform.scenarios, [
            ['X or Threads', 'Threads'],
            ['Send Direct Message', 'Share through Instagram Message'],
            ['Schedule Post', 'Save Post Draft'],
          ]),
        },
      ];
    if (platform.id === 'uber')
      return [
        {
          ...platform,
          name: 'Uber',
          description:
            'A mobility marketplace connecting riders, drivers and fleet operators through matching, navigation, pricing, safety and payments.',
          scenarios: individualizeScenarios(platform.scenarios, [
            ['Uber or Ola', 'Uber'],
          ]),
        },
        {
          ...platform,
          id: 'ola',
          name: 'Ola',
          description:
            'An Indian mobility marketplace connecting riders and driver partners through booking, navigation, fare, safety, payment and support flows.',
          scenarios: individualizeScenarios(platform.scenarios, [
            ['Uber or Ola', 'Ola'],
          ]),
        },
      ];
    if (platform.id === 'zomato')
      return [
        {
          ...platform,
          name: 'Zomato',
          description:
            'A food marketplace coordinating customers, restaurant partners, delivery partners, support and payment services.',
          scenarios: individualizeScenarios(platform.scenarios, [
            ['Zomato or Swiggy', 'Zomato'],
          ]),
        },
        {
          ...platform,
          id: 'swiggy',
          name: 'Swiggy',
          description:
            'A food delivery marketplace where customers discover restaurants, place orders and track delivery through restaurant and delivery partners.',
          scenarios: individualizeScenarios(platform.scenarios, [
            ['Zomato or Swiggy', 'Swiggy'],
          ]),
        },
      ];
    if (platform.id === 'blinkit')
      return [
        {
          ...platform,
          name: 'Blinkit',
          description:
            'A quick commerce platform coordinating customers, sellers, stores, pickers, delivery partners, inventory and payments.',
          scenarios: individualizeScenarios(platform.scenarios, [
            ['Instamart or Blinkit', 'Blinkit'],
          ]),
        },
        {
          ...platform,
          id: 'instamart',
          name: 'Swiggy Instamart',
          description:
            'A quick commerce platform coordinating customers, merchant partners, dark stores, pickers, delivery partners, inventory and payments.',
          scenarios: individualizeScenarios(platform.scenarios, [
            ['Instamart or Blinkit', 'Swiggy Instamart'],
          ]),
        },
      ];
    return [platform];
  },
);

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function makeInstagramActors(seed: ScenarioSeed): DepthActor[] {
  const catalog: Record<string, DepthActor> = {
    visitor: actor(
      'visitor',
      'Visitor / Guest',
      'person',
      'primary',
      1,
      'A person who is not authenticated. A visitor may open a shared public link or start registration and login, but cannot perform account-only goals such as follow, like, comment, message or change privacy settings.',
      ['Preview eligible public content', 'Register or log in'],
    ),
    user: actor(
      'registered-user',
      'Registered User',
      'person',
      'primary',
      1,
      'An authenticated account holder who initiates normal Instagram goals. The role is separate from Visitor because authentication changes available capabilities and access checks.',
      ['Use account features', 'Control content, relationships and settings'],
    ),
    creator: actor(
      'creator-professional',
      'Creator / Professional User',
      'person',
      'primary',
      1,
      'A specialization of Registered User that initiates professional publishing, insights, collaboration and monetization goals.',
      [
        'Publish as a professional',
        'Use dashboard, insights and collaboration tools',
      ],
    ),
    advertiser: actor(
      'advertiser-business',
      'Advertiser / Business',
      'person',
      'primary',
      1,
      'A business operator that initiates promotion, campaign, audience, measurement and billing goals.',
      ['Run and measure advertising', 'Manage business identity and spend'],
    ),
    agency: actor(
      'ad-agency-partner',
      'Ad Agency / Business Partner',
      'person',
      'primary',
      2,
      'An authorized external organization that initiates campaign and creator-partnership goals for a client through Meta business tools.',
      ['Manage client campaigns', 'Coordinate creator partnerships'],
    ),
    developer: actor(
      'external-developer',
      'External Developer / API App',
      'person',
      'primary',
      2,
      'A developer or application outside the Instagram product boundary that initiates documented API goals for professional accounts. An internal Instagram developer is not an actor in this boundary.',
      [
        'Authorize an API app',
        'Publish or manage permitted professional account data',
      ],
    ),
    moderator: actor(
      'moderator',
      'Moderator / Trust and Safety Staff',
      'person',
      'primary',
      2,
      'Authorized staff who initiate review and enforcement goals through an internal operations interface.',
      ['Review reports and evidence', 'Apply or reverse policy decisions'],
    ),
    support: actor(
      'support-agent',
      'Support Agent',
      'person',
      'primary',
      2,
      'Authorized staff who initiate account recovery, impersonation, escalation and support-case goals.',
      ['Resolve account and support cases', 'Escalate specialized cases'],
    ),
    supervisor: actor(
      'parent-supervisor',
      'Parent / Supervisor',
      'person',
      'primary',
      2,
      'A person outside the teen account who can initiate agreed supervision goals where Instagram supervision is configured.',
      ['Review or approve supervised settings'],
    ),
    accounts: actor(
      'meta-accounts-center',
      'Meta Accounts Center',
      'external',
      'secondary',
      2,
      'A connected Meta product boundary that supports optional sign-on, recovery, settings and cross-posting experiences.',
      ['Return connected account state'],
    ),
    businessSuite: actor(
      'meta-business-suite',
      'Meta Business Suite',
      'external',
      'secondary',
      2,
      'A separate Meta business interface that supports brand, agency, creator marketplace and campaign work.',
      ['Support authorized business and partnership actions'],
    ),
    notification: actor(
      'push-email-provider',
      'Push / Email / SMS Provider',
      'external',
      'secondary',
      2,
      'An external delivery provider that sends eligible push, email or SMS messages after Instagram requests delivery.',
      ['Deliver a notification or security message'],
    ),
    device: actor(
      'device-os-services',
      'Device OS Services',
      'external',
      'secondary',
      1,
      'Camera, microphone, gallery, contacts and location capabilities supplied by the user device after permission.',
      ['Return user-approved device data'],
    ),
    payment: actor(
      'payment-processor',
      'Payment Processor',
      'external',
      'secondary',
      2,
      'An external payment boundary that authorizes or rejects advertising and business billing instructions.',
      ['Return a payment state'],
    ),
    music: actor(
      'music-rights-catalog',
      'Music Rights / Catalog Provider',
      'external',
      'secondary',
      2,
      'An external catalog or rights boundary used when licensed music is selected or validated.',
      ['Return eligible music and territory rights'],
    ),
    regulator: actor(
      'legal-authority',
      'Legal / Compliance Authority',
      'external',
      'secondary',
      3,
      'A lawful external authority that sends a valid legal or compliance request through a controlled process.',
      ['Receive a compliant response'],
    ),
  };

  const idsByScenario: Record<string, string[]> = {
    overview: [
      'visitor',
      'user',
      'creator',
      'advertiser',
      'accounts',
      'businessSuite',
      'device',
      'notification',
    ],
    identity: [
      'visitor',
      'user',
      'support',
      'accounts',
      'notification',
      'device',
    ],
    content: ['user', 'creator', 'device', 'music', 'notification'],
    discovery: ['user', 'advertiser'],
    social: ['user', 'creator', 'notification'],
    messaging: ['user', 'creator', 'device', 'notification'],
    'stories-live': ['user', 'creator', 'device', 'music', 'notification'],
    safety: [
      'user',
      'creator',
      'supervisor',
      'moderator',
      'support',
      'notification',
      'regulator',
    ],
    creator: ['creator', 'advertiser', 'agency', 'businessSuite', 'payment'],
    advertising: [
      'advertiser',
      'agency',
      'creator',
      'user',
      'businessSuite',
      'payment',
    ],
    notifications: ['user', 'creator', 'advertiser', 'notification', 'device'],
    administration: ['moderator', 'support', 'regulator', 'notification'],
    integrations: [
      'developer',
      'creator',
      'user',
      'accounts',
      'device',
      'notification',
      'music',
    ],
    intelligence: ['user', 'creator', 'advertiser'],
  };
  return (idsByScenario[seed.id] ?? ['user']).map((id) => catalog[id]);
}

function actorRoleDescription(label: string, platform: PlatformSeed) {
  if (/Visitor|Guest/i.test(label))
    return `A person who is not authenticated. This role can start public preview or account-entry goals only where ${platform.name} exposes them.`;
  if (/Support|Moderator|Trust|Operations/i.test(label))
    return `Authorized staff who initiate review, support, recovery or enforcement goals through a separate operations interface for ${platform.name}.`;
  if (/Administrator|Manager|Repository Administrator/i.test(label))
    return `An authorized administrator who initiates configuration, access, policy or operational goals for ${platform.name}.`;
  if (/Developer|Tool Provider|Integration Operator/i.test(label))
    return `A developer or tool operator who initiates repository, API or integration goals across the ${platform.name} boundary.`;
  if (/Advertiser|Brand|Business/i.test(label))
    return `A commercial actor who initiates campaign, promotion, measurement or billing goals on ${platform.name}.`;
  if (/Creator|Artist|Podcaster|Merchant|Restaurant/i.test(label))
    return `A professional participant who initiates publishing, catalog, fulfillment, analytics or business goals on ${platform.name}.`;
  if (/Driver|Delivery|Picker|Fleet/i.test(label))
    return `A supply-side participant who initiates availability, acceptance, fulfillment, status or earnings goals on ${platform.name}.`;
  return `An authenticated ${label.toLowerCase()} who initiates the normal product goals available to this role on ${platform.name}.`;
}

function actorRelevantForScenario(label: string, seed: ScenarioSeed) {
  if (seed.archetype === 'overview') return true;
  if (/Visitor|Guest/i.test(label))
    return ['identity', 'discovery'].includes(seed.archetype);
  if (/Support|Moderator|Trust|Operations/i.test(label))
    return ['identity', 'safety', 'admin'].includes(seed.archetype);
  if (/Administrator|Store Manager|Repository Administrator/i.test(label))
    return ['identity', 'professional', 'admin', 'integration'].includes(
      seed.archetype,
    );
  if (/Advertiser|Brand/i.test(label))
    return [
      'discovery',
      'money',
      'professional',
      'integration',
      'intelligence',
    ].includes(seed.archetype);
  if (/Creator|Artist|Podcaster|Merchant|Restaurant/i.test(label))
    return [
      'profile',
      'core',
      'social',
      'lifecycle',
      'notifications',
      'safety',
      'money',
      'professional',
      'integration',
      'intelligence',
    ].includes(seed.archetype);
  if (/Driver|Delivery|Picker|Fleet/i.test(label))
    return [
      'profile',
      'core',
      'lifecycle',
      'notifications',
      'safety',
      'money',
      'professional',
      'integration',
      'intelligence',
    ].includes(seed.archetype);
  if (/Developer|Reviewer|Tool Provider/i.test(label)) return true;
  return seed.archetype !== 'admin';
}

function additionalPrimaryLabels(platform: PlatformSeed, seed: ScenarioSeed) {
  const values: string[] = [];
  if (
    seed.archetype === 'admin' &&
    !platform.primary.some((item) => /Support|Admin|Manager/i.test(item))
  )
    values.push('Moderator / Operations Staff');
  if (
    seed.archetype === 'integration' &&
    !platform.primary.some((item) => /Developer|Tool Provider/i.test(item))
  )
    values.push('External Developer / Integration Operator');
  if (
    seed.archetype === 'safety' &&
    ['instagram', 'x', 'threads', 'pinterest', 'chatgpt', 'gemini'].includes(
      platform.id,
    )
  )
    values.push('Trust and Safety Reviewer');
  return values;
}

function externalActorIds(platform: PlatformSeed, seed: ScenarioSeed) {
  const relevant = new Set<string>(['device-services']);
  if (seed.archetype === 'identity')
    ['identity-provider', 'notification-provider', 'support-staff'].forEach(
      (item) => relevant.add(item),
    );
  if (['core', 'social', 'lifecycle', 'notifications'].includes(seed.archetype))
    relevant.add('notification-provider');
  if (seed.archetype === 'money')
    ['payment-provider', 'notification-provider', 'support-staff'].forEach(
      (item) => relevant.add(item),
    );
  if (['safety', 'admin'].includes(seed.archetype))
    ['support-staff', 'notification-provider', 'regulator'].forEach((item) =>
      relevant.add(item),
    );
  if (seed.archetype === 'integration')
    ['identity-provider', 'notification-provider', 'payment-provider'].forEach(
      (item) => relevant.add(item),
    );
  if (['professional', 'overview'].includes(seed.archetype))
    ['payment-provider', 'notification-provider', 'support-staff'].forEach(
      (item) => relevant.add(item),
    );

  if (['spotify', 'apple-music'].includes(platform.id))
    ['catalog-rights-provider', 'connected-device-platform'].forEach((item) =>
      relevant.add(item),
    );
  if (
    ['uber', 'ola', 'zomato', 'swiggy', 'blinkit', 'instamart'].includes(
      platform.id,
    )
  )
    relevant.add('map-navigation-provider');
  if (['uber', 'ola'].includes(platform.id) && seed.archetype === 'safety')
    relevant.add('emergency-services');
  if (['zomato', 'swiggy'].includes(platform.id))
    relevant.add('restaurant-pos');
  if (platform.id === 'threads') relevant.add('fediverse-server');
  if (['chatgpt', 'gemini', 'codex', 'claude-code'].includes(platform.id))
    relevant.add('connected-app-provider');
  if (['codex', 'claude-code'].includes(platform.id))
    relevant.add('source-control-host');
  return relevant;
}

function makeActors(platform: PlatformSeed, seed: ScenarioSeed): DepthActor[] {
  if (platform.id === 'instagram') return makeInstagramActors(seed);
  const labels = unique([
    ...platform.primary.filter((label) =>
      actorRelevantForScenario(label, seed),
    ),
    ...additionalPrimaryLabels(platform, seed),
  ]);
  const usableLabels = labels.length ? labels : [platform.primary[0]];
  const people = usableLabels.map((label) =>
    actor(
      slug(label),
      label,
      'person',
      'primary',
      2,
      actorRoleDescription(label, platform),
      [
        `Complete ${seed.subject}`,
        `Control the result and visible account state`,
      ],
    ),
  );
  const relevant = externalActorIds(platform, seed);
  return [
    ...people,
    ...sharedExternalActors.filter((item) => relevant.has(item.id)),
  ];
}

function instagramRelatedActorIds(
  seed: ScenarioSeed,
  name: string,
  actors: DepthActor[],
) {
  const available = new Set(actors.map((item) => item.id));
  const primary: string[] = [];
  const secondary: string[] = [];
  const addPrimary = (...ids: string[]) =>
    ids.forEach((id) => available.has(id) && primary.push(id));
  const addSecondary = (...ids: string[]) =>
    ids.forEach((id) => available.has(id) && secondary.push(id));

  if (
    /Open Shared Public|View Public Profile Preview|Register|Login|Recover Account|Reset Password/i.test(
      name,
    )
  ) {
    addPrimary('visitor');
  } else if (seed.id === 'administration') {
    if (/Support|Impersonation|Escalate/i.test(name))
      addPrimary('support-agent');
    else addPrimary('moderator');
  } else if (seed.id === 'advertising') {
    if (/View Ad|Interact With Ad/i.test(name)) addPrimary('registered-user');
    else addPrimary('advertiser-business');
    if (/Campaign|Promotion|Audience|Budget|Partnership|Creator/i.test(name))
      addPrimary('ad-agency-partner');
  } else if (seed.id === 'creator') {
    addPrimary('creator-professional');
    if (/Partnership|Branded|Campaign/i.test(name))
      addPrimary('advertiser-business', 'ad-agency-partner');
  } else if (seed.id === 'integrations') {
    if (/API|OAuth|Webhook|Access Token|Publish via|Insights via/i.test(name))
      addPrimary('external-developer');
    else if (/Professional|Publish/i.test(name))
      addPrimary('creator-professional');
    else addPrimary('registered-user');
  } else if (seed.id === 'content' || seed.id === 'stories-live') {
    addPrimary(
      /Professional|Schedule|Insights|Branded/i.test(name)
        ? 'creator-professional'
        : 'registered-user',
    );
  } else if (seed.id === 'safety') {
    if (/Supervision|Parent|Approve Teen/i.test(name))
      addPrimary('parent-supervisor');
    else if (/Review Report|Apply Policy|Moderate|Enforcement/i.test(name))
      addPrimary('moderator');
    else addPrimary('registered-user');
  } else if (seed.id === 'overview') {
    if (/Insights|Professional|Creator/i.test(name))
      addPrimary('creator-professional');
    else if (/Promote|Ad /i.test(name)) addPrimary('advertiser-business');
    else addPrimary('registered-user');
  } else {
    addPrimary('registered-user');
  }

  if (/Connected Meta|Cross-post|Cross Post|Accounts Center/i.test(name))
    addSecondary('meta-accounts-center');
  if (
    /Capture|Import|Record Audio|Location|Contacts|Device|Camera|Microphone/i.test(
      name,
    )
  )
    addSecondary('device-os-services');
  if (
    /Notification|Security Alert|Verify Email|Verify Phone|SMS|Email/i.test(
      name,
    )
  )
    addSecondary('push-email-provider');
  if (/Billing|Payment|Budget|Spend|Promotion|Invoice|Refund/i.test(name))
    addSecondary('payment-processor');
  if (/Business Suite|Creator Marketplace|Partnership|Campaign/i.test(name))
    addSecondary('meta-business-suite');
  if (/Music|Audio Rights/i.test(name)) addSecondary('music-rights-catalog');
  if (/Legal|Compliance|Lawful|Regulatory/i.test(name))
    addSecondary('legal-authority');

  if (!primary.length) {
    const fallback = actors.find((item) => item.role === 'primary');
    if (fallback) primary.push(fallback.id);
  }
  return { primary: unique(primary), secondary: unique(secondary) };
}

function productRelatedActorIds(
  platform: PlatformSeed,
  seed: ScenarioSeed,
  name: string,
  actors: DepthActor[],
) {
  const people = actors.filter((item) => item.role === 'primary');
  const external = actors.filter((item) => item.role === 'secondary');
  const primary: string[] = [];
  const secondary: string[] = [];
  const addPerson = (pattern: RegExp) => {
    const match = people.find((item) => pattern.test(item.label));
    if (match) primary.push(match.id);
  };
  const addExternal = (id: string) => {
    if (external.some((item) => item.id === id)) secondary.push(id);
  };

  if (/Register|Login|Recover|Create Account|Sign Up/i.test(name)) {
    addPerson(/Visitor|Guest|User|Member|Listener|Customer|Rider|Developer/i);
  } else if (seed.archetype === 'admin') {
    addPerson(/Support|Moderator|Trust|Operations|Administrator|Manager/i);
  } else if (seed.archetype === 'professional') {
    addPerson(
      /Creator|Artist|Podcaster|Merchant|Restaurant|Driver|Delivery|Fleet|Reviewer|Developer|Business|Brand/i,
    );
  } else if (seed.archetype === 'money') {
    addPerson(
      /Subscriber|Customer|Rider|Advertiser|Business|Merchant|Restaurant|Driver|Delivery|User|Member/i,
    );
  } else if (seed.archetype === 'integration') {
    addPerson(
      /External Developer|Integration Operator|Developer|Tool Provider|Repository Administrator|Workspace Administrator|Creator|Artist/i,
    );
  } else if (['uber', 'ola'].includes(platform.id)) {
    if (/Support|Resolve Case|Resolve Rider Issue|Dispute/i.test(name))
      addPerson(/Support/);
    else if (/Fleet/i.test(name)) addPerson(/Fleet/);
    else if (
      /Accept|Arrive|Start Trip|Complete Trip|Navigate|Earning|Go Online|Driver/i.test(
        name,
      )
    )
      addPerson(/Driver/);
    else addPerson(/Rider/);
  } else if (['zomato', 'swiggy'].includes(platform.id)) {
    if (/Restaurant|Menu|Prepare|Ready|Accept Order|Reject Order/i.test(name))
      addPerson(/Restaurant/);
    else if (/Delivery|Pick Up|Deliver Order|Rider Assignment/i.test(name))
      addPerson(/Delivery/);
    else addPerson(/Customer/);
  } else if (['blinkit', 'instamart'].includes(platform.id)) {
    if (/Store|Inventory|Pick Item|Pack|Substitution|Stock/i.test(name))
      addPerson(/Picker|Store Manager|Merchant/);
    else if (/Delivery|Assign Rider|Deliver Order/i.test(name))
      addPerson(/Delivery/);
    else addPerson(/Customer/);
  } else if (['spotify', 'apple-music'].includes(platform.id)) {
    if (/Artist|Podcast|Publish|Upload|Creator|Analytics|Release/i.test(name))
      addPerson(/Artist|Podcaster/);
    else if (/Premium|Subscription|Download|Billing|Offline/i.test(name))
      addPerson(/Premium|Subscriber/);
    else addPerson(/Listener/);
  } else if (['x', 'threads', 'pinterest'].includes(platform.id)) {
    if (/Ad |Advert|Campaign|Promotion|Billing/i.test(name))
      addPerson(/Advertiser|Brand|Merchant|Business/);
    else if (/Creator|Publish|Analytics|Professional/i.test(name))
      addPerson(/Creator|Organization|Merchant/);
    else if (/Fediverse|Federat/i.test(name)) addPerson(/Fediverse/);
    else addPerson(/Member|User/);
  } else if (['chatgpt', 'gemini'].includes(platform.id)) {
    if (/Workspace|Admin|Policy|Audit|Member Access/i.test(name))
      addPerson(/Workspace Administrator/);
    else addPerson(/User|Workspace Member|Workspace User/);
  } else if (['codex', 'claude-code'].includes(platform.id)) {
    if (/Review|Diff|Pull Request/i.test(name)) addPerson(/Reviewer|Developer/);
    else if (/Repository Access|Workspace|Admin|Policy/i.test(name))
      addPerson(
        /Repository Administrator|Workspace Administrator|Tool Provider/,
      );
    else addPerson(/Developer/);
  } else {
    addPerson(/User|Member|Customer|Listener|Rider|Developer/);
  }

  if (
    /Payment|Billing|Price|Fare|Budget|Refund|Receipt|Subscription|Payout|Earning/i.test(
      name,
    )
  )
    addExternal('payment-provider');
  if (/Notification|Alert|Email|SMS|Push|Verify/i.test(name))
    addExternal('notification-provider');
  if (/Login|Identity|OAuth|Authorize|Account Link/i.test(name))
    addExternal('identity-provider');
  if (
    /Camera|Microphone|File|Image|Media|Location|Contact|Device Permission/i.test(
      name,
    )
  )
    addExternal('device-services');
  if (
    /Route|Map|Pickup|Destination|ETA|Location|Delivery Area|Address/i.test(
      name,
    )
  )
    addExternal('map-navigation-provider');
  if (/Track|Album|Podcast|Music|Catalog|Rights|Release/i.test(name))
    addExternal('catalog-rights-provider');
  if (/Playback|Transfer|Speaker|CarPlay|HomePod|Connected Device/i.test(name))
    addExternal('connected-device-platform');
  if (/Repository|Git|Pull Request|Branch|Commit|Source Control/i.test(name))
    addExternal('source-control-host');
  if (
    /Connected App|Extension|MCP|External Tool|Workspace Extension/i.test(name)
  )
    addExternal('connected-app-provider');
  if (/Emergency|SOS|Panic/i.test(name)) addExternal('emergency-services');
  if (/Fediverse|Federat|ActivityPub/i.test(name))
    addExternal('fediverse-server');
  if (/Restaurant|Order Confirm|Order Reject|Ready|POS/i.test(name))
    addExternal('restaurant-pos');
  if (/Legal|Compliance|Regulatory/i.test(name)) addExternal('regulator');

  if (!primary.length && people.length) primary.push(people[0].id);
  return { primary: unique(primary), secondary: unique(secondary) };
}

const instagramIncludes: Record<string, string[]> = {
  'Publish Content': ['Select Media', 'Configure Audience'],
  'Create Promotion': ['Select Objective', 'Define Audience', 'Set Budget'],
};

const instagramExtends: Record<string, string[]> = {
  'Add Collaborator': ['Publish Content'],
  'Share to Close Friends': ['Publish Story'],
};

type ProductRelationshipRule = {
  source: string;
  target: string;
  type: 'include' | 'extend';
  reason: string;
};

const productRelationshipRules: Record<string, ProductRelationshipRule[]> = {
  spotify: [
    {
      source: 'Start Playback',
      target: 'Select Track',
      type: 'include',
      reason: 'Playback requires a selected playable catalog item.',
    },
    {
      source: 'Download Saved Content',
      target: 'Save Track',
      type: 'extend',
      reason:
        'Offline download is an optional subscriber action after content has been saved or selected.',
    },
  ],
  'apple-music': [
    {
      source: 'Start Playback',
      target: 'Select Track',
      type: 'include',
      reason: 'Playback requires a selected playable catalog item.',
    },
    {
      source: 'Download Saved Content',
      target: 'Save Track',
      type: 'extend',
      reason:
        'Offline download is an optional subscriber action after content has been added or selected.',
    },
  ],
  x: [
    {
      source: 'Create Thread',
      target: 'Publish Post',
      type: 'extend',
      reason:
        'A thread adds one or more connected posts to the base publishing goal.',
    },
    {
      source: 'Quote Post',
      target: 'Publish Post',
      type: 'extend',
      reason:
        'Quoting is an optional publishing variation with a referenced post.',
    },
  ],
  threads: [
    {
      source: 'Create Thread',
      target: 'Publish Post',
      type: 'extend',
      reason:
        'A multi-post thread is an optional variation of the base publishing goal.',
    },
    {
      source: 'Quote Post',
      target: 'Publish Post',
      type: 'extend',
      reason:
        'Quoting is an optional publishing variation with a referenced post.',
    },
  ],
  uber: [
    {
      source: 'Request Trip',
      target: 'Select Pickup',
      type: 'include',
      reason: 'A ride request must resolve a pickup location.',
    },
    {
      source: 'Request Trip',
      target: 'Select Destination',
      type: 'include',
      reason: 'A ride request must resolve the intended destination.',
    },
    {
      source: 'Request Trip',
      target: 'Choose Ride Type',
      type: 'include',
      reason:
        'A request must identify an eligible ride product before matching.',
    },
    {
      source: 'Verify Trip PIN',
      target: 'Start Trip',
      type: 'extend',
      reason:
        'PIN verification runs only for trips where that safety control applies.',
    },
  ],
  ola: [
    {
      source: 'Request Trip',
      target: 'Select Pickup',
      type: 'include',
      reason: 'A ride request must resolve a pickup location.',
    },
    {
      source: 'Request Trip',
      target: 'Select Destination',
      type: 'include',
      reason: 'A ride request must resolve the intended destination.',
    },
    {
      source: 'Request Trip',
      target: 'Choose Ride Type',
      type: 'include',
      reason:
        'A request must identify an eligible ride product before matching.',
    },
    {
      source: 'Verify Trip PIN',
      target: 'Start Trip',
      type: 'extend',
      reason:
        'PIN verification runs only for trips where that safety control applies.',
    },
  ],
  pinterest: [
    {
      source: 'Create and Save Pin',
      target: 'Create Pin',
      type: 'include',
      reason: 'The combined goal requires a Pin object to be created.',
    },
    {
      source: 'Create and Save Pin',
      target: 'Publish Pin',
      type: 'include',
      reason: 'The Pin must be published or saved before it becomes available.',
    },
    {
      source: 'Collaborate on Board',
      target: 'Create Board',
      type: 'extend',
      reason: 'Collaboration is optional after a board exists.',
    },
  ],
  zomato: [],
  swiggy: [],
  blinkit: [],
  instamart: [],
  chatgpt: [
    {
      source: 'Start AI Conversation',
      target: 'Send Prompt',
      type: 'include',
      reason: 'A conversation turn requires user input.',
    },
    {
      source: 'Attach File',
      target: 'Start AI Conversation',
      type: 'extend',
      reason: 'A file is optional context for a conversation.',
    },
    {
      source: 'Use Connected App',
      target: 'Start AI Conversation',
      type: 'extend',
      reason:
        'A connected app is used only when the user selects it or the task needs it.',
    },
  ],
  gemini: [
    {
      source: 'Start Multimodal Conversation',
      target: 'Send Prompt',
      type: 'include',
      reason: 'A conversation turn requires user input.',
    },
    {
      source: 'Attach Image',
      target: 'Start Multimodal Conversation',
      type: 'extend',
      reason: 'An image is optional multimodal context for a conversation.',
    },
    {
      source: 'Use Workspace Extension',
      target: 'Start Multimodal Conversation',
      type: 'extend',
      reason:
        'A Workspace extension is used only for eligible connected tasks.',
    },
  ],
  codex: [
    {
      source: 'Complete Coding Task',
      target: 'Inspect Code',
      type: 'include',
      reason:
        'A repository change requires inspecting the relevant code and context.',
    },
    {
      source: 'Complete Coding Task',
      target: 'Review Diff',
      type: 'include',
      reason: 'The completed change must be reviewed before handoff.',
    },
    {
      source: 'Create Pull Request',
      target: 'Complete Coding Task',
      type: 'extend',
      reason:
        'Creating a pull request is an optional handoff after the coding task.',
    },
  ],
  'claude-code': [
    {
      source: 'Complete Terminal Coding Task',
      target: 'Inspect Repository',
      type: 'include',
      reason:
        'A repository task requires inspecting the relevant repository context.',
    },
    {
      source: 'Complete Terminal Coding Task',
      target: 'Review Change',
      type: 'include',
      reason:
        'The resulting repository change must be reviewed before handoff.',
    },
    {
      source: 'Connect MCP Tool',
      target: 'Complete Terminal Coding Task',
      type: 'extend',
      reason: 'An MCP tool is optional and used only when the task needs it.',
    },
  ],
};

const marketplaceRelationshipRules: ProductRelationshipRule[] = [
  {
    source: 'Order Food',
    target: 'Choose Restaurant',
    type: 'include',
    reason: 'A food order requires a selected restaurant.',
  },
  {
    source: 'Order Food',
    target: 'Add Item to Cart',
    type: 'include',
    reason: 'A food order requires at least one selected item.',
  },
  {
    source: 'Order Food',
    target: 'Place Order',
    type: 'include',
    reason: 'The customer must submit the prepared cart to place the order.',
  },
  {
    source: 'Apply Coupon',
    target: 'Order Food',
    type: 'extend',
    reason: 'A coupon is an optional pricing variation of ordering food.',
  },
  {
    source: 'Tip Delivery Partner',
    target: 'Order Food',
    type: 'extend',
    reason: 'A tip is optional and does not define the base food-order goal.',
  },
];

const quickCommerceRelationshipRules: ProductRelationshipRule[] = [
  {
    source: 'Order Groceries',
    target: 'Check Delivery Area',
    type: 'include',
    reason: 'The platform must confirm that the address is serviceable.',
  },
  {
    source: 'Order Groceries',
    target: 'Add Grocery to Cart',
    type: 'include',
    reason: 'A grocery order requires at least one selected item.',
  },
  {
    source: 'Order Groceries',
    target: 'Place Grocery Order',
    type: 'include',
    reason: 'The customer must submit the prepared cart to place the order.',
  },
  {
    source: 'Choose Substitution',
    target: 'Order Groceries',
    type: 'extend',
    reason:
      'Substitution preferences apply only when an ordered item is unavailable.',
  },
];

productRelationshipRules.zomato = marketplaceRelationshipRules;
productRelationshipRules.swiggy = marketplaceRelationshipRules;
productRelationshipRules.blinkit = quickCommerceRelationshipRules;
productRelationshipRules.instamart = quickCommerceRelationshipRules;

function confidenceFor(name: string, tier: 1 | 2 | 3): KnowledgeLevel {
  if (tier === 1) return 'observable';
  if (/OAuth|payment|push|email|SMS|device permission/i.test(name))
    return 'documented';
  return 'conceptual';
}

function tagsFor(name: string, tier: 1 | 2 | 3): CaseTag[] {
  const tags: CaseTag[] = [tier === 1 ? 'core' : 'service'];
  if (
    /optional|add |apply |configure|preview|save draft|schedule|share/i.test(
      name,
    )
  )
    tags.push('optional');
  if (
    /security|privacy|authorize|identity|risk|abuse|policy|moder|block|report|fraud|safety/i.test(
      name,
    )
  )
    tags.push('security');
  if (
    /payment|billing|price|plan|subscription|invoice|refund|payout|earn|ad |promotion/i.test(
      name,
    )
  )
    tags.push('monetization');
  if (
    /rank|recommend|predict|candidate|feature|score|experiment|model|personal/i.test(
      name,
    )
  )
    tags.push('intelligence');
  if (/admin|staff|case|audit|legal|compliance|operation/i.test(name))
    tags.push('administration');
  if (
    /provider|external|webhook|device|OAuth|deep link|contact|location/i.test(
      name,
    )
  )
    tags.push('integration');
  return unique(tags) as CaseTag[];
}

function makeCase(
  platform: PlatformSeed,
  seed: ScenarioSeed,
  actors: DepthActor[],
  name: string,
  index: number,
  tier: 1 | 2 | 3,
  allScenarioIds: string[],
): DepthCase {
  const tags = tagsFor(name, tier);
  const related =
    platform.id === 'instagram'
      ? instagramRelatedActorIds(seed, name, actors)
      : productRelatedActorIds(platform, seed, name, actors);
  const service =
    architectureByType[seed.archetype][
      Math.min(index % architectureByType[seed.archetype].length, 3)
    ];
  const optional = tags.includes('optional');
  const sensitive =
    tags.includes('security') ||
    seed.archetype === 'identity' ||
    seed.archetype === 'safety' ||
    seed.archetype === 'money';
  const id = `${platform.id.toUpperCase().replace(/-/g, '')}-${seed.id.toUpperCase().replace(/-/g, '')}-${String(index + 1).padStart(3, '0')}`;
  const guestAction =
    platform.id === 'instagram' &&
    /Open Shared Public|View Public Profile Preview/i.test(name);
  return {
    id,
    name,
    shortDescription: `${name} within ${platform.name}.`,
    detailedDescription: guestAction
      ? 'Allows an unauthenticated visitor to open an eligible public link or preview. The visitor does not inherit registered-user actions. Instagram may require login or continue-in-app before any account-only interaction.'
      : tier === 1
        ? `Allows the selected primary actor to complete ${name.toLowerCase()} within the visible ${seed.name} boundary.`
        : `Represents the platform behaviour needed to complete ${name.toLowerCase()}. It connects the visible goal with ${service.label.toLowerCase()} and related reliability or policy work.`,
    tier,
    tags,
    primaryActors: related.primary,
    secondaryActors: related.secondary,
    preconditions: [
      guestAction
        ? 'A valid shared link points to content that is public and eligible for a logged-out preview.'
        : `The initiating actor can access ${platform.name}.`,
      sensitive
        ? 'Required identity, permission and policy checks can run.'
        : `The ${seed.subject} context is available.`,
    ],
    trigger: optional
      ? `The actor chooses the optional ${name} action.`
      : `The actor requests ${name}.`,
    mainFlow: [
      `The actor starts ${name}.`,
      `The platform boundary validates the request and current ${seed.subject} state.`,
      `${service.label} performs its responsibility: ${service.responsibility.toLowerCase()}`,
      tier === 1
        ? 'The system records the visible result.'
        : 'The responsible service stores the source state and emits any required follow-up event.',
      'The platform returns a success state that the actor can observe.',
    ],
    alternateFlows: [
      optional
        ? 'The actor skips the optional action and the base goal continues.'
        : 'The actor changes valid input and submits the request again.',
      'A policy or eligibility rule allows a reduced version of the result.',
    ],
    exceptionFlows: [
      'Validation fails and no state change is committed.',
      tier >= 2
        ? 'A dependency times out, so the platform retries, compensates or exposes a recoverable failure.'
        : 'The network fails before confirmation and the actor can retry.',
    ],
    postconditions: [
      guestAction
        ? 'The public preview is shown, or a login or continue-in-app boundary is shown. No authenticated interaction is granted.'
        : `${name} is completed or its failure state is visible.`,
      tier >= 2
        ? 'Any accepted state change is auditable and safe to retry.'
        : 'The visible platform state is consistent with the result.',
    ],
    includes:
      platform.id === 'instagram'
        ? (instagramIncludes[name] ?? [])
        : (productRelationshipRules[platform.id] ?? [])
            .filter((item) => item.source === name && item.type === 'include')
            .map((item) => item.target),
    extends:
      platform.id === 'instagram'
        ? (instagramExtends[name] ?? [])
        : (productRelationshipRules[platform.id] ?? [])
            .filter((item) => item.source === name && item.type === 'extend')
            .map((item) => item.target),
    dataObjects: unique([
      seed.subject,
      `${seed.name} request`,
      tier >= 2 ? 'audit event' : 'visible result',
    ]),
    supportingServices: tier >= 2 ? [service.label, service.technology] : [],
    security: sensitive
      ? [
          'Authorize the actor for the current object and state.',
          'Record sensitive decisions without exposing confidential evidence.',
        ]
      : ['Reject unauthorized state changes.'],
    privacy:
      seed.archetype === 'intelligence'
        ? ['Use only eligible signals and respect preference controls.']
        : [
            'Expose only data allowed by the selected audience and account policy.',
          ],
    relatedScenarios: unique([
      seed.id,
      ...allScenarioIds
        .filter((item) => item !== seed.id)
        .slice(index % 5, (index % 5) + 2),
    ]),
    confidence: confidenceFor(name, tier),
  };
}

function makeCases(
  platform: PlatformSeed,
  seed: ScenarioSeed,
  actors: DepthActor[],
): DepthCase[] {
  const platformOverviewAdds =
    seed.archetype === 'overview' && ['uber', 'ola'].includes(platform.id)
      ? [
          'Select Pickup',
          'Select Destination',
          'Choose Ride Type',
          'Confirm Fare',
          'Go Online as Driver',
          'Accept Trip',
          'Manage Fleet Drivers',
          'Resolve Rider Support Case',
        ]
      : [];
  const classroomNames = unique([
    ...seed.core,
    ...platformOverviewAdds,
    ...classroomAdds[seed.archetype],
  ]).slice(0, 25);
  const systemNames = unique([
    ...classroomNames,
    ...systemAdds[seed.archetype],
  ]).slice(0, 45);
  const exhaustiveNames = unique([
    ...systemNames,
    ...exhaustiveAdds[seed.archetype],
  ]).slice(0, 70);
  const allIds = platform.scenarios.map((item) => item.id);
  return exhaustiveNames.map((name, index) => {
    const tier: 1 | 2 | 3 =
      index < classroomNames.length ? 1 : index < systemNames.length ? 2 : 3;
    return makeCase(platform, seed, actors, name, index, tier, allIds);
  });
}

function promoteEssentialActors(
  actors: DepthActor[],
  cases: DepthCase[],
): DepthActor[] {
  const classroomActorIds = new Set(
    cases
      .filter((item) => item.tier === 1)
      .flatMap((item) => [...item.primaryActors, ...item.secondaryActors]),
  );
  return actors.map((item) =>
    classroomActorIds.has(item.id) ? { ...item, tier: 1 } : item,
  );
}

function makeRelationships(
  platform: PlatformSeed,
  cases: DepthCase[],
  actors: DepthActor[],
): DepthRelationship[] {
  const links: DepthRelationship[] = [];
  cases.forEach((item) => {
    item.primaryActors.forEach((actorId) =>
      links.push({
        source: actorId,
        target: item.id,
        type: 'association',
        reason: `${actors.find((actor) => actor.id === actorId)?.label ?? 'Actor'} initiates this goal.`,
      }),
    );
    item.secondaryActors.slice(0, item.tier === 1 ? 1 : 3).forEach((actorId) =>
      links.push({
        source: actorId,
        target: item.id,
        type: 'association',
        reason: `${actors.find((actor) => actor.id === actorId)?.label ?? 'Actor'} crosses the boundary to support the goal.`,
      }),
    );
  });
  const byName = new Map(cases.map((item) => [item.name, item]));
  (productRelationshipRules[platform.id] ?? []).forEach((rule) => {
    const source = byName.get(rule.source);
    const target = byName.get(rule.target);
    if (source && target)
      links.push({
        source: source.id,
        target: target.id,
        type: rule.type,
        reason: rule.reason,
      });
  });
  const general = actors.find((item) =>
    /Creator|Professional|Driver|Artist|Podcaster|Seller|Merchant|Administrator/.test(
      item.label,
    ),
  );
  const base = actors.find(
    (item) =>
      /User|Member|Listener|Customer|Developer/.test(item.label) &&
      item.id !== general?.id,
  );
  if (general && base)
    links.push({
      source: general.id,
      target: base.id,
      type: 'generalization',
      reason: `${general.label} is a specialized form of ${base.label} in this teaching model.`,
    });
  return links;
}

function makeInstagramRelationships(
  cases: DepthCase[],
  actors: DepthActor[],
): DepthRelationship[] {
  const links: DepthRelationship[] = [];
  const byName = new Map(cases.map((item) => [item.name, item]));
  cases.forEach((item) => {
    item.primaryActors.forEach((actorId) =>
      links.push({
        source: actorId,
        target: item.id,
        type: 'association',
        reason: `${actors.find((actorItem) => actorItem.id === actorId)?.label ?? 'Actor'} initiates this goal in the selected Instagram boundary.`,
      }),
    );
    item.secondaryActors.forEach((actorId) =>
      links.push({
        source: actorId,
        target: item.id,
        type: 'association',
        reason: `${actors.find((actorItem) => actorItem.id === actorId)?.label ?? 'External actor'} crosses the Instagram boundary to support this goal.`,
      }),
    );
  });

  const addRelation = (
    sourceName: string,
    targetName: string,
    type: 'include' | 'extend',
    reason: string,
  ) => {
    const source = byName.get(sourceName);
    const target = byName.get(targetName);
    if (source && target)
      links.push({ source: source.id, target: target.id, type, reason });
  };
  addRelation(
    'Publish Content',
    'Select Media',
    'include',
    'Publishing requires a selected media item in this scenario scope.',
  );
  addRelation(
    'Publish Content',
    'Configure Audience',
    'include',
    'A publication always resolves an audience, even when the default is retained.',
  );
  addRelation(
    'Add Collaborator',
    'Publish Content',
    'extend',
    'Collaboration is optional. Publishing can complete without a collaborator.',
  );
  addRelation(
    'Create Promotion',
    'Select Objective',
    'include',
    'A promotion cannot be configured without an objective.',
  );
  addRelation(
    'Create Promotion',
    'Define Audience',
    'include',
    'A promotion must resolve the audience that may receive it.',
  );
  addRelation(
    'Create Promotion',
    'Set Budget',
    'include',
    'A paid promotion requires a budget before submission.',
  );
  addRelation(
    'Share to Close Friends',
    'Publish Story',
    'extend',
    'Close Friends is an optional audience choice for Story publishing.',
  );

  const generalizations: Array<[string, string]> = [
    ['creator-professional', 'registered-user'],
    ['advertiser-business', 'registered-user'],
  ];
  generalizations.forEach(([source, target]) => {
    if (
      actors.some((item) => item.id === source) &&
      actors.some((item) => item.id === target)
    )
      links.push({
        source,
        target,
        type: 'generalization',
        reason: `${actors.find((item) => item.id === source)?.label} is modelled as a specialized Registered User and inherits applicable account goals.`,
      });
  });
  return links;
}

function participant(
  id: string,
  label: string,
  type: SequenceParticipant['type'],
  tier: 1 | 2 | 3,
  responsibility: string,
): SequenceParticipant {
  return { id, label, type, tier, responsibility };
}

function sequenceStep(
  from: string,
  to: string,
  label: string,
  tier: 1 | 2 | 3,
  style: SequenceStep['style'],
  why: string,
  data: string,
  failure: string,
  confidence: KnowledgeLevel,
  fragment?: SequenceStep['fragment'],
  guard?: string,
): SequenceStep {
  return {
    from,
    to,
    label,
    tier,
    style,
    why,
    data,
    failure,
    confidence,
    fragment,
    guard,
  };
}

function makeSequence(seed: ScenarioSeed, cases: DepthCase[]) {
  const first = cases[0]?.name ?? `Start ${seed.name}`;
  const second = cases[1]?.name ?? 'Validate Request';
  const third = cases[2]?.name ?? 'Complete Goal';
  const main: SequenceStep[] = [
    sequenceStep(
      'actor',
      'client',
      first,
      1,
      'sync',
      'The actor starts the selected goal through a user-facing boundary.',
      'input and current context',
      'The client keeps the input and shows a recoverable error.',
      'observable',
    ),
    sequenceStep(
      'client',
      'gateway',
      `Submit ${first}`,
      1,
      'sync',
      'The client sends a structured request instead of contacting storage directly.',
      'request, identity and idempotency key',
      'A network failure leaves the request unconfirmed.',
      'conceptual',
    ),
    sequenceStep(
      'gateway',
      'auth',
      'Authenticate and authorize',
      1,
      'sync',
      'The boundary establishes who is acting and whether the action is allowed.',
      'identity and object policy',
      'The gateway stops the flow with a safe denial.',
      'conceptual',
    ),
    sequenceStep(
      'auth',
      'gateway',
      'Allowed',
      1,
      'return',
      'The authorization result returns before the state change continues.',
      'decision and policy version',
      'A challenge or denial follows an alternate branch.',
      'conceptual',
    ),
    sequenceStep(
      'gateway',
      'core',
      second,
      1,
      'sync',
      'The responsible service receives a validated command.',
      'validated command',
      'Validation failure returns without committing state.',
      'conceptual',
    ),
    sequenceStep(
      'core',
      'store',
      `Persist ${third}`,
      1,
      'sync',
      'The source of truth changes before success is announced.',
      'domain record and version',
      'A write conflict triggers retry or rejection.',
      'conceptual',
    ),
    sequenceStep(
      'store',
      'core',
      'Committed state',
      1,
      'return',
      'The service receives the committed version it can safely expose.',
      'record ID and version',
      'No success is returned without a committed result.',
      'conceptual',
    ),
    sequenceStep(
      'core',
      'gateway',
      'Goal completed',
      1,
      'return',
      'The service returns a stable business result, not a database response.',
      'result DTO',
      'The response can be reconstructed from stored state.',
      'conceptual',
    ),
    sequenceStep(
      'gateway',
      'client',
      'Show result',
      1,
      'return',
      'The boundary translates the service result for the client.',
      'visible result',
      'The client can refresh status if the response is lost.',
      'observable',
    ),
    sequenceStep(
      'core',
      'policy',
      'Run policy and safety checks',
      2,
      'sync',
      'Production behaviour applies scenario policy before distribution or settlement.',
      'content, account and context',
      'The request is restricted, held or rejected.',
      'conceptual',
    ),
    sequenceStep(
      'policy',
      'core',
      'Policy result',
      2,
      'return',
      'The service receives an auditable decision and reason code.',
      'decision and reason',
      'A policy timeout produces a safe default.',
      'conceptual',
    ),
    sequenceStep(
      'core',
      'events',
      'Publish domain event',
      2,
      'async',
      'Background work should not make the visible request wait.',
      'event ID and committed state reference',
      'The outbox or queue retries delivery.',
      'conceptual',
    ),
    sequenceStep(
      'events',
      'worker',
      'Process follow-up work',
      2,
      'async',
      'A consumer owns notification, indexing, media work or analytics.',
      'event payload',
      'The consumer retries idempotently.',
      'conceptual',
    ),
    sequenceStep(
      'worker',
      'external',
      'Call supporting provider',
      2,
      'sync',
      'The provider is outside the platform boundary and supports the actor goal.',
      'minimum required provider payload',
      'Timeout, rejection or provider outage triggers fallback.',
      'conceptual',
      'opt',
      'external action is required',
    ),
    sequenceStep(
      'worker',
      'analytics',
      'Record outcome',
      2,
      'async',
      'Measurement uses the completed business event.',
      'outcome and permitted dimensions',
      'Analytics loss must not undo the user goal.',
      'conceptual',
    ),
    sequenceStep(
      'gateway',
      'rate-limit',
      'Check capacity protection',
      3,
      'sync',
      'A large platform protects shared capacity before expensive work.',
      'identity, route and quota',
      'The platform returns retry guidance or a reduced service.',
      'conceptual',
    ),
    sequenceStep(
      'core',
      'cache',
      'Invalidate derived read',
      3,
      'async',
      'Cached or indexed views must not stay stale indefinitely.',
      'record key and version',
      'A replay or reconciliation job repairs missed invalidation.',
      'conceptual',
    ),
    sequenceStep(
      'worker',
      'audit',
      'Append audit record',
      3,
      'async',
      'Sensitive or operational actions need a reviewable history.',
      'actor, action, object and reason',
      'Audit failure raises an operational alert.',
      'conceptual',
    ),
    sequenceStep(
      'worker',
      'core',
      'Reconcile final state',
      3,
      'sync',
      'The platform checks that asynchronous side effects agree with source state.',
      'event and current version',
      'A repair workflow handles drift.',
      'conceptual',
      'loop',
      'until side effects are complete or expired',
    ),
  ];
  const failure: SequenceStep[] = [
    ...main.slice(0, 5),
    sequenceStep(
      'core',
      'policy',
      'Validate failure-sensitive rules',
      1,
      'sync',
      'The system evaluates the branch that can stop or reduce the goal.',
      'request and current state',
      'The decision itself may time out.',
      'conceptual',
      'alt',
      'request violates a rule or dependency is unavailable',
    ),
    sequenceStep(
      'policy',
      'core',
      'Denied or restricted',
      1,
      'return',
      'The core service receives a reason it can safely expose.',
      'reason code and permitted message',
      'Sensitive detection details stay hidden.',
      'conceptual',
    ),
    sequenceStep(
      'core',
      'gateway',
      'Return recoverable failure',
      1,
      'return',
      'The system states what happened without pretending the goal succeeded.',
      'error code and retry policy',
      'A lost response can be recovered through status lookup.',
      'conceptual',
    ),
    sequenceStep(
      'gateway',
      'client',
      'Explain next action',
      1,
      'return',
      'The actor needs a specific recovery path.',
      'message and retry affordance',
      'The client keeps the original input when safe.',
      'observable',
    ),
    sequenceStep(
      'core',
      'events',
      'Schedule retry or compensation',
      2,
      'async',
      'Partial work is retried or reversed outside the request path.',
      'operation ID and state version',
      'Dead-letter handling captures repeated failure.',
      'conceptual',
    ),
    sequenceStep(
      'events',
      'worker',
      'Retry idempotently',
      2,
      'async',
      'The same operation must not create duplicate state.',
      'idempotency key and attempt',
      'Exhausted attempts create an operations case.',
      'conceptual',
      'loop',
      'while retry policy allows',
    ),
    sequenceStep(
      'worker',
      'audit',
      'Record final failure state',
      3,
      'async',
      'Advanced analysis needs the full failure and recovery history.',
      'attempts, reason and final state',
      'Audit alerts if the record cannot be preserved.',
      'conceptual',
    ),
  ];
  const background: SequenceStep[] = [
    sequenceStep(
      'core',
      'events',
      'Publish completed event',
      1,
      'async',
      'Committed source state starts the background chain.',
      'event ID, actor and object',
      'An outbox retries publication.',
      'conceptual',
    ),
    sequenceStep(
      'events',
      'worker',
      'Consume event',
      1,
      'async',
      'A consumer owns follow-up work independently of the user request.',
      'event payload',
      'Duplicate delivery is ignored by idempotency key.',
      'conceptual',
    ),
    sequenceStep(
      'worker',
      'store',
      'Load current source state',
      1,
      'sync',
      'The worker confirms the object still exists and the event is current.',
      'object ID and version',
      'Stale events are ignored or reconciled.',
      'conceptual',
    ),
    sequenceStep(
      'store',
      'worker',
      'Current state',
      1,
      'return',
      'The worker receives the authoritative version.',
      'state and policy fields',
      'A temporary read failure is retried.',
      'conceptual',
    ),
    sequenceStep(
      'worker',
      'external',
      'Deliver supporting action',
      2,
      'sync',
      'The worker calls the required notification, payment, media or integration provider.',
      'minimized provider payload',
      'Provider failure follows retry and fallback policy.',
      'conceptual',
      'opt',
      'provider action is eligible',
    ),
    sequenceStep(
      'external',
      'worker',
      'Provider receipt',
      2,
      'return',
      'The receipt allows reconciliation instead of guessing delivery.',
      'provider ID and status',
      'Unknown state is checked later.',
      'documented',
    ),
    sequenceStep(
      'worker',
      'analytics',
      'Record background outcome',
      2,
      'async',
      'Operational and product measurement uses the final state.',
      'outcome, latency and permitted dimensions',
      'Measurement failure never reverses the user action.',
      'conceptual',
    ),
    sequenceStep(
      'worker',
      'audit',
      'Append sensitive action',
      3,
      'async',
      'Near exhaustive mode exposes review and accountability work.',
      'actor, action, policy and reason',
      'Audit failure creates an internal alert.',
      'conceptual',
    ),
    sequenceStep(
      'worker',
      'events',
      'Emit completion or dead-letter event',
      3,
      'async',
      'Downstream consumers learn whether the work completed or exhausted retries.',
      'final status and attempt count',
      'Operations receives a case for unresolved work.',
      'conceptual',
    ),
  ];
  return { main, failure, background };
}

function makeProductParticipants(
  platform: PlatformSeed,
  seed: ScenarioSeed,
  actors: DepthActor[],
): SequenceParticipant[] {
  const primaryActor =
    actors.find((item) => item.role === 'primary')?.label ??
    platform.primary[0];
  const policyLabel: Record<Archetype, string> = {
    overview: 'Capability and Access Policy',
    identity: 'Identity and Access Policy',
    profile: 'Profile and Privacy Policy',
    core: 'Workflow and Eligibility Policy',
    discovery: 'Discovery and Ranking Policy',
    social: 'Interaction and Safety Policy',
    lifecycle: 'State Transition Policy',
    notifications: 'Notification Preference Policy',
    safety: 'Trust and Safety Policy',
    money: 'Payment and Entitlement Policy',
    professional: 'Professional Eligibility Policy',
    admin: 'Operations and Enforcement Policy',
    integration: 'Permission and Scope Policy',
    intelligence: 'Eligibility and Ranking Policy',
  };
  const externalLabel = ['spotify', 'apple-music'].includes(platform.id)
    ? 'Catalog Rights or Connected Device'
    : ['uber', 'ola'].includes(platform.id)
      ? 'Maps, Payment or Emergency Provider'
      : ['zomato', 'swiggy'].includes(platform.id)
        ? 'Restaurant POS, Maps or Payment Provider'
        : ['blinkit', 'instamart'].includes(platform.id)
          ? 'Merchant, Maps or Payment Provider'
          : platform.id === 'threads'
            ? 'Fediverse or Notification Provider'
            : ['codex', 'claude-code'].includes(platform.id)
              ? 'Source Control or Tool Provider'
              : ['chatgpt', 'gemini'].includes(platform.id)
                ? 'Connected App or Tool Provider'
                : 'External Product Provider';
  return [
    participant(
      'actor',
      primaryActor,
      'actor',
      1,
      'Starts the scenario goal and observes the outcome.',
    ),
    participant(
      'client',
      `${platform.name} Client`,
      'boundary',
      1,
      'Collects input and presents status.',
    ),
    participant(
      'gateway',
      `${platform.name} API Boundary`,
      'boundary',
      1,
      'Validates the public request and routes it.',
    ),
    participant(
      'auth',
      'Identity and Authorization',
      'control',
      1,
      'Authenticates and authorizes the action.',
    ),
    participant(
      'core',
      `${seed.name} Service`,
      'service',
      1,
      'Owns the scenario state transition.',
    ),
    participant(
      'store',
      `${seed.name} Source Store`,
      'data',
      1,
      'Persists authoritative scenario state.',
    ),
    participant(
      'policy',
      policyLabel[seed.archetype],
      'service',
      2,
      'Applies policy, eligibility and risk rules.',
    ),
    participant(
      'events',
      'Event Bus',
      'service',
      2,
      'Carries committed events to background consumers.',
    ),
    participant(
      'worker',
      'Background Worker',
      'service',
      2,
      'Owns deferred processing, retry and compensation.',
    ),
    participant(
      'external',
      externalLabel,
      'external',
      2,
      `Crosses the ${platform.name} boundary to support an eligible external step.`,
    ),
    participant(
      'analytics',
      'Analytics Pipeline',
      'service',
      2,
      'Measures permitted product and operational outcomes.',
    ),
    participant(
      'rate-limit',
      'Capacity Control',
      'control',
      3,
      'Protects shared capacity and enforces quotas.',
    ),
    participant(
      'cache',
      'Cache / Index',
      'data',
      3,
      'Serves derived reads and is refreshed after writes.',
    ),
    participant(
      'audit',
      'Audit Store',
      'data',
      3,
      'Preserves sensitive decisions and operational history.',
    ),
  ];
}

function makeInstagramParticipants(seed: ScenarioSeed): SequenceParticipant[] {
  const labels: Record<
    string,
    {
      actor: string;
      core: string;
      policy: string;
      external: string;
      store: string;
    }
  > = {
    overview: {
      actor: 'Registered User',
      core: 'Instagram Capability Service',
      policy: 'Audience and Integrity Policy',
      external: 'Connected Meta or Device Service',
      store: 'Account and Content Store',
    },
    identity: {
      actor: 'Visitor / Account Holder',
      core: 'Account Access Service',
      policy: 'Login Risk and Access Policy',
      external: 'Accounts Center or Delivery Provider',
      store: 'Account and Session Store',
    },
    content: {
      actor: 'Registered User / Creator',
      core: 'Publishing Service',
      policy: 'Media and Audience Policy',
      external: 'Device or Music Provider',
      store: 'Content and Media Store',
    },
    discovery: {
      actor: 'Registered User',
      core: 'Feed and Discovery Service',
      policy: 'Recommendation Eligibility',
      external: 'Ad Delivery Boundary',
      store: 'Content Index and Feed State',
    },
    social: {
      actor: 'Registered User',
      core: 'Social Graph Service',
      policy: 'Privacy and Interaction Policy',
      external: 'Notification Provider',
      store: 'Graph and Engagement Store',
    },
    messaging: {
      actor: 'Registered User',
      core: 'Messaging Service',
      policy: 'Messaging Safety Policy',
      external: 'Push Provider',
      store: 'Conversation Store',
    },
    'stories-live': {
      actor: 'Registered User / Creator',
      core: 'Stories and Live Service',
      policy: 'Audience and Live Safety',
      external: 'Device or Music Provider',
      store: 'Ephemeral Media Store',
    },
    safety: {
      actor: 'Registered User',
      core: 'Privacy and Reporting Service',
      policy: 'Safety and Enforcement Policy',
      external: 'Notification or Legal Boundary',
      store: 'Privacy and Case Store',
    },
    creator: {
      actor: 'Creator / Professional User',
      core: 'Professional Tools Service',
      policy: 'Professional Eligibility Policy',
      external: 'Meta Business Suite',
      store: 'Professional Account Store',
    },
    advertising: {
      actor: 'Advertiser / Agency',
      core: 'Campaign Service',
      policy: 'Ads Review and Delivery Policy',
      external: 'Business Suite or Payment Processor',
      store: 'Campaign and Billing Store',
    },
    notifications: {
      actor: 'Registered User',
      core: 'Notification Orchestrator',
      policy: 'Preference and Eligibility Policy',
      external: 'Push / Email / SMS Provider',
      store: 'Notification State Store',
    },
    administration: {
      actor: 'Moderator / Support Agent',
      core: 'Case Management Service',
      policy: 'Enforcement Policy',
      external: 'Legal or Delivery Boundary',
      store: 'Evidence and Decision Store',
    },
    integrations: {
      actor: 'External Developer / Professional User',
      core: 'Instagram Platform API',
      policy: 'Permission and Rate Policy',
      external: 'Meta Login / Webhook Consumer',
      store: 'Grant and Platform Data Store',
    },
    intelligence: {
      actor: 'Registered User',
      core: 'Ranking Orchestrator',
      policy: 'Eligibility and Integrity Filter',
      external: 'Ads Selection Boundary',
      store: 'Candidate Index and Signals',
    },
  };
  const current = labels[seed.id] ?? labels.overview;
  return [
    participant(
      'actor',
      current.actor,
      'actor',
      1,
      'Starts the selected Instagram goal and observes the result.',
    ),
    participant(
      'client',
      'Instagram Client',
      'boundary',
      1,
      'Collects input and renders the visible state.',
    ),
    participant(
      'gateway',
      'Instagram API Boundary',
      'boundary',
      1,
      'Validates and routes the public request.',
    ),
    participant(
      'auth',
      'Identity and Authorization',
      'control',
      1,
      'Authenticates the session and authorizes the object action.',
    ),
    participant(
      'core',
      current.core,
      'service',
      1,
      'Owns the selected scenario state transition.',
    ),
    participant(
      'store',
      current.store,
      'data',
      1,
      'Persists authoritative scenario state.',
    ),
    participant(
      'policy',
      current.policy,
      'service',
      2,
      'Applies the relevant audience, eligibility, safety or business rule.',
    ),
    participant(
      'events',
      'Domain Event Stream',
      'service',
      2,
      'Carries committed events to permitted background consumers.',
    ),
    participant(
      'worker',
      'Scenario Background Worker',
      'service',
      2,
      'Runs retryable deferred processing.',
    ),
    participant(
      'external',
      current.external,
      'external',
      2,
      'Supports the documented cross-boundary step for this scenario.',
    ),
    participant(
      'analytics',
      'Measurement Pipeline',
      'service',
      2,
      'Measures permitted product and operational outcomes.',
    ),
    participant(
      'rate-limit',
      'Rate and Capacity Control',
      'control',
      3,
      'Protects shared capacity and documented quotas.',
    ),
    participant(
      'cache',
      'Derived Cache / Index',
      'data',
      3,
      'Serves derived reads that can be rebuilt from source state.',
    ),
    participant(
      'audit',
      'Audit and Decision Store',
      'data',
      3,
      'Preserves sensitive actions and decision history.',
    ),
  ];
}

type ClassBlueprint = {
  label: string;
  stereotype: DepthClass['stereotype'];
  responsibility: string;
  attributes: string[];
  operations: string[];
  domains: Archetype[];
  owner?: string;
  relation?: DepthClassRelationship['type'];
  sourceMultiplicity?: string;
  targetMultiplicity?: string;
};

function classBlueprint(
  label: string,
  stereotype: DepthClass['stereotype'],
  responsibility: string,
  attributes: string[],
  operations: string[],
  domains: Archetype[],
  owner?: string,
  relation: DepthClassRelationship['type'] = 'association',
  sourceMultiplicity = '1',
  targetMultiplicity = '0..*',
): ClassBlueprint {
  return {
    label,
    stereotype,
    responsibility,
    attributes,
    operations,
    domains,
    owner,
    relation,
    sourceMultiplicity,
    targetMultiplicity,
  };
}

const productClassCatalog: Record<string, ClassBlueprint[]> = {
  instagram: [
    classBlueprint(
      'Account',
      'entity',
      'Owns identity, status and account-level settings.',
      ['accountId: UUID', 'status: AccountStatus'],
      ['updateStatus(): void'],
      ['overview', 'identity', 'profile', 'safety', 'admin'],
    ),
    classBlueprint(
      'Profile',
      'entity',
      'Stores the public presentation of an account.',
      ['username: String', 'bio: String'],
      ['editProfile(): void'],
      ['overview', 'profile'],
      'Account',
      'composition',
      '1',
      '1',
    ),
    classBlueprint(
      'MediaPost',
      'entity',
      'Represents a published post or reel and its audience.',
      ['postId: UUID', 'caption: String', 'audience: Audience'],
      ['publish(): void', 'archive(): void'],
      ['overview', 'core', 'discovery', 'social', 'lifecycle', 'intelligence'],
      'Account',
      'aggregation',
    ),
    classBlueprint(
      'Comment',
      'entity',
      'Records a response to content.',
      ['commentId: UUID', 'body: String'],
      ['edit(): void', 'remove(): void'],
      ['overview', 'social', 'safety'],
      'MediaPost',
      'composition',
    ),
    classBlueprint(
      'Story',
      'entity',
      'Represents expiring audience-scoped media.',
      ['storyId: UUID', 'expiresAt: DateTime'],
      ['publish(): void'],
      ['overview', 'lifecycle', 'core'],
      'Account',
      'aggregation',
    ),
    classBlueprint(
      'Conversation',
      'entity',
      'Groups direct-message participants and messages.',
      ['conversationId: UUID'],
      ['sendMessage(): void'],
      ['overview', 'social', 'notifications', 'safety'],
      'Account',
      'aggregation',
    ),
    classBlueprint(
      'Campaign',
      'entity',
      'Stores promotion objective, audience, budget and state.',
      ['campaignId: UUID', 'budget: Money'],
      ['submitForReview(): void'],
      ['overview', 'money', 'professional', 'admin'],
      'Account',
      'aggregation',
    ),
  ],
  spotify: [
    classBlueprint(
      'ListenerAccount',
      'entity',
      'Owns library, preferences and subscription state.',
      ['listenerId: UUID', 'market: CountryCode'],
      ['saveItem(): void'],
      ['overview', 'identity', 'profile', 'discovery', 'money'],
    ),
    classBlueprint(
      'ArtistProfile',
      'entity',
      'Represents an artist or podcaster catalog identity.',
      ['artistId: UUID', 'displayName: String'],
      ['publishRelease(): void'],
      ['overview', 'professional', 'core'],
      'ListenerAccount',
      'association',
    ),
    classBlueprint(
      'Track',
      'entity',
      'Represents playable catalog audio and rights metadata.',
      ['trackId: UUID', 'durationMs: Integer'],
      ['isPlayableIn(market): Boolean'],
      ['overview', 'core', 'discovery', 'intelligence'],
    ),
    classBlueprint(
      'Album',
      'entity',
      'Groups an ordered release of tracks.',
      ['albumId: UUID', 'releaseDate: Date'],
      ['addTrack(): void'],
      ['overview', 'core', 'discovery'],
      'Track',
      'aggregation',
      '1',
      '1..*',
    ),
    classBlueprint(
      'Playlist',
      'entity',
      'Stores an ordered user-curated collection.',
      ['playlistId: UUID', 'visibility: Visibility'],
      ['addTrack(): void', 'reorder(): void'],
      ['overview', 'core', 'social', 'lifecycle'],
      'ListenerAccount',
      'composition',
    ),
    classBlueprint(
      'PlaybackSession',
      'control',
      'Coordinates queue, device and current playback state.',
      ['sessionId: UUID', 'positionMs: Integer'],
      ['play(): void', 'transfer(): void'],
      ['overview', 'core', 'integration'],
      'ListenerAccount',
      'association',
    ),
    classBlueprint(
      'Subscription',
      'entity',
      'Represents plan and entitlement state.',
      ['plan: Plan', 'renewalAt: DateTime'],
      ['cancel(): void'],
      ['overview', 'money'],
      'ListenerAccount',
      'composition',
      '1',
      '0..1',
    ),
  ],
  'apple-music': [
    classBlueprint(
      'AppleMusicAccount',
      'entity',
      'Owns library, preferences and subscription state.',
      ['accountId: UUID', 'storefront: String'],
      ['addToLibrary(): void'],
      ['overview', 'identity', 'profile', 'discovery', 'money'],
    ),
    classBlueprint(
      'ArtistProfile',
      'entity',
      'Represents an artist catalog identity.',
      ['artistId: UUID', 'name: String'],
      ['publishRelease(): void'],
      ['overview', 'professional', 'core'],
    ),
    classBlueprint(
      'Song',
      'entity',
      'Represents playable catalog audio and rights metadata.',
      ['songId: String', 'durationMs: Integer'],
      ['isPlayable(): Boolean'],
      ['overview', 'core', 'discovery', 'intelligence'],
    ),
    classBlueprint(
      'Album',
      'entity',
      'Groups an ordered release of songs.',
      ['albumId: String', 'releaseDate: Date'],
      ['addSong(): void'],
      ['overview', 'core', 'discovery'],
      'Song',
      'aggregation',
      '1',
      '1..*',
    ),
    classBlueprint(
      'Playlist',
      'entity',
      'Stores an ordered personal or collaborative collection.',
      ['playlistId: String', 'name: String'],
      ['addSong(): void'],
      ['overview', 'core', 'social', 'lifecycle'],
      'AppleMusicAccount',
      'composition',
    ),
    classBlueprint(
      'PlaybackSession',
      'control',
      'Coordinates queue, output route and playback state.',
      ['sessionId: UUID', 'route: OutputRoute'],
      ['play(): void', 'startSharePlay(): void'],
      ['overview', 'core', 'integration'],
      'AppleMusicAccount',
      'association',
    ),
    classBlueprint(
      'Subscription',
      'entity',
      'Represents plan and entitlement state.',
      ['plan: Plan', 'renewalAt: DateTime'],
      ['cancel(): void'],
      ['overview', 'money'],
      'AppleMusicAccount',
      'composition',
      '1',
      '0..1',
    ),
  ],
  x: [
    classBlueprint(
      'Account',
      'entity',
      'Owns profile, settings and conversation identity.',
      ['accountId: UUID', 'handle: String'],
      ['publishPost(): void'],
      ['overview', 'identity', 'profile', 'social', 'safety'],
    ),
    classBlueprint(
      'Post',
      'entity',
      'Represents text, media, reply and quote state.',
      ['postId: UUID', 'body: String'],
      ['publish(): void', 'repost(): void'],
      ['overview', 'core', 'discovery', 'social', 'lifecycle', 'intelligence'],
      'Account',
      'aggregation',
    ),
    classBlueprint(
      'ConversationThread',
      'entity',
      'Orders connected posts and replies.',
      ['threadId: UUID'],
      ['appendPost(): void'],
      ['overview', 'core', 'social'],
      'Post',
      'aggregation',
      '1',
      '1..*',
    ),
    classBlueprint(
      'Community',
      'entity',
      'Groups members, rules and community posts.',
      ['communityId: UUID', 'name: String'],
      ['addMember(): void'],
      ['overview', 'social', 'safety'],
      'Account',
      'aggregation',
    ),
    classBlueprint(
      'Space',
      'entity',
      'Represents a live audio room and speaker roles.',
      ['spaceId: UUID', 'state: SpaceState'],
      ['start(): void', 'end(): void'],
      ['overview', 'lifecycle', 'social'],
      'Account',
      'aggregation',
    ),
    classBlueprint(
      'PremiumSubscription',
      'entity',
      'Stores paid plan and entitlement state.',
      ['tier: PremiumTier'],
      ['cancel(): void'],
      ['overview', 'money'],
      'Account',
      'composition',
      '1',
      '0..1',
    ),
  ],
  threads: [
    classBlueprint(
      'ThreadsProfile',
      'entity',
      'Owns public identity, settings and federation state.',
      ['profileId: UUID', 'username: String'],
      ['updateProfile(): void'],
      ['overview', 'identity', 'profile', 'safety'],
    ),
    classBlueprint(
      'ThreadPost',
      'entity',
      'Represents a post, reply or quote.',
      ['postId: UUID', 'body: String'],
      ['publish(): void'],
      ['overview', 'core', 'discovery', 'social', 'lifecycle', 'intelligence'],
      'ThreadsProfile',
      'aggregation',
    ),
    classBlueprint(
      'Reply',
      'entity',
      'Represents a response connected to another post.',
      ['replyId: UUID', 'body: String'],
      ['publish(): void'],
      ['overview', 'social'],
      'ThreadPost',
      'composition',
    ),
    classBlueprint(
      'Feed',
      'control',
      'Orders followed and recommended posts for a viewer.',
      ['feedId: UUID'],
      ['rank(): ThreadPost[]'],
      ['overview', 'discovery', 'intelligence'],
      'ThreadsProfile',
      'association',
    ),
    classBlueprint(
      'FediverseIdentity',
      'value object',
      'Stores an eligible federated address and state.',
      ['handle: String', 'server: URL'],
      ['federate(): void'],
      ['overview', 'integration'],
      'ThreadsProfile',
      'composition',
      '1',
      '0..1',
    ),
  ],
  uber: [],
  ola: [],
  pinterest: [
    classBlueprint(
      'PinterestAccount',
      'entity',
      'Owns profile, boards and discovery preferences.',
      ['accountId: UUID', 'username: String'],
      ['savePin(): void'],
      ['overview', 'identity', 'profile', 'discovery'],
    ),
    classBlueprint(
      'Pin',
      'entity',
      'Represents an image, destination and descriptive metadata.',
      ['pinId: UUID', 'destination: URL'],
      ['publish(): void'],
      ['overview', 'core', 'discovery', 'social', 'intelligence'],
      'PinterestAccount',
      'aggregation',
    ),
    classBlueprint(
      'PinAsset',
      'value object',
      'Stores the visual asset and derived metadata.',
      ['assetUrl: URL', 'altText: String'],
      ['extractFeatures(): Vector'],
      ['overview', 'core', 'intelligence'],
      'Pin',
      'composition',
      '1',
      '1',
    ),
    classBlueprint(
      'Board',
      'entity',
      'Groups saved Pins and collaborators.',
      ['boardId: UUID', 'visibility: Visibility'],
      ['addPin(): void'],
      ['overview', 'core', 'social', 'lifecycle'],
      'PinterestAccount',
      'composition',
    ),
    classBlueprint(
      'MerchantProduct',
      'entity',
      'Connects a Pin with catalog and price data.',
      ['productId: UUID', 'price: Money'],
      ['updateAvailability(): void'],
      ['overview', 'professional', 'money', 'integration'],
      'Pin',
      'association',
      '0..1',
      '0..1',
    ),
  ],
  zomato: [],
  swiggy: [],
  blinkit: [],
  instamart: [],
  chatgpt: [
    classBlueprint(
      'User',
      'entity',
      'Owns personal settings, chats and memory controls.',
      ['userId: UUID', 'plan: Plan'],
      ['startConversation(): void'],
      ['overview', 'identity', 'profile', 'money'],
    ),
    classBlueprint(
      'Workspace',
      'entity',
      'Groups members, roles and workspace policy.',
      ['workspaceId: UUID', 'name: String'],
      ['addMember(): void'],
      ['overview', 'professional', 'admin'],
      'User',
      'aggregation',
    ),
    classBlueprint(
      'Conversation',
      'entity',
      'Orders messages and conversation-level state.',
      ['conversationId: UUID', 'title: String'],
      ['appendMessage(): void'],
      ['overview', 'core', 'social', 'lifecycle'],
      'User',
      'composition',
    ),
    classBlueprint(
      'Message',
      'entity',
      'Stores one user, assistant or tool message.',
      ['messageId: UUID', 'role: MessageRole'],
      ['stream(): void'],
      ['overview', 'core', 'safety'],
      'Conversation',
      'composition',
      '1',
      '1..*',
    ),
    classBlueprint(
      'Attachment',
      'entity',
      'Stores file metadata linked to a message.',
      ['attachmentId: UUID', 'mediaType: String'],
      ['extractContent(): void'],
      ['overview', 'core', 'integration'],
      'Message',
      'composition',
    ),
    classBlueprint(
      'ToolInvocation',
      'entity',
      'Records a tool request, authorization and result.',
      ['invocationId: UUID', 'status: ToolStatus'],
      ['execute(): ToolResult'],
      ['overview', 'integration', 'intelligence'],
      'Message',
      'aggregation',
    ),
  ],
  gemini: [
    classBlueprint(
      'User',
      'entity',
      'Owns settings, conversations and activity controls.',
      ['userId: UUID', 'locale: String'],
      ['startConversation(): void'],
      ['overview', 'identity', 'profile'],
    ),
    classBlueprint(
      'Workspace',
      'entity',
      'Groups users, roles and organization policy.',
      ['workspaceId: UUID', 'name: String'],
      ['setPolicy(): void'],
      ['overview', 'professional', 'admin'],
      'User',
      'aggregation',
    ),
    classBlueprint(
      'Conversation',
      'entity',
      'Orders prompts, responses and multimodal context.',
      ['conversationId: UUID'],
      ['appendTurn(): void'],
      ['overview', 'core', 'lifecycle'],
      'User',
      'composition',
    ),
    classBlueprint(
      'Prompt',
      'entity',
      'Stores a user instruction and selected context.',
      ['promptId: UUID', 'text: String'],
      ['submit(): void'],
      ['overview', 'core', 'safety'],
      'Conversation',
      'composition',
      '1',
      '1..*',
    ),
    classBlueprint(
      'Attachment',
      'entity',
      'Stores image or file metadata for a prompt.',
      ['attachmentId: UUID', 'mediaType: String'],
      ['extractContent(): void'],
      ['overview', 'core', 'integration'],
      'Prompt',
      'composition',
    ),
    classBlueprint(
      'ExtensionInvocation',
      'entity',
      'Records an authorized Google service request.',
      ['invocationId: UUID', 'scope: String'],
      ['execute(): Result'],
      ['overview', 'integration', 'intelligence'],
      'Prompt',
      'aggregation',
    ),
  ],
  codex: [
    classBlueprint(
      'Developer',
      'entity',
      'Owns tasks, preferences and approval context.',
      ['developerId: UUID'],
      ['createTask(): void'],
      ['overview', 'identity', 'profile'],
    ),
    classBlueprint(
      'Repository',
      'entity',
      'Represents source tree, branch and repository policy.',
      ['repositoryId: UUID', 'branch: String'],
      ['readFile(): File'],
      ['overview', 'core', 'integration', 'safety'],
      'Developer',
      'aggregation',
    ),
    classBlueprint(
      'CodingTask',
      'entity',
      'Tracks the requested goal, status and completion evidence.',
      ['taskId: UUID', 'status: TaskStatus'],
      ['complete(): void'],
      ['overview', 'core', 'lifecycle', 'intelligence'],
      'Developer',
      'composition',
    ),
    classBlueprint(
      'ChangeSet',
      'entity',
      'Groups file edits produced for a task.',
      ['changeSetId: UUID'],
      ['diff(): Patch'],
      ['overview', 'core', 'professional'],
      'CodingTask',
      'composition',
    ),
    classBlueprint(
      'CommandRun',
      'entity',
      'Records a command, output and exit status.',
      ['commandId: UUID', 'exitCode: Integer'],
      ['run(): CommandResult'],
      ['overview', 'core', 'integration'],
      'CodingTask',
      'composition',
    ),
    classBlueprint(
      'Review',
      'entity',
      'Stores review comments and disposition for a change.',
      ['reviewId: UUID', 'decision: ReviewDecision'],
      ['approve(): void'],
      ['overview', 'professional', 'safety'],
      'ChangeSet',
      'aggregation',
    ),
  ],
  'claude-code': [
    classBlueprint(
      'Developer',
      'entity',
      'Owns sessions, preferences and permission context.',
      ['developerId: UUID'],
      ['startSession(): void'],
      ['overview', 'identity', 'profile'],
    ),
    classBlueprint(
      'Repository',
      'entity',
      'Represents source tree, branch and repository policy.',
      ['repositoryId: UUID', 'branch: String'],
      ['readFile(): File'],
      ['overview', 'core', 'integration', 'safety'],
      'Developer',
      'aggregation',
    ),
    classBlueprint(
      'CodingSession',
      'entity',
      'Tracks the terminal task and conversation state.',
      ['sessionId: UUID', 'status: SessionStatus'],
      ['complete(): void'],
      ['overview', 'core', 'lifecycle', 'intelligence'],
      'Developer',
      'composition',
    ),
    classBlueprint(
      'FileEdit',
      'entity',
      'Represents a proposed repository file change.',
      ['editId: UUID', 'path: Path'],
      ['apply(): void'],
      ['overview', 'core', 'professional'],
      'CodingSession',
      'composition',
    ),
    classBlueprint(
      'ToolCall',
      'entity',
      'Records a shell, Git or MCP tool request and result.',
      ['toolCallId: UUID', 'status: ToolStatus'],
      ['execute(): ToolResult'],
      ['overview', 'core', 'integration'],
      'CodingSession',
      'composition',
    ),
    classBlueprint(
      'PermissionRequest',
      'entity',
      'Records a requested capability and user decision.',
      ['requestId: UUID', 'decision: Decision'],
      ['approve(): void'],
      ['overview', 'safety', 'integration'],
      'ToolCall',
      'association',
    ),
  ],
};

const mobilityClassCatalog = (accountLabel: string): ClassBlueprint[] => [
  classBlueprint(
    accountLabel,
    'entity',
    'Owns rider identity, saved places and payment preferences.',
    ['riderId: UUID', 'rating: Decimal'],
    ['requestTrip(): void'],
    ['overview', 'identity', 'profile', 'money'],
  ),
  classBlueprint(
    'Driver',
    'entity',
    'Owns driver availability, eligibility and earnings state.',
    ['driverId: UUID', 'status: DriverStatus'],
    ['acceptTrip(): void'],
    ['overview', 'core', 'professional', 'safety', 'money'],
  ),
  classBlueprint(
    'Vehicle',
    'entity',
    'Represents an eligible vehicle assigned to a driver.',
    ['vehicleId: UUID', 'vehicleType: String'],
    ['isEligible(): Boolean'],
    ['overview', 'professional', 'safety'],
    'Driver',
    'aggregation',
    '1',
    '1..*',
  ),
  classBlueprint(
    'Trip',
    'entity',
    'Owns the ride request and trip state machine.',
    ['tripId: UUID', 'status: TripStatus'],
    ['start(): void', 'complete(): void'],
    ['overview', 'core', 'lifecycle', 'safety', 'intelligence'],
    accountLabel,
    'association',
  ),
  classBlueprint(
    'Location',
    'value object',
    'Stores a point and normalized address.',
    ['latitude: Decimal', 'longitude: Decimal'],
    ['distanceTo(): Distance'],
    ['overview', 'core', 'integration'],
    'Trip',
    'composition',
    '1',
    '2',
  ),
  classBlueprint(
    'Fare',
    'value object',
    'Stores estimated and final price components.',
    ['amount: Money', 'currency: Currency'],
    ['recalculate(): Money'],
    ['overview', 'core', 'money', 'intelligence'],
    'Trip',
    'composition',
    '1',
    '1',
  ),
  classBlueprint(
    'Payment',
    'entity',
    'Tracks authorization, capture and refund state.',
    ['paymentId: UUID', 'status: PaymentStatus'],
    ['capture(): void'],
    ['overview', 'money'],
    'Trip',
    'composition',
    '1',
    '0..1',
  ),
];

const foodClassCatalog = (customerLabel: string): ClassBlueprint[] => [
  classBlueprint(
    customerLabel,
    'entity',
    'Owns addresses, preferences and order history.',
    ['customerId: UUID'],
    ['placeOrder(): void'],
    ['overview', 'identity', 'profile', 'money'],
  ),
  classBlueprint(
    'Restaurant',
    'entity',
    'Owns menu, availability and preparation state.',
    ['restaurantId: UUID', 'status: RestaurantStatus'],
    ['acceptOrder(): void'],
    ['overview', 'core', 'professional', 'discovery'],
  ),
  classBlueprint(
    'MenuItem',
    'entity',
    'Represents an orderable item and its options.',
    ['itemId: UUID', 'price: Money'],
    ['isAvailable(): Boolean'],
    ['overview', 'core', 'discovery'],
    'Restaurant',
    'composition',
    '1',
    '1..*',
  ),
  classBlueprint(
    'FoodOrder',
    'entity',
    'Owns the customer cart and fulfillment state machine.',
    ['orderId: UUID', 'status: OrderStatus'],
    ['place(): void', 'cancel(): void'],
    ['overview', 'core', 'lifecycle', 'money', 'safety'],
    customerLabel,
    'composition',
  ),
  classBlueprint(
    'OrderLine',
    'value object',
    'Captures item, quantity and selected options.',
    ['quantity: Integer', 'unitPrice: Money'],
    ['subtotal(): Money'],
    ['overview', 'core'],
    'FoodOrder',
    'composition',
    '1',
    '1..*',
  ),
  classBlueprint(
    'DeliveryAssignment',
    'entity',
    'Links an accepted order to a delivery partner.',
    ['assignmentId: UUID', 'status: DeliveryStatus'],
    ['assign(): void'],
    ['overview', 'lifecycle', 'intelligence'],
    'FoodOrder',
    'aggregation',
    '1',
    '0..1',
  ),
  classBlueprint(
    'Payment',
    'entity',
    'Tracks authorization, cash collection and refund state.',
    ['paymentId: UUID', 'status: PaymentStatus'],
    ['refund(): void'],
    ['overview', 'money'],
    'FoodOrder',
    'composition',
    '1',
    '0..1',
  ),
];

const commerceClassCatalog = (customerLabel: string): ClassBlueprint[] => [
  classBlueprint(
    customerLabel,
    'entity',
    'Owns addresses, preferences and order history.',
    ['customerId: UUID'],
    ['placeOrder(): void'],
    ['overview', 'identity', 'profile', 'money'],
  ),
  classBlueprint(
    'CatalogItem',
    'entity',
    'Represents a sellable product and current catalog data.',
    ['itemId: UUID', 'price: Money'],
    ['isAvailable(): Boolean'],
    ['overview', 'core', 'discovery', 'intelligence'],
  ),
  classBlueprint(
    'Cart',
    'entity',
    'Collects selected items before order placement.',
    ['cartId: UUID'],
    ['addItem(): void', 'total(): Money'],
    ['overview', 'core'],
    customerLabel,
    'composition',
  ),
  classBlueprint(
    'GroceryOrder',
    'entity',
    'Owns checkout and fulfillment state.',
    ['orderId: UUID', 'status: OrderStatus'],
    ['place(): void', 'cancel(): void'],
    ['overview', 'core', 'lifecycle', 'money', 'safety'],
    customerLabel,
    'composition',
  ),
  classBlueprint(
    'InventoryReservation',
    'entity',
    'Reserves store stock for accepted order lines.',
    ['reservationId: UUID', 'expiresAt: DateTime'],
    ['reserve(): void', 'release(): void'],
    ['overview', 'core', 'lifecycle', 'intelligence'],
    'GroceryOrder',
    'composition',
  ),
  classBlueprint(
    'SubstitutionPreference',
    'value object',
    'Stores the customer choice for unavailable items.',
    ['mode: SubstitutionMode'],
    ['allows(item): Boolean'],
    ['overview', 'core'],
    'GroceryOrder',
    'composition',
    '1',
    '0..*',
  ),
  classBlueprint(
    'DeliveryAssignment',
    'entity',
    'Links a packed order to a delivery partner.',
    ['assignmentId: UUID', 'status: DeliveryStatus'],
    ['assign(): void'],
    ['overview', 'lifecycle', 'intelligence'],
    'GroceryOrder',
    'aggregation',
    '1',
    '0..1',
  ),
];

productClassCatalog.uber = mobilityClassCatalog('Rider');
productClassCatalog.ola = mobilityClassCatalog('Rider');
productClassCatalog.zomato = foodClassCatalog('Customer');
productClassCatalog.swiggy = foodClassCatalog('Customer');
productClassCatalog.blinkit = commerceClassCatalog('Customer');
productClassCatalog.instamart = commerceClassCatalog('Customer');

const archetypeClassCatalog: Partial<Record<Archetype, ClassBlueprint[]>> = {
  identity: [
    classBlueprint(
      'Session',
      'entity',
      'Tracks authenticated device and expiry state.',
      ['sessionId: UUID', 'expiresAt: DateTime'],
      ['revoke(): void'],
      ['identity'],
    ),
    classBlueprint(
      'VerificationChallenge',
      'entity',
      'Tracks a time-limited verification attempt.',
      ['challengeId: UUID', 'status: ChallengeStatus'],
      ['verify(): Boolean'],
      ['identity'],
    ),
  ],
  notifications: [
    classBlueprint(
      'Notification',
      'entity',
      'Stores one user-visible notification and delivery state.',
      ['notificationId: UUID', 'status: DeliveryStatus'],
      ['markRead(): void'],
      ['notifications'],
    ),
    classBlueprint(
      'NotificationPreference',
      'value object',
      'Stores channel and notification-type choices.',
      ['channel: Channel', 'enabled: Boolean'],
      ['allows(type): Boolean'],
      ['notifications'],
    ),
  ],
  safety: [
    classBlueprint(
      'SafetyReport',
      'entity',
      'Stores a report, evidence reference and review state.',
      ['reportId: UUID', 'status: CaseStatus'],
      ['submit(): void'],
      ['safety'],
    ),
    classBlueprint(
      'ModerationDecision',
      'entity',
      'Records a policy decision and its reason.',
      ['decisionId: UUID', 'action: EnforcementAction'],
      ['apply(): void'],
      ['safety'],
    ),
    classBlueprint(
      'Appeal',
      'entity',
      'Tracks a challenge to an enforcement decision.',
      ['appealId: UUID', 'status: AppealStatus'],
      ['resolve(): void'],
      ['safety'],
    ),
  ],
  admin: [
    classBlueprint(
      'OperationsCase',
      'entity',
      'Groups evidence, assignments and case outcome.',
      ['caseId: UUID', 'priority: Priority'],
      ['assign(): void'],
      ['admin'],
    ),
    classBlueprint(
      'AuditEntry',
      'entity',
      'Records a sensitive administrative action.',
      ['entryId: UUID', 'occurredAt: DateTime'],
      ['append(): void'],
      ['admin'],
    ),
  ],
  money: [
    classBlueprint(
      'Entitlement',
      'entity',
      'Stores the capability granted by a plan or purchase.',
      ['entitlementId: UUID', 'expiresAt: DateTime'],
      ['isActive(): Boolean'],
      ['money'],
    ),
    classBlueprint(
      'Invoice',
      'entity',
      'Records billed items, tax and payment state.',
      ['invoiceId: UUID', 'total: Money'],
      ['finalize(): void'],
      ['money'],
    ),
  ],
  integration: [
    classBlueprint(
      'IntegrationConnection',
      'entity',
      'Stores authorized provider and scope state.',
      ['connectionId: UUID', 'scopes: Scope[]'],
      ['revoke(): void'],
      ['integration'],
    ),
    classBlueprint(
      'WebhookDelivery',
      'entity',
      'Tracks one signed outbound event delivery.',
      ['deliveryId: UUID', 'attempts: Integer'],
      ['retry(): void'],
      ['integration'],
    ),
  ],
  intelligence: [
    classBlueprint(
      'Candidate',
      'value object',
      'Represents one eligible item with features.',
      ['itemId: UUID', 'features: Vector'],
      ['score(): Decimal'],
      ['intelligence'],
    ),
    classBlueprint(
      'RankingDecision',
      'entity',
      'Stores ordered candidates and decision context.',
      ['decisionId: UUID', 'modelVersion: String'],
      ['rank(): Candidate[]'],
      ['intelligence'],
    ),
    classBlueprint(
      'FeedbackSignal',
      'entity',
      'Records an eligible impression or interaction.',
      ['signalId: UUID', 'eventType: String'],
      ['record(): void'],
      ['intelligence'],
    ),
  ],
};

function parseClassMember(value: string, operation = false): DepthClassMember {
  const [name, ...typeParts] = value.split(':');
  return {
    visibility: operation ? '+' : '-',
    name: name.trim(),
    type: typeParts.join(':').trim() || (operation ? 'void' : 'String'),
  };
}

function makeClassModel(platform: PlatformSeed, seed: ScenarioSeed) {
  const productClasses = productClassCatalog[platform.id] ?? [];
  const root = productClasses[0]?.label;
  const selectedProduct = productClasses.filter(
    (item) =>
      seed.archetype === 'overview' ||
      item.label === root ||
      item.domains.includes(seed.archetype),
  );
  const additions = (archetypeClassCatalog[seed.archetype] ?? []).map((item) =>
    root && !item.owner ? { ...item, owner: root } : item,
  );
  const blueprints = [...selectedProduct, ...additions].filter(
    (item, index, values) =>
      values.findIndex((candidate) => candidate.label === item.label) === index,
  );
  const classes: DepthClass[] = blueprints.map((item, index) => ({
    id: `${platform.id}-${seed.id}-class-${slug(item.label)}`,
    label: item.label,
    stereotype: item.stereotype,
    tier: index < Math.min(6, blueprints.length) ? 1 : index < 10 ? 2 : 3,
    responsibility: item.responsibility,
    attributes: item.attributes.map((value) => parseClassMember(value)),
    operations: item.operations.map((value) => parseClassMember(value, true)),
    invariants: [
      `${item.label} keeps its own state valid before a public operation succeeds.`,
      item.stereotype === 'entity'
        ? 'Identity remains stable across state changes.'
        : 'The object does not own unrelated domain state.',
    ],
    confidence: index < selectedProduct.length ? 'observable' : 'conceptual',
  }));
  const byLabel = new Map(classes.map((item) => [item.label, item]));
  const relationships: DepthClassRelationship[] = [];
  blueprints.forEach((item) => {
    if (!item.owner) return;
    const source = byLabel.get(item.owner);
    const target = byLabel.get(item.label);
    if (!source || !target) return;
    relationships.push({
      source: source.id,
      target: target.id,
      type: item.relation ?? 'association',
      label:
        item.relation === 'composition'
          ? 'owns lifecycle'
          : item.relation === 'aggregation'
            ? 'groups or references'
            : 'uses or relates to',
      sourceMultiplicity: item.sourceMultiplicity ?? '1',
      targetMultiplicity: item.targetMultiplicity ?? '0..*',
      tier: Math.max(source.tier, target.tier) as 1 | 2 | 3,
      reason: `${source.label} ${item.relation === 'composition' ? 'controls the lifecycle of' : item.relation === 'aggregation' ? 'groups without fully owning' : 'is associated with'} ${target.label} in this scenario model.`,
    });
  });
  const serviceClasses: DepthClass[] = [
    {
      id: `${platform.id}-${seed.id}-class-${slug(seed.name)}-service`,
      label: `${seed.name} Service`,
      stereotype: 'service',
      tier: 2,
      responsibility: `Coordinates the ${seed.subject} use case without owning the domain entities.`,
      attributes: [],
      operations: [
        parseClassMember(`execute(request): ${seed.name}Result`, true),
      ],
      invariants: [
        'Coordinates work but does not become the source of domain truth.',
      ],
      confidence: 'conceptual',
    },
    {
      id: `${platform.id}-${seed.id}-class-repository`,
      label: `${seed.name} Repository`,
      stereotype: 'repository',
      tier: 3,
      responsibility:
        'Loads and saves aggregate state through a persistence boundary.',
      attributes: [],
      operations: [
        parseClassMember('findById(id): Aggregate', true),
        parseClassMember('save(aggregate): void', true),
      ],
      invariants: ['Persistence details stay outside domain entities.'],
      confidence: 'conceptual',
    },
  ];
  const serviceTarget = classes.find((item) => item.stereotype === 'entity');
  if (serviceTarget) {
    relationships.push({
      source: serviceClasses[0].id,
      target: serviceTarget.id,
      type: 'dependency',
      label: 'coordinates',
      sourceMultiplicity: '1',
      targetMultiplicity: '1..*',
      tier: 2,
      reason: `The service calls ${serviceTarget.label} behaviour but does not own the entity lifecycle.`,
    });
    relationships.push({
      source: serviceClasses[0].id,
      target: serviceClasses[1].id,
      type: 'dependency',
      label: 'persists through',
      sourceMultiplicity: '1',
      targetMultiplicity: '1',
      tier: 3,
      reason:
        'The service depends on a repository abstraction for persistence.',
    });
  }
  return {
    classes: [...classes, ...serviceClasses],
    classRelationships: relationships,
  };
}

function buildScenario(
  platform: PlatformSeed,
  seed: ScenarioSeed,
): DepthScenario {
  const baseActors = makeActors(platform, seed);
  const cases = makeCases(platform, seed, baseActors);
  const actors = promoteEssentialActors(baseActors, cases);
  const classModel = makeClassModel(platform, seed);
  return {
    ...seed,
    actors,
    cases,
    relationships:
      platform.id === 'instagram'
        ? makeInstagramRelationships(cases, actors)
        : makeRelationships(platform, cases, actors),
    architecture: architectureByType[seed.archetype],
    sequenceParticipants:
      platform.id === 'instagram'
        ? makeInstagramParticipants(seed)
        : makeProductParticipants(platform, seed, actors),
    sequence: makeSequence(seed, cases),
    ...classModel,
  };
}

export const depthPlatforms: DepthPlatform[] = expandedPlatformSeeds.map(
  (platform) => ({
    ...platform,
    scenarios: platform.scenarios.map((seed) => buildScenario(platform, seed)),
  }),
);

export function getDepthModel(scenarioModel: DepthScenario, depth: LabDepth) {
  const tier = depthOrder[depth];
  const actors = scenarioModel.actors.filter((item) => item.tier <= tier);
  const cases = scenarioModel.cases.filter((item) => item.tier <= tier);
  const visible = new Set([
    ...actors.map((item) => item.id),
    ...cases.map((item) => item.id),
  ]);
  return {
    actors,
    cases,
    relationships: scenarioModel.relationships.filter(
      (item) => visible.has(item.source) && visible.has(item.target),
    ),
    participants: scenarioModel.sequenceParticipants.filter(
      (item) => item.tier <= tier,
    ),
    classes: scenarioModel.classes.filter((item) => item.tier <= tier),
    classRelationships: scenarioModel.classRelationships.filter(
      (item) => item.tier <= tier,
    ),
  };
}
