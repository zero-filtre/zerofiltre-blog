import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="flex justify-center items-center min-h-[50vh]">
      <svg
        class="w-10 h-10 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="200px"
        height="200px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          fill="none"
          stroke="#15b2bc"
          stroke-width="10"
          r="35"
          stroke-dasharray="164.93361431346415 56.97787143782138"
          transform="matrix(1,0,0,1,0,0)"
          style="animation-play-state:paused"
        ></circle>
      </svg>
    </div>
  `,
})
export class LoadingSpinnerComponent {}
