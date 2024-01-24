import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
// import { UsersreguardsComponent } from './components/usersreguards/usersreguards.component';
import { AuthenticationGuard } from './auth.guard';
import { AcessGuard } from './access.guard';
import { UsersComponent } from './components/users/users.component';
// import { UserResguardsComponent } from './components/user-resguards/user-resguards.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { InfoguardComponent } from './components/infoguard/infoguard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ReguardsComponent } from './components/resguards/reguards.component';
import { UserResguardsComponent } from './components/useresguards/user-resguards.component';
import { GroupsComponent } from './components/groups/groups.component';
import { TypesguardsComponent } from './components/typesguards/typesguards.component';
import { SignatureComponent } from './components/signature/signature.component';
import { StatesComponent } from './components/states/states.component';

const routes: Routes = [
  {path:"",component:LoginComponent,
  canActivate:[AuthenticationGuard]

},
{
  path:"",component:NavbarComponent,
  canActivate:[AcessGuard],
  children:[
  {
    path: 'Resguardos',
        pathMatch: 'full',
        component:ReguardsComponent
  },
  {
    path: 'Ticket',
        component:TicketComponent
  },
  
  {
    path:'Usuarios',
    pathMatch: 'full',
    component:UsersComponent
  },
  {
    path:'ResguardosUsuarios/:id',
    component:UserResguardsComponent
  },
  {
    path:'TiposResguardos',
    component:TypesguardsComponent
  },
  {
    path:'Estados',
    component:StatesComponent
  },
  {
    path:'Firma',
    component:SignatureComponent
  },
  ]

},
{
  path:'Informacion/:id',
  component:InfoguardComponent
}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
