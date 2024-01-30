import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mentored-icon',
  templateUrl: './mentored-icon.component.html',
  styleUrls: ['./mentored-icon.component.css']
})
export class MentoredIconComponent {

  @Input() classes: string;
  @Input() size: string | any;
  @Input() position: string = 'right';

  iconUrl = 'https://ik.imagekit.io/lfegvix1p/mentored-icon_Qi7FSBxGG.svg?updatedAt=1706592853128'

}
