s3web
=====
Danger: This project hasn't reached an alpha-status

This project implements an basic Amazon S3 bucket browser, which is fully webbased and doesn't require any dynamic webcontent.

Installation
====
Do this on a static web directory (can be published in S3):

    git clone https://github.com/djboris9/s3web.git
    cd s3web/public_html/
    cp config_example.js config.js
    vi config.js # Customize the configuration
    # Now point your Webserver to public_html

You need to enable CORS on all buckets you want to access. Look at this [S3 CORS doc](http://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html)

Technologies used
====
* [AngularJS](http://angularjs.org/)
* [Twitter Bootstrap](http://getbootstrap.com)
* [CryptoJS](to-js.googlecode.com/)

THANK YOU

TODO
====
* Make UI to look beautiful
* Implement DELETE/PUT function
* Implement REST ListAllMyBuckets function
* Implement an encrypted secure key 'safe'
* Implement GET/SET ACL on objects
* Implement versioning support
* Provide online version
