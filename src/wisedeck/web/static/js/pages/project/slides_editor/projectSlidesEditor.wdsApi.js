/**
 * WiseDeck ↔ PPTist template API helpers (fetch wrappers for SSOT / AIPPT packs).
 * Loaded on project_slides_editor for reuse by legacy scripts or DevTools.
 */
(function (global) {
    'use strict';

    async function parseJsonResponse(response) {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (_) {
            return { _raw: text };
        }
    }

    global.WdsPptistApi = {
        /**
         * GET /api/pptist/templates → { data: [{ id, name, cover_url }] }
         */
        async listTemplates() {
            const res = await fetch('/api/pptist/templates', { credentials: 'same-origin' });
            if (!res.ok) throw new Error('listTemplates failed: ' + res.status);
            return parseJsonResponse(res);
        },

        /**
         * GET /api/pptist/templates/:id → template pack JSON (slides + theme + width/height).
         */
        async getTemplatePack(templateId) {
            const id = encodeURIComponent(templateId || '');
            const res = await fetch('/api/pptist/templates/' + id, { credentials: 'same-origin' });
            if (!res.ok) throw new Error('getTemplatePack failed: ' + res.status);
            return parseJsonResponse(res);
        },
    };
})(typeof window !== 'undefined' ? window : globalThis);
