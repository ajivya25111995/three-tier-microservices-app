import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: string;
}

interface Order {
  id?: number;
  userId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  createdAt?: string;
  total?: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private http = inject(HttpClient);

  readonly userApi = 'http://localhost:5001/api/users';
  readonly orderApi = 'http://localhost:5002/api/orders';

  users: User[] = [];
  orders: Order[] = [];

  user: User = {
    firstName: '',
    lastName: '',
    email: ''
  };

  order: Order = {
    userId: 0,
    productName: '',
    quantity: 1,
    unitPrice: 0
  };

  message = '';
  error = '';

  ngOnInit(): void {
    this.loadUsers();
    this.loadOrders();
  }

  loadUsers(): void {
    this.http.get<User[]>(this.userApi).subscribe({
      next: data => this.users = data,
      error: err => this.error = this.getError(err, 'Could not load users.')
    });
  }

  loadOrders(): void {
    this.http.get<Order[]>(this.orderApi).subscribe({
      next: data => this.orders = data,
      error: err => this.error = this.getError(err, 'Could not load orders.')
    });
  }

  createUser(): void {
    this.clearMessages();

    this.http.post<User>(this.userApi, this.user).subscribe({
      next: created => {
        this.message = `User ${created.firstName} created successfully.`;
        this.user = { firstName: '', lastName: '', email: '' };
        this.loadUsers();
      },
      error: err => this.error = this.getError(err, 'Could not create user.')
    });
  }

  createOrder(): void {
    this.clearMessages();

    this.http.post<Order>(this.orderApi, this.order).subscribe({
      next: created => {
        this.message = `Order #${created.id} created successfully.`;
        this.order = {
          userId: 0,
          productName: '',
          quantity: 1,
          unitPrice: 0
        };
        this.loadOrders();
      },
      error: err => this.error = this.getError(err, 'Could not create order.')
    });
  }

  deleteUser(id: number): void {
    this.clearMessages();

    this.http.delete(`${this.userApi}/${id}`).subscribe({
      next: () => {
        this.message = 'User deleted.';
        this.loadUsers();
      },
      error: err => this.error = this.getError(err, 'Could not delete user.')
    });
  }

  deleteOrder(id: number): void {
    this.clearMessages();

    this.http.delete(`${this.orderApi}/${id}`).subscribe({
      next: () => {
        this.message = 'Order deleted.';
        this.loadOrders();
      },
      error: err => this.error = this.getError(err, 'Could not delete order.')
    });
  }

  getUserName(userId: number): string {
    const user = this.users.find(x => x.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : `User #${userId}`;
  }

  private clearMessages(): void {
    this.message = '';
    this.error = '';
  }

  private getError(error: any, fallback: string): string {
    return error?.error?.message || fallback;
  }
}
