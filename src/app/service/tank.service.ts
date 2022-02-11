import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpEvent} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {Tank} from "../model/tank";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TankService {

  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
  }

  public getTanks(): Observable<Tank[]> {
    return this.http.get<Tank[]>(`${this.apiUrl}/tanks`)
      .pipe(
        catchError(this.handleError)
      );
  }

  public getTank(tankId: number): Observable<Tank> {
    return this.http.get<Tank>(`${this.apiUrl}/tanks/${tankId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  public saveTank(tank: Tank): Observable<Tank> {
    return this.http.post<Tank>(`${this.apiUrl}/tanks`, tank)
      .pipe(
        catchError(this.handleError)
      );
  }

  public updateTank(tank: Tank): Observable<Tank> {
    return this.http.put<Tank>(`${this.apiUrl}/tanks/${tank.id}`, tank)
      .pipe(
        catchError(this.handleError)
      );
  }


  public deleteTank(tankId: number): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.apiUrl}/tanks/${tankId}`)
      .pipe(
        catchError(this.handleError)
      );

  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occurred - Error code: ${error.status}`);
  }

}
