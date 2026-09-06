import type { CollectionConfig, Field } from 'payload'

/* =============================================================================
   REUSABLE FIELD BUILDERS
   Same spirit as the Allē Rewards component: every section gets its own
   show/className/backgroundColor/textColor controls, and every list that a
   user might want to reorder (nav links, chips, FAQs, steps, joints,
   conditions, team members...) is a Payload array field, which is natively
   drag-and-drop reorderable in the admin UI.
   ============================================================================= */

const sectionStyleFields = (defaultClassName = ''): Field[] => [
  { name: 'show', type: 'checkbox', label: 'Show Section', defaultValue: true },
  {
    name: 'className',
    type: 'text',
    label: 'Additional CSS Classes',
    defaultValue: defaultClassName,
  },
  {
    name: 'backgroundColor',
    type: 'text',
    label: 'Background Color',
    admin: { description: 'CSS color value (e.g. #FFFFFF, transparent)' },
  },
  { name: 'textColor', type: 'text', label: 'Text Color' },
]

const mediaGroup = (name: string, label: string, altDefault = ''): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'mobile', type: 'upload', relationTo: 'media', label: 'Mobile (≤420px)' },
    { name: 'tablet', type: 'upload', relationTo: 'media', label: 'Tablet (≤800px)' },
    { name: 'desktop', type: 'upload', relationTo: 'media', label: 'Desktop (≤1400px)' },
    { name: 'large', type: 'upload', relationTo: 'media', label: 'Large' },
    { name: 'alt', type: 'text', label: 'Alt Text', defaultValue: altDefault },
  ],
})

const richBlank = (name: string, label: string, description?: string): Field => ({
  name,
  type: 'richText',
  label,
  admin: description ? { description } : undefined,
})

const linksArray = (
  name: string,
  label: string,
  defaultValue: { label: string; url: string }[],
): Field => ({
  name,
  type: 'array',
  label,
  labels: { singular: 'Link', plural: 'Links' },
  admin: { description: 'Drag the ⠿ handle to reorder.' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'url', type: 'text', required: true },
  ],
  defaultValue,
})

const chipsArray = (name: string, label: string, items: string[]): Field => ({
  name,
  type: 'array',
  label,
  admin: { description: 'Drag to reorder.' },
  fields: [{ name: 'label', type: 'text', required: true }],
  defaultValue: items.map((label) => ({ label })),
})

const cardsArray = (
  name: string,
  label: string,
  items: { title: string; description: string }[],
): Field => ({
  name,
  type: 'array',
  label,
  admin: { description: 'Drag to reorder.' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
  ],
  defaultValue: items,
})

const statsArray = (items: { number: string; label: string }[]): Field => ({
  name: 'stats',
  type: 'array',
  label: 'Stats',
  admin: { description: 'Drag to reorder.' },
  fields: [
    { name: 'number', type: 'text', required: true },
    { name: 'label', type: 'textarea', required: true },
  ],
  defaultValue: items,
})

const faqArray = (items: { question: string; answer: string }[]): Field => ({
  name: 'faq',
  type: 'array',
  label: 'FAQ',
  admin: {
    description:
      'Drag to reorder. Answers are plain text (also used to generate FAQPage structured data).',
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
  ],
  defaultValue: items,
})

/** Numbered steps whose descriptions are short — kept as plain text with real defaults. */
const stepsArrayText = (
  items: { number: string; title: string; description: string }[],
): Field => ({
  name: 'steps',
  type: 'array',
  label: 'Steps',
  admin: { description: 'Drag to reorder.' },
  fields: [
    { name: 'number', type: 'text' },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
  ],
  defaultValue: items,
})

/** Numbered steps whose descriptions are longer clinical copy — rich text, left blank. */
const treatmentStepsArrayRich = (items: { number: string; title: string }[]): Field => ({
  name: 'treatmentSteps',
  type: 'array',
  label: 'Treatment Steps',
  admin: {
    description: 'Drag to reorder. Descriptions are rich text — add your copy in the editor.',
  },
  fields: [
    { name: 'number', type: 'text' },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'richText' },
  ],
  defaultValue: items,
})

const listArray = (name: string, label: string, items: string[]): Field => ({
  name,
  type: 'array',
  label,
  admin: { description: 'Drag to reorder.' },
  fields: [{ name: 'text', type: 'text', required: true }],
  defaultValue: items.map((text) => ({ text })),
})

const dlArray = (
  name: string,
  label: string,
  items: { term: string; description: string }[],
): Field => ({
  name,
  type: 'array',
  label,
  admin: { description: 'Drag to reorder.' },
  fields: [
    { name: 'term', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
  ],
  defaultValue: items,
})

const sectionOrderField = (label: string, options: { label: string; value: string }[]): Field => ({
  name: 'sectionOrder',
  type: 'array',
  label,
  admin: { description: 'Drag to set the order these sections render in on this page.' },
  fields: [{ name: 'section', type: 'select', required: true, options }],
  defaultValue: options.map((o) => ({ section: o.value })),
})

const ctaBandGroup = (
  name: string,
  defaults: { heading: string; text: string; buttonText: string },
): Field => ({
  name,
  type: 'group',
  label: 'CTA Band',
  fields: [
    ...sectionStyleFields(''),
    { name: 'heading', type: 'text', required: true, defaultValue: defaults.heading },
    { name: 'text', type: 'textarea', defaultValue: defaults.text },
    { name: 'buttonText', type: 'text', defaultValue: defaults.buttonText },
  ],
})

/* =============================================================================
   CONDITION PAGE BUILDER
   Every condition page (Carpal Tunnel, Knee Arthritis, Tennis Elbow, ...)
   shares one shape. Building defaults through a function keeps the six
   pre-populated entries below readable instead of six giant literals.
   ============================================================================= */

const conditionDefaults = (c: {
  slug: string
  eyebrow: string
  title: string
  joint: string
  category: string
  symptoms: string[]
  steps: { number: string; title: string }[]
  faq: { question: string; answer: string }[]
  related: string[]
}) => ({
  slug: c.slug,
  eyebrow: c.eyebrow,
  title: c.title,
  metaTitle: `${c.title} — Ortho & Spine`,
  heroButtonText: 'Call',
  atAGlance: {
    joint: c.joint,
    category: c.category,
    treatedWith: 'Injection, bracing, and a loading program — decided at your exam',
    visitNote: 'Exam and injection in one appointment where appropriate',
    costNote: '[Add your fee]',
    alsoTreatNote:
      'A wide range of other joint, tendon and injury problems — ask if yours is not listed',
  },
  symptomsHeading: 'You probably have this if',
  symptoms: c.symptoms.map((text) => ({ text })),
  symptomsFooter:
    'Recognize three or more? Call and describe it — we will tell you on the phone whether this is something we treat.',
  whatsHappeningTitle: "What's actually happening",
  treatmentHeading: 'How we treat it here',
  treatmentSteps: c.steps,
  treatmentDisclaimer:
    'Which of these applies to you is decided at your exam. Nothing here is a promise of a specific outcome, and no page can substitute for an evaluation.',
  faqHeading: 'What patients ask',
  faq: c.faq,
  relatedHeading: 'Other conditions we treat',
  related: c.related.map((slug) => ({ slug })),
  ctaHeading: 'Describe it on the phone first.',
  ctaText:
    'Two minutes tells you whether this is ours, and what it costs, before you book anything.',
  ctaButtonText: 'Call',
})

const conditionItemFields: Field[] = [
  {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    admin: { description: 'Used as the page anchor, e.g. "carpal-tunnel" → #carpal-tunnel' },
  },
  { name: 'eyebrow', type: 'text', label: 'Eyebrow (region · joint)' },
  { name: 'title', type: 'text', required: true, label: 'H1 / Page Title' },
  { name: 'metaTitle', type: 'text', label: 'Browser Tab Title' },
  richBlank('lede', 'Lede / Intro Paragraph'),
  { name: 'heroButtonText', type: 'text', defaultValue: 'Call' },
  {
    name: 'atAGlance',
    type: 'group',
    label: 'At A Glance Card',
    fields: [
      { name: 'joint', type: 'text' },
      { name: 'category', type: 'text' },
      { name: 'treatedWith', type: 'text' },
      { name: 'visitNote', type: 'text' },
      { name: 'costNote', type: 'text' },
      { name: 'alsoTreatNote', type: 'text' },
    ],
  },
  { name: 'symptomsHeading', type: 'text', defaultValue: 'You probably have this if' },
  {
    name: 'symptoms',
    type: 'array',
    label: 'Symptoms',
    admin: { description: 'Drag to reorder.' },
    fields: [{ name: 'text', type: 'text', required: true }],
  },
  { name: 'symptomsFooter', type: 'textarea' },
  { name: 'whatsHappeningTitle', type: 'text', defaultValue: "What's actually happening" },
  richBlank('whatsHappeningBody', "What's Actually Happening — Body"),
  { name: 'treatmentHeading', type: 'text', defaultValue: 'How we treat it here' },
  {
    name: 'treatmentSteps',
    type: 'array',
    label: 'Treatment Steps',
    admin: {
      description: 'Drag to reorder. Descriptions are rich text — add your copy in the editor.',
    },
    fields: [
      { name: 'number', type: 'text' },
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'richText' },
    ],
  },
  { name: 'treatmentDisclaimer', type: 'textarea' },
  { name: 'faqHeading', type: 'text', defaultValue: 'What patients ask' },
  {
    name: 'faq',
    type: 'array',
    label: 'FAQ',
    admin: { description: 'Drag to reorder. Also used for FAQPage structured data.' },
    fields: [
      { name: 'question', type: 'text', required: true },
      { name: 'answer', type: 'textarea', required: true },
    ],
  },
  { name: 'relatedHeading', type: 'text', defaultValue: 'Other conditions we treat' },
  {
    name: 'related',
    type: 'array',
    label: 'Related Conditions',
    admin: { description: 'Drag to reorder. Enter the "slug" of another condition in this list.' },
    fields: [{ name: 'slug', type: 'text', required: true }],
  },
  { name: 'ctaHeading', type: 'text' },
  { name: 'ctaText', type: 'textarea' },
  { name: 'ctaButtonText', type: 'text', defaultValue: 'Call' },
]

/* =============================================================================
   COLLECTION
   ============================================================================= */

export const OrthoSpinePageComponents: CollectionConfig = {
  slug: 'new-ortho-spine-page-component',
  admin: {
    useAsTitle: 'componentName',
    defaultColumns: ['componentName', 'updatedAt'],
    group: 'Components',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'componentName',
      type: 'text',
      required: true,
      defaultValue: 'Ortho & Spine Physicians Group — Page Component',
    },

    /* ---------------- Draft banner (delete before going live) ---------------- */
    {
      name: 'draftBanner',
      type: 'group',
      label: 'Draft Review Banner',
      fields: [
        { name: 'show', type: 'checkbox', label: 'Show Banner', defaultValue: true },
        { name: 'label', type: 'text', defaultValue: 'DRAFT FOR REVIEW' },
        {
          name: 'message',
          type: 'text',
          defaultValue:
            'Dashed underlines mark details still to be confirmed · Not published, not indexed by search engines',
        },
        { name: 'backgroundColor', type: 'text', defaultValue: '#2C3742' },
        { name: 'textColor', type: 'text', defaultValue: '#F2EFE9' },
        { name: 'accentColor', type: 'text', defaultValue: '#DCA945' },
      ],
    },

    /* ---------------- Global theme tokens ---------------- */
    {
      name: 'themeTokens',
      type: 'group',
      label: 'Theme Tokens (Global Colors & Type)',
      admin: { description: 'These map to the CSS custom properties used across every page.' },
      fields: [
        {
          name: 'colors',
          type: 'group',
          label: 'Colors',
          fields: [
            { name: 'ground', type: 'text', defaultValue: '#FFFFFF' },
            { name: 'surface', type: 'text', defaultValue: '#FFFFFF' },
            { name: 'surface2', type: 'text', label: 'Surface (Alt)', defaultValue: '#F6F5F2' },
            { name: 'ink', type: 'text', label: 'Ink (Headings)', defaultValue: '#232A32' },
            { name: 'ink2', type: 'text', label: 'Ink (Body)', defaultValue: '#454F5A' },
            { name: 'muted', type: 'text', defaultValue: '#78818C' },
            { name: 'line', type: 'text', defaultValue: '#E5E2DB' },
            { name: 'lineStrong', type: 'text', defaultValue: '#C7C1B7' },
            { name: 'primary', type: 'text', defaultValue: '#8F5A14' },
            { name: 'primaryHover', type: 'text', defaultValue: '#734710' },
            { name: 'primarySoft', type: 'text', defaultValue: '#F4E9D8' },
            { name: 'onPrimary', type: 'text', defaultValue: '#FFF8EC' },
            { name: 'gold', type: 'text', defaultValue: '#C2922F' },
            { name: 'slate', type: 'text', defaultValue: '#2C3742' },
            { name: 'teal', type: 'text', defaultValue: '#495A6B' },
            { name: 'tealSoft', type: 'text', defaultValue: '#E7EAEE' },
          ],
        },
        {
          name: 'typography',
          type: 'group',
          label: 'Typography',
          fields: [
            {
              name: 'headingFont',
              type: 'text',
              defaultValue: 'Newsreader, Georgia, "Times New Roman", serif',
            },
            {
              name: 'bodyFont',
              type: 'text',
              defaultValue:
                '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            },
            {
              name: 'monoFont',
              type: 'text',
              defaultValue: '"IBM Plex Mono", ui-monospace, monospace',
            },
            { name: 'h1FontSize', type: 'text', defaultValue: 'clamp(2.5rem, 5.6vw, 4.05rem)' },
            { name: 'h2FontSize', type: 'text', defaultValue: 'clamp(1.85rem, 3.4vw, 2.65rem)' },
            { name: 'h3FontSize', type: 'text', defaultValue: '1.32rem' },
            { name: 'bodyFontSize', type: 'text', defaultValue: '17px' },
            { name: 'bodyLineHeight', type: 'text', defaultValue: '1.62' },
          ],
        },
        {
          name: 'layout',
          type: 'group',
          label: 'Layout',
          fields: [
            { name: 'maxWidth', type: 'text', defaultValue: '1140px' },
            { name: 'radius', type: 'text', defaultValue: '14px' },
            { name: 'radiusSmall', type: 'text', defaultValue: '8px' },
          ],
        },
      ],
    },

    /* ---------------- Site-wide contact info (single source of truth) ---------------- */
    {
      name: 'siteContact',
      type: 'group',
      label: 'Site Contact Info',
      admin: {
        description: 'Used everywhere a phone number, address, or hours appear across the site.',
      },
      fields: [
        {
          name: 'companyName',
          type: 'text',
          defaultValue: 'Ortho & Spine Physicians Group',
          admin: { description: 'Used in logo alt text, aria-labels, and structured data.' },
        },
        { name: 'phoneDisplay', type: 'text', defaultValue: '[Phone]' },
        {
          name: 'phoneHref',
          type: 'text',
          defaultValue: '+10000000000',
          admin: { description: 'Digits only for tel: links, e.g. +14075551234' },
        },
        { name: 'email', type: 'text', defaultValue: '[Email]' },
        { name: 'fax', type: 'text', defaultValue: '[Fax]' },
        {
          name: 'faxNote',
          type: 'text',
          defaultValue: 'for attorney records requests',
          admin: { description: 'Short note shown next to the fax number.' },
        },
        {
          name: 'website',
          type: 'text',
          defaultValue: 'orthospinephysiciangroup.com',
        },
        {
          name: 'languagesNote',
          type: 'text',
          defaultValue: 'Spanish and Vietnamese assistance available',
        },
        {
          name: 'address',
          type: 'group',
          fields: [
            { name: 'street', type: 'text', defaultValue: '115 International Parkway' },
            { name: 'suite', type: 'text', defaultValue: '[###]' },
            { name: 'city', type: 'text', defaultValue: 'Lake Mary' },
            { name: 'state', type: 'text', defaultValue: 'FL' },
            { name: 'zip', type: 'text', defaultValue: '[ZIP]' },
          ],
        },
        {
          name: 'hours',
          type: 'group',
          fields: [
            { name: 'weekday', type: 'text', defaultValue: '[Mon–Fri, 0:00 – 0:00]' },
            { name: 'saturday', type: 'text', defaultValue: '[Saturday hours, if any]' },
          ],
        },
        {
          name: 'parkingNote',
          type: 'text',
          defaultValue: '[Free surface lot / garage — confirm]',
        },
        {
          name: 'mapEmbedUrl',
          type: 'text',
          admin: {
            description: 'Paste a Google Maps embed URL to replace the placeholder map graphic.',
          },
        },
        chipsArray('areasServed', 'Areas Served', [
          'Lake Mary',
          'Heathrow',
          'Longwood',
          'Sanford',
          'Winter Springs',
        ]),
      ],
    },

    /* ---------------- Top notice strip ---------------- */
    {
      name: 'noticeStrip',
      type: 'group',
      label: 'Top Notice Strip',
      fields: [
        { name: 'show', type: 'checkbox', defaultValue: true },
        { name: 'backgroundColor', type: 'text' },
        { name: 'textColor', type: 'text' },
        { name: 'accentColor', type: 'text', defaultValue: '#C2922F' },
        {
          name: 'items',
          type: 'array',
          label: 'Notice Items',
          admin: { description: 'Drag to reorder.' },
          fields: [
            { name: 'boldText', type: 'text', label: 'Bold Lead-in (optional)' },
            { name: 'text', type: 'text', required: true },
          ],
          defaultValue: [
            { boldText: 'Attorney referrals:', text: 'seen on a letter of protection' },
            { boldText: 'Everyone else:', text: 'self-pay, flat price quoted up front' },
            { text: 'We do not bill health insurance' },
          ],
        },
      ],
    },

    /* ---------------- Header ---------------- */
    {
      name: 'header',
      type: 'group',
      label: 'Header',
      fields: [
        mediaGroup('logo', 'Logo', 'Ortho & Spine Physicians Group'),
        {
          name: 'brandAriaLabel',
          type: 'text',
          defaultValue: 'Ortho & Spine Physicians Group — home',
          admin: { description: 'Accessible label read for the logo/home link.' },
        },
        linksArray('mainNav', 'Main Navigation', [
          { label: 'Home', url: '#home' },
          { label: 'About & Team', url: '#about' },
          { label: 'Services & Conditions', url: '#services' },
          { label: 'Visit Us', url: '#contact' },
        ]),
        { name: 'ctaButtonText', type: 'text', defaultValue: 'Call' },
        { name: 'backgroundColor', type: 'text' },
        { name: 'textColor', type: 'text' },
      ],
    },

    /* ============================= HOME PAGE ============================= */
    {
      name: 'homePage',
      type: 'group',
      label: 'Home Page',
      fields: [
        sectionOrderField('Section Order', [
          { label: 'Hero', value: 'hero' },
          { label: 'Stats Band', value: 'stats' },
          { label: 'Scope', value: 'scope' },
          { label: 'Payment', value: 'payment' },
          { label: 'Director Spotlight', value: 'director' },
          { label: 'For Attorneys & Referral Partners', value: 'attorneys' },
          { label: 'CTA Band', value: 'cta' },
        ]),
        {
          name: 'hero',
          type: 'group',
          label: 'Hero',
          fields: [
            ...sectionStyleFields('hero'),
            {
              name: 'eyebrow',
              type: 'text',
              defaultValue: '115 International Pkwy · Lake Mary, Florida',
            },
            { name: 'heading', type: 'text', defaultValue: 'If it hurts to move, start here.' },
            richBlank('lede', 'Lede'),
            { name: 'primaryButtonText', type: 'text', defaultValue: 'Call' },
            { name: 'secondaryButtonText', type: 'text', defaultValue: 'See what we treat' },
            { name: 'secondaryButtonUrl', type: 'text', defaultValue: '#services' },
            richBlank('note', 'Hero Note'),
            {
              name: 'card',
              type: 'group',
              label: 'How A Visit Works Card',
              fields: [
                { name: 'title', type: 'text', defaultValue: 'How a visit works' },
                {
                  name: 'subtitle',
                  type: 'text',
                  defaultValue: 'Most patients are in and out in one appointment.',
                },
                stepsArrayText([
                  {
                    number: '01',
                    title: 'Call and describe what hurts.',
                    description:
                      'We take the details, answer what we can, and tell you the visit fee. What treatment you need is decided at the evaluation.',
                  },
                  {
                    number: '02',
                    title: 'Evaluation.',
                    description:
                      'A focused exam of the area, the injury, and what is driving the pain — and a straight answer on whether we can help.',
                  },
                  {
                    number: '03',
                    title: 'Injection, same visit when appropriate.',
                    description: 'Performed in office. You walk out on your own.',
                  },
                  {
                    number: '04',
                    title: 'Follow-up.',
                    description: 'We check the response and adjust the plan if the pain returns.',
                  },
                ]),
              ],
            },
          ],
        },
        {
          name: 'statsBand',
          type: 'group',
          label: 'Stats Band',
          fields: [
            ...sectionStyleFields('tight'),
            statsArray([
              {
                number: 'Most',
                label:
                  'Joint, tendon, nerve and injury complaints — shoulder to ankle, hand to foot',
              },
              {
                number: '18+',
                label: 'Years of emergency medicine behind Dr. Young, our medical director',
              },
              {
                number: '1 visit',
                label: 'Evaluation and, where appropriate, treatment in the same appointment',
              },
              {
                number: 'LOP',
                label: 'Letters of protection accepted for attorney-referred injury clients',
              },
            ]),
          ],
        },
        {
          name: 'scope',
          type: 'group',
          label: 'Scope Section',
          fields: [
            ...sectionStyleFields(''),
            { name: 'eyebrow', type: 'text', defaultValue: 'Our scope' },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'If a joint, tendon or nerve is involved, we most likely treat it.',
            },
            richBlank('lede', 'Lede'),
            cardsArray('cards', 'Scope Cards', [
              {
                title: 'Joint injections',
                description:
                  'Corticosteroid and viscosupplementation injections placed in the joint space to bring down inflammation and restore range of motion — across large joints and small ones alike.',
              },
              {
                title: 'Soft-tissue & nerve',
                description:
                  "Carpal tunnel, tennis elbow, golfer's elbow, bursitis, trigger finger, tendinitis and the many other structures around a joint that mimic joint pain.",
              },
              {
                title: 'Acute injury',
                description:
                  'Sprains, gym strains, overuse from lifting or repetitive work, work injuries, and post-injury inflammation that has not settled on its own.',
              },
            ]),
            {
              name: 'footnote',
              type: 'textarea',
              defaultValue:
                'Do not rule yourself out. Most joint, tendon and injury complaints are worth a call. If the evaluation shows it is outside what we can help with, we will tell you and point you to the right place.',
            },
          ],
        },
        {
          name: 'payment',
          type: 'group',
          label: 'Payment Section',
          fields: [
            ...sectionStyleFields('band'),
            { name: 'eyebrow', type: 'text', defaultValue: 'Payment' },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Two ways to be seen. Neither goes through health insurance.',
            },
            richBlank('lede', 'Lede'),
            {
              name: 'tracks',
              type: 'array',
              label: 'Payment Tracks',
              admin: {
                description:
                  'Drag to reorder. "Track one" (attorney/LOP) typically links to the attorneys section.',
              },
              fields: [
                { name: 'eyebrow', type: 'text' },
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                {
                  name: 'accentColor',
                  type: 'text',
                  admin: { description: 'Left border color for this card.' },
                },
                { name: 'linkText', type: 'text' },
                { name: 'linkUrl', type: 'text' },
              ],
              defaultValue: [
                {
                  eyebrow: 'Track one',
                  title: 'Attorney referral — letter of protection',
                  description:
                    "Injury clients referred by a law firm are treated on an LOP, meaning no payment at the time of service while the case is pending. We coordinate directly with your attorney's office on scheduling, records and reports.",
                  accentColor: '#8F5A14',
                  linkText: 'How referrals work →',
                  linkUrl: '#sec-attorneys',
                },
                {
                  eyebrow: 'Track two',
                  title: 'Self-pay — flat price, quoted first',
                  description:
                    'No attorney, no case, just a joint that hurts? One flat fee per visit and per injection, given to you on the phone before you book. No deductible math, no prior authorization, no bill arriving six weeks later.',
                  accentColor: '#495A6B',
                },
              ],
            },
            cardsArray('cards', 'Payment Cards', [
              {
                title: 'No prior authorization',
                description:
                  'Nobody at an insurance company decides whether you get treated this week. If the evaluation says treatment is right and you agree, it happens.',
              },
              {
                title: "Your appointment isn't rationed",
                description:
                  'Without claim volume driving the schedule, visits run on clinical need rather than billing codes — which is how same-day appointments stay possible.',
              },
              {
                title: 'Transportation coordination',
                description:
                  'For injury clients who cannot get here, we help coordinate transportation so a missed ride does not become a gap in treatment.',
              },
            ]),
            {
              name: 'twoColCards',
              type: 'array',
              label: 'Payment Detail Cards',
              admin: { description: 'Drag to reorder.' },
              fields: [
                { name: 'title', type: 'text', required: true },
                richBlank('content', 'Content'),
              ],
              defaultValue: [
                { title: 'What we accept' },
                { title: 'Submitting to your own insurance' },
              ],
            },
            {
              name: 'disclaimer',
              type: 'textarea',
              defaultValue:
                'We are out of network with all health plans, including Medicare and Medicaid, and do not file claims on your behalf. Letters of protection apply to attorney-referred personal injury matters only and are accepted at our discretion. Confirm the arrangement that applies to you when you call.',
            },
          ],
        },
        {
          name: 'director',
          type: 'group',
          label: 'Director Spotlight',
          fields: [
            ...sectionStyleFields(''),
            { name: 'eyebrow', type: 'text', defaultValue: 'Meet our medical director' },
            { name: 'name', type: 'text', defaultValue: 'Dr. James Young, DO' },
            richBlank('bio', 'Bio'),
            listArray('credentials', 'Credentials', [
              'Board Certified — Family Medicine (ABOFP)',
              '18+ Years Emergency Medicine',
              'Lake Mary since 2008',
            ]),
            mediaGroup('portrait', 'Portrait', 'Dr. James Young, DO, Medical Director'),
          ],
        },
        {
          name: 'attorneys',
          type: 'group',
          label: 'For Attorneys & Referral Partners',
          fields: [
            ...sectionStyleFields('band'),
            { name: 'eyebrow', type: 'text', defaultValue: 'For attorneys & referral partners' },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Personal injury medical support for legal teams',
            },
            richBlank('lede', 'Lede'),
            {
              name: 'whyRefer',
              type: 'group',
              label: 'Why Firms Refer To Us',
              fields: [
                { name: 'title', type: 'text', defaultValue: 'Why firms refer to us' },
                listArray('items', 'List Items', [
                  'Priority scheduling for injury clients',
                  'Same-day appointments when available',
                  'Transportation coordination to reduce barriers to care',
                  'Organized documentation for referral partners',
                  'Dedicated personal injury case coordination',
                  'Spanish and Vietnamese assistance available',
                ]),
              ],
            },
            {
              name: 'coordination',
              type: 'group',
              label: 'Attorney-Focused Coordination',
              fields: [
                { name: 'title', type: 'text', defaultValue: 'Attorney-focused coordination' },
                listArray('items', 'List Items', [
                  'Responsive scheduling for injury clients',
                  'Coordinated treatment communication',
                  'Orthopedic, spine, nerve and soft-tissue evaluations',
                  'Clear records and reports for referral partners',
                ]),
                {
                  name: 'note',
                  type: 'textarea',
                  defaultValue:
                    'All care is coordinated in one place — from evaluation and treatment planning to pain management options and surgical procedures when needed — so clients receive streamlined support under one roof.',
                },
              ],
            },
            {
              name: 'facilityShot',
              type: 'group',
              label: 'Facility Photo',
              fields: [
                mediaGroup(
                  'image',
                  'Image',
                  'Operating room at Ortho & Spine Physicians Group, Lake Mary',
                ),
                {
                  name: 'caption',
                  type: 'textarea',
                  defaultValue:
                    'Our own operating room in Lake Mary — evaluation through surgery handled in one place, so a client is not routed to a separate facility mid-case.',
                },
              ],
            },
            {
              name: 'referral',
              type: 'group',
              label: 'Send Us A Client (CTA)',
              fields: [
                { name: 'eyebrow', type: 'text', defaultValue: 'Referral information' },
                { name: 'heading', type: 'text', defaultValue: 'Send us a client' },
                {
                  name: 'text',
                  type: 'textarea',
                  defaultValue:
                    'Ortho & Spine Physicians Group — premium personal injury medical services. Injury clients are seen on a letter of protection.',
                },
                dlArray('details', 'Details', [
                  { term: 'Phone', description: '[Phone]' },
                  { term: 'Fax', description: '[Fax] — for attorney records requests' },
                  { term: 'Address', description: '115 International Pkwy, Lake Mary, FL [ZIP]' },
                  { term: 'Web', description: 'orthospinephysiciangroup.com' },
                  { term: 'Languages', description: 'Spanish and Vietnamese assistance available' },
                  {
                    term: 'To refer',
                    description: '[Attach referral form, QR code, or scheduling link]',
                  },
                ]),
                { name: 'buttonText', type: 'text', defaultValue: 'Call intake' },
              ],
            },
          ],
        },
        ctaBandGroup('ctaBand', {
          heading: 'Injured, or just still hurting?',
          text: 'Attorneys: call intake and we will schedule your client. Everyone else: describe what hurts and we will tell you the fee before you book.',
          buttonText: 'Call',
        }),
      ],
    },

    /* ============================= ABOUT PAGE ============================= */
    {
      name: 'aboutPage',
      type: 'group',
      label: 'About & Team Page',
      fields: [
        sectionOrderField('Section Order', [
          { label: 'Intro', value: 'intro' },
          { label: 'A First Visit', value: 'firstVisit' },
          { label: 'Team', value: 'team' },
        ]),
        linksArray('jumpLinks', 'On-Page Jump Links', [
          { label: 'A first visit', url: '#sec-firstvisit' },
          { label: 'Medical director & team', url: '#sec-team' },
        ]),
        {
          name: 'intro',
          type: 'group',
          label: 'Intro',
          fields: [
            ...sectionStyleFields(''),
            { name: 'eyebrow', type: 'text', defaultValue: 'About us' },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Broad care, decided at the evaluation',
            },
            richBlank(
              'content',
              'Opening Paragraph',
              'Why the practice opened in Lake Mary, and the range of care handled here.',
            ),
            cardsArray('cards', 'Cards', [
              {
                title: 'Emergency-trained judgment',
                description:
                  'Eighteen years of emergency medicine teaches you to sort the urgent from the merely painful quickly. That instinct shapes how every complaint here gets evaluated, whatever the joint.',
              },
              {
                title: 'One appointment, not five',
                description:
                  "Exam, diagnosis and, when appropriate, the injection itself in a single visit. We schedule so your time isn't spent in a waiting room.",
              },
              {
                title: 'Conservative before invasive',
                description:
                  "If a joint will settle with bracing, rest, and a home program, that's what we recommend. The needle is a tool, not a default.",
              },
            ]),
          ],
        },
        {
          name: 'firstVisit',
          type: 'group',
          label: 'A First Visit',
          fields: [
            ...sectionStyleFields('band'),
            { name: 'eyebrow', type: 'text', defaultValue: 'Our approach' },
            { name: 'heading', type: 'text', defaultValue: 'What a first visit is actually like' },
            richBlank('lede', 'Lede'),
            {
              name: 'note',
              type: 'textarea',
              defaultValue:
                "Bring a list of current medications and any prior imaging of the joint. No insurance card needed — we don't bill insurance.",
            },
            { name: 'faqTitle', type: 'text', defaultValue: 'Frequently asked' },
            dlArray('faqItems', 'FAQ Items', [
              {
                term: 'Does it hurt',
                description:
                  'A numbing agent is used first. Most patients describe pressure more than pain.',
              },
              {
                term: 'How fast',
                description: 'Corticosteroid relief typically begins within a few days.',
              },
              {
                term: 'How long',
                description: 'Varies by joint and diagnosis — weeks to several months.',
              },
              {
                term: 'Insurance',
                description:
                  "We don't bill health insurance. Attorney-referred injury clients are seen on a letter of protection; everyone else is self-pay.",
              },
              {
                term: 'What it costs',
                description:
                  'A flat fee per visit and per injection, quoted before you book. [Add the actual figures.]',
              },
              {
                term: 'Referral',
                description: 'None needed. Self-pay means you can book directly.',
              },
            ]),
          ],
        },
        {
          name: 'team',
          type: 'group',
          label: 'Team',
          fields: [
            ...sectionStyleFields(''),
            { name: 'eyebrow', type: 'text', defaultValue: 'Our team' },
            { name: 'heading', type: 'text', defaultValue: "The people who'll be treating you" },
            {
              name: 'lede',
              type: 'textarea',
              defaultValue: 'A small team, which is the point — you see the same faces each visit.',
            },
            {
              name: 'director',
              type: 'group',
              label: 'Medical Director (Full Bio)',
              fields: [
                { name: 'name', type: 'text', defaultValue: 'Dr. James Young, DO' },
                { name: 'role', type: 'text', defaultValue: 'Medical Director' },
                richBlank('bio', 'Full Bio (multiple paragraphs)'),
                listArray('credentials', 'Credentials', [
                  'Board Certified — Family Medicine (ABOFP)',
                  '18+ Years Emergency Medicine',
                  'Lake Mary since 2008',
                ]),
                dlArray('education', 'Education & Background', [
                  {
                    term: 'Board certification',
                    description:
                      'Family Medicine — American Board of Osteopathic Family Physicians (ABOFP)',
                  },
                  {
                    term: 'Leadership',
                    description:
                      "Stroke Director and Sepsis Director, Florida Hospital Memorial · Director of Emergency Medicine, Bluegrass Community Hospital · Medical Director, Goldfinger's Aesthetics (2011–present)",
                  },
                  {
                    term: 'Education',
                    description:
                      '[College of Osteopathic Medicine — confirm school and year]\nResidency, Family Medicine — [confirm program]\nBS Clinical Laboratory Science, University of Louisville',
                  },
                  {
                    term: 'Community',
                    description:
                      'Special Olympics, Rotary Club, and The Blatantly Honest Foundation',
                  },
                ]),
                mediaGroup('portrait', 'Portrait', 'Dr. James Young, DO, Medical Director'),
              ],
            },
            {
              name: 'teamMembers',
              type: 'array',
              label: 'Additional Team Members',
              admin: { description: 'Drag to reorder.' },
              fields: [
                { name: 'firstName', type: 'text', required: true },
                { name: 'lastNamePlaceholder', type: 'text' },
                { name: 'titlePlaceholder', type: 'text' },
                { name: 'bio', type: 'textarea' },
                mediaGroup('portrait', 'Portrait', ''),
              ],
              defaultValue: [
                {
                  firstName: 'Drew',
                  lastNamePlaceholder: '[last name]',
                  titlePlaceholder: '[Title / credentials]',
                  bio: 'Bio coming soon.',
                },
                {
                  firstName: 'McClure',
                  lastNamePlaceholder: '[last name]',
                  titlePlaceholder: '[Title / credentials]',
                  bio: 'Bio coming soon.',
                },
                {
                  firstName: 'Nilam',
                  lastNamePlaceholder: '[last name]',
                  titlePlaceholder: '[Title / credentials]',
                  bio: 'Bio coming soon.',
                },
                {
                  firstName: 'Olena',
                  lastNamePlaceholder: '[last name]',
                  titlePlaceholder: '[Title / credentials]',
                  bio: 'Bio coming soon.',
                },
              ],
            },
            {
              name: 'disclaimer',
              type: 'textarea',
              defaultValue:
                'Titles, credentials, and bios for the team below are placeholders awaiting your copy — nothing on this page should go live until each person has confirmed their own listing.',
            },
          ],
        },
      ],
    },

    /* ============================= SERVICES PAGE ============================= */
    {
      name: 'servicesPage',
      type: 'group',
      label: 'Services & Conditions Page',
      fields: [
        sectionOrderField('Section Order', [
          { label: 'Interactive Joint Map', value: 'jointMap' },
          { label: 'Breadth of Coverage', value: 'breadth' },
          { label: 'Specialty Services', value: 'specialty' },
          { label: 'Our Facility', value: 'facility' },
          { label: 'Advanced Treatment Options', value: 'advanced' },
          { label: 'How We Treat', value: 'howWeTreat' },
          { label: 'Condition Stories', value: 'conditionStories' },
          { label: 'Not Sure We Treat It?', value: 'scope' },
          { label: 'Condition Index', value: 'conditionIndex' },
        ]),
        linksArray('jumpLinks', 'On-Page Jump Links', [
          { label: 'Areas we cover', url: '#sec-breadth' },
          { label: 'Specialty services', url: '#sec-specialty' },
          { label: 'Our facility', url: '#sec-facility' },
          { label: 'Advanced options', url: '#sec-advanced' },
          { label: 'How we treat', url: '#sec-howwetreat' },
          { label: 'Conditions we see', url: '#sec-conditions' },
          { label: 'Not sure we treat it?', url: '#sec-scope' },
          { label: 'Condition pages', url: '#sec-index' },
        ]),
        {
          name: 'jointMap',
          type: 'group',
          label: 'Interactive Joint Map',
          fields: [
            ...sectionStyleFields(''),
            { name: 'eyebrow', type: 'text', defaultValue: 'Services' },
            { name: 'heading', type: 'text', defaultValue: 'The areas we treat' },
            {
              name: 'lede',
              type: 'textarea',
              defaultValue:
                'Select a joint on the figure or in the list to see what we treat there and how. This covers the areas we see most — it is not the full extent of what we handle, and smaller joints, hands, feet and soft-tissue problems are treated here too.',
            },
            { name: 'figureCaption', type: 'text', defaultValue: 'Injectable sites' },
            {
              name: 'figurePoints',
              type: 'array',
              label: 'Anatomy Diagram Dots (Advanced)',
              admin: {
                description:
                  'Fine-tune the (x,y) position of each dot on the 200×400 anatomy SVG. "joint" must match a Joint id below.',
              },
              fields: [
                { name: 'joint', type: 'text', required: true },
                { name: 'cx', type: 'number', required: true },
                { name: 'cy', type: 'number', required: true },
              ],
              defaultValue: [
                { joint: 'shoulder', cx: 62, cy: 80 },
                { joint: 'shoulder', cx: 138, cy: 80 },
                { joint: 'elbow', cx: 44, cy: 140 },
                { joint: 'elbow', cx: 156, cy: 140 },
                { joint: 'wrist', cx: 36, cy: 194 },
                { joint: 'wrist', cx: 164, cy: 194 },
                { joint: 'hip', cx: 74, cy: 196 },
                { joint: 'hip', cx: 126, cy: 196 },
                { joint: 'knee', cx: 70, cy: 276 },
                { joint: 'knee', cx: 130, cy: 276 },
                { joint: 'ankle', cx: 68, cy: 350 },
                { joint: 'ankle', cx: 132, cy: 350 },
              ],
            },
            {
              name: 'joints',
              type: 'array',
              label: 'Joints',
              admin: {
                description:
                  'Drag to reorder — this also sets tab order. "id" must be unique and match the Anatomy Diagram Dots above.',
              },
              fields: [
                { name: 'id', type: 'text', required: true },
                { name: 'name', type: 'text', required: true },
                { name: 'region', type: 'text' },
                richBlank('body', 'What We Treat Here'),
                {
                  name: 'treats',
                  type: 'array',
                  label: 'Treated Here (Chips)',
                  fields: [{ name: 'label', type: 'text', required: true }],
                },
              ],
              defaultValue: [
                {
                  id: 'knee',
                  name: 'Knee',
                  region: 'Lower extremity',
                  treats: [
                    'Osteoarthritis',
                    'Post-injury swelling',
                    'Meniscal irritation',
                    'Prepatellar bursitis',
                    'Gym & running overuse',
                  ].map((label) => ({ label })),
                },
                {
                  id: 'shoulder',
                  name: 'Shoulder',
                  region: 'Upper extremity',
                  treats: [
                    'Rotator cuff irritation',
                    'Subacromial bursitis',
                    'Impingement',
                    'Posterior shoulder pain',
                    'Shoulder arthritis',
                  ].map((label) => ({ label })),
                },
                {
                  id: 'hip',
                  name: 'Hip',
                  region: 'Lower extremity',
                  treats: [
                    'Hip osteoarthritis',
                    'Trochanteric bursitis',
                    'Lateral hip pain',
                    'Gluteal tendinopathy',
                  ].map((label) => ({ label })),
                },
                {
                  id: 'elbow',
                  name: 'Elbow',
                  region: 'Upper extremity',
                  treats: [
                    'Tennis elbow · lateral epicondylitis',
                    "Golfer's elbow · medial epicondylitis",
                    'Olecranon bursitis',
                    'Elbow arthritis',
                  ].map((label) => ({ label })),
                },
                {
                  id: 'wrist',
                  name: 'Wrist & Hand',
                  region: 'Upper extremity · nerve',
                  treats: [
                    'Carpal tunnel syndrome',
                    'Wrist arthritis',
                    "De Quervain's tenosynovitis",
                    'Trigger finger',
                    'Repetitive-use strain',
                  ].map((label) => ({ label })),
                },
                {
                  id: 'ankle',
                  name: 'Ankle & Foot',
                  region: 'Lower extremity',
                  treats: [
                    'Post-sprain inflammation',
                    'Ankle arthritis',
                    'Tendinitis',
                    'Overuse from running or standing',
                  ].map((label) => ({ label })),
                },
              ],
            },
          ],
        },
        {
          name: 'breadth',
          type: 'group',
          label: 'Breadth of Coverage',
          fields: [
            ...sectionStyleFields('band'),
            { name: 'eyebrow', type: 'text', defaultValue: 'Coverage' },
            { name: 'heading', type: 'text', defaultValue: 'Most areas, most complaints' },
            {
              name: 'lede',
              type: 'textarea',
              defaultValue:
                'The figure above shows the major joints. In practice the range is wider — small joints, soft tissue, nerve compression and post-injury problems across the body. If what hurts is not on this list, it is still worth asking.',
            },
            chipsArray('chips', 'Chips', [
              'Shoulder',
              'Elbow',
              'Wrist',
              'Hand & fingers',
              'Hip',
              'Knee',
              'Ankle',
              'Foot',
              'Bursae',
              'Tendons & tendon sheaths',
              'Nerve compression',
              'Ligament & sprain injury',
              'Arthritis & joint wear',
              'Overuse & repetitive strain',
              'Gym, sport & work injury',
              'Post-injury inflammation',
              'Swelling & stiffness',
              'Unresolved pain after an injury',
            ]),
            {
              name: 'footnote',
              type: 'textarea',
              defaultValue:
                'Not an exhaustive list. Coverage for your specific problem is confirmed at your evaluation.',
            },
          ],
        },
        {
          name: 'specialty',
          type: 'group',
          label: 'Specialty Services',
          fields: [
            ...sectionStyleFields('band'),
            { name: 'eyebrow', type: 'text', defaultValue: 'Specialty services' },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Beyond injections, when the injury needs it',
            },
            {
              name: 'lede',
              type: 'textarea',
              defaultValue:
                'Evaluation and treatment planning coordinated in one place — so a client is not sent across town to start over with each specialty.',
            },
            {
              name: 'specialties',
              type: 'array',
              label: 'Specialties',
              admin: { description: 'Drag to reorder.' },
              fields: [
                { name: 'title', type: 'text', required: true },
                {
                  name: 'items',
                  type: 'array',
                  label: 'List Items',
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
              ],
              defaultValue: [
                {
                  title: 'Orthopedic Surgery',
                  items: [
                    'Fracture and joint injury evaluation',
                    'Image-guided injection options',
                  ].map((text) => ({ text })),
                },
                {
                  title: 'Neurosurgery',
                  items: [
                    'Spine trauma and nerve injury evaluation',
                    'Surgical and non-surgical pathways',
                  ].map((text) => ({ text })),
                },
                {
                  title: 'Plastic Surgery',
                  items: [
                    'Scar revision and wound care consultation',
                    'Reconstructive procedure options',
                  ].map((text) => ({ text })),
                },
                {
                  title: 'Pain Management',
                  items: [
                    'Targeted pain evaluation and treatment planning',
                    'Injection-based options for spine and joint pain',
                  ].map((text) => ({ text })),
                },
              ],
            },
          ],
        },
        {
          name: 'facility',
          type: 'group',
          label: 'Our Facility',
          fields: [
            ...sectionStyleFields('band'),
            { name: 'eyebrow', type: 'text', defaultValue: 'Our facility' },
            { name: 'heading', type: 'text', defaultValue: 'A real surgical suite, on site' },
            {
              name: 'lede',
              type: 'textarea',
              defaultValue:
                'Procedures are performed in our own operating room — anesthesia, electrosurgical and monitoring equipment in place — rather than referred out to a facility that has to schedule your client separately.',
            },
            {
              name: 'shots',
              type: 'array',
              label: 'Facility Photos',
              admin: { description: 'Drag to reorder.' },
              fields: [mediaGroup('image', 'Image', '')],
              defaultValue: [
                {
                  image: {
                    alt: 'Operating room at Ortho & Spine Physicians Group, Lake Mary — surgical table, overhead lights and electrosurgical unit',
                  },
                },
                {
                  image: {
                    alt: 'Second view of the operating room showing anesthesia equipment and monitoring',
                  },
                },
              ],
            },
            {
              name: 'caption',
              type: 'textarea',
              defaultValue:
                'Our operating room in Lake Mary. Equipped for the procedures described on this page; specific procedures depend on your evaluation and the treating specialist.',
            },
          ],
        },
        {
          name: 'advanced',
          type: 'group',
          label: 'Advanced Treatment Options',
          fields: [
            ...sectionStyleFields('band'),
            { name: 'eyebrow', type: 'text', defaultValue: 'Advanced treatment options' },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'What we can bring to a stubborn injury',
            },
            cardsArray('cards', 'Cards', [
              {
                title: 'PRP — platelet-rich plasma therapy',
                description:
                  "PRP uses a small sample of the patient's own blood, concentrated with platelets, to support the body's natural healing response in injured joints, tendons, ligaments and soft tissue.",
              },
              {
                title: 'Targeted pain management injections',
                description:
                  'Treatment aimed directly at the source of pain, using guided injection options to help reduce inflammation, improve comfort and support recovery after an injury.',
              },
              {
                title: 'Focused care for spine, joint and nerve concerns',
                description:
                  'Evaluation designed to identify the source of pain or weakness, then guide treatment options intended to improve function, reduce discomfort and support recovery.',
              },
              {
                title: 'Individualized treatment planning',
                description:
                  "Each care plan is tailored to the patient's injury, symptoms, imaging findings and recovery goals.",
              },
            ]),
            {
              name: 'disclaimer',
              type: 'textarea',
              defaultValue:
                'Availability of a given procedure depends on your evaluation and, where surgery is involved, on the treating specialist. Nothing here is a promise of a specific outcome.',
            },
          ],
        },
        {
          name: 'howWeTreat',
          type: 'group',
          label: 'How We Treat',
          fields: [
            ...sectionStyleFields('band'),
            { name: 'eyebrow', type: 'text', defaultValue: 'How we treat' },
            { name: 'heading', type: 'text', defaultValue: 'Three tools, used in order' },
            cardsArray('cards', 'Cards', [
              {
                title: 'Corticosteroid injection',
                description:
                  'The workhorse for acute inflammation. Placed directly at the source to quiet swelling and give the joint room to move again — often within a few days.',
              },
              {
                title: 'Viscosupplementation',
                description:
                  'Gel-like hyaluronic acid injections used mainly in arthritic knees, to cushion a joint that has lost its own lubrication. A course of injections rather than a single shot.',
              },
              {
                title: 'Conservative first',
                description:
                  "Bracing, activity modification and a home program. If a joint will settle without a needle, that's the plan we start with.",
              },
            ]),
            {
              name: 'disclaimer',
              type: 'textarea',
              defaultValue:
                'Treatment choice depends on the joint, the diagnosis, and your medical history. Nothing here is a promise of a specific outcome — your options are decided at your visit.',
            },
          ],
        },
        {
          name: 'conditionStories',
          type: 'group',
          label: 'Condition Stories',
          fields: [
            ...sectionStyleFields(''),
            { name: 'eyebrow', type: 'text', defaultValue: 'What we treat' },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Conditions, by how they usually start',
            },
            {
              name: 'lede',
              type: 'textarea',
              defaultValue:
                'Most of what walks through our door falls into one of four stories. These are examples, not a checklist — if yours is not named here, it is still worth the call.',
            },
            {
              name: 'stories',
              type: 'array',
              label: 'Stories',
              admin: { description: 'Drag to reorder.' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                {
                  name: 'chips',
                  type: 'array',
                  fields: [{ name: 'label', type: 'text', required: true }],
                },
              ],
              defaultValue: [
                {
                  title: 'It started at the gym',
                  description:
                    'Strains from lifting, pressing, or adding weight too fast. Shoulders and elbows lead the list, knees close behind.',
                  chips: [
                    'Gym & lifting strain',
                    'Rotator cuff irritation',
                    'Overuse tendinitis',
                    'Knee & ankle sprain',
                  ].map((label) => ({ label })),
                },
                {
                  title: "It's from the same motion, every day",
                  description:
                    'Repetitive-use injuries from work, keyboards, tools, or a racquet. These build slowly and rarely resolve on their own.',
                  chips: [
                    'Carpal tunnel syndrome',
                    'Tennis elbow · lateral epicondylitis',
                    "Golfer's elbow · medial epicondylitis",
                    'Trigger finger & tendon irritation',
                  ].map((label) => ({ label })),
                },
                {
                  title: "It's been aching for years",
                  description:
                    "Wear-and-tear pain that's gotten loud enough to change how you walk, sleep, or climb stairs.",
                  chips: [
                    'Knee osteoarthritis',
                    'Hip arthritis & bursitis',
                    'Shoulder arthritis',
                    'Chronic joint stiffness',
                  ].map((label) => ({ label })),
                },
                {
                  title: 'Something happened',
                  description:
                    "A fall, a twist, a collision. The acute event is over, but the inflammation and stiffness haven't left with it.",
                  chips: [
                    'Post-injury inflammation',
                    'Sprains & soft-tissue injury',
                    'Bursitis',
                    'Posterior shoulder pain',
                  ].map((label) => ({ label })),
                },
              ],
            },
          ],
        },
        {
          name: 'scopeCallout',
          type: 'group',
          label: 'Not Sure We Treat It?',
          fields: [
            ...sectionStyleFields('band'),
            { name: 'eyebrow', type: 'text', defaultValue: 'Not sure we treat it?' },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Assume yes, and let the evaluation decide',
            },
            richBlank(
              'content',
              'Content',
              'Original copy references "the wider Ortho & Spine Physicians Group" — keep that phrasing.',
            ),
            {
              name: 'emergencyNote',
              type: 'textarea',
              defaultValue:
                "If you're experiencing a medical emergency, chest pain, or a suspected fracture or dislocation, call 911 or go to the nearest emergency department.",
            },
          ],
        },
        {
          name: 'conditionIndex',
          type: 'group',
          label: 'Condition Index',
          fields: [
            ...sectionStyleFields('band'),
            { name: 'eyebrow', type: 'text', defaultValue: 'In detail' },
            { name: 'heading', type: 'text', defaultValue: 'A few of the conditions, in detail' },
            {
              name: 'lede',
              type: 'textarea',
              defaultValue:
                'Symptoms, what is actually going on in the joint, and how we treat it. These are some of the most common reasons people come in — a sample of our work, not the boundary of it.',
            },
            {
              name: 'extraCard',
              type: 'group',
              label: '"Not Listed Here?" Card',
              fields: [
                { name: 'region', type: 'text', defaultValue: 'Anything else' },
                { name: 'title', type: 'text', defaultValue: 'Not listed here?' },
                { name: 'linkText', type: 'text', defaultValue: 'Call and ask' },
              ],
            },
          ],
        },
        ctaBandGroup('ctaBand', {
          heading: "Describe the joint. We'll tell you if it's ours.",
          text: 'A two-minute phone call saves a wasted appointment.',
          buttonText: 'Call',
        }),
      ],
    },

    /* ============================= CONDITIONS (shared shape) ============================= */
    {
      name: 'conditions',
      type: 'array',
      label: 'Condition Pages',
      admin: {
        description:
          'Drag to reorder. This order also drives the Condition Index cards on the Services page and the site navigation for condition pages.',
      },
      fields: conditionItemFields,
      defaultValue: [
        conditionDefaults({
          slug: 'carpal-tunnel',
          eyebrow: 'Nerve compression · Wrist & hand',
          title: 'Carpal Tunnel Injections in Lake Mary, FL',
          joint: 'Wrist & hand',
          category: 'Nerve compression',
          symptoms: [
            'Numbness or tingling in the thumb, index, middle, and half of the ring finger',
            'Waking at night needing to shake or dangle the hand',
            'Dropping small objects, or losing grip on a coffee cup',
            'Pain or buzzing that travels up the forearm',
            'Symptoms worse when driving, typing, or holding a phone',
          ],
          steps: [
            { number: '01', title: 'Exam and nerve testing' },
            { number: '02', title: 'Night splinting' },
            { number: '03', title: 'Corticosteroid injection' },
            { number: '04', title: "Referral when it's beyond us" },
          ],
          faq: [
            {
              question: 'Does a carpal tunnel injection hurt?',
              answer:
                'The wrist is numbed first. Most patients describe brief pressure. The injection itself takes under a minute.',
            },
            {
              question: 'How long until it works?',
              answer:
                'Relief typically begins within a few days as the swelling comes down. Night symptoms are usually the first thing to improve.',
            },
            {
              question: 'How long does it last?',
              answer:
                'This varies widely. Some people get months, some get a lasting resolution once the aggravating activity is corrected, and some find it returns. We discuss what your response means at follow-up.',
            },
            {
              question: 'Will I still need surgery?',
              answer:
                'Not necessarily. An injection is often used to settle an early or moderate case. If your symptoms are constant rather than intermittent, surgery is more likely to be the durable answer, and we will tell you that directly.',
            },
          ],
          related: ['tennis-elbow', 'golfers-elbow', 'rotator-cuff'],
        }),
        conditionDefaults({
          slug: 'knee-arthritis',
          eyebrow: 'Lower extremity · Knee',
          title: 'Knee Injections for Arthritis in Lake Mary, FL',
          joint: 'Knee',
          category: 'Lower extremity',
          symptoms: [
            'Pain going down stairs, or getting up out of a chair',
            'Stiffness for the first twenty or thirty minutes of the morning',
            'Swelling that shows up the day after activity',
            'Grinding, clicking, or a catching sensation',
            'A knee that aches at night after a long day on your feet',
          ],
          steps: [
            { number: '01', title: 'Exam and staging' },
            { number: '02', title: 'Corticosteroid injection' },
            { number: '03', title: 'Viscosupplementation (gel injections)' },
            { number: '04', title: 'Load and strength plan' },
          ],
          faq: [
            {
              question: 'Cortisone or gel — which one do I need?',
              answer:
                'Cortisone is better for an acutely swollen, inflamed knee. Gel is better for a chronically worn knee without much swelling. Some patients do well with both at different points. We decide at the exam.',
            },
            {
              question: 'How many cortisone injections can I have?',
              answer:
                'They are spaced out deliberately, because frequent corticosteroid injections into the same joint are not good for cartilage over time. We will tell you your specific limit and track it.',
            },
            {
              question: 'Can I walk out on my own?',
              answer:
                'Yes. There is no sedation and no driving restriction. We ask you to take it easy on the knee for a day or two.',
            },
            {
              question: "Does this mean I'm avoiding a knee replacement?",
              answer:
                'Injections manage symptoms; they do not rebuild cartilage. For many people that is enough for a long time. For an end-stage knee, an injection is a bridge, not an alternative, and we will be straight with you about which one you have.',
            },
          ],
          related: ['hip-bursitis', 'rotator-cuff', 'carpal-tunnel'],
        }),
        conditionDefaults({
          slug: 'tennis-elbow',
          eyebrow: 'Tendon · outer elbow · Elbow',
          title: 'Tennis Elbow Treatment in Lake Mary, FL',
          joint: 'Elbow',
          category: 'Tendon · outer elbow',
          symptoms: [
            'Pain on the outside of the elbow, sharply tender to press',
            'Weakness or pain when gripping, shaking hands, or turning a doorknob',
            'Pain lifting a coffee cup or a gallon of milk palm-down',
            'Ache that radiates down into the forearm',
            'Symptoms that got worse after a project, a new lift, or a repetitive week at work',
          ],
          steps: [
            { number: '01', title: "Exam to confirm it's the tendon" },
            { number: '02', title: 'Counterforce bracing and load change' },
            { number: '03', title: 'Corticosteroid injection' },
            { number: '04', title: 'Eccentric loading program' },
          ],
          faq: [
            {
              question: 'Why does an injection alone not fix it?',
              answer:
                'Because the underlying tissue is degenerated, not merely inflamed. An injection reduces pain; the loading program is what rebuilds the tendon. Doing one without the other is why this condition has a reputation for coming back.',
            },
            {
              question: 'How long does tennis elbow take to resolve?',
              answer:
                'Tendons are slow. Meaningful improvement over weeks is normal, not a sign something is wrong. We set that expectation up front rather than after your third visit.',
            },
            {
              question: 'Can I keep lifting or working?',
              answer:
                'Usually yes, with modifications to grip and wrist position. Complete rest tends to deconditions the tendon further. We give you specifics based on what you actually do.',
            },
            {
              question: "Is this the same as golfer's elbow?",
              answer:
                "Same mechanism, opposite side. Tennis elbow is the outside of the elbow; golfer's elbow is the inside. We treat both.",
            },
          ],
          related: ['golfers-elbow', 'carpal-tunnel', 'rotator-cuff'],
        }),
        conditionDefaults({
          slug: 'golfers-elbow',
          eyebrow: 'Tendon · inner elbow · Elbow',
          title: "Golfer's Elbow Treatment in Lake Mary, FL",
          joint: 'Elbow',
          category: 'Tendon · inner elbow',
          symptoms: [
            'Pain on the inner bump of the elbow, tender to the touch',
            'Pain when gripping, pulling, or curling the wrist down',
            'Ache running down the inside of the forearm toward the wrist',
            'Weak grip, especially first thing in the morning',
            'Pain that flares after lifting, swinging, or a day of manual work',
          ],
          steps: [
            { number: '01', title: 'Exam, including the ulnar nerve' },
            { number: '02', title: 'Load modification and bracing' },
            { number: '03', title: 'Corticosteroid injection' },
            { number: '04', title: 'Eccentric loading program' },
          ],
          faq: [
            {
              question: 'How is this different from tennis elbow?',
              answer:
                "Location and the muscles involved. Golfer's elbow is the inside of the elbow and the wrist flexors; tennis elbow is the outside and the wrist extensors. The treatment logic is the same.",
            },
            {
              question: 'I have tingling in my ring and little finger too.',
              answer:
                'Tell us that at the visit. It suggests the ulnar nerve is involved alongside or instead of the tendon, and it changes both the injection decision and where we place it.',
            },
            {
              question: 'Do I have to stop lifting?',
              answer:
                'Rarely completely. Most people can keep training with adjusted grip, reduced pulling volume, and a change in wrist position. We work out the specifics with you.',
            },
            {
              question: 'Will one injection be enough?',
              answer:
                'For some people, paired with the loading program, yes. Repeat injections into the same tendon are limited deliberately — we would rather change the load than keep injecting.',
            },
          ],
          related: ['tennis-elbow', 'carpal-tunnel', 'rotator-cuff'],
        }),
        conditionDefaults({
          slug: 'rotator-cuff',
          eyebrow: 'Upper extremity · Shoulder',
          title: 'Rotator Cuff & Shoulder Pain Injections in Lake Mary, FL',
          joint: 'Shoulder',
          category: 'Upper extremity',
          symptoms: [
            'Pain lying on that shoulder at night',
            'A painful arc when raising the arm out to the side, roughly shoulder height',
            'Trouble reaching overhead, behind your back, or into a back seat',
            'Aching over the outer upper arm rather than the joint itself',
            'Weakness lifting even light objects away from the body',
          ],
          steps: [
            { number: '01', title: 'Exam to localize it' },
            { number: '02', title: 'Subacromial injection' },
            { number: '03', title: 'Glenohumeral joint injection' },
            { number: '04', title: 'Scapular and cuff program' },
          ],
          faq: [
            {
              question: 'Is my rotator cuff torn?',
              answer:
                'An injection treats irritation and inflammation, not a tear. If your exam suggests a significant tear — particularly weakness rather than just pain — imaging and a surgical opinion are the right next step, and we will route you there.',
            },
            {
              question: 'How fast does a subacromial injection work?',
              answer:
                'Often within a few days. Night pain is usually the first symptom to ease, which is what most patients care about most.',
            },
            {
              question: 'Can I go back to the gym?',
              answer:
                'Usually yes, with overhead pressing modified for a period. We give you a specific list rather than a blanket restriction.',
            },
            {
              question: 'What about pain in the back of the shoulder?',
              answer:
                'Posterior shoulder pain is common and frequently comes from the same mechanics. It is part of what we examine, not a separate problem.',
            },
          ],
          related: ['knee-arthritis', 'tennis-elbow', 'hip-bursitis'],
        }),
        conditionDefaults({
          slug: 'hip-bursitis',
          eyebrow: 'Lower extremity · Hip',
          title: 'Hip Bursitis Injections in Lake Mary, FL',
          joint: 'Hip',
          category: 'Lower extremity',
          symptoms: [
            'Pain on the outer side of the hip, tender to press',
            'Cannot lie on that side at night',
            'Pain climbing stairs or getting out of a car',
            'Ache spreading down the outside of the thigh',
            'Worse after a long walk or a day standing',
          ],
          steps: [
            { number: '01', title: 'Exam that separates hip joint from hip side' },
            { number: '02', title: 'Trochanteric bursa injection' },
            { number: '03', title: 'Hip joint injection' },
            { number: '04', title: 'Gluteal strengthening' },
          ],
          faq: [
            {
              question: 'Is this arthritis of the hip?',
              answer:
                'Usually not. Hip arthritis typically causes groin pain and stiffness turning the leg. Bursitis causes pain on the outside that is tender to touch. The exam distinguishes them, and the treatment differs.',
            },
            {
              question: 'How soon can I sleep on that side again?',
              answer:
                'Many patients notice night pain easing within the first several days. That is usually the change people report first.',
            },
            {
              question: 'Do I need an MRI first?',
              answer:
                'Often not. This is largely a clinical diagnosis. If your exam is atypical or you do not respond as expected, imaging becomes the right next step.',
            },
            {
              question: 'Will it come back?',
              answer:
                'It can, if the underlying weakness is not addressed. That is why the strengthening program is part of the plan rather than an optional add-on.',
            },
          ],
          related: ['knee-arthritis', 'rotator-cuff', 'carpal-tunnel'],
        }),
      ],
    },

    /* ============================= CONTACT PAGE ============================= */
    {
      name: 'contactPage',
      type: 'group',
      label: 'Visit Us Page',
      fields: [
        ...sectionStyleFields(''),
        { name: 'eyebrow', type: 'text', defaultValue: 'Visit us' },
        { name: 'heading', type: 'text', defaultValue: '115 International Parkway, Lake Mary' },
        {
          name: 'lede',
          type: 'textarea',
          defaultValue:
            'One location, just off I‑4 at the Lake Mary Boulevard exit, serving Lake Mary, Heathrow, Longwood, Sanford and Winter Springs.',
        },
        {
          name: 'paymentNote',
          type: 'group',
          label: 'Payment Note',
          fields: [
            {
              name: 'headline',
              type: 'text',
              defaultValue: 'Self-pay only — we do not bill insurance.',
            },
            {
              name: 'detail',
              type: 'text',
              defaultValue: 'Flat pricing quoted before your visit.',
            },
            {
              name: 'acceptedPlaceholder',
              type: 'text',
              defaultValue: '[Accepted: cash, card, HSA/FSA]',
            },
          ],
        },
        {
          name: 'mapNote',
          type: 'textarea',
          defaultValue: 'Map embed goes here — drop in a Google Maps iframe on the live site',
        },
        {
          name: 'mapNote',
          type: 'textarea',
          defaultValue: 'Map embed goes here — drop in a Google Maps iframe on the live site',
          admin: {
            description:
              'Fallback text shown when there is no Map Image and no Map Embed URL (in Site Contact Info) set.',
          },
        },
        mediaGroup(
          'mapImage',
          'Map Image',
          'Map showing the Ortho & Spine Physicians Group location in Lake Mary, FL',
        ),
        ctaBandGroup('ctaBand', {
          heading: 'Calling is the fastest way in.',
          text: "Tell us which joint and how long it's been hurting. We'll book you or point you to the right place.",
          buttonText: 'Call',
        }),
      ],
    },

    /* ============================= FOOTER ============================= */
    {
      name: 'footer',
      type: 'group',
      label: 'Footer',
      fields: [
        { name: 'backgroundColor', type: 'text' },
        { name: 'textColor', type: 'text' },
        {
          name: 'tagline',
          type: 'text',
          defaultValue: 'Premium personal injury medical services',
        },
        {
          name: 'linkColumns',
          type: 'array',
          label: 'Footer Link Columns',
          admin: {
            description: 'Drag to reorder columns; drag within a column to reorder its links.',
          },
          fields: [
            { name: 'heading', type: 'text', required: true },
            {
              name: 'links',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
          defaultValue: [
            {
              heading: 'Pages',
              links: [
                { label: 'Home', url: '#home' },
                { label: 'About & Team', url: '#about' },
                { label: 'Services & Conditions', url: '#services' },
                { label: 'Visit Us', url: '#contact' },
                { label: 'Pricing & Payment', url: '#contact' },
                { label: 'For Attorneys', url: '#sec-attorneys' },
              ],
            },
            {
              heading: 'Areas we treat',
              links: [
                { label: 'Knee', url: '#services' },
                { label: 'Shoulder', url: '#services' },
                { label: 'Hip', url: '#services' },
                { label: 'Elbow', url: '#services' },
                { label: 'Wrist & carpal tunnel', url: '#services' },
                { label: 'Ankle', url: '#services' },
                { label: '… and more', url: '#services' },
              ],
            },
          ],
        },
        richBlank(
          'disclaimer',
          'Legal Disclaimer',
          'Original copy: "We do not bill health insurance. Attorney-referred personal injury clients are seen on a letter of protection; all other patients are self-pay with fees quoted before treatment. Out of network with all health plans, including Medicare and Medicaid. This site is for general information only and is not medical advice. It does not create a physician–patient relationship. If you are having a medical emergency, call 911."',
        ),
        {
          name: 'copyrightText',
          type: 'text',
          defaultValue: '© [Year] Ortho & Spine Physicians Group. All rights reserved.',
        },
        {
          name: 'legalLinks',
          type: 'array',
          label: 'Legal Links',
          admin: { description: 'Drag to reorder.' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', defaultValue: '#' },
          ],
          defaultValue: [
            { label: 'Privacy Policy', url: '#' },
            { label: 'Terms', url: '#' },
            { label: 'Notice of Privacy Practices — HIPAA', url: '#' },
          ],
        },
      ],
    },

    /* ============================= STRUCTURED DATA ============================= */
    {
      name: 'structuredData',
      type: 'group',
      label: 'Structured Data (Schema.org)',
      admin: {
        description:
          "Powers the Physician / MedicalClinic JSON-LD. FAQPage JSON-LD per condition should be generated from each condition's FAQ array at build/render time.",
      },
      fields: [
        { name: 'physicianName', type: 'text', defaultValue: 'Dr. James Young, DO' },
        { name: 'physicianJobTitle', type: 'text', defaultValue: 'Medical Director' },
        { name: 'physicianAlumniOf', type: 'text', defaultValue: 'University of Louisville' },
        chipsArray('medicalSpecialty', 'Medical Specialty', ['Emergency', 'FamilyPractice']),
        chipsArray('knowsAbout', 'Knows About', [
          'Joint injections',
          'Musculoskeletal injury',
          'Emergency medicine',
          'Family medicine',
        ]),
        {
          name: 'clinicName',
          type: 'text',
          defaultValue: 'Ortho & Spine Physicians Group — Lake Mary',
        },
        { name: 'clinicMedicalSpecialty', type: 'text', defaultValue: 'Orthopedic' },
        {
          name: 'paymentAccepted',
          type: 'text',
          defaultValue:
            'Self-pay and attorney-referred letters of protection accepted; health insurance not billed.',
        },
      ],
    },

    /* ============================= SEO ============================= */
    {
      name: 'seoSettings',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        { name: 'metaTitle', type: 'text', defaultValue: 'Ortho & Spine Lake Mary' },
        {
          name: 'metaDescription',
          type: 'textarea',
          defaultValue:
            'Ortho & Spine Physicians Group — orthopedic, spine, nerve and soft-tissue care in Lake Mary, Florida. Attorney-referred injury clients seen on a letter of protection; self-pay patients quoted a flat price up front.',
        },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG Image' },
        { name: 'canonicalUrl', type: 'text' },
        {
          name: 'robots',
          type: 'select',
          defaultValue: 'noindex,nofollow',
          options: [
            { label: 'Index, Follow', value: 'index,follow' },
            { label: 'No Index, Follow', value: 'noindex,follow' },
            { label: 'Index, No Follow', value: 'index,nofollow' },
            { label: 'No Index, No Follow', value: 'noindex,nofollow' },
          ],
          admin: {
            description:
              'Currently noindex,nofollow to match the draft-for-review state of this site.',
          },
        },
      ],
    },

    /* ============================= ACCESSIBILITY / MOBILE / ADVANCED ============================= */
    {
      name: 'accessibilitySettings',
      type: 'group',
      label: 'Accessibility Settings',
      fields: [
        { name: 'skipToContent', type: 'checkbox', defaultValue: true },
        { name: 'focusVisibleColor', type: 'text', defaultValue: '#495A6B' },
        {
          name: 'contrastMode',
          type: 'select',
          defaultValue: 'normal',
          options: [
            { label: 'Normal', value: 'normal' },
            { label: 'High Contrast', value: 'high' },
          ],
        },
        { name: 'respectReducedMotion', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'mobileSettings',
      type: 'group',
      label: 'Mobile Settings',
      fields: [
        { name: 'tabletBreakpoint', type: 'text', defaultValue: '940px' },
        { name: 'mobileBreakpoint', type: 'text', defaultValue: '600px' },
        { name: 'mobileStackSections', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'ctaSettings',
      type: 'group',
      label: 'Sticky Call CTA',
      fields: [
        { name: 'enableStickyCTA', type: 'checkbox', defaultValue: false },
        { name: 'stickyCTAText', type: 'text', defaultValue: 'Call' },
        {
          name: 'stickyCTAPosition',
          type: 'select',
          defaultValue: 'bottom-right',
          options: [
            { label: 'Bottom Right', value: 'bottom-right' },
            { label: 'Bottom Center (Sticky)', value: 'bottom-center' },
          ],
        },
        { name: 'ctaBackgroundColor', type: 'text', defaultValue: '#8F5A14' },
        { name: 'ctaTextColor', type: 'text', defaultValue: '#FFF8EC' },
      ],
    },
    {
      name: 'advancedSettings',
      type: 'group',
      label: 'Advanced Settings',
      fields: [
        { name: 'customCSS', type: 'textarea' },
        { name: 'customJS', type: 'textarea' },
        { name: 'lazyLoadImages', type: 'checkbox', defaultValue: true },
      ],
    },

    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: { description: 'Toggle to enable/disable this component.' },
    },
  ],
  timestamps: true,
}

export default OrthoSpinePageComponents
