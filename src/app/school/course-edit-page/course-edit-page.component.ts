import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-edit-page',
  templateUrl: './course-edit-page.component.html',
  styleUrls: ['./course-edit-page.component.css']
})
export class CourseEditPageComponent implements OnInit {

  public activeTab: string = 'editor';

  course = new FormGroup({
    title: new FormControl(''),
    videoId: new FormControl('355926790'),
    content: new FormControl('')
  });

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public setActiveTab(tabName: string): void {
    if (tabName === 'editor') this.activeTab = 'editor'
    if (tabName === 'preview') this.activeTab = 'preview'
    if (tabName === 'help') this.activeTab = 'help'
  }

  public handleCreateCourse() {
    this.router.navigate(["/cours/5"])
  }


}
