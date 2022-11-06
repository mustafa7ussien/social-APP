import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.scss']
})
export class AuthenticatorComponent implements OnInit {
  state=authenticatorCompSate.Login;
  FirebasetsAuth: FirebaseTSAuth;
  constructor(private bottomSheetRef:MatBottomSheetRef) {
    this.FirebasetsAuth=new FirebaseTSAuth();
   }

  ngOnInit(): void {
  }
  onReset(resetEmail:HTMLInputElement)
  {
    let email=resetEmail.value;
    if(this.isNotEmpty(email))
    {
      this.FirebasetsAuth.sendPasswordResetEmail(
        {
          email:email,
          onComplete:(uc)=>
          {
            // alert(`reset email send to ${email}`)
            this.bottomSheetRef.dismiss();
            Swal.fire('Send Reset Password to Email ')

          },
        }
      );
    }


  }

   onLogin(loginEmail:HTMLInputElement,loginPassword:HTMLInputElement)
    {
      let email=loginEmail.value;
      let password=loginPassword.value;
      if(this.isNotEmpty(email)&&this.isNotEmpty(password))
      {
        this.FirebasetsAuth.signInWith
        (
          {
            email:email,
            password:password,
            onComplete:(uc)=>
            {
              // alert("Logged In");
              this.bottomSheetRef.dismiss();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Login Successfully',
                showConfirmButton: false,
                timer: 1500
              });
              

            },
            onFail: (err)=>
            {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err,
              
              })
            }

          }
        );

      }
      

    }
 
  onRgisterClick(
    registerEmail:HTMLInputElement,
    registerPassword:HTMLInputElement,
    registerconfirmPassword:HTMLInputElement)
  {
    let email=registerEmail.value;
    let password=registerPassword.value;
    let confirmPassword=registerconfirmPassword.value;
      
    if(this.isNotEmpty(email)&&this.isNotEmpty(password)&& this.isNotEmpty(confirmPassword)&& this.isMatch(password,confirmPassword))
    {
      this.FirebasetsAuth.createAccountWith(
        {
          email:email,
          password:password,
          onComplete:(uc)=>{
            // alert("Acount Created");
            // registerEmail.value="";
            // registerPassword.value="";
            // registerconfirmPassword.value="";

            this.bottomSheetRef.dismiss();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Acount Created Successfully',
              showConfirmButton: false,
              timer: 1500
            })

  
          },
          onFail:(err)=>{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err,
            
            })

        }
  
        }
      );
    }
   
   
  }

  isNotEmpty(text:string)
  {
    return text!=null&&text.length>0;
  }
  isMatch(text:string,comparedWith:string)
  {
    return text==comparedWith;
  }

  onforgetPasswordClick()
  {
    this.state=authenticatorCompSate.Forgot_Password;
    

  }
  onCreateAcountClick()
  {
    this.state=authenticatorCompSate.Register;
  }
  onLoginClick()
  {
    this.state=authenticatorCompSate.Login;
  }

  isLoginState()
  {
    return this.state==authenticatorCompSate.Login;
  }
  isRegisterState()
  {
    return this.state==authenticatorCompSate.Register;
  }
  isForgotPasswordState()
  {
    return this.state==authenticatorCompSate.Forgot_Password;
   
  }

  getStateText()
  {
    switch(this.state)
    {
      case authenticatorCompSate.Login:
      return "Login";
      case authenticatorCompSate.Register:
      return "Register";
      case authenticatorCompSate.Forgot_Password:
      return "Forgot_Password";
    }
  }
}

export enum authenticatorCompSate
{
  Login,
  Register,
  Forgot_Password
}
