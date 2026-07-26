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
