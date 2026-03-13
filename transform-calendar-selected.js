const fs = require('fs');
let html = fs.readFileSync('widget-calendar.html', 'utf-8');

// 1. Update CSS
const cssSearch = /\.ohm-day\.today \{\n    background-color: var\(--text-primary\); color: #000; font-weight: 600;\n\}\n\n\.ohm-day\.today \.ohm-event-dot \{ background-color: #000; \}/;
const cssReplace = `.ohm-day.today {
    font-weight: 600;
}
.ohm-day.today::before {
    content: ''; position: absolute; top: 6px; left: 6px;
    width: 6px; height: 6px; background-color: var(--text-primary);
    border-radius: 50%;
}

.ohm-day.selected {
    background-color: var(--text-primary); color: #000; font-weight: 600;
}
.ohm-day.selected .ohm-event-dot { background-color: #000; }`;

html = html.replace(cssSearch, cssReplace);

// 2. Add data-date to dayEl and setup click to use selectDay
const cellDateSearch = `const cellDate = new Date(year, month, dayNum);`;
const cellDateReplace = `const cellDate = new Date(year, month, dayNum);
                dayEl.dataset.date = cellDate.toISOString();`;
html = html.replace(cellDateSearch, cellDateReplace);

const clickSearch = `dayEl.addEventListener('click', () => displayEvents(formatterDate.format(cellDate), dayEvents));`;
const clickReplace = `dayEl.addEventListener('click', () => selectDay(dayEl, formatterDate.format(cellDate), dayEvents));`;
html = html.replace(clickSearch, clickReplace);

// 3. Update selectUpcomingEvent to use selectDay and find the dayEl
html = html.replace(/displayEvents\(formatterDate\.format\((.*?)\), dayEvents\);/g, `selectDay(document.querySelector(\`.ohm-day[data-date="\${$1.toISOString()}"]\`), formatterDate.format($1), dayEvents);`);

// Modify the fallback displayEvents for empty state
html = html.replace(/displayEvents\("Upcoming Events", \[\]\);/, `selectDay(null, "Upcoming Events", []);`);

// 4. Add selectDay function
const displayEventsSearch = `function displayEvents(title, dayEvents) {`;
const selectDayFunc = `function selectDay(dayEl, title, dayEvents) {
        document.querySelectorAll('.ohm-day.selected').forEach(el => el.classList.remove('selected'));
        if (dayEl) dayEl.classList.add('selected');
        displayEvents(title, dayEvents);
    }
    
    function displayEvents(title, dayEvents) {`;
html = html.replace(displayEventsSearch, selectDayFunc);

fs.writeFileSync('widget-calendar.html', html);
console.log('SUCCESS');
