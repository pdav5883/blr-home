/**
 * Generates navbar HTML based on configuration
 * @param {Object} config - Navbar configuration object
 * @returns {string} - HTML string for the navbar
 */
export function generateNavbarHTML(config) {
  const { brand, projects = [], about = [] } = config;
  
  // Generate projects dropdown items
  const projectsItems = projects.map(project => 
    `<li><a class="dropdown-item" href="${project.url}"><em>${project.name}</em></a></li>`
  ).join('\n\t\t\t\t');
  
  // Generate about dropdown items
  const aboutItems = about.map(item => 
    `<li><a class="dropdown-item" href="${item.url}">${item.name}</a></li>`
  ).join('\n\t\t\t\t');
  
  return `
<nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
  <div class="container-fluid">

    <a class="navbar-brand px-2 py-0 m-0" href="${brand.link}">
      <img src="${brand.image}" width="36" height="36" alt="${brand.alt}">
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
      <ul class="navbar-nav me-auto mb-2 mb-md-0">
${projects.length > 0 ? `
\t\t<li class="nav-item px-md-2 dropdown">
\t\t  <a class="nav-link active dropdown-toggle h4" href="#" data-bs-toggle="dropdown">Projects</a>
\t\t  <ul class="dropdown-menu">
\t\t\t\t${projectsItems}
\t\t  </ul>
\t\t</li>` : ''}
${about.length > 0 ? `
\t\t<li class="nav-item px-md-2 dropdown">
\t\t  <a class="nav-link active dropdown-toggle h4" href="#" data-bs-toggle="dropdown">About</a>
\t\t  <ul class="dropdown-menu">
\t\t\t\t${aboutItems}
\t\t  </ul>
\t\t</li>` : ''}
      </ul>
    </div>
\t\t<div class="d-flex">
\t\t\t<button id="signin-button" class="btn btn-primary me-2">Sign In</button>
\t\t\t<div class="dropdown">
\t\t\t\t<button id="user-menu" class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
\t\t\t\t\taria-expanded="false">
\t\t\t\t</button>
\t\t\t\t<ul class="dropdown-menu" aria-labelledby="user-menu">
\t\t\t\t\t<li><button id="admin-button" class="dropdown-item" type="button">Admin</button></li>
\t\t\t\t\t<li><button id="signout-button" class="dropdown-item" type="button">Sign Out</button></li>
\t\t\t\t</ul>
\t\t\t</div>
\t\t</div>
  </div>
</nav>`;
}
