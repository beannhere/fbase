'use strict';


window.onload = function() {		
var url = window.location.href;
var uid = url.substring(url.lastIndexOf("=") + 1);

if(url.lastIndexOf("=") >= 0){
	getDocData(uid);
} else {
	window.location.href = "./";
}

};

function getDocData(uid){
	console.log('getDocData');					
	if(uid != null){
		var docRef = db.collection("usr");
		docRef.where("uid","==",uid)
			.onSnapshot(function(dataOnId){
				dataOnId.forEach(function(dt){
					console.log("uid "+dt.data().uid);
					console.log("access "+dt.data().accountNum);

					let container = document.querySelector('#item-data');
					var navArrow = document.createElement('div'); 
					navArrow.className = 'nav_list'; 
					navArrow.innerHTML = '<p>UID: <a href="index.html">'+dt.data().uid+'</a></p>'
									 +'<p>ACCESS#: '+dt.data().accountNum+'</p>'
									 +'<p>'+dt.data().uid+'</p>';
					container.append(navArrow);					
				});
			});				
	}
}




