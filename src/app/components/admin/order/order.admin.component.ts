import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OrderResponse } from "src/app/responses/order/order.response";
import { OrderService } from "src/app/services/order.service";

@Component({
    selector: "app-order-admin",
    templateUrl: "./order.admin.component.html",
    styleUrls: ["./order.admin.component.scss"]
})
export class OrderAdminComponent implements OnInit {
    orders: OrderResponse[] = [];
    currentPage: number = 0;
    itemsPerPage: number = 12;
    pages: number[] = [];
    totalPages: number = 0;
    keyword: string = "";
    visiblePages: number[] = [];
    router: Router = inject(Router);

    constructor(
        private orderService: OrderService,
    ) {}

    ngOnInit(): void {
        this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
    }

    getAllOrders(keyword: string, page: number, limit: number) {
        debugger
        this.orderService.getAllOrders(keyword, page, limit).subscribe({
            next: (response: any) => {
                debugger
                this.orders = response.orders;
                this.totalPages = response.totalPages;
                this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
            },
            complete: () => {
                debugger;
            },
            error: (error: any) => {
                console.error("Error fetching orders:", error);
            }
        });
    }

    onPageChange(page: number) {
        debugger;
        this.currentPage = page;
        this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
    }

    generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
        const maxVisiblePages = 5;
        const halfVisiblePages = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(currentPage - halfVisiblePages, 1);
        let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }

        return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
    }

    deleteOrder(id: number) {
        const confirmation = window.confirm("Are you sure you want to delete this order?");
        if (confirmation) {
            this.orderService.deleteOrder(id).subscribe({
                next: (response: any) => {
                    debugger
                    location.reload();
                },
                complete: () => {
                    debugger;
                },
                error: (error: any) => {
                    console.error("Error deleting order:", error);
                }
            });
        }
    }

    viewDetails(order: OrderResponse) {
        debugger
        this.router.navigate(['/admin/orders', order.id]);
    }
}