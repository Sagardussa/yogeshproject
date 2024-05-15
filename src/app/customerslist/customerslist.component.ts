import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  toastrService = inject(ToastrService);

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
  }

  AddCustomer() {
    const formData = this.customerform.value;

    const localData = localStorage.getItem('customers');

    if (localData == null) {
      this.customerlist.push(formData);
      localStorage.setItem('customers', JSON.stringify(this.customerlist));
      this.customerform.reset();
      setTimeout(() => {
        this.router.navigate(['Customershow']);
      }, 1000);
    } else {
      const parseData = JSON.parse(localData);
      this.customerform.value.id = parseData.length + 1;
      this.customerlist.push(formData);
      localStorage.setItem('customers', JSON.stringify(this.customerlist));
      this.customerform.reset();
      this.toastrService.success('Added completed successfully!', 'Success');
      setTimeout(() => {
        this.router.navigate(['Customershow']);
      }, 1000);
    }
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
      this.toastrService.success('updated completed successfully!', 'Success');
      setTimeout(() => {
        this.router.navigate(['Customershow']);
      }, 1000);
    } else {
      // const parseData = JSON.parse(localData);
      this.customerform.value.id = index + 1;
      this.customerlist.push(formData);
      localStorage.setItem('customers', JSON.stringify(this.customerlist));
      this.toastrService.success('updated completed successfully!', 'Success');
      setTimeout(() => {
        this.router.navigate(['Customershow']);
      }, 1000);
    }
  }

  AddValidPan() {
    let panNumber = { panNumber: this.customerform.value.panNumber };
    if (panNumber) {
      this.customerService.postValidPan(panNumber).subscribe((data) => {
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

  // openEditModal(user: any) {
  //   this.selectedUser = user;
  //   this.editForm.patchValue({
  //     fullName: user.fullName,
  //     email: user.email,
  //   });
  //   this.modalService
  //     .open(this.selectedUser, { ariaLabelledBy: 'editModalLabel' })
  //     .result.then(
  //       (result) => {},
  //       (reason) => {}
  //     );
  // }
}
