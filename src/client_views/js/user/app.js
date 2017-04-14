'use strict';

// Declare app level module which depends on filters, and services
angular.module('DigiControl', [
	'DigiControl.controllers',
	'DigiControl.filters',
	'DigiControl.services',
	'DigiControl.directives',
	'ui.router',
	'btford.socket-io',
	'rzModule'
]).config(function ($stateProvider, $urlRouterProvider) {
	// ui router
	$stateProvider.state({
		name: 'home',
		url: '/home',
		templateUrl: '/static/html/partials/home.html',
		controller: 'HomeCtrl'
	});
	
	$stateProvider.state({
		name: 'aux',
		url: '/aux/:id',
		templateUrl: '/static/html/partials/aux.html',
		controller: 'AuxCtrl',
	});
	
	$stateProvider.state({
		name: 'engFaders',
		url: '/eng/faders/{id:int}',
		templateUrl: '/static/html/partials/eng_faders.html',
		controller: 'EngFaderCtrl',
	})
	
	$stateProvider.state({
		name: 'eng',
		url: '/eng/select',
		templateUrl: '/static/html/partials/eng_select.html',
		controller: 'EngSelectCtrl'
	});
	
	
	
	// default route
	$urlRouterProvider.otherwise('/home');
	
	// localStorageServiceProvider.setPrefix('DigiControl');
	// localStorageServiceProvider.setStorageCookie(10*365, '/', false); // expire in ten years
});
