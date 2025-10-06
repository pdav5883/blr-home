import $ from "jquery"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "./navbar.css"


export function initNavbarConfig(config, callback) {
  $(function() {
    // Generate navbar HTML from config
    const navbarHTML = generateNavbarHTML(config);    
    // Replace the nav placeholder with generated navbar
    $("#nav-placeholder").replaceWith(navbarHTML);
      
    // Call the callback after DOM is updated
    if (callback) {
      setTimeout(callback, 0);
    }
  });
}

export function updateNavbarAuth(isAuthenticated, userInfo = {}) {
  // Ensure DOM is ready before updating
  $(function() {
    if (isAuthenticated) {
      $("#signin-button").hide();
      $("#user-menu").show();
      
      if (userInfo.firstName && userInfo.lastName) {
        $("#user-menu").text(`${userInfo.firstName} ${userInfo.lastName[0]}`);
      }
      
      if (userInfo.isAdmin) {
        $("#admin-button").show();
      } else {
        $("#admin-button").hide();
      }
    } else {
      $("#signin-button").show();
      $("#user-menu").hide();
    }
  });
}

function generateNavbarHTML(config) {
  const { brand, sections = [] } = config;
  
  // Generate navbar sections
  const navbarSections = sections.map(section => {
    if (section.type === 'dropdown') {
      // Generate dropdown items
      const dropdownItems = section.items.map(item => 
        `<li><a class="dropdown-item" href="${item.url}">${item.name}</a></li>`
      ).join('\n\t\t\t\t');
      
      return `
\t\t<li class="nav-item px-md-2 dropdown">
\t\t  <a class="nav-link active dropdown-toggle" href="#" data-bs-toggle="dropdown">${section.label}</a>
\t\t  <ul class="dropdown-menu">
\t\t\t\t${dropdownItems}
\t\t  </ul>
\t\t</li>`;
    } else if (section.type === 'link') {
      // Generate direct link
      return `
\t\t<li class="nav-item px-md-2">
\t\t  <a class="nav-link active" href="${section.url}">${section.label}</a>
\t\t</li>`;
    }
    return '';
  }).join('');
  
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
${navbarSections}
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
