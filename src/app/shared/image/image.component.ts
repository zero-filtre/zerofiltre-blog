import { Component, Input, OnInit } from '@angular/core';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { getUrlHost, getUrlLastElement } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  @Input() classes!: string;
  @Input() sourceUrl!: string;
  @Input() alt!: string;

  imageKitAccountId = 'lfegvix1p'

  defaultImage = 'Article_default_oz_Yb-VZj.svg'
  srcsetValue!: string;

  browserRunning!: boolean;
  serverRunning!: boolean;

  constructor(
    private loadEnvService: LoadEnvService
  ) { }

  public imageKitSource(): string {
    const imageName = getUrlLastElement(this.sourceUrl);
    const imageHost = getUrlHost(this.sourceUrl);

    const imageKitBaseUrl = `https://ik.imagekit.io/${this.imageKitAccountId}/tr:w-800,ar-auto,dpr-auto,di-${this.defaultImage}/`
    const ovhHost = 'storage.gra.cloud.ovh.net';
    let src;

    if (this.sourceUrl) {
      if (imageName !== null && imageHost === ovhHost) {
        src = imageKitBaseUrl + imageName

        this.srcsetValue = `https://ik.imagekit.io/${this.imageKitAccountId}/tr:w-400,ar-auto,dpr-auto,di-${this.defaultImage}/${imageName} 400w,
        https://ik.imagekit.io/${this.imageKitAccountId}/tr:w-400,ar-auto,dpr-auto,di-${this.defaultImage}/${imageName} 800w,
        https://ik.imagekit.io/${this.imageKitAccountId}/tr:w-600,ar-auto,dpr-auto,di-${this.defaultImage}/${imageName} 1200w,
        https://ik.imagekit.io/${this.imageKitAccountId}/tr:w-800,ar-auto,dpr-auto,di-${this.defaultImage}/${imageName} 1300w,
        https://ik.imagekit.io/${this.imageKitAccountId}/tr:w-1200,ar-auto,dpr-auto,di-${this.defaultImage}/${imageName} 1400w`;
      } else {
        src = this.sourceUrl
      }
    } else {
      src = imageKitBaseUrl + 'not_found_image.jpg';

      this.srcsetValue = `https://ik.imagekit.io/${this.imageKitAccountId}/tr:w-400,ar-auto,dpr-auto,di-${this.defaultImage}/not_found_image.jpg 400w,
      https://ik.imagekit.io/${this.imageKitAccountId}/tr:w-400,ar-auto,dpr-auto,di-${this.defaultImage}/not_found_image.jpg 800w,
      https://ik.imagekit.io/${this.imageKitAccountId}/tr:w-600,ar-auto,dpr-auto,di-${this.defaultImage}/not_found_image.jpg 1200w,
      https://ik.imagekit.io/${this.imageKitAccountId}/tr:w-800,ar-auto,dpr-auto,di-${this.defaultImage}/not_found_image.jpg 1300w`;
    }

    return src
  }

  ngOnInit(): void {
  }

}
