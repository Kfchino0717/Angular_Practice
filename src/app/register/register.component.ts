import { Component, OnInit } from '@angular/core';
import { FormService } from '../form.service';
import { MessageService } from '../message.service';
import { Account } from '../post';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  postList: Account[] = [];
  checkList:Account[] = [];
  addName = '';
  addPassword = '';
  constructor(private formService: FormService,
              private messageService: MessageService,) { }
  addList() {
    if (this.addName.length === 0 || this.addPassword.length === 0) return this.messageService.add("不能為空值");

    this.formService.createAccount(this.addName, this.addPassword).subscribe({
      next: (newPost: Account) => {
        this.postList.push(newPost);
        this.addName = '';
        this.addPassword = '';
      },
    });
  }
  log(term:string):void{
    this.messageService.add(term)
  }

  ngOnInit(): void {
    this.formService.getAccount()
    .subscribe(data => {
      this.checkList = data;
    });
    }
}
