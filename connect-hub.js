(() => {
  const search = document.getElementById('connectHubSearch');
  const sector = document.getElementById('connectHubSector');
  const results = document.getElementById('connectHubResults');
  const count = document.getElementById('connectHubCount');
  if (!search || !sector || !results || !count) return;

  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const sourceItems = () => [
    ...(companies || []).filter(item => item.approved !== false).slice(0, 48).map(item => ({type:'company', label:'VERIFIED COMPANY', title:item.name, body:`${item.industry} · ${item.location}`, detail:item.membership || 'Member'})),
    ...(partnerOrganizations || []).map(item => ({type:'partner', label:'CAPITAL / STRATEGIC PARTNER', title:item.name, body:`${item.sectors.join(', ')} · ${item.stage}`, detail:item.ticket})),
    ...(newsItems || []).slice(0, 10).map(item => ({type:'news', label:'MARKET INTELLIGENCE', title:item.headline, body:item.tagline, detail:item.category})),
    ...(events || []).map(item => ({type:'event', label:'UPCOMING ACTIVITY', title:item.title, body:item.place, detail:`${item.day} ${item.month}`}))
  ];
  function matches(item, query, selectedSector) {
    const haystack = `${item.title} ${item.body} ${item.detail}`.toLowerCase();
    return (!query || haystack.includes(query)) && (selectedSector === 'all' || haystack.includes(selectedSector.toLowerCase()));
  }
  function render() {
    const query = search.value.trim().toLowerCase();
    const filtered = sourceItems().filter(item => matches(item, query, sector.value)).slice(0, 8);
    count.textContent = filtered.length ? `${filtered.length} relevant, verified opportunities and updates` : 'No exact result yet - try a sector or broader search.';
    results.innerHTML = filtered.map(item => `<article class="connect-result"><small>${item.label}</small><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p><footer><span>${escapeHtml(item.detail)}</span><button type="button" data-connect-open="${item.type}">Explore →</button></footer></article>`).join('') || `<article class="connect-result"><small>DISCOVERY TIP</small><h3>Broaden your search</h3><p>Try “Technology”, “Agriculture”, “Investment”, or a partner name to explore the connected ecosystem.</p></article>`;
    results.querySelectorAll('[data-connect-open]').forEach(button => button.addEventListener('click', () => {
      const destination = {company:'#public-directory',partner:'#public-partners',news:'#public-news',event:'#public-events'}[button.dataset.connectOpen];
      document.querySelector(destination)?.scrollIntoView({behavior:'smooth', block:'start'});
    }));
  }
  function exportCalendar() {
    const entries = (events || []).map(event => `BEGIN:VEVENT\nUID:${event.title.replace(/\W/g,'').toLowerCase()}@idiapp\nDTSTAMP:20260720T000000Z\nSUMMARY:${event.title}\nLOCATION:${event.place}\nDESCRIPTION:${event.description}\nEND:VEVENT`).join('\n');
    const blob = new Blob([`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//IDI APP//Connect Hub//EN\n${entries}\nEND:VCALENDAR`], {type:'text/calendar'});
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'idi-upcoming-events.ics'; link.click(); URL.revokeObjectURL(link.href);
    if (typeof showToast === 'function') showToast('Calendar exported', 'Your upcoming IDI activities are ready to add to a calendar.');
  }
  search.addEventListener('input', render); sector.addEventListener('change', render);
  document.getElementById('connectHubSave')?.addEventListener('click', () => { localStorage.setItem('idi-connect-search', JSON.stringify({query:search.value, sector:sector.value})); if (typeof showToast === 'function') showToast('Search saved', 'Your discovery preferences have been saved on this device.'); });
  document.getElementById('connectHubCalendar')?.addEventListener('click', exportCalendar);
  document.getElementById('connectHubLogin')?.addEventListener('click', () => { if (typeof openLogin === 'function') openLogin(); });
  try { const saved = JSON.parse(localStorage.getItem('idi-connect-search')); if (saved) { search.value = saved.query || ''; sector.value = saved.sector || 'all'; } } catch (_) {}
  render();
})();
