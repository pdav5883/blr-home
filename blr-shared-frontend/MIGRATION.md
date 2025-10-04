# Migration Guide: Frontend Navbar to blr-shared-frontend

This document explains how to migrate from the old navbar implementation to the new `blr-shared-frontend` package.

## What Changed

### Before (Old Implementation)
- Navbar HTML was stored in `frontend/src/nav.html`
- Navbar logic and authentication were in `frontend/src/scripts/shared.js`
- Configuration was in `frontend/src/config/navbar-config.js`
- Webpack copied `nav.html` to assets folder

### After (New Implementation)
- Navbar HTML is generated dynamically from configuration
- Navbar UI logic is in the `blr-shared-frontend` npm package (no auth logic)
- Authentication logic remains in the consuming application
- Configuration remains in `frontend/src/config/navbar-config.js` (no auth config)
- No need to copy static HTML files

## Files Modified

### Frontend Changes
1. **frontend/src/config/navbar-config.js**
   - Removed `authConfig` export (auth logic moved to shared.js)
   - Kept existing `navbarConfig` structure

2. **frontend/src/scripts/shared.js**
   - Uses `initNavbar` from shared package for UI
   - Handles authentication logic locally
   - Uses `updateNavbarAuth` to update navbar state
   - Listens for navbar events and handles auth actions

3. **frontend/package.json**
   - Added dependency: `"blr-shared-frontend": "file:../blr-shared-frontend"`

4. **frontend/webpack.config.js**
   - Removed copying of `nav.html` file

5. **frontend/src/nav.html** (deleted)
   - No longer needed as HTML is generated dynamically

### New Package Structure
```
blr-shared-frontend/
├── package.json
├── webpack.config.js
├── README.md
├── src/
│   ├── index.js          # Main entry point
│   ├── navbar.js         # Navbar initialization and auth logic
│   └── navbar-generator.js # HTML generation from config
└── dist/                 # Built package (after npm run build)
    └── index.js
```

## Usage in Other Projects

To use this navbar in other projects:

1. **Install the package:**
   ```bash
   npm install blr-shared-frontend
   ```

2. **Create navbar configuration:**
   ```javascript
   // navbar-config.js
   export const navbarConfig = {
     brand: {
       image: './assets/your-logo.svg',
       link: '/',
       alt: 'Your logo'
     },
     projects: [
       { name: 'project-1', url: 'https://project1.example.com' },
       // ... more projects
     ],
     about: [
       { name: 'About', url: '/about.html' },
       // ... more about links
     ]
   };

   ```

3. **Initialize navbar and handle authentication:**
   ```javascript
   // main.js
   import { initNavbar, updateNavbarAuth } from 'blr-shared-frontend';
   import { navbarConfig } from './navbar-config.js';

   $(function() {
     initNavbar(navbarConfig);
     
     // Set up authentication event handlers
     $(document).on('navbar:signin:click', () => {
       // Handle sign in
       window.location.href = '/login.html';
     });
     
     $(document).on('navbar:signout:click', () => {
       // Handle sign out
       yourSignOutFunction();
     });
     
     // Update navbar auth state
     updateNavbarAuth(isAuthenticated(), userInfo);
   });
   ```

4. **Add nav placeholder to HTML:**
   ```html
   <div id="nav-placeholder"></div>
   ```

## Benefits

1. **Reusability**: Navbar can be used across multiple projects
2. **Maintainability**: Single source of truth for navbar functionality
3. **Flexibility**: Each project can customize navbar through configuration
4. **Consistency**: Ensures consistent navbar behavior across projects
5. **Version Control**: Can version and update navbar functionality independently

## Testing

The package includes a test file (`test.html`) that can be used to verify functionality:

1. Build the package: `npm run build`
2. Open `test.html` in a browser
3. Verify navbar renders correctly and functions work

## Development

To develop on the shared package:

1. Make changes to files in `src/`
2. Run `npm run build` to build the package
3. Test changes in consuming projects
4. Update version in `package.json` when ready to publish
