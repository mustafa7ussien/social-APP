import { Component, Input, OnInit } from '@angular/core';
import {FirebaseTSFirestore} from "firebasets/firebasetsFirestore/firebaseTSFirestore";
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input()  show!: boolean;
  firstore: FirebaseTSFirestore;
  auth:FirebaseTSAuth;

  constructor(private router:Router) { 
    this.auth=new FirebaseTSAuth();
    this.firstore=new FirebaseTSFirestore();
    
  }

  ngOnInit(): void {
  }
  onContinueClick(nameInput:HTMLInputElement,descriptionInput1:HTMLTextAreaElement)
  {
    let name=nameInput.value;
    let description=descriptionInput1.value;
    this.firstore.create(
      {
        path:["User",this.auth.getAuth().currentUser?.uid||'{}'],
        data:{
          publicName:name,
          description1:description
        },
        onComplete:(docId)=> {
          
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Profile Created Successfully',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate([""]);
          
         
          // nameInput.value=name;
          // descriptionInput1.value=description;   


          
        },
        onFail(err) {
          alert(err);
          
        },
      }
    );
  }

}
