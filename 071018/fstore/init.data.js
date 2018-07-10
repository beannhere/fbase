


function initData(){
	console.log('load data');
var i;
	for(i=0;i<5;i++){		
		db.collection("usr").doc("dta0"+i).set({
			uid: "DT00"+i,
			access: true,
			accountNum: i,
			created_date: new Date("Jul 3, 2018"),
			projectList: ["PRJA-"+i, false, "Mobility"]	
		});
	}
			
	
};


