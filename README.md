# Producct-Search_Angular_with_Node_Using-Ebay

The project is live and deployed on Google Cloud Platform. It can be accessed at the link below: http://productengine.appspot.com/

The Solution Video(Website) can be seen on: https://www.youtube.com/watch?v=5nNjz_Cux9w&feature=youtu.be
The Solution Video(Mobile) can be seen on: https://www.youtube.com/watch?v=BmRJdSZt4J0&feature=youtu.be

Technologies used
Node, Express, Angular 6, Bootstrap, AJAX, JSON, HTML5, APIs, REACT, GCP 

APIs used
eBay API, IP API, Facebook API, Google Customized Search API, eBay Similar API, Autocomplete using GeoNames

Overview
Product search allows users to search for various Products that are availble on eBay based on current location or any other location entered by the user. Users can know more about the product, similar items, seller message. The result comes with 50 top results which is shown using pagination i.e. 10 result per page. The user can Add it into wishlist, also remove them from wishlist and there are two tabs Result tab and wishlist tab.Also it is responsive i.e depending upon the screen size it will change the display.

Features
1. Autocomplete is implemented using Geonames https://www.geonames.org/export/web-services.html with 5 results in a dropdown box.
2. Real time validations are performed using two way data binding in Angular.
3. Users can search products from current location which is caught using ipapi or a custom ZIP.
4. Users can store favorite products(wishlist) which are accessible at all times even after the website is closed. This is done using LocalStorage. THey can append, delete this Wishlist.
5. In case the user want to share the product they can do this using Facebook button which calls FB api and share the product with a custom message, user can also write something before sharing.
6. Product Images are obtained using custom Google Search.
7. Bootstrap is used to make the website responsive and mobile friendly.
8. The Similar Products can be sorted based on several categories in ascending or descending order.
9. Users can directly tweet about the event by just a click of a button.
10. Custom pipes are used in Angular to truncate sentences when long.
11. Various icons are used for product ratings,Shipping info, seller feedback.
12. Clear button resets the application.
13. There are lot of Animations like loading, selection,pagination,Show More which were taken care of.
