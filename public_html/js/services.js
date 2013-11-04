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

var s3webServices = angular.module('s3webServices', []);

s3webServices.factory('AWSConnection', function() {
    var cfg = {key: "", host: "", secret: ""};
    var connected = false;

    return {
        listBucket: function(bucket, callback) {
            if (connected) {
                var CanonicalizedResource = '/' + bucket + '/';
                var res = amzlib.get(cfg, CanonicalizedResource);
                res.onreadystatechange = function() {
                    if (res.readyState === 4 && res.status === 200)
                    {
                        var files = [];
                        
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
                            files.push(fo);
                        }

                        /* 
                         * Fix tree 
                         */
                        var tree = [];

                        for (var i = 0; i < files.length; i++) {
                            tree.push(files[i].Key);
                        }
                        //Go through every file in the tree from s3
                        for (var i = 0; i < tree.length; i++) {
                            var file = tree[i].replace(/\/$/g, '').split('/');

                            // Go through every dirname
                            for (var j = 1; j < file.length - 2; j++) {

                                // Check if dir isn't in the tree
                                var dirname = file.slice(0, j).join('/') + '/';
                                if (tree.indexOf(dirname) === -1) {
                                    // Create dummy dir
                                    tree.push(dirname);
                                    files.push(
                                            {
                                                "Key": dirname,
                                                "StorageClass": "Dummy",
                                                "Size": 0
                                            });
                                }
                            }
                        }
                        callback(files);
                    }
                };
            } else {
                callback();
            }
        },
        getObjectLink: function(bucket, key) {
            if (connected) {
                var CanonicalizedResource = '/' + bucket + '/' + key;
                return amzlib.getObjectLink(cfg, CanonicalizedResource);
            } else {
                return;
            }
        },
        connect: function(key, secret, host) {
            cfg = new amzlib.cfg(key, secret, host);
            connected = true;
        },
        disconnect: function() {
            cfg = null;
            connected = false;
        },
        isConnected: function() {
            return connected;
        },
        getKey: function() {
            return cfg.key;
        },
        getHost: function() {
            return cfg.host;
        },
        getSecret: function() {
            return cfg.secret;
        }
    };
});