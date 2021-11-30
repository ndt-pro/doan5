import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AlertService {
    constructor(private router: Router) { }

    registerSuccess() {
        Swal
        .fire({
            icon: 'success',
            title: 'Đăng ký tài khoản thành công. Bạn có muốn đăng nhập?',
            showCancelButton: true,
            confirmButtonText: 'Đăng nhập',
            cancelButtonText: 'Quay lại',
        })
        .then((result) => {
            if (result.isConfirmed) {
                this.router.navigate(['/login']);
            }
        });
    }

    success(message) {
        Swal
        .fire({
            icon: 'success',
            title: 'Thành công',
            text: message
        });
    }

    successCallback(message, callback) {
        Swal
        .fire({
            title: "Thành công",
            text: message,
            icon: 'success',
            confirmButtonText: 'Đồng ý',
        })
        .then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        });
    }

    error(message) {
        Swal
        .fire({
            icon: 'error',
            title: 'Lỗi',
            text: message
        });
    }

    delete(message, callback) {
        Swal
        .fire({
            title: message,
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        })
        .then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        });
    }
}
