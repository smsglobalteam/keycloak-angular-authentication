# KeycloakAngularLogin

The aim of this demo is to showcase how to integrate Keycloak authentication with Angular.

## Keycloak Setup

- Client link: http://devcloak.passcess.net/admin/master/console/#/master/clients
- Client ID: keycloak-angular-example

The most important aspect of integration are the Access settings URL of a Client which was set to the following values:

- Root URL: http://localhost:4200/
- Home URL: http://localhost:4200/
- Valid redirect URIs: http://localhost:4200/callback
- Valid post logout redirect URIs: http://localhost:4200/login
- Web origins: http://localhost:4200/login
- Admin URL: http://localhost:4200

## How to run

1. 'npm install'
2. 'ng serve'

## Important Notes

Since this is only a demo the functions are written in the login component instead of a service. Furthermore the URL and parameters are written directly into the function instead of an environment file.