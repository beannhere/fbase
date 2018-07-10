'use strict';

var config = {
	apiKey: "AIzaSyAIgHO4x7nBg9DPmet0r0R2r0FrsiJoplg",
	authDomain: "fbase-app.firebaseapp.com",
	databaseURL: "https://fbase-app.firebaseio.com",
	projectId: "fbase-app"
};  
const settings = {timestampsInSnapshots: true};
const code = 'dta0';
firebase.initializeApp(config);
var db = firebase.firestore();
db.settings(settings);
var ref = db.collection("usr").doc("dta00");
var collection = db.collection("usr");


window.onload = function() {		
	this.initData();
	initView();	

};


function initView(){
	collection.onSnapshot(function(list) {
		list.forEach(function(dta){
			let container = document.querySelector('#item-list');
			var navArrow = document.createElement('div'); 
			navArrow.className = 'nav_list'; 
			navArrow.innerHTML = '<li><a href="javascript:void(0);" onclick="getDocData(\''+dta.data().uid+'\');">'+dta.data().uid+'</	a></li>';
navArrow.innerHTML = '<li><a href="dta.html?uid='+dta.data().uid+'">'+dta.data().uid+'</a></li>';

			container.append(navArrow);			
		});
		
	});
		
}





