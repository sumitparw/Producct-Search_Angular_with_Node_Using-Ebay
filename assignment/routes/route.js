const express = require('express');
const router = express.Router();
var req_hit = require('request-promise');
const https = require('https');  
// var cors= require('cors');

// router.use(cors());
// var rp = require('request-promise');
// rp('http://www.google.com')
//     .then((html) => console.log(html)) // Process html...
//     .catch((err) => console.error(err));
router.get('/contacts',(req,res)=>{
    res.send('Retrieval');
});

//return router;
router.get('/ebay_search', (req, res) => {
    let url = 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=sumitPar-Mytestfo-PRD-016e2f149-b99e8a42&RESPONSE-DATA-FORMAT=JSON&RESTPAYLOAD&paginationInput.entriesPerPage=50&keywords=iphones&buyerPostalCode=90007&itemFilter(0).name=MaxDistance&itemFilter(0).value=10&itemFilter(1).name=FreeShippingOnly&itemFilter(1).value=false&itemFilter(2).name=LocalPickupOnly&itemFilter(2).value=true&itemFilter(3).name=HideDuplicateItems&itemFilter(3).value=true&itemFilter(4).name=Condition&itemFilter(4).value(0)=New&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo&Category_Id=2984';
    //res.send(url);
    let body = getContent(url);
    // console.log("hi");
    // console.log(body);
    res.send(body.tostring);
});

router.get('/product', (req, res) => {
    //res.send('{"hi":"there"}')
    //console.log('in product api', req.query.customLocation);
    let distance=0;
    // console.log(req.query);
    let zip =req.query.zip
    distance = req.query.distance;
    let shipping1 = 'true';
    let shipping2 = 'true';
    if(req.query.shipping1 ==''){
        shipping1 ='false'
    }
    else if(req.query.shipping1 =='false'){
        shipping1 ='false'
    }

    if(req.query.shipping2 ==''){
        shipping2 ='false'
    }
    else if(req.query.shipping2 =='false'){
        shipping2 ='false'
    }
    let cnt =0;
    let condition = '&itemFilter(4).name=Condition';
    if(req.query.check1=='true'){
       condition+='&itemFilter(4).value('+ cnt +')=New'
       cnt =cnt +1;
    }
    if(req.query.check2=='true'){
        condition+='&itemFilter(4).value('+ cnt +')=Used'
        cnt =cnt +1;
     }
    if(req.query.check2=='true'){
    condition+='&itemFilter(4).value('+ cnt +')=Unspecified'
    cnt =cnt +1;
    }
    // console.log(req.query.category,"fggf");
    let url='';
    if(cnt==0){
        if(req.query.category==''){
            // console.log("in1");
            url ='http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=sumitPar-Mytestfo-PRD-016e2f149-b99e8a42&RESPONSE-DATA-FORMAT=JSON&RESTPAYLOAD&paginationInput.entriesPerPage=50&keywords='+encodeURIComponent(req.query.keyword) +'&buyerPostalCode='+encodeURIComponent(zip) +'&itemFilter(0).name=MaxDistance&itemFilter(0).value='+encodeURIComponent(distance) +'&itemFilter(1).name=FreeShippingOnly&itemFilter(1).value='+encodeURIComponent(shipping2) +'&itemFilter(2).name=LocalPickupOnly&itemFilter(2).value='+encodeURIComponent(shipping1) +'&itemFilter(3).name=HideDuplicateItems&itemFilter(3).value=true&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo';
        }
        else{
            // console.log("in2");
            url ='http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=sumitPar-Mytestfo-PRD-016e2f149-b99e8a42&RESPONSE-DATA-FORMAT=JSON&RESTPAYLOAD&paginationInput.entriesPerPage=50&keywords='+encodeURIComponent(req.query.keyword) +'&buyerPostalCode='+encodeURIComponent(zip) +'&itemFilter(0).name=MaxDistance&itemFilter(0).value='+encodeURIComponent(distance) +'&itemFilter(1).name=FreeShippingOnly&itemFilter(1).value='+encodeURIComponent(shipping2) +'&itemFilter(2).name=LocalPickupOnly&itemFilter(2).value='+encodeURIComponent(shipping1) +'&itemFilter(3).name=HideDuplicateItems&itemFilter(3).value=true&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo&Category_Id='+encodeURIComponent(req.query.category);
        }
    }
    else{
        if(req.query.category==''){
            // console.log("in3");
            url ='http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=sumitPar-Mytestfo-PRD-016e2f149-b99e8a42&RESPONSE-DATA-FORMAT=JSON&RESTPAYLOAD&paginationInput.entriesPerPage=50&keywords='+encodeURIComponent(req.query.keyword) +'&buyerPostalCode='+encodeURIComponent(zip) +'&itemFilter(0).name=MaxDistance&itemFilter(0).value='+encodeURIComponent(distance) +'&itemFilter(1).name=FreeShippingOnly&itemFilter(1).value='+encodeURIComponent(shipping2) +'&itemFilter(2).name=LocalPickupOnly&itemFilter(2).value='+encodeURIComponent(shipping1) +'&itemFilter(3).name=HideDuplicateItems&itemFilter(3).value=true'+encodeURI(condition)+'&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo';
        }
        else{
            // console.log("in4");
            url ='http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=sumitPar-Mytestfo-PRD-016e2f149-b99e8a42&RESPONSE-DATA-FORMAT=JSON&RESTPAYLOAD&paginationInput.entriesPerPage=50&keywords='+encodeURIComponent(req.query.keyword) +'&buyerPostalCode='+encodeURIComponent(zip) +'&itemFilter(0).name=MaxDistance&itemFilter(0).value='+encodeURIComponent(distance) +'&itemFilter(1).name=FreeShippingOnly&itemFilter(1).value='+encodeURIComponent(shipping2) +'&itemFilter(2).name=LocalPickupOnly&itemFilter(2).value='+encodeURIComponent(shipping1) +'&itemFilter(3).name=HideDuplicateItems&itemFilter(3).value=true'+encodeURI(condition)+'&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo&Category_Id='+encodeURIComponent(req.query.category);
        }
    }
    console.log(url);
    let body = getContent(url);
    // console.log(body['findItemsAdvancedResponse'])
    
    body.then(function(data) {
    res.header("Content-Type",'application/json');
        // console.log(data);
    let response = [];
    //res.send(data['findItemsAdvancedResponse'][0]['searchResult'][0]['@count']);
    // console.log(data['findItemsAdvancedResponse'][0]['searchResult'][0]['@count']);
    if (data['findItemsAdvancedResponse'][0]['searchResult'][0]['@count']>0) {
        // let resp = data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][5]['sellerInfo'];
        let len = data['findItemsAdvancedResponse'][0]['searchResult'][0]['@count']
        
        //res.send(resp);
        for (var i=0;i<len;i++) {
           try{
                  let tup = {};
                  tup.seller=data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['sellerInfo'][0]['sellerUserName'][0].toUpperCase();
                  tup.id = data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['itemId'][0];
                  if(data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['galleryURL']){
                    tup.image = data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['galleryURL'][0];
                  }
                  else{
                      tup.image="N/A";
                  }
                  tup.name = data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['title'][0];
                  //console.log(tup.name.length); 
                  if (tup.name.length > 30) {
                    tup.shortName = tup.name.substring(0, 30);
                    tup.shortName = tup.shortName.trim() + "...";
                  } else {
                    tup.shortName = tup.name;
                  }
                  //console.log(tup.shortName); 
                  tup.price ="$"+ data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['sellingStatus'][0]["currentPrice"][0]['__value__'];
                  
                  if(!data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['shippingInfo'][0]['shippingServiceCost']){
                    tup.shipping = "N/A";
                  }
                  else if(data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'] == "0.0"){
                    tup.shipping = "Free Shipping";
                  }
                  else{
                    tup.shipping ="$"+ data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'];+"</td>";
                  }
                  
                  if(data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['postalCode']){
	            	tup.zip = data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['postalCode'][0];
	              }
	              else{
	            	tup.zip ="N/A";
                  }
                  tup.shipping_Info = data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['shippingInfo'];
                  tup.shipping_returns = data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['returnsAccepted'];
                  tup.store_info = data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['storeInfo'];
                  tup.seller_info = data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['sellerInfo'];
                  tup.price ="$"+data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i]['sellingStatus'][0]['currentPrice'][0]['__value__']; 
                  response.push(tup);
            } 
            catch (err) {
                // console.log(err);
            }
        }
    }
        res.send(JSON.stringify(response));
    }).catch(err => {
        // console.log(err);
        res.status(503).send(err);
     })
});
router.get('/autosuggest', (req, res) => {
    // console.log(req.query);
        let x = req.query.keyword;
        // let x = req.query.zip.substring(2)
        let url = 'http://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith='+encodeURI(x)+'&username=sumur&country=US&maxRows=5';
        // console.log(url);
        let body = getContent(url);
        body.then(function(data) {
            res.header("Content-Type",'application/json');
            //   console.log(data);
            let response = [];
            if(data["postalCodes"]) {
                let resp = data["postalCodes"];
                for (var i =0;i<resp.length;i++) {
                    let tup = {};
                    tup.zip = resp[i]["postalCode"];
                    response.push(tup);
                }
            }
            res.send(JSON.stringify(response));
            }).catch(err => {
            console.log(err);
            res.status(503).send(err);
            })
})
router.get('/specific-product-details', (req, res) => {
    // console.log(req.query.id);
     let url = 'http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=sumitPar-Mytestfo-PRD-016e2f149-b99e8a42&siteid=0&version=967&ItemID='+encodeURIComponent(req.query.id) +'&IncludeSelector=Description,Details,ItemSpecifics';
    //  let url = 'http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=sumitPar-Mytestfo-PRD-016e2f149-b99e8a42&siteid=0&version=967&ItemID=183626281794&IncludeSelector=Description,Details,ItemSpecifics';
    //console.log(url);
    let app_id=634024480354101;
    let code="Buy";
    let body = getContent(url);
     body.then(function(data) {
        res.header("Content-Type",'application/json');
        // console.log(data);
        //res.send(data['Item']);
        let response = [];
        let tup = {};
        try {
        tup.id =data['Item']['ItemID'];
        tup.product_images = data['Item']['PictureURL'];
        tup.subtitle =data['Item']['Subtitle'];
        tup.title =data['Item']['Title'];
        code+=""+tup.title+" at";
        tup.price ="$"+ data['Item']['CurrentPrice']['Value'];
        code+=""+tup.price+" from link below."
        tup.location = data['Item']['Location'];
        tup.return = data['Item']['ReturnPolicy'];
        tup.itemspecifics = data['Item']['ItemSpecifics']['NameValueList'];
        tup.fburl ="https://www.facebook.com/dialog/share?app_id="+encodeURIComponent(app_id)+"&display=popup&href="+encodeURIComponent(data['Item']['ViewItemURLForNaturalSearch'])+"&quote="+encodeURIComponent(code);
        // data['Item']['ViewItemURLForNaturalSearch'];        //console.log(tup);
        response.push(tup);
     } catch(err) {
        console.log(err);
     }

     res.send(JSON.stringify(tup));
      }).catch(err => {
        // console.log(err);
        res.status(503).send(err);
    })
});
router.get('/google-search-img', (req, res) => {
    //  console.log(req.query.key);
    let cx = '009228832743430512270:rzjpwutt56o';
    let url = 'https://www.googleapis.com/customsearch/v1?q='+ encodeURIComponent(req.query.key)+'&cx=' + encodeURIComponent(cx) + '&imgSize=huge&imgType=news&num=9&searchType=image&key=AIzaSyA58tyDXKEENNyZnf1k2RXCtOteFahKSqM';
    // let url = "https://www.googleapis.com/customsearch/v1?q=iphones&cx=001941704238005507175:y0dzhm2jppm&imgSize=huge&imgType=news&num=8&searchType=image&key=AIzaSyA58tyDXKEENNyZnf1k2RXCtOteFahKSqM"
    // console.log(url);
    let body = getContent(url);
    body.then(function(data) {
        res.header("Content-Type",'application/json');
        // console.log(data);

        let res1 = data["items"];
        let count = 0;
        let links = []
        let tup = {};
        for (var dat of res1) {
            if (count > 7) {
              break;
            }
            links.push(dat["link"]);
            count++;
        }
        //tup.name = req.query.key;
        res.send(JSON.stringify(links))
        // tup.links = links;
        
        //res.send(JSON.stringify(tup));
      }).catch(err => {
        // console.log(err);
        res.status(503).send(err);
      })
})

router.get('/simprod', (req, res) => {
    const https = require('https');
    https.get('https://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=sumitPar-Mytestfo-PRD-016e2f149-b99e8a42&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId='+encodeURIComponent(req.query.key)+'&maxResults=20', (resp) => {
    // https.get('https://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&CONSUMER-ID=sumitPar-Mytestfo-PRD-016e2f149-b99e8a42&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId=292862774875&maxResults=20', (resp) => {
    let data = '';
    // console.log(resp);
    resp.on('data', (chunk) => {
    data += chunk;
    });
    
    resp.on('end', () => {
        // res.send(JSON.parse(data));
        let x = JSON.parse(data);
        // console.log(x['getSimilarItemsResponse']['itemRecommendations']['item'][5]);
         res1 =x['getSimilarItemsResponse']['itemRecommendations']['item'];
        let response = [];
        let len= res1.length;
        for (var i=0;i<len;i++) {
            let tup={};
          try{
                tup.name=res1[i]['title'];
                tup.url=res1[i]['viewItemURL'];
                tup.price=res1[i]['buyItNowPrice']['__value__'];
                // tup.shipping=res1[i]['shipping_Cost'];
                tup.daysLeft = res1[i]['timeLeft'];
                tup.daysLeft = tup.daysLeft.substring(tup.daysLeft.lastIndexOf("P") + 1, tup.daysLeft.lastIndexOf("D"));
                tup.image=res1[i]['imageURL'];
                tup.shipping=res1[i]['shippingCost']['__value__']
                response.push(tup);
                // console.log(response)
            }catch(err) {
                console.log(err);
            }
        }
        
        //  console.log(response);
        res.send(response);
      });
    
    }).on("error", (err) => {
       console.log("Error: " + err.message);
    });
})


async function getContent(url) {
    //console.log('hi');
    let opt = {
        uri: url,
        json: true
    }
    // console.log(opt);
    try{let response =await req_hit(opt);
    //console.log(response);
    return response;}
    catch (err) {
        console.log(err);
      }
}
module.exports = router;
