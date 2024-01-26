import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mentored-icon',
  templateUrl: './mentored-icon.component.html',
  styleUrls: ['./mentored-icon.component.css']
})
export class MentoredIconComponent {

  @Input() classes: string;
  @Input() size: number = 0;

  sizeClass = `scale-[${this.size}]`

}
