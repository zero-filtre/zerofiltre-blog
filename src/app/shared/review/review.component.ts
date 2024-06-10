import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {
  @Input() userImage!: string;
  @Input() userName!: string;
  @Input() userRole!: string;
  @Input() userComment!: string;
  @Input() userStars!: number;

  starsArray: number[] = Array(5).fill(0);
}
