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
  defaultImage = 'blog-default-image_kttj78fSc.jpg'
  srcsetValue !: string;

  constructor() { }

  public imageKitSource(): string {
    const imageName = getUrlLastElement(this.sourceUrl);
    const imageKitBaseUrl = `https://ik.imagekit.io/lfegvix1p/tr:w-400,ar-auto,dpr-auto,di-${this.defaultImage}/`
    let scr;

    if (imageName) {
      scr = imageKitBaseUrl + imageName

      this.srcsetValue = `
      https://ik.imagekit.io/lfegvix1p/tr:w-400,ar-auto,dpr-auto,di-${this.defaultImage}/${imageName} 400w,
      https://ik.imagekit.io/lfegvix1p/tr:w-400,ar-auto,dpr-auto,di-${this.defaultImage}/${imageName} 800w,
      https://ik.imagekit.io/lfegvix1p/tr:w-600,ar-auto,dpr-auto,di-${this.defaultImage}/${imageName} 1200w,
      https://ik.imagekit.io/lfegvix1p/tr:w-800,ar-auto,dpr-auto,di-${this.defaultImage}/${imageName} 1300w,
      https://ik.imagekit.io/lfegvix1p/tr:w-1200,ar-auto,dpr-auto,di-${this.defaultImage}/${imageName} 1400w
      `;
    } else {
      scr = '';
    }

    return scr
  }

  ngOnInit(): void {
  }

}
