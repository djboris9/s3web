/* 
 * Copyright (C) 2013 djboris.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301  USA
 */
'use strict';

var s3web = angular.module('s3web', [
  'ngRoute',
  's3webControllers',
  's3webFilters',
  's3webServices'
]);

s3web.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/auth/', {
        templateUrl: 'partials/auth.html',
        controller: 'AuthCtrl'
      }).
      when('/browse/:bucket/', {
        templateUrl: 'partials/browse.html',
        controller: 'BrowseCtrl',
        reloadOnSearch: false /* TODO: Add option in gui to manage this */
      }).
      otherwise({
        redirectTo: '/auth'
      });
  }]);