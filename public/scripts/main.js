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
				console.log(position.coords);
				Goto.Ui.displayResult(position.coords);
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
		
		YQL: {
			baseUri: "http://query.yahooapis.com/v1/public/yql?",
			buildQuery: 
		},
		
		init: function(){
			var button = document.getElementById("get_location");

			button.addEventListener("click",function(e){
				Goto.Ui.toggleSpinner(button);
				Goto.Ui.slideAll("left");
				Goto.Geo.getLoc();
				e.preventDefault();
			},false);			
		}
	}
	
	Goto.init();
})()