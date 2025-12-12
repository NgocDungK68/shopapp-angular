import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { OrderComponent } from './components/order/order.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { DetailOrderComponent } from './components/detail-order/detail-order.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminComponent } from './components/admin/admin.component';
import { OrderAdminComponent } from './components/admin/order/order.admin.component';
import { ProductAdminComponent } from './components/admin/product/product.admin.component';
import { CategoryAdminComponent } from './components/admin/category/category.admin.component';
import { DetailOrderAdminComponent } from './components/admin/detail-order/detail.order.admin.component';
import { CommonModule } from '@angular/common';
import { AdminModule } from './components/admin/admin.module';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    OrderComponent,
    DetailProductComponent,
    DetailOrderComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    AppComponent
    // AdminComponent,
    // OrderAdminComponent,
    // DetailOrderAdminComponent,
    // ProductAdminComponent,
    // CategoryAdminComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterOutlet,
    RouterLink,
    AppRoutingModule,
    NgbPopoverModule,
    NgbModule,
    AdminModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
