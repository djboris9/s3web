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


var s3webControllers = angular.module('s3webControllers', ['ngRoute']);

s3webControllers.controller('MainCtrl', ['$scope', 'AWSConnection',
    function($scope, AWSConnection) {
        $scope.isConnected = function() {
            return AWSConnection.isConnected();
        };

    }]);


s3webControllers.controller('AuthCtrl', ['$scope', 'AWSConnection', '$location',
    function($scope, AWSConnection, $location) {
        $scope.key = AWSConnection.getKey();
        $scope.host = AWSConnection.getHost();
        $scope.secret = AWSConnection.getSecret();

        if ($scope.host === "") {
            $scope.host = CFG.AMZ_HOST;
        }
        if ($scope.key === "") {
            $scope.key = CFG.DEMO_KEY;
        }
        if ($scope.secret === "") {
            $scope.secret = CFG.DEMO_SECRET;
        }

        $scope.login = function() {
            AWSConnection.connect($scope.key, $scope.secret, $scope.host);
            // TODO: Find a better place
            $location.path("/browse/");

        };
    }]);

s3webControllers.controller('BrowseCtrl', ['$scope', '$routeParams', 'AWSConnection', '$location',
    function($scope, $routeParams, AWSConnection, $location) {
        $scope.actual_dir = $routeParams.path || '';
        $scope.bucket = $routeParams.bucket;
        $scope.loaded = false;
        
        $scope.$on('$routeUpdate', function() {
            $scope.actual_dir = $routeParams.path;
        });

        $scope.$watch('actual_dir', function() {
            $location.search("path", $scope.actual_dir);
        });

        $scope.getFiles = function(bucket) {
            function callback(files) {
                if (typeof files === 'undefined')
                    $location.path('/auth');
                
                $scope.$apply(function() {
                    $scope.files = files;
                });
            }
            AWSConnection.listBucket(bucket, callback);
        };

        $scope.getObjectLink = function(bucket, key) {
            return AWSConnection.getObjectLink(bucket, key);
        };

        $scope.refresh = function() {
            $location.search("bucket", $scope.bucket);
            $scope.getFiles($scope.bucket);
            $scope.loaded = true;
        };
    }]);

s3webControllers.controller('FileCtrl', ['$scope', 'AWSConnection', '$location',
    function($scope, AWSConnection, $location) {
        $scope.open = function(file) {
            $location.search("path", (file.Key));
        };
    }]);








/*function rec(x) {
 for (var i = 0; i < x.childElementCount; i++) {
 var c = x.childNodes[i];
 if (c.childElementCount > 0) {
 $("#cnt").append("Going into: " + c.nodeName + "<br />");
 rec(c);
 } else {
 $("#cnt").append(" --> " + c.nodeName + ":" + c.textContent + "<br />");
 }
 }
 }
 console.log();//ListBucketResult"));
 */