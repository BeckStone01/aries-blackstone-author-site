# Aries Blackstone Author Site

Static author website for Aries Blackstone and the Quantum Series.

## Publish on Netlify

This site does not require a build step.

Netlify settings:

- Build command: leave blank
- Publish directory: `.`

The included `netlify.toml` and `_redirects` files configure static publishing, redirects, and basic headers.

## Publish from GitHub

1. Create a new GitHub repository.
2. Upload or push all files in this folder.
3. Connect the repository to Netlify.
4. Use the Netlify settings above.

## Local Preview

Run a local static server from this folder:

```bash
python -m http.server 3001
```

Then open:

```text
http://localhost:3001
```
