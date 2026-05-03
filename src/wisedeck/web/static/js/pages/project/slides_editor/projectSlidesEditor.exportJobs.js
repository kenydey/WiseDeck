/**
 * Export job history (async PDF / PPTX tasks) — lists /api/projects/:id/exports
 */
(function () {
    if (typeof window === 'undefined') return;

    function _escapeHtml(s) {
        if (s == null || s === undefined) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    async function openExportJobsModal() {
        const projectId = window.PROJECT_ID || window.projectId;
        if (!projectId) {
            console.warn('PROJECT_ID missing');
            return;
        }
        const modalId = 'wdExportJobsModal';
        let el = document.getElementById(modalId);
        if (!el) {
            el = document.createElement('div');
            el.id = modalId;
            el.className = 'modal fade';
            el.setAttribute('tabindex', '-1');
            el.innerHTML =
                '<div class="modal-dialog modal-lg modal-dialog-scrollable">' +
                '<div class="modal-content">' +
                '<div class="modal-header"><h5 class="modal-title">导出任务历史</h5>' +
                '<button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>' +
                '<div class="modal-body"><div id="wdExportJobsBody" class="small text-muted">加载中…</div></div>' +
                '</div></div>';
            document.body.appendChild(el);
        }
        const body = document.getElementById('wdExportJobsBody');
        if (body) body.textContent = '加载中…';
        try {
            const res = await fetch('/api/projects/' + encodeURIComponent(projectId) + '/exports?limit=50', {
                credentials: 'same-origin',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || res.statusText);
            const rows = (data.exports || []).map(function (j) {
                const st = j.status || '';
                const kind = j.kind || '';
                const t0 = j.created_at ? new Date(j.created_at * 1000).toLocaleString() : '';
                const t1 = j.completed_at ? new Date(j.completed_at * 1000).toLocaleString() : '';
                const err = j.error_message
                    ? '<div class="text-danger mt-1">' +
                      _escapeHtml(String(j.error_message).slice(0, 300)) +
                      '</div>'
                    : '';
                const poll =
                    st === 'running' || st === 'queued'
                        ? '<div><a href="/api/wisedeck/tasks/' +
                          encodeURIComponent(j.task_id || '') +
                          '" target="_blank" rel="noopener">查询任务状态</a></div>'
                        : '';
                const dl =
                    st === 'succeeded'
                        ? '<div><a href="/api/wisedeck/tasks/' +
                          encodeURIComponent(j.task_id || '') +
                          '/download">下载</a>（若仍有效）</div>'
                        : '';
                return (
                    '<div class="border rounded p-2 mb-2">' +
                    '<div><strong>' +
                    _escapeHtml(kind) +
                    '</strong> · <code>' +
                    _escapeHtml(j.task_id || '') +
                    '</code></div>' +
                    '<div>状态: ' +
                    _escapeHtml(st) +
                    ' · 进度: ' +
                    _escapeHtml(j.progress != null ? j.progress : '') +
                    '</div>' +
                    '<div class="text-muted">开始: ' +
                    _escapeHtml(t0) +
                    ' · 结束: ' +
                    _escapeHtml(t1) +
                    '</div>' +
                    poll +
                    dl +
                    err +
                    '</div>'
                );
            });
            if (body) body.innerHTML = rows.length ? rows.join('') : '<p>暂无导出记录（异步 PDF / 标准 PPTX / 图片 PPTX 导出会出现在此）。</p>';
        } catch (e) {
            if (body) body.innerHTML = '<p class="text-danger">加载失败: ' + _escapeHtml(String(e.message || e)) + '</p>';
        }
        if (window.bootstrap && window.bootstrap.Modal) {
            window.bootstrap.Modal.getOrCreateInstance(el).show();
        } else {
            el.style.display = 'block';
        }
    }

    window.openExportJobsModal = openExportJobsModal;
})();
