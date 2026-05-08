/**
 * Full Editor Integration
 * 将完整编辑器集成到现有 PPT 编辑器页面
 */

function openFullEditor() {
    const projectId = getProjectIdFromUrl();

    if (!projectId) {
        alert('无法获取项目ID');
        return;
    }

    const fullEditorUrl = `/project/${projectId}/full-editor`;

    window.open(fullEditorUrl, '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
}

function getProjectIdFromUrl() {
    const match = window.location.pathname.match(/\/projects\/([^\/]+)/);
    return match ? match[1] : null;
}

function initFullEditorIntegration() {
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'fullEditorSaved') {
            const projectId = event.data.projectId;
            if (projectId) {
                refreshSlidesData(projectId);
            }
        }
    });
}

async function refreshSlidesData(projectId) {
    try {
        const response = await fetch(`/api/projects/${projectId}/slides-data`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.slides_data && data.slides_data.length > 0) {
                window.projectSlidesData = data.slides_data;
                updateSlideThumbnails(data.slides_data);
                updateCurrentSlidePreview(data.slides_data[0]);
                
                const toast = document.createElement('div');
                toast.className = 'editor-toast';
                toast.textContent = '幻灯片已从完整编辑器更新';
                toast.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #28a745;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                `;
                document.body.appendChild(toast);
                
                setTimeout(() => {
                    toast.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }
        }
    } catch (error) {
        console.error('刷新幻灯片数据失败:', error);
    }
}

function updateSlideThumbnails(slides) {
    const container = document.querySelector('.slides-container');
    if (!container) return;

    const currentIndex = window.currentSlideIndex || 0;
    container.innerHTML = '';

    slides.forEach((slide, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `slide-thumbnail ${index === currentIndex ? 'active' : ''}`;
        thumbnail.dataset.slideIndex = index;
        thumbnail.draggable = true;

        thumbnail.innerHTML = `
            <div class="drag-indicator top"></div>
            <div class="slide-preview">
                <iframe srcdoc="${slide.html_content ? encodeURIComponent(slide.html_content) : ''}" title="Slide ${index + 1}"></iframe>
            </div>
            <div class="slide-title">${index + 1}. ${slide.title || ''}</div>
            <div class="drag-indicator bottom"></div>
        `;

        thumbnail.addEventListener('click', () => {
            navigateToSlide(index);
        });

        container.appendChild(thumbnail);
    });
}

function updateCurrentSlidePreview(slide) {
    const slideFrame = document.getElementById('slideFrame');
    if (slideFrame && slide && slide.html_content) {
        slideFrame.srcdoc = slide.html_content;
    }
}

window.openFullEditor = openFullEditor;
window.initFullEditorIntegration = initFullEditorIntegration;
