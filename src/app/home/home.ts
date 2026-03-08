import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Login } from '../components/login/login';

@Component({
  selector: 'app-home',
  imports: [Login, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
