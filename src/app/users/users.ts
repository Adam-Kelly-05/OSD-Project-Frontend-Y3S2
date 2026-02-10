import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from './user.interface';
import { UserService } from './user.service';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-users',
  imports: [AsyncPipe, RouterLink, FormsModule, MatCard, MatCardTitle, MatCardContent],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private dataService = inject(UserService);
  users$: Observable<User[]> = this.dataService.getUsers();
  searchId = '';
}
