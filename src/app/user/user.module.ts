import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { PasswordResetPageComponent } from './password-reset-page/password-reset-page.component';


@NgModule({
  declarations: [
    LoginPageComponent,
    SignUpPageComponent,
    PasswordResetPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
