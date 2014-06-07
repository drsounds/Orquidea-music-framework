/*
The MIT License (MIT)

Copyright (c) 2014 Alexander Forselius

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

(function ($) {

	var ACUri = function (uri) {
		this.uri = uri;
		uri = uri.replace(/:\/\//g, ':').replace(/::/g, ':').replace(/\//g, ':');
		this.segments = uri.split(':')
		for (var i = 1; i < this.segments.length; i+= 2) {
			this[this.segments[i]] = decodeURI(this.segments[i + 1]);
		}
		console.log(this);
	}


	var Resolver = function (uri, node) {
		this.uri = uri;
		this.timer = null;
		this.duration = 3;
		this.position = 0;
		this.node = node;
		
	}

	Resolver.prototype = {
		
		
		stop: function () {
			

		},
		play: function () {
		},
		/**
		 * Loads metadata for a song
		 **/
		load: function (cb) {
		},

		/***
		 * Used by the generic resolver to ask if this resolver can resolve a source
		 **/
		lookup: function (query, callback) {
		}
	};

	/**
	 * checks if the resolver matches the uri
	 **/
	Resolver.matchesUri = function (uri) {
		return false;
	};

	var MockResolver = function (uri, node) {
		this.uri = uri;
		this.timer = null;
		this.duration = 3;
		this.position = 0;
		this.node = node;
		
	}
	MockResolver.prototype = new Resolver();
	MockResolver.prototype = {
		
		
		stop: function () {
			clearInterval(this.timer);
			this.timer = null;

		},
		play: function () {
			var self = this;
			self.position = 0;
			console.log("T");
			this.timer = setInterval(function () {
				self.position += 1;
				if (self.position >= self.duration) {
					
					self.stop();	
					console.log("A");
					var stopEvent = new CustomEvent('trackended', {
						'track': this
					});
					console.log(stopEvent);
					window.dispatchEvent(stopEvent);
				}
				console.log(self.position);
			}, 1000);
		},
		/**
		 * Loads metadata for a song
		 **/
		load: function (cb, data) {
			console.log("Loading");
			console.log("Data", data);
			setTimeout(function () {
			
				cb({
					'title': data.track,
					'artists': [
						{
							'name': data.artist,
							'uri': ''
						}
					],
					'album': {
						'name': data.album,
						'uri': ''
					}
				});
			}, 1000);
		},

		
	};
	 /*** Used by the generic resolver to ask if this resolver can resolve a source
	 **/
	MockResolver.lookup = function (query, callback) {
			callback(this, [query]);
	};
	MockResolver.matchesUri = function (uri) {
		return new RegExp(/^resolver\:/).test(uri);
	};

	/**
	 * Generic resolver
	 **/
	var GenericResolver = function (uri) {
		this.uri = uri;
		this.query = new ACUri(uri);

	}
	GenericResolver.prototype = new Resolver();
	GenericResolver.prototype = {
		
		
		stop: function () {
			var self = this;
			self.player.stop();
		},
		play: function () {
			var self = this;
			self.player.play();
		},
		/**
		 * Loads metadata for a song
		 **/
		load: function (cb) {
			var self_resolver = this;
			console.log("A");
			// Iterate through all available resolvers and 
			for (var i = 0; i < window.musicResolvers.length; i++) {
				var resolver = window.musicResolvers[i];
				console.log(resolver.lookup);
				if ('lookup' in resolver)
				resolver.lookup(this.query, function (resolver, tracks) {
					if (tracks && tracks.length > 0) {
						console.log(arguments);
						console.log("Tracks", tracks);
						console.log(resolver);
						self_resolver.player = new resolver(self_resolver.uri);
						console.log(self_resolver.player.load);

						self_resolver.player.load(cb, tracks[0]);
					}

				});
			}
		}
	};
	/**
	 * checks if the resolver matches the uri
	 **/
	GenericResolver.matchesUri = function (uri) {
		console.log("uri", new RegExp(/^music\:/g).test(uri));
		return new RegExp(/^music\:/g).test(uri);
	};





	//GenericResolver.prototype = new Resolver();

	/**
	 * Youtube resolver
	 **/
	var YouTubeResolver = function (uri) {
		this.uri = uri;
	};
	YouTubeResolver.prototype = new Resolver;
	YouTubeResolver.prototype = {
		/**
		 * Loads a youtube resource
		 **/
		load: function (callback, data) {
			var self = this;

		}
	};
	YouTubeResolver.lookup = function (q, callback) {
		// TODO Change into Ajax
		$.getJSON('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + encodeURI(q.artist + '-' + q.album) +'&key=', function (data) {

		})
	};
	/**
	 * Resolvers for song playback
	 **/
	window.musicResolvers = [Resolver, GenericResolver, MockResolver];

	window.addEventListener('trackended', function (e) {
		window.playIndex += 1;
		console.log("play index", window.playIndex);
		window.currentSong.classList.remove('ac-song-play');
		var songs = $('.ac-song');
		console.log(playIndex, songs.length);
		if (window.playIndex < songs.length) {
			var song = songs[window.playIndex];
			console.log("Next song", song);
			console.log(song.getAttribute('data-uri'));
			console.log("Start playing song");
			console.log(song);
			song.play();
		}
	}, false);

	document.addEventListener('mousedown', function (event) {
		var songs = $('.ac-song');
		console.log(songs);
		for (var i = 0; i < songs.length; i++) {
			var song = songs[i];

			var bounds = song.getBoundingClientRect();
			console.log(bounds);
			if (!(event.pageX >= bounds.left && event.pageX <= bounds.left + bounds.width && event.pageY >= bounds.top && event.pageY <= bounds.top + bounds.height)) {

			song.classList.remove('ac-song-selected');
			}
		
		}
	})
	
	window.players = {};
	$.fn.acsong = function () {
		this.setUri = function (uri) {
			console.log(arguments);

			// Set the music resolver based on the uri

			// Query for a matching resolver
			
			for (var i = 0; i < window.musicResolvers.length; i++) {
				if (window.musicResolvers[i].matchesUri(uri)) {
					this.resolver = window.musicResolvers[i];
				}

			}
			if (!this.resolver) {
				this.innerHTML = 'Error';
				this.addClass('ac-error');
				return;
			}
			this.player = new this.resolver(uri);
			console.log(this.player);
			window.players[uri] = this.player;
			var self = this;
			this.player.load(function (song) {
				console.log("A", song);
				console.log(arguments);;
				$('[data-uri="' + uri + '"] #throbber').hide();
				$('[data-uri="' + uri + '"] #title').first().html(song.title);
				$('[data-uri="' + uri + '"] #artist').first().html(song.artists[0].name);
				$('[data-uri="' + uri + '"] #album').html(song.album.name);
			});

		}

		this.setUri(this.attr('data-uri'));
		var html = ('<table width="100%"><tr><td id="btn-play"></td><td><span id="throbber">Loading</span><a id="title"></a> <a id="artist"/> </td></tr></table>');
		if (this[0].tagName == 'TR') {
		html = '<td id="btn-play"></td><td width=""><span id="throbber">Loading</span><a id="title"/><a id="version"></a></td><td><a id="artist"/></td><td><a id="album" /></td>';
		}
		this.html(html);
		var self = this;
		this.mousedown(function (e) {
			var songs = $('.ac-song');
			console.log(songs);
			for (var i = 0; i < songs.length; i++) {
				var song = songs[i];
				song.classList.remove('ac-song-selected');
			
			}
				
			self.addClass('ac-song-selected');

		});

		this.on('dblclick', function (event) {
			if (window.currentSong != null)
			window.currentSong.stop(); // Stop current song
			self[0].play();
		});
		this[0].stop = function () {
			this.classList.remove('ac-song-play');
			window.players[this.getAttribute('data-uri')].stop();
		}
		this[0].play = function () {
			var songs = $('.ac-song');
			console.log(songs);
			if (window.currentSong)
			window.players[this.getAttribute('data-uri')].stop();
			this.classList.add('ac-song-play');
			var i = 0;
			var self = this;
			songs.each(function (i) {
				var song = $(this);
				if ($(self).attr('data-uri') == $(song).attr('data-uri')) {
					console.log("THIS");
					window.currentSong = song;
					window.playIndex = i;
				console.log("A");
			console.log("play index", window.playIndex);
					console.log(song.player);
					window.players[$(self).attr('data-uri')].play();
				}
			});
			window.currentSong = this;
		}
	};
	
}(jQuery));
				