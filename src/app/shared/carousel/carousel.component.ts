import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  @Input() userReviews: any[];

  reviews = [
    {
      comment: 'This is a fantastic product!',
      avatar: 'https://via.placeholder.com/150',
      name: 'John Doe',
      role: 'CEO, Company',
      stars: 5
    },
    {
      comment: 'I love the service!',
      avatar: 'https://via.placeholder.com/150',
      name: 'Jane Smith',
      role: 'CTO, Another Company',
      stars: 5
    },
    {
      comment: 'Highly recommended.',
      avatar: 'https://via.placeholder.com/150',
      name: 'Bob Johnson',
      role: 'Manager, Some Company',
      stars: 5
    },
    {
      comment: 'Awesome product.',
      avatar: 'https://via.placeholder.com/150',
      name: 'Terry jane',
      role: 'Manager, Ets',
      stars: 5
    },

    {
      comment: 'This is a fantastic product!',
      avatar: 'https://via.placeholder.com/150',
      name: 'John Doe',
      role: 'CEO, Company',
      stars: 5
    },
    {
      comment: 'I love the service!',
      avatar: 'https://via.placeholder.com/150',
      name: 'Jane Smith',
      role: 'CTO, Another Company',
      stars: 5
    },
    {
      comment: 'Highly recommended.',
      avatar: 'https://via.placeholder.com/150',
      name: 'Bob Johnson',
      role: 'Manager, Some Company',
      stars: 5
    },
    {
      comment: 'Awesome product.',
      avatar: 'https://via.placeholder.com/150',
      name: 'Terry jane',
      role: 'Manager, Ets',
      stars: 5
    },
  ];

  translateX = 0;
  intervalId: any;
  currentIndex = 0;

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startAutoplay() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.reviews.length;
      // debugger
      if (window.innerWidth > 768) {
        if (this.currentIndex >= this.reviews.length/4) {
          this.currentIndex = 0
        }
      }
    }, 5000);
  }

  getTransformStyle() {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.getTransformStyle();
  }

}
