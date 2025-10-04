import $ from "jquery"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import { generateNavbarHTML } from "./navbar-generator.js"

/**
 * Initialize the navbar with configuration
 * @param {Object} config - Navbar configuration object
 */
export function initNavbar(config, callback) {
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

/**
 * Initialize buttons with spinner functionality
 * @param {Array<string>} buttonIdList - Array of button IDs to initialize
 */
export function initButtons(buttonIdList) {
  for (const buttonId of buttonIdList) {
    const button = $(`#${buttonId}`);
    const buttonText = button.text();
    button.empty();
    button.append($('<span>').text(buttonText));
    button.append($('<div class="spinner-border spinner-border-sm" style="display: none;"></div>'));

    // Store original dimensions and set fixed width
    const width = button.outerWidth();
    button.css({
      width: width + 'px',
    });
  }
}

/**
 * Show spinner on button
 * @param {string} buttonId - Button ID to show spinner on
 */
export function spinnerOn(buttonId) {
  $(`#${buttonId} span`).hide();
  $(`#${buttonId} div`).show();
}

/**
 * Hide spinner on button
 * @param {string} buttonId - Button ID to hide spinner on
 */
export function spinnerOff(buttonId) {
  $(`#${buttonId} span`).show();
  $(`#${buttonId} div`).hide();
}

/**
 * Show/hide navbar authentication elements
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @param {Object} userInfo - User information object (optional)
 */
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
