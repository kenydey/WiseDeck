# WiseDeck render-service (Presenton Next.js subtree)

This directory is a vendored copy of Presenton `servers/nextjs` used for **optional** high-fidelity export:
Puppeteer measures DOM → JSON `PptxPresentationModel` → WiseDeck Python builds `.pptx` with **editable native charts** when chart metadata is present.

## Run locally

```powershell
cd render-service
$env:APP_DATA_DIRECTORY = "$pwd\..\temp\wisedeck_app_data"
New-Item -ItemType Directory -Force -Path $env:APP_DATA_DIRECTORY | Out-Null
npm install
npm run dev -- -p 5000
```

Set `WISEDECK_RENDER_SERVICE_URL=http://127.0.0.1:5000` on the WiseDeck FastAPI process so `/api/projects/{id}/export/structured-pptx` can call the render service.

Optional: `PUPPETEER_EXECUTABLE_PATH` to a Chromium binary for headless export.

## WiseDeck bridge

- `POST /api/wisedeck/session` — register presentation JSON; returns `session_id`
- `GET /api/wisedeck/session?id=` — used by `pdf-maker` when `id=wisedeck-{session_id}`
