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

/* Filters */

angular.module('s3webFilters', []).filter('startswith', function() {
    return function(path, start) {
        return (path.indexOf(start) === 0);
    };
})
        .filter('endswith', function() {
            return function(path, end) {
                path = path || '';
                return (path.indexOf(end, path.length - end.length) !== -1);
            };
        })

        .filter('indir', function() {
            return function(files, dir) {
                files = files || [];
                dir = dir || '';
                
                var dirname = dir.replace(/\/$/g, '').split('/');

                return files.filter(function(a) {
                    var key = a.Key.replace(/\/$/g, '').split('/');

                    return ((dirname.length + 1 === key.length &&
                            a.Key.indexOf(dir) === 0 && 
                            dir.length !== 0) || 
                            (dir.length === 0 && key.length === 1));

                });
            };
        })
        .filter('basename', function() {
            return function(path) {
                var suffix = '';

                /* Preserve dir suffix */
                if (path.lastIndexOf('/') === path.length - 1)
                    suffix = '/';

                path = path.replace(/\/$/g, '').split('/');
                return path[path.length - 1] + suffix;
            };
        })
        .filter('dirname', function() {
            return function(path) {
                path = path.replace(/\/$/g, '').split('/');
                return path[path.length - 2];
            };
        })
        .filter('log', function() {
            return function(obj) {
                console.log(obj);
                return obj;
            };
        });
        // TODO: Implement File Size Converter