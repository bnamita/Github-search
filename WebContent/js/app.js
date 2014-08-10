function App(){}
App.prototype = {
	/* Function to initialize the application on load */
	 initialize: function() {
		 var self = this;
		 this.table = null,
		 this.dataset = {},
		/* Click event on Search button */
		$("#searchBtn").on("click", function() {
			/* hide previous result details */
			self.refreshView();
			/* Make an AJAX call to github and retrieve results */
			var query = $("#search").val();
			var url = "https://api.github.com/legacy/repos/search/" + query;
			self.getAjax(url);
			
			
		});
	
		/* To keep the results div always visible in case of scroll down */
		var offset = $('#resultDetails').offset();
		$(window).scroll(function() {
			var scrollTop = $(window).scrollTop(); // check the visible top of the
													// browser
			if (offset.top < scrollTop) {
				$('#resultDetails').addClass('fixed');
			} else {
				$('#resultDetails').removeClass('fixed');
			}
		});
	},
	
	getAjax: function(url){
		var self = this;
		$.ajax({
			url : url,
			success : function(data) {
				self.displayResults(data);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest.status == 0) {
					alert(' Check Your Network.');
				} else if (XMLHttpRequest.status == 404) {
					alert('Requested URL not found.');
				} else if (XMLHttpRequest.status == 500) {
					alert('Internel Server Error.');
				} else {
					alert('Unknow Error.\n' + XMLHttpRequest.responseText);
				}
			}
		});
	},
	
	 refreshView :function(){
		$("#loading").show();
		$("#resultDetails").hide();
		$('#searchResults').hide();
		$("#errorMsg").hide();
	},
	
	/* Displays search results in Jquery datatable */
	 displayTable: function() {
		$("#loading").hide();
		if (!this.table) {
			/* create and configure jquery datatable */
			this.table = $('#searchResultsTable').dataTable({
				"data" : this.dataset,
				"order" : [ [ 1, "desc" ] ],
				"columns" : [ {
					data : "owner",
					title : "Owner/Name",
					render : function(data, type, full, meta) {
						return "<a class='search_table_column' href='#'> " + full.owner + "/" + full.name + "</a>";
					}
				}, {
					data : "score",
					title : "Score",
					visible : false,
	
				} ],
	
			});
		} else {
			this.table.fnClearTable(0);
			this.table.fnAddData(this.dataset);
			this.table.fnDraw();
		}
		var self = this;
	
		/* Listen on table row's click event to display the results details */
		$('#searchResultsTable tbody').on('click', 'tr', function() {
				self.table.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				$("#resultDetails").show();
				self.displayDetails(this);
	
		});
	},
	
	/* Function to render the a selected result's details */
	displayDetails :function (obj) {
		var index = obj._DT_RowIndex;
		var rowData = this.dataset[index];
		/* Underscore Template to render html for details of a selected result */
		var resultTemplate = _.template('<div class="result_header"> <%= rowData.owner%>/<%=rowData.name%> </div><dl><dt>Language</dt><dd><%=rowData.language%></dd><dt>Followers</dt><dd><%=rowData.followers%></dd><dt>URL</dt><dd><a href= "<%=rowData.url%>" ><%=rowData.url%></a><dt>Description</dt><dd><%=rowData.description%></dd></dl></dd>',{rowData : rowData});
		$("#resultDetails").html(resultTemplate);
	
	},
	
	/* Function to display results */
	 displayResults: function(data) {
		 var self = this;
		if(data.repositories.length > 0){
			$('#searchResults').show();
			this.dataset = data.repositories;
		}else{
			$("#errorMsg").html("No Data Available!").show();
		}
		/* Call function to display results in tabular format */
		self.displayTable();
	}
	
	
	
	

};