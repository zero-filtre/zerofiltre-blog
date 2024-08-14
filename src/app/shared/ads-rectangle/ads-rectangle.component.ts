import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ads-rectangle',
  templateUrl: './ads-rectangle.component.html',
  styleUrls: ['./ads-rectangle.component.css']
})
export class AdsRectangleComponent {
  @Input() url: string;
  @Input() imageUrl: string;
  @Input() text: string;

  @Input() random: any;

  defaultColor = 'border-primary-500 text-primary-500 group-'

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
      color: 'border-accent-400 text-accent-400 group-hover:'
    }
  ]

  currentAd = this.ads[Math.floor(Math.random()*this.ads.length)];
}
