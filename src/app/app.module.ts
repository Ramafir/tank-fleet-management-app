import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UserComponent } from './component/user/user.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import {RouterModule, Routes} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NotificationModule} from "./notification.module";
import {AuthenticationGuard} from "./guard/authentication.guard";
import {NotificationService} from "./service/notification.service";
import {TankComponent} from "./component/tank/tank.component";
import {TankService} from "./service/tank.service";
import {UserService} from "./service/user.service";
import {AuthenticationService} from "./service/authentication.service";
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {HeaderComponent} from "./component/header/header.component";
import {DestroyComponent} from "./component/destroy/destroy.component";

const routes: Routes = [
  {path:'',redirectTo:'/login',pathMatch:'full'},
  {path: 'tanks', component: TankComponent, canActivate:[AuthenticationGuard]},
  {path: 'users', component: UserComponent, canActivate:[AuthenticationGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'users/:id', component: UserComponent},
  {path: 'destroy', component: DestroyComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent,
    TankComponent,
    HeaderComponent,
    DestroyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    NotificationModule
  ],
  providers: [AuthenticationGuard, NotificationService, TankService, UserService, AuthenticationService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
