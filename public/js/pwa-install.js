// PWA & APK Installation Engine
(function() {
  let deferredPrompt = null;
  const banner = document.getElementById("pwa-install-banner");
  const modal = document.getElementById("pwa-apk-modal");
  const installBtn = document.getElementById("pwa-install-btn");
  const modalInstallBtn = document.getElementById("pwa-modal-install-btn");
  const closeBtn = document.getElementById("pwa-install-close");
  const modalCloseBtn = document.getElementById("pwa-modal-close-btn");

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

  // Listen for beforeinstallprompt event (Android Chrome / Edge / WebAPK)
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!isStandalone && !sessionStorage.getItem("pwa_banner_dismissed")) {
      banner.style.display = "block";
    }
  });

  // If beforeinstallprompt does not fire immediately, still show banner after 2s on mobile unless dismissed
  setTimeout(() => {
    if (!isStandalone && !sessionStorage.getItem("pwa_banner_dismissed")) {
      banner.style.display = "block";
    }
  }, 2000);

  function triggerInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          banner.style.display = "none";
          modal.style.display = "none";
        }
        deferredPrompt = null;
      });
    } else {
      modal.style.display = "flex";
    }
  }

  installBtn.addEventListener("click", triggerInstall);
  modalInstallBtn.addEventListener("click", triggerInstall);

  closeBtn.addEventListener("click", () => {
    banner.style.display = "none";
    sessionStorage.setItem("pwa_banner_dismissed", "1");
  });

  modalCloseBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("appinstalled", () => {
    banner.style.display = "none";
    modal.style.display = "none";
    console.log("Pen Game WebAPK installed successfully!");
  });

  // Register Service Worker for 100% offline gameplay
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        console.log("Pen Game ServiceWorker registered:", reg.scope);
      }).catch((err) => {
        console.warn("ServiceWorker registration:", err);
      });
    });
  }
})();
