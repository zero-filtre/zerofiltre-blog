import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../../user/user.model';
import { Company } from './company.model';
import { AuthService } from '../../../user/auth.service';
import { Course } from 'src/app/school/courses/course';

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

  companies: Company[] = [];
  users: User[] = [];
  courses: User[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

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

  getCourses(pageNumber: any, limit: any): Observable<any[]> {
    return this.http
      .get<any>(
        `${this.apiServerUrl}/course?pageNumber=${pageNumber}&pageSize=${limit}&status=published`
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
        responseType: 'text' as 'json',
      })
      .pipe(shareReplay());
  }

  linkCourseToCompany(data: any): Observable<any> {
    const { companyId, courseId } = data;
    return this.http
      .post<any>(
        `${this.apiServerUrl}/company/${companyId}/course/${courseId}`,
        data,
        httpOptions
      )
      .pipe(shareReplay());
  }

  linkUserToCompany(data: any): Observable<any> {
    const { companyId, userId, role } = data;
    return this.http
      .post<any>(
        `${this.apiServerUrl}/company/${companyId}/user/${userId}/role/${role}`,
        data,
        httpOptions
      )
      .pipe(shareReplay());
  }

  search(query: string, dataType: string): Observable<any[]> {
    if (dataType == "Course") {
      return this.searchCourses(query)
    } else if (dataType == "User") {
      return this.searchUsers(query);
    } else {
      return this.searchCompanies(query)
    }
  }

  searchUsers(query: string): Observable<any[]> {
    return this.http
      .get<any[]>(
        `${this.apiServerUrl}/search/users?query=${query}`,
        httpOptions
      )
      .pipe(shareReplay());
  }

  searchCompanies(query: string): Observable<any[]> {
    return  this.getCompanies(0, 100).pipe(
      map(({ content }: any) => content.filter((company: Company) => company.companyName.toLowerCase().includes(query)))
    );

    return this.http
      .get<any[]>(
        `${this.apiServerUrl}/search/companies?query=${query}`,
        httpOptions
      )
      .pipe(shareReplay());
  }

  searchCourses(query: string): Observable<any[]> {
    return  this.getCourses(0, 100).pipe(
      map(({ content }: any) => content.filter((course: Course) => course.title.toLowerCase().includes(query)))
    );

    return this.http
      .get<any[]>(
        `${this.apiServerUrl}/search/companies?query=${query}`,
        httpOptions
      )
      .pipe(shareReplay());
  }

  findAllCoursesBycompanyId(
    companyId: string,
    pageNumber: number,
    limit: number,
    status = 'PUBLISHED'
  ): Observable<any[]> {
    return this.http
      .get<any>(
        `${this.apiServerUrl}/company/${companyId}/course?status=${status}&pageNumber=${pageNumber}&pageSize=${limit}`,
        httpOptions
      )
      .pipe(shareReplay());
  }
}
