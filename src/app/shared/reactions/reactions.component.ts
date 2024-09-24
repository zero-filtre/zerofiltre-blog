import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Article } from 'src/app/articles/article.model';
import { ArticleService } from 'src/app/articles/article.service';
import { Course, Reaction } from 'src/app/school/courses/course';
import { CourseService } from 'src/app/school/courses/course.service';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from 'src/app/user/auth.service';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrls: ['./reactions.component.css']
})
export class ReactionsComponent {
 @Input() loading: boolean;
@Input() obj: Article | Course;
 
 @Output() reactionEvent = new EventEmitter<string>();
  
  constructor(

  ){}

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


 

  sendReactionType($event) {

    this.reactionEvent.emit($event)


  }

  setEachReactionTotal(reactions: Reaction[]) {
    this.fireReactions.next(this.findTotalReactionByAction('FIRE', reactions));
    this.clapReactions.next(this.findTotalReactionByAction('CLAP', reactions));
    this.loveReactions.next(this.findTotalReactionByAction('LOVE', reactions));
    this.likeReactions.next(this.findTotalReactionByAction('LIKE', reactions));
  }
  
findTotalReactionByAction(action: string, reactions: Reaction[]): number {
    return reactions.filter((reaction: Reaction) => reaction.action === action).length;
  }

  


  ngOnInit(): void{
this.setEachReactionTotal(this.obj.reactions)

  }
}
