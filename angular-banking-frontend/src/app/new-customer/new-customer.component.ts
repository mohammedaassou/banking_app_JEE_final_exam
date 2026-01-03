import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../model/customer.model";
import {CustomerService} from "../services/customer.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {
  newCustomerFormGroup! : FormGroup;
  isSubmitting = false;
  savedMessage: string | null = null;

  constructor(private fb : FormBuilder, private customerService:CustomerService, private router:Router) { }

  ngOnInit(): void {
    this.newCustomerFormGroup=this.fb.group({
      name : this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      email : this.fb.control(null,[Validators.required, Validators.email])
    });
  }

  get name() { return this.newCustomerFormGroup.get('name')!; }
  get email() { return this.newCustomerFormGroup.get('email')!; }

  handleSaveCustomer() {
    if (this.newCustomerFormGroup.invalid) {
      this.newCustomerFormGroup.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }
    this.isSubmitting = true;
    const customer:Customer=this.newCustomerFormGroup.value;
    this.customerService.saveCustomer(customer).subscribe({
      next : data=>{
        this.isSubmitting = false;
        this.savedMessage = 'Customer has been successfully saved!';
        setTimeout(()=> this.router.navigateByUrl('/customers'), 800);
      },
      error : err => {
        this.isSubmitting = false;
        this.savedMessage = 'An error occurred while saving. Please try again.';
        console.error(err);
      }
    });
  }

  private focusFirstInvalid() {
    const firstInvalid = document.querySelector('.form-control.ng-invalid') as HTMLElement | null;
    if (firstInvalid) { firstInvalid.focus(); }
  }
}
