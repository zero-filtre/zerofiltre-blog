import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchService } from 'src/app/services/search.service'

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.css'],
})
export class SearchPopupComponent {
  query: string = '';
  results: any[] = [];
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

  onChanges(element: Observable<string>): void {
    element
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query: string) => {
          if (query.length > 2) {
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
