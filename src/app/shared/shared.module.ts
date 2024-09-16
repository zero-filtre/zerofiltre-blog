import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatDialogModule } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppShellRenderDirective } from '../directives/app-shell-render.directive';
import { AppShellNoRenderDirective } from '../directives/app-shell-no-render.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ImagekitioAngularModule } from 'imagekitio-angular';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import {MatTooltipModule} from '@angular/material/tooltip';


import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MarkdownModule } from 'ngx-markdown';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { NgxDocViewerModule } from'ngx-doc-viewer'
import { NgChartsModule } from 'ng2-charts';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateUniversalLoader } from './lang-switcher/translate-universal-loader';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ImageComponent } from './image/image.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { BaseArticleListComponent } from './base-article-list/base-article-list.component';
import { VimeoUrlPipe } from './pipes/vimeo-url.pipe';
import { TextEditorComponent } from './ui/text-editor/text-editor.component';
import { AutoSaveButtonComponent } from './ui/buttons/auto-save-button/auto-save-button.component';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { UrlPipe } from './pipes/url.pipe';
import { BaseCourseListComponent } from './base-course-list/base-course-list.component';
import { YoutubeVideoPlayerComponent } from './youtube-video-player/youtube-video-player.component';
import { MarkdownPreviewComponent } from './markdown-preview/markdown-preview.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentFailedComponent } from './payment-failed/payment-failed.component';
import { PaymentPopupComponent } from './payment-popup/payment-popup.component';
import { PaymentCanceledComponent } from './payment-canceled/payment-canceled.component';
import { PdfPreviewComponent } from './ui/pdf-preview/pdf-preview.component';
import { PricingComponent } from './pricing/pricing.component';
import { BotUserProfileComponent } from './bot-user-profile/bot-user-profile.component';
import { BotUserPopupComponent } from './bot-user-popup/bot-user-popup.component';
import { StatChartComponent } from './stat-chart/stat-chart.component';
import { BotSignupFormComponent } from './bot-signup-form/bot-signup-form.component';
import { BotUserInfosComponent } from './bot-user-infos/bot-user-infos.component';
import { BotPhoneVerificationComponent } from './bot-phone-verification/bot-phone-verification.component';
import { AddEmailPopupComponent } from './add-email-popup/add-email-popup.component';
import { PricePlanComponent } from './price-plan/price-plan.component';
import { MentoredIconComponent } from './mentored-icon/mentored-icon.component';
import { ProPageComponent } from './pro-page/pro-page.component';
import { AdsSquareComponent } from './ads-square/ads-square.component';
import { AdsRectangleComponent } from './ads-rectangle/ads-rectangle.component';
import { CollapsibleTagsComponent } from './collapsible-tags/collapsible-tags.component';
import { SlugUrlPipe } from './pipes/slug-url.pipe';
import { CourseCardComponent } from './course-card/course-card.component';
import { CourseListItemComponent } from './course-list-item/course-list-item.component';
import { NpsSurveyComponent } from './nps-survey/nps-survey.component';
import { SurveyModule } from 'survey-angular-ui';
import { PaymentButtonComponent } from './payment-button/payment-button.component';
import { AnnouncementBannerComponent } from './announcement-banner/announcement-banner.component';
import { ReviewComponent } from './review/review.component';
import { CarouselComponent } from './carousel/carousel.component';
import { SearchPopupComponent } from './search-popup/search-popup.component';
import { WhatsappButtonComponent } from './whatsapp-button/whatsapp-button.component';
import { ReactionsComponent } from './reactions/reactions.component';
import { ArticlesCardComponent } from '../articles/article-card/articles-card.component';

const components = [
  AppShellRenderDirective,
  AppShellNoRenderDirective,
  FooterComponent,
  ImageComponent,
  HeaderComponent,
  BaseArticleListComponent,
  TextEditorComponent,
  AutoSaveButtonComponent,
  NotFoundPageComponent,
  VimeoUrlPipe,
  SlugUrlPipe,
  UrlPipe,
  UploadFormComponent,
  YoutubeVideoPlayerComponent,
  BaseCourseListComponent,
  MarkdownPreviewComponent,
  PaymentSuccessComponent,
  PaymentFailedComponent,
  PaymentCanceledComponent,
  PaymentPopupComponent,
  PdfPreviewComponent,
  PricingComponent,
  BotUserProfileComponent, 
  BotUserPopupComponent,
  StatChartComponent, 
  BotSignupFormComponent,
  BotUserInfosComponent,
  BotPhoneVerificationComponent,
  AddEmailPopupComponent,
  PricePlanComponent,
  MentoredIconComponent,
  ProPageComponent, 
  AdsSquareComponent, 
  AdsRectangleComponent,
  CollapsibleTagsComponent,
  CourseCardComponent,
  CourseListItemComponent,
  NpsSurveyComponent,
  PaymentButtonComponent,
  AnnouncementBannerComponent,
  ReviewComponent,
  CarouselComponent,
  SearchPopupComponent,
  WhatsappButtonComponent,
  ReactionsComponent,
  ArticlesCardComponent
];

const modules = [
  CommonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatMenuModule,
  MatSnackBarModule,
  MatDialogModule,
  MatIconModule,
  RouterModule,
  HttpClientModule,
  NgxSkeletonLoaderModule,
  FormsModule,
  ReactiveFormsModule,
  InfiniteScrollModule,
  TranslateModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatListModule,
  YouTubePlayerModule,
  NgxDocViewerModule,
  DragDropModule,
  CdkAccordionModule,
  NgxIntlTelInputModule,
  NgChartsModule,
  MatTooltipModule,
  SurveyModule
];

@NgModule({
  declarations: [...components],
  imports: [
    ...modules,
    MarkdownModule.forRoot(),

    ImagekitioAngularModule.forRoot({
      publicKey: 'public_TOa/IP2yX1o2eHip4nsS+rPLsjE=', // or environment.imagekitPublicKey
      urlEndpoint: 'https://ik.imagekit.io/lfegvix1p', // or environment.imagekitUrlEndpoint
      authenticationEndpoint: '' // or environment.bucketAuthenticationEndpoint
    }),

    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useClass: TranslateUniversalLoader
      }
    })
  ],
  exports: [
    ...components,
    ...modules,
  ]
})
export class SharedModule { }
