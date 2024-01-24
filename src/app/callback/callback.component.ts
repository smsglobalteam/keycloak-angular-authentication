import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map from rxjs/operators
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
})
export class CallbackComponent {
  private accessToken: string | null = null;
  testDisplay: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private LoginComponent: LoginComponent
  ) {}

  ngOnInit() {
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      this.handleKeycloakCallback(code).subscribe({
        next: () => {
          console.log('Access Token:', this.accessToken);
        },
        error: (error) => {
          console.error('Error handling Keycloak callback:', error);
        },
      });
    } else {
      this.LoginComponent.loginRedirect();
    }
  }

  // Desc: This function handles the callback from Keycloak and stores the values to a cookie, it will then redirect the user to the home page of the application.
  private handleKeycloakCallback(code: string): Observable<any> {
    const keycloakBaseUrl = 'http://devcloak.passcess.net/realms/master';
    const clientId = 'keycloak-angular-example';
    const clientSecret = 'your-client-secret';
    const redirectUri = 'http://localhost:4200/callback';

    const tokenUrl = `${keycloakBaseUrl}/protocol/openid-connect/token`;

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', clientId)
      .set('client_secret', clientSecret)
      .set('redirect_uri', redirectUri)
      .set('code', code);

    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    return this.http.post(tokenUrl, body.toString(), options).pipe(
      map((response: any) => {
        this.accessToken = response.access_token;
        this.testDisplay = response.access_token;
        document.cookie = `accessToken=${this.accessToken};`;
        this.router.navigate(['/home']);
        return response;
      })
    );
  }
}
