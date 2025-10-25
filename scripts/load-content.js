// scripts/load-content.js
// 负责从 /config/content.json 加载文本并填充到页面中。
// 设计目标：简洁，易维护；通过 data-key 属性把配置映射到 DOM。

(async function () {
  async function loadConfig() {
    try {
      const resp = await fetch('/config/content.json', {cache: 'no-cache'});
      if (!resp.ok) throw new Error(`Failed to load config: ${resp.status}`);
      return await resp.json();
    } catch (e) {
      console.error('Could not load content.json. If you are opening the file via file://, run a local server (see README).', e);
      return null;
    }
  }

  function setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  function setByKey(keyPath, setter) {
    // keyPath like 'profile.nickname' or 'oshis.anime'
    const data = keyPath.split('.');
    return function (config) {
      let cur = config;
      for (const k of data) {
        if (cur == null) return;
        cur = cur[k];
      }
      if (cur != null) setter(cur);
    };
  }

  function fillList(containerSelector, items) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = '';
    for (const it of items) {
      const wrapper = document.createElement('div');
      wrapper.className = 'tag-wrapper';
      const tag = document.createElement('span');
      tag.className = 'tag';
      const inner = document.createElement('span');
      inner.className = 'tag-text';
      inner.textContent = it;
      tag.appendChild(inner);
      wrapper.appendChild(tag);
      container.appendChild(wrapper);
    }
  }

  function fillOshis(containerSelector, items, moreText) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.innerHTML = '';
    for (const it of items) {
      const wrapper = document.createElement('div');
      wrapper.className = 'tag-wrapper';
      const tag = document.createElement('span');
      // maintain existing oshi-tag class
      tag.className = 'oshi-tag';
      const inner = document.createElement('span');
      inner.className = 'oshi-span';
      inner.textContent = it;
      tag.appendChild(inner);
      wrapper.appendChild(tag);
      container.appendChild(wrapper);
    }
    if (moreText) {
      const wrapper = document.createElement('div');
      wrapper.className = 'tag-wrapper';
      const tag = document.createElement('span');
      tag.className = 'oshi-meta-tag';
      const inner = document.createElement('span');
      inner.className = 'oshi-meta-span';
      inner.textContent = moreText;
      tag.appendChild(inner);
      wrapper.appendChild(tag);
      container.appendChild(wrapper);
    }
  }

  const config = await loadConfig();
  if (!config) return;

  // profile fields
  document.querySelectorAll('[data-key^="profile."]').forEach(el => {
    const key = el.getAttribute('data-key');
    const k = key.split('.').pop();
    if (config.profile && config.profile[k] != null) {
      el.textContent = config.profile[k];
    }
  });

  // about paragraphs
  const aboutEl = document.querySelector('[data-key="about.intro"]');
  if (aboutEl && Array.isArray(config.about && config.about.intro)) {
    aboutEl.innerHTML = '';
    for (const p of config.about.intro) {
      const d = document.createElement('div');
      d.textContent = p;
      aboutEl.appendChild(d);
    }
  }
  const aboutNote = document.querySelector('[data-key="about.note"]');
  if (aboutNote && config.about && config.about.note) aboutNote.textContent = config.about.note;

  // likes
  if (Array.isArray(config.likes)) fillList('[data-key="likes"]', config.likes);

  // playing
  if (Array.isArray(config.playing)) fillList('[data-key="playing"]', config.playing);

  // interests learning / want
  if (config.interests && Array.isArray(config.interests.learning)) fillList('[data-key="interests.learning"]', config.interests.learning);
  if (config.interests && Array.isArray(config.interests.want)) fillList('[data-key="interests.want"]', config.interests.want);

  // oshis
  if (config.oshis && Array.isArray(config.oshis.anime)) fillOshis('[data-key="oshis.anime"]', config.oshis.anime, config.oshis.moreText);

  // footer
  if (config.footer) {
    if (config.footer.copyright) setText('[data-key="footer.copyright"]', config.footer.copyright);
    const linkEl = document.querySelector('[data-key="footer.poweredLink"]');
    if (linkEl && config.footer.poweredLink) {
      linkEl.setAttribute('href', config.footer.poweredLink);
      const poweredByText = config.footer.poweredBy || config.footer.poweredLink;
      linkEl.textContent = poweredByText;
    }
  }

})();
