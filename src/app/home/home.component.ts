import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private LoginComponent: LoginComponent, private http: HttpClient) {}
  testDisplay: any = null;

  ngOnInit() {
    this.LoginComponent.checkUserAccess();
  }

  logout() {
    this.LoginComponent.logoutFromKeycloak();
  }

  // Desc: Grab user info from Keycloak, to test validity of token.
  grabUserInfo() {
    const keycloakBaseUrl = 'http://devcloak.passcess.net/realms/master';
    const userInfoURL = `${keycloakBaseUrl}/protocol/openid-connect/userinfo`;

    const options = {
      headers: {
        Authorization: 'Bearer ' + this.LoginComponent.getCookie('accessToken'),
      },
    };

    this.http.post(userInfoURL, null, options).subscribe({
      next: (response: any) => {
        console.log(response);
        this.testDisplay = JSON.stringify(response);
      },
      error: (error: any) => {
        console.error('Error', error);
        this.testDisplay = error;
      },
    });
  }
}
