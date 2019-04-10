import { Component, OnInit } from '@angular/core';
import { SearchDetailsService } from '../../app/search-details.service';
import { SearchService } from '../../app/search.service';
import { DetailedInformationService } from '../../app/detailed-information.service';
import { WishlistService } from '../../app/wihlist.service';
// import * as moment from 'moment';
import { SelectControlValueAccessor } from '@angular/forms';

import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { JSONP_HOME } from '@angular/http/src/backends/browser_jsonp';
import { SlideInOutAnimation } from '../animation';
@Component({
  selector: 'app-detailed-information',
  templateUrl: './detailed-information.component.html',
  styleUrls: ['./detailed-information.component.css'],
  animations: [ trigger('showMoreLess', [
    state('less', style({height: '30%' })),
    state('more', style({height: '100%'})),
    transition('less <=> more', [style({height: '30%'}), animate('4s ease-out', style({height: '100%'}))])
  ]), SlideInOutAnimation
  ]

})
export class DetailedInformationComponent implements OnInit {
  

  showDetailedPage = false;
  showEventTab = false;
  showShippingTab = false;
  showSellerTab = false;
  showSimilarTab = false;
  showProgressBar = false;
  showphotosTab = false;

  eventDetailsResult: any;

 
  artistsResult: any;
  artistsRes_: any = [];
  photosResult: any=[];
  similarResult:any=[];
  shippingResult: any=[];
  photosRes_: any = [];

  product_id:string;
  product_title: String;
  product_subtitle: String;
  product_price: String;
  product_location: String;
  product_return:string;
  product_specifics: any = [];
  product_photos:any = [];
  // product_subtitle: String;
  shipping_cost:string;
  shipping_location:string;
  handling_time:string;
  expediate_shipping:string;
  one_day:string;
  return_accepted:string;

  seller:string;
  feedback_score:string;
  popularity:string;
  feedback_ratingstar:string;
  store_name:string;
  buy_productat:string;
  top_rated:string;
  seller_tab_json: any;
  show_similar_items = 5;

  artist_team: String;
  venue: String;
  date: String;
  category: String;
  priceRange: String;
  ticketStatus: String;
  buyTicketAt: String;
  seatMap: String;
  fbUrl: String;
  event_tab_json: any;

  venueAddress: String;
  venueCity: String;
  venuePhNo: String;
  venueOpenHours: String;
  venueGeneralRule: String;
  venueChildRule: String;
  lat: number;
  lng: number;
  zoom: number;
  center: any;
  venue_tab_json: any;

  manipulatedArtistsData: any;
  manpData: any = [];

  SimilarData: any = [];
  defaultSimilarData: any = [];
  venueDetailsData: any = [];
  product_shipping:any  = [];
  isArtist = false;
  isGooglePhotos = true;
  shipping_tab_json:any;
  show_no_records_msg = false;

  sort_type = 'default';
  sort_order = 'ascending';

  showwishlistList = false;

  currentSelectedInfo: any;

  iswishlist =  false;

  tabs_control: any = {};

  reset_tabs: Boolean = false;
  show_result_tab:Boolean = false;

  iswishlistSelected = false;

  showMoreLessState = 'less';
  animationState = 'out';
  slidingAffect = false;
  showBtnVal = 'Show More';



  constructor(private searchDetailsService: SearchDetailsService, private detailedInformation: DetailedInformationService,
  private searchService: SearchService, private wishlistService: WishlistService) {

    this.searchDetailsService.status_progress_bar.subscribe(data => {
      this.showProgressBar = Boolean(data);
    });

    this.searchDetailsService.animate_trigger.subscribe(data => {
      this.slidingAffect = Boolean(data);
      this.animationState = 'in';
    });

    this.searchService.reset_Element.subscribe(data => {
      this.showDetailedPage = Boolean(data);
      this.show_no_records_msg = Boolean(data);
    });
    this.wishlistService.wishlist_active.subscribe(data => {
      this.iswishlist = Boolean(data);
    });
    this.searchDetailsService.current_data.subscribe(data => {
      this.currentSelectedInfo = data;
    });
    this.searchDetailsService.result_json.subscribe(data => {
      this.product_title = '';
      this.product_id = '';
      this.product_shipping = [];
      this.show_no_records_msg = false;
      this.iswishlistSelected = this.checkIswishlist(data['id']);
      this.eventDetailsResult = data;
      //console.log(this.eventDetailsResult['id']);

      //console.log(data);
      this.showDetailedPage = true;
      this.showEventTab = true;
      this.setEventDetails();
      this.slidingAffect = false;
      // this.animationState = 'in';
      // console.log(this.category);
      // if (this.artist_team || this.category) {
      //   this.getArtistOrTeams(this.artist_team, this.category);
      
      if (this.product_title) {
        this.photos(this.product_title);
      }
      if (this.product_id) {
        this.simprod(this.product_id);
      }
      
      this.showProgressBar = false;
    });

    this.detailedInformation.is_wishlist_event.subscribe(data => {
      // console.log('is wishlisteee', Boolean(data));
      this.iswishlistSelected = Boolean(data);
      // console.log(this.iswishlistSelected);
    });


     this.detailedInformation.reset_tabs.subscribe(data => {
      //  console.log(data);
        this.reset_tabs = Boolean(data);
        if(this.reset_tabs){
        this.showEventTab=false;
        this.showSellerTab=false;
        this.showSimilarTab=false;
        this.showShippingTab =false;
        this.showphotosTab = false;
        this.show_no_records_msg = false;
          
        }
      });
      this.detailedInformation.show_result_tab.subscribe(data => {
        //  console.log(data);
          this.show_result_tab = Boolean(data);
          if(this.show_result_tab){
          this.showEventTab=false;
          this.showSellerTab=false;
          this.showSimilarTab=false;
          this.showShippingTab =false;
          this.showphotosTab = false;
          this.show_no_records_msg = false;
            
          }
        });
    this.searchService.result_json.subscribe(data =>{
      // this.shippingResult.length
      this.shippingResult = data;});
    this.detailedInformation.team_photos_result.subscribe(data => {
      // console.log('photosss resultsssss');
       //console.log(data);
      this.photosResult = data;
      //console.log("ghfghfg",this.photosResult);
      
    });
    this.detailedInformation.sim_Products_result.subscribe(data => {
      // console.log('photosss resultsssss');
       //console.log(data);
      this.similarResult = data;
      //console.log("ghfghfg",this.photosResult);
      
    });

    this.detailedInformation.tabs_control.subscribe(data => {
      this.tabs_control = data;
      // console.log(this.tabs_control)
      this.setControls();
    });
  }

  checkIswishlist(event_id) {
    if (localStorage.getItem('csci571_' + event_id)) {
      return true;
    } else {
      return false;
    }
  }
  Seller(x){
    // console.log("in");
    this.show_no_records_msg = false;
    let flag =0;
      for(var i=0;i<this.shippingResult.length;i++){
        if(this.shippingResult[i]['id']==x){
          flag = i;
          break;
        }
    
      }
      // console.log(this.shippingResult[flag]);
      // console.log(this.shippingResult[flag]['store_info'][0]['storeName'][0]);
      let tup: any = {};
      try {
        if(this.shippingResult[flag]['seller']){
          this.seller = this.shippingResult[flag]['seller'];
          tup.seller = this.seller;
        }
        if(this.shippingResult[flag]['seller_info']){
          if( this.shippingResult[flag]['seller_info'][0]['feedbackScore']){
            this.feedback_score = this.shippingResult[flag]['seller_info'][0]['feedbackScore'][0];
            tup.feedback_score = this.feedback_score;
          }
          if( this.shippingResult[flag]['seller_info'][0]['feedbackRatingStar']){
            this.feedback_ratingstar = this.shippingResult[flag]['seller_info'][0]['feedbackRatingStar'][0];
            tup.feedback_ratingstar = this.feedback_ratingstar;
          }
          if( this.shippingResult[flag]['seller_info'][0]['topRatedSeller']){
            this.top_rated = this.shippingResult[flag]['seller_info'][0]['topRatedSeller'][0];
            tup.top_rated = this.top_rated;
          }
          if( this.shippingResult[flag]['seller_info'][0]['positiveFeedbackPercent']){
            this.popularity = this.shippingResult[flag]['seller_info'][0]['positiveFeedbackPercent'][0];
            tup.popularity = this.popularity;
          }
        } 
        if(this.shippingResult[flag]['store_info']){
          if(this.shippingResult[flag]['store_info'][0]['storeName']){
            this.store_name = this.shippingResult[flag]['store_info'][0]['storeName'][0];
             tup.store_name= this.store_name.toLocaleUpperCase();
          }
          if(this.shippingResult[flag]['store_info'][0]['storeURL']){
            this.buy_productat = this.shippingResult[flag]['store_info'][0]['storeURL'][0];
            tup.buy_productat = this.buy_productat;
          }  
        }
        this.seller_tab_json=tup;
        
        
        if (!(this.seller_tab_json)) {
          this.show_no_records_msg = true;
               
        }else{
          this.show_no_records_msg = false;
        }
      }catch (err) {
        // console.log(err);
        this.show_no_records_msg = true;
      }
      this.showEventTab=false;
      this.showSellerTab=true;
      this.showSimilarTab=false;
      this.showShippingTab =false;
      this.showphotosTab = false;
  }
  
  SimilarProducts(){
    this.show_no_records_msg = false;
     let x=this.detailedInformation.sim_Products;
    //  console.log("x",x[0].length);
    this.SimilarData =[];
     let simi_Result = x[0];
    try {
      if (simi_Result && simi_Result.length > 0) {
        for (let dat of simi_Result) {
          let tup: any = [];
          try {
            if (dat["name"]) {
              tup.name = dat["name"];
            } else {
              continue;
            }
            tup.url=dat["url"];
            tup.image = dat["image"];
            tup.price = dat["price"];
            tup.daysleft= dat["daysLeft"];
            tup.shipping = dat["daysLeft"];
            this.SimilarData.push(tup);
            this.defaultSimilarData.push(tup);
            if (!(dat["url"] || dat["image"] || dat["price"]
            || dat["daysLeft"] || dat["daysLeft"])) {
                this.show_no_records_msg = true;
            }else{
              this.show_no_records_msg = false;
            } 
          } catch (err) {
            this.show_no_records_msg = true;
          }
        }
      } else {
        this.show_no_records_msg = true;
      }
    } catch (err) {
      // console.log(err);
      this.show_no_records_msg = true;
    }
      this.showEventTab=false;
      this.showSellerTab=false;
      // this.showSimilarTab=false;
      this.showShippingTab =false;
      this.showphotosTab = false;
      this.showSimilarTab = true;
}   
setMoreCount() {
  this.show_similar_items = this.SimilarData.length;
  this.showMoreLessState = (this.showMoreLessState === 'less') ? 'more' : 'less';
}

setLessCount() {
  this.show_similar_items = 5;
  this.showMoreLessState = (this.showMoreLessState === 'less') ? 'more' : 'less';
}
sortOnType(type) {
  let tempData: any = [];
  let factor = 1;
  if (this.sort_order === 'descending') {
     factor = -1;
  }
  if ((this.sort_type === 'default' && this.sort_order === 'ascending')) {
   tempData = this.defaultSimilarData;
  } else if ((this.sort_type === 'default' && this.sort_order === 'descending')){
   tempData = this.defaultSimilarData.reverse();
  } else if (this.sort_type === 'name') {
     tempData = this.SimilarData.sort(function(obj1, obj2) {
       let name1 = obj1.name.toLowerCase() , name2 = obj2.name.toLowerCase();
       if (name1 > name2) {
         return factor * 1;
       } else if (name1 < name2) {
         return factor * -1;
       }
       return 0;
     });
 } else if (this.sort_type === 'price') {
   tempData = this.SimilarData.sort(function(obj1, obj2) {
     let name1 =  parseInt(obj1.price), name2 = parseInt(obj2.price);
       if (name1 > name2) {
         return factor * 1;
       } else if (name1 < name2) {
         return factor * -1;
       }
       return 0;
   });
 } else if (this.sort_type === 'daysleft') {
   tempData = this.SimilarData.sort(function(obj1, obj2) {
     let name1 = parseInt(obj1.daysleft) , name2 = parseInt(obj2.daysleft);
       if (name1 > name2) {
         return factor * 1;
       } else if (name1 < name2) {
         return factor * -1;
       }
       return 0;
   });
 } else if (this.sort_type === 'shipping') {
  tempData = this.SimilarData.sort(function(obj1, obj2) {
    let name1 = parseInt(obj1.shipping), name2 = parseInt(obj2.shipping);
      if (name1 > name2) {
        return factor * 1;
      } else if (name1 < name2) {
        return factor * -1;
      }
      return 0;
  });
} 
 this.SimilarData= tempData;
}
    shipping(x){
      // console.log(x);
      this.show_no_records_msg = false;
      let flag =0;
      // console.log(this.shippingResult);
      for(var i=0;i<this.shippingResult.length;i++){
        if(this.shippingResult[i]['id']==x){
          flag = i;
          
          break;
        }
        //console.log("dghafg",this.shippingResult[i]['id']);
      }
      console.log(this.shippingResult[flag]);
      // console.log(flag);
  
      let tup: any = {};
      try {
        if(this.shippingResult[flag]['shipping_Info']){
          if(this.shippingResult[flag]['shipping_Info'][0]['shippingServiceCost']){
            if(this.shippingResult[flag]['shipping_Info'][0]['shippingServiceCost'][0]['__value__']){
              this.shipping_cost = this.shippingResult[flag]['shipping_Info'][0]['shippingServiceCost'][0]['__value__'];
              tup.shipping_cost = this.shipping_cost;
              if(tup.shipping_cost=='0.0'){
                tup.shipping_cost="Free Shipping";
              }
              else{
                tup.shipping_cost="$"+tup.shipping_cost;
              }
            }else{
              tup.shipping_cost="Free Shipping";
            }
          }
          if(this.shippingResult[flag]['shipping_Info'][0]['shipToLocations']){
            this.shipping_location = this.shippingResult[flag]['shipping_Info'][0]['shipToLocations'][0];
            tup.shipping_location = this.shipping_location;
          }
          if(this.shippingResult[flag]['shipping_Info'][0]['handlingTime']){
            this.handling_time = this.shippingResult[flag]['shipping_Info'][0]['handlingTime'][0];
            tup.handling_time = this.handling_time;
            if(tup.handlingTime==0 ||tup.handlingTime==1){
              tup.handling_time = tup.handling_time+" Day";
            }
            else{
              tup.handling_time = tup.handling_time+" Days";
            }
          }
          if(this.shippingResult[flag]['shipping_Info'][0]['expeditedShipping']){
            this.expediate_shipping = this.shippingResult[flag]['shipping_Info'][0]['expeditedShipping'][0];
            tup.expediate_shipping = this.expediate_shipping;
          }
          if(this.shippingResult[flag]['shipping_Info'][0]['oneDayShippingAvailable']){
            this.one_day = this.shippingResult[flag]['shipping_Info'][0]['oneDayShippingAvailable'][0];
            tup.one_day = this.one_day;
          } 
        }
        if(this.shippingResult[flag]['shipping_returns']){
          this.return_accepted = this.shippingResult[flag]['shipping_returns'][0];
          tup.return_accepted = this.return_accepted;
        }
        // console.log("dghafg",tup);
        this.shipping_tab_json=tup;
        if (!(this.shipping_tab_json)){
            this.show_no_records_msg = true;     
        }else{
          this.show_no_records_msg = false;
        } 
      }catch (err) {
        // console.log(err);
        this.show_no_records_msg = true;
      }
            this.showEventTab=false;
            this.showSellerTab=false;
            this.showSimilarTab=false;
            this.showShippingTab =true;
            this.showphotosTab = false;
      // console.log(this.shipping_tab_json);
    
      
    }
    manipulatephotos() {
      //console.log("pictures");
      this.show_no_records_msg = false;
       //console.log(this.manpData);
      let localManpData: any = [];
        this.manpData = [];
      // console.log(this.manpData);
      try {
          // console.log(this.artistsResult[0]);
          let count = 0;
          let count1 = 0;
          this.isArtist = true;
          let tup: any = [];
          // console.log(this.photosResult[0]);
          localManpData.push(this.photosResult[0]);
          if (!(localManpData)) {
              this.show_no_records_msg = true;
          }else{
            this.show_no_records_msg = false;
          }
        }
      catch (err) {
        console.log(err);
        this.show_no_records_msg = true;
      }
      this.showSimilarTab = false;
      this.showShippingTab = false;
      this.showSellerTab = false;
      this.showphotosTab = true;
      this.showEventTab = false;
    }

   getEventDetails() {
    //  console.log(this.event_tab_json);
     this.show_no_records_msg = false;
     this.showSimilarTab = false;
     this.showShippingTab = false;
     this.showSellerTab = false;
     this.showphotosTab = false;
     this.showEventTab = true;
     if (!(this.eventDetailsResult['title'] || this.eventDetailsResult['subtitle'] || this.eventDetailsResult['price']
     || this.eventDetailsResult['location'] || this.eventDetailsResult['return']['ReturnsAccepted'] || this.eventDetailsResult['itemspecifics'] || 
        this.eventDetailsResult['product_images'])) {
            this.show_no_records_msg = true;
        }
   }

   setEventDetails() {
    //  console.log('selected event', this.currentSelectedInfo);
    let tup: any = {};
     try {
        //console.log('val', this.eventDetailsResult);
        this.detailedInformation.setIswishlistEvent('csci571_' + this.eventDetailsResult['id']);
        this.product_title = this.eventDetailsResult['title'];
        tup.product_title = this.product_title;
        this.product_subtitle = this.eventDetailsResult['subtitle'];
        tup.product_subtitle = this.product_subtitle;
        this.product_price = this.eventDetailsResult['price'];
        tup.product_price = this.product_price;
        this.product_location = this.eventDetailsResult['location'];
        tup.product_location = this.product_location;
        this.product_return = this.eventDetailsResult['return']['ReturnsAccepted'];
        tup.product_return = this.product_return;
        this.product_specifics = this.eventDetailsResult['itemspecifics'];
        tup.product_specifics = this.product_specifics;
        this.product_photos = this.eventDetailsResult['product_images'];
        tup.product_photos = this.product_photos;
        // console.log(this.eventDetailsResult['product_images']);
        this.product_id = this.eventDetailsResult['id'];
        tup.product_id = this.product_id;
        this.fbUrl = this.eventDetailsResult['fburl'];
        tup.fbUrl = this.fbUrl;
        // console.log(tup.fbUrl);
        //console.log(tup);
        this.event_tab_json = tup;
        if (!(this.eventDetailsResult['title'] || this.eventDetailsResult['subtitle'] || this.eventDetailsResult['price']
        || this.eventDetailsResult['location'] || this.eventDetailsResult['return']['ReturnsAccepted'] || this.eventDetailsResult['itemspecifics'] ||
        this.eventDetailsResult['product_images'])) {
            this.show_no_records_msg = true;
        } else {
          this.getEventDetails();
        }

        // console.log('json', tup);
      } catch (err) {
        // console.log(err);
        this.show_no_records_msg = true;
      }
   }

   photos(key) {
     //console.log("hbjdfjg");
      this.detailedInformation.photos(key);
   }
   simprod(key) {
    //console.log("hbjdfjg");
     this.detailedInformation.simprod(key);
  }

 
  //  }

   getArtistsInfo() {
     //console.log('in artist info..');
      this.showEventTab = false;
      this.showShippingTab = false;
      this.showSimilarTab = false;
      this.showSellerTab = false;
      this.showphotosTab = true;
   }

  

   markwishlist() {
     this.iswishlistSelected = true;
    localStorage.setItem('csci571_' + this.currentSelectedInfo.id, JSON.stringify(this.currentSelectedInfo));

    // let count = 0;
    // for (count = 0; count < localStorage.length; count++) {
    //   console.log(JSON.parse(localStorage.getItem(localStorage.key(count))));
    // }
   }

   goBack(iswishlist) {
     this.searchDetailsService.animation('in');
     let eventTabsData: any = {};
     let tabsEnabled: any = {};
     tabsEnabled.showDetailedPage = this.showDetailedPage;
     tabsEnabled.showEventTab = this.showEventTab;
     tabsEnabled.showShippingTab =this.showShippingTab;
     tabsEnabled.showSellerTab = this.showSellerTab;
     tabsEnabled.showProgressBar = this.showProgressBar;
     tabsEnabled.showphotosTab = this.showphotosTab;
     tabsEnabled.showSimilarTab = this.showSimilarTab;
     eventTabsData.event_tab = this.eventDetailsResult;
     eventTabsData.photo_tab = this.photosResult;
     eventTabsData.similar_tab= this.similarResult;
     eventTabsData.Shipping_tab = this.shippingResult;
     eventTabsData.Seller_tab = this.shippingResult;
     eventTabsData.tabsInfo = tabsEnabled;
    //  console.log('tabs enabled are', tabsEnabled);
     this.detailedInformation.saveEventTabsState(eventTabsData);
     this.searchService.resetElements();
     this.detailedInformation.resetTabs();
     if (this.reset_tabs) {
      //  console.log("in");
       this.showDetailedPage = false;
       this.showEventTab = false;
       this.showSimilarTab = false;
       this.showShippingTab = false;
       this.showSellerTab = false;
       this.showphotosTab = false;
     }
     if (!iswishlist) {
      this.searchService.getEventDetailsListState();
     } else {
      //  console.log('wishlist list state back');
       this.showDetailedPage = false;
       this.wishlistService.showwishlists(true);
       this.wishlistService.getwishlistStateList();
     }
     this.searchDetailsService.setDetailsEnabledButton(false);
   }

   setControls() {
    //  console.log('tabs contr', this.tabs_control);
    this.showDetailedPage = this.tabs_control.showDetailedPage;
    this.showEventTab = this.tabs_control.showEventTab;
    this.showSimilarTab = this.tabs_control.showSimilarTab;
    this.showShippingTab = this.tabs_control.showShippingTab;
    this.showSellerTab = this.tabs_control.showSellerTab;
    this.showProgressBar = this.tabs_control.showProgressBar;
    this.showphotosTab = this.tabs_control.showphotosTab;
  }

  deletewishlist(row) {
    // console.log('delete wishlist page');
    this.wishlistService.deletewishlist(this.currentSelectedInfo);
    this.wishlistService.showwishlists(false);
    this.iswishlistSelected = false;
  }
  showMoreLess(val) {

    if (val === 'Show More') {
           this.showBtnVal = 'Show Less';
            this.showMoreLessState = 'more';
            this.show_similar_items = this.SimilarData.length;
          } else {
            this.showBtnVal = 'Show More';
            this.showMoreLessState = 'less';
            this.show_similar_items = 5;
          }
    // console.log(this.showMoreLessState);
    // this.showMoreLessState = (this.showMoreLessState === 'less') ? 'more' : 'less';
}

  ngOnInit() {
    // console.log(this.showMoreLessState);
  }

}


// feedback(x){
//   if(x=='Yellow'){
//     return "Yellow Star";
//   }
//   else if(x=='Blue'){
//     return "Blue Star";
//   }
//   else if(x=='Turquoise'){
//     return "Turquoise Star";
//   }
//   else if(x=='Purple'){
//     return "Purple Star";
//   }
//   else if(x=='Red'){
//     return "Red Star";
//   }
//   else if(x=='Green'){
//     return "Green Star";
//   }
//   else if(x=='YellowShooting'){
//     return "Yellow Shooting Star";
//   }
//   else if(x=='TurquoiseShooting'){
//     return "Turquoise Shooting Star";
//   }
//   else if(x=='PurpleShooting'){
//     return "Purple Shooting Star";
//   }
//   else if(x=='RedShooting'){
//     return "Red Shooting Star";
//   }
//   else if(x=='GreenShooting'){
//     return "Green Shooting Star";
//   }
//   else if(x=='SilverShooting'){
//     return "Silver Shooting Star";
//   }
//  return ''; 
// }