(function (root, factory) {
    
    root.RNAV = factory(root);
    
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    'use strict';

    //
    // Variables
    //

    var RNAV = {}; // Object for public APIs
    var supports = !!document.querySelector && !!root.addEventListener; // Feature test
    var settings; // Placeholder variables

    // Default settings
    var defaults = {
        direction: 'down',
        initClass: 'js-rnav',
        modalID: 'RNAV-modal',
        logoPath: false,
        menuItems: [],
        callbackBefore: function () {},
        callbackAfter: function () {}
    };


    //
    // Methods
    //

    // @todo add plugin methods here
    
    /**
     * $.extend() equivalent - credits to: https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
     */
 // Pass in the objects to merge as arguments.
 // For a deep extend, set the first argument to `true`.
 var extend = function () {

     // Variables
     var extended = {};
     var deep = false;
     var i = 0;
     var length = arguments.length;

     // Check if a deep merge
     if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
         deep = arguments[0];
         i++;
     }

     // Merge the object into the extended object
     var merge = function (obj) {
         for ( var prop in obj ) {
             if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                 // If deep merge and property is an object, merge properties
                 if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                     extended[prop] = extend( true, extended[prop], obj[prop] );
                 } else {
                     extended[prop] = obj[prop];
                 }
             }
         }
     };

     // Loop through each object and conduct a merge
     for ( ; i < length; i++ ) {
         var obj = arguments[i];
         merge(obj);
     }

     return extended;

 };
    /**
     * Handle events
     * @private
     */
	 /* Open when someone clicks on the span element */
	 var openNav = function () {
		 if(RNAV.options.direction == 'down'){
		     document.getElementById(RNAV.options.modalID).style.height = "100%";
		 }else if(RNAV.options.direction == 'right'){
		     document.getElementById(RNAV.options.modalID).style.width = "100%";
		 }
		 document.body.classList.remove('RNAV-modal-open');
	     document.body.classList.add('RNAV-modal-open');
//	     $('main').removeClass('modal-open').addClass('modal-open');
//	     $('.navigation-toggle').hide();
	     document.getElementById('RNAV-modal-close-btn').style.display = "none";
	     document.getElementById('RNAV-modal-close-btn').style.display = "block";
	     
	 }

	 /* Close when someone clicks on the "x" symbol inside the overlay */
	 var closeNav = function () {
		 if(RNAV.options.direction == 'down'){
		     document.getElementById(RNAV.options.modalID).style.height = "0%";
		 }else if(RNAV.options.direction == 'right'){
		     document.getElementById(RNAV.options.modalID).style.width = "0%";
		 }
		 document.body.classList.remove('RNAV-modal-open');
//	     $('main').removeClass('modal-open');
//	     $('.navigation-toggle').show();
	     document.getElementById('RNAV-modal-close-btn').style.display = "none";
	 };
	 

	 RNAV.options = {};
	 RNAV.openNavigation = function(){
		 openNav();
	 };
	 RNAV.closeNavigation = function(){
		closeNav(); 
	 };
    /**
     * Destroy the current initialization.
     * @public
     */
    RNAV.destroy = function () {

        // If plugin isn't already initialized, stop
        if ( !settings ) return;

        // Remove init class for conditional CSS
        document.documentElement.classList.remove( settings.initClass );

        // @todo Undo any other init functions...

        // Reset variables
        settings = null;

    };
    var stripQuotes = function(str){
    	var res = String(str).replace('"','');
    	res = String(res).replace("'",'');
    	return res;
    };


    var getNodeHTML = function(node){
        if(!node || !node.tagName) return '';
        if(node.outerHTML) return node.outerHTML;

        // polyfill:
        var wrapper = document.createElement('div');
        wrapper.appendChild(node.cloneNode(true));
        return wrapper.innerHTML;
    };


    var generateMenuItemHTML = function(options){
    	var tmpHTML = '';
    	if(options.menuItems.length == 0){
    		//no items
    		console.log('RNAV: No menu items set.');
    	}else{
    		//go through each element
    		Array.prototype.forEach.call(options.menuItems, function(el, i){
				var tmpMenuItem = document.createElement("div");
				tmpMenuItem.classList.add("overlay-menu-item");
				tmpMenuItem.innerHTML = el.html;
				Array.prototype.forEach.call(el.attributes, function(attr,j){
					var attrRaw = String(attr).split("=");
					var attrName = attrRaw[0];
					var attrValue = stripQuotes(attrRaw[1]);
					tmpMenuItem.setAttribute(attrName,attrValue);
				});
				tmpHTML += getNodeHTML(tmpMenuItem);
    		});
    		
    	}
    	return tmpHTML;
    };	
    var setOverlayItems = function(overlayContentDOM,options){
    	var originalHTML = overlayContentDOM.innerHTML;
    	
    	var tmpHTML = originalHTML + generateMenuItemHTML(options);
    	
    	overlayContentDOM.innerHTML = tmpHTML;
    	
    	return overlayContentDOM;
    };
    var setOverlayHeader= function(overlayContentDOM,options){
    	var overlayHeader = document.createElement("div");
    	overlayHeader.classList.add("overlay-logo-container");
    	
    	var tmpHTML = '';
    	if(options.logoPath){
    		//logo
    		tmpHTML += '<img src="'+options.logoPath+'" alt="RNAV Logo"/>';
			
    	}else{
    		//no logo
    	}
    	tmpHTML += '<div id="RNAV-modal-close-btn" onclick="RNAV.closeNavigation()" href="javascript:void(0)" class="closebtn">&times;</div>';
    	overlayHeader.innerHTML = tmpHTML;
    	overlayContentDOM.appendChild(overlayHeader);
    	
    	return overlayContentDOM;
    };
    
    var createNavigationToggle = function(){
//    	<div id="RNAV-OpenNavigationWrapper" class="" >
//	    	<div class="navigation-toggle js-navigation-toggle" onclick="RNAV.openNavigation();">
//	    	    <span class="navigation-toggle__bar"></span>
//	    	    <span class="navigation-toggle__bar"></span>
//	    	    <span class="navigation-toggle__bar"></span>
//	    	    <span class="navigation-toggle__bar"></span>
//	    	</div>
//	    <!-- /.navigation-toggle -->
//	    </div>
    	var RNAVWrapper = document.createElement("div");
    	RNAVWrapper.setAttribute("id","RNAV-OpenNavigationWrapper");
    	var navToggle = document.createElement("div");
    	navToggle.classList.add("navigation-toggle");
    	navToggle.setAttribute("id","RNAV-NavToggle");
    	
    	navToggle.innerHTML = '<span class="navigation-toggle__bar"></span><span class="navigation-toggle__bar"></span><span class="navigation-toggle__bar"></span><span class="navigation-toggle__bar"></span>';
    	RNAVWrapper.appendChild(navToggle);
    	
    	return RNAVWrapper;
    };
    
    var setupDOM = function(options){
    	console.log('RNAV-options',options);
    	if(document.getElementById(options.modalID) == null){
    		
    		
    		//create the element if it doesn't exist
    		var modalWrapper = document.createElement("div");
    		modalWrapper.setAttribute("id",options.modalID);
    		modalWrapper.classList.add("RNAV-overlay");
    		
    		//.RNAV-overlay
    		///* Height & width depends on how you want to reveal the overlay (see JS below) */   
    		//height: 0;
    		//width: 100%;
    		if(options.direction == "down"){
    			modalWrapper.style.height = 0;
    			modalWrapper.style.width = '100%';
    		}else if(options.direction == "right"){
    			modalWrapper.style.width = 0;
    			modalWrapper.style.height = '100%';
    		}
    		
    		var modalInnerWrapper = document.createElement("div");
    		modalInnerWrapper.classList.add("overlay-content");
    		
    		modalInnerWrapper = setOverlayHeader(modalInnerWrapper,options);
    		modalInnerWrapper = setOverlayItems(modalInnerWrapper,options);
    		
    		modalWrapper.appendChild(modalInnerWrapper);
    		

    		document.body.appendChild( createNavigationToggle() );
    		document.body.appendChild(modalWrapper);
    		
    		
    	}else{
    		//nothing to create - already exists
    	}
    };

    var DOMready = function(){
		document.getElementById('RNAV-NavToggle').onclick = RNAV.openNavigation;
    };
    /**
     * Initialize Plugin
     * @public
     * @param {Object} options User settings
     */
    RNAV.init = function ( options ) {

        // feature test
        if ( !supports ) return;

        // Destroy any existing initializations
        RNAV.destroy();

        // Merge user options with defaults
        settings = extend( defaults, options || {} );

        // Add class to HTML element to activate conditional CSS
        document.documentElement.classList.add( settings.initClass );

        setupDOM(settings);
        
        RNAV.options = settings;
        
        document.getElementById('RNAV-NavToggle').onclick = RNAV.openNavigation;
        
//        window.onload = function(){
//        	DOMready();
//        }
    };


    //
    // Public APIs
    //

    return RNAV;

});

