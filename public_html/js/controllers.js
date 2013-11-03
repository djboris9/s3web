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
        $scope.actual_dir = $routeParams.path;
        $scope.bucket = $routeParams.bucket;

        $scope.$on('$routeUpdate', function() {
            $scope.actual_dir = $routeParams.path;
        });

        $scope.$watch('actual_dir', function() {
            $location.search("path", $scope.actual_dir);
        });

        $scope.getFiles = function(bucket) {
            /*
             *  XXX: Refactor -> Move formatting to service
             */
            function callback(res) {
                if (typeof res === 'undefined') {
                    $location.path("/auth");
                }
                else {
                    $scope.$apply(function() {
                        $scope.files = [];

                        var x = res.responseXML.documentElement;
                        var c = x.getElementsByTagName("Contents");

                        /* Go through files */
                        for (var i = 0; i < c.length; i++) {
                            var fo = {};

                            /* Go through file parameters */
                            for (var j = 0; j < c[i].children.length; j++) {
                                var key = c[i].children[j].tagName;
                                var value = c[i].children[j].textContent;
                                fo[key] = value;
                            }
                            $scope.files.push(fo);
                        }
                    });
                }

                /* 
                 * Fix tree 
                 */
                var tree = [];

                for (var i = 0; i < $scope.files.length; i++) {
                    tree.push($scope.files[i].Key);
                }
                for (var i = 0; i < tree.length; i++) {
                    var file = tree[i].replace(/\/$/g, '').split('/');

                    // Go through every dirname
                    for (var j = 1; j < file.length - 2; j++) {

                        // Check if dir isn't in the tree
                        var dirname = file.slice(0, j).join('/') + '/';
                        if (tree.indexOf(dirname) === -1) {
                            // Create dummy dir
                            tree.push(dirname);
                            $scope.$apply(function() {
                                $scope.files.push(
                                        {
                                            "Key": dirname,
                                            "StorageClass": "Dummy",
                                            "Size": 0
                                        });
                            });
                        }
                    }
                }

            }
            AWSConnection.listBucket(bucket, callback);
        };

        $scope.getObjectLink = function(bucket, key) {
            return AWSConnection.getObjectLink(bucket, key);
        };

        /* Intitialize */
        $scope.getFiles($scope.bucket);
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