import "../styles/custom.css"
import $ from "jquery"
import { initNavbar, updateNavbarAuth, initButtons, spinnerOn, spinnerOff } from "blr-shared-frontend"
import { navbarConfig } from "../config/navbar-config.js"
import { InitiateAuthCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

const poolData = {
  UserPoolId: SUB_UserPoolId,
  ClientId: SUB_UserPoolClientId
};

const client = new CognitoIdentityProviderClient({
  region: "us-east-1"
});

// Common init of navbar using shared package
export function initCommon() {
  console.log('Frontend event listeners set up complete');
  
  // Initialize navbar with callback to set up button handlers
  initNavbar(navbarConfig, () => {    
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

// Add this new function to handle refresh
async function refreshToken() {
  try {
      const command = new InitiateAuthCommand({
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          ClientId: poolData.ClientId,
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

export function isAuthenticated() {
  const accessToken = localStorage.getItem('blr-accessToken');
  return !!accessToken;
}

// Re-export utility functions from shared package
export { initButtons, spinnerOn, spinnerOff } from "blr-shared-frontend";