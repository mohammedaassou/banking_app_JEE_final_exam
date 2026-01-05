import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AccountsService} from "../services/accounts.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountDetails, BankAccountDTO} from "../model/account.model";
import {catchError, throwError} from "rxjs";

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  accountId!: string;
  accountMeta: BankAccountDTO | null = null;
  accountDetails: AccountDetails | null = null;
  errorMessage!: string;
  loading = false;

  pageSize = 5;
  currentPage = 0;

  // operations list for scrollable sidebar
  opsList: Array<any> = [];
  pageSizeLarge = 200;
  nextPageToLoad = 0;
  hasMoreOps = false;
  loadingMore = false;

  operationForm!: FormGroup;
  isSubmitting = false;
  savedMessage: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private accountsService: AccountsService, private fb: FormBuilder) { }

  get opType() { return this.operationForm.get('operationType')?.value; }
  ngOnInit(): void {
    this.accountId = this.route.snapshot.params['id'];
    this.operationForm = this.fb.group({
      operationType: this.fb.control(null, Validators.required),
      amount: this.fb.control(0, [Validators.required, Validators.min(0.01)]),
      description: this.fb.control(null),
      accountDestination: this.fb.control(null)
    });

    this.loadAccountMeta();
    this.loadOperationsScroll(0);
  }

  loadAccountMeta() {
    this.accountsService.getBankAccount(this.accountId).subscribe({
      next: data => this.accountMeta = data,
      error: err => { this.errorMessage = err.message; console.error(err); }
    });
  }

  loadOperations(page: number) {
    // kept for backward compatibility (not used by scroll view)
    this.loading = true;
    this.currentPage = page;
    this.accountsService.getAccount(this.accountId, page, this.pageSize).pipe(
      catchError(err => { this.errorMessage = err.message; this.loading = false; return throwError(err); })
    ).subscribe({
      next: data => { this.accountDetails = data; this.loading = false; },
      error: err => { this.loading = false; }
    });
  }

  /**
   * Load operations for the scrollable sidebar. By default requests a large page to fill the scroll.
   */
  loadOperationsScroll(page: number, size: number = this.pageSizeLarge, append: boolean = false) {
    this.loading = true;
    this.nextPageToLoad = page + 1;
    this.accountsService.getAccount(this.accountId, page, size).pipe(
      catchError(err => { this.errorMessage = err.message; this.loading = false; return throwError(err); })
    ).subscribe({
      next: data => {
        this.accountDetails = data;
        if (append) {
          this.opsList = this.opsList.concat(data.accountOperationDTOS || []);
        } else {
          this.opsList = data.accountOperationDTOS || [];
        }
        this.hasMoreOps = (data.totalPages || 0) > this.nextPageToLoad;
        this.loading = false; this.loadingMore = false;
      },
      error: err => { this.loading = false; this.loadingMore = false; }
    });
  }

  loadMoreOps() {
    if (this.loadingMore) return;
    this.loadingMore = true;
    this.loadOperationsScroll(this.nextPageToLoad, this.pageSizeLarge, true);
  }

  handleOperation() {
    if (this.operationForm.invalid) { this.operationForm.markAllAsTouched(); return; }
    const op = this.operationForm.value;
    this.isSubmitting = true;
    const type = op.operationType;
    if (type === 'DEBIT') {
      this.accountsService.debit(this.accountId, op.amount, op.description).subscribe({ next: () => this.onOpSuccess(), error: err => this.onOpError(err) });
    } else if (type === 'CREDIT') {
      this.accountsService.credit(this.accountId, op.amount, op.description).subscribe({ next: () => this.onOpSuccess(), error: err => this.onOpError(err) });
    } else if (type === 'TRANSFER') {
      this.accountsService.transfer(this.accountId, op.accountDestination, op.amount, op.description).subscribe({ next: () => this.onOpSuccess(), error: err => this.onOpError(err) });
    }
  }

  private onOpSuccess() {
    this.isSubmitting = false;
    this.operationForm.reset();
    this.savedMessage = 'Operation created successfully!';
    setTimeout(() => this.savedMessage = null, 2500);
    this.loadAccountMeta();
    this.loadOperationsScroll(0);
  }
  private onOpError(err: any) {
    this.isSubmitting = false;
    console.error(err);
    this.errorMessage = err?.message || 'Operation failed';
  }

  back() { this.router.navigateByUrl('/accounts'); }
}
