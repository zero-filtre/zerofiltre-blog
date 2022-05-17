import { Component, Input, OnInit } from '@angular/core';
import { getUrlLastElement } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  @Input() classes!: string;
  @Input() sourceUrl!: string;
  @Input() alt!: string;

  constructor() { }

  public imageKitSource(): string {
    const imageName = getUrlLastElement(this.sourceUrl);
    const imageKitUrl = 'https://ik.imagekit.io/lfegvix1p/'
    return imageKitUrl + imageName
  }

  ngOnInit(): void {
  }

}
