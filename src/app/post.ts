export class Post {
  id: number;
  title: string | undefined;
  content: string | undefined;
  files?: { fileName: string; filePath: string }[];
  comments?: any[];
  date: Date;
  time: any;

  constructor(id: number, title: string, content: string) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.date = new Date();
  }
}
export class Account {
  name: string | undefined;
  password: string | undefined;
  comments?: any[];
  date: Date;
  time: any;

  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
    this.date = new Date();
  }
}
