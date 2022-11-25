import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css']
})
export class CurriculumComponent implements OnInit {

  course: any = {
    name: 'Apprenez le DDD',
    chapters: [
      {
        title: 'Titre du chapitre 1',
        lessons: [
          {
            type: 'video',
            name: 'lesson numero 1',
            duration: '3:15',
            free: true
          },
          {
            type: 'video',
            name: 'lesson numero 2',
            duration: '1:15',
            free: false
          },
          {
            type: 'doc',
            name: 'lesson numero 3',
            duration: '0:15',
            free: true
          },
        ]
      },
      {
        title: 'Titre du chapitre 2',
        lessons: [
          {
            type: 'video',
            name: 'lesson numero 1',
            duration: '3:15',
            free: true
          },
          {
            type: 'doc',
            name: 'lesson numero 2',
            duration: '1:15',
            free: false
          },
          {
            type: 'video',
            name: 'lesson numero 3',
            duration: '0:15',
            free: false
          },
        ]
      }
    ]
  }

  constructor() {
    // do nothing.
  }

  ngOnInit(): void {
    // do nothing.
  }

}
