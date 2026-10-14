/* Aries Blackstone — optional, consent-based Google Analytics 4. No Google
   analytics script or measurement request is loaded until a visitor opts in. */
(function () {
  'use strict';

  const STORAGE_KEY = 'aries_analytics_consent_v1';
  const MEASUREMENT_ID = 'G-SBFMNRQ2FP';
  const ACCEPTED = 'accepted';
  const DECLINED = 'declined';
  let tagLoaded = false;
  let banner = null;

  function getPreference() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (_error) {
      return null;
    }
  }

  function savePreference(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (_error) {
      // If storage is disabled, visitors can still decide for this page.
    }
  }

  function loadAnalytics() {
    if (tagLoaded) return;
    tagLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    // Google advertising storage and personalization remain disabled.
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' +
      encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(tag);
  }

  function choose(value) {
    savePreference(value);
    if (banner) banner.hidden = true;
    if (value === ACCEPTED) {
      loadAnalytics();
    } else if (tagLoaded) {
      // Stops future analytics requests on this page, and a reload removes
      // the analytics library entirely for declined visitors.
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
      window.location.reload();
    }
  }

  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
  }

  function setupControls() {
    const style = document.createElement('style');
    style.textContent = [
      '.aries-consent[hidden]{display:none!important}',
      '.aries-consent{position:fixed;z-index:10000;left:1rem;right:1rem;bottom:1rem;' +
        'max-width:600px;margin:0 auto;padding:1.15rem 1.25rem;border:1px solid #bba772;' +
        'border-radius:12px;background:#151d2a;color:#fff;box-shadow:0 8px 30px #0008;' +
        'font:inherit;line-height:1.5}',
      '.aries-consent p{margin:0 0 .75rem;color:#fff}',
      '.aries-consent a{color:#ffdf90;text-decoration:underline}',
      '.aries-consent-actions{display:flex;gap:.65rem;flex-wrap:wrap}',
      '.aries-consent button{cursor:pointer;border:1px solid #e9d49e;border-radius:7px;' +
        'padding:.55rem 1rem;background:#f0d792;color:#172231;font:inherit;font-weight:600}',
      '.aries-consent button.aries-decline{background:transparent;color:#fff}',
      '.aries-preferences{background:transparent;border:0;text-decoration:underline;' +
        'color:inherit;cursor:pointer;font:inherit;margin:.25rem 0;padding:.2rem}'
    ].join('');
    document.head.appendChild(style);

    banner = document.createElement('section');
    banner.className = 'aries-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Optional website analytics');
    banner.innerHTML = '<p><strong>Optional site analytics</strong><br>' +
      'May we use Google Analytics cookies to understand which pages readers visit? ' +
      'You can decline. This choice does not affect access to the site. ' +
      '<a href="/privacy.html">Privacy policy</a>.</p>' +
      '<div class="aries-consent-actions">' +
      '<button type="button" class="aries-accept">Allow analytics</button>' +
      '<button type="button" class="aries-decline">No thanks</button>' +
      '</div>';
    banner.querySelector('.aries-accept').addEventListener('click', function () {
      choose(ACCEPTED);
    });
    banner.querySelector('.aries-decline').addEventListener('click', function () {
      choose(DECLINED);
    });
    document.body.appendChild(banner);

    const footer = document.querySelector('.site-footer');
    if (footer) {
      const preferenceButton = document.createElement('button');
      preferenceButton.type = 'button';
      preferenceButton.className = 'aries-preferences';
      preferenceButton.textContent = 'Analytics preferences';
      preferenceButton.addEventListener('click', function () {
        showBanner();
        banner.querySelector('.aries-accept').focus();
      });
      footer.appendChild(preferenceButton);
    }

    if (getPreference() === ACCEPTED || getPreference() === DECLINED) {
      banner.hidden = true;
    }
  }

  // Read stored consent before rendering the page, but don't load the Google
  // script for first-time or declined visitors.
  if (getPreference() === ACCEPTED) loadAnalytics();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupControls, { once: true });
  } else {
    setupControls();
  }
}());
