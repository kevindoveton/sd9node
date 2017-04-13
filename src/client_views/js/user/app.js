'use strict';

// Declare app level module which depends on filters, and services
angular.module('DigiControl', [
	'DigiControl.controllers',
	'DigiControl.filters',
	'DigiControl.services',
	'DigiControl.directives',
	'ui.router'
]).config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
	// ui router
	$stateProvider.state({
		name: 'home',
		url: '/home',
		templateUrl: '/html/partials/home.html',
		controller: 'HomeCtrl'
	});
	
	$stateProvider.state({
		name: 'aux',
		url: '/aux',
		templateUrl: '/html/partials/aux.html',
		controller: 'AuxCtrl',
		params: {
			aux: null
		}
	});
	
	
	
	// default route
	$urlRouterProvider.otherwise('/home');
	
	// localStorageServiceProvider.setPrefix('DigiControl');
	// localStorageServiceProvider.setStorageCookie(10*365, '/', false); // expire in ten years

});
