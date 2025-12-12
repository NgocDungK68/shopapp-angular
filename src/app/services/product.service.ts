import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Product } from "../models/product";
import { ApiResponse } from "../responses/api.response";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiGetProducts = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(
    keyword: string,
    categoryId: number,
    page: number,
    limit: number): Observable<ApiResponse> {
    const params = {
      keyword: keyword,
      category_id: categoryId.toString(),
      page: page.toString(),
      limit: limit.toString()
    };

    return this.http.get<ApiResponse>(this.apiGetProducts, { params });
  }

  getDetailProduct(productId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.apiBaseUrl}/products/${productId}`);
  }

  getProductsByIds(productIds: number[]): Observable<ApiResponse> {
    // Chuyển danh sách ID thành một chuỗi và truyền vào params
    debugger
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<ApiResponse>(`${this.apiGetProducts}/by-ids`, { params });
  }
}