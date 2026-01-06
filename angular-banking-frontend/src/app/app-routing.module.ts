import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CustomersComponent} from "./customers/customers.component";
import {AccountsComponent} from "./accounts/accounts.component";
import {NewCustomerComponent} from "./new-customer/new-customer.component";
import {CustomerAccountsComponent} from "./customer-accounts/customer-accounts.component";
import { HomeComponent } from './home/home.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

const routes: Routes = [
  { path :"", component: HomeComponent, pathMatch: 'full' },
  { path :"customers", component : CustomersComponent},
  { path :"accounts", component : AccountsComponent},
  { path :"accounts/:id", component : AccountDetailComponent},
  { path :"new-customer", component : NewCustomerComponent},
  { path :"customer-accounts/:id", component : CustomerAccountsComponent},
  { path :"chat", component : ChatbotComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
