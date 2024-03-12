import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Article } from 'src/app/articles/article.model';
import { Course } from 'src/app/school/courses/course';

@Pipe({
  name: 'slugify'
})
export class SlugUrlPipe implements PipeTransform {

  transform(object: Article | Course, ...args: any[]): any {

    const slug = object.id + '-' + object.title
    return slug.toLowerCase().trim()
      .replace(/[^\w\-]+/g, ' ')
      .replace(/\s+/g, '-')

  }

}
