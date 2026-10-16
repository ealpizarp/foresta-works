import type { es } from './es';

/**
 * English for Costa Rican small-business visitors. Natural, not a calque.
 * Product names (Arranque, Crecimiento, Inteligente) stay as they are.
 */
export const en = {
  meta: {
    siteShortDescription: 'Websites and automation for small businesses in Costa Rica',
    siteDescription:
      'We build a fast website that works, then look after it on a subscription: maintenance, SEO, AI search, and, once you are selling, ads management on Facebook and Instagram. You pay Meta for the ads themselves. For shops, restaurants, clinics, and service businesses in Costa Rica.',
    ogImageAlt: 'Illustration of an online shop in a browser frame: an example of the craft, not a client site.',
    skipToContent: 'Skip to content',
    homeAria: '{name}, home',
    founderJobTitle: 'Founder and full-stack developer',
    knowsAbout: [
      'Web development',
      'Process automation',
      'WhatsApp Business integration',
      'E-commerce',
      'Local SEO',
      'Optimization for AI search',
    ],
    offerCatalogName: 'Foresta Works subscription plans',
    offerName: '{name}: build',
    offerPriceNote: 'One-time build and monthly fee, according to scope, in the written plan.',
    whatsappMessage:
      'Hello, Foresta Works. I would like to talk about a website and automation for my business.',
    emailSubject: 'Inquiry from the website',
  },
  nav: {
    primaryLabel: 'Primary',
    menuLabel: 'Menu',
    menuOpen: 'Menu',
    menuClose: 'Close',
    footerLabel: 'Footer',
    relatedPages: 'Related pages',
    breadcrumb: 'Breadcrumb',
    language: 'Language',
    languageEs: 'Español',
    languageEn: 'English',
    home: 'Home',
    previous: 'Previous',
    next: 'Next',
    letsTalk: "Let's talk",
    newWindow: ' (opens in a new window)',
    items: {
      servicios: {
        label: 'Services',
        summary: 'Arranque, Crecimiento, and Inteligente: subscriptions you can compare.',
      },
      automatizacion: {
        label: 'Automation',
        summary: 'A WhatsApp assistant for what you already answer.',
      },
      proceso: {
        label: 'Process',
        summary: 'How we work, from the first conversation to month after month.',
      },
      nosotros: {
        label: 'About',
        summary: 'Why Foresta exists, and how we work with you.',
      },
      contacto: {
        label: 'Contact',
        summary: "Let's start with a conversation.",
      },
    },
  },
  pages: {
    servicios: {
      title: 'Subscription plans for small businesses in Costa Rica',
      description:
        'Arranque, Crecimiento, and Inteligente: subscriptions with a one-time build and a monthly fee. Website, SEO, AI search, store, Meta Ads management, and a WhatsApp assistant. Ad spend is paid to Meta, separately.',
      eyebrow: 'Services',
      heading: 'Three subscriptions, according to the stage of your business.',
      lede: 'The monthly fee and the build are confirmed in writing. This page has no fixed price.',
    },
    automatizacion: {
      title: 'WhatsApp automation for what you already answer',
      description:
        'A WhatsApp assistant for questions, after hours, appointments or orders, reminders, and reviews. The scope is written before it is turned on.',
      eyebrow: 'Automation',
      heading: 'A WhatsApp assistant for what you already answer.',
      lede: 'Less time on messages by hand, fewer errors, and better follow-up.',
      closeTitle: 'Tell us how you serve people today.',
      closeText: 'We look at whether the assistant fits your operation. If we continue, the scope goes in writing.',
      cues: {
        questions: 'Questions',
        afterHours: 'After hours',
        booking: 'Appointment or order',
        followUp: 'Reminder and review',
      },
    },
    proceso: {
      title: 'How we work',
      description:
        'A conversation, a written subscription plan, the build, launch, and month-to-month work. The domain, accounts, and code are in your name from day one.',
      eyebrow: 'Process',
      heading: 'No surprises: a conversation, a written plan, and work every month.',
      lede: 'The build gets the site ready. The monthly fee keeps it, improves it, and reports on it.',
    },
    nosotros: {
      title: 'About Foresta',
      description:
        'Foresta looks after websites for businesses in Costa Rica. The work is technical, and it stays in your name. We are not a marketing agency.',
      eyebrow: 'About',
      heading: "We look after your business's website.",
      lede: 'A clear site, in your name, for shops, clinics, and service businesses in Costa Rica.',
      closeTitle: "Let's talk about your business.",
    },
    contacto: {
      title: 'Contact',
      description:
        'Tell us how your business works today. The first conversation has no cost and no commitment. If it makes sense to continue, you receive a written plan: build, monthly fee, and limits.',
      eyebrow: 'Contact',
      heading: 'Tell us how your business works today.',
      lede: 'The first conversation has no cost and no commitment. If it makes sense to continue, we send a written plan with the build, the monthly fee, and what is billed separately.',
    },
  },
  notFound: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist or has moved.',
    eyebrow: 'Page not found',
    heading: 'This address does not exist or has moved.',
    text: 'You can go back home, or write to us if you followed a link that should still work.',
    home: 'Back to home',
    contact: 'Contact',
  },
  hero: {
    title: 'We transform your business for a new era of',
    titleEm: 'artificial intelligence.',
    lede: 'A studio based in Costa Rica, with the mission of delivering modern digital infrastructure to businesses.',
    startConversation: "Let's talk",
    writeWhatsApp: "Let's talk",
    cueSite: 'Website',
    cueAuto: 'Automation',
    cueCare: 'Care',
  },
  positioning: {
    eyebrow: 'What we do',
    statement: 'Many businesses already run on WhatsApp, a PDF catalog, and the owner’s memory.',
    statementEm: 'We get that working in order.',
    p1: 'Until it stops being enough: messages unanswered after hours, missed appointments, orders written by hand, and a website nobody updates.',
    p2: 'We build the site and look after it each month: WhatsApp, payments, bookings, catalogs, SEO, and, once there is a clear destination, ads on Facebook and Instagram. You pay Meta for the ads.',
    p3: 'We are not a marketing agency, and we do not run your social media or work with influencers. The work is technical: so a customer can find you, pay, and get a reply.',
    audienceTitle: 'Who it is for',
    audiences: [
      'Shops and stores',
      'Restaurants and cafés',
      'Clinics and practices',
      'Professional services',
      'Workshops and technical trades',
      'Family businesses',
    ],
    photoAlt:
      'Woman paying by card at a salon counter, next to a product catalog on a tablet.',
    outcomesLabel: 'Concrete outcomes',
    outcomes: [
      'Reply to customers while you are busy or closed.',
      'Be findable: services, hours, and contact, clear on Google and on your site.',
      'Fewer missed appointments and less manual follow-up.',
      'Bring conversations from Facebook and Instagram onto WhatsApp or your site.',
    ],
  },
  homePlans: {
    label: 'Plans',
    title: 'Three subscriptions, according to the stage of your business.',
    compare: 'Compare the plans',
    seeIncludes: 'See what is included',
  },
  homeProcess: {
    label: 'How we work',
    title: 'No surprises: a conversation, a written plan, and work every month.',
    seeProcess: 'See the process',
  },
  cta: {
    eyebrow: "Let's begin",
    title: 'Tell us how your business works today.',
    text: 'The first conversation has no cost and no commitment. If it makes sense to continue, we send a written plan: build, monthly fee, and what is billed separately.',
    goContact: 'Go to contact',
    otherContact: 'Other ways to reach us',
    writeWhatsApp: 'Write to us on WhatsApp',
  },
  services: {
    plansTitle: 'Subscription plans',
    monthly: 'Monthly fee',
    monthlyWritten: 'in writing',
    oneTimeBuild: 'One-time build',
    oneTimeBuildWritten: 'according to scope',
    monthlyHeading: 'Each month',
    buildHeading: 'In the build',
    billedApart: 'Billed separately',
    outcomeLabel: 'What it is for',
    wantPlan: 'I want this plan',
    howBilled: 'How billing works',
    whatWeDont: 'What we do not do',
    foldOpen: 'Open',
    foldClose: 'Close',
    whatWeDontBody:
      'We do not run your social media every day. We do not promise sales, a position in Google, or a citation in an AI answer.',
    compareEyebrow: 'Compare',
    compareTitle: 'Side by side.',
    compareLede:
      'They are not rungs. Inteligente handles demand; it does not replace the site. They can be combined.',
    compareCaption: 'Comparison of what is included and billed between Arranque, Crecimiento, and Inteligente',
    compareColumn: "What's included",
    compareMarks: {
      yes: 'Included',
      no: 'Not included',
      add: 'Can be added',
      extra: 'Billed separately',
    },
    compareRows: {
      responsiveSite: 'Responsive website',
      googleProfile: 'Google Business Profile',
      seoAi: 'Basic SEO and AI search',
      hosting: 'Hosting, backups, and maintenance',
      report: 'Written monthly report',
      contact: 'Contact by WhatsApp or email',
      shop: 'Store, catalog, or bookings',
      payments: 'Payments, including SINPE Móvil',
      metaAds: 'Meta Ads management',
      adSpend: 'Meta ads budget',
      assistant: 'WhatsApp assistant',
      reminders: 'Reminders and reviews',
    },
    termsEyebrow: 'Terms',
    termsTitle: 'Month to month, with notice to leave.',
    termsLede: 'Four conditions. The rest is written in the plan.',
    terms: {
      commitment: 'Term',
      cancellation: 'Cancellation',
      renewal: 'Renewal',
      extras: 'Beyond the allowance',
    },
    currencyNote:
      'Amounts in USD, excluding 13% VAT. Confirmed in writing, according to scope.',
    billing:
      'The build is charged once, at the start. The monthly fee begins when the site or the assistant is live.',
    commitment:
      'We recommend {months} months, so the site and the SEO have time to work.',
    cancellation:
      'You can cancel with {days} days’ notice in writing. The build is not refunded. The site, accounts, and code stay in your name.',
    renewal: 'The subscription renews month to month, unless you give notice to cancel. There is no mandatory annual charge.',
    extras: 'Work beyond the plan’s rounds or hours is quoted before we do it. Extra hours are USD {hour}.',
    adSpend:
      'In Crecimiento, ads management is in the monthly fee. You pay the ads budget straight to Meta, in your account.',
    upgradeNote:
      'The move from Arranque to Crecimiento is billed as an expansion, not as a new build. The amount is in writing.',
    notOffered: [
      'Day-to-day social media management',
      'Influencer campaigns',
      'Content calendar',
      'Ads on Google or TikTok',
    ],
    tiers: {
      arranque: {
        audience: 'For the business that needs to exist properly online, and stay that way.',
        description:
          'A site that is clear on a phone, with Google, contact, and search kept current. The build gets it ready; the monthly fee looks after it.',
        highlights: ['Mobile website', 'Google Profile', 'Month-to-month care'],
        setupIncludes: [
          'Responsive website, in your name',
          'Google Business Profile configured',
          'Contact form connected to WhatsApp or email',
          'Basic SEO and an initial pass for AI search',
        ],
        monthlyIncludes: [
          'Hosting, SSL certificate, backups, and technical updates',
          'Up to 1 round of changes a month (copy, hours, photos, or contact), maximum 1 hour',
          'Review of basic SEO and AI search',
          'A short written report: what was done and what we recommend',
          'Support by WhatsApp or email; reply within 2 business days',
        ],
        billedSeparately: [
          'VAT (13%)',
          'Domain, if we register it for you (at cost)',
          'Meta ads: this plan does not include advertising',
          'Work beyond the monthly round, quoted before we do it',
        ],
        upgrade: 'When you already sell online or want to run ads, you move to Crecimiento.',
        outcome: 'So people can find you, write to you, and the site does not sit still.',
        badge: null,
      },
      crecimiento: {
        audience: 'For the business that already sells and wants to sell with less effort.',
        description:
          'A catalog or store, payments, and ads management on Facebook and Instagram. You pay Meta for the ads; the monthly fee covers the work, not the ads budget.',
        highlights: ['Store or catalog', 'Payments and SINPE', 'Meta Ads management'],
        setupIncludes: [
          'Site with an online store or catalog',
          'Payments integration, including SINPE Móvil when it applies',
          'A simple bookings or inventory system',
          'Set-up of the Meta ads account, in your name',
          'Technical SEO (speed and structured data) and AI search',
        ],
        monthlyIncludes: [
          'All of Arranque’s monthly care',
          'Up to 2 rounds of changes a month, maximum 2 hours (including catalog or prices)',
          'Meta Ads management: adjustments, tracking, and one report a month',
          'Review of SEO and AI search',
          'Support by WhatsApp or email; reply within 2 business days',
        ],
        billedSeparately: [
          'VAT (13%)',
          'Domain, if we register it for you (at cost)',
          'Meta ads budget: you load it in your account',
          'New photo or video, if you do not already have material',
          'Work beyond the 2 hours, quoted before we do it',
        ],
        upgrade: 'Inteligente adds WhatsApp coverage; it does not replace this plan.',
        outcome: 'Fewer steps between a customer’s interest and the sale, with the site and the ads running.',
        badge: 'If you already sell',
      },
      inteligente: {
        audience: 'For the business that wants to serve people better without growing headcount.',
        description:
          'A WhatsApp assistant with a written scope. It adds to Arranque or Crecimiento; it does not replace the site.',
        highlights: ['WhatsApp assistant', 'After hours', 'Adjusted each month'],
        setupIncludes: [
          'Written scope of what the assistant does and does not do',
          'Set-up of frequent questions, after hours, reminders, and reviews, according to that scope',
        ],
        monthlyIncludes: [
          'Hosting and operation of the assistant',
          'Up to 1 adjustment cycle a month (questions, hours, or flows you approve)',
          'Review of messages the assistant could not resolve',
          'A short written report',
          'Support by WhatsApp or email; reply within 2 business days',
        ],
        billedSeparately: [
          'VAT (13%)',
          'A site plan (Arranque or Crecimiento) if you do not already have one',
          'WhatsApp or Meta conversation costs, if they apply: you pay them',
          'New capabilities outside the written scope, quoted first',
        ],
        upgrade: 'If you do not yet have a site, Arranque or Crecimiento is added. This plan does not replace it.',
        outcome: 'Steady coverage, without hiring more people.',
        badge: null,
      },
    },
  },
  aiSearch: {
    eyebrow: 'In Arranque and Crecimiento',
    title: 'Optimization for AI search',
    lede: 'When someone looks for a service like yours, in Google or in an AI tool, those tools read your site and your data. We prepare content, structure, and local signals so they can understand the business.',
    noteLabel: 'Alongside SEO, not instead of it',
    distinction:
      'Basic SEO helps Google organize the page: titles, structure, and Google Profile. Optimization for AI search helps AI tools understand what you offer, where you are, and whom you serve. They are done together. Neither guarantees a ranking, a citation in an AI answer, or more customers.',
    includedNote:
      'It is in Arranque and Crecimiento, in the build and each month. On Inteligente it can be added if there is a site.',
    caption: 'Illustrative diagram: clear data a tool can read. It is not a ranking or a citation.',
    includesLabel: 'What it includes',
    excludesLabel: 'What it does not promise',
    includes: [
      'Clear information on services and location',
      'Structured data (schema) and the technical basics of SEO',
      'Service pages and frequently asked questions, when the site needs them',
      'Business details kept consistent on the profiles you already use (for example, Google)',
      'Copy written around questions a customer already asks',
      'A monthly review based on visibility opportunities, within the plan’s hours',
    ],
    excludes: [
      'We do not promise a position in Google or in another search engine',
      'We do not promise that an AI will cite, recommend, or include you in an answer',
      'We do not promise more calls, messages, or sales',
      'It does not replace basic SEO: it is delivered together with it',
    ],
  },
  metaAds: {
    eyebrow: 'Inside Crecimiento',
    title: 'Advertising on Facebook and Instagram',
    lede: 'Management is in the Crecimiento monthly fee. You pay for the ads themselves straight to Meta, in your account. We do not mix that into the subscription.',
    caption: 'Diagram of a monthly report. No client figures and no promised results.',
    spendLabel: 'Ad spend and management are not mixed',
    spendNote:
      'You set the ads budget and load it in Meta. We do not advance it or treat it as part of the subscription. Management is in the Crecimiento monthly fee; ad spend is not.',
    includesLabel: 'What management includes',
    excludesLabel: 'What it does not include',
    includes: [
      'Set-up and configuration of the ads account (Meta Ads Manager), in your name',
      'Campaigns on Facebook and Instagram with a written objective: conversations, visits, or sales',
      'Targeting by area (province or canton), interests, and audiences you approve',
      'Creative guidance: which photo, offer, and copy to use, with the material you already have',
      'Adjustments during the month (this is not day-to-day comment or social-media management)',
      'A clear report each month: spend, results, and what we will change',
    ],
    excludes: [
      'Ad spend (the ads budget): you pay Meta, separately from the monthly fee',
      'Day-to-day social media, replies in comments, or a content calendar',
      'Influencer campaigns',
      'Ads on Google, TikTok, or other platforms',
      'A guarantee of sales, clicks, or a cost per result',
      'New photo or video production, if you do not already have material',
    ],
  },
  automation: {
    doesNot: 'What it does not do',
    caption: 'Illustrative conversation. The real scope is written in the plan.',
    photoAlt:
      'A WhatsApp mockup of the assistant: a conversation about hours and an appointment, with light bubbles on a deep-green ground.',
    workLabel: 'How it comes together',
    workTitle: 'From your operation to the message.',
    work: [
      {
        title: 'Understand',
        text: 'We look at how you serve people today: questions, hours, appointments, and orders.',
      },
      {
        title: 'Choose',
        text: 'We mark what you already answer by hand and what can move to the assistant.',
      },
      {
        title: 'Connect',
        text: 'We write it, join it to your site, and turn it on.',
      },
      {
        title: 'Adjust',
        text: 'We review what it could not resolve and refine what is written.',
      },
    ],
    flowLabel: 'What it does',
    flowTitle: 'One message, inside what you approved.',
    stepTitles: [
      'What it may say',
      'After hours',
      'Appointment or order',
      'Reminder and review',
    ],
    exampleLabel: 'Example',
    exampleTitle: 'This is how the assistant talks.',
    planTitle: 'On Inteligente.',
    planText: 'The assistant is written before it is turned on. It is added to a site; it does not replace one.',
    doesItems: [
      'Answers frequent questions you define: hours, location, services, and ways to pay.',
      'Takes messages after hours, confirms to the customer they were received, and notifies you.',
      'Collects the details for an appointment or an order and organizes them for you to confirm.',
      'Sends appointment reminders and review requests at the agreed time.',
    ],
    doesNotItems: [
      'It does not invent answers beyond what you approved.',
      'It does not close sales or make decisions for you.',
      'It does not replace a person: when it does not know, it hands off to someone.',
      'It is not installed and forgotten: it is reviewed and adjusted with use.',
    ],
  },
  process: {
    stepsTitle: 'Stages of the work',
    note: 'Everything we build is yours: the domain, the accounts, the code, and the access stay in your name from day one.',
    steps: [
      {
        title: 'Conversation',
        text: 'We talk on WhatsApp or in a short call about how your business works today and what is taking your time.',
      },
      {
        title: 'Written plan',
        text: 'We send the plan, the monthly fee, the build, the limits, and what is billed separately. If there are Meta Ads, management and ad spend are listed apart.',
      },
      {
        title: 'Build',
        text: 'We build the site, the integrations, or the assistant, according to the plan. You review real progress, not mockups.',
      },
      {
        title: 'Launch',
        text: 'Domain, hosting, Google Business Profile, and, if it applies, the Meta Ads account. A session so your team knows how to use it. That is when the monthly fee starts.',
      },
      {
        title: 'Month to month',
        text: 'Maintenance, changes within the allowance, SEO, AI search, a report, and, if they apply, ads management or an assistant adjustment.',
      },
    ],
  },
  about: {
    statementTitle: 'Work done closely.',
    origin: 'Foresta Works was founded by {name}.',
    statement: 'We talk, we put the scope in writing, and you see real progress.',
    statementMore:
      'We prefer a few tools, well connected, made to last and for the people who use them every day.',
    photoAlt:
      'Corner of a house: a stacked-stone wall beside a light plaster wall, under a dark sheet-metal roof, with trees behind.',
    principlesLabel: 'Commitments',
    principlesTitle: 'This is the agreement.',
    principles: [
      {
        title: 'In your name',
        text: 'The domain, the accounts, the code, and the access stay in your name from day one.',
      },
      {
        title: 'Technical work',
        text: 'So people can find you, pay, and get an answer.',
      },
      {
        title: 'You set the budget.',
        text: 'If there are ads on Facebook or Instagram, you set the amount and pay Meta directly.',
      },
      {
        title: 'Not marketing',
        text: 'We are not an agency, and we do not run your social networks or work with influencers.',
      },
    ],
    togetherLabel: 'With you',
    togetherTitle: 'The scope fits. You can see the progress.',
    together: 'We work closely, and with clarity. The plan is written for your business.',
  },
  contact: {
    methodsTitle: 'Ways to reach us',
    email: 'Email',
    hours: 'Hours',
    hoursValue: null as string | null,
    comingSoon: 'Coming soon.',
    openChat: 'Open a conversation',
    writeWhatsApp: 'Write to us on WhatsApp',
    formLabel: 'Or write to us from here',
    placeholder:
      'For example: I have a dental clinic, we take appointments on WhatsApp, and we lose messages after hours.',
    hint: 'Sending opens WhatsApp with your message ready. This site does not store what you write.',
    error: 'Tell us a little more: at least 20 characters.',
    submit: 'Send on WhatsApp',
  },
  mockup: {
    url: 'site.example',
    query: 'business nearby · hours · contact',
    chips: ['Services', 'Area', 'WhatsApp'],
    reportKicker: 'Monthly report',
    investment: 'Spend',
    conversations: 'Conversations',
    nextStep: 'Next step',
    composer: 'Type a message',
    chat: [
      'Hi, are you open tomorrow?',
      'Yes. We open at 8. Would you like an appointment?',
      'At 10, please.',
      'Done. We will confirm the time.',
    ],
  },
} satisfies typeof es;
