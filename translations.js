// JSON to store translations
const translations = {
    en: {
        title: "Snake Game",  // Title for English
        counter: "Length: 1",
        desc1: "Key instructions:",
        desc2: "Use the buttons below to control the direction",
        desc3: "Click the \"Restart\" button to restart the game",
        restartButton: "Restart",
        upButton: "Up",
        leftButton: "Left",
        rightButton: "Right",
        downButton: "Down",
        languageButton: "Switch to 中文"
    },
    zh: {
        title: "贪吃蛇游戏",  // Title for Chinese
        counter: "长度：1",
        desc1: "按键说明：",
        desc2: "使用屏幕下方的按键控制方向",
        desc3: "点击“重新开始”按钮重新开始游戏",
        restartButton: "重新开始",
        upButton: "上",
        leftButton: "左",
        rightButton: "右",
        downButton: "下",
        languageButton: "Switch to English"
    }
};

// Set default language to English
let currentLanguage = 'en';

// Function to switch language
function switchLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en'; // Toggle language
    updateLanguage(); // Update text based on the selected language
}

// Function to update text content based on the current language
function updateLanguage() {
    document.querySelectorAll('.multi_lang').forEach(element => {
        const id = element.id;
        if (translations[currentLanguage][id]) {
            element.textContent = translations[currentLanguage][id];
        }
        document.title = translations[currentLanguage].title;
    });

    // Update the language button text
    document.getElementById('languageButton').textContent = translations[currentLanguage].languageButton;
}

// Attach event listener to the language switch button
document.getElementById('languageButton').addEventListener('click', switchLanguage);

// Initialize language to English
updateLanguage();
