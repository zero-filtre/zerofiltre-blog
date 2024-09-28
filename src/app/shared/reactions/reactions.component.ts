import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
  styleUrls: ['./reactions.component.css'],
})
export class ReactionsComponent {
  @Input() loading: boolean;
  @Input() obj: Article | Course;

  @Output() reactionEvent = new EventEmitter<string>();

  constructor() {}

  public typesOfReactions = <any>[
    { action: 'clap', emoji: '👏' },
    { action: 'fire', emoji: '🔥' },
    { action: 'love', emoji: '💖' },
    { action: 'like', emoji: '👍' },
  ];

  public reactionCounts: any = {};

  sendReactionType(reactionType: string) {
    this.reactionEvent.emit(reactionType);
  }

  calculateReactionCounts() {
    const reactions = this.obj.reactions || [];

    const counts = {
      clap: 0,
      fire: 0,
      love: 0,
      like: 0,
    };

    reactions.forEach((reaction: Reaction) => {
      switch (reaction.action) {
        case 'CLAP':
         counts.clap++;
          break;
        case 'FIRE':
          counts.fire++;
          break;
        case 'LOVE':
          counts.love++;
          break;
        case 'LIKE':
          counts.like++;
          break;
        default:
          break;
      }
    });

    this.reactionCounts = counts;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['obj'] && this.obj) {
      this.calculateReactionCounts();
    }
  }

  ngOnInit(): void {
    this.calculateReactionCounts();
  }
}
