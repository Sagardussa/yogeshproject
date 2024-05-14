import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { state } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { json } from 'stream/consumers';
import { CustomerService } from '../customer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customerslist',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule, FormsModule],

  templateUrl: './customerslist.component.html',
  styleUrl: './customerslist.component.css',
})
export class CustomerslistComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  selectedUser: any;
  panIsValid: boolean = false;

  city!: { id: number; name: string }[];
  state!: { id: number; name: string }[];
  customerlist: any[] = [];
  editForm!: FormGroup;
  customerId: number = 0;

  customerform!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private modalService: NgbModal
  ) {
    this.customerform = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      fullName: ['', [Validators.required, Validators.maxLength(140)]],
      panNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/),
          Validators.maxLength(10),
        ],
      ],
      mobile: [
        '+91',
        [
          Validators.required,
          Validators.pattern(/^\+91[0-9]{10}$/),
          Validators.maxLength(13),
        ],
      ],
      addressLine1: ['', [Validators.required, Validators.maxLength(10)]],
      addressLine2: [''],
      state: [''],
      city: [''],
      id: [1],
      postcode: [, [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });

    this.activatedRoute.params.subscribe((res: any) => {
      if (res.id) {
        this.customerId = res.id;
      }
    });
  }

  ngOnInit(): void {
    const localData = localStorage.getItem('customers');

    if (localData !== null) {
      this.customerlist = JSON.parse(localData);
      if (this.customerId !== 0) {
        const currentRecord = this.customerlist.find(
          (data) => data.id == this.customerId
        );

        if (currentRecord != undefined) {
          this.customerform.patchValue({
            email: currentRecord.email,
            fullName: currentRecord.fullName,
            panNumber: currentRecord.panNumber,
            mobile: currentRecord.mobile,
            addressLine1: currentRecord.addressLine1,
            addressLine2: currentRecord.addressLine2,
            state: currentRecord.state,
            city: currentRecord.city,
            postcode: currentRecord.postcode,
          });
        }
      }
    }

    // let customerlist: any = localStorage.getItem('customers');
    // this.customerlist = customerlist && JSON.parse(customerlist);
    // console.log(this.customerlist);
  }

  // saveCustomer(customerlist: any) {
  //   this.customerlist.push(customerlist);

  //   localStorage.setItem('customers', JSON.stringify(this.customerlist));

  //   this.customerlist = this.customerlist.slice();
  // }

  AddCustomer() {
    const formData = this.customerform.value;

    const localData = localStorage.getItem('customers');

    if (localData == null) {
      this.customerlist.push(formData);
      localStorage.setItem('customers', JSON.stringify(this.customerlist));
      this.customerform.reset();
    } else {
      const parseData = JSON.parse(localData);
      this.customerform.value.id = parseData.length + 1;
      this.customerlist.push(formData);
      localStorage.setItem('customers', JSON.stringify(this.customerlist));
      this.customerform.reset();
    }

    // const formData = this.customerform.value;
    // const existingCustomerIndex = this.customerlist.findIndex(
    //   (cust: { panNumber: any }) => cust.panNumber === formData.panNumber
    // );
    // console.log('existingCustomerIndex', existingCustomerIndex);

    // if (existingCustomerIndex !== -1) {
    //   this.customerlist[existingCustomerIndex] = formData;
    // } else {
    // this.customerlist.push({
    //   id: Math.random().toString(36).substr(2, 9),
    //   ...formData,
    // });

    // localStorage.setItem('customers', JSON.stringify(this.customerlist));
    // this.customerlist = this.customerlist.slice();
    this.modalService.dismissAll('Save click');
    // this.customerform.reset();
    this.router.navigate(['Customershow']);
  }

  updateCustomer() {
    // const currentRecord = this.customerlist.find(
    //   (data) => data.id == this.customerId
    // );

    const index = this.customerlist.findIndex(
      (data) => data.id == this.customerId
    );

    this.customerlist.splice(index, 1);

    const formData = this.customerform.value;
    const localData = localStorage.getItem('customers');

    if (localData == null) {
      this.customerlist.push(formData);
      localStorage.setItem('customers', JSON.stringify(this.customerlist));
      this.router.navigate(['Customershow']);
    } else {
      // const parseData = JSON.parse(localData);
      this.customerform.value.id = index + 1;
      this.customerlist.push(formData);
      localStorage.setItem('customers', JSON.stringify(this.customerlist));
      this.router.navigate(['Customershow']);
    }

    // this.customerlist.push(formData);
    // localStorage.setItem('customers', JSON.stringify(this.customerlist));
    // this.router.navigate(['Customershow']);
  }

  AddValidPan() {
    let panNumber = { panNumber: this.customerform.value.panNumber };
    if (panNumber) {
      this.customerService.postValidPan(panNumber).subscribe((data) => {
        // this.customerform.value.fullName = data?.fullName;
        console.log('data', data.isValid);
        this.panIsValid = data.isValid;
        this.customerform.patchValue({
          fullName: data?.fullName,
        });
      });
    }
    this.panIsValid = false;
  }

  AddValidPostCode() {
    let postcode = { postcode: this.customerform.value.postcode };
    this.customerService.postValidPostCode(postcode).subscribe(
      (response) => {
        console.log('res', response);

        if (response.status === 'Success') {
          // console.log('response.city[0].name ==>', response.city[0].name);
          if (response.city[0].name && response.state[0].name) {
            this.customerform.patchValue({
              city: response.city[0].name,
              state: response.state[0].name,
            });
          }
        }
      },
      (error) => {
        console.error('Error fetching postcode details:', error);
      }
    );
  }

  // deleteCustomerDetails(index: number) {
  //   console.log('deleteCustomerDetails', index);

  //   this.customerlist.splice(index, 1);

  //   localStorage.setItem('customers', JSON.stringify(this.customerlist));

  //   this.customerlist = this.customerlist.slice();
  // }

  openEditModal(user: any) {
    this.selectedUser = user;
    this.editForm.patchValue({
      fullName: user.fullName,
      email: user.email,
    });
    this.modalService
      .open(this.selectedUser, { ariaLabelledBy: 'editModalLabel' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  // editUser() {
  //   const editedData = this.editForm.value;

  //   console.log('Edited User Data:', editedData);

  //   this.modalService.dismissAll('Edit click');
  // }
}
