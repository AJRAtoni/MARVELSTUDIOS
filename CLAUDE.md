# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website listing upcoming Marvel Studios movies and series. Hosted on GitHub Pages at **marvel.ajra.es**. No build tools, no frameworks — vanilla HTML, CSS, and JavaScript.

## Running Locally

Serve with any static server:
```
python3 -m http.server
```
Then open http://localhost:8000. No build step, no dependencies to install.

## Architecture

- **index.html** — Entry point, loads all assets
- **assets/app.js** — Application logic (data fetching, rendering, animations)
- **assets/main.js** — Carrd site framework (layout, responsive reordering, utilities) — do not modify
- **assets/main.css** — Carrd framework CSS — do not modify
- **assets/noscript.css** — Fallback styles when JS is disabled

### Data Flow

1. `init()` in app.js runs on DOMContentLoaded
2. `fetchMovies()` calls Airtable API (base: `apphXPfmF1OwvCPWC`, table: `eventos`, filtered by Franquicia = "Marvel")
3. `createCardMarkup()` generates alternating image-text / text-image card layouts
4. Cards are injected into `#dynamic-content`
5. `initAnimations()` sets up IntersectionObserver for scroll-triggered fade-ins
6. `handleDynamicReorder()` handles mobile layout reordering via flexbox `order`

### Airtable Fields Used

Titulo, Tipo (Movie/Series), FechaOrden (sort date), Imagen (poster URL), IMDbURL, FechaEstrenoTexto (optional custom date text)

## Key Conventions

- Titles are uppercased via CSS `text-transform: uppercase`, not in JavaScript
- Dates are formatted in Spanish locale
- Cards alternate layout direction (image-left/text-right, then text-left/image-right)
- Mobile breakpoint: 736px
- Commit messages follow conventional commits style (feat:, fix:, refactor:, chore:)
- Language context: UI text is in Spanish


## Workflow Orchestration

### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)  
- If something goes sideways, STOP, and re-plan immediately – don’t keep pushing  
- Use plan mode for verification steps, not just building  
- Write detailed specs upfront to reduce ambiguity  

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean  
- Offload research, exploration, and parallel analysis to subagents  
- For complex problems, throw more compute at it via subagents  
- One task per subagent for focused execution  

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern  
- Write rules for yourself that prevent the same mistake  
- Ruthlessly iterate on these lessons until mistake rate drops  
- Review lessons at session start for relevant project  

### 4. Verification Before Done
- Never mark a task complete without proving it works  
- Diff behavior between main and your changes when relevant  
- Ask yourself: “Would a staff engineer approve this?”  
- Run tests, check logs, demonstrate correctness  

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask “is there a more elegant way?”  
- If a fix feels hacky: “Knowing everything I know now, implement the elegant solution”  
- Skip this for simple, obvious fixes – don’t over-engineer  
- Challenge your own work before presenting it  

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don’t ask for hand-holding  
- Point at logs, errors, failing tests – then resolve them  
- Zero context switching required from the user  
- Go fix failing CI tests without being told how  

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items  
2. **Verify Plan**: Check in before starting implementation  
3. **Track Progress**: Mark items complete as you go  
4. **Explain Changes**: High-level summary at each step  
5. **Document Results**: Add review section to `tasks/todo.md`  
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections  

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.  
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.  
- **Minimal Impact**: Changes should only touch what’s necessary. Avoid introducing bugs.  
