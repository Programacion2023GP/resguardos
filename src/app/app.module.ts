import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { StyleClassModule } from 'primeng/styleclass';
import { DialogModule } from 'primeng/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpeedDialModule } from 'primeng/speeddial';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SplitterModule } from 'primeng/splitter';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { UsersComponent } from './components/users/users.component';
import { DropdownModule } from 'primeng/dropdown';
import { TicketComponent } from './components/ticket/ticket.component';
import { QRCodeModule } from 'angularx-qrcode';
import { InfoguardComponent } from './components/infoguard/infoguard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ReguardsComponent } from './components/resguards/reguards.component';
import { UserResguardsComponent } from './components/useresguards/user-resguards.component';
import { UserprintresguardsactiveComponent } from './components/userprintresguardsactive/userprintresguardsactive.component';
import { DialogService } from 'primeng/dynamicdialog';
import { DatePipe } from '@angular/common';
import { GroupsComponent } from './components/groups/groups.component';
import { NgxPrintModule } from 'ngx-print';
import { TypesguardsComponent } from './components/typesguards/typesguards.component';
import { SignatureComponent } from './components/signature/signature.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { StatesComponent } from './components/states/states.component';
import { PickListModule } from 'primeng/picklist';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { UnsuscribeguardsComponent } from './componets/unsuscribeguards/unsuscribeguards.component';
import { ReportresguardsComponent } from './components/reportresguards/reportresguards.component';
import { ReportceticComponent } from './components/reportcetic/reportcetic.component';
import { ChangebackgroundimageComponent } from './components/changebackgroundimage/changebackgroundimage.component';
import { ChartsComponent } from './components/charts/charts.component';
import { KorimaComponent } from './components/korima/korima.component';
import { HttpClientModule } from '@angular/common/http';
import { PicturesComponent } from './components/pictures/pictures.component';
import { ArchivistComponent } from './components/archivist/archivist.component';
import { AutorizeddownsComponent } from './components/autorizeddowns/autorizeddowns.component';
import { ReportgroupsguardsComponent } from './components/reportgroupsguards/reportgroupsguards.component';
import { ReportkorimaComponent } from './components/reportkorima/reportkorima.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { StockComponent } from './components/stock/stock.component';
import { StocklistComponent } from './components/stocklist/stocklist.component';
import { ReportdepartamentkorimaComponent } from './components/reportdepartamentkorima/reportdepartamentkorima.component';

@NgModule({
  declarations: [
    AppComponent,
    PicturesComponent,
    NavbarComponent,
    LoginComponent,
    UsersComponent,
    TicketComponent,
    InfoguardComponent,
    ReguardsComponent,
    UserResguardsComponent,
    UserprintresguardsactiveComponent,
    GroupsComponent,
    TypesguardsComponent,
    SignatureComponent,
    StatesComponent,
    NotificationsComponent,
    UnsuscribeguardsComponent,
    ReportresguardsComponent,
    ReportceticComponent,
    ChangebackgroundimageComponent,
    ChartsComponent,
    KorimaComponent,
    ArchivistComponent,
    AutorizeddownsComponent,
    ReportgroupsguardsComponent,
    ReportkorimaComponent,
    StockComponent,
    StocklistComponent,
    ReportdepartamentkorimaComponent,
    NotificationsComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    StyleClassModule,
    ButtonModule,
    ToolbarModule,
    FileUploadModule,
    TabViewModule,
    DialogModule,
    SpeedDialModule,
    ToastModule,
    SplitterModule,
    TagModule,
    AvatarModule,
    AvatarGroupModule,
    CardModule,
    ImageModule,
    InputSwitchModule,
    MultiSelectModule,
    DropdownModule,
    QRCodeModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgxPrintModule,
    SignaturePadModule,
    PickListModule,
    MatMenuModule,
    MatButtonModule,
  ],
  providers: [
    DatePipe,
    DialogService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
