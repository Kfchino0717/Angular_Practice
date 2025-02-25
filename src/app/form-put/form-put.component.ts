import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { FormService } from '../form.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-form-put',
  templateUrl: './form-put.component.html',
  styleUrls: ['./form-put.component.scss'],
  providers: [FormService]
})
export class FormPutComponent implements OnInit {

  currentPage: number = 1;
  itemsPerPage: number = 10;


  posts: any[] = [];
  post: any[] = [];//單筆搜尋
  comment: any[] = []
  similarContent: Post[] = [];

  //更新貼文
  postlist: Post[] = [];
  addid = 0;
  addTitle = '';
  addContent = '';
  selectedFiles: File[] = [];

  //更新留言
  commentlist: Post[] = [];
  addName = '';
  addCommentContent = '';

  constructor(private formService: FormService,
    private messageService: MessageService
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

  //查詢貼文(用以檢視)
  searchPost(term: any): void {
    this.formService.getPostlist(term)
      .subscribe(post => this.post = [post])
  };

  //查詢貼文
  searchPostid(term: string): void {
    this.formService.getPostid(term)
      .subscribe(post => this.post = [post])
  };

  //查詢貼文標題
  searchPosttitle(term: string): void {
    this.formService.getPosttitle(term)
      .subscribe(post => this.post = [post])
  }

  //模糊搜尋
  searchContent(term: string): void {
    this.post = []
    this.formService.getPostContent(term)
      .subscribe(content => this.similarContent = content)
  }

  log(term: string): void {
    if (this.similarContent = []) {
      return this.messageService.add(`未搜尋到${term}...`)
    }
    return this.messageService.add(`搜尋到${term}!`)
  }

  //搜索留言
  searchComment(term: string): void {
    this.formService.getComment(term)
      .subscribe(comment => this.comment = [comment])
  };

  ngOnInit(): void {

    this.formService.getPostList().subscribe(data => {
      this.posts = data;
    });

  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  addList(term: number) {
    if (this.addTitle.length === 0 || this.addContent.length === 0) return this.messageService.add("不能為空值");

    this.formService.updatePost(term, this.addTitle, this.addContent, this.selectedFiles).subscribe({
      next: (putPost: Post) => {
        this.postlist.push(putPost);
        this.addTitle = '';
        this.addContent = '';
        this.selectedFiles = [];
      },
      error: (error) => console.error('Error creating post:', error)
    });
  }

  putComment(term: number) {
    if (this.addName.length === 0 || this.addContent.length === 0) return this.messageService.add("不能為空值");

    this.formService.updateComment(term, this.addName, this.addContent).subscribe({
      next: (putPost: Post) => {
        this.postlist.push(putPost);
        this.addName = '';
        this.addContent = '';
      },
      error: (error) => console.error('Error creating post:', error)
    });
  }
}
