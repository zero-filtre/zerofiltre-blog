import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipsService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getTipOfTheDay(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/tips`, {
      responseType: 'text' as 'json',
    });
  }
}
