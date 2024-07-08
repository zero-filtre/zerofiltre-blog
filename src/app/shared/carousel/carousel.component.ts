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
      comment: "Ce cours m'a vraiment ouvert les yeux sur l'importance du Domain Driven Design. Les concepts sont expliqués de manière claire et les exemples concrets facilitent la compréhension.",
      avatar: '',
      // name: 'John Doe',
      // role: 'CEO, Company',
      stars: 4
    },
    {
      comment: "J'ai trouvé ce cours très enrichissant. Les notions complexes sont rendues accessibles grâce à des explications détaillées et des illustrations pertinentes. Je le recommande amplement",
      avatar: '',
      name: 'Jane Smith',
      role: 'CTO, Another Company',
      stars: 4
    },
    {
      comment: "Super cours ! Il m'a donné une nouvelle perspective sur la façon de concevoir des logiciels en mettant l'accent sur le domaine métier. Très instructif et bien présenté. Merci !",
      avatar: '',
      name: 'Bob Johnson',
      role: 'Manager, Some Company',
      stars: 4
    },
    {
      comment: "En tant que débutant conception logicielle , j'ai longtemps cherché le cours complet sur plusieurs plateformes. Ma recherche a finalement abouti à ce cours, et je ne pourrais être plus satisfait. Grâce à l'excellent enseignement de Philippe, j'ai pu développer ma toute première application de avec succès. Ce cours est parfaitement adapté aux débutants et je le recommande vivement à tous ceux qui souhaitent se familiariser avec le monde de l’ingenerie Logicielle.",
      avatar: '',
      name: 'Terry jane',
      role: 'Manager, Ets',
      stars: 4
    },

    {
      comment: "J'ai suivi ce cours dans le cadre de mon travail en tant que développeur senior, et il m'a vraiment aidé à structurer mon approche du développement logiciel. En appliquant les techniques apprises, j'ai pu améliorer la qualité du code et faciliter la collaboration avec les experts métier. Un cours essentiel pour tout professionnel du développement.",
      avatar: '',
      name: 'John Doe',
      role: 'CEO, Company',
      stars: 4
    },
    {
      comment: "Suivre ce cours a été une excellente décision pour ma carrière. J'ai pu appliquer les principes du Domain Driven Design dans plusieurs projets, et cela a transformé ma manière de concevoir et de développer des logiciels. Les concepts sont expliqués de manière accessible, même pour ceux qui ne sont pas familiers avec le DDD. Merci beaucoup !",
      avatar: '',
      name: 'Jane Smith',
      role: 'CTO, Another Company',
      stars: 4
    },
    {
      comment: "C'est un très bon cours. Dans son ensemble, on comprends vite les concepts du DDD qui y sont développés avec précisions et illustrés de manière significative. En débutant ce cours, j’étais un peu perplexe sur sa plu value, mais grâce à lui aujourd’hui, j’ai pu structurer mon approche du développement logiciel. Merci",
      avatar: '',
      name: 'Bob Johnson',
      role: 'Manager, Some Company',
      stars: 4
    },
    {
      comment: "J'ai vraiment apprécié ce cours sur le Domain Driven Design. Il m'a permis de mieux comprendre les concepts clés du DDD et comment les mettre en pratique. Le formateur est très compétent et passionné par le sujet. Je le recommande vivement à tous ceux qui souhaitent en savoir plus sur le DDD.",
      avatar: '',
      name: 'Terry jane',
      role: 'Manager, Ets',
      stars: 4
    },
    {
      comment: "Je suis très satisfait de ce cours sur le Domain Driven Design. Il m'a permis d'acquérir les connaissances et les compétences nécessaires pour implémenter le DDD dans mes projets.",
      avatar: '',
      name: 'Terry jane',
      role: 'Manager, Ets',
      stars: 4
    },
    {
      comment: "Ce cours m'a permis de comprendre les concepts fondamentaux du DDD de manière claire et concise. Je suis maintenant en mesure d'appliquer ces principes à mes propres projets.",
      avatar: '',
      name: 'Terry jane',
      role: 'Manager, Ets',
      stars: 4
    },
    {
      comment: "Je pense que ce cours conviendrait mieux aux développeurs ayant une certaine expérience du DDD. En tant que débutant, j'ai trouvé que le contenu était un peu trop théorique.",
      avatar: '',
      name: 'Terry jane',
      role: 'Manager, Ets',
      stars: 3
    },
    {
      comment: "Le cours se concentre beaucoup sur les concepts théoriques du DDD, mais il ne fournit pas suffisamment de conseils pratiques pour la mise en œuvre. J'aurais aimé que le formateur partage plus d'expériences et de bonnes pratiques en matière de mise en œuvre du DDD dans des projets de développement logiciel.",
      avatar: '',
      name: 'Terry jane',
      role: 'Manager, Ets',
      stars: 3
    },
    {
      comment: "Ce cours offre une introduction utile au Domain Driven Design (DDD), mais je pense qu'il manque un peu de profondeur pour les développeurs expérimentés , J'aurais aimé qu’il explore des concepts du DDD plus avancés et fournisse des exemples plus complexes.",
      avatar: '',
      name: 'Terry jane',
      role: 'Manager, Ets',
      stars: 3
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
      // debugger
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
