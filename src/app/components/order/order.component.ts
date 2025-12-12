import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderDTO } from 'src/app/dtos/order/order.dto';
import { environment } from 'src/app/environments/environment';
import { Product } from 'src/app/models/product';
import { BaseComponent } from '../base/base.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { ApiResponse } from 'src/app/responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent extends BaseComponent implements OnInit {
  private formBuilder = inject(FormBuilder);

  orderForm: FormGroup;        // Đối tượng FormGroup để quản lý dữ liệu của form
  cartItems: { product: Product, quantity: number }[] = []
  couponCode: string = '';     // Mã giảm giá
  totalAmount: number = 0;     // Tổng tiền
  cart: Map<number, number> = new Map();

  orderData: OrderDTO = {
    user_id: 1,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    status: 'pending',
    note: '',
    total_money: 0,
    payment_method: 'cod',
    shipping_method: 'express',
    coupon_code: '',
    cart_items: []
  };

  constructor() {
    super();

    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      note: ['', Validators.required],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }

  ngOnInit(): void {
    debugger
    this.orderData.user_id = this.tokenService.getUserId();
    this.orderForm.patchValue({...this.orderData,});    

    // Lấy danh sách sản phẩm từ giỏ hàng
    debugger
    this.cart = this.cartService.getCart();
    const productIds = Array.from(this.cart.keys());  // Chuyển danh sách ID từ Map giỏ hàng

    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
    debugger
    if (productIds.length === 0) {
      return;
    }

    this.productService.getProductsByIds(productIds).subscribe({
      next: (apiResponse: ApiResponse) => {
        const products: Product[] = apiResponse.data || [];

        // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: this.cart.get(productId)!
          };
        });
      },

      complete: () => {
        this.calculateTotal();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi tải thông tin sản phẩm',
          title: 'Lỗi Giỏ Hàng'
        });
      }
    });
  }

  // Khi bấm nút "Đặt hàng"
  placeOrder() {
    debugger
    if (this.orderForm.valid) {
      // Gán giá trị form vào orderData
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      };

      // Gán cart_items
      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));

      this.orderData.total_money = this.totalAmount;

      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response: ApiResponse) => {
          debugger
          alert('Đặt hàng thành công');

          // Xoá giỏ hàng, về trang chủ
          this.cartService.clearCart();
          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.showToast({
            error: error,
            defaultMsg: 'Lỗi trong quá trình đặt hàng',
            title: 'Lỗi Đặt Hàng'
          });
        }
      });
    } else {
      this.toastService.showToast({
        error: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        defaultMsg: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        title: 'Lỗi Dữ Liệu'
      });
      this.orderForm.markAllAsTouched();
    }
  }

  // Hàm tính tổng tiền
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity, 0
    );
  }

  // Giảm số lượng
  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }

  // Tăng số lượng
  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    this.updateCartFromCartItems();
    this.calculateTotal();
  }

  // Hàm xử lý việc áp dụng mã giảm giá
  applyCoupon(): void {
    // TODO: Viết mã xử lý áp dụng mã giảm giá ở đây
  }  

  private updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach(item => {
      this.cart.set(item.product.id, item.quantity);
    });
    this.cartService.setCart(this.cart);
  }
}
