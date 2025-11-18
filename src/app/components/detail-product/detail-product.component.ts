import { Component, OnInit } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { Product } from 'src/app/models/product';
import { ProductImage } from 'src/app/models/product.image';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    // Lấy productId từ URL
    // const idParam = this.activatedRoute.snapshot.paramMap.get('id');

    debugger
    const idParam = 5;
    if (idParam !== null) {
      this.productId = +idParam;
    }

    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          }

          debugger
          this.product = response;

          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);
        },

        complete: () => {
          debugger;
        },

        error: (error: any) => {
          debugger;
          console.error('Error fetching detail:', error);
        }
      });
    } else {
      console.error('Invalid productId:', idParam);
    }
  }

  showImage(index: number): void {
    debugger
    if (this.product && this.product.product_images && this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }

      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number) {
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index;
  }

  previousImage(): void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }

  nextImage(): void {
    debugger
    this.showImage(this.currentImageIndex + 1);
  }
}
