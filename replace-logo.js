const fs = require('fs');

try {
    const content = fs.readFileSync('ohm-logo-only.svg', 'utf-8');
    const pathMatch = content.match(/<path d="[^"]+" fill="white"\/>/);
    if (!pathMatch) throw new Error("Could not find SVG path.");
    
    // Generate clean SVGs
    const tinySvgWhite = `<svg width="1188" height="918" viewBox="0 0 1188 918" fill="none" xmlns="http://www.w3.org/2000/svg">${pathMatch[0]}</svg>`;
    const tinySvgBlack = `<svg width="1188" height="918" viewBox="0 0 1188 918" fill="none" xmlns="http://www.w3.org/2000/svg">${pathMatch[0].replace('fill="white"', 'fill="black"')}</svg>`;
    
    const bgWhite = `url('data:image/svg+xml;base64,${Buffer.from(tinySvgWhite).toString('base64')}')`;
    const bgBlack = `url('data:image/svg+xml;base64,${Buffer.from(tinySvgBlack).toString('base64')}')`;
    
    const filterKeyframes = `@keyframes ohm-rainbow-breathe-filter {
    0% { filter: drop-shadow(0 0 2px rgba(255, 100, 100, 0.6)); }
    16% { filter: drop-shadow(0 0 4px rgba(255, 180, 100, 0.9)); }
    33% { filter: drop-shadow(0 0 2px rgba(255, 255, 120, 0.6)); }
    50% { filter: drop-shadow(0 0 4px rgba(120, 255, 120, 0.9)); }
    66% { filter: drop-shadow(0 0 2px rgba(100, 150, 255, 0.6)); }
    83% { filter: drop-shadow(0 0 4px rgba(180, 100, 255, 0.9)); }
    100% { filter: drop-shadow(0 0 2px rgba(255, 100, 100, 0.6)); }
}`;
    
    // Process Map Widget
    let mapHtml = fs.readFileSync('widget-map.html', 'utf-8');
    mapHtml = mapHtml.replace(/\.ohm-custom-marker \{[\s\S]*?\}/, `.ohm-custom-marker {
    background-color: transparent; border: none; border-radius: 0;
    background-image: ${bgWhite};
    background-size: contain; background-repeat: no-repeat; background-position: center;
    animation: ohm-rainbow-breathe-filter 6s infinite ease-in-out;
}`);
    mapHtml = mapHtml.replace(/@keyframes ohm-rainbow-breathe \{[\s\S]*?\}/, filterKeyframes);
    mapHtml = mapHtml.replace(/iconSize: \[\d+, \d+\]/g, 'iconSize: [22, 16]');
    mapHtml = mapHtml.replace(/iconAnchor: \[\d+, \d+\]/g, 'iconAnchor: [11, 8]');
    fs.writeFileSync('widget-map.html', mapHtml);
    
    // Process Calendar Widget
    let calHtml = fs.readFileSync('widget-calendar.html', 'utf-8');
    calHtml = calHtml.replace(/\.ohm-event-dot \{[\s\S]*?\}/, `.ohm-event-dot {
    width: 14px; height: 11px;
    background-image: ${bgWhite};
    background-size: contain; background-repeat: no-repeat; background-position: center;
    position: absolute; bottom: 4px;
    opacity: 0; transition: opacity 0.2s;
}`);
    calHtml = calHtml.replace(/\.ohm-day\.today \.ohm-event-dot \{[\s\S]*?\}/, `.ohm-day.today .ohm-event-dot { background-image: ${bgBlack}; }`);
    calHtml = calHtml.replace(/\.ohm-day\.has-events \.ohm-event-dot \{[\s\S]*?\}/, `.ohm-day.has-events .ohm-event-dot { 
    opacity: 1; 
    animation: ohm-rainbow-breathe-filter 6s infinite ease-in-out;
}`);
    calHtml = calHtml.replace(/@keyframes ohm-rainbow-breathe \{[\s\S]*?\}/, filterKeyframes);
    fs.writeFileSync('widget-calendar.html', calHtml);
    
    console.log("Successfully replaced logo and animations.");
} catch(e) {
    console.error("Error:", e);
}
