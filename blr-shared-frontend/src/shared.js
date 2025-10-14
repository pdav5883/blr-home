import $ from "jquery"
import { initNavbarConfig, updateNavbarAuth} from "./navbar.js"
import { InitiateAuthCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export const COGNITO_CONFIG = {
  UserPoolId: "us-east-1_lzSJUtNLD", // TODO: change to cfn substitution
  ClientId: "1tq5jpqipsvpi7vrpil17feob6",
  Region: "us-east-1",
  DeployedRootURL: "http://home.bearloves.rocks"
};

const client = new CognitoIdentityProviderClient({
  region: COGNITO_CONFIG.Region
});

// Cookie utility functions for cross-subdomain authentication
const COOKIE_DOMAIN = '.bearloves.rocks';

export function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};domain=${COOKIE_DOMAIN};path=/;SameSite=Lax`;
}

export function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=${COOKIE_DOMAIN};path=/`;
}

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
      // window.location.href = '/login.html';
      window.location.href = COGNITO_CONFIG.DeployedRootURL + '/login.html?redirectUrl=' + window.location.href;
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
    const userFirstName = getCookie('blr-userFirstName');
    const userLastName = getCookie('blr-userLastName');
    const isAdmin = getCookie('blr-isAdmin') === 'true';
    
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
  deleteCookie('blr-accessToken');
  deleteCookie('blr-refreshToken');
  deleteCookie('blr-tokenExpiration');
  deleteCookie('blr-userFirstName');
  deleteCookie('blr-userLastName');
  deleteCookie('blr-isAdmin');

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
              'REFRESH_TOKEN': getCookie('blr-refreshToken')
          }
      });

      const response = await client.send(command);
      
      if (response.AuthenticationResult) {
          setCookie('blr-accessToken', response.AuthenticationResult.AccessToken);
          setCookie('blr-tokenExpiration', Date.now() + (response.AuthenticationResult.ExpiresIn * 1000));
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
  const expiration = getCookie('blr-tokenExpiration');

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
    return getCookie('blr-accessToken');
  }
}

export function isAuthenticated() {
  const accessToken = getCookie('blr-accessToken');
  return !!accessToken;
}