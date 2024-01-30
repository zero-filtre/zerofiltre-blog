import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { MessageService } from 'src/app/services/message.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from 'src/app/user/auth.service';
import { User } from 'src/app/user/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  readonly servicesUrl = environment.servicesUrl;
  readonly coursesUrl = environment.coursesUrl;
  readonly blogUrl = environment.blogUrl;
  readonly activeCourseModule = environment.courseRoutesActive === 'true';

  appLogoUrl = 'https://ik.imagekit.io/lfegvix1p/logoblue_6whym-RBD.svg'

  prod = this.blogUrl.startsWith('https://dev.') ? false : true;

  @Input() changingRoute!: boolean;
  @Input() drawer!: any;

  constructor(
    private loadEnvService: LoadEnvService,
    public authService: AuthService,
    private router: Router,
    public seo: SeoService,
    private messageService: MessageService,
    private paymentService: PaymentService
  ) { }

  public logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  subscribeToPro() {
    // const currUser = this.authService.currentUsr as User;
    // const loggedIn = !!currUser;

    // if (!loggedIn) {
    //   this.router.navigate(
    //     ['/login'],
    //     {
    //       queryParams: { redirectURL: this.router.url },
    //       queryParamsHandling: 'merge',
    //     });

    //   this.messageService.openSnackBarInfo('Veuillez vous connecter pour prendre votre abonnement PRO 🤗', 'OK');

    //   return;
    // }

    const payload = { productId: 1, productType: 'COURSE' }
    const type = 'pro'

    this.paymentService.openPaymentDialog(payload, type);

  }

  ngOnInit(): void {
    // do nothing.
  }

}
