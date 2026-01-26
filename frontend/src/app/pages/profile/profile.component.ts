import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/user.service';
import { AuthService } from '../../core/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  fileToUpload: File | null = null;
  themes: number[] = [1,2,3,4,5]; // exemple
  message = '';

  constructor(private fb: FormBuilder, private userService: UserService, public auth: AuthService) {
    this.profileForm = this.fb.group({
      name: [''],
      password: [''],
      photo: [null]
    });
  }

  ngOnInit() {
    const user = this.auth.currentUser.value;
    this.profileForm.patchValue({ name: user.name });
  }

  onFileChange(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  saveProfile() {
    const formData = new FormData();
    formData.append('name', this.profileForm.value.name);
    if(this.profileForm.value.password) formData.append('password', this.profileForm.value.password);
    if(this.fileToUpload) formData.append('photo', this.fileToUpload);

    this.userService.updateProfile(formData).subscribe({
      next: (res: any) => this.message = res.message,
      error: (err) => this.message = err.error.message
    });
  }

  saveThemes() {
    this.userService.updateThemes(this.themes).subscribe({
      next: res => this.message = 'Thèmes mis à jour',
      error: err => this.message = err.error.message
    });
  }
}
