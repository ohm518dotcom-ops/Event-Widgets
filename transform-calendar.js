const fs = require('fs');
let html = fs.readFileSync('widget-calendar.html', 'utf-8');

// Replace CSS
const cssSearch = /\/\* Vibe & Variables \*\/[\s\S]*?\.ohm-calendar-widget \* \{ box-sizing: border-box; margin: 0; padding: 0; \}/;
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

    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    max-width: 850px;
    font-family: var(--font-family);
    color: var(--text-primary);
}
.ohm-calendar-layout * { box-sizing: border-box; margin: 0; padding: 0; }
@media (min-width: 768px) {
    .ohm-calendar-layout { flex-direction: row; align-items: flex-start; }
}

.ohm-calendar-widget {
    background-color: var(--bg-color);
    border-radius: var(--border-radius);
    padding: 24px;
    border: 1px solid var(--border-color);
    width: 100%;
    position: relative;
    overflow: hidden;
}
@media (min-width: 768px) {
    .ohm-calendar-widget { flex: 1; min-width: 320px; }
}

.ohm-calendar-details {
    background-color: var(--bg-color);
    border-radius: var(--border-radius);
    padding: 24px;
    border: 1px solid var(--border-color);
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 380px;
}
@media (min-width: 768px) {
    .ohm-calendar-details { flex: 1.2; }
}
.ohm-calendar-details-header { margin-bottom: 20px; }
.ohm-calendar-details-title { font-size: 18px; font-weight: 600; }
.ohm-calendar-details-content { display: flex; flex-direction: column; gap: 16px; flex-grow: 1; }
.ohm-empty-state { color: var(--text-secondary); font-size: 14px; text-align: center; margin: auto; padding: 40px 0; }`;

html = html.replace(cssSearch, cssReplace);

// Remove Modal CSS
html = html.replace(/\/\* Modal & Card Styles \*\/[\s\S]*?\/\* Card Styles \*\//, '/* Card Styles */');

// Add Layout Wrapper
html = html.replace(/<div class="ohm-calendar-widget" id="ohm-calendar">/, `<div class="ohm-calendar-layout" id="ohm-calendar-layout">\n    <div class="ohm-calendar-widget" id="ohm-calendar">`);

// Replace Modal HTML with Side Panel HTML
const modalHtmlRegex = /<!-- Modal Overlay -->[\s\S]*?<\/div>\n<\/div>/;
const panelHtml = `</div>\n\n    <!-- Side Details Panel -->\n    <div class="ohm-calendar-details" id="ohm-calendar-details">\n        <div class="ohm-calendar-details-header">\n            <div class="ohm-calendar-details-title" id="ohm-details-title">Upcoming Events</div>\n        </div>\n        <div class="ohm-calendar-details-content" id="ohm-details-content">\n            <div class="ohm-empty-state">Select a date to view events</div>\n        </div>\n    </div>\n</div>`;
html = html.replace(modalHtmlRegex, panelHtml);

// Modify JS
// 1. Remove Modal logic variables
html = html.replace(/const modal = document\.getElementById\('ohm-calendar-modal'\);[\s\S]*?modal\.classList\.remove\('active'\);\n    }\);/g, `const detailsContent = document.getElementById('ohm-details-content');\n    const detailsTitle = document.getElementById('ohm-details-title');`);

// 2. Modify openModal to displayEvents
const oldOpenModalRegex = /function openModal\(date, dayEvents\) \{[\s\S]*?modalTitle\.textContent = formatterDate\.format\(date\);\n        modalContent\.innerHTML = '';/;
const newDisplayEvents = `function displayEvents(title, dayEvents) {
        detailsTitle.textContent = title;
        detailsContent.innerHTML = '';
        
        if (!dayEvents || dayEvents.length === 0) {
            detailsContent.innerHTML = '<div class="ohm-empty-state">No events found.</div>';
            return;
        }

        const formatterDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const formatterTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });`;
html = html.replace(oldOpenModalRegex, newDisplayEvents);

// 3. Update inner modal Content variables to detailsContent
html = html.replace(/modalContent\.appendChild\(card\);/g, 'detailsContent.appendChild(card);');
html = html.replace(/modal\.classList\.add\('active'\);/g, '');

// 4. Update click event listener
html = html.replace(/dayEl\.addEventListener\('click', \(\) => openModal\(cellDate, dayEvents\)\);/g, `const formatterDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    dayEl.addEventListener('click', () => displayEvents(formatterDate.format(cellDate), dayEvents));`);

// 5. Add selectUpcomingEvent function at bottom of fetchEvents or renderCalendar
const selectFunc = `function selectUpcomingEvent() {
        const now = new Date();
        const upcomingEvents = [...events].filter(e => e.start_time >= now).sort((a,b) => a.start_time - b.start_time);
        
        if (upcomingEvents.length > 0) {
            const nextEvent = upcomingEvents[0];
            const dayEvents = events.filter(e => 
                e.start_time.getFullYear() === nextEvent.start_time.getFullYear() &&
                e.start_time.getMonth() === nextEvent.start_time.getMonth() &&
                e.start_time.getDate() === nextEvent.start_time.getDate()
            );
            const formatterDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            displayEvents(formatterDate.format(nextEvent.start_time), dayEvents);
        } else {
            if (events.length > 0) {
                const firstEvent = [...events].sort((a,b) => a.start_time - b.start_time)[0];
                const dayEvents = events.filter(e => 
                    e.start_time.getFullYear() === firstEvent.start_time.getFullYear() &&
                    e.start_time.getMonth() === firstEvent.start_time.getMonth() &&
                    e.start_time.getDate() === firstEvent.start_time.getDate()
                );
                const formatterDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                displayEvents(formatterDate.format(firstEvent.start_time), dayEvents);
            } else {
                displayEvents("Upcoming Events", []);
                detailsContent.innerHTML = '<div class="ohm-empty-state">No events this month</div>';
            }
        }
    }
    selectUpcomingEvent();
}`;
html = html.replace(/grid\.appendChild\(dayEl\);\n        }\n    \}/, `grid.appendChild(dayEl);\n        }\n        ${selectFunc}`);

fs.writeFileSync('widget-calendar.html', html);
console.log('SUCCESS');
