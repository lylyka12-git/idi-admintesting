/* Member Rewards & Redemption — points earned for using platform functions, kept on the
   member's profile, redeemable for partner and event vouchers. Real (in-browser) points
   engine: navigate() is wrapped so points are actually awarded and persisted per demo login. */

// ---------- 1. Register the page ----------
if (!systemPageCatalog.some(row => row[0] === 'rewards')) systemPageCatalog.push(['rewards', '\u25C6', 'Member Rewards', 'Points, vouchers and partner discounts']);
Object.values(loginProfiles).forEach(profile => { if (!profile.allowed.includes('rewards')) profile.allowed.push('rewards'); });

const expansionNav = document.getElementById('expansionNav');
(expansionNav || document.querySelectorAll('#sidebar nav')[1]).insertAdjacentHTML('beforeend', `<button class="nav-item" data-page="rewards"><span>\u25C6</span> Member Rewards <em id="rewardsNavCount"></em></button>`);
document.querySelector('[data-page="rewards"]').onclick = () => navigate('rewards');

// visible in the profile: topbar badge + sidebar mini line
document.getElementById('memberTierChip')?.insertAdjacentHTML('beforebegin', `<button class="rewards-topbar-badge" id="rewardsTopBadge">\u25C6 <span id="rewardsTopBadgeValue">0</span> pts</button>`);
document.getElementById('rewardsTopBadge').onclick = () => navigate('rewards');
document.getElementById('sidebarRole')?.insertAdjacentHTML('afterend', `<small class="rewards-mini" id="sidebarPoints">\u25C6 0 pts</small>`);

// ---------- 2. Points rules ----------
const pointsPerPage = {
  directory: 5, news: 5, partners: 5, 'investment-flow': 10, 'investment-operations': 10,
  'funding-request': 15, memberships: 5, billing: 5, pitching: 10, events: 5, pipeline: 10,
  messages: 5, reports: 10, 'business-intel': 10, investors: 10, 'data-rooms': 10,
  'ai-intelligence': 15, 'financial-analysis': 15, compliance: 10, meetings: 5,
  marketplace: 10, campaigns: 5, notifications: 2,
};
const earningRulesDisplay = [
  ['View Business Directory', 5], ['Read Investment News', 5], ['Open Investment Flow / Operations', 10],
  ['Submit a Funding Request', 15], ['Run an AI Intelligence report', 15], ['RSVP to an Event', 5],
  ['Explore the Ecosystem Marketplace', 10], ['Review Financial Analysis', 15],
];
const tierMultiplier = tier => tier === 'VIP' ? 1.5 : tier === 'Premium' ? 1.25 : 1;

const voucherCatalog = [
  { id: 'ballangk10', partner: 'Ballangk Mall', logo: 'assets/organization-logos/ballangk-mall.png', title: '10% off any Ballangk Mall order', type: 'Partner discount \u2022 ballangkmall.com', cost: 150 },
  { id: 'ballangk20', partner: 'Ballangk Mall', logo: 'assets/organization-logos/ballangk-mall.png', title: '$20 off orders over $150', type: 'Partner discount \u2022 ballangkmall.com', cost: 400 },
  { id: 'pinexpro15', partner: 'PiNEX Pro', logo: 'assets/organization-logos/pinex-pro.png', title: '15% off media & event production', type: 'Partner discount \u2022 pinex.pro', cost: 200 },
  { id: 'pinexbeauty', partner: 'PiNEX Beauty', logo: 'assets/organization-logos/pinex-beauty.png', title: '$10 off any PiNEX Beauty service', type: 'Partner discount \u2022 pinex.pro', cost: 120 },
  { id: 'idievent25', partner: 'IDI APP', logo: 'assets/idi-logo.jpg', title: '25% off an IDI event ticket', type: 'Event discount', cost: 250 },
  { id: 'idieventvip', partner: 'IDI APP', logo: 'assets/idi-logo.jpg', title: 'Free VIP seating upgrade at any IDI event', type: 'Event discount', cost: 600 },
];

// ---------- 3. Points engine (per demo profile, persisted in localStorage) ----------
let rewardsKey = 'guest';
let rewardsState = { balance: 0, lifetime: 0, earnedPages: [], history: [], redeemed: [] };

function loadRewardsState(key) {
  rewardsKey = key;
  try {
    const saved = JSON.parse(localStorage.getItem(`idi-rewards-${key}`) || 'null');
    if (saved) { rewardsState = saved; return; }
  } catch (e) { /* ignore corrupt storage */ }
  rewardsState = { balance: 100, lifetime: 100, earnedPages: [], history: [{ label: 'Welcome bonus', points: 100, when: 'Account created' }], redeemed: [] };
  saveRewardsState();
}
function saveRewardsState() {
  try { localStorage.setItem(`idi-rewards-${rewardsKey}`, JSON.stringify(rewardsState)); } catch (e) { /* storage unavailable */ }
}
function updateRewardsBadges() {
  const topVal = document.getElementById('rewardsTopBadgeValue'); if (topVal) topVal.textContent = rewardsState.balance.toLocaleString();
  const mini = document.getElementById('sidebarPoints'); if (mini) mini.innerHTML = `\u25C6 ${rewardsState.balance.toLocaleString()} pts`;
  const navCount = document.getElementById('rewardsNavCount'); if (navCount) navCount.textContent = rewardsState.redeemed.length ? '' : '';
}
function awardPoints(page) {
  const base = pointsPerPage[page];
  if (!base || rewardsState.earnedPages.includes(page)) return;
  const mult = tierMultiplier(currentMember?.tier);
  const amount = Math.round(base * mult);
  rewardsState.balance += amount; rewardsState.lifetime += amount; rewardsState.earnedPages.push(page);
  rewardsState.history.unshift({ label: `Used ${pageLabel(page)}`, points: amount, when: 'Just now' });
  saveRewardsState(); updateRewardsBadges();
  if (document.getElementById('page-rewards')?.classList.contains('active')) renderRewardsPage();
  showToast(`+${amount} points`, `Earned for using ${pageLabel(page)}.`);
}
function pageLabel(page) {
  const item = systemPageCatalog.find(row => row[0] === page);
  return item ? item[2] : page;
}

// wrap navigate() so real navigation actually earns points, matching the loginAs wrap pattern used elsewhere
const rewardsNavigateBase = navigate;
navigate = function (page) { rewardsNavigateBase(page); awardPoints(page); if (page === 'rewards') renderRewardsPage(); };

// reload the points wallet whenever a demo profile logs in
const rewardsLoginBase = loginAs;
loginAs = function (key) { rewardsLoginBase(key); loadRewardsState(key); updateRewardsBadges(); };

// ---------- 4. Page markup ----------
document.getElementById('appMain').insertAdjacentHTML('beforeend', `
<section class="page" id="page-rewards">
  <div class="page-head"><div><p class="eyebrow">LOYALTY & ENGAGEMENT</p><h1>Member Rewards &amp; Redemption</h1><p>Earn points for using IDI APP, then redeem them for partner discounts and event pricing.</p></div></div>
  <div class="rewards-hero">
    <div class="balance"><strong id="rewardsBalanceBig">0</strong><span>Points available</span></div>
    <div class="rewards-hero-facts">
      <div><span>Lifetime points earned</span><strong id="rewardsLifetime">0</strong></div>
      <div><span>Vouchers redeemed</span><strong id="rewardsRedeemedCount">0</strong></div>
      <div><span>Partner network</span><strong>${new Set(voucherCatalog.map(v => v.partner)).size} partners</strong></div>
    </div>
    <div class="rewards-multiplier" id="rewardsMultiplierNote">Standard earning rate</div>
  </div>
  <div class="dashboard-grid">
    <article class="panel">
      <div class="panel-head"><div><h2>How you earn points</h2><p>Points post automatically the first time you use a function each session</p></div></div>
      <div class="earning-rules-list">${earningRulesDisplay.map(([label, pts]) => `<div class="earning-rule"><span>${label}</span><b>+${pts} pts</b></div>`).join('')}</div>
    </article>
    <aside class="panel">
      <div class="panel-head"><div><h2>Points history</h2><p>Earned and redeemed activity</p></div></div>
      <div class="rewards-history" id="rewardsHistoryList"></div>
    </aside>
  </div>
  <article class="panel" style="margin-top:16px">
    <div class="panel-head"><div><h2>Redeem for partner &amp; event vouchers</h2><p>Instant voucher code, valid across the IDI partner network</p></div></div>
    <div class="voucher-grid" id="voucherGrid"></div>
  </article>
  <article class="panel" style="margin-top:16px">
    <div class="panel-head"><div><h2>My redeemed vouchers</h2><p>Show the code at checkout or at the event desk</p></div></div>
    <div class="redeemed-list" id="redeemedList"></div>
  </article>
</section>
`);

function renderRewardsPage() {
  document.getElementById('rewardsBalanceBig').textContent = rewardsState.balance.toLocaleString();
  document.getElementById('rewardsLifetime').textContent = rewardsState.lifetime.toLocaleString();
  document.getElementById('rewardsRedeemedCount').textContent = rewardsState.redeemed.length;
  const mult = tierMultiplier(currentMember?.tier);
  document.getElementById('rewardsMultiplierNote').textContent = mult > 1 ? `${currentMember.tier} member \u2014 earning ${mult}\u00D7 points` : 'Standard earning rate \u2014 upgrade to VIP or Premium to earn faster';

  document.getElementById('rewardsHistoryList').innerHTML = rewardsState.history.length
    ? rewardsState.history.slice(0, 12).map(h => `<div class="rewards-history-row"><div><strong>${h.label}</strong><br><span>${h.when}</span></div><b class="${h.points < 0 ? 'spend' : ''}">${h.points > 0 ? '+' : ''}${h.points}</b></div>`).join('')
    : '<div class="rewards-empty">No activity yet \u2014 use any function to start earning.</div>';

  document.getElementById('voucherGrid').innerHTML = voucherCatalog.map(v => {
    const afford = rewardsState.balance >= v.cost;
    return `<article class="voucher-card"><img class="voucher-logo" src="${v.logo}" alt="${v.partner} logo" /><h3>${v.title}</h3><p>${v.type}</p><div class="voucher-card-foot"><div class="voucher-cost">${v.cost}<small>points</small></div><button class="voucher-redeem" data-voucher="${v.id}" ${afford ? '' : 'disabled'}>${afford ? 'Redeem' : 'Not enough points'}</button></div></article>`;
  }).join('');
  document.querySelectorAll('.voucher-redeem').forEach(btn => btn.onclick = () => redeemVoucher(btn.dataset.voucher));

  document.getElementById('redeemedList').innerHTML = rewardsState.redeemed.length
    ? rewardsState.redeemed.slice().reverse().map(r => `<div class="redeemed-row"><img src="${r.logo}" alt="${r.partner}" /><div><strong>${r.title}</strong><small>${r.partner} \u2022 ${r.when}</small></div><span class="voucher-code">${r.code}</span></div>`).join('')
    : '<div class="rewards-empty">No vouchers redeemed yet.</div>';
}

function redeemVoucher(id) {
  const voucher = voucherCatalog.find(v => v.id === id); if (!voucher) return;
  if (rewardsState.balance < voucher.cost) { showToast('Not enough points', `You need ${voucher.cost - rewardsState.balance} more points for this voucher.`); return; }
  const code = `IDI-${voucher.id.slice(0, 4).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  rewardsState.balance -= voucher.cost;
  rewardsState.history.unshift({ label: `Redeemed: ${voucher.title}`, points: -voucher.cost, when: 'Just now' });
  rewardsState.redeemed.push({ ...voucher, code, when: 'Just now' });
  saveRewardsState(); updateRewardsBadges(); renderRewardsPage();
  showToast('Voucher redeemed', `${voucher.partner} code ${code} is ready to use.`);
}

// ---------- 5. Initialize for whatever profile is already active (or default guest) ----------
loadRewardsState(currentMember ? (Object.keys(loginProfiles).find(k => loginProfiles[k] === currentMember) || 'guest') : 'guest');
updateRewardsBadges();
window.__getRewardsState = () => rewardsState;
