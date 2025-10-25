// scripts/load-content.js
// Loads content from content.json and populates the page.
// Designed for modularity and maintainability via data-key attributes.

(async function () {
  const configPath = "../config/content.json";

  /**
   * Fetches the configuration file.
   * @returns {Promise<object|null>} The configuration object or null on error.
   */
  async function loadConfig() {
    try {
      const resp = await fetch(configPath, { cache: "no-cache" });
      if (!resp.ok) {
        console.error(`Failed to load config: ${resp.status}`);
        return null;
      }
      return await resp.json();
    } catch (e) {
      console.error(
        "Could not load content.json. Ensure the file exists and the server is running.",
        e
      );
      return null;
    }
  }

  /**
   * Safely gets a nested value from an object using a dot-notation string.
   * @param {object} obj - The object to search.
   * @param {string} path - The dot-notation path (e.g., "profile.labels.nickname").
   * @returns {*} The value, or null if not found.
   */
  function getValue(obj, path) {
    if (!obj || !path) return null;
    return path
      .split(".")
      .reduce((acc, key) => (acc && acc[key] != null ? acc[key] : null), obj);
  }

  /**
   * Sets the textContent of a DOM element.
   * @param {Element|null} el - The DOM element.
   * @param {string|null} text - The text to set.
   */
  function setText(el, text) {
    if (el && text != null) {
      el.textContent = text;
    }
  }

  /**
   * Sets the innerHTML of a DOM element.
   * @param {Element|null} el - The DOM element.
   * @param {string|null} html - The HTML string to set.
   */
  function setHtml(el, html) {
    if (el && html != null) {
      el.innerHTML = html;
    }
  }

  /**
   * Sets an attribute on a DOM element.
   * @param {Element|null} el - The DOM element.
   * @param {string} attr - The attribute to set (e.g., 'href', 'src', 'alt').
   * @param {string|null} value - The value to set.
   */
  function setAttr(el, attr, value) {
    if (el && value != null) {
      el.setAttribute(attr, value);
    }
  }

  /**
   * Fills a container with a list of items as tags.
   * @param {Element|null} container - The container element.
   * @param {string[]|null} items - An array of strings.
   */
  function fillList(container, items) {
    if (!container || !Array.isArray(items)) return;
    container.innerHTML = "";
    for (const it of items) {
      const wrapper = document.createElement("div");
      wrapper.className = "tag-wrapper";
      const tag = document.createElement("span");
      tag.className = "tag";
      const inner = document.createElement("span");
      inner.className = "tag-text";
      inner.textContent = it;
      tag.appendChild(inner);
      wrapper.appendChild(tag);
      container.appendChild(wrapper);
    }
  }

  /**
   * Fills a container with "oshi" tags.
   * @param {Element|null} container - The container element.
   * @param {string[]|null} items - An array of strings.
   * @param {string|null} moreText - Optional "and more..." text.
   */
  function fillOshis(container, items, moreText) {
    if (!container || !Array.isArray(items)) return;
    container.innerHTML = "";
    for (const it of items) {
      const wrapper = document.createElement("div");
      wrapper.className = "tag-wrapper";
      const tag = document.createElement("span");
      tag.className = "oshi-tag";
      const inner = document.createElement("span");
      inner.className = "oshi-span";
      inner.textContent = it;
      tag.appendChild(inner);
      wrapper.appendChild(tag);
      container.appendChild(wrapper);
    }
    if (moreText) {
      const wrapper = document.createElement("div");
      wrapper.className = "tag-wrapper";
      const tag = document.createElement("span");
      tag.className = "oshi-meta-tag";
      const inner = document.createElement("span");
      inner.className = "oshi-meta-span";
      inner.textContent = moreText;
      tag.appendChild(inner);
      wrapper.appendChild(tag);
      container.appendChild(wrapper);
    }
  }

  /**
   * Fills a container with elements from an array.
   * @param {Element|null} container - The container element.
   * @param {string[]|null} lines - An array of strings.
   * @param {string} tag - The HTML tag to wrap each line in (e.g., 'div', 'p').
   * @param {boolean} asHtml - Whether to treat lines as innerHTML (true) or textContent (false).
   */
  function fillContainer(container, lines, tag = "div", asHtml = false) {
    if (!container || !Array.isArray(lines)) return;
    container.innerHTML = "";
    for (const line of lines) {
      const el = document.createElement(tag);
      if (asHtml) {
        el.innerHTML = line;
      } else {
        el.textContent = line;
      }
      container.appendChild(el);
    }
  }

  /**
   * Main initialization function.
   */
  async function init() {
    const config = await loadConfig();
    if (!config) return;

    // --- Meta ---
    document.documentElement.lang = getValue(config, "meta.lang") || "zh-CN";
    const titleTemplate = getValue(config, "meta.titleTemplate");
    const nickname = getValue(config, "profile.nickname");
    if (titleTemplate) {
      document.title = titleTemplate.replace("{nickname}", nickname || "");
    }
    setAttr(
      document.querySelector('[data-key-href="meta.favicon"]'),
      "href",
      getValue(config, "meta.favicon")
    );

    // --- Header ---
    setText(
      document.querySelector('[data-key="header.title"]'),
      getValue(config, "header.title")
    );
    setText(
      document.querySelector('[data-key="header.subtitle"]'),
      getValue(config, "header.subtitle")
    );

    // --- Profile Card ---
    setText(
      document.querySelector('[data-key="profile.title"]'),
      getValue(config, "profile.title")
    );
    const avatarImg = document.querySelector(
      '[data-key-src="profile.avatarSrc"]'
    );
    setAttr(avatarImg, "src", getValue(config, "profile.avatarSrc"));
    setAttr(avatarImg, "alt", getValue(config, "profile.avatarAlt") || "");

    setText(
      document.querySelector('[data-key="profile.labels.nickname"]'),
      getValue(config, "profile.labels.nickname")
    );
    setText(
      document.querySelector('[data-key="profile.labels.gender"]'),
      getValue(config, "profile.labels.gender")
    );
    setText(
      document.querySelector('[data-key="profile.labels.age"]'),
      getValue(config, "profile.labels.age")
    );
    setText(
      document.querySelector('[data-key="profile.labels.location"]'),
      getValue(config, "profile.labels.location")
    );
    setText(
      document.querySelector('[data-key="profile.nickname"]'),
      getValue(config, "profile.nickname")
    );
    setText(
      document.querySelector('[data-key="profile.gender"]'),
      getValue(config, "profile.gender")
    );
    setText(
      document.querySelector('[data-key="profile.age"]'),
      getValue(config, "profile.age")
    );
    setText(
      document.querySelector('[data-key="profile.location"]'),
      getValue(config, "profile.location")
    );
    setText(
      document.querySelector('[data-key="profile.catchphrase"]'),
      getValue(config, "profile.catchphrase")
    );
    setText(
      document.querySelector('[data-key="profile.contact.title"]'),
      getValue(config, "profile.contact.title")
    );
    fillContainer(
      document.querySelector('[data-key="profile.contact.lines"]'),
      getValue(config, "profile.contact.lines"),
      "div",
      true
    );

    const qrImg = document.querySelector('[data-key-src="profile.qrCodeSrc"]');
    setAttr(qrImg, "src", getValue(config, "profile.qrCodeSrc"));
    setAttr(qrImg, "alt", getValue(config, "profile.qrCodeAlt") || "");

    // --- About Card ---
    setText(
      document.querySelector('[data-key="about.title"]'),
      getValue(config, "about.title")
    );
    fillContainer(
      document.querySelector('[data-key="about.intro"]'),
      getValue(config, "about.intro"),
      "div",
      true
    );
    setText(
      document.querySelector('[data-key="about.note"]'),
      getValue(config, "about.note")
    );

    setText(
      document.querySelector('[data-key="about.sections.likes.title"]'),
      getValue(config, "about.sections.likes.title")
    );
    fillList(
      document.querySelector('[data-key="about.sections.likes.items"]'),
      getValue(config, "about.sections.likes.items")
    );

    setText(
      document.querySelector('[data-key="about.sections.playing.title"]'),
      getValue(config, "about.sections.playing.title")
    );
    fillList(
      document.querySelector('[data-key="about.sections.playing.items"]'),
      getValue(config, "about.sections.playing.items")
    );

    setText(
      document.querySelector('[data-key="about.sections.interests.title"]'),
      getValue(config, "about.sections.interests.title")
    );
    setText(
      document.querySelector(
        '[data-key="about.sections.interests.learning.label"]'
      ),
      getValue(config, "about.sections.interests.learning.label")
    );
    fillList(
      document.querySelector(
        '[data-key="about.sections.interests.learning.items"]'
      ),
      getValue(config, "about.sections.interests.learning.items")
    );
    setText(
      document.querySelector(
        '[data-key="about.sections.interests.want.label"]'
      ),
      getValue(config, "about.sections.interests.want.label")
    );
    fillList(
      document.querySelector(
        '[data-key="about.sections.interests.want.items"]'
      ),
      getValue(config, "about.sections.interests.want.items")
    );

    // --- Music Games Card ---
    setText(
      document.querySelector('[data-key="musicGames.title"]'),
      getValue(config, "musicGames.title")
    );
    fillContainer(
      document.querySelector('[data-key="musicGames.content"]'),
      getValue(config, "musicGames.content"),
      "div",
      true
    );

    // --- Achievements Card ---
    setText(
      document.querySelector('[data-key="achievements.title"]'),
      getValue(config, "achievements.title")
    );
    fillContainer(
      document.querySelector('[data-key="achievements.content"]'),
      getValue(config, "achievements.content"),
      "div",
      true
    );

    // --- Oshis Card ---
    setText(
      document.querySelector('[data-key="oshis.title"]'),
      getValue(config, "oshis.title")
    );
    setText(
      document.querySelector('[data-key="oshis.anime.subtitle"]'),
      getValue(config, "oshis.anime.subtitle")
    );
    fillOshis(
      document.querySelector('[data-key="oshis.anime.items"]'),
      getValue(config, "oshis.anime.items"),
      getValue(config, "oshis.anime.moreText")
    );
    setHtml(
      document.querySelector('[data-key="oshis.cpNote"]'),
      getValue(config, "oshis.cpNote")
    );

    // --- Footer ---
    setText(
      document.querySelector('[data-key="footer.copyright"]'),
      getValue(config, "footer.copyright")
    );
    setText(
      document.querySelector('[data-key="footer.note1"]'),
      getValue(config, "footer.note1")
    );
    setText(
      document.querySelector('[data-key="footer.note2"]'),
      getValue(config, "footer.note2")
    );

    const linkEl = document.querySelector('[data-key="footer.poweredLink"]');
    const poweredLink = getValue(config, "footer.poweredLink");
    if (linkEl && poweredLink) {
      linkEl.setAttribute("href", poweredLink);
      const poweredByText = getValue(config, "footer.poweredBy") || poweredLink;
      linkEl.textContent = poweredByText;
    }
  }

  // Run the initialization
  init();
})();
