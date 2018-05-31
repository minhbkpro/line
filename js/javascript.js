/* 
 * Copyright by minhbkpro email : minhbkpro@gmail.com
 * Accordition menu by izwebz.com
 */
jQuery(document).ready(function($){
    //thiết lập các giá trị ban đầu
    $.cookie('jumping', 0);
    $.cookie('jumping_color', 0);
    $.cookie('marked', 0);//biến lưu giá trị 1 khi ăn điểm
    taglist = new Array();//đây là mảng chứa các ô chưa vẽ bóng - chứa các số từ 11 đến 99
    small_list = new Array();//mảng này chứa các quả bóng nhỏ đã vẽ, đây là mảng 2 chiều , [0][0] chứa ô [0][1] chứa màu bóng
    level = 3;
    time = 0;

    //chèn các thẻ li vào ui
    for(var i = 1; i <= 9; i ++){
        for(var j = 1; j <= 9; j ++){
            if(i != 1||j != 1){
                $('#line li:last-child').after('<li value='+i+j+'></li>');
            }
        }
    }

    //khi chọn new game
    $('#start').click(function(){
        if(taglist.length != 0){
            if(confirm('Bạn thực sự muốn bỏ màn đang chơi ?'))$().newGame();
        }
        else $().newGame();
    });

    //khi chọn end game
    $('#end').click(function(){
        if(taglist.length != 0){
            if(confirm('Bạn có thực sự muốn kết thúc game ?'))$().endGame();
        }
    });

    //xử lý khi click
    $('#line li').click(function(){
        if($(this).getColor() >= 1){//click vào bóng
            $(this).ballClick();
        }
        else{//click vào ô trống
            var jumping = $.cookie('jumping');
            var jumping_color = $.cookie('jumping_color');
            if(jumping != 0)
                $().move(parseInt(jumping), parseInt($(this).attr('value')));
        }
//        alert(small_list.length);
    });

    //pause and play
    $('#play').click(function(){
        if(taglist.length != 0){
            if($(this).attr('class') == 'pause'){
                $().pause();
            }
            else{
                $().play();
            }
        }
    });

    //right content
    $('dd:not(:first)').hide();
    $('dt a').click(function()  {
        $('dd:visible').slideUp('slow');
        $('.active').removeClass('active');
        $(this).parent().addClass('active').next().slideDown('slow');
        return false;
    });

});