import { Component, HostListener, Inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  @Input() userReviews: any[];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
  ){}

  reviews = [
    {
      comment: "Le parcours DDD m'a vraiment ouvert les yeux sur l'importance du Domain Driven Design. Les concepts sont expliqués de manière claire et les exemples concrets facilitent la compréhension.",
      avatar: '',
      name: 'Mohamed Ali Mahdhaoui',
      role: 'Apprenant',
      stars: 4
    },
    {
      comment: "J'ai trouvé le parcours DDD très enrichissant. Les notions complexes sont rendues accessibles grâce à des explications détaillées et des illustrations pertinentes. Je le recommande amplement",
      avatar: '',
      name: 'Roland GORE',
      role: 'Apprenant',
      stars: 4
    },
    {
      comment: "Super cours ! Il m'a donné une nouvelle perspective sur la façon de concevoir des logiciels en mettant l'accent sur le domaine métier. Très instructif et bien présenté. Merci !",
      avatar: '',
      name: "Boni Emmanuel N'DA",
      role: 'Apprenant',
      stars: 5
    },
    {
      comment: "En tant que débutant conception logicielle , j'ai longtemps cherché le cours complet sur plusieurs plateformes. Ma recherche a finalement abouti à ce parcours DDD, et je ne pourrais être plus satisfait. Grâce à l'excellent enseignement de Philippe, j'ai pu développer ma toute première application de avec succès. Le parcours DDD est parfaitement adapté aux débutants et je le recommande vivement à tous ceux qui souhaitent se familiariser avec le monde de l’ingenerie Logicielle.",
      avatar: '',
      name: 'Marko',
      role: 'Apprenant',
      stars: 5
    },

    {
      comment: "J'ai suivi le parcours DDD dans le cadre de mon travail en tant que développeur senior, et il m'a vraiment aidé à structurer mon approche du développement logiciel. En appliquant les techniques apprises, j'ai pu améliorer la qualité du code et faciliter la collaboration avec les experts métier. Un cours essentiel pour tout professionnel du développement.",
      avatar: '',
      name: 'Blanchard Banyingela',
      role: 'Apprenant',
      stars: 5
    },
    {
      comment: "Suivre le parcours DDD a été une excellente décision pour ma carrière. J'ai pu appliquer les principes du Domain Driven Design dans plusieurs projets, et cela a transformé ma manière de concevoir et de développer des logiciels. Les concepts sont expliqués de manière accessible, même pour ceux qui ne sont pas familiers avec le DDD. Merci beaucoup !",
      avatar: '',
      name: 'Ayoub TOUZOU',
      role: 'Apprenant',
      stars: 5
    },
    {
      comment: "C'est un très bon cours. Dans son ensemble, on comprends vite les concepts du DDD qui y sont développés avec précisions et illustrés de manière significative. En débutant le parcours DDD, j’étais un peu perplexe sur sa plu value, mais grâce à lui aujourd’hui, j’ai pu structurer mon approche du développement logiciel. Merci",
      avatar: '',
      name: 'Tavares monteiro erica',
      role: 'Apprenant',
      stars: 5
    },
    {
      comment: "J'ai vraiment apprécié le parcours sur le Domain Driven Design. Il m'a permis de mieux comprendre les concepts clés du DDD et comment les mettre en pratique. Le formateur est très compétent et passionné par le sujet. Je le recommande vivement à tous ceux qui souhaitent en savoir plus sur le DDD.",
      avatar: '',
      name: 'GUEI Roland',
      role: 'Apprenant',
      stars: 4
    },
    {
      comment: "Je suis très satisfait de ce parcours sur le Domain Driven Design. Il m'a permis d'acquérir les connaissances et les compétences nécessaires pour implémenter le DDD dans mes projets.",
      avatar: '',
      name: 'Matthieu Barbereau',
      role: 'Apprenant',
      stars: 5
    },
    {
      comment: "Le parcours DDD m'a permis de comprendre les concepts fondamentaux du DDD de manière claire et concise. Je suis maintenant en mesure d'appliquer ces principes à mes propres projets.",
      avatar: '',
      name: 'Antoine Wagon',
      role: 'Apprenant',
      stars: 5
    },
  ];

  translateX = 0;
  intervalId: any;
  currentIndex = 0;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoplay();
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startAutoplay() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.reviews.length;
      if (window.innerWidth > 768) {
        if (this.currentIndex >= this.reviews.length/4) {
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
