# manuelbgomez.github.io

Personal academic landing page, built with [Jekyll](https://jekyllrb.com/) and published with GitHub Pages.
All content lives in plain YAML files in `_data/`. You never need to touch HTML to update the site.

---

## 1. Preview locally (Docker)

```bash
bash serve.sh              # first run: ~3 min to install gems, then a few seconds
PORT=4001 bash serve.sh    # if port 4000 is already in use
```

Then open **http://localhost:4000**. In VS Code Remote-SSH the port is forwarded automatically
(check the **Ports** tab if no pop-up appears). The page reloads by itself every time you save a file.
Stop it with `Ctrl+C`.

> Run it as `bash serve.sh`, not `./serve.sh`: the shared drive is mounted without execute permission.
> Changes to `_config.yml` restart the preview automatically (refresh the browser after a few seconds);
> everything else reloads live.

## 2. Edit your content

| What                               | File                         |
|------------------------------------|------------------------------|
| Name, photo, bio, links, CV, email | `_data/profile.yml`          |
| News                               | `_data/news.yml`             |
| Research interests (cards)         | `_data/research.yml`         |
| Publications                       | `_data/publications.yml`     |
| Projects                           | `_data/projects.yml`         |
| Education & experience             | `_data/experience.yml`       |
| Talks & teaching                   | `_data/talks.yml`            |
| Awards & grants                    | `_data/awards.yml`           |
| Site title, accent colour, sections shown/order/menu | `_config.yml` |

Each file starts with a comment explaining every field; copy an existing entry and modify it.
Text fields such as the bio and news accept Markdown (`**bold**`, `*italic*`, `[link](https://…)`).

**Files and images**
- Profile photo → `assets/img/` (square, ≥ 400×400 px), then set `photo:` in `profile.yml`.
- CV → replace `assets/files/cv.pdf`.
- Project logos → `assets/img/projects/`.
- Paper PDFs/slides/posters → `assets/files/` and link them as `assets/files/name.pdf`.

**Useful tricks**
- `selected: true` on a publication also shows it on the home page ("Selected publications");
  the full list with filters and search is at `/publications/`.
- Your name is bolded in author lists if it matches one of `author_names` in `profile.yml`.
- To hide a section, remove its block from `sections:` in `_config.yml` (or empty its data file).
- YAML tip: wrap text containing `:` or starting with `*`, `[`, `{` in double quotes.

## 3. Publish

1. Commit and push to `main`.
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)`**.
3. After ~1 minute the site is live.

The repository must be named `<your-github-username>.github.io` to be served at
`https://<your-github-username>.github.io`. If it has any other name, it is served at
`https://<username>.github.io/<repository-name>/`; in that case set `url` and `baseurl` in `_config.yml`
accordingly (instructions are in the file).

## Structure

```
_config.yml            site settings + list of home sections
_data/*.yml            ALL your content
_includes/sections/    one template per home section
_includes/*.html       shared pieces (publication entry, links, timeline, header, footer)
_layouts/default.html  page skeleton
index.html             home page
publications.html      full publication list (/publications/)
assets/css/main.css    styles (colour tokens at the top, light + dark theme)
assets/js/main.js      dark mode, menu, filters, BibTeX copy, animations
docker-compose.yml     local preview environment (same Jekyll version as GitHub Pages)
```
