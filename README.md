# Song HTML Element (Concept)

*This is part of my bungalowplatform.com collection (Upcoming site)

This is a hack by Alexander <drsounds@gmail.com>. This is a web component, 'ac-song' that will adds playlisting features straight into any web page.

The <ac-song> element is used to queue web songs from different sources into one seamless playback stream, to make the web page an unique playlists for all media encoded in ac-song element regardless of their type, unless a resolver is defined for the uri. 

## Example
	<html>
	<head>
		<link rel="import" href="<your_path_to>/song.html" />
	</head>
	<body>
	...
	<ac-song uri="music:artist:Dr+Sounds:album:Aquasphere:track:Aquasphere:version:radio" />
	...
	</body>
	</html>	

# Resolvers

Resolvers are JavaScript classes that handles media playback for a given URL. It's base class is defined in this way. I also plan to have an generic resolver for music: uris, that can be directed according to the user.

			var Resolver = function (uri, node) {
				this.uri = uri;
				this.timer = null;
				this.duration = 3;
				this.position = 0;
				this.node = node;
				
			}
			Resolver.prototype = {
				
				
				stop: function () {
					clearInterval(this.timer);
					this.timer = null;

				},
				play: function () {
					var self = this;
					// When playback is finished this event must be dispatched

					console.log(stopEvent);
					window.dispatchEvent(stopEvent);
					var stopEvent = new CustomEvent('trackended', {
						'track': this
					});
				},
				/**
				 * Loads metadata for a song
				 **/
				load: function (uri, cb) {
					// load here and invoke the callback with track data like this below:
					setTimeout(function () {
						cb({
							'title': 'test',
							'artist': {
								'uri': 'test',
								'name': 'Testartist'
							}
						});
					}, 1000);
				}
			};
			/**
			 * checks if the resolver matches the uri
			 **/
			Resolver.matchesUri = function (uri) {
				return new RegExp(/^<provider_name>\:/).test(uri);
			};

A new resolver is registered to the system by putting in into my own custom window.musicResolvers array.

			window.musicResolvers.push(Resolver); // Registers the resolver into the stack



## Requirements
This is using the new technology of web components mentioned in http://w3c.github.io/webcomponents/explainer/ and is not ready for mainstream use, but I plan to implement a jQuery version of this component whenever I have time.

# License
MIT License