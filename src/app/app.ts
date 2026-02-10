import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('WebProjectY3S1FrontEnd');

  private oidc = inject(OidcSecurityService);

  isAuthenticated$ = this.oidc.isAuthenticated$.pipe(map((r) => !!r?.isAuthenticated));
  userData$ = this.oidc.userData$;

  constructor() {
    this.oidc.checkAuth().subscribe();
  }

  login() {
    const redirect = 'http://localhost:4200/auth/callback';
    const clientId = 'kpb76hp7r9afkr0gupoj1k7gn';
    const scope = 'email openid profile';

    window.location.href =
      'https://eu-west-1lhleemolf.auth.eu-west-1.amazoncognito.com/login' +
      `?client_id=${clientId}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&redirect_uri=${encodeURIComponent(redirect)}`;
  }

  logout() {
    this.oidc.logoff().subscribe();
  }
}
