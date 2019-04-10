import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SearchService } from '../../app/search.service';
import { SearchDetailsService } from '../../app/search-details.service';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";

import { SlideInOutAnimation } from '../animation';
import { DetailedInformationService } from '../detailed-information.service';
import { WishlistService } from '../wihlist.service';

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.css'],
  animations: [SlideInOutAnimation]
})
export class SearchDetailsComponent implements OnInit {
  @Output() animateSlider = new EventEmitter<any>();
  eventDetailsResult: any;
  showEventsDetails = false;
  showProgressBar = false;
  isDetailsEnabled = true;
  showButtons = false;

  currentSelectedData: any;
  eventDetailsJson: any = [];
  animationState = 'in';
  noRecords = false;
  wishlist_keys: any = [];
  slidingEffect = false;
  p: number = 1;
  details_highlight=false;



  constructor(private searchService: SearchService, private searchDetailsService: SearchDetailsService,
    private detailedInformationService: DetailedInformationService, private wishlistService: WishlistService ) {
    this.searchService.status_progress_bar.subscribe(data => {
      this.showProgressBar = Boolean(data);
    });
      this.searchService.reset_Element.subscribe(data => {
      this.showEventsDetails = Boolean(data); 
      this.noRecords = Boolean(data);
    });
    this.wishlistService.wishlist_keys.subscribe(data => {
      this.wishlist_keys = data;
    });
    this.detailedInformationService.show_result_tab.subscribe(data => {
      if (Boolean(data)) {
        // console.log('in here!!');
        try {
        this.wishlistService.showwishlists(false);
        this.eventDetailsJson = JSON.parse(localStorage.getItem('currentEventSearchRes'));
        this.eventDetailsResult = this.eventDetailsJson;
        this.manipulateEvents();
        this.showEventsDetails = true;
        if (this.eventDetailsJson.length < 1) {
          this.showEventsDetails = false;
          this.noRecords = true;
        }
      } catch (err) {
        this.noRecords = true;
      }
      }
    });
      this.searchService.data_result.subscribe(data => {
        // this.currentSelectedData = {};
      this.eventDetailsResult = data;
      this.eventDetailsJson = data;
      this.manipulateEvents();
      this.showProgressBar = false;
      this.showEventsDetails = true;
      this.noRecords = false;
      // this.eventDetailsJson = [];
      // console.log('length', this.eventDetailsJson.length);
      if (this.eventDetailsJson.length < 1) {
        this.showEventsDetails = false;
        this.noRecords = true;
      }
      //  this.setEventDetailsJson();
  });
  this.searchDetailsService.details_enabled.subscribe(data => {
    this.isDetailsEnabled = Boolean(data);
  });

  this.searchDetailsService.animation_.subscribe(data => {
    this.animationState = String(data);
  });
   }

  sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  manipulateEvents() {
    this.wishlistService.getwishlistKeys();
    let temp_event: any = [];
    // console.log('manp evnt', this.eventDetailsJson);
    for (let data of this.eventDetailsJson) {
      let tup: any = {};
      tup = data;
      tup.iswishlist = false;
      // console.log('keysss', this.wishlist_keys);
      // console.log('id', data.id);
      if (this.wishlist_keys.indexOf('csci571_' + data.id) > -1) {
        tup.iswishlist = true;
      }
      temp_event.push(tup);
    }
    this.eventDetailsJson = temp_event;
      // console.log('setting local storage...');
     localStorage.setItem('currentEventSearchRes', JSON.stringify(this.eventDetailsJson));
    //  console.log('rtrv val', JSON.parse(localStorage.getItem('currentEventSearchRes')));

  }
  indx(p){
     if(p==1){
       return 0;
     }
     else{
       return ((p-1)*10);
     }
  }
  setEventDetailsJson() {
   let count: Number = 0;
   this.eventDetailsJson = [];
   for (let data of this.eventDetailsResult) {
    try {
      let tup: any = {};
      tup.seller = data["seller"];
      tup.id = data["id"];
      tup.image=data["image"];
      tup.name = data["name"];
      if (tup.name.length > 30) {
        tup.shortName = tup.name.substring(0, 30);
        tup.shortName = tup.shortName.trim() + "...";
      } else {
        tup.shortName = tup.name;
      }
      tup.shipping=data["shipping"];
      tup.price=data["price"];
      tup.zip=data["zip"];
      this.eventDetailsJson.push(tup);

    } catch (err) {
      // console.log(err);
    }
   }
   if (this.eventDetailsJson.length < 1) {
     this.noRecords = true;
   }

  }

   showSpecificEventDetails(event_id, data) {
      // this.detailedInformationService.resetTabs();
      this.searchDetailsService.switchProgressBar(true);
      this.searchDetailsService.switchAnimation(true);
      this.currentSelectedData = data;
      // console.log(this.currentSelectedData.id);
      this.showEventsDetails = false;
      // this.animationState = 'out';
      this.searchDetailsService.saveEventDetailsListState(this.eventDetailsResult);
      this.showProgressBar = true;
      // this.sleep(10000);
      this.detailedInformationService.setIswishlistEvent('csci571_' + event_id);
      this.searchDetailsService.getEventDetails(event_id, data);
      this.isDetailsEnabled = false;
      this.showProgressBar = false;
      // this.saveDetailsState();
      // this.animateSlider.emit({slide:"left"});
   }

   markwishlist(row) {
     localStorage.setItem('csci571_' + row.id, JSON.stringify(row));
     this.wishlistService.getwishlistKeys();
     this.searchService.refreshEventsList(this.eventDetailsJson);

    //  console.log('retrieved object is : ', JSON.parse(localStorage.getItem('csci571_' + row.id)));
   }

   deletewishlist(row) {
    //  console.log('delete wishlist');
     this.wishlistService.deletewishlist(row);
     this.wishlistService.showwishlists(false);
     this.searchService.refreshEventsList(this.eventDetailsJson);
   }

   getCurrentSelectedData() {
     return this.currentSelectedData;
   }

   saveDetailsState() {
     this.searchDetailsService.saveEventDetailsListState(this.eventDetailsResult);
     this.searchService.resetElements();
     this.detailedInformationService.showEventTabsState();
     this.details_highlight=true;
    //  console.log(this.details_highlight);
   }

  ngOnInit() {
  }

}