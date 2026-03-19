const fs = require('fs');
const path = require('path');

const basePath = `c:\\Users\\hi\\Desktop\\event-calendar`;

const calendarHtml = fs.readFileSync(path.join(basePath, 'widget-calendar.html'), 'utf-8');
const mapHtml = fs.readFileSync(path.join(basePath, 'widget-map.html'), 'utf-8');
const cardsHtml = fs.readFileSync(path.join(basePath, 'widget-cards.html'), 'utf-8');

// Use proper HTML escaping for the pre tags so the browser renders them as text, not DOM nodes.
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Widget Library - OHM Events</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
    <style>
        :root {
            --bg-base: #000000;
            --bg-panel: #0a0a0a;
            --text-main: #ffffff;
            --text-muted: #888888;
            --border-subtle: #222222;
            --accent: #ffffff;
            --glass-bg: rgba(255, 255, 255, 0.05);
            --glass-hover: rgba(255, 255, 255, 0.1);
        }

        body {
            background-color: var(--bg-base);
            color: var(--text-main);
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }

        .library-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 80px 24px;
        }

        .library-header {
            text-align: center;
            margin-bottom: 80px;
        }

        .library-title {
            font-size: 48px;
            font-weight: 700;
            letter-spacing: -0.02em;
            margin-bottom: 16px;
        }

        .library-subtitle {
            font-size: 18px;
            color: var(--text-muted);
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
        }

        .widget-section {
            background-color: transparent;
            border: none;
            border-radius: 24px;
            padding: 48px 0;
            margin-bottom: 64px;
        }
        
        @media (max-width: 768px) {
            .widget-section {
                padding: 24px 0;
            }
        }

        .widget-info {
            margin-bottom: 40px;
        }

        .widget-name {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .widget-desc {
            color: var(--text-muted);
            font-size: 16px;
        }

        .widget-preview-area {
            display: flex;
            justify-content: center;
            background-color: transparent;
            border: none;
            border-radius: 16px;
            padding: 0;
            margin-bottom: 64px;
        }
        
        @media (max-width: 768px) {
            .widget-preview-area {
                padding: 20px 10px;
            }
        }

        .code-block-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #1a1a1a;
            padding: 12px 20px;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            border: 1px solid var(--border-subtle);
            border-bottom: none;
        }

        .code-title {
            font-size: 14px;
            color: var(--text-muted);
            font-family: monospace;
        }

        .copy-btn {
            background-color: var(--glass-bg);
            border: 1px solid rgba(255,255,255,0.1);
            color: var(--text-main);
            padding: 6px 16px;
            border-radius: 50px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .copy-btn:hover {
            background-color: var(--glass-hover);
        }

        .copy-btn.copied {
            background-color: #4CAF50;
            border-color: #4CAF50;
        }

        .code-snippet {
            background-color: #000000;
            border: 1px solid var(--border-subtle);
            border-bottom-left-radius: 16px;
            border-bottom-right-radius: 16px;
            padding: 24px;
            margin: 0;
            overflow-x: auto;
            color: #d4d4d4;
            font-family: 'Consolas', monospace;
            font-size: 13px;
            line-height: 1.5;
            white-space: pre-wrap;
            max-height: 350px;
            overflow-y: auto;
        }

        details {
            margin-top: 16px;
            border: 1px solid var(--border-subtle);
            border-radius: 16px;
            overflow: hidden;
        }
        summary {
            background-color: #111;
            padding: 12px 20px;
            cursor: pointer;
            font-size: 14px;
            color: var(--text-muted);
            font-weight: 500;
            user-select: none;
            transition: background 0.2s;
        }
        summary:hover { background-color: #1a1a1a; color: #fff; }
        summary::-webkit-details-marker { display: none; }
        summary::before {
            content: '→';
            display: inline-block;
            margin-right: 10px;
            transition: transform 0.2s;
        }
        details[open] summary::before {
            transform: rotate(90deg);
        }
    </style>
</head>
<body>

<div class="library-container">
    
    <header class="library-header">
        <h1 class="library-title">Widget Library</h1>
        <p class="library-subtitle">Modern, lightweight event widgets for Webflow. Use the <b>Async</b> method for a cleaner site and better performance.</p>
    </header>

    <!-- CALENDAR WIDGET -->
    <section class="widget-section">
        <div class="widget-info">
            <h2 class="widget-name">1. Events Calendar</h2>
            <p class="widget-desc">A responsive monthly grid with built-in navigation. Displays dots on days with events.</p>
        </div>
        
        <div class="widget-preview-area">
            ${calendarHtml}
        </div>

        <div class="code-container">
            <div class="code-block-header">
                <span class="code-title">Embed Code (Async)</span>
                <button class="copy-btn" onclick="copyCode(this, 'calendar-async-code')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    <span>Copy Snippet</span>
                </button>
            </div>
            <pre class="code-snippet" id="calendar-async-code">&lt;div data-ohm-widget="calendar"&gt;&lt;/div&gt;
&lt;script src="https://ohm518dotcom-ops.github.io/Event-Widgets/loader.js" async&gt;&lt;/script&gt;</pre>
        </div>

        <details>
            <summary>Advanced: View Full Source (Legacy)</summary>
            <div class="code-container" style="border:none;">
                <div class="code-block-header" style="background-color: #000; border-radius:0; border-left:none; border-right:none;">
                    <span class="code-title">Full Widget HTML/CSS/JS</span>
                    <button class="copy-btn" onclick="copyCode(this, 'calendar-code')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        <span>Copy Full Code</span>
                    </button>
                </div>
                <pre class="code-snippet" id="calendar-code" style="border:none; border-radius:0;">${escapeHtml(calendarHtml)}</pre>
            </div>
        </details>
    </section>

    <!-- MAP WIDGET -->
    <section class="widget-section">
        <div class="widget-info">
            <h2 class="widget-name">2. Location Map</h2>
            <p class="widget-desc">An interactive Leaflet map using CartoDB Dark Matter tiles. Automatically fits bounds to loaded event coordinates.</p>
        </div>
        
        <div class="widget-preview-area">
            <div style="width: 100%;">
                ${mapHtml}
            </div>
        </div>

        <div class="code-container">
            <div class="code-block-header">
                <span class="code-title">Embed Code (Async)</span>
                <button class="copy-btn" onclick="copyCode(this, 'map-async-code')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    <span>Copy Snippet</span>
                </button>
            </div>
            <pre class="code-snippet" id="map-async-code">&lt;div data-ohm-widget="map"&gt;&lt;/div&gt;
&lt;script src="https://ohm518dotcom-ops.github.io/Event-Widgets/loader.js" async&gt;&lt;/script&gt;</pre>
        </div>

        <details>
            <summary>Advanced: View Full Source (Legacy)</summary>
            <div class="code-container" style="border:none;">
                <div class="code-block-header" style="background-color: #000; border-radius:0; border-left:none; border-right:none;">
                    <span class="code-title">Full Widget HTML/CSS/JS</span>
                    <button class="copy-btn" onclick="copyCode(this, 'map-code')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        <span>Copy Full Code</span>
                    </button>
                </div>
                <pre class="code-snippet" id="map-code" style="border:none; border-radius:0;">${escapeHtml(mapHtml)}</pre>
            </div>
        </details>
    </section>

    <!-- EVENT CARDS WIDGET -->
    <section class="widget-section">
        <div class="widget-info">
            <h2 class="widget-name">3. Upcoming Cards List</h2>
            <p class="widget-desc">An auto-flowing grid of your next 10 upcoming events, complete with imagery, tags, and start times.</p>
        </div>
        
        <div class="widget-preview-area">
            ${cardsHtml}
        </div>

        <div class="code-container">
            <div class="code-block-header">
                <span class="code-title">Embed Code (Async)</span>
                <button class="copy-btn" onclick="copyCode(this, 'cards-async-code')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    <span>Copy Snippet</span>
                </button>
            </div>
            <pre class="code-snippet" id="cards-async-code">&lt;div data-ohm-widget="cards"&gt;&lt;/div&gt;
&lt;script src="https://ohm518dotcom-ops.github.io/Event-Widgets/loader.js" async&gt;&lt;/script&gt;</pre>
        </div>

        <details>
            <summary>Advanced: View Full Source (Legacy)</summary>
            <div class="code-container" style="border:none;">
                <div class="code-block-header" style="background-color: #000; border-radius:0; border-left:none; border-right:none;">
                    <span class="code-title">Full Widget HTML/CSS/JS</span>
                    <button class="copy-btn" onclick="copyCode(this, 'cards-code')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        <span>Copy Full Code</span>
                    </button>
                </div>
                <pre class="code-snippet" id="cards-code" style="border:none; border-radius:0;">${escapeHtml(cardsHtml)}</pre>
            </div>
        </details>
    </section>
</div>

<script>
function copyCode(btn, elementId) {
    // get textContent to unescape HTML entities
    const code = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(code).then(() => {
        const originalHtml = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Copied!</span>';
        
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = originalHtml;
        }, 2000);
    });
}
</script>

</body>
</html>`;

fs.writeFileSync(path.join(basePath, 'widget-library.html'), template);
console.log("Successfully generated widget-library.html!");
