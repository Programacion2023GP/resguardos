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
import { ChangebackgroundimageComponent } from './components/changebackgroundimage/changebackgroundimage.component';
import { ChartsComponent } from './components/charts/charts.component';
import { KorimaComponent } from './components/korima/korima.component';
import { ArchivistComponent } from './components/archivist/archivist.component';
import { ReportgroupsguardsComponent } from './components/reportgroupsguards/reportgroupsguards.component';
import { ReportkorimaComponent } from './components/reportkorima/reportkorima.component';
import { StockComponent } from './components/stock/stock.component';
import { StocklistComponent } from './components/stocklist/stocklist.component';
import { ReportdepartamentkorimaComponent } from './components/reportdepartamentkorima/reportdepartamentkorima.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [AuthenticationGuard] },
  {
    path: '',
    component: NavbarComponent,
    canActivate: [AcessGuard],
    children: [
      {
        path: 'Resguardos',
        pathMatch: 'full',
        component: ReguardsComponent,
      },
      {
        path: 'Ticket',
        component: TicketComponent,
      },

      {
        path: 'Usuarios',
        pathMatch: 'full',
        component: UsersComponent,
      },
      {
        path: 'Reportedepartamentos',
        pathMatch: 'full',
        component: ReportgroupsguardsComponent,
      },
      {
        path: 'ReporteKorima',
        pathMatch: 'full',
        component: ReportkorimaComponent,
      },
      {
        path: 'ReporteKorimaDepartamento',
        pathMatch: 'full',
        component: ReportdepartamentkorimaComponent,
      },
      {
        path: 'Graficas',
        pathMatch: 'full',
        component: ChartsComponent,
      },
      {
        path: 'ResguardosUsuarios/:id',
        component: UserResguardsComponent,
      },
      {
        path: 'TiposResguardos',
        component: TypesguardsComponent,
      },
      {
        path: 'Estados',
        component: StatesComponent,
      },
      {
        path: 'Plantilla',
        component: ChangebackgroundimageComponent,
      },
      {
        path: 'Firma',
        component: SignatureComponent,
      },
      {
        path: 'Korima',
        component: KorimaComponent,
      },
      {
        path: 'Korima/:id',
        component: KorimaComponent,
      },
      {
        path: 'Archivos',
        component: ArchivistComponent,
      },
      {
        path: 'Stock',
        component: StockComponent,
      },
      {
        path: 'StockList',
        component: StocklistComponent,
      },
    ],
  },
  {
    path: 'Informacion/:id',
    component: InfoguardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
