import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import { UserService } from 'src/app/service/user.service';
import {NotificationService} from "../../service/notification.service";
import {NotificationType} from "../../enum/notification-type.enum";
import {BehaviorSubject, Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {TankService} from "../../service/tank.service";
import {Tank} from "../../model/tank";
import {Role} from "../../enum/role.enum";
import {NgForm} from "@angular/forms";
import {CustomHttpResponse} from "../../model/custom-http-response";

@Component({
  selector: 'app-tank',
  templateUrl: './tank.component.html',
  styleUrls: ['./tank.component.css']
})
export class TankComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private titleSubject = new BehaviorSubject<string>('Tanks');
  public titleAction$ = this.titleSubject.asObservable();
  public users: User[];
  public refreshing: boolean;
  public selectedTank: Tank;
  public profileImage: File;
  public editTank: Tank;
  public user: User;
  public tanks: Tank[];

  constructor(private router: Router, private authenticationService: AuthenticationService, private userService: UserService, private notifier: NotificationService, private tankService: TankService) {
  }

  ngOnInit(): void {
    this.user=this.authenticationService.getUserFromLocalCache();
    this.getUserTanks(true)
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public onSelectTank(selectedTank: Tank): void {
    this.selectedTank = selectedTank;
    this.clickButton('openTankInfo');
  }

  public saveNewTank(): void {
    this.clickButton('new-tank-save');
  }

  public onAddNewTank(tankForm: NgForm): void {
    this.subscriptions.push(
      this.tankService.saveTank(tankForm.value).subscribe(
        (response: Tank) => {
          this.clickButton('new-tank-close');
          this.getUserTanks(false);
          tankForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `${response.model} added successfully.`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.message);
          this.profileImage = null;
        }
      )
    );
  }

  public onEditTank(editTank: Tank): void {
    this.editTank = editTank;
    this.clickButton('openTankEdit');
  }

  public onUpdateTank(tank: Tank): void {
    this.tankService.updateTank(tank).subscribe(
      (response: Tank) => {
        this.getUserTanks(true);
        this.notifier.notify(NotificationType.SUCCESS, `Updated tank ${response.producer} ${response.model}`)
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.message);
        alert(errorResponse.message);
      }
    );
  }

  public onDeleteTank(id: number): void {
    this.subscriptions.push(
      this.tankService.deleteTank(id).subscribe(
        (response: CustomHttpResponse) => {
          this.notifier.notify(NotificationType.SUCCESS, 'Tank deleted')
          this.getUserTanks(false);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.message);
          this.profileImage = null;
        }
      )
    );
  }

  public searchTanks(key: string): void {
    const results: Tank[] = [];
    for (const tank of this.tanks) {
      if (tank.model.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || tank.producer.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || tank.sideNumber.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(tank);
      }
    }
    this.tanks = results;
    if (results.length === 0 || !key) {
      this.getUserTanks(true);
    }
  }

  public isLoggedIn() {
    return this.authenticationService.isUserLoggedIn();
  }

  public get isPresident(): boolean {
    return this.getUserRole() === Role.PRESIDENT || this.getUserRole() === Role.SUPER_PRESIDENT;
  }

  public get isSuperPresident(): boolean {
    return this.getUserRole() === Role.SUPER_PRESIDENT;
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }

  getUserTanks(showNotification: boolean): void {
    this.userService.getUserTanks(this.authenticationService.getUserFromLocalCache().id).subscribe(
      (response: Tank[]) => {
        this.tanks = response;
        this.sendNotification(NotificationType.SUCCESS, `${response.length} tank(s) loaded successfully.`);
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.message);
        alert(errorResponse.message);
      });
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  private sendNotification(notificationType: NotificationType, message: string) {
    if (message) {
      this.notifier.notify(notificationType, message);
    } else {
      this.notifier.notify(notificationType, 'An error occurred, please try again.');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
