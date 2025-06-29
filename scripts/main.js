// Main script to handle dynamic project rendering and filtering
document.addEventListener('DOMContentLoaded', () => {
    let projectsData = [];
    fetch('./json/projects.json')
        .then(response => response.json())
        .then(data => {
            projectsData = data;
            // Initial render of all projects after data is loaded
            renderProjects('All');
        });

    let iconsData = {};
    fetch('./json/icon.json')
        .then(response => response.json())
        .then(data => {
            iconsData = data;
        });

    const galleryGrid = document.getElementById('project-gallery-grid');
    const filterButtonsContainer = document.getElementById('filter-buttons');

    // Function to render projects based on a category
    const renderProjects = (category) => {
        // Clear the existing grid
        galleryGrid.innerHTML = '';

        // Filter projects
        const filteredProjects = category === 'All'
            ? projectsData
            : projectsData.filter(project => project.category === category);

        // Create and append project cards
        filteredProjects.forEach(project => {
            const iconSvg = iconsData[project.iconKey] || ''; // Get the icon SVG
            
            const projectCard = document.createElement('div');
            projectCard.className = 'group bg-slate-800 rounded-lg overflow-hidden project-card transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20';
            projectCard.innerHTML = `
                <div class="relative">
                    <img src="${project.imageUrl}" alt="${project.title}" class="w-full h-56 object-cover transition-transform duration-300 ease-in-out">
                    <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 transition-opacity duration-300 project-overlay">
                        ${iconSvg}
                    </div>
                </div>
                <div class="p-5">
                    <p class="text-sm ${project.categoryColor} font-medium">${project.category}</p>
                    <h3 class="text-lg font-bold text-white mt-1">${project.title}</h3>
                </div>
            `;
            galleryGrid.appendChild(projectCard);
        });
    };

    // Event listener for filter buttons (using event delegation)
    filterButtonsContainer.addEventListener('click', (event) => {
        const target = event.target.closest('.filter-btn');
        if (!target) return; // Exit if the click was not on a button

        // Update active state for buttons
        filterButtonsContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-slate-700', 'text-white');
            btn.classList.add('bg-slate-800', 'text-slate-300');
        });
        target.classList.add('active', 'bg-slate-700', 'text-white');
        target.classList.remove('bg-slate-800', 'text-slate-300');

        // Get the category from the data attribute and render the projects
        const category = target.dataset.category;
        renderProjects(category);
    });

    // Initial render of all projects
    // renderProjects('All');
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