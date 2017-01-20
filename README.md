# YouTube-Channel-Page
Display Entire catalog of a YouTube user's channel utilizing the YouTube API

#Description
By default it displays a given YouTube channels catalog in descending order sorted by date. The videos are lazy loaded with N number of videos loaded on a page at a time. Utilizes an infinite scrolling technique to move through the videos. Also supports custom search functionality on the given channel.

#Set-Up
Inside the search.js file<br>
-set the const API_KEY variable to your YouTube Data API key <br>
-set the const CHANNEL_ID variable to the channel id value of the channel you wish to display videos from.

#Current Bugs
-gapi.client seems too load to early on occasion causing a javascript error where gapi.client is unknown. As a temporary fix I've added a 1 second sleep before calling the api. A better solution should be found once I better understand the issue.<br>
-Infinite scrolling seems a bit inconsistent between browsers. They seem to be calculating the current scroll position differently. 

#To Do
-Add some default CSS styles to this repo<br>
-I'd like to turn this into a WordPress plugin once the functionality is completly smoothed out.

#Contact
Email: seanpeterson.997@gmail.com
