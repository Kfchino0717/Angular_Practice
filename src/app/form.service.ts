import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Account, Post } from './post';
import { MessageService } from './message.service';
@Injectable({
  providedIn: 'root'
})
export class FormService {
  baseUrl = 'https://localhost:7239/api/Post';

  constructor(private readonly http: HttpClient, private messageService: MessageService) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //this.log(`${operation} failed: ${error.message}`);
      this.log(`${operation}`);
      console.error(error);
      return of(result as T);
    };
  }

  //獲取帳號密碼(僅有帳號名字清單)
  getAccount():Observable<any>{
    return this.http.get(`${this.baseUrl}/GetAccount`)
  }

  //確認帳密api
  checkAccount(name:string, password:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/CheckAccount/${name}/${password}`).pipe(
      catchError(this.handleError<any>('帳號或密碼錯誤')));
  }

  ///獲取個人留言清單
  getAccountComment(name:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/GetAccountPostComment/${name}`)
  }

  // 獲取完整貼文清單  
  getPostList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetPost`);
  }

  //內容模糊搜尋
  getPostContent(term: any): Observable<any> {
    if (!term.trim('')) {
      return of();
    }
    return this.http.get(`${this.baseUrl}/GetPostContent/${term}`)
  }

  // 搜尋postid
  getPostid(term: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetPost/${term}`).pipe(
      tap(x => x ?
        this.log(`搜尋到 ${term} `) :
        this.log(`found posts matching ${term}`)
      )
    );
  }

  // 獲取單貼文清單
  getPostlist(term: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetPost/${term}`)
  }

  // 搜尋文章標題
  getPosttitle(term: any): Observable<any> {
    if (!term.trim()) {
      this.log('輸入為空');
      return of();
    }
    return this.http.get(`${this.baseUrl}/GetPostTitle/${term}`).pipe(
      tap(x => x.toString.length ?
        this.log(`未搜尋到 ${term} `) :
        this.log(`搜尋到 ${term} `)
      ));
  }

  // 獲取留言
  getComment(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetComment/${id}`);
  }

  // 用來確認是否存在
  searchPosts(term: string): Observable<Post[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Post[]>(`${this.baseUrl}/GetPost/${term}`).pipe(
      tap(x => x.length ?
        this.log(`no posts matching "${term}"`) :
        this.log(`found posts matching "${term}"`)
      ),
      catchError(this.handleError<Post[]>('searchPosts', []))
    );
  }

  // 刪除貼文
  deletePost(term: string, titlename: string): Observable<any> {
    const log = `已刪除貼文 id: ${term}，標題: ${titlename}`
    return this.http.delete<any>(`${this.baseUrl}/DeletePost/${term}`).pipe(
      tap(term => term ?
        this.log('not found') ://未找到也沒有訊息??
        this.log(log)
      ));
  }

  // 刪除檔案
  deleteFile(term: any, filename: string): Observable<any> {
    const log = `已刪除檔案 名稱: ${filename}`
    return this.http.delete<any>(`${this.baseUrl}/DeleteFile/${term}`).pipe(
      tap(term => term ?
        this.log('not found') ://未找到也沒有訊息??
        this.log(log)
      ));
  }

  // 刪除留言
  deleteComment(term: string, name: string): Observable<any> {
    const log = `已刪除 ${name} 的留言`
    return this.http.delete<any>(`${this.baseUrl}/DeleteComment/${term}`).pipe(
      tap(term => term ?
        this.log('not found') ://未找到也沒有訊息??
        this.log(log)
      ));
  }

  // 打印訊息
  private log(message: string) {
    return this.messageService.add(`${message}`);
  }

  // 創建新貼文
  createPost(title: string, content: string, files: File[]): Observable<Post> {
    const url = `${this.baseUrl}/CreatePost`;
    const formData: FormData = new FormData();
    formData.append('Title', title);
    formData.append('Content', content);

    files.forEach(file => formData.append('files', file, file.name));

    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.post<Post>(url, formData, { headers }).pipe(
      tap((newPost: Post) => this.log(`已新增貼文 id：${newPost.id}，標題：${newPost.title}`)),
      catchError(this.handleError<Post>('createPost'))
    );
  }

  //創建帳號
  createAccount(name: string, password: string): Observable<Account> {
    const url = `${this.baseUrl}/CreateAccount`;
    const formData: FormData = new FormData();
    formData.append('Name', name);
    formData.append('Password', password);

    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.post<Account>(url, formData, { headers }).pipe(
      tap((newPost: Account) => this.log(`已添加 ${name} 的帳號`)),
      catchError(this.handleError<Account>('帳號創建錯誤'))
    );

  }

  //創建留言
  createComment(term: number, name: string, content: string): Observable<Post> {
    const url = `${this.baseUrl}/CreateComment/${term}`;
    const formData: FormData = new FormData();
    formData.append('Name', name);
    formData.append('Content', content);

    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.post<Post>(url, formData, { headers }).pipe(
      tap((newPost: Post) => this.log(`已添加 ${name} 的留言`)),
      catchError(this.handleError<Post>('updatePost'))
    );
  }

  // 更新貼文put
  updatePost(term: number, title: string, content: string, files: File[]): Observable<Post> {
    const url = `${this.baseUrl}/Update/${term}`;
    const formData: FormData = new FormData();
    formData.append('Title', title);
    formData.append('Content', content);

    files.forEach(file => formData.append('files', file, file.name));

    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.put<Post>(url, formData, { headers }).pipe(
      tap((newPost: Post) => this.log(`已更新貼文 id：${term}，標題:${title}`)),
      catchError(this.handleError<Post>('updatePost'))
    );
  }

  // 更新留言put
  updateComment(term: number, name: string, content: string): Observable<Post> {
    const url = `${this.baseUrl}/UpdateComment/${term}`;
    const formData: FormData = new FormData();
    formData.append('Name', name);
    formData.append('Content', content);

    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.put<Post>(url, formData, { headers }).pipe(
      tap((newPost: Post) => this.log(`已更新 ${name} 的留言`)),
      catchError(this.handleError<Post>('updatePost'))
    );
  }

}