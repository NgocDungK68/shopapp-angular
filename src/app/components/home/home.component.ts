import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from 'src/app/models/category';
import { environment } from '../../environments/environment';
import { BaseComponent } from '../base/base.component';
import { ApiResponse } from 'src/app/responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  localStorage?: Storage | undefined;
  keyword: string = "";

  constructor() {
    super();
    this.localStorage = this.document.defaultView?.localStorage;
  }

  ngOnInit() {
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.getCategories(0, 100);
  }
  
  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        debugger
        this.categories = apiResponse.data;
      },
      complete: () => {
        debugger;
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi tải danh mục sản phẩm',
          title: 'Lỗi Tải Dữ Liệu'
        });
      }
    });
  }

  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.router.navigate(['/home'], { 
      queryParams: 
      { keyword: this.keyword, categoryId: this.selectedCategoryId, page: this.currentPage } 
    });
  }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
    debugger
    this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        debugger
        const response = apiResponse.data;
        response.products.forEach((product: Product) => {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        });

        this.products = response.products;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        debugger;
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi tải danh sách sản phẩm',
          title: 'Lỗi Tải Dữ Liệu'
        });
      }
    });
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.router.navigate(['/home'], { queryParams: { page: this.currentPage } });
  }

  onProductClick(productId: number) {
    debugger
    this.router.navigate(['/products', productId]);
  }
}
