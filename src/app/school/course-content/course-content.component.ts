import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.css']
})
export class CourseContentComponent implements OnInit {
  course!: any;
  lesson!: any;
  loading: boolean = false;

  fakeLesson = {
    name: 'Sécuriser vos micro-services sur kubernetes avec Nginx et Ory Oathkeeper',
    content: `L'indépendance et la simplicité des micro-services sont les principaux atouts de cette approche et pourtant, elles deviennent problématiques lorsqu'il faut implémenter certaines fonctionnalités comme l'authentification et l'autorisation.
  
  Pour cela, plusieurs approches sont proposées à l'instar :
  
  - Authentification&Autorisation sur chaque service
  
  - Service global d'authentification et d'autorisation
  
  - Authentification globale (API Gateway) et autorisation par service
  
  - etc.
  
  Dans cet article, nous implémenterons la troisième approche qui consiste à authentifier les requêtes avec un Api Gateway et gérer les autorisations depuis chaque micro-services.
  
  ## Contexte
  
  Nous avons un micro-service dans notre cluster kubernetes que nous souhaitons protéger avec une authentification centralisée via un Api Gateway. Il est accessible via un service de type ClusterIP (helloworld-service) sur le port 5000. et un autre qui gère l'authentification et la gestion des utilisateurs
  
  ## Nos outils
  
  - Nginx Ingress Controller: est un contrôleur Ingress pour Kubernetes utilisant NGINX [NGINX](https://www.nginx.org/) comme proxy inverse et repartisseur de charge.
  
  - [Ory Oathkeeper](https://github.com/ory/oathkeeper) : est un proxy d'identité et d'accès (IAP) et une API de décision de contrôle d'accès qui autorise les requêtes HTTP en fonction d'ensembles de règles d'accès. Notre zero Trust Proxy.
  
  ## Déployons notre service
  
  > Modifiez les configurations en fonction de votre déploiement
  
  Créons un ficher **helloworld-service.yaml** et appliquons-le
  Notre micro-service est prêt.
  
  ## Installation de Ory Kratos
  
  Créons un fichier **kratos.yaml** et appliquons-le
  > Veuillez adapter ce fichier selon vos besoins.
  
  **Ory Kratos** est prêt à être utilisé.
  
  ## Installation et configuration de Ory Oathkeeper
  
  Créons un fichier **oauthkeeper-config.yaml** pour la configuration globale de OauthKeeper
  
  Puis un fichier **access-rules.json** pour les rêgles d'acces
  
  
  
  
  Maintenant,  installons Oauthkeeper 
  
  
  > Vous pouvez consulter la [documentation de oauthkeeper](https://www.ory.sh/docs/oathkeeper/) pour plus d'informations sur sa configuration
  
  Vos requêtes seront toutes redirigées vers Oauthkeeper qui se chargera de leurs authentifications`
  };

  constructor() { }

  loadLessonData() {
    this.loading = true;

    const lesson$ = new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = this.fakeLesson;
        resolve(data);
      }, 1000);
    });

    lesson$.then((data: any) => {
      this.loading = false;
      this.lesson = data;
    })
  }

  ngOnInit(): void {
    this.loadLessonData();
  }

}
