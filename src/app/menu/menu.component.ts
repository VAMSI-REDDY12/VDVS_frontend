import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { MenuServiceService } from "../menu-service.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  model: menu[] = [];
  values: Quantity[] = [];
  total: number = 0;

  modalCart: cart = {
    quantity1: 0,
    quantity2: 0,
    quantity3: 0
  };

  constructor(private http: HttpClient, private router: Router, private menuService: MenuServiceService) { }

  ngOnInit() {
    if (sessionStorage.getItem("userData") == null) {
      this.router.navigate(['login']);
    }
    this.getItems();
  }

  clearLocal() {
    sessionStorage.clear();
  }

  getItems(): void {
    this.menuService.getItems().subscribe((men: any[]) => {
      // directly use backend response
      this.model = men;
      
      // initialize quantity array
      this.values = this.model.map(() => new Quantity());
    });
  }

  getTotal(): void {
    console.log(this.values);

    // Safe accessing without optional chaining
    const q1 = this.values.length > 0 ? this.values[0].quantity : 0;
    const q2 = this.values.length > 1 ? this.values[1].quantity : 0;
    const q3 = this.values.length > 2 ? this.values[2].quantity : 0;

    // Update modalCart
    this.modalCart.quantity1 = q1;
    this.modalCart.quantity2 = q2;
    this.modalCart.quantity3 = q3;

    let url = "http://localhost:8080/cart";
    
    this.http.post<number>(url, this.values).subscribe(
      res => {
        sessionStorage.setItem('total', res.toString());
        this.total = res;
      },
      err => {
        alert("Please select at least 1 item");
      }
    );
  }
}

// Interfaces

export interface menu {
  id: string;
  item: string;
  price: number;
  quantity: number;
  url: string;
  formID: string;
  cartID: string;
}

export interface cart {
  quantity1: number;
  quantity2: number;
  quantity3: number;
}

export class Quantity {
  quantity: number = 0;
}
