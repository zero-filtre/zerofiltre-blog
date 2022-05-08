import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  title = 'Zerofiltre'

  public transformations = [{
    width: 1200,
    aspectRatio: "5-3"
  }]

  constructor() { }

  ngOnInit(): void {
  }

}
