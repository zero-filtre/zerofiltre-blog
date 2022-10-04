import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-curriculum-sidebar',
  templateUrl: './curriculum-sidebar.component.html',
  styleUrls: ['./curriculum-sidebar.component.css']
})
export class CurriculumSidebarComponent implements OnInit {

  constructor() { }

  course: any = {
    name: 'Exemple de titre du cours, Apprenez le DDD',
    chapters: [
      {
        title: 'Titre du chapitre 1',
        lessons: [
          {
            type: 'video',
            name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure',
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
      },
      {
        title: 'Titre du chapitre 3',
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
      },
      {
        title: 'Titre du chapitre 4',
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
      },
      {
        title: 'Titre du chapitre 5',
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

  ngOnInit(): void {
  }

}
