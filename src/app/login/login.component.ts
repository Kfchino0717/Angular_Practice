import { Component, OnInit } from '@angular/core';
import { FormService } from '../form.service';
import { MessageService } from '../message.service';
import { Account } from '../post';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  postlist: Account[] = [];
  accountMessage: any[] = []
  post: any[] = [];//單筆搜尋
  account: any[] = []
  addName = '';
  addPassword = '';
  posts: any[] = [];

  constructor(private formService: FormService,
              private messageService: MessageService,
  ) { }

  download(filename: string) {
    window.open(`https://localhost:7239/api/Post/Download/${filename}`)
    window.parent.opener.location = `/get`;
  };


  searchPostid(term: string): void {
    this.formService.getPostid(term)
      .subscribe(post => this.post = [post])
  };

  deleteComment(term: string, name: string): void {
    this.formService.deleteComment(term, name).subscribe()
  };

  checkAccount(name:string, password:string):void{
    if (this.addName.length === 0 || this.addPassword.length === 0) return this.messageService.add("不能為空值");
    this.formService.checkAccount(name,password).subscribe();
  };

  searchAccount(name:string, password:string):void{
    if (this.addName.length === 0 || this.addPassword.length === 0) return;
    this.formService.checkAccount(name,password).subscribe(
      post => this.accountMessage = [post]);
  }
  searchMessage(name:string):void{
    this.formService.getAccountComment(name).subscribe(data => {
      this.posts = data;
    });
  }
  reset():void{
    this.addName=''
    this.addPassword=''
  }

  ngOnInit(): void {
    this.formService.getAccount().subscribe(data => {
      this.account = data;
    });
  }
}
