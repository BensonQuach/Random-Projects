function startDojo() {

	require(
			[ "dojox/mobile/parser", // lightweight parser for mobile apps
			"dojox/mobile", // mobile application
			"dojox/mobile/deviceTheme", // using user-agent, loads appropriate
										// theme
			"dojox/mobile/View", // use the View widget to represent the
									// device screen
			"dojox/mobile/parser", "dojox/mobile/Button",
					"dojox/mobile/Slider", "dojox/mobile/TextBox",
					"dojox/mobile/ToggleButton", "dojox/mobile/ScrollableView",
					"dijit/registry", "dojo/domReady!" ], function(parser) {
				// Parse the page for widgets and get them instantiated
				parser.parse();
			});

	require([ "dojo/ready", "dojo/dom", "dojo/dom-style" ], function(ready,
			dom, domStyle) {
		ready(function() {
			// use a timeout just to ensure the page is loaded and themed before
			// showing it
			setTimeout(function() {
				var loadingScreen = dom.byId("loadingScreen");
				domStyle.set(loadingScreen, "display", "none");
			}, 2000);
		});
	});

}

function pageLoad() {
	startDojo();

}

function dialogAlert(txtTitle, txtContent) {

	require([ "dijit/form/Button", "dijit/Dialog" ], function() {

		var thisdialog = new dijit.Dialog({
			title : txtTitle,
			content : txtContent
		});
		dojo.body().appendChild(thisdialog.domNode);
		thisdialog.startup();
		thisdialog.show();
	});

}

window.addEventListener("load", pageLoad, false);

function calculateCGPA() {

	require(
			[ "dijit/registry", "dojox/mobile/deviceTheme", "dojox/mobile",
					"dojo/domReady!", "dojo/json" ],
			function(registry) {
				var transcript = registry.byId("courseList").domNode.children;
				var length = transcript.length;

				if (length > 0) {
					var total = 0.0;
					var courseWeight = 0.0;

					for ( var k = 0; k < length; k++) {

						var entryData = JSON
								.parse(transcript[k].attributes["data"].nodeValue);
						var mark = entryData.mark;
						var credit = entryData.credit;

						if (mark >= 50 && mark <= 52) {
							total += credit * 0.70;
						} else if (mark >= 53 && mark <= 56) {
							total += credit * 1.00;
						} else if (mark >= 57 && mark <= 59) {
							total += credit * 1.30;
						} else if (mark >= 60 && mark <= 62) {
							total += credit * 1.70;
						} else if (mark >= 63 && mark <= 66) {
							total += credit * 2.00;
						} else if (mark >= 67 && mark <= 69) {
							total += credit * 2.30;
						} else if (mark >= 70 && mark <= 72) {
							total += credit * 2.70;
						} else if (mark >= 73 && mark <= 76) {
							total += credit * 3.00;
						} else if (mark >= 77 && mark <= 79) {
							total += credit * 3.30;
						} else if (mark >= 80 && mark <= 84) {
							total += credit * 3.70;
						} else if (mark >= 85) {
							total += credit * 4.00;
						}

						courseWeight += parseFloat(credit);

					}
					registry.byId("CGPA").domNode.children[1].innerHTML = (total / courseWeight)
							.toFixed(2);
				} else {
					registry.byId("CGPA").domNode.children[1].innerHTML = 0.0;
				}

			});
}

addCourse = function() {

	console.log("addCourse executing...")

	require(
			[ "dijit/registry", "dojox/mobile/ViewController",
					"dojox/mobile/deviceTheme", "dojox/mobile/parser",
					"dojox/mobile", "dojox/mobile/Button", "dojo/domReady!",
					"dojox/mobile/ToolBarButton", "dojo/json",
					"dojox/validate/check", "dijit/Dialog" ],
			function(registry) {

				var code = registry.byId("courseCode").value;

				if (code == "") {

					dialogAlert("Attention!",
							"Course code field must not be empty.");
					return;
				}

				var credit = registry.byId("credit").value;

				if (credit == "" || credit < 0 || credit > 1) {
					dialogAlert("Attention!",
							"Credit value must be from 0.0 to 1.0 inclusive.");
					return;
				}

				var mark = registry.byId("mark").value;

				if (mark == "" || !(/^\d*$/.test(mark.toString())) || mark < 0
						|| mark > 100) {

					dialogAlert("Attention!",
							"Mark field must be an integer value from 0 to 100 inclusive.");
					return;
				}

				var confirmCreation = registry.byId("confirm");
				confirmCreation.domNode.attributes["data-dojo-props"].nodeValue = "moveTo:'home'";

				var list = registry.byId("courseList");
				var listLength = list.domNode.children.length + 1;
				var entryJSON = {
					'code' : code,
					'credit' : credit,
					'mark' : mark
				};

				var childWidget = new dojox.mobile.ListItem({
					value : listLength,
					rightText : mark,
					label : code
				});

				childWidget.domNode.setAttribute("data", JSON
						.stringify(entryJSON));
				list.addChild(childWidget);
				calculateCGPA();

				registry.byId("confirm").transitionTo("home");
			});

}

function onClickCreate() {

	console.log("onClickCreate executing...")

	require([ "dijit/registry", "dojox/mobile/deviceTheme", "dojox/mobile",
			"dojo/domReady!" ], function(registry) {

		registry.byId("courseCode").textbox.value = "";
		registry.byId("credit").textbox.value = "";
		registry.byId("mark").textbox.value = "";
	});

}

function onClickEdit() {

	require([ "dijit/registry", "dojox/mobile/deviceTheme", "dojox/mobile",
			"dojo/domReady!", "dojo/json" ], function(registry) {

		var deleteListHandle = registry.byId("deleteList");

		while (deleteListHandle.domNode.firstChild) {
			deleteListHandle.domNode
					.removeChild(deleteListHandle.domNode.firstChild);
		}

		var transcript = registry.byId("courseList").domNode.children;
		var length = transcript.length;

		for ( var k = 0; k < length; k++) {

			var entryDataStr = transcript[k].attributes["data"].nodeValue;
			var entryData = JSON.parse(entryDataStr);
			var mark = entryData.mark;
			var code = entryData.code;

			var childWidget = new dojox.mobile.ListItem({
				value : k + 1,
				rightText : mark,
				label : code
			});

			childWidget.domNode.setAttribute("data", entryDataStr);

			deleteListHandle.addChild(childWidget);
		}

	});
}

function onClickDelete() {

	require(
			[ "dijit/registry", "dojox/mobile/deviceTheme", "dojox/mobile",
					"dojo/domReady!", "dojo/json" ],
			function(registry) {

				var deleteList = registry.byId("deleteList");
				var courseList = registry.byId("courseList");
				var dListDom = deleteList.domNode;
				var cListDom = courseList.domNode;

				console.log(registry.byId("deleteList"));
				console.log(registry.byId("courseList"));

				while (cListDom.firstChild) {
					cListDom.removeChild(cListDom.firstChild);
				}

				var dListChildren = dListDom.children;
				var length = dListChildren.length;

				for ( var k = 0; k < length; k++) {

					console.log(dListChildren[k].attributes["class"]);

					var isChecked = dListChildren[k].attributes["class"].nodeValue
							.indexOf("mblListItemChecked") === -1;

					if (isChecked) {
						var entryDataStr = dListChildren[k].attributes["data"].nodeValue;
						var entryData = JSON.parse(entryDataStr);
						var mark = entryData.mark;
						var code = entryData.code;

						var childWidget = new dojox.mobile.ListItem({
							value : k + 1,
							rightText : mark,
							label : code
						});
						childWidget.domNode.setAttribute("data", entryDataStr);
						courseList.addChild(childWidget);
					}

				}

				calculateCGPA();
				registry.byId("delete").transitionTo("home")

			});
}
