'use strict';

Orangee.Application = Marionette.Application.extend({
  initialize: function(options) {
    //console.log("Orangee.Application#initialize");
    orangee.init();
    if (options && options['youtube']) {
      orangee._loadYoutubeApi();
    }
  },
});

Orangee.Model = Backbone.Model.extend({
  initialize: function() {
    // Applies the mixin:
    Backbone.Select.Me.applyTo(this);
  },
  toJSON: function() {
    //http://stackoverflow.com/questions/15298449/cannot-get-the-cid-of-the-model-while-rendering-a-backbone-collection-over-a-tem
    var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
    json.cid = this.cid;
    return json;
  },
});

Orangee.XMLModel = Orangee.Model.extend({
  fetch: function(options) {
    options = options || {};
    options.dataType = "html";
    return Backbone.Model.prototype.fetch.apply(this, arguments);
  },
  parse: function(xml) {
    return orangee.xml2json(xml);
  },
});

//http://jaketrent.com/post/backbone-inheritance/
Orangee.Collection = Backbone.PageableCollection.extend({
  initialize: function(models, options) {
    // Applies the mixin:
    Backbone.Select.One.applyTo(this, models, options);
    this.currentPosition = 0;
  },
  selectPrev: function(offset) {
    this.currentPosition -= (offset || 1);
    if (this.currentPosition < 0) {
      //this.currentPosition = 0;
      this.currentPosition += (offset || 1);
      return;
    }
    this.select(this.at(this.currentPosition));
  },
  selectNext: function(offset) {
    this.currentPosition += (offset || 1);
    if (this.currentPosition >= this.length) {
      //this.currentPosition = this.length - 1;
      this.currentPosition -= (offset || 1);
      return;
    }
    this.select(this.at(this.currentPosition));
  },
  selectModel: function(model) {
    this.currentPosition = this.indexOf(model);
    this.select(model);
  },
});

Orangee.XMLCollection = Orangee.Collection.extend({
  fetch: function(options) {
    options = options || {};
    options.dataType = "html";
    return Backbone.Collection.prototype.fetch.apply(this, arguments);
  },
  parse: function(xml) {
    var json = orangee.xml2json(xml);
    return json.rss.channel.item;
  },
});

Orangee.OPMLCollection = Orangee.XMLCollection.extend({
  parse:function(xml) {
    //orangee.debug(xml);
    //var response = {data: json.opml.body.outline.map(function(x) {return {name: x._title, standardPic: x._img, url: x._url}})}
    var json = orangee.xml2json(xml);
    return json.opml.body.outline;
  },
});

Orangee.RSSCollection = Orangee.XMLCollection.extend();