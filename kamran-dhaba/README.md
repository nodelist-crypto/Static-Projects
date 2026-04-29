# Kamran Dhaba — Restaurant Website

  A multi-page static website built with plain HTML, CSS, and vanilla JavaScript.
  No build step required — open index.html in your browser to view it.

  ## Files

  - index.html         — Homepage
  - menu.html          — Full menu (9 categories, 35+ items)
  - about.html         — Story, values, timeline
  - reservations.html  — Booking form
  - contact.html       — Contact form + map
  - style.css          — All styles (one stylesheet)
  - script.js          — All interactions (nav, scroll reveal, menu tabs, forms)
  - public/images/     — All photos used on the site

  ## Editing

  Open any .html file in a code editor and edit the text directly.
  Change colors and fonts at the top of style.css (look for ":root { --maroon: ... }").
  Change behavior in script.js.

  ## Hosting

  Upload all files (preserving the folder structure) to any static host:
  GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any web hosting that
  serves static HTML.

  The forms currently save submissions to the browser's localStorage.
  To send them to your email or a database, replace the form-handler functions
  in script.js with a fetch() call to your backend.
  