import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css'],
})
export class ArticlesListComponent implements OnInit {
  public articles!: Article[];

  name = environment.username;
  content =
    '<div class="our-service__box">\n          <div class="our-service__text">\n            <h1 class="our-service__title">Des applications très évolutives alignées aux derniers standards.</h1>\n            <div class="text-box wrap-text">\n              <p class="our-service__description">De par sa nature stable et sécurisée, le langage de programmation\n                <b>JAVA</b> est\n                utilisé par de nombreuses entreprises opérant dans des secteurs tels: la banque, l’assurance, les\n                transports etc, et ce depuis\n                plus de 25 ans.<br><br>\n                Avec JAVA, le code est écrit une et une seule fois et peut être utilisé\n                sur des systèmes d\'exploitation différents, sans avoir à être réécrit. Il se positionne\n                alors comme l’une des solutions incontournables à adopter pour automatiser les tâches lourdes du\n                business,\n                fluidifier le\n                processus métier et répondre mieux au besoin du client afin d’accélérer sa croissance.\n              </p>\n              <p class="our-service__description moreText hide-mobile-text show-desktop-text">Zerofiltre a pour objectif\n                de vous\n                accompagner,\n                particuliers, moyennes\n                et petites entreprises dans ce processus, en vous\n                fournissant des applications en JAVA, compatibles pour toutes plateformes, qui pourront évoluer avec la\n                taille de votre\n                entreprise, avec un rapport qualité/prix toujours au top.\n                Nous nous améliorons en continu afin de fournir aux clients, un service meilleur que celui dont ils\n                s\'imaginent.<br><br>\n                Cependant, Le langage JAVA\n                utilise une méthodologie stricte et bien élaborée qui nécessite des années d’expérience : c’est\n                exactement ce dont nous disposons.\n              </p>\n            </div>\n            <span class="view-more show-mobile hide-desktop">\n              <small>Voir plus</small>\n              <img src="/images/dropdown-icon.svg" alt="chevron" id="toggleChevron">\n            </span>\n          </div>\n\n          <div class="our-service__img">\n            <img src="https://i.ibb.co/TbFN2zC/landing-illustration.png" alt="our-service" class="img-fluid">\n          </div>\n        </div>';

  constructor(private articleService: ArticleService) { }

  public getArticles(): void {
    this.articleService.getArticles().subscribe(
      (response: Article[]) => {
        this.articles = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getArticles();
  }
}
