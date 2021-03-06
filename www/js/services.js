angular.module('starter')
.factory('TwitterService', function($cordovaOauth, $cordovaOauthUtility, $http, $resource, $q) {
	var twitterKey = 'STORAGE.TWITTER.KEY';
	var clientId = '7xSDrcuS7dqVokq6BrIFhblPH';
	var clientSecret = 'xtn3A9zx6ohkvz21to1oU8y0HvbdecazB6dSm8ba11mEHbfunG';

	function storeUserToken(data) {
		window.localStorage.setItem(twitterKey, JSON.stringify(data));
	}

	function getStoredToken() {
		return window.localStorage.getItem(twitterKey);
	}

	function createTwitterSignature(method, url) {
		var token = angular.fromJson(getStoredToken());
		var oauthObject = {
			oauth_consumer_key: clientId,
			oauth_nonce: $cordovaOauthUtility.createNonce(10),
			oauth_signature_method: 'HMAC-SHA1',
			oauth_token: token.auth_token,
			oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
			oauth_version: '1.0'
		};

		var signatureObj = $cordovaOauthUtility.createSignature(method, url, oauthObject, {}, clientSecret, token.oauth_token_secret);
		$http.defaults.headers.common.Authorization = signatureObj.authorization_header;
	}

	return {
		initialize: function() {
			var deferred = $q.defer();
			var token = getStoredToken();

			if (token !== null) {
				deferred.resolve(true); //resolve promise,user is already authenticated
			} else {
				$cordovaOauth.twitter(clientId, clientSecret).then(function(result) {
					storeUserToken(result);
					deferred.resolve(true);
				}, function(error) {
					deferred.reject(false);
				});
			}

			return deferred.promise;
		}, 
		isAuthenticated: function() {
			return getStoredToken() !== null;
		}, 
		getHomeTimeline: function() {
			var home_tl_url = 'https://api.twitter.com/1.1/statuses/home_timeline.json';
			createTwitterSignature('GET', home_tl_url);
			return $resource(home_tl_url).query();
		},
		//allows us to access functions outside our service
		storeUserToken: storeUserToken,
		getStoredToken: getStoredToken,
		createTwitterSignature: createTwitterSignature
	};
});















































