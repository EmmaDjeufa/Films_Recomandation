//user.service.ts
import {
  Injectable
} from '@angular/core';


import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';


import {
  AuthService
} from './auth.service';


import {
  environment
} from '../../environments/environment';



@Injectable({

providedIn:'root'

})


export class UserService {



private apiUrl =
`${environment.apiUrl}/users`;





constructor(

private http:HttpClient,

private auth:AuthService

){}





private headers(){


return {

headers:new HttpHeaders({

Authorization:

`Bearer ${this.auth.getToken()}`

})

};


}








// ===================================
// PROFIL COMPLET
// ===================================


getProfile(){


return this.http.get<any>(

`${this.apiUrl}/me`,

this.headers()

);


}









// ===================================
// UPDATE PROFIL PHOTO
// ===================================


updateProfile(

formData:FormData

){


return this.http.put<any>(

`${this.apiUrl}/profile`,

formData,

this.headers()

);


}









// ===================================
// THEMES
// ===================================


updateThemes(

themeIds:number[]

){


return this.http.put<any>(

`${this.apiUrl}/themes`,

{

themeIds

},

this.headers()

);


}









// ===================================
// PASSWORD
// ===================================


updatePassword(

password:string

){


return this.http.put<any>(

`${this.apiUrl}/password`,

{

password

},

this.headers()

);


}









// ===================================
// USERS COMPATIBLES
// ===================================


getAllUsers(

limit:number=20,

offset:number=0

){


return this.http.get<any[]>(

`${this.apiUrl}/all?limit=${limit}&offset=${offset}`,

this.headers()

);


}









// ===================================
// PROFIL PUBLIC
// ===================================


getUserById(

id:number

){


return this.http.get<any>(

`${this.apiUrl}/${id}`,

this.headers()

);


}



}