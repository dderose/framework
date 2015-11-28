;(function ( $, window, document, undefined ) {
    "use strict";

    // Create the defaults once
    var pluginName = "Modal",
        defaults = {
            title: null, // Store a title string
            buttons: [], // Store an object to hold buttons
            modalId: null, // Store the id for progammatically created modals
            disableClose: false, // Boolean for whether to disable close action
            autoOpen: false, // Boolean for whether to open modal on page load
            appendLocation: $('body'), // Where progammatically created or asynchronously loaded modals will be inserted in the DOM
            disableOverflow: false, // Create a page scrolling behavior for the dialog instead of an internal scrollbar,
            setWidth: null,
            maxWidth: null,
            fullScreen: false,
            modalTemplate: $('<div class="Modal is-hidden"><article class="Modal-inner"><button type="button" class="Icon--cross Modal-close js-modalClose"></button></article></div>'), // HTML structure for progammatically created or asynchronously loaded modal content
            modalTitle: $('<h1 class="Modal-heading"></h1>'), // HTML structure for a modal title
            modalButton: $('<button class="Button"></button>'), // HTML structure for a default modal button
            modalActions: $('<div class="Modal-actions"></div>'), // HTML structure for a container for modal buttons
            onOpen: $.noop, // Callback placeholder
            onClose: $.noop, // Callback placeholder
            onBeforeClose: $.noop, // Callback placeholder
            emitEvent:  false // Emit a "change" event
    };

    // The actual plugin constructor
    function Modal (element, options) {
        this.element = element; // this
        this.$element = $(element); // $(this)
        this.$modal = null; // Keep track of our modal
        this.state = 'hidden'; // Store the state of the modal
        this.contentType = null; // Store the type of content
        this._data = this.$element.data(); // data-attributes
        this.mobileScrollTop = 0;



        // Hierarchy of settings: ( lowest < highest )
        // defaults < options passed to JS invocation < data attributes on element
        this.settings = $.extend({}, defaults, options, this._data);
        this._defaults = defaults;
        this._name = pluginName;
        this.options = options || {};

        //initialize the modal
        this.init();
    }

    Modal.prototype = {
        init: function () {
            // modal is just easier recognize/remember
            var modal = this;

            // Set the content type
            if(this.settings.async === true) {
                this.contentType = 'async';
            } else if(this.$element.hasClass('js-modal') === true || this.$element.hasClass('Modal')) {
                this.contentType = 'inline';
            } else {
                this.contentType = 'dynamic';
            }

            // For inline Modal content
            if(this.contentType === 'inline') {
                // Store the corresponding modal object

                if(this.settings.modalId) {
                    this.$modal = $('#' + this.settings.modalId);
                } else {
                    this.$modal = $('#' + this.$element.attr('id'));
                }

                // Remove close button if disableClose is enabled
                if(this.settings.disableClose === true) {
                    this.$modal.find('.Modal-close').remove();
                }
            }

            // Create modals for dynamically loaded content
            if(this.contentType === 'dynamic') {
            // if(this.contentType === 'async' || this.contentType === 'dynamic') {
                $.proxy(modal.create, modal)(this.$element);
            }

            // If a title option has been passed create the Modal heading and prepend it to the modal
            if(this.settings.title !== null) {
                var $modalTitle = this.settings.modalTitle.clone();
                $modalTitle.text(this.settings.title);
                this.$modal.find('.Modal-inner').prepend($modalTitle);
            }

            // If a button object has been passed create the buttons and append them to the bottom of the modal. Only works on programmatically created modals
            if(this.settings.buttons !== null && this.settings.buttons.length > 0 && this.settings.buttons[0].text && typeof this.settings.buttons === 'object') {
                // Append the modal actions container to the modal
                var $modalActions = this.settings.modalActions.clone();
                this.$modal.find('.Modal-inner').append($modalActions);

                // Loop through the array of buttons
                for(var i = 0; i < this.settings.buttons.length; i++) {
                    // Create a new button
                    var $modalButton = this.settings.modalButton.clone();

                    // Add id, class(es), and text to the new button
                    $modalButton.addClass(this.settings.buttons[i]['class']).attr('id',this.settings.buttons[i].id).attr('data-id',this.settings.buttons[i].dataAttr).text(this.settings.buttons[i].text);
                    
                    // Append the button to the modal
                    $modalActions.append($modalButton);

                    // Add a click event
                    if(typeof(this.settings.buttons[i].click) === "function") {
                        $modalButton.on("click.modal", this.settings.buttons[i].click);
                    }
                }
            }

            // Check to see if the Modal is supposed to open on page load
            if(this.settings.autoOpen === true) {
                $.proxy(modal.show, modal)(this.$element);
            }

            // Add scrollbar to the overlay (.Modal), change overflow to visible on the dialog (.Modal-inner) and remove the max-height so we don't get content spilling outside the dialog
            if(this.settings.disableOverflow === true) {
                this.$modal.css('overflow','scroll');
                this.$modal.find('.Modal-inner').css({
                    'max-height': 'none',
                    'overflow': 'visible'
                });
            }
                    
            // If the Modal is initialized from static content, bind the trigger to the show function
            if(this.contentType === 'inline') {
                $(document).on('click.modal', '.js-modal[data-modal-id=' + this.$element.data('modal-id') + ']', function(e) {
                    e.preventDefault();

                    $.proxy(modal.show, modal)();
                });
            }

            // If the Modal is initialized from static content, bind the trigger to the show function
            if(this.contentType === 'async') {
                $(document).on('click.modal', '.js-modal[data-modal-id=' + this.$element.data('modal-id') + ']', function(e) {
                    e.preventDefault();
                
                    $.proxy(modal.create, modal)(this.$element);
                    $.proxy(modal.show, modal)();
                });
            }
        },

        show: function () {
            var modal = this;

            // Show the modal
            this.$modal.removeClass('is-hidden');
            this.$modal.attr('aria-hidden','false');
            this.state = 'shown';

            // todo - dear dan2, I had to comment this out so people can leave comments, because otherwise that modal inner part can't scroll so you can't see the whole image and on smaller screens you can't see the save comment button
            // Prevent double scroll bar by freezing page content
            //$(window).disablescroll({
            //    scrollEventKeys: [33, 34, 35, 36]
            //});

            if (Modernizr.touch){
                this.mobileScrollTop = $('body').scrollTop();
            }

            // Bind the esc key to the hide function
            $(document.body).on('keyup.modalClose', function(e) {
                if(e.which === 27 && modal.state === 'shown' && modal.settings.disableClose === false) {
                    // D2 - this is bad... I get it
                    if (Crayon.collectionHelpers.select2open() === true) {
                        return false;
                    } else {
                        e.preventDefault();
                        $.proxy(modal.close, modal)();
                    }

                }
            });

            // Bind clicking on the overlay background to the hide function; this is delegated and will work with dynamically added content
            this.$modal.on('click.modalClose', function(e) {
                if (modal.state === 'shown' && $(e.target).closest('.Modal-inner').length === 0 && modal.settings.disableClose === false) {
                    $.proxy(modal.close, modal)();
                }
            });

            // Bind the close button to the close function
            this.$modal.on('click.modalClose', '.js-modalClose', function(e) {
                if (modal.state === 'shown') {
                    $.proxy(modal.close, modal)();
                }
            });

            // Emit a show event
            if (this.settings.emitEvent) {
                this.$element.trigger('modalShow');
            }

            // Add callback function that executes after the modal is closed
            if (typeof(this.settings.onOpen) === "function") {
                this.settings.onOpen.call(this);
            }
        },

        close: function () {
            var modal = this;
            
            // Add onBeforeClose callback function
            if (typeof(this.settings.onBeforeClose) === "function" && this.settings.onBeforeClose() === false) {
                return;
            }

            // Hide the modal
            this.$modal.addClass('is-hidden');
            this.$modal.attr('aria-hidden','true');
            this.state = 'hidden';

            // Remove scroll lock from page content
            // $(window).disablescroll('undo');

            if (Modernizr.touch){
                window.scrollTo(0, this.mobileScrollTop);
            }


            // Add callback function that executes after the modal is closed
            if (typeof(this.settings.onClose) === "function") {
                this.settings.onClose.call(this);
            }

            // Unbind document event handlers for closing the modal
            $(document.body).off('click.modalClose keyup.modalClose');

            // Create modals for dynamically loaded content
            if(this.contentType === 'dynamic') {
                this.$modal.remove();
            }

            // Emit a close event
            if (this.settings.emitEvent) {
                this.$modal.find('.Modal-close').trigger('modalClose');
            }
        },

        create: function($obj) {
            // Clone the modal container structure
            var $modalTemplate = this.settings.modalTemplate.clone();

            // Remove the close button if the disableClose setting has been set to true
            if(this.settings.disableClose === true) {
                $modalTemplate.find('.Modal-close').remove();
            }

            // Set the fullScreen modifier
            if(this.settings.fullScreen === true) {
                $modalTemplate.addClass('Modal--fullScreen');
            }

            // If an id is passed, add it to the Modal
            if(this.settings.modalId !== null) {
                $modalTemplate.attr('id',this.settings.modalId);
            }

            // If content is passed in during the initialization we need to construct the appropriate markup to wrap around it
            if(this.contentType === 'dynamic') {
                $modalTemplate.find('.Modal-inner').append($obj);

                this.$modal = $modalTemplate;
                this.$modal.appendTo(this.settings.appendLocation);
            }

            if(this.settings.maxWidth) {
                $modalTemplate.find('.Modal-inner').css('max-width',this.settings.maxWidth);
            }

            if(this.settings.setWidth) {
                $modalTemplate.find('.Modal-inner').css('width',this.settings.setWidth);
            }


            // If the content is asynchronous then fetch the data, insert it into the Modal structure, and append to the body
            // if(this.$element.data('async') === true) {
            if(this.contentType === 'async') {
                var $this = this;

                $this.$modal = $modalTemplate;

                $.ajax({
                    url: this.element.href,
                    type: 'get',
                    dataType: 'html',
                    async: false,
                    success: function(data) {
                        $this.$modal.find('.Modal-inner').append($(data));
                        $this.$modal.appendTo($this.settings.appendLocation);
                    }
                });
            }
        }
    };

// A really lightweight plugin wrapper around the constructor,
// preventing against multiple instantiations and allowing any
// public function (ie. a function whose name doesn't start
// with an underscore) to be called via the jQuery plugin,
// e.g. $(element).defaultPluginName('functionName', arg1, arg2)
$.fn[pluginName] = function ( options ) {
    var args = arguments;

    // Is the first parameter an object (options), or was omitted,
    // instantiate a new instance of the plugin.
    if (options === undefined || typeof options === 'object') {
        return this.each(function () {

            // Only allow the plugin to be instantiated once,
            // so we check that the element has no plugin instantiation yet
            if (!$.data(this, 'plugin_' + pluginName)) {

                // if it has no instance, create a new one,
                // pass options to our plugin constructor,
                // and store the plugin instance
                // in the elements jQuery data object.
                $.data(this, 'plugin_' + pluginName, new Modal( this, options ));
            }
        });

    // If the first parameter is a string and it doesn't start
    // with an underscore or "contains" the `init`-function,
    // treat this as a call to a public method.
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

        // Cache the method call
        // to make it possible
        // to return a value
        var returns;

        this.each(function () {
            var instance = $.data(this, 'plugin_' + pluginName);

            // Tests that there's already a plugin-instance
            // and checks that the requested public method exists
            if (instance instanceof Modal && typeof instance[options] === 'function') {

                // Call the method of our plugin instance,
                // and pass it the supplied arguments.
                returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
            }

            // Allow instances to be destroyed via the 'destroy' method
            if (options === 'destroy') {
                var data = $.data(this, 'plugin_' + pluginName);
                data.$element.off('click.modal');
                $(document).off('keyup.modal');
                $.data(this, 'plugin_' + pluginName, null);
            }
        });

        // If the earlier cached method
        // gives a value back return the value,
        // otherwise return this to preserve chainability.
        return returns !== undefined ? returns : this;
    }
};

})( jQuery, window, document );