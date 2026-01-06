import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CustomersComponent} from "./customers/customers.component";
import {AccountsComponent} from "./accounts/accounts.component";
import {NewCustomerComponent} from "./new-customer/new-customer.component";
import {CustomerAccountsComponent} from "./customer-accounts/customer-accounts.component";
import { HomeComponent } from './home/home.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path :"", component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path :"login", component: LoginComponent },
  { path :"register", component: RegisterComponent },
  { path :"profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path :"customers", component : CustomersComponent, canActivate: [AuthGuard]},
  { path :"accounts", component : AccountsComponent, canActivate: [AuthGuard]},
  { path :"accounts/:id", component : AccountDetailComponent, canActivate: [AuthGuard]},
  { path :"new-customer", component : NewCustomerComponent, canActivate: [AuthGuard]},
  { path :"customer-accounts/:id", component : CustomerAccountsComponent, canActivate: [AuthGuard]},
  { path :"chat", component : ChatbotComponent, canActivate: [AuthGuard]},
  // Fallback
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
