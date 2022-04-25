import { Component, OnInit } from '@angular/core';
import { getCurrentYear } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public currentYear!: number;

  constructor() { }

  loadCurrentYear() {
    this.currentYear = getCurrentYear();
  }

  ngOnInit(): void {
    this.loadCurrentYear()
  }

}
