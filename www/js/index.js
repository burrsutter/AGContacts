var memberPipe  = AeroGear.Pipeline([{
        name: "members",
        settings: {
            baseURL: "http://agmobile-html5.rhcloud.com/rest/forge/"
        }
    }
 ]).pipes.members;


var app = {
	initialize : function() {
		this.bind();
	},
	bind : function() {
		document.addEventListener('deviceready', this.deviceready, false);
	},
	onAccSuccess : function(acceleration) {
		$("#accX").html('Acceleration X: ' + acceleration.x);
		$("#accY").html('Acceleration Y: ' + acceleration.y);
		$("#accZ").html('Acceleration Z: ' + acceleration.z);
	},
	onAccError : function() {
		alert('ACC Error');
	},
	onContactsSuccess: function(contacts) {
	    $("#debug").html("Found: " + contacts.length);
	    devContactsLV = $("#deviceContacts"); 
	    devContactsLV.empty();
	    var items = [];
	    for (var i = 0; i < contacts.length; i++) {
	    	items.push("<li><a href='#'>" + contacts[i].displayName + "</a></li>");
	    }
	    devContactsLV.append(items);
	    devContactsLV.listview("refresh");	
	},
	onContactsError: function() {
	    $("#debug").html("error...");
	},	
	deviceready : function() {
		// note that this is an event handler so the scope is that of the event
		// so we need to call app.report(), and not this.report()
		// app.report('deviceready');
		console.log("deviceready1");
		navigator.accelerometer.watchAcceleration(app.onAccSuccess, app.onAccError, {frequency:100});

		/*
		$.getJSON("http://agmobile-html5.rhcloud.com/rest/forge/members", function(data) {
			$("#contacts").empty();
		    var items = [];
		    $.each(data, function(key, val) {
		    	console.log("item: " + key + " " + val.name);
		    	items.push("<li><a href='#"+ key + "'>" + val.name +"</a></li>");
		    });
		    $("#contacts").append(items);
		    $("#contacts").listview("refresh");
		});    	
		*/
		// this happens on load
		memberPipe.read({
	        success: function( members ) {
	        	console.log("data: " + members);
	            contactsLV = $("#contacts"); 
	        	contactsLV.empty();
			    var items = [];
			    $.each(members, function(memberId) {
			    	console.log(memberId + " " + members[memberId].name);
			    	items.push("<li><a href='#"+ memberId + "'>" + members[memberId].name +"</a></li>");
			    });
			    contactsLV.append(items);
			    contactsLV.listview("refresh");	        	
	        }
	    });
		
		// on page-2
		$("#btnDeviceContacts").on("click", function(e) {
			   console.log("button clicked, going to fetch local contacts");
			   $("#debug").html("finding...");
			   var options      = new ContactFindOptions();
			   options.multiple = true;
			   var fields       = ["displayName", "name"];
			   navigator.contacts.find(fields, app.onContactsSuccess, app.onContactsError, options);
		});
		
		// on page-4
		$("#btnAddContact").on("click", function(e) {
			console.log("Adding contact...");
			var newContact = new Object();			
			newContact.name = $("#inputName").val();			
			newContact.phoneNumber = $("#inputPhone").val();
			newContact.email = $("#inputEmail").val();
			
			var newContactAsJSON = JSON.stringify(newContact);
			console.log("Contact: " + newContactAsJSON);
		    memberPipe.save(newContactAsJSON, {
		        success: function(data) {
		        	console.log("success");
		        	$("#inputName").val("");
		        	$("#inputPhone").val("");
		        	$("#inputEmail").val("");
		        },
		        error: function(error) {
		        	console.log("error: " + error);
		        	$.mobile.changePage("#errorDialog");
		        }
		    }); // memberPipe.save
		}); // click
	},
	report : function(id) {
		console.log("report:" + id);
		// hide the .pending <p> and show the .complete <p>
		document.querySelector('#' + id + ' .pending').className += ' hide';
		var completeElem = document.querySelector('#' + id + ' .complete');
		completeElem.className = completeElem.className.split('hide').join('');
	}
};
