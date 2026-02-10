import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  standalone: true,
  template: `<p>Signing you in...</p>`,
})
export class AuthCallbackComponent implements OnInit {
  private oidc = inject(OidcSecurityService);
  private router = inject(Router);

  ngOnInit(): void {
    this.oidc.checkAuth().subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => this.router.navigateByUrl('/'),
    });
  }
}
