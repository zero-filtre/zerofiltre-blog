import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Article } from 'src/app/articles/article.model';
import { Course } from 'src/app/school/courses/course';
import { Lesson } from 'src/app/school/lessons/lesson';
import { SearchService } from 'src/app/services/search.service'

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.css'],
})
export class SearchPopupComponent {
  query: string = '';
  results: (Article | Course | Lesson)[] = []; 
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

  isArticle(result: any): result is Article {
    return (result as Article).premium !== undefined 
  }
  
  isCourse(result: any): result is Course {
    return (result as Course).lessonsCount !== undefined
  }

  isLesson(result: any): result is Lesson {
    return (result as Lesson).resources !== undefined
  }

  onChanges(element: Observable<string>): void {
    element
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query: string) => {
          if (query.length > 0) {
            return this.searchService.search(query);
          } else {
            return new Observable((observer) => observer.next({ results: [] }));
          }
        })
      )
      .subscribe((data: any) => {
        this.results = data.results;
      });
  }

  ngOnInit() {
    this.onChanges(this.SearchText$);
  }
}
