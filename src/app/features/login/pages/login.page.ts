import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class LoginPage {}
