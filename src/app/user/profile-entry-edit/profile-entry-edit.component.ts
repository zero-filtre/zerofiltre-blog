import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-entry-edit',
  templateUrl: './profile-entry-edit.component.html',
  styleUrls: ['./profile-entry-edit.component.css']
})
export class ProfileEntryEditComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

}
