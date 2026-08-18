/* Capability Expansion — adds the platform-expansion modules from the proposal:
   Business Intelligence & Verification, Investor & Funding Management, Document & Data Room
   Management, AI-Powered Intelligence, Financial Analysis, Compliance & Governance,
   Communication (Meetings), Admin & Platform Management (System Monitoring), and the
   Ecosystem Marketplace. Reuses existing loginProfiles/systemPageCatalog/navigate/showToast. */

// ---------- 1. Register pages in the catalog + sidebar ----------
const capabilityPageItems = [
  ['business-intel', '\u26E8', 'Business Intelligence', 'Verification, risk scoring and due diligence'],
  ['investors', '\u25A9', 'Investor Management', 'Investor profiles, onboarding and portfolio ROI'],
  ['data-rooms', '\u25A6', 'Data Rooms', 'Secure, permissioned deal document exchange'],
  ['ai-intelligence', '\u2726', 'AI Intelligence', 'AI scoring, analysis and generated reports'],
  ['financial-analysis', '\u25B2', 'Financial Analysis', 'Statements, ratios, forecasts and valuation'],
  ['compliance', '\u2696', 'Compliance & Governance', 'KYC, KYB, AML and audit controls'],
  ['meetings', '\u25B6', 'Meetings & Video Calls', 'Scheduling, video links and announcements'],
  ['system-monitoring', '\u25D2', 'System Monitoring', 'Platform health, uptime and background jobs'],
  ['marketplace', '\u2756', 'Ecosystem Marketplace', 'Service providers, advisors, courses, knowledge'],
];
capabilityPageItems.forEach(item => { if (!systemPageCatalog.some(row => row[0] === item[0])) systemPageCatalog.push(item); });

const capabilityKeys = capabilityPageItems.map(i => i[0]);
if (loginProfiles.admin) capabilityKeys.forEach(k => { if (!loginProfiles.admin.allowed.includes(k)) loginProfiles.admin.allowed.push(k); });
['vip', 'vc'].forEach(t => { if (loginProfiles[t]) capabilityKeys.forEach(k => { if (!loginProfiles[t].allowed.includes(k)) loginProfiles[t].allowed.push(k); }); });
['premium', 'strategic'].forEach(t => { if (loginProfiles[t]) ['business-intel', 'investors', 'financial-analysis', 'meetings', 'marketplace'].forEach(k => { if (!loginProfiles[t].allowed.includes(k)) loginProfiles[t].allowed.push(k); }); });
if (loginProfiles.standard) ['business-intel', 'meetings', 'marketplace'].forEach(k => { if (!loginProfiles.standard.allowed.includes(k)) loginProfiles.standard.allowed.push(k); });

const expansionWorkspaceNav = document.querySelectorAll('#sidebar nav')[1];
expansionWorkspaceNav.insertAdjacentHTML('afterend', `
<div class="nav-label">Platform Expansion</div>
<nav id="expansionNav">
  ${capabilityPageItems.map(([key, icon, title]) => `<button class="nav-item${key === 'system-monitoring' ? ' admin-only-nav' : ''}${key === 'investors' ? ' active' : ''}" data-page="${key}"><span>${icon}</span> ${title}</button>`).join('')}
</nav>`);
document.querySelectorAll(capabilityKeys.map(k => `[data-page="${k}"]`).join(',')).forEach(button => {
  button.onclick = () => navigate(button.dataset.page);
});

// ---------- 2. Shared demo data (reuses existing companies / partnerOrganizations) ----------
const biCompanies = companies.slice(0, 8);
const biRows = biCompanies.map((c, i) => ({
  company: c, registration: 'Verified', ownership: i % 5 === 0 ? 'Pending' : 'Verified',
  industry: c.industry, risk: 12 + (i * 7) % 48, credibility: 68 + (i * 5) % 30,
  docs: 3 + (i % 3), verified: isCompanyVerified(c),
}));
const dataRoomRows = [
  { name: 'Mekong AgriTech \u2194 Impact Asia Capital', docs: 14, permission: 'Investor: View + Comment', version: 'v3', status: 'Active', expires: '18 Aug 2026' },
  { name: 'Koompi Digital \u2194 Cambodia Innovation Fund', docs: 9, permission: 'Investor: View only', version: 'v2', status: 'Active', expires: '02 Sep 2026' },
  { name: 'Sabay Logistics \u2194 Mekong Growth Partners', docs: 11, permission: 'Investor: View + Download', version: 'v4', status: 'In review', expires: '25 Jul 2026' },
  { name: 'Tonle Finance \u2194 UNI Holding', docs: 6, permission: 'Investor: View only', version: 'v1', status: 'Expiring soon', expires: '27 Jul 2026' },
  { name: 'GreenBuild Cambodia \u2194 Ballangk Mall', docs: 8, permission: 'Investor: View + Comment', version: 'v2', status: 'Active', expires: '14 Sep 2026' },
];
const dataRoomDocs = [
  ['\u25A6', 'Pitch deck v3.pdf', 'Uploaded 3 days ago \u2022 4.2MB', 'Approved'],
  ['\u25A6', 'Financial model.xlsx', 'Uploaded 3 days ago \u2022 1.1MB', 'Approved'],
  ['\u25A6', 'Cap table.xlsx', 'Uploaded 2 days ago \u2022 240KB', 'Pending'],
  ['\u25A6', 'Term sheet draft.pdf', 'Uploaded 6 hours ago \u2022 310KB', 'Pending'],
];
const investorDirectory = partnerOrganizations.map((p, i) => ({
  ...p, status: i % 4 === 0 ? 'Onboarding' : 'Active', portfolio: 2 + (i * 3) % 9, roi: (14 + i * 3.4).toFixed(1),
}));
const investorScreening = [
  { company: 'Mekong AgriTech', investor: 'Impact Asia Capital', status: 'success', note: 'Approved \u2014 proceeding to term sheet' },
  { company: 'KhmerCraft Market', investor: 'Cambodia Innovation Fund', status: 'orange', note: 'Rejected \u2014 revenue below fund minimum' },
  { company: 'GreenBuild Cambodia', investor: 'Mekong Growth Partners', status: 'orange', note: 'Rejected \u2014 sector outside current mandate' },
  { company: 'Tonle Finance', investor: 'UNI Holding', status: 'success', note: 'Approved \u2014 due diligence scheduled' },
];
const aiFunctions = [
  ['AI business evaluation', 'Scores verified companies on team, market, traction and readiness.', 91],
  ['AI investment recommendation', 'Suggests matched investors based on mandate and stage fit.', 88],
  ['AI risk prediction', 'Flags companies likely to need additional diligence.', 76],
  ['AI market analysis', 'Summarizes sector demand, competition and growth signals.', 84],
  ['AI financial analysis', 'Reviews statements and flags ratio or cash-flow concerns.', 90],
  ['AI-generated business reports', 'Produces investor-ready company summaries automatically.', 95],
  ['AI executive summary generation', 'Condenses a full pitch deck into a one-page brief.', 93],
  ['AI competitor analysis', 'Maps a company against comparable regional businesses.', 81],
  ['AI opportunity scoring', 'Ranks open funding requests by portfolio fit.', 87],
];
const aiEvaluations = [
  ['Mekong AgriTech', 'Business evaluation', 92, 96, '2 hours ago'],
  ['Koompi Digital', 'Investment recommendation', 88, 90, '5 hours ago'],
  ['Sabay Logistics', 'Risk prediction', 74, 85, 'Yesterday'],
  ['Tonle Finance', 'Financial analysis', 90, 93, 'Yesterday'],
  ['GreenBuild Cambodia', 'Opportunity scoring', 64, 79, '2 days ago'],
];
const financialRows = [
  { company: 'Mekong AgriTech', revenue: '$820,000', expense: '$610,000', profitability: '25.6%', cashflow: 'Positive', valuation: '$4.1M' },
  { company: 'Koompi Digital', revenue: '$1,450,000', expense: '$1,180,000', profitability: '18.6%', cashflow: 'Positive', valuation: '$7.8M' },
  { company: 'Sabay Logistics', revenue: '$980,000', expense: '$870,000', profitability: '11.2%', cashflow: 'Tight', valuation: '$3.2M' },
  { company: 'Tonle Finance', revenue: '$540,000', expense: '$505,000', profitability: '6.5%', cashflow: 'Tight', valuation: '$1.9M' },
  { company: 'GreenBuild Cambodia', revenue: '$310,000', expense: '$322,000', profitability: '-3.9%', cashflow: 'Negative', valuation: '$0.8M' },
];
const financialRatios = [
  ['Current ratio', 78], ['Gross margin', 61], ['Net margin', 26], ['Debt-to-equity', 34],
];
const complianceRows = [
  { entity: 'Mekong AgriTech', kyc: 'ready', kyb: 'ready', aml: 'ready', checklist: 100, audit: '12 Jul 2026' },
  { entity: 'Koompi Digital', kyc: 'ready', kyb: 'ready', aml: 'ready', checklist: 100, audit: '10 Jul 2026' },
  { entity: 'Impact Asia Capital', kyc: 'ready', kyb: 'potential', aml: 'ready', checklist: 85, audit: '08 Jul 2026' },
  { entity: 'Sabay Logistics', kyc: 'potential', kyb: 'potential', aml: 'ready', checklist: 70, audit: '05 Jul 2026' },
  { entity: 'GreenBuild Cambodia', kyc: 'improve', kyb: 'improve', aml: 'potential', checklist: 42, audit: '01 Jul 2026' },
];
const meetingRows = [
  ['Mekong AgriTech \u2194 Impact Asia Capital', 'Video call', '24 Jul, 10:00 AM', 'Confirmed'],
  ['Koompi Digital \u2194 Cambodia Innovation Fund', 'Video call', '25 Jul, 2:30 PM', 'Confirmed'],
  ['Sabay Logistics \u2194 Mekong Growth Partners', 'In person', '28 Jul, 9:00 AM', 'Pending'],
  ['Tonle Finance \u2194 UNI Holding', 'Video call', '29 Jul, 11:00 AM', 'Pending'],
];
const announcementRows = [
  ['System', 'Scheduled maintenance window on 30 Jul, 1:00\u20132:00 AM ICT.', '1 day ago'],
  ['Membership team', 'VIP renewal reminders now send 30/7/0 days before expiry.', '3 days ago'],
];
const monitorServices = [
  ['Web application', 'up', '112ms', '30 sec ago'], ['Payment gateway (ABA PayWay demo)', 'up', '206ms', '30 sec ago'],
  ['Notification service', 'degraded', '640ms', '1 min ago'], ['Search & directory index', 'up', '88ms', '30 sec ago'],
];
const monitorEvents = [
  ['\u25D2', 'Background job completed', 'Renewal reminder batch \u2014 342 members processed', '4 min ago'],
  ['\u25D2', 'Notification service latency elevated', 'Auto-scaling additional worker', '12 min ago'],
  ['\u25D2', 'Nightly report export completed', '6 scheduled PDF/Excel reports generated', '3 hours ago'],
];
const marketplaceData = {
  opportunities: [
    { title: 'Cold-chain logistics partner needed', org: 'Mekong AgriTech', tag: 'Logistics', note: 'Seeking distribution partner for perishable exports' },
    { title: 'Fintech API integration', org: 'Tonle Finance', tag: 'Technology', note: 'Looking for a payments integration partner' },
    { title: 'Retail expansion co-investment', org: 'Ballangk Mall', tag: 'Commerce', note: 'Open to strategic co-investment for 3 new locations' },
  ],
  providers: [
    { title: 'BrightPath Academy', org: 'Training provider', tag: 'Education', note: 'Investment-readiness and leadership training' },
    { title: 'PiNEX Pro', org: 'Media & events', tag: 'Marketing', note: 'Investor-facing content, media and event production' },
    { title: 'KhmerLegal Partners', org: 'Legal services', tag: 'Legal', note: 'Corporate structuring and securities counsel' },
  ],
  advisors: [
    { title: 'Sophea Chan', org: 'Fundraising advisor', tag: '38 sessions', note: 'Ex-VC associate; pitch deck and term sheet coaching' },
    { title: 'David Meas', org: 'Financial modeling advisor', tag: '24 sessions', note: 'CFO-as-a-service for growth-stage SMEs' },
    { title: 'Ratanak Sok', org: 'Export & logistics advisor', tag: '19 sessions', note: 'Regional distribution and customs strategy' },
  ],
  courses: [
    { title: 'Investment Readiness Bootcamp', org: '6 modules \u2022 Online', tag: 'Beginner', note: 'Pitch decks, financials, valuation and investor conversations' },
    { title: 'Financial Modeling for Founders', org: '4 modules \u2022 Online', tag: 'Intermediate', note: 'Build a fundable 3-year forecast from your own numbers' },
    { title: 'Term Sheet Negotiation', org: '3 modules \u2022 Online', tag: 'Advanced', note: 'Understand and negotiate common venture terms' },
  ],
  knowledge: [
    { title: 'Guide: preparing your cap table', org: 'Knowledge Center', tag: 'Article', note: 'A clean cap table before you raise \u2014 step by step' },
    { title: 'Guide: KYB documents checklist', org: 'Knowledge Center', tag: 'Article', note: 'What IDI needs to verify your business' },
    { title: 'Guide: reading your AI readiness score', org: 'Knowledge Center', tag: 'Article', note: 'What the score measures and how to improve it' },
  ],
};

// ---------- 3. Page markup ----------
document.getElementById('appMain').insertAdjacentHTML('beforeend', `

<section class="page" id="page-business-intel">
  <div class="page-head"><div><p class="eyebrow">COMPANY DILIGENCE</p><h1>Business Intelligence &amp; Verification</h1><p>Registration, ownership, industry classification, risk scoring and document history behind every verified badge.</p></div></div>
  <div class="stats-grid">
    <div class="module-stat-card"><span class="stat-icon purple">\u26E8</span><div><span>Companies verified</span><strong>1,248</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon green">\u25B2</span><div><span>Avg. risk score</span><strong>24</strong><small>Lower is safer</small></div></div>
    <div class="module-stat-card"><span class="stat-icon orange">\u25F3</span><div><span>Pending due diligence</span><strong>9</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon blue">\u25A6</span><div><span>Performance history</span><strong>3+ yrs</strong><small>Tracked per company</small></div></div>
  </div>
  <div class="flow-steps">
    ${['Profile submitted', 'Registration check', 'Ownership check', 'Document review', 'Risk scoring', 'Admin approval', 'Verified badge'].map((s, i) => `<div class="flow-step"><b>${i + 1}</b><strong>${s}</strong><small>Business due diligence process</small></div>`).join('')}
  </div>
  <article class="panel table-panel">
    <div class="panel-head"><div><h2>Verification pipeline</h2><p>Registration, ownership, industry classification and credibility rating</p></div></div>
    <div class="table-scroll"><table><thead><tr><th>Company</th><th>Registration</th><th>Ownership</th><th>Industry</th><th>Risk score</th><th>Credibility</th><th>Documents</th><th>Badge</th></tr></thead>
    <tbody>${biRows.map(r => `<tr><td><div class="table-company">${companyLogo(r.company)}<div><strong>${r.company.name}</strong><span>${r.company.type}</span></div></div></td><td><span class="status ready">${r.registration}</span></td><td><span class="status ${r.ownership === 'Verified' ? 'ready' : 'potential'}">${r.ownership}</span></td><td>${r.industry}</td><td><span class="risk-pill ${r.risk < 25 ? 'low' : r.risk < 40 ? 'medium' : 'high'}">${r.risk}</span></td><td>${r.credibility}/100</td><td>${r.docs} files</td><td>${r.verified ? verifiedBadge('company') : '<span class="status potential">Pending</span>'}</td></tr>`).join('')}</tbody></table></div>
  </article>
  <div class="dashboard-grid" style="margin-top:16px">
    <article class="panel">
      <div class="panel-head"><div><h2>Business document repository</h2><p>Registration, ownership and compliance documents on file</p></div></div>
      <div class="document-list">${dataRoomDocs.map(([icon, name, meta, status]) => `<div class="document-row"><span>${icon}</span><div><strong>${name}</strong><small>${meta}</small></div><b class="doc-status ${status === 'Approved' ? '' : 'pending'}">${status}</b></div>`).join('')}</div>
    </article>
    <aside class="panel">
      <div class="panel-head"><div><h2>Historical performance tracking</h2><p>Directory score trend, last 4 quarters</p></div></div>
      <div class="factor-list">${biRows.slice(0, 4).map(r => `<div class="factor-row"><span>${r.company.name.split(' ')[0]}</span><div class="factor-track"><i style="width:${r.credibility}%"></i></div><span>${r.credibility}</span></div>`).join('')}</div>
    </aside>
  </div>
</section>

<section class="page active" id="page-investors">
  <div class="page-head"><div><p class="eyebrow">CAPITAL RELATIONSHIP MANAGEMENT</p><h1>Investor &amp; Funding Management</h1><p>Investor profiles, onboarding, opportunity matching and portfolio performance.</p></div></div>
  <div class="module-note">Deal-stage funding activity lives in <b>Funding Requests</b> and <b>Deal Pipeline</b>. This workspace tracks the investors themselves.</div>
  <div class="stats-grid">
    <div class="module-stat-card"><span class="stat-icon purple">\u25A9</span><div><span>Active investors</span><strong>${investorDirectory.length}</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon blue">\u2197</span><div><span>Opportunities listed</span><strong>18</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon green">\u25B2</span><div><span>Avg. portfolio ROI</span><strong>22.4%</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon orange">\u2713</span><div><span>Investments this year</span><strong>7</strong></div></div>
  </div>
  <article class="panel table-panel">
    <div class="panel-head"><div><h2>Investor directory</h2><p>Profile, mandate, onboarding status and portfolio</p></div></div>
    <div class="table-scroll"><table><thead><tr><th>Investor</th><th>Type</th><th>Ticket size</th><th>Sectors</th><th>Onboarding</th><th>Portfolio</th><th>ROI</th></tr></thead>
    <tbody>${investorDirectory.map(inv => `<tr><td><div class="table-company"><span class="logo" style="background:${inv.color}">${initials(inv.name)}</span><div><strong>${inv.name}</strong><span>${inv.location}</span></div></div></td><td>${inv.type}</td><td>${inv.ticket}</td><td>${inv.sectors.slice(0, 2).join(', ')}</td><td><span class="status ${inv.status === 'Active' ? 'ready' : 'potential'}">${inv.status}</span></td><td>${inv.portfolio} companies</td><td>${inv.roi}%</td></tr>`).join('')}</tbody></table></div>
  </article>
  <div class="dashboard-grid" style="margin-top:16px">
    <article class="panel">
      <div class="panel-head"><div><h2>Investment screening &amp; approval</h2><p>Recent proposal decisions with reasons on file</p></div></div>
      <div class="workflow-alerts" style="grid-template-columns:1fr">${investorScreening.map(s => `<div class="workflow-alert ${s.status === 'success' ? 'success' : ''}"><strong>${s.company} \u2194 ${s.investor}</strong><p>${s.note}</p></div>`).join('')}</div>
    </article>
    <aside class="panel">
      <div class="panel-head"><div><h2>Portfolio tracking</h2><p>ROI monitoring by investor</p></div></div>
      <div class="factor-list">${investorDirectory.slice(0, 4).map(inv => `<div class="factor-row"><span>${inv.name.split(' ')[0]}</span><div class="factor-track"><i style="width:${Math.min(100, inv.roi * 3)}%"></i></div><span>${inv.roi}%</span></div>`).join('')}</div>
    </aside>
  </div>
</section>

<section class="page" id="page-data-rooms">
  <div class="page-head"><div><p class="eyebrow">CONFIDENTIAL DEAL DOCUMENTS</p><h1>Document &amp; Data Room Management</h1><p>Secure, permissioned document exchange for every active deal, with version control and access logs.</p></div><button class="secondary" id="dataRoomExport">Export activity log</button></div>
  <div class="stats-grid">
    <div class="module-stat-card"><span class="stat-icon purple">\u25A6</span><div><span>Active data rooms</span><strong>${dataRoomRows.length}</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon blue">\u2261</span><div><span>Documents stored</span><strong>214</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon orange">\u25F3</span><div><span>Pending approvals</span><strong>5</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon green">\u25F7</span><div><span>Expiring in 30 days</span><strong>3</strong></div></div>
  </div>
  <article class="panel table-panel">
    <div class="panel-head"><div><h2>Data rooms</h2><p>Documents, permission level, version and expiration</p></div></div>
    <div class="table-scroll"><table><thead><tr><th>Data room</th><th>Documents</th><th>Permission level</th><th>Version</th><th>Status</th><th>Expires</th><th></th></tr></thead>
    <tbody>${dataRoomRows.map(r => `<tr><td><strong>${r.name}</strong></td><td>${r.docs} files</td><td>${r.permission}</td><td>${r.version}</td><td><span class="status ${r.status === 'Active' ? 'ready' : r.status === 'In review' ? 'potential' : 'improve'}">${r.status}</span></td><td>${r.expires}</td><td><button class="text-btn data-room-open">Open room \u2192</button></td></tr>`).join('')}</tbody></table></div>
  </article>
  <div class="dashboard-grid" style="margin-top:16px">
    <article class="panel">
      <div class="panel-head"><div><h2>Sample room: Mekong AgriTech \u2194 Impact Asia Capital</h2><p>Upload, version control and approval workflow</p></div></div>
      <div class="document-list">${dataRoomDocs.map(([icon, name, meta, status]) => `<div class="document-row"><span>${icon}</span><div><strong>${name}</strong><small>${meta}</small></div><b class="doc-status ${status === 'Approved' ? '' : 'pending'}">${status}</b></div>`).join('')}</div>
    </article>
    <aside class="panel">
      <div class="panel-head"><div><h2>Access activity log</h2><p>Who viewed, downloaded or commented</p></div></div>
      <div class="activity-list">
        <div class="activity"><div class="avatar" style="background:#d3f2e6">IC</div><p><strong>Impact Asia Capital</strong> viewed the financial model</p><time>18 min ago</time></div>
        <div class="activity"><div class="avatar" style="background:#ffe2c7">MA</div><p><strong>Mekong AgriTech</strong> uploaded a revised cap table</p><time>2 hours ago</time></div>
        <div class="activity"><div class="avatar" style="background:#ddd3ff">AD</div><p><strong>Admin</strong> approved the pitch deck for release</p><time>Yesterday</time></div>
      </div>
    </aside>
  </div>
</section>

<section class="page" id="page-ai-intelligence">
  <div class="page-head"><div><p class="eyebrow">MACHINE-ASSISTED REVIEW</p><h1>AI-Powered Intelligence</h1><p>AI scoring, analysis and generated reports across companies, investors and deals.</p></div></div>
  <div class="stats-grid">
    <div class="module-stat-card"><span class="stat-icon purple">\u2726</span><div><span>Companies AI-scored</span><strong>86</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon green">\u2713</span><div><span>Avg. confidence</span><strong>91%</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon orange">!</span><div><span>Risk flags this week</span><strong>4</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon blue">\u25A6</span><div><span>Reports generated</span><strong>132</strong></div></div>
  </div>
  <div class="ai-function-grid">
    ${aiFunctions.map(([name, desc, score]) => `<div class="ai-function-card"><div class="score-ring" style="--score:${score}"><strong>${score}</strong></div><div><h3>${name}</h3><p>${desc}</p><button class="ai-run-btn" data-fn="${name}">Run analysis</button></div></div>`).join('')}
  </div>
  <article class="panel table-panel">
    <div class="panel-head"><div><h2>Recent AI evaluations</h2><p>Score, confidence and generation time</p></div></div>
    <div class="table-scroll"><table><thead><tr><th>Company</th><th>Evaluation type</th><th>Score</th><th>Confidence</th><th>Generated</th><th></th></tr></thead>
    <tbody>${aiEvaluations.map(([c, t, s, conf, when]) => `<tr><td><strong>${c}</strong></td><td>${t}</td><td>${s}/100</td><td><span class="confidence-pill">${conf}% confidence</span></td><td>${when}</td><td><button class="text-btn ai-view-report">View report \u2192</button></td></tr>`).join('')}</tbody></table></div>
  </article>
</section>

<section class="page" id="page-financial-analysis">
  <div class="page-head"><div><p class="eyebrow">STANDARDIZED FINANCIAL REVIEW</p><h1>Financial Analysis</h1><p>Statement review, ratio calculation, forecasting and valuation estimation for every funding request.</p></div></div>
  <div class="stats-grid">
    <div class="module-stat-card"><span class="stat-icon purple">\u25A6</span><div><span>Statements on file</span><strong>86</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon green">\u25B2</span><div><span>Avg. profitability</span><strong>18%</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon orange">\u25A2</span><div><span>Forecasts generated</span><strong>42</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon blue">$</span><div><span>Valuations estimated</span><strong>37</strong></div></div>
  </div>
  <article class="panel table-panel">
    <div class="panel-head"><div><h2>Financial review by company</h2><p>Revenue, expense, profitability, cash flow and valuation estimate</p></div></div>
    <div class="table-scroll"><table><thead><tr><th>Company</th><th>Revenue</th><th>Expenses</th><th>Profitability</th><th>Cash flow</th><th>Valuation estimate</th></tr></thead>
    <tbody>${financialRows.map(r => `<tr><td><strong>${r.company}</strong></td><td>${r.revenue}</td><td>${r.expense}</td><td class="${r.profitability.startsWith('-') ? 'red-text' : 'green-text'}">${r.profitability}</td><td>${r.cashflow}</td><td>${r.valuation}</td></tr>`).join('')}</tbody></table></div>
  </article>
  <div class="dashboard-grid" style="margin-top:16px">
    <article class="panel">
      <div class="panel-head"><div><h2>Sample ratio breakdown \u2014 Mekong AgriTech</h2><p>Financial ratio calculation</p></div></div>
      <div class="factor-list">${financialRatios.map(([name, val]) => `<div class="factor-row"><span>${name}</span><div class="factor-track"><i style="width:${val}%"></i></div><span>${val}</span></div>`).join('')}</div>
    </article>
    <aside class="panel">
      <div class="panel-head"><div><h2>Investment return calculator</h2><p>Illustrative example only</p></div></div>
      <div class="kpi-mini-grid">
        <div><span>Investment</span><strong>$500,000</strong></div>
        <div><span>Equity offered</span><strong>15%</strong></div>
        <div><span>Exit valuation (5yr)</span><strong>$9.2M</strong></div>
        <div><span>Projected return</span><strong>2.8x</strong></div>
      </div>
    </aside>
  </div>
</section>

<section class="page" id="page-compliance">
  <div class="page-head"><div><p class="eyebrow">GOVERNANCE & CONTROLS</p><h1>Compliance &amp; Governance</h1><p>KYC, KYB, AML screening, compliance checklists, regulatory tracking and audit trail.</p></div></div>
  <div class="stats-grid">
    <div class="module-stat-card"><span class="stat-icon purple">\u2696</span><div><span>KYC complete</span><strong>79</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon blue">\u2696</span><div><span>KYB complete</span><strong>74</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon orange">!</span><div><span>AML flags</span><strong>3</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon green">\u2713</span><div><span>Audit items open</span><strong>5</strong></div></div>
  </div>
  <div class="flow-steps">
    ${['KYC workflow', 'KYB workflow', 'AML screening', 'Compliance checklist', 'Regulatory tracking', 'Audit trail', 'Approval'].map((s, i) => `<div class="flow-step"><b>${i + 1}</b><strong>${s}</strong><small>Governance control gate</small></div>`).join('')}
  </div>
  <article class="panel table-panel">
    <div class="panel-head"><div><h2>Entity compliance status</h2><p>KYC, KYB, AML screening and checklist completion</p></div></div>
    <div class="table-scroll"><table><thead><tr><th>Entity</th><th>KYC</th><th>KYB</th><th>AML screening</th><th>Checklist</th><th>Last audit</th></tr></thead>
    <tbody>${complianceRows.map(r => `<tr><td><strong>${r.entity}</strong></td><td><span class="status ${r.kyc}">${r.kyc === 'ready' ? 'Cleared' : r.kyc === 'potential' ? 'In review' : 'Action needed'}</span></td><td><span class="status ${r.kyb}">${r.kyb === 'ready' ? 'Cleared' : r.kyb === 'potential' ? 'In review' : 'Action needed'}</span></td><td><span class="status ${r.aml}">${r.aml === 'ready' ? 'Clear' : r.aml === 'potential' ? 'In review' : 'Flagged'}</span></td><td><div class="mini-progress"><i style="--w:${r.checklist}%"></i>${r.checklist}%</div></td><td>${r.audit}</td></tr>`).join('')}</tbody></table></div>
  </article>
  <div class="module-note" style="margin-top:16px">Workflow controls are informed by <b>FATF</b> risk-based due diligence, <b>OECD</b> responsible-business-conduct principles, and <b>IFC</b> environmental &amp; social review. Local securities, tax, and licensing requirements should be finalized with qualified Cambodian counsel.</div>
</section>

<section class="page" id="page-meetings">
  <div class="page-head"><div><p class="eyebrow">COMMUNICATION CENTER</p><h1>Meetings &amp; Video Calls</h1><p>Schedule and track investor meetings. For messages and notifications, see <b>Messages</b> and <b>Notification Center</b>.</p></div><button class="primary" id="scheduleMeeting">\uFF0B Schedule meeting</button></div>
  <div class="stats-grid">
    <div class="module-stat-card"><span class="stat-icon purple">\u25B6</span><div><span>Meetings scheduled</span><strong>14</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon blue">\u25B6</span><div><span>Video calls this month</span><strong>9</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon green">\u2713</span><div><span>Avg. response time</span><strong>3h</strong></div></div>
    <div class="module-stat-card"><span class="stat-icon orange">\u25CE</span><div><span>Announcements active</span><strong>${announcementRows.length}</strong></div></div>
  </div>
  <article class="panel table-panel">
    <div class="panel-head"><div><h2>Upcoming meetings</h2><p>Type, time and confirmation status</p></div></div>
    <div class="table-scroll"><table><thead><tr><th>Meeting</th><th>Type</th><th>Date &amp; time</th><th>Status</th><th></th></tr></thead>
    <tbody>${meetingRows.map(([name, type, when, status]) => `<tr><td><strong>${name}</strong></td><td>${type}</td><td>${when}</td><td><span class="status ${status === 'Confirmed' ? 'ready' : 'potential'}">${status}</span></td><td><button class="text-btn meeting-join">${type === 'Video call' ? 'Join link \u2192' : 'View details \u2192'}</button></td></tr>`).join('')}</tbody></table></div>
  </article>
  <article class="panel" style="margin-top:16px">
    <div class="panel-head"><div><h2>System announcements</h2><p>Platform-wide notices to members and staff</p></div></div>
    <div class="workflow-alerts" style="grid-template-columns:1fr 1fr">${announcementRows.map(([from, msg, when]) => `<div class="workflow-alert"><strong>${from}</strong><p>${msg}</p><small style="color:var(--muted);font-size:8px">${when}</small></div>`).join('')}</div>
  </article>
</section>

<section class="page" id="page-system-monitoring">
  <div class="page-head"><div><p class="eyebrow">PLATFORM HEALTH</p><h1>System Monitoring</h1><p>Uptime, service status and background jobs. For user roles, approvals and content, see <b>Admin Staff &amp; Roles</b>, <b>Approvals &amp; Verification</b>, and <b>All Page Management</b>.</p></div></div>
  <div class="monitor-grid">
    <div class="monitor-card"><span>UPTIME (30 DAYS)</span><strong>99.98%</strong><i class="monitor-status">Operational</i></div>
    <div class="monitor-card"><span>ACTIVE SESSIONS</span><strong>342</strong><i class="monitor-status">Live</i></div>
    <div class="monitor-card"><span>API LATENCY</span><strong>118ms</strong><i class="monitor-status">Normal</i></div>
    <div class="monitor-card"><span>BACKGROUND JOBS</span><strong>6</strong><i class="monitor-status">Running</i></div>
  </div>
  <article class="panel table-panel">
    <div class="panel-head"><div><h2>Service status</h2><p>Core platform services and dependencies</p></div></div>
    <div class="table-scroll"><table><thead><tr><th>Service</th><th>Status</th><th>Latency</th><th>Last check</th></tr></thead>
    <tbody>${monitorServices.map(([name, status, latency, checked]) => `<tr><td><strong>${name}</strong></td><td><span class="monitor-status ${status !== 'up' ? status : ''}">${status === 'up' ? 'Operational' : status === 'degraded' ? 'Degraded' : 'Down'}</span></td><td>${latency}</td><td>${checked}</td></tr>`).join('')}</tbody></table></div>
  </article>
  <article class="panel" style="margin-top:16px">
    <div class="panel-head"><div><h2>Recent system events</h2><p>Background jobs, scaling actions and scheduled tasks</p></div></div>
    <div class="activity-list">${monitorEvents.map(([icon, title, desc, when]) => `<div class="activity"><div class="avatar" style="background:#eaf0ff;color:#5b4bdb">${icon}</div><p><strong>${title}</strong> \u2014 ${desc}</p><time>${when}</time></div>`).join('')}</div>
  </article>
</section>

<section class="page" id="page-marketplace">
  <div class="page-head"><div><p class="eyebrow">BEYOND THE DEAL</p><h1>Ecosystem Marketplace</h1><p>Service providers, expert advisors, training and shared knowledge across the ecosystem.</p></div></div>
  <div class="market-tabs" id="marketTabs">
    <button class="active" data-market-tab="opportunities">Opportunities</button>
    <button data-market-tab="providers">Service Providers</button>
    <button data-market-tab="advisors">Expert Advisors</button>
    <button data-market-tab="courses">Training &amp; Courses</button>
    <button data-market-tab="knowledge">Knowledge Center</button>
  </div>
  ${Object.entries(marketplaceData).map(([key, items]) => `<div class="market-panel${key === 'opportunities' ? ' active' : ''}" data-market-panel="${key}"><div class="market-grid">${items.map(it => `<article class="market-card"><span class="logo" style="background:#5b4bdb;border-radius:10px;display:grid;place-items:center;color:#fff;font-weight:700">${initials(it.title)}</span><h3>${it.title}</h3><p>${it.note}</p><div class="tags"><span class="tag">${it.org}</span><span class="tag">${it.tag}</span></div><div class="market-card-foot"><span>IDI ecosystem</span><button class="text-btn market-connect">Connect \u2192</button></div></article>`).join('')}</div></div>`).join('')}
</section>
`);

// ---------- 4. Reports & Analytics extras ----------
document.querySelector('#page-reports .executive-report-grid')?.insertAdjacentHTML('beforeend', `
<article class="panel">
  <div class="panel-head"><div><h2>Investor behavior analytics</h2><p>Engagement across the investor base</p></div></div>
  <div class="kpi-mini-grid">
    <div><span>Avg. response time</span><strong>3h</strong></div>
    <div><span>Data rooms opened</span><strong>68%</strong></div>
    <div><span>Repeat investors</span><strong>41%</strong></div>
    <div><span>Meetings per deal</span><strong>2.4</strong></div>
  </div>
</article>
<article class="panel report-wide">
  <div class="panel-head"><div><h2>Market trend reports</h2><p>Sector momentum informing investment focus</p></div></div>
  <div class="factor-list">
    <div class="factor-row"><span>Fintech</span><div class="factor-track"><i style="width:82%"></i></div><span>82</span></div>
    <div class="factor-row"><span>AgriTech</span><div class="factor-track"><i style="width:74%"></i></div><span>74</span></div>
    <div class="factor-row"><span>Logistics</span><div class="factor-track"><i style="width:66%"></i></div><span>66</span></div>
    <div class="factor-row"><span>Commerce</span><div class="factor-track"><i style="width:58%"></i></div><span>58</span></div>
  </div>
</article>`);

// ---------- 5. Interactions ----------
document.getElementById('dataRoomExport')?.addEventListener('click', () => showToast('Export started', 'Access activity log is being prepared for download.'));
document.querySelectorAll('.data-room-open').forEach(b => b.onclick = () => showToast('Data room opened', 'Documents, versions and permissions are ready to review.'));
document.querySelectorAll('.ai-run-btn').forEach(b => b.onclick = () => showToast('AI analysis started', `${b.dataset.fn} is running on the latest verified data.`));
document.querySelectorAll('.ai-view-report').forEach(b => b.onclick = () => showToast('Report opened', 'The full AI-generated report is ready to review.'));
document.getElementById('scheduleMeeting')?.addEventListener('click', () => showToast('Meeting scheduler', 'Pick a company, investor and available time slot to send an invite.'));
document.querySelectorAll('.meeting-join').forEach(b => b.onclick = () => showToast('Meeting link ready', 'A secure video link has been copied for this meeting.'));
document.querySelectorAll('.market-connect').forEach(b => b.onclick = () => showToast('Introduction requested', 'The ecosystem team will confirm the connection shortly.'));
document.getElementById('marketTabs')?.addEventListener('click', e => {
  const btn = e.target.closest('[data-market-tab]'); if (!btn) return;
  document.querySelectorAll('#marketTabs button').forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('[data-market-panel]').forEach(p => p.classList.toggle('active', p.dataset.marketPanel === btn.dataset.marketTab));
});
