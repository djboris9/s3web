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

var amzlib = {
    cfg: function(key, secret, host) {
        this.key = key;
        this.secret = secret;
        this.host = host;
    },
    get: function(cfg, CanonicalizedResource, mime) {
        return this.__req(cfg.key, cfg.secret, cfg.host, 'GET', CanonicalizedResource, mime);
    },
    getObjectLink: function(cfg, CanonicalizedResource) {
        var expire = Math.floor((new Date()).getTime() / 1000 + CFG.EXPIRE);
        var auth = this.__auth(cfg.secret, 'GET', CanonicalizedResource, "", expire);
        var signature = encodeURIComponent(auth["signature"]);

        return  cfg.host + 
                CanonicalizedResource +
                "?AWSAccessKeyId=" + cfg.key + 
                "&Expires=" + expire + 
                "&Signature=" + signature;
    },
    __auth: function(secret, HTTPVerb, CanonicalizedResource, headers, expire) {
        var ContentMD5 = "";
        var ContentType = "";
        var AmzDate = expire || "";
        var CanonicalizedAmzHeaders = headers || "";

        var stringtosign =
                HTTPVerb + "\n" +
                ContentMD5 + "\n" +
                ContentType + "\n" +
                AmzDate + "\n" +
                CanonicalizedAmzHeaders +
                CanonicalizedResource;

        stringtosign = stringtosign.toString(CryptoJS.enc.Utf8);
        var hash = CryptoJS.HmacSHA1(stringtosign, secret);

        hash = hash.toString(CryptoJS.enc.Base64);
        return {
            "signature": hash
        };
    },
    __req: function(key, secret, host, HTTPVerb, CanonicalizedResource, mime) {
        mime = mime || '';
        var today = (new Date()).toUTCString();
        var headers = "x-amz-date:" + today + "\n";
        var auth = this.__auth(secret, HTTPVerb, CanonicalizedResource, headers);
        var signature = auth["signature"];

        // Request
        var req = new XMLHttpRequest();
        var url = host + CanonicalizedResource;
        req.open('GET', url, true);
        req.withCredentials = true;
        req.setRequestHeader('X-Amz-Date', today);
        req.setRequestHeader('Authorization', 'AWS ' + key + ':' + signature);

        if (mime.length > 0)
            req.overrideMimeType(mime);

        req.onreadystatechange = function() {
            //return req;
        };
        req.send();
        return req;
    }
};