import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { PagerService } from '../pager.service';
import { Post } from './post';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blog: any = {};
  allItems: any[];
  pages: any[];
  pageSize = 3;
  pager: any = {};
  posts: Post[];

  constructor(private config: ConfigService, private pagerService: PagerService) { }

  ngOnInit() {
    this.blog = this.getBlog();
    this.getPosts()
    this.allItems = this.blog.posts;
    this.setPage(1);
    }

    getPosts(){
      this.config.getPosts().subscribe(
        posts => {
          this.posts = posts;
          this.allItems = this.posts;
          this.setPage(1);
        }
      )
    }

  getBlog() {
    return this.config.getConfig().blog;
  }

  setPage(pageNumber: number){
    this.pager = this.pagerService.getPager(this.allItems.length, pageNumber, this.pageSize);

    this.pages = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

}
