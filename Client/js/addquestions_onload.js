
function loaded() {
  $('.modal-trigger').leanModal();
  $('select').material_select();

  //React to question type changes - hide/display option-making menu
  document.getElementById("questionType").onchange = function() {
    var newVal = document.getElementById("questionType").value;
    if(newVal!="singleans" && newVal!="multians") {
      document.getElementById("optionAdditionPanel").style.display = "none";
      document.getElementById("newOption").style.display = "none";
      document.getElementById("optionList").style.display = "none";
    } else {
      document.getElementById("optionAdditionPanel").style.display = "";
      document.getElementById("newOption").style.display = "";
      document.getElementById("optionList").style.display = "";
    }
  };

  // Add a new question from the data in the modal and clean it up for further use
  document.getElementById("addButton").onclick = function() {
    //Need to sanitize Modal and save the question as a question object in my model
    $("#createQModal").closeModal();
    //Saving
    //Question()
    var statement = document.getElementById("questionStatement").value;
    document.getElementById("questionStatement").value = "";
    var qtype = document.getElementById("questionType").value;
    document.getElementById("questionType").value = "singleans";
    $('select').material_select();
    var alternatives = [];
    var lis = document.getElementsByTagName("li");
    for(var i=0; i!= lis.length; i++) {
      if(lis[i].className == "collection-item" && lis[i].parentNode.id == "optionList") {
        alternatives.push(lis[i].innerHTML.split("<a")[0]); //TODO: fix this. Use firstChild
      }
    }
    for(var i=0; i!= lis.length; i++) {
      if(lis[lis.length-1].className == "collection-item" && lis[lis.length-1].parentNode.id == "optionList") {
        lis[lis.length-1].parentNode.removeChild(lis[lis.length-1]);
      }
    }
    var alteradd = document.getElementById("optionAddition").checked;
    document.getElementById("optionAddition").checked = false;
    var ques = new Question(statement, qtype, alternatives, alteradd);
    questions.push(ques);
    updateQList(ques);
    // alert(JSON.stringify(ques));


  };

  // Add a new option (with an option to delete it)
  document.getElementById("newOption").onkeypress = function(e) {
    var keynum=null;
    if(window.event) {
      keynum = e.keyCode;
    } else if(e.which) {
      keynum = e.which;
    }
    if(keynum!=13) return; //Check if keypressed is "Enter". If not, exit.
    var q = document.getElementById("newOption");
    var op = document.createElement("li");
    var removal = document.createElement("a");
    removal.className = "secondary-content";
    removal.href = "#!";
    removal.onclick = function() {
      op.parentNode.removeChild(op);
    };
    removal.appendChild(document.createTextNode("remove"));
    op.className = "collection-item";
    op.appendChild(document.createTextNode(q.value));
    op.appendChild(removal);
    document.getElementById("optionList").appendChild(op);
    q.value="";
  };

  //Placeholder for the function that wil finally send the test to the server. Displays an alert as of now
  document.getElementById("doneWith").onclick = function() {
    alert(JSON.stringify(questions));
  };
}

function createRow(name, content) {
  // Generates the body of a collapsible element. Name is the thing on the left which is bold and content is a Node created using document.createElement
  var row = document.createElement("div");
  row.className = "";
  //  TODO cleanup here. Correct, but messy.
  var leftDiv = document.createElement("div");
  leftDiv.className = "strong col s2 center";
  leftDiv.appendChild(document.createTextNode(name));
  row.appendChild(leftDiv);
  var rightDiv = document.createElement("div");
  rightDiv.className = "col s10";
  rightDiv.appendChild(content);
  row.appendChild(rightDiv);
  return row;
}

function updateQList(q) {
  //Updates the UL that has all the questions
  // q is a question here
  // Prepare collapsible header
  var title = q.statement;
  if(title.length > 100) title = title.slice(0,96) + "...";
  var qLi = document.createElement("li"); // The li element associated with the qList in the final page
  var colHeader = document.createElement("div") // Collapsible header
  colHeader.className = "collapsible-header strong center";
  colHeader.appendChild(document.createTextNode(title));

  // Now append the "delete question" thing to the collapsible header
  var deletingLink = document.createElement("a");
  deletingLink.className = "secondary-content";
  deletingLink.appendChild(document.createTextNode("delete"));
  colHeader.appendChild(deletingLink);
  // Add functionality to the deletingLink text
  deletingLink.onclick = function() {
    // TODO: Feel sorry for this later on. Feel great now.
    deletingLink.parentNode.parentNode.parentNode.parentNode.removeChild(deletingLink.parentNode.parentNode.parentNode);
    // Also need to remove the offending(read: to be deleted) question from the array of all questions
    questions.pop(q);
  };


  qLi.appendChild(colHeader);
  // End collapsible head

  // Build the collapsible body
  var colBody = document.createElement("div");
  colBody.className = "collapsible-body row";
  colBody.appendChild(createRow("Statement: ", document.createTextNode(q.statement)));
  colBody.appendChild(createRow("Type: ", document.createTextNode(q.getType())));

  if(q.alternatives) {
    var ul = document.createElement("ul");
    for(var i=0; i!=q.alternatives.length; i++) {
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(q.alternatives[i]));
      ul.appendChild(li);
    }
    if(q.alteradd) {
      var li = document.createElement("li");
      li.appendChild(document.createTextNode("(User Added Option(s))"));
      ul.appendChild(li);
    }
    colBody.appendChild(createRow("Options: ", ul));
  }

  qLi.appendChild(colBody);

  // Now append the whole thing to the qList
  document.getElementById("qList").appendChild(qLi);
}
