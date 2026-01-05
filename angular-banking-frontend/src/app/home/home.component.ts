import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {CustomerService} from "../services/customer.service";
import {AccountsService} from "../services/accounts.service";
import {Customer} from "../model/customer.model";
import {Router} from "@angular/router";
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register chart.js controllers/scales/elements (required when not using chart.js/auto)
Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  customers: Customer[] = [];
  accounts: any[] = [];
  allAccounts: any[] = [];
  allOperations: any[] = [];
  loadingCustomers = false;
  loadingAccounts = false;
  showGraphs = false;

  // Chart refs
  @ViewChild('customerGrowthCanvas', { static: false }) customerGrowthCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topAccountsCanvas', { static: false }) topAccountsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('accountTypeCanvas', { static: false }) accountTypeCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('operationTypeCanvas', { static: false }) operationTypeCanvas!: ElementRef<HTMLCanvasElement>;

  chartInstances: { [key: string]: Chart } = {};

  // Dashboard stats
  totalCustomers = 0;
  totalAccounts = 0;
  totalBalance = 0;
  recentOpsCount = 0;
  opsByType: any = {DEBIT:0, CREDIT:0, TRANSFER:0};

  constructor(private customerService: CustomerService, private accountsService: AccountsService, private router: Router) { }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadAccounts();
  }

  loadCustomers() {
    this.loadingCustomers = true;
    this.customerService.getCustomers().subscribe({
      next: data => {
        this.customers = (data || []).slice(0,3);
        this.totalCustomers = (data || []).length || 0;
        this.loadingCustomers = false;
      },
      error: err => { this.loadingCustomers = false; console.error(err); }
    });
  }

  loadAccounts() {
    this.loadingAccounts = true;
    this.accountsService.getAccounts().subscribe({
      next: data => {
        const all = (data || []);
        this.accounts = all.slice(0,3);
        this.allAccounts = all;
        console.log('Home: accounts loaded (sample):', this.allAccounts.map(a => ({ id: a.id||a.accountId, type: a.type })));
        this.totalAccounts = all.length;
        this.totalBalance = all.reduce((s: number, a: any) => s + (Number(a.balance)||0), 0);
        
        // Load operations from first account to populate operation charts
        if (all.length) {
          const first = all[0];
          const maybeId = first.id || first.accountId;
          if (maybeId) {
            const accountId = String(maybeId);
            this.accountsService.getAccount(accountId, 0, 500).subscribe({
              next: ad => {
                this.allOperations = ad.accountOperationDTOS || [];
                this.populateChartData();
                console.log('Operations loaded:', this.allOperations.length);
              },
              error: err => {
                console.warn('ops fetch failed', err);
                this.allOperations = [];
                this.populateChartData();
              }
            });
          }
        }
        
        this.loadingAccounts = false;
      },
      error: err => {
        this.loadingAccounts = false;
        console.error('Accounts load error:', err);
      }
    });
  }

  goToAllCustomers() {
    this.router.navigate(['/customers']);
  }

  goToAllAccounts() {
    this.router.navigate(['/accounts']);
  }

  openNewCustomer() {
    this.router.navigate(['/new-customer']);
  }

  openCustomerDetails(customer: Customer) {
    this.router.navigate(['/customer-accounts', customer.id], { state: customer });
  }

  openAccount(account: any) {
    const accountId = account?.id || account?.accountId || '';
    this.router.navigate(['/accounts'], { queryParams: { accountId } });
  }

  toggleGraphs() {
    this.showGraphs = !this.showGraphs;
    if (this.showGraphs) {
      console.log('Toggled graphs ON - scheduling render in 300ms');
      // Wait longer to ensure DOM is fully rendered
      setTimeout(() => this.renderCharts(), 300);
    }
  }

  populateChartData() {
    const counts: Record<string, number> = {DEBIT:0, CREDIT:0, TRANSFER:0};
    this.allOperations.forEach(o => { counts[String(o.type)] = (counts[String(o.type)] || 0) + 1; });
    this.opsByType = counts;
    this.recentOpsCount = this.allOperations.length;
  }


  renderCharts() {
    console.log('=== renderCharts called ===');
    console.log('customerGrowthCanvas:', this.customerGrowthCanvas);
    console.log('Data available - Accounts:', this.allAccounts?.length || 0, 'Operations:', this.allOperations?.length || 0);
    
    this.renderCustomerGrowthChart();
    this.renderTopAccountsChart();
    this.renderAccountTypeChart();
    this.renderOperationTypeChart();
  }

  renderCustomerGrowthChart() {
    console.log('renderCustomerGrowthChart - canvas:', this.customerGrowthCanvas?.nativeElement);
    if (!this.customerGrowthCanvas) {
      console.error('customerGrowthCanvas ref not available!');
      return;
    }
    const ctx = this.customerGrowthCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2d context from customerGrowthCanvas');
      return;
    }

    const monthCounts: {[key: string]: number} = {};
    this.allAccounts.forEach(acc => {
      const date = new Date(acc.createdAt || new Date());
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    const labels = Object.keys(monthCounts).sort();
    const data = labels.map(m => monthCounts[m]);

    if (this.chartInstances['customerGrowth']) {
      this.chartInstances['customerGrowth'].destroy();
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Customers (from accounts)',
          data,
          borderColor: 'var(--banking-brand)',
          backgroundColor: 'rgba(13,110,253,0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: 'var(--banking-brand)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } }
      }
    };

    this.chartInstances['customerGrowth'] = new Chart(ctx, config);
    console.log('✅ Customer Growth chart rendered with data:', { labels, dataPoints: data.length });
  }

  renderTopAccountsChart() {
    console.log('renderTopAccountsChart - canvas:', this.topAccountsCanvas?.nativeElement);
    if (!this.topAccountsCanvas) {
      console.error('topAccountsCanvas ref not available!');
      return;
    }
    const ctx = this.topAccountsCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2d context from topAccountsCanvas');
      return;
    }

    const sorted = [...this.allAccounts].sort((a, b) => (Number(b.balance) || 0) - (Number(a.balance) || 0)).slice(0, 8);
    const labels = sorted.map(a => `${a.type} ${(a.id || a.accountId) || 'N/A'}`).slice(0, 8);
    const data = sorted.map(a => Number(a.balance) || 0);

    if (this.chartInstances['topAccounts']) {
      this.chartInstances['topAccounts'].destroy();
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Balance',
          data,
          backgroundColor: 'rgba(13,110,253,0.7)',
          borderColor: 'var(--banking-brand)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } }
      }
    };

    this.chartInstances['topAccounts'] = new Chart(ctx, config);
    console.log('✅ Top Accounts chart rendered with data:', { topAccounts: data.length });
  }

  renderAccountTypeChart() {
    console.log('renderAccountTypeChart - canvas:', this.accountTypeCanvas?.nativeElement);
    if (!this.accountTypeCanvas) {
      console.error('accountTypeCanvas ref not available!');
      return;
    }
    const ctx = this.accountTypeCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2d context from accountTypeCanvas');
      return;
    }

    const typeCounts: {[key: string]: number} = {};
    this.allAccounts.forEach(a => {
      const type = a.type || 'UNKNOWN';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const labels = Object.keys(typeCounts);
    const data = labels.map(t => typeCounts[t]);

    if (this.chartInstances['accountType']) {
      this.chartInstances['accountType'].destroy();
    }

    const colors = ['rgba(13,110,253,0.8)', 'rgba(13,110,253,0.6)', 'rgba(13,110,253,0.4)'];

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    };

    this.chartInstances['accountType'] = new Chart(ctx, config);
    console.log('✅ Account Type chart rendered with data:', { types: data.length });
  }

  renderOperationTypeChart() {
    console.log('renderOperationTypeChart - canvas:', this.operationTypeCanvas?.nativeElement);
    if (!this.operationTypeCanvas) {
      console.error('operationTypeCanvas ref not available!');
      return;
    }
    const ctx = this.operationTypeCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2d context from operationTypeCanvas');
      return;
    }

    const counts: Record<string, number> = {DEBIT:0, CREDIT:0, TRANSFER:0};
    this.allOperations.forEach(o => { counts[String(o.type)] = (counts[String(o.type)] || 0) + 1; });

    const labels = Object.keys(counts);
    const data = labels.map(l => counts[l]);

    if (this.chartInstances['operationType']) {
      this.chartInstances['operationType'].destroy();
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Count',
          data,
          backgroundColor: 'rgba(13,110,253,0.7)',
          borderColor: 'var(--banking-brand)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        plugins: { legend: { display: false } }
      }
    };

    this.chartInstances['operationType'] = new Chart(ctx, config);
    console.log('✅ Operation Type chart rendered with data:', { operations: data.length });
  }
}
