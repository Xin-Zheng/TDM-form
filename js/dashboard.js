/**
 * Created by xiaogelunbu on 8/24/16.
 */


var tableContent = '';

$.getJSON( '/application', function( data ) {

  // For each item in our JSON, add a table row and cells to the content string
  $.each(data, function(){
    tableContent += '<tr>';
    tableContent += '<td>' + this.address + '</td>';
    tableContent += '<td>' + this.AssessorsBlock + '</td>';
    tableContent += '<td>' + this.TAZ + '</td>';
    tableContent += '<td>' + this.date + '</td>';
    tableContent += '<td>' + this.measures + '</td>';
    tableContent += '<td>' + this.comment + '</td>';
    tableContent += '</tr>';
    $("#measurecol").attr({ 'data-hide': "all" });
    $("#commentcol").attr({ 'data-hide': "all" });

  });

  // Inject the whole content string into our existing HTML table
  $('#application').html(tableContent);
  $('table').trigger('footable_redraw');
  $('table').trigger('footable_expand_first_row');



});
