import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { UserService } from './users/user.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ListingSearchState } from './shared/listing-search.service';
import { CurrencyState, CurrencyCode } from './shared/currency.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AsyncPipe, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('WebProjectY3S1FrontEnd');

  private oidc = inject(OidcSecurityService);
  private userService = inject(UserService);
  private router = inject(Router);
  protected listingSearch = inject(ListingSearchState);
  protected currencyState = inject(CurrencyState);

  isAuthenticated$ = this.oidc.isAuthenticated$.pipe(map((r) => !!r?.isAuthenticated));
  userData$ = this.oidc.userData$;

  constructor() {
    this.oidc
      .checkAuth()
      .pipe(
        switchMap((authResult) => {
          if (!authResult?.isAuthenticated) {
            return of(null);
          }

          return this.oidc.userData$.pipe(
            take(1),
            switchMap((userDataResult) => {
              const userSub = this.extractUserSub(userDataResult);
              if (!userSub) {
                return of(null);
              }

              return this.userService.getUsers().pipe(
                map((users) => {
                  const existingUser = users.find((u) => u._id === userSub);
                  if (existingUser) {
                    return null;
                  }

                  const claims = this.extractClaims(userDataResult);
                  return {
                    _id: userSub,
                    email: claims.email,
                    name:
                      claims.name ||
                      [claims.givenName, claims.familyName].filter(Boolean).join(' ') ||
                      claims.username,
                  };
                }),
                catchError(() => of(null)),
              );
            }),
          );
        }),
      )
      .subscribe((missingUserData) => {
        if (!missingUserData) {
          return;
        }

        this.router.navigate(['/user-form'], {
          queryParams: {
            _id: missingUserData._id,
            email: missingUserData.email ?? '',
            name: missingUserData.name ?? '',
          },
        });
      });
  }

  login() {
    this.oidc.authorize();
  }

  logout() {
    this.oidc.logoff().subscribe();
  }

  updateCurrency(value: string): void {
    if (value === 'EUR' || value === 'USD' || value === 'GBP') {
      this.currencyState.currency.set(value as CurrencyCode);
    }
  }

  private extractUserSub(result: unknown): string | undefined {
    if (!result || typeof result !== 'object') {
      return undefined;
    }

    const userDataResult = result as { userData?: { sub?: string }; sub?: string };
    return userDataResult.userData?.sub ?? userDataResult.sub;
  }

  private extractClaims(result: unknown): {
    email?: string;
    name?: string;
    givenName?: string;
    familyName?: string;
    username?: string;
  } {
    if (!result || typeof result !== 'object') {
      return {};
    }

    const userDataResult = result as {
      userData?: {
        email?: string;
        name?: string;
        given_name?: string;
        family_name?: string;
        preferred_username?: string;
        username?: string;
        'cognito:username'?: string;
      };
      email?: string;
      name?: string;
      given_name?: string;
      family_name?: string;
      preferred_username?: string;
      username?: string;
      'cognito:username'?: string;
    };

    const source = userDataResult.userData ?? userDataResult;
    return {
      email: source.email,
      name: source.name,
      givenName: source.given_name,
      familyName: source.family_name,
      username: source.preferred_username ?? source.username ?? source['cognito:username'],
    };
  }
}
