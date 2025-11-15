import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { InsertCategoryDTO } from "../dtos/category/insert.category.dto";
import { UpdateCategoryDTO } from "../dtos/category/update.category.dto";
import { Category } from "../models/category";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiBaseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    getCategories(page: number, limit: number): Observable<Category[]> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());
        return this.http.get<Category[]>(`${environment.apiBaseUrl}/categories`, { params });
    }

    getDetailCategory(id: number): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiBaseUrl}/categories/${id}`);
    }

    deleteCategory(id: number): Observable<Category[]> {
        debugger
        return this.http.delete<Category[]>(`${this.apiBaseUrl}/categories/${id}`);
    }

    updateCategory(id: number, updatedCategory: UpdateCategoryDTO): Observable<Category[]> {
        return this.http.put<Category[]>(`${this.apiBaseUrl}/categories/${id}`, updatedCategory);
    }

    insertCategory(insertCategoryDTO: InsertCategoryDTO): Observable<Category[]> {
        // Add a new category
        return this.http.post<Category[]>(`${this.apiBaseUrl}/categories`, insertCategoryDTO);
    }
}