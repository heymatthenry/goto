(function(){
	Goto = {
		Geo: {
			getLoc: function(){
				if (navigator.geolocation){
					navigator.geolocation.getCurrentPosition(this.handleSuccess);
				} else {
					alert("Sorry, your browser doesn't allow for geolocation")
				}
			},
			
			handleSuccess: function(position){
				Goto.Ui.displayCoords(position.coords);
				Goto.Main.doSearch(position.coords);
			}
		},

		Ui: {
			slideAll: function(dir){
				var klass = document.body.className;
				if (dir == "left"){
					if (klass == ""){
						document.body.className = "shifted";
					} else {
						document.body.className += " twice";						
					}
				} else {
					if (klass.match("twice")){
						document.body.className = "shifted"; 
					} else {
						document.body.className = ""; 						
					}
				}
				console.log(document.body.getAttribute("class"));
			},
			
			displayCoords: function(result){
				var resultsContainer = document.getElementById("results").childNodes[0],
						p = document.createElement('p');

				if (result.latitude && result.longitude){
					var ul = document.getElementsByClassName("geoResults")[0],
							latLi = document.createElement("li"),
							latTxt = document.createTextNode("latitude: " + result.latitude),
							longLi = document.createElement("li"),
							longTxt = document.createTextNode("longitude: " + result.longitude);

					latLi.appendChild(latTxt);
					longLi.appendChild(longTxt);
					ul.appendChild(latLi)
					ul.appendChild(longLi);
				} else {
					var msg = document.createTextNode("We couldn't figure out where you are. Maybe try standing outside?");
					p.appendChild(msg),
					resultsContainer.appendChild(p);
				}			
			},
			
			makePlaceList: function(places){
				document.getElementsByClassName("gotResults")[0].style.display = "block"
				document.getElementsByClassName("spinner")[0].style.display = "none"
				var ul = document.getElementsByClassName("placeResults")[0];
				for (var i=0, len=places.length; i<len; i++){
					var li = document.createElement("li"),
							idNode   = document.createTextNode(places[i].id),
							nameNode = document.createTextNode(places[i].name),
							addrNode = document.createTextNode(places[i].address),
							nameSpan = document.createElement("span");
							addrSpan = document.createElement("span");
					
					li.setAttribute("data-yahoo-id",idNode);
					nameSpan.appendChild(nameNode);
					nameSpan.className = "name";
					li.appendChild(nameSpan);
					addrSpan.appendChild(addrNode);
					addrSpan.className = "address";
					li.appendChild(addrSpan);
					ul.appendChild(li);

					li.addEventListener("click", function(e){Goto.Main.selectLocation(e.target)}, true)
				}
			}
		},
		
		Http: {
			request: function(method, url, async, callback, data){
				var req = new XMLHttpRequest(), response;
				req.open(method,url,false);
				req.send(null);

				response = (req.status = 200) ? req.responseText : "xhr failed"

				return (method == "get") ?
					response :
					"unable to get remote data";
			}
		},
		
		YQL: {
			baseUri: "http://query.yahooapis.com/v1/public/yql?",
						
			buildQuery: function(location, query){
				var latitude = location.latitude,
						longitude = location.longitude,
								
				return "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20local.search%20where%20latitude%3D'" + 
						latitude + "'%20and%20longitude%3D'" + longitude + "'%20and%20query%3D'" + query + 
						"'&format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env";
			},
			
			submitQuery: function(query){
				var response = Goto.Http.request("get",query);
				return JSON.parse(response);
			},
			
			parseResults: function(YQLresults){
				var results = YQLresults.query.results.Result,
						places = [];
						
				for (var i=0, len=results.length; i<len; i++){
					var place = {}
					place.name = results[i].Title;
					place.address = results[i].Address;
					place.id = results[i].id;
					places.push(place);
				}
				return places;
			}
		},
		
		Main: {
			doSearch: function(location){
				var searchCats = ["pizza","coffee","Frys"],
						searchResults = [];
				for (var i=0, len = searchCats.length; i<len; i++){
					var query = Goto.YQL.buildQuery(location, searchCats[i]),
							places = Goto.YQL.submitQuery(query);
						  list = Goto.YQL.parseResults(places);
					for (var j=0, jlen=list.length; j<jlen; j++){
						searchResults.push(list[j]);
					}
				}
				Goto.Ui.makePlaceList(searchResults);
			},
			
			selectLocation: function(el){
				var container = document.getElementById("checkInLocation"),
						input = document.createElement("input"),
						nameSpan = document.querySelector("#checkInLocation .name"),
						nameNode;
				if (el.nodeName == "LI")	{
					nameNode = document.createTextNode(el.firstChild.nodeValue);
				} else if (el.nodeName == "SPAN") {
					if (el.className == "name") {
						nameNode = document.createTextNode(el.firstChild.nodeValue);
						console.log("name");
					} else {
						nameNode = document.createTextNode(el.parentNode.firstChild.firstChild.nodeValue);
						console.log("addr");
					}
				} else {
					console.log(el.nodeName);
				}
				
				nameSpan.appendChild(nameNode);
				window.scroll(window.scrollX,0);
				Goto.Ui.slideAll("left");
			},
			
			checkIn: function(){
				var placeName = document.querySelector("#checkInLocation .name").firstChild.nodeValue;
				alert("Congratulations! You're the comptroller of " + placeName);
			},
			
			init: function(){
				var locationButton = document.getElementById("get_location");
				var checkInButton = document.getElementById("check_in");				
				
				locationButton.addEventListener("click",function(e){
					Goto.Ui.slideAll("left");
					Goto.Geo.getLoc();
					e.preventDefault();
				},false);

				checkInButton.addEventListener("click",function(e){
					Goto.Main.checkIn();
					e.preventDefault();
				},false);
			},

			debug: function(){
				var location = {latitude: 37.4121, longitude: -122.022711}, 
						query = "coffee",
						queryStr = Goto.YQL.buildQuery(location, query),
						result = Goto.YQL.submitQuery(queryStr);

				console.log(result);
			}
		}
	}

	// Goto.Main.debug();
	Goto.Main.init();
})()