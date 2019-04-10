import { Component, OnInit } from '@angular/core';
import { SearchDetailsService } from '../../app/search-details.service';
import { WishlistService } from '../wihlist.service';
import { SearchService } from '../search.service';
import { DetailedInformationService } from '../detailed-information.service';
import { summaryFileName } from '@angular/compiler/src/aot/util';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  showwishlistList = false;
  showEventsDetails = false;
  eventDetailsResult: any;
  eventDetailsJson: any = [];
  iswishlists =  false;
  isActiveFavButton = false;
  isActiveResButton =  true;
  isDetailsEnabled = true;
  x:number;


  constructor(private searchDetailsService: SearchDetailsService, private wishlistService: WishlistService,
    private searchService: SearchService, private detailedInformationService: DetailedInformationService) {
      this.searchService.reset_Element.subscribe(data => {
        this.showwishlistList = Boolean(data);
      });
    this.wishlistService.wishlists_data.subscribe(data => {
      this.eventDetailsResult = data;
      // console.log(this.eventDetailsResult);
      this.setEventDetailsJson();
    });
    this.wishlistService.wishlist_active.subscribe(data => {
      this.showwishlistList = Boolean(data);
      this.showEventsDetails = Boolean(data);
    });
  }
  setEventDetailsJson() {
    let count: Number = 0;
    this.eventDetailsJson = this.eventDetailsResult;
    if (this.eventDetailsJson.length > 0) {
      this.iswishlists = true;
    }
  }
  showwishlists(isActive) {
    if (!isActive) {
      this.isActiveFavButton = !isActive;
      this.isActiveResButton = isActive;
    }
    this.searchService.resetElements();
    this.detailedInformationService.resetTabs();
    this.wishlistService.showwishlists(true);
    //  console.log('json', this.eventDetailsJson);
    if (this.eventDetailsJson && this.eventDetailsJson.length > 0) {
      // console.log(this.eventDetailsJson.length);
      this.x = this.tot(this.eventDetailsJson);
      this.showwishlistList = true;
       this.showEventsDetails = true;
    } else {
       this.showEventsDetails = false;
      this.iswishlists = false;
    }
    
  }
 tot(ff){
  // console.log(ff[0]["price"].substring(1));
  // console.log(ff.length);
  let sum=0;
  for(var i=0;i< ff.length;i++){
    // console.log("in");
    sum += parseInt(ff[i]["price"].substring(1));
  }
  // console.log(sum);
  return sum;
 }
  showSpecificEventDetails(event_id, data) {
    this.searchDetailsService.saveEventDetailsListState(this.eventDetailsResult);
    this.showEventsDetails = false;
    this.searchDetailsService.getEventDetails(event_id, data);
  }

  deletewishlist(row) {
    // console.log(this.eventDetailsJson);
    this.wishlistService.deletewishlist(row);
    this.wishlistService.showwishlists(true);
    if (!this.eventDetailsJson || this.eventDetailsJson.length < 1) {
      this.showEventsDetails = false;
      this.iswishlists = false;
    }
    this.x=this.tot(this.eventDetailsJson);
    
  }

  showResults(isActive) {
    if (!isActive) {
      this.isActiveResButton = !isActive;
      this.isActiveFavButton = isActive;
    }
    this.isDetailsEnabled = true;
    this.searchService.resetElements();
    this.detailedInformationService.setShowResults();
  }

  ngOnInit() {
  }

}
