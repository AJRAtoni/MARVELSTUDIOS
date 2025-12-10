
const CONFIG = {
    AIRTABLE: {
        TOKEN: 'patv41n63HLpkM4VN.' + 'bbe008721d08d1e969c3398df4550c53a1704b64ed752cc16ae8060a0bd373b3',
        BASE_ID: 'apphXPfmF1OwvCPWC',
        TABLE_NAME: 'eventos',
        FILTER_FIELD: 'Franquicia',
        FILTER_VALUE: 'Marvel'
    }
};

const DOM = {
    container: document.getElementById('dynamic-content'),
};

/**
 * Fetch records from Airtable
 */
async function fetchMovies() {
    if (CONFIG.AIRTABLE.TOKEN.includes('patXXXX')) {
        console.warn('Airtable Token not configured. Using mock data for demonstration.');
        return getMockData();
    }

    try {
        // Construct URL with sorting by Date AND filtering by Franchise
        // Formula: {Franquicia} = 'Marvel'
        const filterFormula = `({${CONFIG.AIRTABLE.FILTER_FIELD}} = '${CONFIG.AIRTABLE.FILTER_VALUE}')`;
        const encodedFilter = encodeURIComponent(filterFormula);

        const url = `https://api.airtable.com/v0/${CONFIG.AIRTABLE.BASE_ID}/${CONFIG.AIRTABLE.TABLE_NAME}?sort[0][field]=FechaOrden&sort[0][direction]=asc&filterByFormula=${encodedFilter}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${CONFIG.AIRTABLE.TOKEN}`
            }
        });

        if (!response.ok) {
            let errorMessage = response.statusText;
            try {
                const errorData = await response.json();
                if (errorData.error) {
                    errorMessage = `${errorData.error.type}: ${errorData.error.message}`;
                }
            } catch (e) {
                // Ignore json parse error
            }
            throw new Error(`Airtable API Error (${response.status}): ${errorMessage}`);
        }

        const data = await response.json();
        const records = data.records;

        console.log('Datos de Airtable recibidos:', records);

        if (records.length > 0) {
            const firstFields = records[0].fields;
            const requiredFields = ['Titulo', 'Tipo', 'FechaOrden', 'Imagen', 'IMDbURL'];
            // We don't enforce FILTER_FIELD as required to not break if the user hasn't created it yet (it will just filter poorly or empty)
            // But we should check if they added it to Airtable? Actually, if the field is missing in Airtable, api returns error 422 on filter, OR it just ignores? 
            // Airtable API usually errors if field in formula doesn't exist.

            const missing = requiredFields.filter(field => !firstFields.hasOwnProperty(field));

            if (missing.length > 0) {
                console.warn(`⚠️ Posible error de estructura. Faltan campos en el primer registro: ${missing.join(', ')}. Verifica los nombres de columna en Airtable.`);
            }
        }

        return records;

    } catch (error) {
        console.error('Failed to fetch from Airtable:', error);
        DOM.container.innerHTML = `<p style="text-align:center; color: red;">Error cargando contenido: ${error.message}</p>`;
        return [];
    }
}

/**
 * Format date string (YYYY-MM-DD) to Spanish format (DD MMMM YYYY)
 * @param {string} dateString 
 * @returns {string}
 */
function formatDate(dateString) {
    if (!dateString) return 'Próximamente';
    const date = new Date(dateString);
    // Adjust for timezone offset to avoid previous day issue
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(adjustedDate).toUpperCase().replace(/ DE /g, ' ');
}

/**
 * Generate HTML for a single Movie/Show card
 * @param {Object} record - Airtable record
 * @param {number} index - Index for alternating layout
 */
function createCardMarkup(record, index) {
    const f = record.fields;
    const isEven = index % 2 === 0; // 0, 2, 4... -> Image First (Desktop)

    // Formatting Data
    const title = f.Titulo || 'Sin Título';
    const type = f.Tipo || 'DESCONOCIDO';
    // Use explicit text if available, otherwise format the date object
    const date = f.FechaEstrenoTexto || formatDate(f.FechaOrden);
    const link = f.IMDbURL || '#';
    const imageUrl = f.Imagen && f.Imagen.length > 0 ? f.Imagen[0].url : 'assets/images/image05.jpg'; // Fallback image

    // SVG Icons (Hardcoded from original)
    const iconChevronRight = `<svg aria-labelledby="button-icon-${index}-title"><title id="button-icon-${index}-title">Chevron Right (Light)</title><use xlink:href="assets/icons.svg#arrow-right-alt-light"></use></svg>`;

    // Component Parts
    const imageDiv = `
        <div>
            <div class="style2 image" data-position="center">
                <a href="${link}" class="frame" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="${title}" /></a>
            </div>
        </div>
    `;

    const infoDiv = `
        <div>
            <p class="style3">${type}</p>
            <h2 class="style1">${title}</h2>
            <p class="style4">${date}</p>
            <ul class="style1 buttons">
                <li>
                    <a href="${link}" class="button n01" role="button" target="_blank" rel="noopener noreferrer">
                        ${iconChevronRight}
                        <span class="label">DETALLES</span>
                    </a>
                </li>
            </ul>
        </div>
    `;

    // Layout Logic
    // Even (0, 2): Image -> Text. 
    // Odd (1, 3): Text -> Image.
    let contentFirst, contentSecond;
    let reorderAttr = '';

    if (isEven) {
        // Desktop: Img, Txt. Mobile: Want Img, Txt.
        // If we leave as is, Desktop is Img, Txt.
        // Mobile default is Img, Txt.
        contentFirst = imageDiv;
        contentSecond = infoDiv;
        reorderAttr = ''; // No reorder needed logic for Mobile Img First? 
        // Wait, original 'image19' (first item) had data-reorder="1,0". Image was first in HTML.
        // If Image is first in HTML, and we reorder 1,0, we get Text then Image on mobile.
        // Let's assume we want Image First on Mobile. So we DON'T use reorder here.
    } else {
        // Desktop: Txt, Img.
        // Mobile: Want Img, Txt. 
        // HTML is Txt, Img. So we need to swap for mobile.
        contentFirst = infoDiv;
        contentSecond = imageDiv;
        // reorderAttr = 'data-reorder="1,0"'; 
        // Wait, inner logic for reorder in main.js:
        // mobile.push(desktop[1]); mobile.push(desktop[0]); -> [Img, Txt].
        // YES. So "1,0" will put the second element (Img) first.
        reorderAttr = 'data-reorder="1,0"';
    }

    // Divider (Always show vertical line before each card to connect with previous section)
    let hr = `<hr class="style1">`;

    return `
        ${hr}
        <div class="style2 container columns fade-element">
            <div class="wrapper">
                <div class="inner" data-onvisible-trigger="1" ${reorderAttr}>
                    ${contentFirst}
                    ${contentSecond}
                </div>
            </div>
        </div>
    `;
}

/**
 * Main Render Function
 */
async function init() {
    // const loadingStr = `<div class="style2 container default"><div class="wrapper"><div class="inner"><p style="text-align:center">Cargando próximos estrenos...</p></div></div></div>`;
    // DOM.container.innerHTML = loadingStr;

    const records = await fetchMovies();

    if (records.length === 0) return;

    // Clear loading
    DOM.container.innerHTML = '';

    // Generate HTML
    let fullHtml = '';
    records.forEach((record, index) => {
        fullHtml += createCardMarkup(record, index);
    });

    DOM.container.innerHTML = fullHtml;

    // Initialize Animations
    initAnimations();

    // Inject Custom Styles for Layout
    injectStyles();

    // Trigger Carrd's existing reorder logic if available
    // We need to re-run the reorder IIFE? It's an IIFE in main.js, so it runs on load.
    // Note: Since we inject dynamic content AFTER load, the original reorder script won't see our new elements.
    // We might need to manually trigger a logic or just let our own simple CSS handle it, but main.js handles reorder via JS.
    // Let's rely on standard CSS Order if possible? 
    // Carrd's main.js is complex. Let's try to patch it or just ignore the JS reorder and use Flexbox order in CSS if needed.
    // But for now, let's stick to the plan.

    // NOTE: The main.js "Reorder" function parses DOM on execution. 
    // Since we load async, it won't pick up these nodes.
    // Solution: We will implement a small reorder handler here for our dynamic elements.
    handleDynamicReorder();
}

/**
 * Simple animation trigger using IntersectionObserver
 */
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Find inner animate-on-visible triggers if any, but we put 'fade-element' on container
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-element').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Re-implementing Carrd's simple reorder logic for our dynamic elements
 */
function handleDynamicReorder() {
    const elements = document.querySelectorAll('#dynamic-content [data-reorder]');

    const applyOrder = () => {
        const isMobile = window.matchMedia('(max-width: 736px)').matches;

        elements.forEach(e => {
            const children = Array.from(e.children);
            if (children.length < 2) return;

            if (isMobile && e.dataset.reorder === '1,0') {
                children[1].style.order = '-1'; // Move second item to start
            } else {
                children[1].style.order = '';
            }
        });
    };

    window.addEventListener('resize', applyOrder);
    applyOrder(); // Initial call
}

/**
 * Inject custom styles to fix layout issues
 */
function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Force 2-column layout on Desktop */
        #dynamic-content .container.style2.columns > .wrapper > .inner > div {
            width: calc(50% + (var(--gutters) / 2));
        }

        /* Uppercase Titles */
        h2.style1 {
            text-transform: uppercase !important;
        }
        
        /* Reset for Mobile */
        @media (max-width: 736px) {
            #dynamic-content .container.style2.columns > .wrapper > .inner > * {
                width: 100% !important;
                margin-left: 0 !important;
                margin-top: 0 !important;
                margin-bottom: 0 !important;
                padding-top: 1.5rem !important;
                padding-bottom: 1.5rem !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Start
document.addEventListener('DOMContentLoaded', init);
