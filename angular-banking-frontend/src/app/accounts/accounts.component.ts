import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountsService} from "../services/accounts.service";
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accountFormGroup! : FormGroup;
  accounts: Array<any> = [];
  loadingAccounts = false;
  errorMessage!: string;

  constructor(private fb : FormBuilder, private accountService : AccountsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.accountFormGroup=this.fb.group({
      accountId : this.fb.control('')
    });

    // Auto-search via query params — navigate to detail page if provided
    this.route.queryParams.subscribe(params => {
      const accountId = params['accountId'];
      if (accountId) {
        this.router.navigate(['/accounts', accountId]);
      }
    });

    // Load accounts list for quick access
    this.loadAccounts();
  }

  loadAccounts() {
    this.loadingAccounts = true;
    this.accountService.getAccounts().subscribe({
      next: data => {
        this.accounts = (data || []).slice(0, 10);
        console.log('Accounts page: loaded accounts types:', this.accounts.map(a => ({ id: a.id||a.accountId, type: a.type })));
        this.loadingAccounts = false;
      },
      error: err => { this.loadingAccounts = false; console.error(err); }
    });
  }

  openAccount(a: any) {
    const id = a.id || a.accountId || '';
    this.router.navigate(['/accounts', id]);
  }

  handleSearchAccount() {
    const accountId: string = this.accountFormGroup.value.accountId;
    if (accountId && accountId.trim()) {
      this.router.navigate(['/accounts', accountId.trim()]);
    }
  }
}
