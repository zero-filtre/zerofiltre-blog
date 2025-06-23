import { Component } from '@angular/core';

@Component({
  selector: 'app-no-companies',
  template: `
    <div class="flex flex-col justify-center items-center h-96 space-y-5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-20 w-20 text-primary-500"
        fill="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
        />
      </svg>
      <div class="text-sm font-semibold text-skin-base">
        Aucune organisation pour le moment 😊!
      </div>
    </div>
  `,
})
export class NoCompaniesComponent {}
