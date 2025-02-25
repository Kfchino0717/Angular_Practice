import { Component } from '@angular/core';
import { FormService } from '../form.service';
import { Post } from '../post';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-form-post',
  templateUrl: './form-post.component.html',
  styleUrls: ['./form-post.component.scss'],
  providers: [FormService]
})
export class FormPostComponent {
  title = "Form";
  postlist: Post[] = [];

  addid = 0;
  addTitle = '';
  addContent = '';
  selectedFiles: File[] = [];

  constructor(private formService: FormService,
              private messageService: MessageService,
  ) {}

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  download(filename:string){
    window.open(`https://localhost:7239/api/Post/Download/${filename}`)
    window.parent.opener.location = `/get`;
  };

  addList() {
    if (this.addTitle.length === 0 || this.addContent.length === 0) return this.messageService.add("不能為空值");

    this.formService.createPost(this.addTitle, this.addContent, this.selectedFiles).subscribe({
      next: (newPost: Post) => {
        this.postlist.push(newPost);
        this.addTitle = '';
        this.addContent = '';
        this.selectedFiles = [];
      },
      error: (error) => console.error('Error creating post:', error)
    });
  }
}
