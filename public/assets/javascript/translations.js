/**
 * Translation Service
 * Handles loading and applying translations to the UI
 */

class TranslationService {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.defaultLanguage = 'en';
    }

    /**
     * Initialize the translation service
     */
    async init() {
        // Prefer ?lang= param, else stored, else default
        const urlLang = this.getUrlLanguage();
        const initialLang = urlLang || this.getStoredLanguage();
        await this.loadTranslations(initialLang);
        this.setStoredLanguage(this.currentLanguage);
        this.setupLanguageSwitcher();
        this.translatePage();
        this.syncUrlLanguage(this.currentLanguage);
    }

    /**
     * Get stored language from localStorage or default to English
     */
    getStoredLanguage() {
        return localStorage.getItem('selectedLanguage') || this.defaultLanguage;
    }

    /**
     * Store language preference in localStorage
     */
    setStoredLanguage(language) {
        localStorage.setItem('selectedLanguage', language);
    }

    /**
     * Load translations for a specific language
     */
    async loadTranslations(language) {
        try {
            const response = await fetch(`/assets/translations/${language}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${language}`);
            }
            this.translations = await response.json();
            this.currentLanguage = language;
        } catch (error) {
            console.warn(`Failed to load ${language} translations, falling back to ${this.defaultLanguage}:`, error);
            if (language !== this.defaultLanguage) {
                await this.loadTranslations(this.defaultLanguage);
            }
        }
    }

    /**
     * Get translation by key (supports nested keys like "common.save")
     */
    t(key, fallback = null) {
        const keys = key.split('.');
        let value = this.translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return fallback || key;
            }
        }

        return typeof value === 'string' ? value : fallback || key;
    }

    /**
     * Change language and update the UI
     */
    async changeLanguage(language) {
        if (language === this.currentLanguage) return;

        await this.loadTranslations(language);
        this.setStoredLanguage(language);
        this.translatePage();

        // Sync custom dropdown UI (flag dropdown)
        this.updateLanguageSwitcherUI(language);

        // Update URL param without reload
        this.syncUrlLanguage(language);

        // Trigger custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language, translations: this.translations }
        }));
        
        if (window.innerWidth < 1024) { 
            window.updateMatrix();
        }
    }

    /**
     * Setup the custom flag dropdown language switcher
     */
    setupLanguageSwitcher() {
        const root = document.getElementById('countrySelect');
        if (!root) return;

        // Listen to selection changes dispatched by the custom dropdown
        root.addEventListener('change', (e) => {
            const lang = e?.detail?.value || root.dataset.value;
            if (!lang) return;
            if (lang !== this.currentLanguage) {
                this.changeLanguage(lang);
            } else {
                // Ensure URL and storage are in sync even if language didn't change
                this.setStoredLanguage(lang);
                this.syncUrlLanguage(lang);
            }
        });

        // Ensure UI matches current language on load
        this.updateLanguageSwitcherUI(this.currentLanguage);
    }

    /**
     * Ensure the custom dropdown reflects the selected language
     */
    updateLanguageSwitcherUI(language) {
        const root = document.getElementById('countrySelect');
        if (!root) return;
        if (root.dataset.value === language) return;
        const opt = root.querySelector(`.fd-option[data-value="${language}"]`);
        if (opt) {
            // Clicking will update visuals and dispatch its own 'change' event
            opt.click();
        }
    }

    /**
     * Get language from URL (?lang=xx)
     */
    getUrlLanguage() {
        try {
            const url = new URL(window.location.href);
            const lang = url.searchParams.get('lang');
            return lang && typeof lang === 'string' ? lang : null;
        } catch (_) {
            return null;
        }
    }

    /**
     * Set or update the URL with the selected language without reloading
     */
    syncUrlLanguage(language) {
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('lang', language);
            window.history.replaceState({}, '', url.toString());
        } catch (_) {
            // no-op
        }
    }

    /**
     * Translate the entire page
     */
    translatePage() {
        // Translate elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && (element.type === 'submit' || element.type === 'button')) {
                element.value = translation;
            } else if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Translate placeholders with data-translate-placeholder
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            element.placeholder = this.t(key);
        });

        // Translate titles with data-translate-title
        document.querySelectorAll('[data-translate-title]').forEach(element => {
            const key = element.getAttribute('data-translate-title');
            element.title = this.t(key);
        });

        // Translate ARIA labels with data-translate-aria-label
        document.querySelectorAll('[data-translate-aria-label]').forEach(element => {
            const key = element.getAttribute('data-translate-aria-label');
            element.setAttribute('aria-label', this.t(key));
        });
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get all translations for current language
     */
    getTranslations() {
        return this.translations;
    }
}

// Create global instance
window.translationService = new TranslationService();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.translationService.init();
    });
} else {
    window.translationService.init();
}
