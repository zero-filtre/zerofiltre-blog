import { Component, Input, OnInit } from '@angular/core';
import { urlLastElement } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  @Input() classes!: string;
  @Input() sourceUrl!: string;

  constructor() { }

  public imageKitSource(): string {
    const imageName = urlLastElement(this.sourceUrl);
    const imageKitUrl = 'https://ik.imagekit.io/lfegvix1p/'
    return imageKitUrl + imageName
  }

  ngOnInit(): void {
  }

}
