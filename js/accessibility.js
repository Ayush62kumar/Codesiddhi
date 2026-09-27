// GyaanIQ Accessibility Settings
// Applies and persists accessibility toggles (and the language choice)
// across every page. Include this script in <head>, before styles.css
// if possible, so settings apply before first paint.

(function () {
    var STORAGE_KEY = 'gyaan_a11y_settings';
    var LANG_KEY = 'gyaan_language';

    var DEFAULTS = {
        contrast: false,      // Contrast +
        highlightLinks: false, // Highlight Links
        biggerText: false,    // Bigger Text
        textSpacing: false,   // Text Spacing
        pauseAnimations: false, // Pause Animations
        hideImages: false,    // Hide Images
        dyslexia: false,      // Dyslexia Friendly font
        bigCursor: false,     // Reading Cursor
        tooltips: false,      // Tooltips
        lineHeight: false,    // Line Height
        textAlign: false,     // Text Align (justify)
        saturation: false     // Saturation
    };

    // Maps each setting key to the class applied on <html>.
    var CLASS_MAP = {
        contrast: 'a11y-contrast',
        highlightLinks: 'a11y-highlight-links',
        biggerText: 'a11y-bigger-text',
        textSpacing: 'a11y-text-spacing',
        pauseAnimations: 'a11y-pause-animations',
        hideImages: 'a11y-hide-images',
        dyslexia: 'a11y-dyslexia',
        bigCursor: 'a11y-big-cursor',
        tooltips: 'a11y-tooltips',
        lineHeight: 'a11y-line-height',
        textAlign: 'a11y-text-align',
        saturation: 'a11y-saturation'
    };

    function loadSettings() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return Object.assign({}, DEFAULTS);
            var parsed = JSON.parse(raw);
            return Object.assign({}, DEFAULTS, parsed);
        } catch (err) {
            return Object.assign({}, DEFAULTS);
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (err) {
            /* localStorage unavailable — settings just won't persist */
        }
    }

    function applySettings(settings) {
        var root = document.documentElement;
        Object.keys(CLASS_MAP).forEach(function (key) {
            root.classList.toggle(CLASS_MAP[key], !!settings[key]);
        });
    }

    function toggleSetting(key) {
        var settings = loadSettings();
        settings[key] = !settings[key];
        saveSettings(settings);
        applySettings(settings);
        return settings[key];
    }

    function resetAll() {
        var settings = Object.assign({}, DEFAULTS);
        saveSettings(settings);
        applySettings(settings);
        return settings;
    }

    function getLanguage() {
        try {
            return localStorage.getItem(LANG_KEY) || 'en';
        } catch (err) {
            return 'en';
        }
    }

    function setLanguage(code) {
        try {
            localStorage.setItem(LANG_KEY, code);
        } catch (err) {
            /* ignore */
        }
        document.documentElement.setAttribute('lang', code);
    }

    // Apply immediately (this script should load before body paints).
    applySettings(loadSettings());
    document.documentElement.setAttribute('lang', getLanguage());

    // Expose a small API for settings.html (and any future page) to use.
    window.GyaanA11y = {
        getSettings: loadSettings,
        toggleSetting: toggleSetting,
        resetAll: resetAll,
        getLanguage: getLanguage,
        setLanguage: setLanguage,
        CLASS_MAP: CLASS_MAP,
        DEFAULTS: DEFAULTS
    };
})();