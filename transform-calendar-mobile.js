const fs = require('fs');
let html = fs.readFileSync('widget-calendar.html', 'utf-8');

// Update Layout CSS for Mobile Modal vs Desktop Split
const cssReplace = `/* Vibe & Variables */
.ohm-calendar-layout {
    --bg-color: #111111;
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --border-color: #333333;
    --accent-color: #ffffff;
    --glass-hover: rgba(255, 255, 255, 0.15);
    --font-family: 'Inter', sans-serif;
    --border-radius: 16px;
    --transition: all 0.2s ease;

    position: relative; /* For mobile modal positioning */
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 850px;
    font-family: var(--font-family);
    color: var(--text-primary);
}
.ohm-calendar-layout * { box-sizing: border-box; margin: 0; padding: 0; }
@media (min-width: 768px) {
    .ohm-calendar-layout { flex-direction: row; align-items: stretch; gap: 24px; }
}

.ohm-calendar-widget {
    background-color: var(--bg-color);
    border-radius: var(--border-radius);
    padding: 24px;
    border: 1px solid var(--border-color);
    width: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
@media (min-width: 768px) {
    .ohm-calendar-widget { flex: 1; min-width: 320px; }
}

/* Base: Mobile acts as an absolute overlay modal */
.ohm-calendar-details {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 100;
    background-color: rgba(0,0,0,0.8);
    backdrop-filter: blur(4px);
    display: none; /* Hidden on mobile until active */
    flex-direction: column;
    padding: 24px;
    border-radius: var(--border-radius);
    overflow-y: auto;
}
.ohm-calendar-details.active { display: flex; }

/* Desktop: Acts as a side-by-side equal height panel */
@media (min-width: 768px) {
    .ohm-calendar-details { 
        position: relative; 
        display: flex; /* Always visible on desktop */
        flex: 1.2; 
        background-color: var(--bg-color);
        border: 1px solid var(--border-color);
        backdrop-filter: none;
        padding: 24px;
        z-index: 1;
        border-radius: var(--border-radius);
        overflow-y: visible;
    }
}

.ohm-calendar-details-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.ohm-calendar-details-title { font-size: 18px; font-weight: 600; }

.ohm-calendar-details-close {
    background: transparent; border: none; color: #fff; cursor: pointer;
    width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    transition: var(--transition);
}
.ohm-calendar-details-close svg { fill: currentColor; width: 24px; height: 24px; }
.ohm-calendar-details-close:hover { background-color: var(--glass-hover); }

/* Hide close button on desktop */
@media (min-width: 768px) {
    .ohm-calendar-details-close { display: none; }
}

.ohm-calendar-details-content { display: flex; flex-direction: column; gap: 16px; flex-grow: 1; }
.ohm-empty-state { color: var(--text-secondary); font-size: 14px; text-align: center; margin: auto; padding: 40px 0; }
`;

const cssSearch = /\/\* Vibe & Variables \*\/[\s\S]*?\.ohm-empty-state \{.*?\}/;
html = html.replace(cssSearch, cssReplace);

// Restore the close button HTML in the details header
const newHeaderHtml = `<div class="ohm-calendar-details-header">
            <div class="ohm-calendar-details-title" id="ohm-details-title">Upcoming Events</div>
            <button class="ohm-calendar-details-close" id="ohm-details-close" aria-label="Close Modal">
                <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
        </div>`;
html = html.replace(/<div class="ohm-calendar-details-header">[\s\S]*?<\/div>/, newHeaderHtml);

// Add the JS logic to show/hide the panel on mobile
const newJsLogic = `const detailsPanel = document.getElementById('ohm-calendar-details');
    const detailsClose = document.getElementById('ohm-details-close');
    
    detailsClose.addEventListener('click', () => {
        detailsPanel.classList.remove('active');
    });`;

html = html.replace(/const detailsContent = document\.getElementById\('ohm-details-content'\);/, newJsLogic + "\n    const detailsContent = document.getElementById('ohm-details-content');");

// Trigger active class in displayEvents
html = html.replace(/function displayEvents\(title, dayEvents\) \{/, `function displayEvents(title, dayEvents) {\n        detailsPanel.classList.add('active');`);

fs.writeFileSync('widget-calendar.html', html);
console.log('SUCCESS');
