(function(){
  const html=document.documentElement,body=document.body;
  const ua=navigator.userAgent||'';
  const isIOS=/iPad|iPhone|iPod/.test(ua)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1;
  const isAndroid=/Android/.test(ua);
  const isStandalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  html.classList.add(isStandalone?'platform-standalone':'platform-browser');
  body.classList.add(isIOS?'platform-ios':isAndroid?'platform-android':'platform-web');
  body.dataset.platform=isIOS?'ios':isAndroid?'android':isStandalone?'webapp':'web';

  function showInstallBanner(copy,installHandler){
    if(sessionStorage.getItem('idi-install-dismissed'))return;
    const banner=document.createElement('div');
    banner.className='platform-install-banner';
    banner.innerHTML=`<img src="assets/idi-logo.jpg" alt="IDI APP"><div><strong>${copy.title}</strong><small>${copy.text}</small></div><button class="install-primary">${copy.action}</button><button class="install-close" aria-label="Close">×</button>`;
    document.body.appendChild(banner);
    banner.querySelector('.install-close').onclick=()=>{sessionStorage.setItem('idi-install-dismissed','1');banner.remove()};
    banner.querySelector('.install-primary').onclick=()=>installHandler?installHandler(banner):alert(copy.fallback);
    requestAnimationFrame(()=>banner.classList.add('show'));
  }

  let deferredPrompt=null;
  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredPrompt=event;
    showInstallBanner({title:'Install IDI APP',text:'Add the app to your Android home screen for a full app-like experience.',action:'Install',fallback:'Use browser menu to install IDI APP.'},async banner=>{
      banner.classList.remove('show');
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt=null;
      banner.remove();
    });
  });

  window.addEventListener('load',()=>{
    if(isIOS&&!isStandalone&&window.innerWidth<900){
      showInstallBanner({title:'Add IDI APP to iPhone',text:'Tap Share, then choose “Add to Home Screen” for iOS app mode.',action:'How',fallback:'On iPhone: tap Share → Add to Home Screen.'});
    }
    if('serviceWorker' in navigator&&location.protocol.startsWith('http')){
      navigator.serviceWorker.register('sw.js').catch(()=>{});
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',()=>{
      document.querySelectorAll('.mobile-public-tabs a').forEach(item=>item.classList.toggle('active',item.getAttribute('href')===link.getAttribute('href')));
    });
  });
})();
