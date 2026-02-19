import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../Models/user';
import { UserService } from '../../Services/user.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  @ViewChild('myModal') model: ElementRef | undefined;
  userList: User[] = [];
  userService = inject(UserService);
  userForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    this.setFormState();
    this.getUsers();
  }
  openModal() {
    const userModal = document.getElementById('myModal');
    if (userModal != null) {
      userModal.style.display = 'block';
    }
  }

  closeModal() {
    this.setFormState();
    if (this.model != null) {
      this.model.nativeElement.style.display = 'none';
    }

  }
  getUsers() {
    this.userService.getUsers().subscribe((res) => {
      this.userList = res;
    })
  }
  setFormState() {
    this.userForm = this.fb.group({

      id: [0],
      userName: ['', [Validators.required]],
      userPass: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobileNo: ['', [Validators.required]],
      age: ['', [Validators.required]],
      address: ['', [Validators.required]],
      hasPayment: [false]

    });
  }
  formValues: any;
  onSubmit() {
    console.log(this.userForm.value);
    if (this.userForm.invalid) {
      alert('Please Fill All Fields');
      return;
    }

    // Convert boolean hasPayment to number for API
    this.formValues = { ...this.userForm.value, hasPayment: this.userForm.value.hasPayment ? 1 : 0 };

    if (this.userForm.value.id == 0) {
      this.userService.addUser(this.formValues).subscribe((res) => {

        alert('User Added Successfully');
        this.getUsers();
        this.userForm.reset();
        this.closeModal();

      });
    } else {
      this.userService.updateUser(this.formValues.id, this.formValues).subscribe((res) => {
        alert('User Updated Successfully');
        this.getUsers();
        this.userForm.reset();
        this.closeModal();

      });
    }

  }


  OnEdit(User: User) {
    this.openModal();
    // Convert number hasPayment back to boolean for checkbox
    const patchValue = { ...User, hasPayment: User.hasPayment === 1 };
    this.userForm.patchValue(patchValue);
  }
  onDelete(user: User) {
    const isConfirm = confirm("Are you sure you want to delete this User " + user.userName);
    if (isConfirm) {
      this.userService.deleteUser(user.id).subscribe((res) => {
        alert("User Deleted Successfully");
        this.getUsers();
      });
    }



  }
}
