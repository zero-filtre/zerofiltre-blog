import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, tap } from 'rxjs/operators';
import { SeoService } from 'src/app/services/seo.service';
import { calcReadingTime, capitalizeString, formatDate } from 'src/app/services/utilities.service';
import { environment } from 'src/environments/environment';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';

import { BehaviorSubject, of, Subscription } from 'rxjs';
import { AuthService } from 'src/app/user/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteArticlePopupComponent } from '../delete-article-popup/delete-article-popup.component';
import { MessageService } from 'src/app/services/message.service';

// import "node_modules/prismjs/components/prism-rip.min";
// import "node_modules/prismjs/components/prism-velocity.min";
// import "node_modules/prismjs/components/prism-bbcode.min";
// import "node_modules/prismjs/components/prism-protobuf.min";
// import "node_modules/prismjs/components/prism-tcl.min";
// import "node_modules/prismjs/components/prism-jsx.min";
// import "node_modules/prismjs/components/prism-sass.min";
// import "node_modules/prismjs/components/prism-julia.min";
// import "node_modules/prismjs/components/prism-aql.min";
// import "node_modules/prismjs/components/prism-psl.min";
// import "node_modules/prismjs/components/prism-haxe.min";
// import "node_modules/prismjs/components/prism-al.min";
// import "node_modules/prismjs/components/prism-jexl.min";
// import "node_modules/prismjs/components/prism-q.min";
// import "node_modules/prismjs/components/prism-clike.min";
// import "node_modules/prismjs/components/prism-ada.min";
// import "node_modules/prismjs/components/prism-cil.min";
// import "node_modules/prismjs/components/prism-tt2.min";
// import "node_modules/prismjs/components/prism-scss.min";
// import "node_modules/prismjs/components/prism-sas.min";
// import "node_modules/prismjs/components/prism-nix.min";
// import "node_modules/prismjs/components/prism-textile.min";
// import "node_modules/prismjs/components/prism-dax.min";
// import "node_modules/prismjs/components/prism-bnf.min";
// import "node_modules/prismjs/components/prism-jq.min";
// import "node_modules/prismjs/components/prism-hoon.min";
// import "node_modules/prismjs/components/prism-asmatmel.min";
// import "node_modules/prismjs/components/prism-latte.min";
// import "node_modules/prismjs/components/prism-maxscript.min";
// import "node_modules/prismjs/components/prism-lilypond.min";
// import "node_modules/prismjs/components/prism-n4js.min";
// import "node_modules/prismjs/components/prism-unrealscript.min";
// import "node_modules/prismjs/components/prism-docker.min";
// import "node_modules/prismjs/components/prism-latex.min";
// import "node_modules/prismjs/components/prism-solution-file.min";
// import "node_modules/prismjs/components/prism-eiffel.min";
// import "node_modules/prismjs/components/prism-xquery.min";
// import "node_modules/prismjs/components/prism-typoscript.min";
// import "node_modules/prismjs/components/prism-coq.min";
// import "node_modules/prismjs/components/prism-arff.min";
// import "node_modules/prismjs/components/prism-go-module.min";
// import "node_modules/prismjs/components/prism-tremor.min";
// import "node_modules/prismjs/components/prism-gcode.min";
// import "node_modules/prismjs/components/prism-d.min";
// import "node_modules/prismjs/components/prism-antlr4.min";
// import "node_modules/prismjs/components/prism-pascal.min";
// import "node_modules/prismjs/components/prism-nsis.min";
// import "node_modules/prismjs/components/prism-markup-templating.min";
// import "node_modules/prismjs/components/prism-rest.min";
// import "node_modules/prismjs/components/prism-r.min";
// import "node_modules/prismjs/components/prism-mongodb.min";
// import "node_modules/prismjs/components/prism-perl.min";
// import "node_modules/prismjs/components/prism-asm6502.min";
// import "node_modules/prismjs/components/prism-ftl.min";
// import "node_modules/prismjs/components/prism-factor.min";
// import "node_modules/prismjs/components/prism-hpkp.min";
// import "node_modules/prismjs/components/prism-t4-templating.min";
// import "node_modules/prismjs/components/prism-turtle.min";
// import "node_modules/prismjs/components/prism-nim.min";
// import "node_modules/prismjs/components/prism-coffeescript.min";
// import "node_modules/prismjs/components/prism-monkey.min";
// import "node_modules/prismjs/components/prism-gml.min";
// import "node_modules/prismjs/components/prism-tap.min";
// import "node_modules/prismjs/components/prism-javascript.min";
// import "node_modules/prismjs/components/prism-js-templates.min";
// import "node_modules/prismjs/components/prism-applescript.min";
// import "node_modules/prismjs/components/prism-liquid.min";
// import "node_modules/prismjs/components/prism-markdown.min";
// import "node_modules/prismjs/components/prism-parser.min";
// import "node_modules/prismjs/components/prism-excel-formula.min";
// import "node_modules/prismjs/components/prism-ruby.min";
// import "node_modules/prismjs/components/prism-basic.min";
// import "node_modules/prismjs/components/prism-actionscript.min";
// import "node_modules/prismjs/components/prism-php.min";
// import "node_modules/prismjs/components/prism-twig.min";
// import "node_modules/prismjs/components/prism-moonscript.min";
// import "node_modules/prismjs/components/prism-v.min";
// import "node_modules/prismjs/components/prism-qml.min";
// import "node_modules/prismjs/components/prism-wren.min";
// import "node_modules/prismjs/components/prism-concurnas.min";
// import "node_modules/prismjs/components/prism-oz.min";
// import "node_modules/prismjs/components/prism-groovy.min";
// import "node_modules/prismjs/components/prism-matlab.min";
// import "node_modules/prismjs/components/prism-css.min";
// import "node_modules/prismjs/components/prism-stan.min";
// import "node_modules/prismjs/components/prism-nginx.min";
// import "node_modules/prismjs/components/prism-http.min";
// import "node_modules/prismjs/components/prism-tsx.min";
// import "node_modules/prismjs/components/prism-gn.min";
// import "node_modules/prismjs/components/prism-javadoclike.min";
// import "node_modules/prismjs/components/prism-smalltalk.min";
// import "node_modules/prismjs/components/prism-toml.min";
// import "node_modules/prismjs/components/prism-elixir.min";
// import "node_modules/prismjs/components/prism-swift.min";
// import "node_modules/prismjs/components/prism-io.min";
// import "node_modules/prismjs/components/prism-dataweave.min";
// import "node_modules/prismjs/components/prism-nasm.min";
// import "node_modules/prismjs/components/prism-yaml.min";
// import "node_modules/prismjs/components/prism-squirrel.min";
// import "node_modules/prismjs/components/prism-less.min";
// import "node_modules/prismjs/components/prism-json.min";
// import "node_modules/prismjs/components/prism-inform7.min";
// import "node_modules/prismjs/components/prism-vhdl.min";
// import "node_modules/prismjs/components/prism-clojure.min";
// import "node_modules/prismjs/components/prism-shell-session.min";
// import "node_modules/prismjs/components/prism-fsharp.min";
// import "node_modules/prismjs/components/prism-bsl.min";
// import "node_modules/prismjs/components/prism-avro-idl.min";
// import "node_modules/prismjs/components/prism-markup.min";
// import "node_modules/prismjs/components/prism-icon.min";
// import "node_modules/prismjs/components/prism-core.min";
// import "node_modules/prismjs/components/prism-vim.min";
// import "node_modules/prismjs/components/prism-parigp.min";
// import "node_modules/prismjs/components/prism-mel.min";
// import "node_modules/prismjs/components/prism-xojo.min";
// import "node_modules/prismjs/components/prism-bicep.min";
// import "node_modules/prismjs/components/prism-lisp.min";
// import "node_modules/prismjs/components/prism-sml.min";
// import "node_modules/prismjs/components/prism-regex.min";
// import "node_modules/prismjs/components/prism-magma.min";
// import "node_modules/prismjs/components/prism-graphql.min";
// import "node_modules/prismjs/components/prism-ejs.min";
// import "node_modules/prismjs/components/prism-avisynth.min";
// import "node_modules/prismjs/components/prism-rego.min";
// import "node_modules/prismjs/components/prism-nevod.min";
// import "node_modules/prismjs/components/prism-hsts.min";
// import "node_modules/prismjs/components/prism-python.min";
// import "node_modules/prismjs/components/prism-editorconfig.min";
// import "node_modules/prismjs/components/prism-ichigojam.min";
// import "node_modules/prismjs/components/prism-promql.min";
// import "node_modules/prismjs/components/prism-openqasm.min";
// import "node_modules/prismjs/components/prism-wolfram.min";
// import "node_modules/prismjs/components/prism-erlang.min";
// import "node_modules/prismjs/components/prism-wasm.min";
// import "node_modules/prismjs/components/prism-soy.min";
// import "node_modules/prismjs/components/prism-autohotkey.min";
// import "node_modules/prismjs/components/prism-php-extras.min";
// import "node_modules/prismjs/components/prism-dns-zone-file.min";
// import "node_modules/prismjs/components/prism-robotframework.min";
// import "node_modules/prismjs/components/prism-visual-basic.min";
// import "node_modules/prismjs/components/prism-keepalived.min";
// import "node_modules/prismjs/components/prism-sql.min";
// import "node_modules/prismjs/components/prism-ocaml.min";
// import "node_modules/prismjs/components/prism-abnf.min";
// import "node_modules/prismjs/components/prism-makefile.min";
// import "node_modules/prismjs/components/prism-typescript.min";
// import "node_modules/prismjs/components/prism-jsstacktrace.min";
// import "node_modules/prismjs/components/prism-gap.min";
// import "node_modules/prismjs/components/prism-scheme.min";
// import "node_modules/prismjs/components/prism-handlebars.min";
// import "node_modules/prismjs/components/prism-pug.min";
// import "node_modules/prismjs/components/prism-haskell.min";
// import "node_modules/prismjs/components/prism-flow.min";
// import "node_modules/prismjs/components/prism-kusto.min";
// import "node_modules/prismjs/components/prism-aspnet.min";
// import "node_modules/prismjs/components/prism-agda.min";
// import "node_modules/prismjs/components/prism-roboconf.min";
// import "node_modules/prismjs/components/prism-ignore.min";
// import "node_modules/prismjs/components/prism-hcl.min";
// import "node_modules/prismjs/components/prism-bash.min";
// import "node_modules/prismjs/components/prism-ebnf.min";
// import "node_modules/prismjs/components/prism-objectivec.min";
// import "node_modules/prismjs/components/prism-go.min";
// import "node_modules/prismjs/components/prism-cmake.min";
// import "node_modules/prismjs/components/prism-brightscript.min";
// import "node_modules/prismjs/components/prism-dot.min";
// import "node_modules/prismjs/components/prism-fortran.min";
// import "node_modules/prismjs/components/prism-dhall.min";
// import "node_modules/prismjs/components/prism-jsdoc.min";
// import "node_modules/prismjs/components/prism-splunk-spl.min";
// import "node_modules/prismjs/components/prism-purebasic.min";
// import "node_modules/prismjs/components/prism-j.min";
// import "node_modules/prismjs/components/prism-asciidoc.min";
// import "node_modules/prismjs/components/prism-puppet.min";
// import "node_modules/prismjs/components/prism-apl.min";
// import "node_modules/prismjs/components/prism-bro.min";
// import "node_modules/prismjs/components/prism-cpp.min";
// import "node_modules/prismjs/components/prism-csp.min";
// import "node_modules/prismjs/components/prism-keyman.min";
// import "node_modules/prismjs/components/prism-etlua.min";
// import "node_modules/prismjs/components/prism-erb.min";
// import "node_modules/prismjs/components/prism-powerquery.min";
// import "node_modules/prismjs/components/prism-reason.min";
// import "node_modules/prismjs/components/prism-java.min";
// import "node_modules/prismjs/components/prism-nand2tetris-hdl.min";
// import "node_modules/prismjs/components/prism-mizar.min";
// import "node_modules/prismjs/components/prism-false.min";
// import "node_modules/prismjs/components/prism-pure.min";
// import "node_modules/prismjs/components/prism-smarty.min";
// import "node_modules/prismjs/components/prism-javastacktrace.min";
// import "node_modules/prismjs/components/prism-brainfuck.min";
// import "node_modules/prismjs/components/prism-uorazor.min";
// import "node_modules/prismjs/components/prism-llvm.min";
// import "node_modules/prismjs/components/prism-autoit.min";
// import "node_modules/prismjs/components/prism-csv.min";
// import "node_modules/prismjs/components/prism-django.min";
// import "node_modules/prismjs/components/prism-iecst.min";
// import "node_modules/prismjs/components/prism-birb.min";
// import "node_modules/prismjs/components/prism-rust.min";
// import "node_modules/prismjs/components/prism-qore.min";
// import "node_modules/prismjs/components/prism-naniscript.min";
// import "node_modules/prismjs/components/prism-xeora.min";
// import "node_modules/prismjs/components/prism-pcaxis.min";
// import "node_modules/prismjs/components/prism-cobol.min";
// import "node_modules/prismjs/components/prism-cypher.min";
// import "node_modules/prismjs/components/prism-haml.min";
// import "node_modules/prismjs/components/prism-c.min";
// import "node_modules/prismjs/components/prism-peoplecode.min";
// import "node_modules/prismjs/components/prism-uri.min";
// import "node_modules/prismjs/components/prism-ini.min";
// import "node_modules/prismjs/components/prism-glsl.min";
// import "node_modules/prismjs/components/prism-pascaligo.min";
// import "node_modules/prismjs/components/prism-n1ql.min";
// import "node_modules/prismjs/components/prism-smali.min";
// import "node_modules/prismjs/components/prism-elm.min";
// import "node_modules/prismjs/components/prism-prolog.min";
// import "node_modules/prismjs/components/prism-diff.min";
// import "node_modules/prismjs/components/prism-powershell.min";
// import "node_modules/prismjs/components/prism-jolie.min";
// import "node_modules/prismjs/components/prism-stylus.min";
// import "node_modules/prismjs/components/prism-icu-message-format.min";
// import "node_modules/prismjs/components/prism-gdscript.min";
// import "node_modules/prismjs/components/prism-opencl.min";
// import "node_modules/prismjs/components/prism-batch.min";
// import "node_modules/prismjs/components/prism-qsharp.min";
// import "node_modules/prismjs/components/prism-kumir.min";
// import "node_modules/prismjs/components/prism-gedcom.min";
// import "node_modules/prismjs/components/prism-properties.min";
// import "node_modules/prismjs/components/prism-livescript.min";
// import "node_modules/prismjs/components/prism-csharp.min";
// import "node_modules/prismjs/components/prism-json5.min";
// import "node_modules/prismjs/components/prism-gherkin.min";
// import "node_modules/prismjs/components/prism-lua.min";
// import "node_modules/prismjs/components/prism-lolcode.min";
// import "node_modules/prismjs/components/prism-systemd.min";
// import "node_modules/prismjs/components/prism-idris.min";
// import "node_modules/prismjs/components/prism-warpscript.min";
// import "node_modules/prismjs/components/prism-apacheconf.min";
// import "node_modules/prismjs/components/prism-git.min";
// import "node_modules/prismjs/components/prism-wiki.min";
// import "node_modules/prismjs/components/prism-renpy.min";
// import "node_modules/prismjs/components/prism-verilog.min";
// import "node_modules/prismjs/components/prism-log.min";
// import "node_modules/prismjs/components/prism-cshtml.min";
// import "node_modules/prismjs/components/prism-neon.min";
// import "node_modules/prismjs/components/prism-web-idl.min";
// import "node_modules/prismjs/components/prism-mermaid.min";
// import "node_modules/prismjs/components/prism-abap.min";

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  public article!: Article;
  public articleId!: string;
  public similarArticles!: Article[];
  public articleHasTags!: boolean;
  public loading!: boolean;
  private isPublished = new BehaviorSubject<any>(null);
  public isPublished$ = this.isPublished.asObservable();
  readonly blogUrl = environment.blogUrl;

  private nberOfReactions = new BehaviorSubject<number>(0);
  public nberOfReactions$ = this.nberOfReactions.asObservable();
  public typesOfReactions = <any>[
    { action: 'clap', emoji: '👏' },
    { action: 'fire', emoji: '🔥' },
    { action: 'love', emoji: '💖' },
    { action: 'like', emoji: '👍' },
  ];

  private fireReactions = new BehaviorSubject<number>(0);
  public fireReactions$ = this.fireReactions.asObservable();
  private clapReactions = new BehaviorSubject<number>(0);
  public clapReactions$ = this.clapReactions.asObservable();
  private loveReactions = new BehaviorSubject<number>(0);
  public loveReactions$ = this.loveReactions.asObservable();
  private likeReactions = new BehaviorSubject<number>(0);
  public likeReactions$ = this.likeReactions.asObservable();

  public articleSub!: Subscription;
  public loginToAddReaction!: boolean;
  public maxNberOfReaction!: boolean;
  public hasHistory: boolean;

  dddSponsorContentSourceUrl = 'assets/images/ddd-imagee.svg';

  constructor(
    private dialogRef: MatDialog,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private seo: SeoService,
    private router: Router,
    public authService: AuthService,
    public messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.hasHistory = this.router.navigated;
  }

  public setDateFormat(date: any) {
    return formatDate(date)
  }

  public trimAuthorName(name: string | any) {
    return name?.replace(/ /g, '');
  }

  public getCurrentArticle(articleId: string): void {
    this.loading = true;
    this.articleService.findArticleById(articleId)
      .pipe(
        tap(art => {
          if (art.status === 'PUBLISHED') {
            this.isPublished.next(true);
          } else {
            this.isPublished.next(false);
          }
        })
      )
      .subscribe({
        next: (response: Article) => {
          this.article = response

          this.seo.generateTags({
            title: response.title,
            description: response.summary,
            image: response.thumbnail,
            author: response.author?.fullName,
          })

          this.nberOfReactions.next(response?.reactions?.length);
          this.fireReactions.next(this.findTotalReactionByAction('FIRE', response?.reactions));
          this.clapReactions.next(this.findTotalReactionByAction('CLAP', response?.reactions));
          this.loveReactions.next(this.findTotalReactionByAction('LOVE', response?.reactions));
          this.likeReactions.next(this.findTotalReactionByAction('LIKE', response?.reactions));

          this.articleHasTags = response?.tags.length > 0
          calcReadingTime(response);
          this.fetchSimilarArticles();
          this.loading = false;
        },
        error: (_error: HttpErrorResponse) => {
          this.loading = false;
          this.messageService.openSnackBarError("Oops cet article est n'existe pas 😣!", '');
          this.router.navigateByUrl('/articles');
        }
      })
  }

  public fetchSimilarArticles(): void {
    if (!this.article?.tags.length) return

    let randomTagIndex = Math.floor(Math.random() * this.article?.tags.length);
    let randomTagName = this.article?.tags[randomTagIndex]?.name!

    const selectedArticles = <any>[]
    let filteredArticles = <any>[]

    console.log('FIRST TAG: ', randomTagName);

    this.articleService.findAllArticlesByTag(0, 20, randomTagName)
      .subscribe(({ content, numberOfElements }: any) => {
        if (numberOfElements > 1) {
          filteredArticles = content.filter((article: Article) => article.id !== this.article.id);

          const randomArticleIndex = Math.floor(Math.random() * filteredArticles.length);
          selectedArticles.push(filteredArticles[randomArticleIndex])

          const newRandomArticleIndex = Math.floor(Math.random() * filteredArticles.length);

          if (newRandomArticleIndex !== randomArticleIndex) {
            selectedArticles.push(filteredArticles[newRandomArticleIndex])
          }

          console.log('SIMILAR ARTICLES: ', selectedArticles)
          this.similarArticles = [...selectedArticles]
        } else {
          if (this.article?.tags.length == 1) {
            console.log('ARTICLE HAS ONLY ONE TAG AND NO SIMILAR ARTICLES')
            return;
          } else if ((this.article?.tags.length - 1) == randomTagIndex && randomTagIndex != 0) {
            randomTagIndex -= 1;
          } else {
            randomTagIndex += 1;
          }
          randomTagName = this.article?.tags[randomTagIndex]?.name!

          console.log('SECOND TAG: ', randomTagName);

          this.articleService.findAllArticlesByTag(0, 20, randomTagName)
            .subscribe(({ content }: any) => {
              filteredArticles = content.filter((article: Article) => article.id !== this.article.id);

              if (filteredArticles.length) {
                const randomArticleIndex = Math.floor(Math.random() * filteredArticles.length);
                selectedArticles.push(filteredArticles[randomArticleIndex])

                const newRandomArticleIndex = Math.floor(Math.random() * filteredArticles.length);

                if (newRandomArticleIndex !== randomArticleIndex) {
                  selectedArticles.push(filteredArticles[newRandomArticleIndex])
                }

                console.log('SIMILAR ARTICLES: ', selectedArticles)
                this.similarArticles = [...selectedArticles]
              }
            })
        }
      })
  }

  public isAuthor(user: any, article: Article): boolean {
    return user?.id === article?.author?.id
  }

  public authorHasSocials(): boolean {
    return this.article?.author?.socialLinks.length > 0
  }

  public authorHasSocialLinkFor(platform: string): boolean {
    return this.article?.author?.socialLinks.some((profile: any) => profile.platform === platform && profile.link)
  }

  public authorPlatformLink(platform: string): string {
    return this.article?.author?.socialLinks.find((profile: any) => profile.platform === platform)?.link
  }

  public userHasAlreadyReactOnArticleFiftyTimes(): boolean {
    const artileReactions = this.article?.reactions;
    const currentUsr = this.authService?.currentUsr;
    return artileReactions.filter((reaction: any) => reaction?.authorId === currentUsr?.id).length === 49;
  }

  public findTotalReactionByAction(action: string, reactions: []): number {
    return reactions.filter((reaction: any) => reaction.action === action).length;
  }

  public addReaction(action: string): any {
    const currentUsr = this.authService?.currentUsr;

    if (!currentUsr) {
      return this.loginToAddReaction = true;
    }
    if (this.userHasAlreadyReactOnArticleFiftyTimes()) {
      return this.maxNberOfReaction = true;
    };

    this.articleService.addReactionToAnArticle(this.articleId, action).subscribe({
      next: (response) => {
        this.nberOfReactions.next(response.length);
        this.fireReactions.next(this.findTotalReactionByAction('FIRE', response));
        this.clapReactions.next(this.findTotalReactionByAction('CLAP', response));
        this.loveReactions.next(this.findTotalReactionByAction('LOVE', response));
        this.likeReactions.next(this.findTotalReactionByAction('LIKE', response));
      }
    });
  }

  public openArticleDeleteDialog(): void {
    this.dialogRef.open(DeleteArticlePopupComponent, {
      panelClass: 'delete-article-popup-panel',
      data: {
        id: this.articleId,
        history: this.router.url
      }
    });
  }

  public capitalize(str: string): string {
    return capitalizeString(str);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.articleId = params.get('id')!;
        this.getCurrentArticle(this.articleId);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.articleSub) {
      this.articleSub.unsubscribe();
    }
  }

}
