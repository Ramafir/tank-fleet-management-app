import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {CustomHttpResponse} from "../model/custom-http-response";
import {Tank} from "../model/tank";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host: string = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getUsers():Observable<User[]>{
    return this.http.get<User[]>(`${this.host}/users`);
  }

  public addUser(formData:FormData):Observable<User>{
    return this.http.post<User>(`${this.host}/users`,formData);
  }

  public updateUser(formData:FormData):Observable<User>{
    return this.http.post<User>(`${this.host}/users/update`,formData);
  }

  public resetPassword(email:string):Observable<CustomHttpResponse>{
    return this.http.get<CustomHttpResponse>(`${this.host}/users/resetPassword/${email}`);
  }

  public deleteUser(id: number):Observable<CustomHttpResponse>{
    return this.http.delete<CustomHttpResponse>(`${this.host}/users/${id}`);
  }

  public addUsersToLocalCache(users:User[]):void{
    localStorage.setItem('users',JSON.stringify(users));
  }

  public getUsersFromLocalCache():User[]{
    if(localStorage.getItem('users')){
      return JSON.parse(localStorage.getItem('users'))
    }else{
      return null ;
    }
  }

  public getUserTanks(userId: number): Observable<Tank[]> {
    return this.http.get<Tank[]>(`${this.host}/users/${userId}/tanks`)
  }

  public createUserFormData(loggedInUsername: string, user: User):FormData{
    const formData= new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('fullName', user.fullName);
    formData.append('country', user.country);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('password', user.password)
    formData.append('role', user.role)
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked',JSON.stringify(user.notLocked));
    formData.append('hasAtomicButton', JSON.stringify(user.hasAtomicButton))
    return formData;
  }
}
