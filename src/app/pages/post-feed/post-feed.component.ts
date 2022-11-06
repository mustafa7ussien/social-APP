import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from 'src/app/tools/create-post/create-post.component';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss']
})
export class PostFeedComponent implements OnInit {
  posts: PostData [] = [];
  firestore=new FirebaseTSFirestore();
 
  constructor( private daialog:MatDialog) { }

  ngOnInit(): void {
    this.getPosts();
  }
  onCreatePostClick()
  {
    this.daialog.open(CreatePostComponent);

  }
  
  getPosts()
  {
    this.firestore.getCollection(
      {
        path:["Posts"],
        where:[
          // new Where("creatorId","==","bqn8nqYmP3YajCr9KUa2Epcj6Ps1"),
          new OrderBy("timestamp","desc"),
          new Limit(10)
        ],
        onComplete:(result)=> {
          result.docs.forEach(
            doc =>
            {
             let post= <PostData>doc.data();
             post.postId=doc.id;
             this.posts.push(post);
            }
          );
        
        },
        onFail(err) {
          
        },
      }
    );
  }

}
export interface PostData
{
  comment:string;
  creatorId:string;
  imageUrl?:string;
  postId:string;

}