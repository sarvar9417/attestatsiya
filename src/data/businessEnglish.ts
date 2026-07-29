// Business English — EnglishPath
// 30 vocabulary + 8 email template + 4 meeting dialogue

export interface BusinessWord {
  id: string
  english: string
  uzbek: string
  category: 'meeting' | 'negotiation' | 'email' | 'presentation' | 'finance'
  example: string
  level: 'B1' | 'B1+' | 'B2'
}

export interface EmailTemplate {
  id: string
  type: 'request' | 'complaint' | 'proposal' | 'follow-up' | 'apology' | 'invitation' | 'confirmation' | 'rejection'
  subject: string
  body: string
  keyPhrases: string[]
  level: 'B1' | 'B1+' | 'B2'
}

export interface MeetingDialogue {
  id: string
  title: string
  situation: string
  lines: { speaker: string; text: string; note?: string }[]
  keyPhrases: string[]
  level: 'B1' | 'B1+' | 'B2'
}

// ─── 30 ta Business Vocabulary ───────────────────────────────────────────────

export const BUSINESS_VOCABULARY: BusinessWord[] = [
  // Meeting
  { id: 'agenda',        english: 'agenda',        uzbek: 'kun tartibi',         category: 'meeting',      example: "Let's follow the agenda.", level: 'B1' },
  { id: 'minutes',       english: 'minutes',        uzbek: 'yig\'ilish bayonnomasi', category: 'meeting',   example: "Please take the minutes.", level: 'B1' },
  { id: 'deadline',      english: 'deadline',       uzbek: 'muddati',             category: 'meeting',      example: "The deadline is Friday.", level: 'B1' },
  { id: 'stakeholder',   english: 'stakeholder',    uzbek: 'manfaatdor tomon',    category: 'meeting',      example: "All stakeholders agreed.", level: 'B1+' },
  { id: 'follow-up',     english: 'follow-up',      uzbek: 'kuzatuv / davom',     category: 'meeting',      example: "I'll send a follow-up email.", level: 'B1' },
  { id: 'action-item',   english: 'action item',    uzbek: 'bajarish kerak bo\'lgan vazifa', category: 'meeting', example: "Add it as an action item.", level: 'B1+' },
  { id: 'consensus',     english: 'consensus',      uzbek: 'kelishuv / umumiy fikr', category: 'meeting',   example: "We reached a consensus.", level: 'B2' },
  // Negotiation
  { id: 'proposal',      english: 'proposal',       uzbek: 'taklif / loyiha',     category: 'negotiation',  example: "We have a new proposal.", level: 'B1' },
  { id: 'compromise',    english: 'compromise',     uzbek: 'murosaga kelish',     category: 'negotiation',  example: "Let's find a compromise.", level: 'B1' },
  { id: 'terms',         english: 'terms',          uzbek: 'shartlar',            category: 'negotiation',  example: "Review the terms carefully.", level: 'B1' },
  { id: 'counteroffer',  english: 'counteroffer',   uzbek: 'qarama-qarshi taklif', category: 'negotiation', example: "They made a counteroffer.", level: 'B1+' },
  { id: 'leverage',      english: 'leverage',       uzbek: 'ta\'sir kuchi / imkoniyat', category: 'negotiation', example: "Use your leverage wisely.", level: 'B2' },
  // Email
  { id: 'cc',            english: 'CC (carbon copy)', uzbek: 'nusxa yuborish',   category: 'email',        example: "I'll CC you on the email.", level: 'B1' },
  { id: 'attachment',    english: 'attachment',     uzbek: 'ilova',              category: 'email',        example: "Please find the attachment.", level: 'B1' },
  { id: 'regarding',     english: 'regarding',      uzbek: '...ga oid',          category: 'email',        example: "Regarding your request...", level: 'B1' },
  { id: 'asap',          english: 'ASAP (as soon as possible)', uzbek: 'imkon qadar tezroq', category: 'email', example: "Please reply ASAP.", level: 'B1' },
  { id: 'clarification', english: 'clarification',  uzbek: 'aniqlashtirish',     category: 'email',        example: "I need clarification.", level: 'B1' },
  // Presentation
  { id: 'overview',      english: 'overview',       uzbek: 'umumiy ko\'rinish',   category: 'presentation', example: "Here's a brief overview.", level: 'B1' },
  { id: 'key-point',     english: 'key point',      uzbek: 'asosiy nuqta',        category: 'presentation', example: "The key point is growth.", level: 'B1' },
  { id: 'elaborate',     english: 'elaborate',      uzbek: 'batafsil tushuntirmoq', category: 'presentation', example: "Could you elaborate?", level: 'B1+' },
  { id: 'Q&A',           english: 'Q&A session',    uzbek: 'savol-javob qismi',   category: 'presentation', example: "Now for the Q&A session.", level: 'B1' },
  { id: 'takeaway',      english: 'takeaway',       uzbek: 'xulosa / asosiy fikr', category: 'presentation', example: "The main takeaway is...", level: 'B1+' },
  { id: 'benchmark',     english: 'benchmark',      uzbek: 'taqqoslash mezoni',   category: 'presentation', example: "Industry benchmark shows 20%.", level: 'B2' },
  // Finance
  { id: 'budget',        english: 'budget',         uzbek: 'byudjet',             category: 'finance',      example: "We need to cut the budget.", level: 'B1' },
  { id: 'revenue',       english: 'revenue',        uzbek: 'daromad / tushum',    category: 'finance',      example: "Revenue increased by 15%.", level: 'B1' },
  { id: 'invoice',       english: 'invoice',        uzbek: 'hisob-faktura',       category: 'finance',      example: "Send the invoice by Friday.", level: 'B1' },
  { id: 'roi',           english: 'ROI (return on investment)', uzbek: 'investitsiya qaytimi', category: 'finance', example: "The ROI is 25%.", level: 'B1+' },
  { id: 'overhead',      english: 'overhead',       uzbek: 'umumiy xarajatlar',   category: 'finance',      example: "Reduce overhead costs.", level: 'B1+' },
  { id: 'forecast',      english: 'forecast',       uzbek: 'bashorat / prognoz',  category: 'finance',      example: "The forecast looks positive.", level: 'B1+' },
  { id: 'bottom-line',   english: 'bottom line',    uzbek: 'yakuniy natija / foyda', category: 'finance',  example: "The bottom line improved.", level: 'B2' },
]

// ─── 8 ta Email Template ──────────────────────────────────────────────────────

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'formal-request',
    type: 'request',
    subject: 'Request for Information / Meeting',
    body: `Dear [Name],

I hope this email finds you well. I am writing to request [information/a meeting] regarding [topic].

Could you please [provide/arrange] this at your earliest convenience? I would appreciate your response by [date].

Thank you for your time and assistance.

Kind regards,
[Your Name]`,
    keyPhrases: [
      'I hope this email finds you well.',
      'I am writing to request...',
      'at your earliest convenience',
      'I would appreciate your response by [date].',
    ],
    level: 'B1',
  },
  {
    id: 'proposal',
    type: 'proposal',
    subject: 'Business Proposal — [Project Name]',
    body: `Dear [Name],

Thank you for the opportunity to present our proposal for [project].

We propose the following approach:
1. [First step]
2. [Second step]
3. [Third step]

The estimated timeline is [duration] and the budget would be [amount].

We believe this partnership would be mutually beneficial. I would welcome the chance to discuss this further at your convenience.

Best regards,
[Your Name]`,
    keyPhrases: [
      'We propose the following approach',
      'mutually beneficial',
      'I would welcome the chance to discuss',
      'at your convenience',
    ],
    level: 'B1+',
  },
  {
    id: 'follow-up',
    type: 'follow-up',
    subject: 'Follow-up: [Previous Meeting/Email Topic]',
    body: `Dear [Name],

I am writing to follow up on our [meeting/conversation] on [date] regarding [topic].

As discussed, I wanted to confirm that:
• [Action item 1]
• [Action item 2]

Please let me know if you need any additional information or if anything has changed.

Looking forward to hearing from you.

Best regards,
[Your Name]`,
    keyPhrases: [
      'I am writing to follow up on...',
      'As discussed, I wanted to confirm that',
      'Please let me know if you need any additional information',
      'Looking forward to hearing from you',
    ],
    level: 'B1',
  },
  {
    id: 'complaint',
    type: 'complaint',
    subject: 'Complaint Regarding [Issue]',
    body: `Dear [Name/Customer Service],

I am writing to bring to your attention an issue with [product/service] that I purchased/used on [date].

The problem is as follows: [describe the issue clearly].

This has caused [inconvenience/loss] because [explain impact].

I would appreciate it if you could [proposed solution — refund/replacement/repair] within [timeframe].

I look forward to your prompt response.

Yours sincerely,
[Your Name]`,
    keyPhrases: [
      'I am writing to bring to your attention',
      'The problem is as follows',
      'I would appreciate it if you could',
      'I look forward to your prompt response',
    ],
    level: 'B1+',
  },
  {
    id: 'apology',
    type: 'apology',
    subject: 'Apology for [Issue]',
    body: `Dear [Name],

I sincerely apologise for [the issue/inconvenience] caused by [reason].

I understand that this has been [frustrating/inconvenient] for you, and I take full responsibility.

To resolve this matter, I will [action]. Additionally, [any compensation or further action].

I assure you that this will not happen again. Thank you for your patience and understanding.

Kind regards,
[Your Name]`,
    keyPhrases: [
      'I sincerely apologise for...',
      'I take full responsibility',
      'To resolve this matter',
      'I assure you that this will not happen again',
    ],
    level: 'B2',
  },
  {
    id: 'invitation',
    type: 'invitation',
    subject: 'Invitation to [Event Name]',
    body: `Dear [Name],

It is my pleasure to invite you to [event name] on [date] at [time], to be held at [venue/online platform].

The event will cover [brief agenda].

Please confirm your attendance by [RSVP date] by replying to this email.

We look forward to your participation.

Warm regards,
[Your Name]`,
    keyPhrases: [
      'It is my pleasure to invite you to',
      'Please confirm your attendance',
      'We look forward to your participation',
    ],
    level: 'B1',
  },
  {
    id: 'confirmation',
    type: 'confirmation',
    subject: 'Confirmation of [Meeting/Order/Agreement]',
    body: `Dear [Name],

This email confirms our [meeting/agreement] on [date] at [time].

To summarise what was agreed:
1. [Point 1]
2. [Point 2]

Please review and confirm that these details are correct. Should you have any queries, do not hesitate to contact me.

Kind regards,
[Your Name]`,
    keyPhrases: [
      'This email confirms...',
      'To summarise what was agreed',
      'Please review and confirm',
      'do not hesitate to contact me',
    ],
    level: 'B1',
  },
  {
    id: 'rejection',
    type: 'rejection',
    subject: 'Re: Your Application / Proposal',
    body: `Dear [Name],

Thank you for your [application/proposal/interest] in [position/project].

After careful consideration, we regret to inform you that we are unable to proceed with your [application/proposal] at this time due to [reason, if appropriate].

We appreciate the effort you put into this and encourage you to [apply again / stay in touch].

We wish you all the best in your future endeavours.

Kind regards,
[Your Name]`,
    keyPhrases: [
      'After careful consideration',
      'we regret to inform you that',
      'we are unable to proceed',
      'We wish you all the best in your future endeavours',
    ],
    level: 'B2',
  },
]

// ─── 4 ta Meeting Dialogue ────────────────────────────────────────────────────

export const MEETING_DIALOGUES: MeetingDialogue[] = [
  {
    id: 'project-kickoff',
    title: 'Project Kick-off Meeting',
    situation: 'A team is starting a new project. The manager opens the meeting.',
    level: 'B1',
    lines: [
      { speaker: 'Manager (Aziz)',    text: "Good morning, everyone. Let's get started. Dilnoza, could you please take the minutes?" },
      { speaker: 'Dilnoza',           text: 'Of course, I\'ll take notes throughout the meeting.' },
      { speaker: 'Manager (Aziz)',    text: 'Great. Today\'s agenda has three items: project goals, timeline, and responsibilities. First, let me give you an overview of the project.' },
      { speaker: 'Bobur',             text: 'Could you clarify the main objective? I want to make sure we\'re all on the same page.' },
      { speaker: 'Manager (Aziz)',    text: 'Absolutely. Our main goal is to launch the new platform by the end of Q2. The deadline is June 30th.' },
      { speaker: 'Malika',            text: 'That seems tight. Do we have enough resources?' },
      { speaker: 'Manager (Aziz)',    text: 'Good point. I\'ll allocate additional support. Bobur, can you lead the development team?' },
      { speaker: 'Bobur',             text: 'Yes, I can. I\'ll need a team of three developers.' },
      { speaker: 'Manager (Aziz)',    text: "Agreed. Let's move on to the timeline. Dilnoza will send the action items after the meeting." },
      { speaker: 'All',               text: 'Sounds good. Thank you.' },
    ],
    keyPhrases: [
      'Let\'s get started.',
      'Could you take the minutes?',
      'Let me give you an overview.',
      'Are we all on the same page?',
      'That seems tight.',
      'Let\'s move on to...',
    ],
  },
  {
    id: 'negotiation',
    title: 'Price Negotiation',
    situation: 'A buyer and a supplier are negotiating the price of a contract.',
    level: 'B1+',
    lines: [
      { speaker: 'Buyer (Sara)',      text: 'Thank you for meeting with us today. We\'ve reviewed your proposal and have some concerns about the pricing.' },
      { speaker: 'Supplier (John)',   text: 'I understand. Our pricing reflects the quality and the timeline you requested. What did you have in mind?' },
      { speaker: 'Buyer (Sara)',      text: 'We were expecting something closer to $45,000 rather than $60,000. That\'s a significant difference.' },
      { speaker: 'Supplier (John)',   text: 'I see your point. However, the $60,000 includes training and three months of support. Could you consider a longer contract term? That would allow us to reduce the price.' },
      { speaker: 'Buyer (Sara)',      text: 'A longer commitment is possible if the terms are right. What would you offer for a two-year contract?' },
      { speaker: 'Supplier (John)',   text: 'For a two-year agreement, we could bring it down to $50,000 annually, with payment terms of 30 days.' },
      { speaker: 'Buyer (Sara)',      text: 'That\'s closer to what we need. Could we also negotiate the payment terms to 45 days?' },
      { speaker: 'Supplier (John)',   text: 'We can do 45 days if we agree on a 5% penalty for late payments. Does that work?' },
      { speaker: 'Buyer (Sara)',      text: 'Let me consult with my team and get back to you by Thursday. I think we\'re close to an agreement.' },
      { speaker: 'Supplier (John)',   text: 'Perfect. I look forward to your response. I\'ll send a revised proposal this afternoon.' },
    ],
    keyPhrases: [
      'We have some concerns about the pricing.',
      'What did you have in mind?',
      'That\'s a significant difference.',
      'I see your point. However...',
      'Could you consider...?',
      'Let me consult with my team.',
      'I think we\'re close to an agreement.',
    ],
  },
  {
    id: 'brainstorming',
    title: 'Brainstorming Session',
    situation: 'A marketing team is brainstorming ideas for a new campaign.',
    level: 'B1',
    lines: [
      { speaker: 'Team Lead (Nilufar)', text: 'OK team, we need fresh ideas for our summer campaign. There are no bad ideas at this stage, so let\'s think outside the box.' },
      { speaker: 'Jasur',              text: 'What about partnering with local influencers? It worked really well for similar brands last year.' },
      { speaker: 'Kamola',             text: 'I like that idea. We could also create a hashtag challenge on social media to boost engagement.' },
      { speaker: 'Team Lead (Nilufar)', text: 'Both great suggestions. Jasur, could you elaborate on the influencer idea? What budget are we talking about?' },
      { speaker: 'Jasur',              text: 'Micro-influencers are cost-effective. We could reach a wide audience for around $5,000.' },
      { speaker: 'Timur',              text: 'That sounds reasonable. Building on Kamola\'s idea, we could tie the hashtag challenge to a contest with prizes.' },
      { speaker: 'Team Lead (Nilufar)', text: 'Excellent. Let\'s take these forward. The key takeaway is: influencer partnership plus social media challenge. I\'ll send a summary.' },
    ],
    keyPhrases: [
      'Think outside the box.',
      'There are no bad ideas.',
      'Could you elaborate on...?',
      'Building on that idea...',
      'The key takeaway is...',
    ],
  },
  {
    id: 'performance-review',
    title: 'Performance Review',
    situation: 'A manager conducts an annual performance review with an employee.',
    level: 'B2',
    lines: [
      { speaker: 'Manager (David)',    text: 'Thanks for coming in. This review covers the past year. Overall, your performance has been strong. How do you feel the year has gone?' },
      { speaker: 'Employee',  text: 'I think it\'s been a positive year. I successfully delivered the Q3 project ahead of schedule, and I\'ve improved my communication with the team.' },
      { speaker: 'Manager (David)',    text: 'That\'s exactly right — the Q3 project was a significant achievement. However, I\'d like to discuss an area for development: cross-departmental collaboration.' },
      { speaker: 'Employee',  text: 'I appreciate the feedback. I\'m aware that there were some communication gaps. I\'ve been working on that and have already set up regular catch-ups with the other teams.' },
      { speaker: 'Manager (David)',    text: 'That\'s a proactive approach. In terms of targets for next year, I\'d like you to take the lead on two major projects and mentor a junior colleague.' },
      { speaker: 'Employee',  text: 'I\'d welcome that responsibility. I\'m also looking to develop my project management skills. Would there be budget for a training course?' },
      { speaker: 'Manager (David)',    text: 'Absolutely. We can allocate budget for professional development. Let\'s set specific goals and check in quarterly.' },
      { speaker: 'Employee',  text: 'That sounds like a solid plan. Thank you for the constructive feedback.' },
    ],
    keyPhrases: [
      'How do you feel the year has gone?',
      'I\'d like to discuss an area for development.',
      'I appreciate the feedback.',
      'That\'s a proactive approach.',
      'constructive feedback',
      'Let\'s set specific goals.',
    ],
  },
]
