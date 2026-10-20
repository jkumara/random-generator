# random

Random values I keep needing, at [random.kumara.dev](https://random.kumara.dev): five each of

- UUID v4
- 32-character alphanumeric strings (A–Z, a–z, 0–9)
- 64-character hex strings, i.e. 32 bytes: an AES-256 key or a SHA-256-sized value

Click a value to copy it. Reload, press `R` or hit ↻ for a new set.

Everything is generated in the browser with the Web Crypto API (`crypto.randomUUID` and `crypto.getRandomValues`), so nothing is sent or logged anywhere. The alphanumeric strings use rejection sampling, so every character is equally likely.

## Edit

Static files, no build step: `app.js` makes the values, `style.css` is Tokyo Night. Preview with `python3 -m http.server` (the clipboard and `randomUUID` need `localhost` or HTTPS, not `file://`).
