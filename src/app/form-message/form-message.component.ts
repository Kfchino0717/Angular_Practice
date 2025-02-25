import { Component } from '@angular/core';
import { MessageService } from '../message.service';
@Component({
  selector: 'app-form-message',
  templateUrl: './form-message.component.html',
  styleUrls: ['./form-message.component.scss']
})
export class FormMessageComponent {
  constructor(public messageService: MessageService) { }
  hidden = false;
  messageCounter = '!';
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}

