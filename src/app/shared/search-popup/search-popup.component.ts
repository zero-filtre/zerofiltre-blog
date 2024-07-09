import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { SearchResultArticle, SearchResultCourse, SearchResultLesson, SearchResultsData } from 'src/app/school/courses/course';
import { SearchService } from 'src/app/services/search.service'

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.css'],
})
export class SearchPopupComponent {
  query: string = '';
  results: (SearchResultCourse | SearchResultArticle | SearchResultLesson)[] = []; 
  private SearchText$ = new Subject<string>();

  constructor(
    private searchService: SearchService
  ){}

  onSearchChange(content: string) {
    this.SearchText$.next(content);
  }

  getValue(event: Event): string {
    event.preventDefault();
    return (event.target as HTMLTextAreaElement).value;
  }

  isArticle(result: SearchResultCourse | SearchResultArticle | SearchResultLesson): result is SearchResultArticle {
    return (result as SearchResultArticle).type == 'article' 
  }
  
  isCourse(result: SearchResultCourse | SearchResultArticle | SearchResultLesson): result is SearchResultCourse {
    return (result as SearchResultCourse).type == 'course'
  }

  isLesson(result: SearchResultCourse | SearchResultArticle | SearchResultLesson): result is SearchResultLesson {
    return (result as SearchResultLesson).type == 'lesson'
  }

  showSearchResultBadgeLabel(element: SearchResultCourse | SearchResultArticle | SearchResultLesson){
    switch (element.type) {
      case 'article':
        return 'Article'
      case 'course':
        return 'Cours'
      case 'lesson':
        return 'Leçon'
      default:
        return null;
    }
  }

  onChanges(element: Observable<string>): void {
    element
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query: string) => {
          if (query.length >= 3) {
            return this.searchService.search(query)
              .pipe(
                catchError((error: HttpErrorResponse) => {
                  return throwError(() => error);
                }),
                tap((data: SearchResultsData) => {
                  this.results = [
                    ...(data.courses || []).map(course => ({ ...course, type: 'course' })),
                    ...(data.lessons || []).map(lesson => ({ ...lesson, type: 'lesson' })),
                    ...(data.articles || []).map(article => ({ ...article, type: 'article' }))
                  ]
                })
              )
          } else {
            this.results = []
            return new Observable((observer) => observer.next({ results: [] }));
          }
        })
      ).subscribe()
  }

  ngOnInit() {
    this.onChanges(this.SearchText$);
  }
}
