var VIDEOS_ON_SINGLE_PAGE = 12;
var customSearch = '';
var pageToken = "";
var iframeURL = "https://www.youtube.com/embed/";
var jQueryPreviousPageToken;
var jQueryNextPageToken;
var orderByDate = true;
var firstLoad = true;
var finished = false;
var currentPage = 0;
// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms

// Helper function to display JavaScript value on HTML page.
function showResponse(response) {
    var responseString = JSON.stringify(response, '', 2);

    //document.getElementById('response').innerHTML += responseString;
      jsonObj = jQuery.parseJSON(responseString);
   
     var TotalNumberOfVideos = jsonObj.pageInfo.totalResults;
     numOfPages = Math.ceil(TotalNumberOfVideos/VIDEOS_ON_SINGLE_PAGE);

     //check if on last page
     currentPage++;
     if((currentPage * VIDEOS_ON_SINGLE_PAGE) >= (TotalNumberOfVideos - VIDEOS_ON_SINGLE_PAGE))
      finished = true;

     //deal the next and previous buttons/tokens
     if(jsonObj.prevPageToken != null)
      {
        jQueryPreviousPageToken = jsonObj.prevPageToken;
      }

      if(jsonObj.nextPageToken != null)
      {
        jQueryNextPageToken = jsonObj.nextPageToken;
      }

      if(firstLoad)
        redisplay();
      else
        addVideo();
     
     //search(jQueryNextPageToken);
}

// Called automatically when JavaScript client library is loaded.  
gapi.client.load('youtube', 'v3', onYouTubeApiLoad); 

// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
    // This API key is intended for use only in this lesson.
    // See https://goo.gl/PdPA1 to get a key for your own applications.
    gapi.client.setApiKey('');

    search();
}

function search(jQuerypageToken) {
    // Use the JavaScript client library to create a search.list() API call.
    if(orderByDate) //search gets really buggy with both q and order parameters so I have to do this mess UGHHH!!!!
      {
        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            type: 'video',
            maxResults: VIDEOS_ON_SINGLE_PAGE,
            order: 'date',
            pageToken: jQuerypageToken,
            channelId: ""
        });
      }
      else{
        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            type: 'video',
            maxResults: VIDEOS_ON_SINGLE_PAGE,
            pageToken: jQuerypageToken,
            q: customSearch,
            channelId: ""
        });
      }
    
    // Send the request to the API server,
    // and invoke onSearchRepsonse() with the response.
    request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    showResponse(response);
}

function addVideo(){
  var thisURL
 
  //display videos on the page
  for(var i =0; i<jsonObj.items.length; i++)
  {
    var videoID = jsonObj.items[i].id.videoId;
    thisURL = iframeURL;
 
    //set iframe properties
    jQuery('<iframe />', { 
      src: thisURL += videoID,
      height: "315",
      width: "560"
    }).appendTo('#videos');
    loading = false;
    firstLoad = false;
  }
}

//load new videos onto the page
function redisplay()
{
  RemoveVideos(displayVideos);
}

function displayVideos(){
  addVideo();
}

function RemoveVideos(callback){
    jQuery("#videos").empty();
    callback();
}

//infinite scrolling
var nextScroll = true;
var loading = false;
       
// function to detect when scroollbar reaches the bottom of page
 function whenScrlBottom() {
  if(!firstLoad)
  {
    nextScroll = true;
    // http://coursesweb.net/javascript/
    var win_h = (self.innerHeight) ? self.innerHeight : document.body.clientHeight;    // gets window height

    // gets current vertical scrollbar position
    var scrl_pos = window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
    // if scrollbar reaces to bottom
    var pageHeight = (scrl_pos + win_h);
    pageHeight += 200;
  
    if (document.body.scrollHeight <= pageHeight) {
      //show loading wheel
      jQuery('#loading-wheel img').removeClass("hidden");
      loading = true;
      window.onscroll = null;
      search(jQueryNextPageToken);

      nextScroll = true;
    }
  }
}

jQuery(window).scroll(function() {

  if(finished)
    jQuery('#loading-wheel img').addClass("hidden");


  if(!loading)
  {
    // register event on scrollbar
    whenScrlBottom();

  }
});

//handle search box
jQuery('document').ready(function(){
  jQuery('#youtube-search').keypress(function(e){
    if(e.which == 13) //enter key pressed
    {
      var searchValue = jQuery('#youtube-search').val();
      customSearch = searchValue;
      firstLoad = true;
      orderByDate = false;
      search('');
    }
  });

  jQuery('#youtube-search-button').click(function(){
      var searchValue = jQuery('#youtube-search').val();
      customSearch = searchValue;
      firstLoad = true;
      orderByDate = false;
      search('');
  });
});