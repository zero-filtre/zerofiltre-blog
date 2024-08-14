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

  defaultColor = '  group-'

  ads = [
    {
      url: '/cours/1',
      image: 'https://ik.imagekit.io/lfegvix1p/ddd-imagee_7A342RNOT.svg?updatedAt=1681558221642',
      text: 'Apprenez et implémentez des modèles de conception simples pour satisfaire des besoins complexes',
      color: this.defaultColor
    },
    {
      url: '/cours/3',
      image: 'https://ik.imagekit.io/lfegvix1p/annonce_build_and_run_elevez_le_dev_au_dela_du_build_k8fX8AYfF.png?updatedAt=1708359934013',
      text: "Restez compétitifs sur le marché du logiciel en devenant des devs qui 'RUN' ce qu'ils 'BUILD'",
      color: '  group-hover:'
    }
  ]

  currentAd = this.ads[Math.floor(Math.random()*this.ads.length)];
}
