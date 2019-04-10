import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private _wishlists_data = new Subject();
  wishlists_data = this._wishlists_data.asObservable();
  private _wishlist_active = new Subject();
  wishlist_active = this._wishlist_active.asObservable();
  private _wishlist_keys = new Subject();
  wishlist_keys = this._wishlist_keys.asObservable();

  constructor() { }

  deletewishlist(row) {
    localStorage.removeItem('csci571_' + row.id);
  }

  showwishlists(isShowwishlist) {
    // console.log("wishlist");
    let wishlistList = [];
    let count = 0;
    for (count = 0; count < localStorage.length; count++) {
      // console.log(JSON.parse(localStorage.getItem(localStorage.key(count))));
      if (localStorage.key(count) !== 'previousStateOfEventDetails' && localStorage.key(count) !== 'events_tab_info') {
        if (localStorage.key(count).startsWith('csci571_')) {
          wishlistList.push(JSON.parse(localStorage.getItem(localStorage.key(count))));
        }
      }
    }
    this._wishlists_data.next(wishlistList);
    this._wishlist_active.next(isShowwishlist); 
  }

  getwishlistStateList() {
    return (JSON.parse(localStorage.getItem('previousStateOfEventDetails')));
    //  this._wishlist_active.next(true);
  }

  getwishlistKeys() {
    let keys: any = [];
    let count = 0;
    for (count = 0; count < localStorage.length; count++) {
      if (localStorage.key(count).startsWith('csci571_')) {
        keys.push(localStorage.key(count));
      }
    }
    this._wishlist_keys.next(keys);
  }
}
