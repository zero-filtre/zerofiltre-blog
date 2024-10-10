import { Component, Input } from '@angular/core';
import { Review } from 'src/app/school/courses/course';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {

  @Input() review: Review;

  starsArray: number[] = Array(5).fill(0);

  avatarHommeNoir = 'https://ik.imagekit.io/lfegvix1p/Homme%20Noir_HLhn8q7ee.svg?updatedAt=1719058562747';
  avatarFemmeNoir = 'https://ik.imagekit.io/lfegvix1p/Femme%20noire_s51iOIdmX.svg?updatedAt=1719058562790';
  avatarHommeBlanc = 'https://ik.imagekit.io/lfegvix1p/Homme%20Blanc_oobxMT8KK.svg?updatedAt=1719058562779';
  avatarFemmeBlanche = 'https://ik.imagekit.io/lfegvix1p/Femme%20Blanche_N_xj-DOPJ.svg?updatedAt=1719058562581';

  dafaultAvatars = [this.avatarHommeNoir, this.avatarFemmeNoir, this.avatarHommeBlanc, this.avatarFemmeBlanche]

  ngOnInit() {
    // Do nothing
  }
}
