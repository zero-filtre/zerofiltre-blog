import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../../user/user.model';
import { Company } from './company.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  readonly apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  isAdminUser(user: User) {
    if (!user) return false;
    return user.roles?.includes('ROLE_ADMIN');
  }

  isProUser(user: User) {
    if (!user) return false;
    return user.pro;
  }

  canCreateCompany(user: User) {
    if (!user) return false;
    return this.isAdminUser(user) || true;
  }

  getCompanies(pageNumber: any, limit: any): Observable<any[]> {
    return this.http
      .get<any>(
        `${this.apiServerUrl}/company/all?pageNumber=${pageNumber}&pageSize=${limit}`
      )
      .pipe(shareReplay());
  }

  createCompany(data: any): Observable<Company> {
    return this.http
      .post<any>(`${this.apiServerUrl}/company`, data, httpOptions)
      .pipe(shareReplay());
  }

  deleteCompany(data: any): Observable<any> {
    return this.http
      .delete<any>(`${this.apiServerUrl}/company`, {
        ...httpOptions,
        body: data,
        responseType: 'text' as 'json'
      })
      .pipe(shareReplay());
  }

  linkCourseToCompany(data: any): Observable<any> {
    const { companyId, courseId } = data
    return this.http
      .post<any>(`${this.apiServerUrl}/company/${companyId}/course/${courseId}`, data, httpOptions)
      .pipe(shareReplay());
  }

  search(query: string, companies: Company[]): Observable<Company[]> {
    const filteredCompanies = companies.filter(
      (company: Company) => company.companyName.toLowerCase().includes(query.toLowerCase()))

    return of(filteredCompanies);
  }

  findAllCoursesBycompanyId(companyId: string, pageNumber: number, limit: number): Observable<any[]> {
    return this.http
      .get<any>(`${this.apiServerUrl}/company/${companyId}/course?pageNumber=${pageNumber}&pageSize=${limit}`, httpOptions)
      .pipe(shareReplay());
  }
  
}
