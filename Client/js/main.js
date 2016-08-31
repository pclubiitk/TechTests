var noOfOptions = 0;
var qnType = 0;
// zero represents para type
// one represents single choice type
// two repesents multi choice type
jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        window.document.location = $(this).data("href");
    });
    $(".CreationNav").on('click',function(e) {
        $(e.target).parent.addClass('active');
    });
});
jQuery(document).ready(function($) {
    $("#btnAddOption").click(function() {
        // adding an option
        noOfOptions += 1;
        var sa1 = $('<div>').addClass('row').attr('id','Opt'+noOfOptions).css({'margin-top':'15px'});
        var sa2 = $('<div>').addClass('col-sm-1').html(noOfOptions+'.');
        var sa3 = $('<div>').addClass('col-sm-9');
        var sa4 = $('<input>').addClass('form-control').attr({placeholder:'Option',id:('currentInput'+noOfOptions),type:'text'});
        var sa5 = $('<div>').addClass('col-sm-1');
        var sa6 = $('<button>').addClass('btn btn-default').attr('type','button').on('click',function(e){
            $(e.target).parents('.row')[0].remove();
        });
        var sa7 = $('<span>').addClass('glyphicon glyphicon-remove');
        sa6.append(sa7);
        sa5.append(sa6);
        sa3.append(sa4);
        sa1.append(sa2).append(sa3);
        sa1.append(sa5);
        $('#OptHolder').append(sa1);
    });
    $("#btnClearOption").click(function($) {
        noOfOptions = 0;
        document.getElementById("OptHolder").innerHTML = "";
    })
    $("#AddQuestionToList").click(function() {
    });
});


function removeElement(elem_id, $) {
    $(elem_id).remove();
}

function choosePara() {
    document.getElementById("currentChoice").innerHTML = "Paragraph";
    document.getElementById("ParagraphTypeDiv").className = "col-sm-9 collapse in";
    document.getElementById("OptionsDiv").className = "col-sm-9 collapse";
    qnType = 0;
}
function chooseMCQ() {
    document.getElementById("currentChoice").innerHTML = "Single Correct";
    document.getElementById("ParagraphTypeDiv").className = "col-sm-9 collapse";
    document.getElementById("OptionsDiv").className = "col-sm-9 collapse in";
    qnType = 1;
}
function chooseMulti() {
    document.getElementById("currentChoice").innerHTML = "Multiple Correct";
    document.getElementById("ParagraphTypeDiv").className = "col-sm-9 collapse";
    document.getElementById("OptionsDiv").className = "col-sm-9 collapse in";
    qnType = 2;
}
