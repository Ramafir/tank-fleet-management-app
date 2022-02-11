import { Component, OnInit } from '@angular/core';
import {User} from "../../model/user";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {UserService} from "../../service/user.service";
import {NotificationService} from "../../service/notification.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User;

  constructor(private router: Router, private authenticationService: AuthenticationService, private userService: UserService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.user = this.authenticationService.getUserFromLocalCache();
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  public isLoggedIn() {
    return this.authenticationService.isUserLoggedIn();
  }

}
