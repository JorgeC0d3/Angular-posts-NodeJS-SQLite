import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
  @Input() post: any;
  @Input() username: string | null = null;
  @Input() url: string | null = null;
  @Output() addDeleteEvent = new EventEmitter<string>();

  onDeletePost(id: string){
    this.addDeleteEvent.emit(id);
  }


}
