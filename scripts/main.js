// Main script to handle dynamic project rendering and filtering
document.addEventListener('DOMContentLoaded', () => {
    // Load icons
    fetch('json/icon.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load icons');
            return response.json();
        })
        .then(data => window.iconsData = data)
        .catch(error => console.error('Icon loading error:', error));

    // Load projects
    fetch('json/projects.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load projects');
            return response.json();
        })
        .then(data => {
            window.projectsData = data;
            renderProjects('All');
        })
        .catch(error => {
            console.error('Project loading error:', error);
            document.getElementById('project-gallery-grid').innerHTML = `
                <div class="col-span-3 text-center py-12 text-red-400">
                    Failed to load projects. Please refresh the page.
                </div>
            `;
        });

    const renderProjects = (category) => {
        const galleryGrid = document.getElementById('project-gallery-grid');
        galleryGrid.innerHTML = '';

        const filteredProjects = category === 'All' 
            ? window.projectsData 
            : window.projectsData.filter(p => p.category === category);

        filteredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'bg-slate-800 rounded-lg overflow-hidden project-card transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20';

            // Media content with error handling
            let mediaContent = '';
            try {
                if (project.mediaType === 'video') {
                    mediaContent = `
                        <iframe src="${project.mediaUrl}" 
                                class="w-full h-full" 
                                allowfullscreen
                                onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\'video-error\'>Video failed to load</div>'">
                        </iframe>
                    `;
                } else if (project.mediaType === 'instagram') {
                    mediaContent = `
                        <blockquote class="instagram-media" 
                                   data-instgrm-permalink="${project.mediaUrl}"
                                   data-instgrm-version="14">
                        </blockquote>
                    `;
                } else {
                    mediaContent = `
                        <img src="${project.mediaUrl}" 
                             alt="${project.title}" 
                             class="w-full h-full object-cover"
                             loading="lazy"
                             onerror="this.onerror=null;this.src='img/fallback.jpg'">
                    `;
                }
            } catch (e) {
                mediaContent = '<div class="image-error">Media failed to load</div>';
            }

                projectCard.innerHTML = `
                    <div class="aspect-video">
                        ${mediaContent}
                    </div>
                    <div class="p-5">
                        <p class="text-sm ${project.categoryColor} font-medium">${project.category}</p>
                        <h3 class="text-lg font-bold text-white mt-1">${project.title}</h3>
                        <p class="text-xs text-slate-400 mt-2 line-clamp-2">${project.description}</p>
                        <a href="${project.projectUrl}" target="_blank" rel="noopener noreferrer"
                        class="mt-3 inline-flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                        View Project
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        </a>
                    </div>
    `;

            galleryGrid.appendChild(projectCard);
        });
    };

    // Filter buttons
    document.getElementById('filter-buttons').addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.toggle('active', b === btn);
            b.classList.toggle('bg-slate-700', b === btn);
            b.classList.toggle('text-white', b === btn);
            b.classList.toggle('bg-slate-800', b !== btn);
            b.classList.toggle('text-slate-300', b !== btn);
        });
        
        renderProjects(btn.dataset.category);
    });
});

// Simple mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('#mobile-menu a.nav-link');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close menu when a link is clicked on mobile
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});