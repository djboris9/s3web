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
                        callback(res);
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