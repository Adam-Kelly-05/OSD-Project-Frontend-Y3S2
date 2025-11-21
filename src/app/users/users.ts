import { R } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './user.interface';
import { UserService } from './user.service';

@Component({
  selector: 'app-users',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})

export class Users {
  private dataService = inject(UserService);
  users$: Observable<User[]> = this.dataService.getUsers();
}
