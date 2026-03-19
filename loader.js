(function() {
    'use strict';

    // The current script's URL to determine the base path for widgets
    const scriptTag = document.currentScript;
    const scriptUrl = scriptTag ? scriptTag.src : '';
    const baseUrl = scriptUrl.substring(0, scriptUrl.lastIndexOf('/') + 1) || './';

    /**
     * Injects a widget into a container
     * @param {HTMLElement} container 
     * @param {string} widgetName 
     */
    async function loadWidget(container, widgetName) {
        try {
            const response = await fetch(`${baseUrl}widget-${widgetName}.html`);
            if (!response.ok) throw new Error(`Failed to load widget: ${widgetName}`);
            
            const rawHtml = await response.text();
            
            // ID ISOLATION LOGIC
            // To prevent collisions, we suffix all IDs with a unique string
            const uid = Math.random().toString(36).substr(2, 6);
            const idMap = {};
            
            const tempDoc = new DOMParser().parseFromString(rawHtml, 'text/html');
            tempDoc.querySelectorAll('[id]').forEach(el => {
                const oldId = el.id;
                const newId = `${oldId}-${uid}`;
                idMap[oldId] = newId;
                el.id = newId;
            });

            // Update scripts to use new IDs
            const scripts = tempDoc.querySelectorAll('script');
            scripts.forEach(s => {
                let scriptText = s.textContent;
                Object.keys(idMap).forEach(oldId => {
                    const regex = new RegExp(`(['"])${oldId}(['"])`, 'g');
                    scriptText = scriptText.replace(regex, `$1${idMap[oldId]}$2`);
                });
                s.textContent = scriptText;
            });

            // Extract styles
            const styles = tempDoc.querySelectorAll('style, link[rel="stylesheet"]');
            styles.forEach(style => {
                document.head.appendChild(style.cloneNode(true));
            });

            // Extract body content (excluding scripts)
            const bodyContent = tempDoc.body.innerHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
            container.innerHTML = bodyContent;

            // Extract and execute scripts
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                if (oldScript.src) {
                    newScript.src = oldScript.src;
                } else {
                    newScript.textContent = oldScript.textContent;
                }
                document.body.appendChild(newScript);
            });

            console.log(`[OHM] Widget '${widgetName}' loaded successfully (instance ${uid}).`);
        } catch (error) {
            console.error(`[OHM] Error loading widget '${widgetName}':`, error);
            container.innerHTML = `<div style="color: red; padding: 20px; border: 1px solid red; border-radius: 8px;">Failed to load widget "${widgetName}".</div>`;
        }
    }

    // Initialize all widgets on the page
    function init() {
        const widgets = document.querySelectorAll('[data-ohm-widget]');
        widgets.forEach(container => {
            const widgetName = container.getAttribute('data-ohm-widget');
            if (widgetName && !container.dataset.ohmLoaded) {
                container.dataset.ohmLoaded = "true";
                loadWidget(container, widgetName);
            }
        });
    }

    // Run on load and also watch for dynamic additions
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Optional: MutationObserver to handle dynamically added widgets
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element
                    if (node.hasAttribute('data-ohm-widget')) {
                        init();
                    } else if (node.querySelectorAll) {
                        if (node.querySelectorAll('[data-ohm-widget]').length > 0) {
                            init();
                        }
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
