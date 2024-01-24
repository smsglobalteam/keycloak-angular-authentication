import { Component } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router) {}

  // Desc: This function redirects the user to the Keycloak login page.
  redirectToKeycloakLogin(): void {
    console.log('toggled');

    const keycloakBaseUrl = 'http://devcloak.passcess.net/realms/master';
    const clientId = 'keycloak-angular-example';
    const redirectUri = 'http://localhost:4200/callback';

    const authUrl = `${keycloakBaseUrl}/protocol/openid-connect/auth`;

    const queryParams = new HttpParams()
      .set('client_id', clientId)
      .set('redirect_uri', redirectUri)
      .set('response_type', 'code')
      .set('scope', 'openid');

    const redirectUrl = `${authUrl}?${queryParams.toString()}`;

    window.location.href = redirectUrl;
  }

  // Desc: This function redirects the user to the Keycloak logout page which thens redirects the user to the login page of the application.
  logoutFromKeycloak(): void {
    const keycloakBaseUrl = 'http://devcloak.passcess.net/realms/master';
    const clientId = 'keycloak-angular-example';
    const redirectUri = 'http://localhost:4200/callback';

    const logoutUrl = `${keycloakBaseUrl}/protocol/openid-connect/logout`;

    this.deleteCookie('accessToken');

    const queryParams = new HttpParams()
      .set('client_id', clientId)

    const redirectUrl = `${logoutUrl}?${queryParams.toString()}`;

    window.location.href = redirectUrl;
  }

  // Desc: This function deletes the accessToken cookie and redirects the user to the login page of the application.
  loginRedirect(): void {
    this.deleteCookie('accessToken');
    this.router.navigate(['/login']);
  }

  // Desc: This function checks if the user is logged in to Keycloak by verifying the accessToken cookie.
  checkUserAccess() {
    if (this.getCookie('accessToken')) {
      const keycloakBaseUrl = 'http://devcloak.passcess.net/realms/master';
      const userInfoURL = `${keycloakBaseUrl}/protocol/openid-connect/userinfo`;

      const options = {
        headers: {
          Authorization: 'Bearer ' + this.getCookie('accessToken'),
        },
      };

      this.http.post(userInfoURL, null, options).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (error: any) => {
          console.error('Error', error);
          this.loginRedirect();
        },
      });
    } else {
      this.loginRedirect();
    }
  }

  // Desc: This functions grabs a cookie by name.
  getCookie(cookieName: any) {
    let name = cookieName + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  // Desc: This functions deletes a cookie by name.
  deleteCookie(cookieName: any) {
    document.cookie =
      cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}
