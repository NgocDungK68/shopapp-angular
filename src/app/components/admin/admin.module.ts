import { NgModule } from "@angular/core";
import { AdminComponent } from "./admin.component";
import { OrderAdminComponent } from "./order/order.admin.component";
import { DetailOrderAdminComponent } from "./detail-order/detail.order.admin.component";
import { ProductAdminComponent } from "./product/product.admin.component";
import { CategoryAdminComponent } from "./category/category.admin.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        AdminComponent,
        OrderAdminComponent,
        DetailOrderAdminComponent,
        ProductAdminComponent,
        CategoryAdminComponent
    ],
    imports: [
        AdminRoutingModule,
        FormsModule,
        CommonModule
    ]
})
export class AdminModule { }