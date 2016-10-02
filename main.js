function Config(key, arr, idList, idBoard, color) {
	var key = key,
		idList = idList, 
		arr = arr, 
		firstCard; // we need this to fire the decremental eventBus
	return {
		populateEventBus : function() {
			arr.forEach(function(i, j){
				if(j == 0){
					firstCard = { name: i, 
						desc: i,
						pos: "bottom", 
						idList: idList,
						idLabels: [color]
					};	
				} else {
					var newCard = { name: i, 
						desc: i,
						pos: "bottom", 
						idList: idList,
						idLabels: [color]
					};
					config.EventsBus.eventBusPut(newCard);
				}
			});
		},
		authenticationSuccess : function() {
			console.log('Successful authentication');
			config.populateEventBus();
			config.EventsBus.eventBusDo();
		},
		authenticationFailure : function() { console.log('Failed authentication');},
		init : function() {
			var s = document.createElement('script');
			s.type = 'text/javascript';
			s.src = "https://trello.com/1/client.js?key=" + key;
			console.log(key);
			document.head.appendChild(s);
			s.onload = function(){
				Trello.authorize({
				  type: 'popup',
				  name: 'Getting Started Application',
				  scope: {
					read: 'true',
					write: 'true'},
				  expiration: 'never',
				  success: config.authenticationSuccess,
				  error: config.authenticationFailure
				});
			};
		},
		EventsBus : new(function() {
			var eventBus = [];
			this.eventBusPut = function(obj) {
				eventBus.push(obj);
				console.log(obj);
			};
			this.eventBusDo = function() {
				if (firstCard) {
					config.transport.transportHandler.apply(this, [firstCard]);
					firstCard = '';
				}else if(eventBus.length) {
					config.transport.transportHandler.apply(this, [eventBus[0]]);
					eventBus.splice(0, 1);
				}
			};
			this.isEventBus = function(){
				return eventBus.length;
			};
		})(),
		transport : {
			transportHandler : function(newCard) {
				Trello.post('/cards/', newCard, function(){}, function(){}).done(function(data) {
					console.log(data);
					config.EventsBus.eventBusDo();
				}).fail(function(xhr, status, error){
					if(!config.EventsBus.isEventBus()) {
						console.log('Trello.post has finished!');
					}else {
						console.log('Trello.post has failed!', error);
					}
				});
			}
		}
	}
}

var arr = ["Automated check for color label creation", "Automated check for color label creation2"],
	idList= '';
	
/* Follow the set of instructions to obtain the key: 
	https://developers.trello.com/get-started/start-building*/ 
/*
params@ 1. key: obtainable after the link above
        2. array for newCards
		3. idList : the id of the column in the trello project board
		4. idBoard : the id of the Board
		5. color: 
			yellow -> "57de6e4884e677fd366df74c"
			green -> "57de6e4884e677fd366df74b"
			dark orange -> "57de6e4884e677fd366df74d"
			red -> "57de6e4884e677fd366df74e"
*/

var config = new Config('fd508e308e8e7edcf0e71c4c5030bb3d', arr, "57e3d3a68512132197c1d763", "57de6e4883213002c00190c2", "57de6e4884e677fd366df74c");
	config.init();