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
				Goto.Ui.slideAll("left");
				Goto.Ui.displayResult(position.coords);
				var query = Goto.YQL.buildQuery(position.coords, "coffeeshops");
				Goto.YQL.submitQuery(query);
			}
		},

		Ui: {
			slideAll: function(dir){
				document.body.className = "shifted";
			},
			
			toggleSpinner: function(el){
				var parent = el.parentElement,
						spinner = document.createElement("img"),
						spinnerImg = "images/spinner-big.gif";

				spinner.setAttribute("src",spinnerImg);
				spinner.setAttribute("alt","getting location");
				spinner.setAttribute("class","spinner");

				parent.appendChild(spinner);
			},

			displayResult: function(result){
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
					places.push(place);
				}
				return places;
			}
		},
		
		init: function(){
			var button = document.getElementById("get_location");

			button.addEventListener("click",function(e){
				Goto.Ui.toggleSpinner(button);
				Goto.Ui.slideAll("left");
				Goto.Geo.getLoc();
				e.preventDefault();
			},false);
		},

		debug: function(){
			var location = {latitude: 37.4121, longitude: -122.022711}, 
					query = "coffee",
					queryStr = Goto.YQL.buildQuery(location, query),
					result = Goto.YQL.submitQuery(queryStr);

			console.log(Goto.YQL.parseResults(result));
		}
	}

	Goto.debug();
	Goto.init();
})()