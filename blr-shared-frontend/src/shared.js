import $ from "jquery"
import { initNavbarConfig, updateNavbarAuth} from "./navbar.js"
import { InitiateAuthCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export const COGNITO_CONFIG = {
  UserPoolId: "us-east-1_lzSJUtNLD",
  ClientId: "1tq5jpqipsvpi7vrpil17feob6",
  Region: "us-east-1"
};

const client = new CognitoIdentityProviderClient({
  region: COGNITO_CONFIG.Region
});

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

export function spinnerOn(buttonId) {
  $(`#${buttonId} span`).hide();
  $(`#${buttonId} div`).show();
}

export function spinnerOff(buttonId) {
  $(`#${buttonId} span`).show();
  $(`#${buttonId} div`).hide();
}

// Common init of navbar using shared package
export function initNavbar(navbarConfig) {
  
  // Initialize navbar with callback to set up button handlers
  initNavbarConfig(navbarConfig, () => {    
    $("#signin-button").on("click", () => {
      window.location.href = '/login.html';
    });
    
    $("#admin-button").on("click", () => {
      window.location.href = '/admin.html';
    });
    
    $("#signout-button").on("click", () => {
      signOut();
    });
        
    // Update navbar auth state after handlers are set up
    updateAuthState();
  });
}

// Update authentication state in navbar
function updateAuthState() {
  if (isAuthenticated()) {
    const userFirstName = localStorage.getItem('blr-userFirstName');
    const userLastName = localStorage.getItem('blr-userLastName');
    const isAdmin = localStorage.getItem('blr-isAdmin') === 'true';
    
    updateNavbarAuth(true, {
      firstName: userFirstName,
      lastName: userLastName,
      isAdmin: isAdmin
    });
  } else {
    updateNavbarAuth(false);
  }
}

export function signOut() {
  // Update Sign Out
  localStorage.removeItem('blr-accessToken');
  localStorage.removeItem('blr-refreshToken');
  localStorage.removeItem('blr-tokenExpiration');
  localStorage.removeItem('blr-userFirstName');
  localStorage.removeItem('blr-userLastName');
  localStorage.removeItem('blr-isAdmin');

  // Update navbar state
  updateNavbarAuth(false);
}

// Add this new function to handle refresh
async function refreshToken() {
  try {
      const command = new InitiateAuthCommand({
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          ClientId: COGNITO_CONFIG.ClientId,
          AuthParameters: {
              'REFRESH_TOKEN': localStorage.getItem('blr-refreshToken')
          }
      });

      const response = await client.send(command);
      
      if (response.AuthenticationResult) {
          localStorage.setItem('blr-accessToken', response.AuthenticationResult.AccessToken);
          localStorage.setItem('blr-tokenExpiration', Date.now() + (response.AuthenticationResult.ExpiresIn * 1000));
          return response.AuthenticationResult.AccessToken;
      }
  } catch (error) {
      console.error('Error refreshing token:', error);
      // If refresh fails, sign out user
      signOut();
      return ""
  }
}

// Add this function to check and refresh token when needed
export async function getValidAccessToken() {
  const expiration = localStorage.getItem('blr-tokenExpiration');

  if (expiration === null) {
    console.error('User is not logged in.')
    signOut();
    return ""
  }
  
  const currentTime = Date.now();
  
  if (expiration && currentTime >= expiration - 60000) { // Refresh if within 1 minute of expiration
      return await refreshToken();
  }
  else {
    return localStorage.getItem('blr-accessToken');
  }
}

export function isAuthenticated() {
  const accessToken = localStorage.getItem('blr-accessToken');
  return !!accessToken;
}