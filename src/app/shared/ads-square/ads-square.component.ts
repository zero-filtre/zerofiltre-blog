import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ads-square',
  templateUrl: './ads-square.component.html',
  styleUrls: ['./ads-square.component.css']
})
export class AdsSquareComponent {
  @Input() url: string;
  @Input() imageUrl: string;
  @Input() text: string;

  ads = [
    {
      url: '/cours/1',
      image: 'https://ik.imagekit.io/lfegvix1p/ddd-imagee_7A342RNOT.svg?updatedAt=1681558221642',
      text: 'Apprenez et implémentez des modèles de conception simples pour satisfaire des besoins complexes'
    },
    {
      url: '/cours/3',
      image: 'https://ik.imagekit.io/lfegvix1p/ddd-imagee_7A342RNOT.svg?updatedAt=1681558221642',
      text: "Restez compétitifs sur le marché du logiciel en devenant des devs qui 'RUN' ce qu'ils 'BUILD'"
    }
  ]

  currentAd = this.ads[Math.floor(Math.random()*this.ads.length)];
}
