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
    this.userService.getAllUsers().subscribe((res) => {

      this.userList = res;
    })
  }
  setFormState() {
    this.userForm = this.fb.group({

      id: [0],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      age: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      status: [false, [Validators.required]]

    });
  }
  formValues: any;
  onSubmit() {
    console.log(this.userForm.value);
    if (this.userForm.invalid) {
      alert('Please Fill All Fields');
      return;
    }
    if (this.userForm.value.id == 0) {
      this.formValues = this.userForm.value;
      this.userService.addUser(this.formValues).subscribe((res) => {

        alert('User Added Successfully');
        this.getUsers();
        this.userForm.reset();
        this.closeModal();

      });
    } else {
      this.formValues = this.userForm.value;
      this.userService.updateUser(this.formValues).subscribe((res) => {

        alert('User Updated Successfully');
        this.getUsers();
        this.userForm.reset();
        this.closeModal();

      });
    }

  }


  OnEdit(User: User) {
    this.openModal();
    this.userForm.patchValue(User);
  }
  onDelete(user: User) {
    const isConfirm = confirm("Are you sure you want to delete this User " + user.name);
    if (isConfirm) {
      this.userService.deleteUser(user.id).subscribe((res) => {
        alert("User Deleted Successfully");
        this.getUsers();
      });
    }



  }
}
