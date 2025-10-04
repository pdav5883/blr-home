# BLR Shared Frontend

A shared frontend package for Bear Loves Rocks projects that provides a configurable navbar component. This package focuses purely on the navbar UI and structure, leaving authentication logic to the consuming application.

## Installation

```bash
npm install blr-shared-frontend
```

## Usage

### Basic Setup

1. Create a navbar configuration file in your project:

```javascript
// navbar-config.js
export const navbarConfig = {
  // Brand/logo configuration
  brand: {
    image: './assets/bear1.svg',
    link: '/',
    alt: 'Bear logo'
  },
  
  // Project links in dropdown
  projects: [
    { name: 'bowl-pickem', url: 'https://bowls.bearloves.rocks' },
    { name: 'bracket-revival', url: 'https://bracket.bearloves.rocks' },
    // ... more projects
  ],
  
  // About links in dropdown
  about: [
    { name: 'The Name', url: '/name.html' },
    { name: 'The Projects', url: '/projects.html' },
    { name: 'The Author', url: '/author.html' }
  ]
};
```

2. Initialize the navbar in your main script:

```javascript
// main.js
import { initNavbar, updateNavbarAuth } from 'blr-shared-frontend';
import { navbarConfig } from './navbar-config.js';

// Initialize navbar when DOM is ready
$(function() {
  initNavbar(navbarConfig);
  
  // Set up your authentication event handlers
  $(document).on('navbar:signin:click', () => {
    // Handle sign in click
    window.location.href = '/login.html';
  });
  
  $(document).on('navbar:admin:click', () => {
    // Handle admin click
    window.location.href = '/admin.html';
  });
  
  $(document).on('navbar:signout:click', () => {
    // Handle sign out click
    yourSignOutFunction();
  });
  
  // Update navbar authentication state
  updateNavbarAuth(isUserAuthenticated(), {
    firstName: userFirstName,
    lastName: userLastName,
    isAdmin: isUserAdmin
  });
});
```

3. Add the nav placeholder to your HTML:

```html
<div id="nav-placeholder"></div>
```

### Configuration Options

#### Navbar Configuration

- `brand`: Object containing brand/logo information
  - `image`: Path to logo image
  - `link`: URL for logo link
  - `alt`: Alt text for logo
- `projects`: Array of project links for dropdown
  - `name`: Display name
  - `url`: Link URL
- `about`: Array of about links for dropdown
  - `name`: Display name
  - `url`: Link URL

### Available Functions

The package provides utility functions for navbar management and button spinners:

```javascript
import { 
  initNavbar, 
  updateNavbarAuth, 
  initButtons, 
  spinnerOn, 
  spinnerOff 
} from 'blr-shared-frontend';

// Initialize navbar with configuration
initNavbar(navbarConfig);

// Update authentication state in navbar
updateNavbarAuth(isAuthenticated, userInfo);

// Initialize buttons with spinner functionality
initButtons(['submit-button', 'save-button']);

// Show/hide spinners
spinnerOn('submit-button');
spinnerOff('submit-button');
```

### Event Handling

The navbar triggers custom events that your application can listen for:

- `navbar:signin:click` - Triggered when sign in button is clicked
- `navbar:admin:click` - Triggered when admin button is clicked  
- `navbar:signout:click` - Triggered when sign out button is clicked

## Dependencies

This package requires the following peer dependencies:
- `jquery` (^3.5.0)
- `bootstrap` (^5.0.0)

Make sure these are installed in your project.