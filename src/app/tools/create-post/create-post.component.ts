import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import {FirebaseTSFirestore} from "firebasets/firebasetsFirestore/firebaseTSFirestore";
import {FirebaseTSStorage} from "firebasets/firebasetsStorage/firebaseTSStorage";
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
selectedImageFile!: File;
auth=new FirebaseTSAuth();
firstore=new FirebaseTSFirestore();
storage=new FirebaseTSStorage();
readString1!:any;
  constructor(private dialig:MatDialogRef<CreatePostComponent>) { }

  ngOnInit(): void {
  }
  onPostClick(commentInput:HTMLTextAreaElement)
  {
    let comment=commentInput.value;
    if(comment.length<0)return;
    if(this.selectedImageFile)
    {
      this.uoloadImagePost(comment);
    }
    else
    {
      this.uploadPost(comment);
    }


  }
  uoloadImagePost(comment:string)
  {
    let postID=this.firstore.genDocId();
    this.storage.upload(
    {
      uploadName:"upload Image Post",
      path:["Posts", postID ,"image"],
      data:{
        data:this.selectedImageFile
      },onComplete:(downloadUrl: any)=>
      {
        // alert(downloadUrl);
        this.firstore.create(
          {
            path:["Posts",postID],
            data:{
              comment:comment,
              creatorId:this.auth.getAuth().currentUser?.uid,
              imageUrl:downloadUrl,
              timestamp:FirebaseTSApp.getFirestoreTimestamp()
            },
            onComplete:(docId)=> {
              this.dialig.close();

              
            },
          }
        );
      }
    }
      

      
    );
  }
  uploadPost(comment:string)
  {
    this.firstore.create(
      {
        path:["Posts"],
        data:{
          comment:comment,
          creatorId:this.auth.getAuth().currentUser?.uid,
         
          timestamp:FirebaseTSApp.getFirestoreTimestamp()
        },
        onComplete:(docId)=> {
          this.dialig.close();

          
        },
      }
    );
  }
  onPhotoSelected(photoSelector1:HTMLInputElement)
  {
this.selectedImageFile=photoSelector1.files![0];
if(!this.selectedImageFile) return;
let fileReader=new FileReader();
fileReader.readAsDataURL(this.selectedImageFile);
fileReader.addEventListener("loadend",ev=>{
  
  
   this.readString1= fileReader.result?.toString();
  let postPreviewImage= <HTMLImageElement>document.getElementById("postpreviewimage");
  
  // postPreviewImage.src!=readString1;
 
   
  console.log(fileReader.result?.toString())

  
});
  }

}
