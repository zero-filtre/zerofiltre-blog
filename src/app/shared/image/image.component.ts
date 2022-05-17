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

  constructor() { }

  public imageKitSource(): string {
    const imageName = getUrlLastElement(this.sourceUrl);
    const imageKitUrl = `https://ik.imagekit.io/lfegvix1p/tr:di-${this.defaultImage}/`
    return imageKitUrl + imageName
  }

  ngOnInit(): void {
  }

}
