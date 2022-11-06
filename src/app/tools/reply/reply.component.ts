import { Component, inject, Inject, OnInit } from '@angular/core';
import { FirebaseTSFirestore, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostComponent } from '../post/post.component';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { AppComponent } from 'src/app/app.component';



@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {
  firestore=new FirebaseTSFirestore();
  comments:Comment[]=[];

  constructor(@Inject(MAT_DIALOG_DATA) private postId:string) { }

  ngOnInit(): void {
    this.getComments();
  }
  isCommentcreator(comment:Comment)
  {try
    {
      return comment.creatorId=this.postId;
    }
    catch(err)
    {
      return;
    }

  }
getComments()
{
  this.firestore.listenToCollection(
    {
      name: "post comments",
      path: ["Posts",this.postId, "PostComments"],
      where: [new OrderBy("timestamp","asc")],
      onUpdate: (result)=>
      {
        result.docChanges().forEach(
          postCommentDoc =>{
            if(postCommentDoc.type=="added"){
              this.comments.unshift(<Comment>postCommentDoc.doc.data());
            }
          }
        );
      }
      }
    
  );
}


  onSendClick(commentInput:HTMLInputElement)
  {
    //  if(!(commentInput.value.length>0)) return;
    this.firestore.create(
      {
        path:["Posts",this.postId,"PostComments"],
        data:{
           comment:commentInput.value,
          creatorId:this.postId,
          creatorName:AppComponent.getuserDocument().publicName,
          timestamp:FirebaseTSApp.getFirestoreTimestamp()
        },
        onComplete:()=> {
          commentInput.value="";
        },
      }
    );

  }

}
export interface Comment
{
  creatorId:string;
  creatorName:string;
  comment:string;
  timestamp:firebase.default.firestore.Timestamp;
  
}
