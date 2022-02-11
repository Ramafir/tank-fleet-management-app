import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {NotificationService} from "../../service/notification.service";
import {AuthenticationService} from "../../service/authentication.service";
import {User} from "../../model/user";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {HeaderType} from "../../enum/header-type.enum";
import {NotificationType} from "../../enum/notification-type.enum";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public showLoading: boolean;
  private subscriptions: Subscription[]= [];

  constructor(private router: Router, private authenticationService: AuthenticationService,
              private notificationService: NotificationService) { }


  ngOnInit(): void {
    if(this.authenticationService.isUserLoggedIn()){
      this.router.navigateByUrl('/tanks');
    }else{
      this.router.navigateByUrl('/login');
    }
  }

  public onLogin(user: User):void{
    this.showLoading=true;
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          const token=response.headers.get(HeaderType.JWT_TOKEN);
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToLocalCache(response.body);
          this.router.navigateByUrl('/tanks');
          this.showLoading=false;
        },
        (httpErrorResponse:HttpErrorResponse) =>{
          this.sendErrorNotification(NotificationType.ERROR,httpErrorResponse.error.message);
          this.showLoading=false;
        }
      )
    )
  }

  private sendErrorNotification(notificationType: NotificationType, message: string): void {
    if (message){
      this.notificationService.notify(notificationType,message);
    }else{
      this.notificationService.notify(notificationType,'An error occurred. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
