/**
 * Header Language Switcher Enhancement
 * This script enhances the language switcher in the header with flag icons and proper functionality
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initializeHeaderLanguageSwitcher();
});

function initializeHeaderLanguageSwitcher() {
    const languageSelect = document.getElementById('languageSelect');
    if (!languageSelect) return;

    // Add flag icons to the dropdown options
    addFlagIconsToOptions(languageSelect);
    
    // Set the current language from storage
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    languageSelect.value = currentLang;
    
    // Handle language change
    languageSelect.addEventListener('change', function(e) {
        const selectedLanguage = e.target.value;
        handleLanguageChange(selectedLanguage);
    });
}

function addFlagIconsToOptions(selectElement) {
    // Options already contain only flag emojis, no need to add more text
    // This function is kept for future enhancement if needed
    const options = selectElement.querySelectorAll('option');
    options.forEach(option => {
        // Ensure options only show flags (they already do in the HTML)
        const langCode = option.value;
        const flagOnly = {
            'en': '🇪🇳 <img src="/assets/images/icons/languages/en.webp" alt="english flag icon">',
            'de': '🇩🇪 <img src="/assets/images/icons/languages/de.webp" alt="german flag icon">',
            'bg': '🇧🇬 <img src="/assets/images/icons/languages/bg.webp" alt="bulgarian flag icon">'
        };
        
        if (flagOnly[langCode]) {
            option.innerHTML = flagOnly[langCode];
        }
    });
}

function handleLanguageChange(language) {
    // Store the selected language
    localStorage.setItem('selectedLanguage', language);
    
    // If translation service is available, use it
    if (window.translationService) {
        window.translationService.changeLanguage(language);
    } else {
        // Fallback: reload the page to apply the new language
        console.log('Translation service not available, reloading page...');
        window.location.reload();
    }
    
    // Dispatch custom event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: language }
    }));
}