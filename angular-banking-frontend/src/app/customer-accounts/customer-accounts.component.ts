import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Customer} from "../model/customer.model";
import {CustomerService} from "../services/customer.service";
import {AccountsService} from "../services/accounts.service";

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  styleUrls: ['./customer-accounts.component.css']
})
export class CustomerAccountsComponent implements OnInit {
  customerId! : number ;
  customer! : Customer | null;
  accounts: any[] = [];
  loading = false;

  constructor(private route : ActivatedRoute, private router :Router, private customerService: CustomerService, private accountsService: AccountsService) {
    // Try to read navigation state first
    this.customer = this.router.getCurrentNavigation()?.extras.state as Customer | null;
  }

  ngOnInit(): void {
    this.customerId = +this.route.snapshot.params['id'];
    if (!this.customer) {
      // fetch customer details
      this.customerService.getCustomer(this.customerId).subscribe({
        next: c => this.customer = c,
        error: err => console.error(err)
      });
    }

    // fetch accounts and filter by customer id
    this.loading = true;
    this.accountsService.getAccounts().subscribe({
      next: data => {
        this.accounts = (data || []).filter(a => a.customerDTO && a.customerDTO.id === this.customerId);
        this.loading = false;
      },
      error: err => { this.loading = false; console.error(err); }
    });
  }

  backToList() { this.router.navigate(['/customers']); }

  openAccount(a: any) { const accountId = a.id || a.accountId || ''; this.router.navigate(['/accounts'], { queryParams: { accountId } }); }
}
