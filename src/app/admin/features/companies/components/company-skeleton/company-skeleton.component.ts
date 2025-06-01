import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-company-skeleton',
  template: `
    <div class="skeleton-container lg:grid grid-cols-3 gap-6 items-start">
      <div class="aspect-w-3 aspect-h-2">
        <ngx-skeleton-loader
          count="1"
          appearance="line"
          [theme]="{
            'border-radius': '8px',
            'height.%': 100,
            'width.%': 100
          }"
        >
        </ngx-skeleton-loader>
      </div>

      <div class="col-span-2 mt-4 lg:mt-0">
        <div class="tags-container flex space-x-3">
          <ngx-skeleton-loader
            count="1"
            appearance="line"
            [theme]="{
              'border-radius': '9999px',
              height: '30px',
              width: '100px',
              display: 'block'
            }"
          >
          </ngx-skeleton-loader>
          <ngx-skeleton-loader
            count="1"
            appearance="line"
            [theme]="{
              'border-radius': '9999px',
              height: '30px',
              width: '100px',
              display: 'block'
            }"
          >
          </ngx-skeleton-loader>
        </div>

        <div class="content-container mt-2">
          <ngx-skeleton-loader
            count="1"
            appearance="line"
            [theme]="{
              'border-radius': '5px',
              height: '40px',
              display: 'block'
            }"
          >
          </ngx-skeleton-loader>
          <ngx-skeleton-loader
            count="2"
            appearance="line"
            [theme]="{
              'border-radius': '5px',
              height: '15px',
              display: 'block'
            }"
          >
          </ngx-skeleton-loader>

          <div class="flex items-center space-x-2">
            <div>
              <ngx-skeleton-loader
                count="1"
                appearance="line"
                [theme]="{
                  'border-radius': '9999px',
                  'width.px': 50,
                  'height.px': 50
                }"
              >
              </ngx-skeleton-loader>
            </div>
            <div class="flex-1">
              <ngx-skeleton-loader
                count="1"
                appearance="line"
                [theme]="{
                  'border-radius': '5px',
                  height: '10px',
                  display: 'block'
                }"
              >
              </ngx-skeleton-loader>
              <ngx-skeleton-loader
                count="1"
                appearance="line"
                [theme]="{
                  'border-radius': '5px',
                  height: '10px',
                  display: 'block'
                }"
              >
              </ngx-skeleton-loader>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CompanySkeletonComponent {}
