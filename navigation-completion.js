const systemPageCatalog=[
  ['directory','◫','Business Directory','Companies and verification'],['news','▥','Investment News','Publishing and distribution'],['partners','◎','VC & Strategic Partners','Organizations and mandates'],['campaigns','◉','Campaigns','Lifecycle and applications'],['investment-flow','⇄','Investment Flow','Stage-gated transactions'],['investment-operations','◈','Investment Operations','Assessment through exit'],['funding-request','↗','Funding Requests','Premium and VIP applications'],['memberships','♙','Membership Management','Members, renewals and approvals'],['billing','▣','Billing & Renewal','Invoices and KHQR payment'],['pitching','◇','Pitching Program','Applications and scoring'],['events','◷','Events & Invitations','Events and registration'],['pipeline','↗','Deal Pipeline','Opportunity tracking'],['messages','○','Messages','Secure conversations'],['reports','▤','Reports & Analytics','Performance reporting'],['staff','⚿','Admin Staff & Roles','Permissions and security']
];
systemPageCatalog.forEach(([page])=>{if(loginProfiles.admin&&!loginProfiles.admin.allowed.includes(page))loginProfiles.admin.allowed.push(page)});
const accountLogoutButton=document.getElementById('logoutButton');
accountLogoutButton.setAttribute('aria-label','Log out of IDI APP');accountLogoutButton.title='Log out of IDI APP';accountLogoutButton.innerHTML='↪ <span>Logout</span>';
document.getElementById('notificationButton').insertAdjacentHTML('afterend','<button class="secondary top-logout" id="topLogoutButton" aria-label="Log out of IDI APP"><span>↪</span><span>Log out</span></button>');
document.getElementById('topLogoutButton').onclick=()=>accountLogoutButton.click();
function renderSystemPageDirectory(){
  const grid=document.getElementById('systemPageGrid');if(!grid)return;
  const allowed=new Set(currentMember?.allowed||[]),admin=!!currentMember?.isAdmin;
  grid.innerHTML=systemPageCatalog.map(([page,icon,title,description])=>{const available=admin||allowed.has(page),exists=!!document.getElementById(`page-${page}`),openable=available&&exists,tag=openable?'a':'button',attrs=openable?`href="#${page}"`:'disabled';return `<${tag} class="system-page-card" data-system-page="${page}" ${attrs}><span>${icon}</span><div><strong>${title}</strong><small>${exists?description:'Page module unavailable'}</small></div><b>${openable?'Open':'Restricted'}</b></${tag}>`}).join('');
  const openCount=systemPageCatalog.filter(([page])=>(admin||allowed.has(page))&&document.getElementById(`page-${page}`)).length;document.getElementById('systemPageCount').textContent=`${openCount} of ${systemPageCatalog.length} available`;
  document.querySelectorAll('[data-system-page]:not([disabled])').forEach(button=>button.onclick=()=>{navigate(button.dataset.systemPage);if(button.dataset.systemPage==='campaigns'&&typeof renderCampaigns==='function')renderCampaigns()});
}
function completeNavigationForProfile(){document.querySelectorAll('.nav-item[data-page]').forEach(item=>item.classList.toggle('access-hidden',!currentMember?.isAdmin&&!currentMember?.allowed?.includes(item.dataset.page)));renderSystemPageDirectory()}
const completedNavigationLogin=loginAs;loginAs=function(key){completedNavigationLogin(key);completeNavigationForProfile()};
completeNavigationForProfile();
