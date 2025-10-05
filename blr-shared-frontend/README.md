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
    image: './assets/your-logo.svg',
    link: '/',
    alt: 'Your project logo'
  },
  
  // Generic sections - can be dropdowns or direct links
  sections: [
    {
      type: 'dropdown',
      label: 'Projects',
      items: [
        { name: 'project-1', url: 'https://project1.example.com' },
        { name: 'project-2', url: 'https://project2.example.com' }
      ]
    },
    {
      type: 'link',
      label: 'About',
      url: '/about.html'
    },
    {
      type: 'dropdown',
      label: 'Resources',
      items: [
        { name: 'Documentation', url: '/docs.html' },
        { name: 'Support', url: '/support.html' }
      ]
    }
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
  // Set up your authentication event handlers FIRST
  $(document).on('navbar:signin:click', () => {
    // Handle sign in click - customize for your project
    window.location.href = '/login.html';
  });
  
  $(document).on('navbar:admin:click', () => {
    // Handle admin click - customize for your project
    window.location.href = '/admin.html';
  });
  
  $(document).on('navbar:signout:click', () => {
    // Handle sign out click - customize for your project
    yourSignOutFunction();
  });
  
  // Initialize navbar with callback to update auth state
  initNavbar(navbarConfig, () => {
    // Update navbar authentication state after navbar is ready
    updateNavbarAuth(isUserAuthenticated(), {
      firstName: userFirstName,
      lastName: userLastName,
      isAdmin: isUserAdmin
    });
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
- `sections`: Array of navbar sections
  - `type`: Either `'dropdown'` or `'link'`
  - `label`: Display text for the section
  - For dropdowns: `items` array with `name` and `url` properties
  - For links: `url` property for direct navigation

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

## Styling

The package includes its own CSS for navbar-specific styling, including:
- Mobile-responsive navbar layout
- Proper ordering of navbar elements on mobile devices
- Bootstrap integration

The navbar styles are automatically imported when you use the package, so no additional CSS setup is required.

## Example Configurations

### Simple Project with Mixed Sections

```javascript
export const navbarConfig = {
  brand: {
    image: './assets/logo.svg',
    link: '/',
    alt: 'My Project'
  },
  sections: [
    {
      type: 'link',
      label: 'Home',
      url: '/'
    },
    {
      type: 'dropdown',
      label: 'Products',
      items: [
        { name: 'Product A', url: '/product-a.html' },
        { name: 'Product B', url: '/product-b.html' }
      ]
    },
    {
      type: 'link',
      label: 'Contact',
      url: '/contact.html'
    }
  ]
};
```

### Project with Only Dropdowns

```javascript
export const navbarConfig = {
  brand: {
    image: './assets/logo.svg',
    link: '/',
    alt: 'My Project'
  },
  sections: [
    {
      type: 'dropdown',
      label: 'Services',
      items: [
        { name: 'Web Development', url: '/web-dev.html' },
        { name: 'Mobile Apps', url: '/mobile.html' },
        { name: 'Consulting', url: '/consulting.html' }
      ]
    },
    {
      type: 'dropdown',
      label: 'Company',
      items: [
        { name: 'About Us', url: '/about.html' },
        { name: 'Team', url: '/team.html' },
        { name: 'Careers', url: '/careers.html' }
      ]
    }
  ]
};
```