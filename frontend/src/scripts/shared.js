import "../styles/custom.css"
import $ from "jquery"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import { InitiateAuthCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

const poolData = {
  UserPoolId: SUB_UserPoolId,
  ClientId: SUB_UserPoolClientId
};

const client = new CognitoIdentityProviderClient({
  region: "us-east-1"
});

// Common init of navbar
export function initCommon() {
  $(function() {
    $.get("assets/nav.html", navbar => {
      $("#nav-placeholder").replaceWith(navbar);
      
      // Determine whether to show signin button or user menu
      if (isAuthenticated()) {
        $("#signin-button").hide();
        $("#user-menu").show();
        const userFirstName = localStorage.getItem('blr-userFirstName');
        const userLastName = localStorage.getItem('blr-userLastName');
        const isAdmin = localStorage.getItem('blr-isAdmin') === 'true';
        $("#user-menu").text(`${userFirstName} ${userLastName[0]}`);

        if (isAdmin) {
          $("#admin-button").show();
        } else {
          $("#admin-button").hide();
        }
      }

      else {
        $("#signin-button").show();
        $("#user-menu").hide();
      }
      
      $("#signout-button").on("click", signOut);

      $("#signin-button").on("click", async () => {
        window.location.href = '/login.html';
      });

      $("#admin-button").on("click", () => {
        window.location.href = '/admin.html';
      });
    });
  });
}

export function initButtons(buttonIdList) {
  for (const buttonId of buttonIdList) {
    const button = $(`#${buttonId}`);
    const buttonText = button.text();
    button.empty();
    button.append($('<span>').text(buttonText));
    button.append($('<div class="spinner-border spinner-border-sm" style="display: none;"></div>'));

    // Store original dimensions
    
    const width = button.outerWidth();
    // const height = button.outerHeight();
    
    // Set fixed dimensions to prevent resizing during loading state
    button.css({
      width: width + 'px',
      // height: height + 'px'
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

  $("#signin-button").show();
  $("#user-menu").hide();
}

export function isAuthenticated() {
  const accessToken = localStorage.getItem('blr-accessToken');
  return !!accessToken;
}