import { Component, OnInit } from '@angular/core';
import { FormService } from '../form.service';
import { Post } from '../post';
import { MessageService } from '../message.service'
import { FormControl } from '@angular/forms';
import { FormMessageComponent } from '../form-message/form-message.component';
@Component({
  selector: 'app-form-get',
  templateUrl: './form-get.component.html',
  styleUrls: ['./form-get.component.scss'],
  providers: [FormService,
    FormMessageComponent
  ]
})
export class FormGetComponent implements OnInit {
  news: number = 0
  myControl = new FormControl('');
  //新增推薦留言用的陣列
  options: string[] = ['很棒！', '很感興趣', '很喜歡～','也不過僅僅如此罷了'];
  posts: Post[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  similarContent: Post[] = [];

  post: any[] = [];//單筆搜尋

  //新增留言
  postList: Post[] = [];
  addid = 0;
  addName = '';
  addContent = '';

  constructor(private formService: FormService,
    private messageService: MessageService,
    public formMessage: FormMessageComponent,
  ) { }

  get paginatedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.posts.slice(startIndex, endIndex);
  }

  nextPage() {
    if ((this.currentPage * this.itemsPerPage) < this.posts.length) {//如果有東西
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {//一頁以下不能換頁
      this.currentPage--;
    }
  }

  addList(term: number) {
    if (this.addName.length === 0 || this.addContent.length === 0) return this.messageService.add("不能為空值");

    this.formService.createComment(term, this.addName, this.addContent).subscribe({
      next: (putPost: Post) => {
        this.postList.push(putPost);
        this.addName = '';
        this.addContent = '';
      },
      error: (error) => console.error('Error creating post:', error)
    });
  }

  //下載
  download(filename: string) {
    window.open(`https://localhost:7239/api/Post/Download/${filename}`)
    window.parent.opener.location = `/get`;
  };

  //查詢貼文(點擊側列)
  searchPost(term: any): void {
    this.formService.getPostlist(term)
      .subscribe(post => this.post = [post])

  };

  //搜索用id
  searchPostid(term: string): void {
    this.formService.getPostid(term)
      .subscribe(post => this.post = [post])
  };

  //模糊搜尋
  searchContent(term: string): void {
    this.post = []
    this.formService.getPostContent(term)
      .subscribe(content => this.similarContent = content)
  }

  //回傳紀錄
  log(term: string): void {
    this.news++;
    if (this.similarContent = []) {
      return this.messageService.add(`未搜尋到${term}...`)
    }
    return this.messageService.add(`搜尋到${term}!`)
  }

  //查詢貼文標題
  searchPosttitle(term: string): void {
    this.formService.getPosttitle(term)
      .subscribe(post => this.post = [post])
  }

  //刪除貼文
  deletePost(term: string, title: string): void {
    this.formService.deletePost(term, title).subscribe()
  };

  //刪除檔案
  deleteFile(term: number, filename: string): void {
    this.formService.deleteFile(term, filename).subscribe()
  };

  //刪除留言
  deleteComment(term: string, name: string): void {
    this.formService.deleteComment(term, name).subscribe()
  };

  ngOnInit(): void {
    this.formService.getPostList().subscribe(data => {
      this.posts = data;
    });
  }
}
