import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';
import {FirebaseTSFirestore} from "firebasets/firebasetsFirestore/firebaseTSFirestore";
import Swal from "sweetalert2";






@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  
  title = 'socialAPP';
 public auth=new FirebaseTSAuth();
 public firstore=new FirebaseTSFirestore();
  userHasProfile=true;
  public static userdocument:UserDocument;
  // isLoggedIn=false;
  
  constructor(private loginSheet:MatBottomSheet,private router:Router)
  {this.auth.listenToSignInStateChanges
    (
      user =>
      {
        this.getUserProfile();
        this.auth.checkSignInState(
          {
            whenSignedIn:user=>
            {this.getUserProfile();
              // alert("Logged In");

            },
            whenSignedOut(user) {
              // alert("Logged Out");
                AppComponent.userdocument!=null;
              
            },
            whenSignedInAndEmailNotVerified(user) {
              router.navigate(["emailVerification"]);
              
              
              
            },
            whenSignedInAndEmailVerified() {
              getUserProfile();
              
              
              
              
              
            },
            whenChanged(user) {
              
            },
            
            
          }
        )
        
      }
      

    );}
    
    
    showsweetalert() {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
      })
       
    }

    public static getuserDocument()
    {
      return AppComponent.userdocument;
    }
    getUserName()    {
      
      
        // return AppComponent.userdocument.publicName;
      
        try
        {
          return AppComponent.userdocument.publicName;
        }
        catch(err)
        {
   return;
        }

    }

    getUserProfile()
    {
      this.firstore.listenToDocument(
        {
          name:"Get document",
          path:["User",this.auth.getAuth().currentUser?.uid||"{}"],
          onUpdate:(result)=>
          {AppComponent.userdocument=<UserDocument>result.data();
            this.userHasProfile=result.exists;
            AppComponent.userdocument.userId!=this.auth.getAuth().currentUser?.uid;
            if(this.userHasProfile&&this.auth.getAuth().currentUser?.emailVerified)
            {
              this.router.navigate(["postfeed"]);
            }
           
  
          }
        }
      );
    }

  



  logeedIn()
  {
    return this.auth.isSignedIn();
  }
 
  onLoginClick()
  {
    this.loginSheet.open(AuthenticatorComponent);

  }
  onLogoutClick()
  {
    this.auth.signOut();
  }
}
export interface UserDocument
{
  publicName:string,
  description1:string,
  userId:string;
}


function getUserProfile(this: any) {
  // throw new Error('Function not implemented.');
  this.firstore.listenToDocument(
    {
      name:"Get document",
      path:["User",this.auth.getAuth().currentUser?.uid||"{}"],
      onUpdate:(result: { exists: any; })=>
      {
        this.userHasProfile=result.exists;
        if(this.userHasProfile)
        {
          // this.router.navigate(["postfeed"]);
        }

      }
    }
  );
}

