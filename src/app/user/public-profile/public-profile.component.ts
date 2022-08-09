import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { SeoService } from 'src/app/services/seo.service';
import { map, Observable, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadEnvService } from 'src/app/services/load-env.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  public userID!: string;
  public loading!: boolean;

  public user$!: Observable<User>;

  constructor(
    private loadEnvService: LoadEnvService,
    private seo: SeoService,
    public authService: AuthService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit(): void {
    // this.route.paramMap.subscribe(
    //   params => {
    //     this.userID = params.get('userID')!;
    //     this.getUserProfile(this.userID);
    //   }
    // );

    this.user$ = this.route.data
      .pipe(
        // tap(data => {
        //   if (data.user?.fullName == this.authService.currentUsr?.fullName) this.router.navigateByUrl('/user/profile')
        // }),
        map(data => data.user)
      )

    this.seo.generateTags({
      title: this.translate.instant('meta.profileTitle'),
      description: this.translate.instant('meta.profileDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

}
