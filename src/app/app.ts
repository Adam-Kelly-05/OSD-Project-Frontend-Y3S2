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
    this.oidc.authorize();
  }

  logout() {
    this.oidc.logoff().subscribe();
  }
}
