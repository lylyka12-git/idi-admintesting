/* Ensures visible prototype buttons always have an accessible destination page. */
const accessActionCatalog={
  'View profile':{title:'Profile Detail',type:'Member / partner profile',steps:['Open verified identity and organization record','Review contact, role, documents and activity history','Allow authorized staff to update notes and follow-up actions']},
  'Receipt':{title:'Payment Receipt',type:'Finance record',steps:['Show invoice and payment method','Display KHQR/ABA transaction reference','Allow download, resend, or finance review']},
  'Funding preparation guide':{title:'Funding Preparation Guide',type:'Investment support',steps:['Review required documents and eligibility gates','Prepare pitch deck, financial model and cap table','Request support before submitting funding request']},
  'How locations work':{title:'Business Mapping Guide',type:'Map and privacy',steps:['Explain how Google Map links are verified','Show category colors and entity pin types','Control member-only map visibility and location updates']},
  'Export audit log':{title:'Audit Log Export',type:'Admin governance',steps:['Select approval, CMS, member, company or payment logs','Choose PDF/Excel format and date range','Generate export with staff user and timestamp']},
  'Export registrations':{title:'Event Registration Export',type:'Event operations',steps:['Select event and attendee fields','Filter checked-in, invited, public and member registrations','Export registration and attendance report']},
  'Add managed page':{title:'Add Managed CMS Page',type:'Admin CMS',steps:['Define page title, route and page type','Assign owner role and editing permission','Create draft, preview responsive view and publish']},
  'Mark all as read':{title:'Notification Management',type:'Communication center',steps:['Review unread notification list','Update delivery preference and read status','Keep audit trail for system notifications']},
  'Schedule report':{title:'Schedule Report',type:'Reports and analytics',steps:['Choose report type and reporting period','Select recipients and delivery frequency','Save scheduled report and archive history']},
  'Export PDF':{title:'Export Report',type:'Reports and analytics',steps:['Generate report package','Include charts, tables and executive summary','Download or send to selected recipients']},
  'View archive':{title:'Report Archive',type:'Reports and analytics',steps:['Search generated reports','Open previous PDF/Excel files','Track scheduled delivery history']},
  'Invite admin staff':{title:'Invite Admin Staff',type:'Security and roles',steps:['Enter staff identity and work email','Assign role and exact permissions','Send invitation and track acceptance']},
  'Start investment case':{title:'Start Investment Case',type:'Investment flow',steps:['Select verified company and investor/funder','Create mutual-interest request','Open evidence checklist and stage-gate timeline']},
  'New SME application':{title:'New SME Application',type:'Investment operations',steps:['Register company and profile documents','Run readiness assessment','Route to committee, matching or support program']},
  'Create opportunity':{title:'Create Deal Opportunity',type:'Deal pipeline',steps:['Create company-investor opportunity record','Assign stage, value and next action','Track due diligence, term sheet and closing']},
  'New message':{title:'New Message',type:'Communication center',steps:['Choose member, partner or investor recipient','Send in-app and optional email notification','Record conversation history']},
  'Create campaign':{title:'Create Campaign',type:'Partner campaign',steps:['Define mandate, deadline and target sector','Select membership audience','Submit for IDI admin approval and publication']},
  'List your company':{title:'Company Registration',type:'Business directory',steps:['Create company profile with logo, cover and services','Upload verification documents','Submit for IDI admin review and blue-tick verification']},
  'Member login':{title:'Member Login',type:'Account access',steps:['Open secure sign-in','Route account by role and membership type','Protect admin access and session controls']},
  'Join the ecosystem':{title:'Membership Registration',type:'Onboarding',steps:['Choose membership type','Submit personal and company information','Complete payment and verification requirements']},
  'Explore opportunities':{title:'IDI Capital Network',type:'Investment discovery',steps:['Browse public companies, partners and financial news','Login for member-only mapping and funding tools','Connect with campaigns, events and investor programs']}
};
function normalizeActionLabel(text){return String(text||'').replace(/[＋↗→✓•]/g,' ').replace(/\s+/g,' ').trim()}
function actionDetailFor(label){
  const normalized=normalizeActionLabel(label);
  return accessActionCatalog[normalized]||Object.entries(accessActionCatalog).find(([key])=>normalized.toLowerCase().includes(key.toLowerCase()))?.[1]||{title:normalized||'Workflow Detail',type:'Platform workflow',steps:['Open the related workspace page','Review required records, permissions and supporting data','Continue the workflow with audit trail and administrator controls']};
}
function ensureActionDetailPage(){
  if(document.getElementById('page-action-detail'))return;
  document.getElementById('appMain')?.insertAdjacentHTML('beforeend',`<section class="page" id="page-action-detail"><div class="page-head"><div><p class="eyebrow" id="actionDetailEyebrow">PLATFORM WORKFLOW</p><h1 id="actionDetailTitle">Workflow Detail</h1><p id="actionDetailSubtitle">This destination page ensures every button opens a complete page.</p></div><button class="secondary" id="actionDetailBack">← Back to directory</button></div><div class="action-detail-layout"><article class="panel action-detail-main"><div class="action-detail-icon">◆</div><h2 id="actionDetailType">Platform workflow</h2><p id="actionDetailDescription">The selected action is connected to a complete workflow destination.</p><div class="action-step-list" id="actionDetailSteps"></div></article><aside class="panel action-detail-side"><h2>Page access status</h2><div class="document-checklist"><article><span>✓</span><div><strong>Accessible page</strong><small>The button opens this workflow screen instead of doing nothing.</small></div><em>READY</em></article><article><span>✓</span><div><strong>Admin editable</strong><small>Content and page label can be controlled from All Page Management.</small></div><em>CMS</em></article><article><span>✓</span><div><strong>Audit ready</strong><small>Production workflow can record staff, time, note and action.</small></div><em>LOG</em></article></div><button class="primary" id="actionDetailContinue">Continue workflow</button></aside></div></section>`);
  document.getElementById('actionDetailBack').onclick=()=>navigate('directory');
  document.getElementById('actionDetailContinue').onclick=()=>showToast('Workflow ready','This action has a destination page, permission model, and production workflow placeholder.');
  if(window.systemPageCatalog&&!systemPageCatalog.some(row=>row[0]==='action-detail'))systemPageCatalog.push(['action-detail','◆','Action Detail','Universal workflow destination']);
}
function openActionDetail(label,source=''){
  ensureActionDetailPage();
  const detail=actionDetailFor(label);
  document.getElementById('actionDetailEyebrow').textContent=detail.type.toUpperCase();
  document.getElementById('actionDetailTitle').textContent=detail.title;
  document.getElementById('actionDetailSubtitle').textContent=source?`Opened from: ${source}`:'This button is connected to a full workflow destination page.';
  document.getElementById('actionDetailType').textContent=detail.type;
  document.getElementById('actionDetailDescription').textContent=`${detail.title} is prepared as an accessible page with required workflow steps, controls and CMS/admin governance.`;
  document.getElementById('actionDetailSteps').innerHTML=detail.steps.map((step,index)=>`<article><span>${index+1}</span><div><strong>${step}</strong><small>Connected workflow step</small></div></article>`).join('');
  document.getElementById('landingPage').style.display='none';
  document.querySelectorAll('.app-shell').forEach(el=>el.classList.add('authenticated'));
  navigate('action-detail');
}
function completeUnresolvedButtonAccess(root=document){
  root.querySelectorAll('button').forEach(button=>{
    if(button.dataset.accessBound||button.closest('.modal-backdrop')||button.closest('form')||button.classList.contains('modal-close'))return;
    if(button.dataset.page||button.dataset.demo||button.dataset.systemPage||button.dataset.managedFilter||button.dataset.directoryView||button.dataset.publicPage||button.dataset.publicExpand)return;
    const id=button.id||'',label=normalizeActionLabel(button.textContent);
    if(!label||['Grid','List','Compact','All','Unread','Investors'].includes(label))return;
    if(button.onclick||id.match(/Login|logout|Logout|quickLogin|adminLogin|headerLogin|footerLogin|joinPlatform|listCompanyButton|generateKhqr|completeDemoPayment|openNewsComposer|campaignPageCreate|createDeal|newMessage|scheduleReport|exportReport|inviteAdminStaff|startInvestmentCase|opsNewApplication|fundingGuidance|mappingHelp|approvalAuditExport|exportRegistrations|newPublicPage|markNotificationsRead/))return;
    button.dataset.accessBound='true';
    button.onclick=()=>openActionDetail(label,id||'button');
  });
  root.querySelectorAll('.nav-item[data-page]').forEach(button=>{
    if(button.dataset.navAccessBound)return;
    button.dataset.navAccessBound='true';
    button.addEventListener('click',event=>{
      const page=button.dataset.page;
      if(document.getElementById(`page-${page}`))return;
      event.preventDefault();event.stopPropagation();
      openActionDetail(button.textContent,page);
    },true);
  });
}
function upgradeKnownShortcutButtons(){
  const bindings={
    fundingGuidance:'Funding preparation guide',
    mappingHelp:'How locations work',
    approvalAuditExport:'Export audit log',
    exportRegistrations:'Export registrations',
    newPublicPage:'Add managed page',
    startInvestmentCase:'Start investment case',
    opsNewApplication:'New SME application',
    listCompanyButton:'List your company'
  };
  Object.entries(bindings).forEach(([id,label])=>{const button=document.getElementById(id);if(button&&!button.dataset.fullPageShortcut){button.dataset.fullPageShortcut='true';const previous=button.onclick;button.onclick=event=>{if(previous&&id==='listCompanyButton')return previous.call(button,event);openActionDetail(label,id)}}});
  document.querySelectorAll('[data-report-close], [data-news-close], [data-login-close]').forEach(button=>button.dataset.accessBound='true');
}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  const captureBindings={fundingGuidance:'Funding preparation guide',mappingHelp:'How locations work',approvalAuditExport:'Export audit log',exportRegistrations:'Export registrations',newPublicPage:'Add managed page',startInvestmentCase:'Start investment case'};
  const label=captureBindings[button.id];if(!label)return;
  event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
  openActionDetail(label,button.id);
},true);
ensureActionDetailPage();
upgradeKnownShortcutButtons();
completeUnresolvedButtonAccess();
new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)completeUnresolvedButtonAccess(node)}))).observe(document.body,{childList:true,subtree:true});
