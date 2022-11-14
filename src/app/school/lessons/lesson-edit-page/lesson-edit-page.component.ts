import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lesson-edit-page',
  templateUrl: './lesson-edit-page.component.html',
  styleUrls: ['./lesson-edit-page.component.css']
})
export class LessonEditPageComponent implements OnInit {

  public activeTab: string = 'editor';


  course = new FormGroup({
    title: new FormControl(''),
    videoId: new FormControl('355926790'),
    content: new FormControl('')
  });

  constructor(
    private router: Router
  ) { }

  public setActiveTab(tabName: string): void {
    if (tabName === 'editor') this.activeTab = 'editor'
    if (tabName === 'preview') this.activeTab = 'preview'
    if (tabName === 'help') this.activeTab = 'help'
  }

  public handleSaveLecon() {
    this.router.navigate(["/cours/5"])
  }

  ngOnInit(): void {
  }
}
