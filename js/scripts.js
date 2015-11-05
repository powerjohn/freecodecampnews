var Actors={
	init: function( config){
		this.config = config;
		this.setUpTemplates();
		this.bindEvents();
		$('button').remove();
		$.ajaxSetup({
			url: 'index.php',
			type: 'POST'
		});
	},
	bindEvents: function(){
		this.config.letterSelection.on('change', this.fetchActors);
		this.config.actorsList.on('click', 'li', this.displayAuthorInformation);
	},

	setUpTemplates: function(){
		this.config.actorListTemplate = Handlebars.compile(this.config.actorListTemplate);
		this.config.actorInfoTemplate = Handlebars.compile(this.config.actorInfoTemplate);
		Handlebars.registerHelper('fullName', function(actor){
			return actor.first_name + ' ' + actor.last_name;
		});
	},

	fetchActors: function(){
		var self = Actors;
		
		$.ajax({
			data: self.config.form.serialize(),
			dataType: 'json',
			success: function(results){
				self.config.actorsList.empty();
				if(results[0]){
				self.config.actorsList.append(self.config.actorListTemplate(results) );
				}else{
					self.config.actorsList.append('<li>No results match that search</li>');
				}
			}
		});
	},

	displayAuthorInformation: function(e){
		var self = Actors;

		$.ajax({
			data: {actor_id: $(this).data('actor_id')}

		}).done(function(results){
			self.config.actorInfo.html( self.config.actorInfoTemplate({info: results}));
		});
		e.preventDefault();
	}

};

Actors.init({
	letterSelection: $('#q'),
	form: $('#actor-selection'),
	actorListTemplate: $('#actor_list_template').html(),
	actorInfoTemplate: $('#actor_info_template').html(),
	actorsList: $('ul.actors_list'),
	actorInfo: $('div.actor_info')
});