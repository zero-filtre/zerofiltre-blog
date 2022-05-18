import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../user/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() appLogoUrl!: string;
  @Input() servicesUrl!: string;
  @Input() coursesUrl!: string;
  @Input() contactUrl!: string;
  @Input() drawer: any;
  @Input() showRouteLoader!: boolean;

  @Output() logoutEvent = new EventEmitter<string>();


  constructor(
    public authService: AuthService,
  ) { 

  }

  ngOnInit(): void {
  }

  public logout() {

    this.logoutEvent.next('');

  }


}
