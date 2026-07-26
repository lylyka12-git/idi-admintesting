const mobileTabLogin=document.getElementById('mobileTabLogin');
if(mobileTabLogin)mobileTabLogin.onclick=()=>openLogin();
const mobileMoreSheet=document.getElementById('mobileMoreSheet');
document.getElementById('mobileTabMore')?.addEventListener('click',()=>{mobileMoreSheet?.classList.add('open');mobileMoreSheet?.setAttribute('aria-hidden','false')});
document.getElementById('mobileMoreClose')?.addEventListener('click',()=>{mobileMoreSheet?.classList.remove('open');mobileMoreSheet?.setAttribute('aria-hidden','true')});
mobileMoreSheet?.querySelectorAll('a,button:not(.mobile-more-close)').forEach(item=>item.addEventListener('click',()=>{mobileMoreSheet.classList.remove('open');mobileMoreSheet.setAttribute('aria-hidden','true')}));
function updateMobilePublicTabs(){
  const tabs=[...document.querySelectorAll('.mobile-public-tabs a')];
  if(!tabs.length)return;
  let active=tabs[0];
  tabs.forEach(tab=>{const target=document.querySelector(tab.getAttribute('href'));if(target&&target.getBoundingClientRect().top<160)active=tab});
  tabs.forEach(tab=>tab.classList.toggle('active',tab===active));
}
window.addEventListener('scroll',updateMobilePublicTabs,{passive:true});
window.addEventListener('hashchange',updateMobilePublicTabs);
updateMobilePublicTabs();

const appMoreSheet=document.getElementById('appMoreSheet');
const appMoreList=document.getElementById('appMoreList');
const sidebarMoreToggle=document.getElementById('sidebarMoreToggle');
function closeAppMoreSheet(){appMoreSheet?.classList.remove('open');appMoreSheet?.setAttribute('aria-hidden','true')}
sidebarMoreToggle?.addEventListener('click',()=>{
  document.getElementById('sidebar')?.classList.remove('nav-hidden');
  if(appMoreList){
    appMoreList.innerHTML='';
    document.querySelectorAll('#sidebar .nav-item[data-page]').forEach(item=>{
      if(item.classList.contains('mobile-primary')||item.classList.contains('access-hidden'))return;
      const row=document.createElement('button');
      row.type='button';
      row.className='app-more-row';
      row.innerHTML=item.innerHTML;
      row.addEventListener('click',()=>{item.click();closeAppMoreSheet()});
      appMoreList.appendChild(row);
    });
  }
  appMoreSheet?.classList.add('open');
  appMoreSheet?.setAttribute('aria-hidden','false');
});
document.getElementById('appMoreClose')?.addEventListener('click',closeAppMoreSheet);
appMoreSheet?.addEventListener('click',e=>{if(e.target===appMoreSheet)closeAppMoreSheet()});
document.getElementById('sidebar')?.addEventListener('click',e=>{
  const item=e.target.closest('.nav-item[data-page]');
  if(!item)return;
  sidebarMoreToggle?.classList.toggle('active',!item.classList.contains('mobile-primary'));
});

let authNavLastScrollY=window.scrollY;
let authNavIdleTimer=null;
window.addEventListener('scroll',()=>{
  const authSidebar=document.getElementById('sidebar');
  if(!authSidebar?.classList.contains('authenticated')||window.innerWidth>760)return;
  if(appMoreSheet?.classList.contains('open'))return;
  const y=window.scrollY;
  const delta=y-authNavLastScrollY;
  if(y<80)authSidebar.classList.remove('nav-hidden');
  else if(delta>6)authSidebar.classList.add('nav-hidden');
  else if(delta<-6)authSidebar.classList.remove('nav-hidden');
  authNavLastScrollY=y;
  clearTimeout(authNavIdleTimer);
  authNavIdleTimer=setTimeout(()=>authSidebar.classList.remove('nav-hidden'),500);
},{passive:true});
