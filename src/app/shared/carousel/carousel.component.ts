import { Component, HostListener, Inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Course, Review } from 'src/app/school/courses/course';
import { AuthService } from 'src/app/user/auth.service';
import { catchError, forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { User } from 'src/app/user/user.model';
import { SurveyService } from 'src/app/services/survey.service';
import { CourseService } from 'src/app/school/courses/course.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  @Input() courseId: number;

  constructor(
    private userService: AuthService,
    private courseService: CourseService,
    private surveyService: SurveyService,
    @Inject(PLATFORM_ID) private platformId: any,
  ){}

  avatarHommeNoir = 'https://ik.imagekit.io/lfegvix1p/Homme%20Noir_HLhn8q7ee.svg?updatedAt=1719058562747';
  avatarFemmeNoir = 'https://ik.imagekit.io/lfegvix1p/Femme%20noire_s51iOIdmX.svg?updatedAt=1719058562790';
  avatarHommeBlanc = 'https://ik.imagekit.io/lfegvix1p/Homme%20Blanc_oobxMT8KK.svg?updatedAt=1719058562779';
  avatarFemmeBlanche = 'https://ik.imagekit.io/lfegvix1p/Femme%20Blanche_N_xj-DOPJ.svg?updatedAt=1719058562581';

  defaultReviews: Review[] = [
    {
      comment: "J'ai suivi le parcours DDD dans le cadre de mon travail en tant que développeur senior, et il m'a vraiment aidé à structurer mon approche du développement logiciel. En appliquant les techniques apprises, j'ai pu améliorer la qualité du code et faciliter la collaboration avec les experts métier. Un cours essentiel pour tout professionnel du développement.",
      avatar: this.avatarHommeNoir,
      name: 'Blanchard Banyingela',
      role: 'Apprenant',
      stars: 5
    },
    {
      comment: "Je suis très satisfait de ce parcours sur le Domain Driven Design. Il m'a permis d'acquérir les connaissances et les compétences nécessaires pour implémenter le DDD dans mes projets.",
      avatar: this.avatarHommeBlanc,
      name: 'Matthieu Barbereau',
      role: 'Apprenant',
      stars: 5
    },
    {
      comment: "Super cours ! Il m'a donné une nouvelle perspective sur la façon de concevoir des logiciels en mettant l'accent sur le domaine métier. Très instructif et bien présenté. Merci !",
      avatar: this.avatarHommeNoir,
      name: "Boni Emmanuel N'DA",
      role: 'Apprenant',
      stars: 5
    },
    {
      comment: "En tant que débutant conception logicielle , j'ai longtemps cherché le cours complet sur plusieurs plateformes. Ma recherche a finalement abouti à ce parcours DDD, et je ne pourrais être plus satisfait. Grâce à l'excellent enseignement de Philippe, j'ai pu développer ma toute première application de avec succès. Le parcours DDD est parfaitement adapté aux débutants et je le recommande vivement à tous ceux qui souhaitent se familiariser avec le monde de l’ingenerie Logicielle.",
      avatar: this.avatarHommeNoir,
      name: 'Marko',
      role: 'Apprenant',
      stars: 5
    },
    {
      comment: "Le parcours DDD m'a permis de comprendre les concepts fondamentaux du DDD de manière claire et concise. Je suis maintenant en mesure d'appliquer ces principes à mes propres projets.",
      avatar: this.avatarHommeBlanc,
      name: 'Antoine Wagon',
      role: 'Apprenant',
      stars: 5
    },
    {
      comment: "Suivre le parcours DDD a été une excellente décision pour ma carrière. J'ai pu appliquer les principes du Domain Driven Design dans plusieurs projets, et cela a transformé ma manière de concevoir et de développer des logiciels. Les concepts sont expliqués de manière accessible, même pour ceux qui ne sont pas familiers avec le DDD. Merci beaucoup !",
      avatar: this.avatarHommeNoir,
      name: 'Ayoub TOUZOU',
      role: 'Apprenant',
      stars: 5
    },
    {
      comment: "C'est un très bon cours. Dans son ensemble, on comprends vite les concepts du DDD qui y sont développés avec précisions et illustrés de manière significative. En débutant le parcours DDD, j’étais un peu perplexe sur sa plu value, mais grâce à lui aujourd’hui, j’ai pu structurer mon approche du développement logiciel. Merci",
      avatar: this.avatarFemmeBlanche,
      name: 'Tavares monteiro erica',
      role: 'Apprenante',
      stars: 5
    },
    {
      comment: "J'ai trouvé le parcours DDD très enrichissant. Les notions complexes sont rendues accessibles grâce à des explications détaillées et des illustrations pertinentes. Je le recommande amplement",
      avatar: this.avatarHommeNoir,
      name: 'Roland GORE',
      role: 'Apprenant',
      stars: 4
    },
    {
      comment: "Le parcours DDD m'a vraiment ouvert les yeux sur l'importance du Domain Driven Design. Les concepts sont expliqués de manière claire et les exemples concrets facilitent la compréhension.",
      avatar: this.avatarHommeNoir,
      name: 'Mohamed Ali Mahdhaoui',
      role: 'Apprenant',
      stars: 4
    },
    {
      comment: "J'ai vraiment apprécié le parcours sur le Domain Driven Design. Il m'a permis de mieux comprendre les concepts clés du DDD et comment les mettre en pratique. Le formateur est très compétent et passionné par le sujet. Je le recommande vivement à tous ceux qui souhaitent en savoir plus sur le DDD.",
      avatar: this.avatarHommeNoir,
      name: 'GUEI Roland',
      role: 'Apprenant',
      stars: 4
    }
  ].map(rev => ({...rev, courseTitle: 'Mettez (enfin) en place le Domain Driven Design'}))

  reviewsArray: Review[] = [...this.defaultReviews];
  loading: boolean;

  translateX = 0;
  intervalId: any;
  currentIndex = 0;

  formatReview(review: Review): Observable<Review> {
    const commentHash = {
      // b: { text: review.chapterExplanations, len: review.chapterExplanations?.replace(/\s+/g, '').length || 0 },
      // d: { text: review.improvementSuggestion, len: review.improvementSuggestion?.replace(/\s+/g, '').length || 0 },
      a: { text: review.chapterImpressions, len: review.chapterImpressions?.replace(/\s+/g, '').length || 0 },
      c: { text: review.whyRecommendingThisCourse, len: review.whyRecommendingThisCourse?.replace(/\s+/g, '').length || 0 }
    }

    let commentText = '';
    let maxLen = -1;

    for (const key in commentHash) {
      if (commentHash[key].len > maxLen) {
        maxLen = commentHash[key].len;
        commentText = commentHash[key].text;
      }
    }

    const scoreHash = {
      a: review.chapterSatisfactionScore,
      b: review.chapterUnderstandingScore,
      c: review.overallChapterSatisfaction,
    }

    let scoreRate = 0;
    let maxScore = -1;

    for (const key in scoreHash) {
      if (scoreHash[key] > maxScore) {
        maxLen = scoreHash[key];
        scoreRate = scoreHash[key];
      }
    }

    return this.userService.findUserProfile(review.reviewAuthorId.toString())
      .pipe(
        mergeMap((author: User) => {
          const currentReviewValue = {
            ...review,
            comment: commentText,
            avatar: author.profilePicture,
            role: author.profession,
            stars: scoreRate,
            name: author.fullName,
          }

          if (!(review.courseId > 0)) {
            return of(currentReviewValue)
          }

          return this.courseService.findCourseById(review.courseId)
            .pipe(
              map((course: Course) => ({
                ...currentReviewValue,
                courseTitle: course.title
              }))
            )
        }),
        catchError(error => {
          console.error('Error fetching course or author', error);
          return of({ ...review, comment: commentText, avatar: '', role: '', stars: 0, name: '', courseTitle: '' });
        })
      )
    
  }
  
  getReviews() {
    this.loading = true;
    this.surveyService.getReviews()
      .pipe(
        mergeMap((reviews: Review[]) => {
          const formattedReviews$ = reviews
            .map(review => this.formatReview(review));
  
          return forkJoin(formattedReviews$);
        }),
        map((formattedReviews: Review[]) => {
          if (!this.courseId) {
            return formattedReviews
            .filter(review => (review.comment !== '' && review.comment?.replace(/\s+/g, '').length >= 68))
          } 

          return formattedReviews
            .filter(review => review.courseId == this.courseId)
            .filter(review => (review.comment !== '' && review.comment?.replace(/\s+/g, '').length >= 68))
        })
      )
      .subscribe({
        next: (formattedReviews: Review[]) => this.reviewsArray = [...formattedReviews, ...this.reviewsArray],
        error: (e: any) => console.log(e),
        complete: () => this.loading = false
      });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoplay();
      this.getReviews();
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startAutoplay() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.reviewsArray.length;
      if (window.innerWidth > 768) {
        if (this.currentIndex >= this.reviewsArray.length/4) {
          this.currentIndex = 0
        }
      }
    }, 25000);
  }

  getTransformStyle() {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.getTransformStyle();
  }

}
