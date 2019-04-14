/* 
 * Copyright by minhbkpro email : minhbkpro@gmail.com
 */
//var local = 'minhbkpro';
jQuery(document).ready(function($){
    
    //hàm vẽ bóng vào ô , nếu tham số là 0 thì bóng random , tham số từ 1 đến 6 thì tương ứng với 6 loại bóng
    jQuery.fn.drawBall = function(i, type){//type có 2 giá trị là b(big) và s(small)
        var tag = parseInt($(this).attr('value'));
        var color = $().randomBetween(1, 6);
        if(i != 0)
            color = i;
        var random_ball = 'ball'+color+'_'+type;
        $(this).html('<img class="ball '+type+' '+random_ball+'" src="images/'+random_ball+'.png" />');

        $().deleteElement(taglist, tag);//xóa cả trường hợp vẽ bóng nhỏ, ta sẽ add trở lại sau đó để tránh random bị trùng

        if(type == 's'){//thêm bóng vào mảng small_list
            var small_list_length = small_list.length;
            small_list[small_list_length] = new Array();
            small_list[small_list_length][0] = tag;
            small_list[small_list_length][1] = color;
        }

        //nếu vẽ quả bóng to thì ta tiến hành tính điểm
        if(type == 'b'){
            $().mark(tag, color);
        }
    }

    //hàm xóa bóng khỏi ô
    jQuery.fn.deleteBall = function(tag){
        var value = 0;
        if(tag != null){
            $('#line li[value='+tag+']').find('img').remove();
            value = tag;
        }
        else{
            $(this).find('img').remove();
            value= $(this).attr('value');
        }

        //thêm ô đx xóa vào mảng taglist
        taglist[taglist.length] = value;
    }

    //hàm xóa bóng khỏi mảng, giá trị truyền vào là giá trị của phần tử chứ ko phải vị trí
    jQuery.fn.deleteElement = function(array, value){
        for(var m = 0; m < array.length; m ++){
            if(array[m] == value)break;
        }
        array.splice(m, 1);
//        alert(value+'-'+taglist.length);
    }

    //hàm làm bóng chuyển động lên xuống
    jQuery.fn.jump = function(){
        var ball = $(this).find('img');
        ball.animate({top:'-=5px'},100);
        ball.everyTime(10, function(){
            ball
            .animate({top:'+=13px',height:'-=3px'},300)
            .animate({top:'-=13px',height:'+=3px'},300)
            ;
        });
    }

    //hàm dừng chuyển động của bóng
    jQuery.fn.stopJumping = function(){
        var img = $(this).find('img');
        img.stop(true).stopTime();
        img.css({'top':'50%','height':'32px'});
    }

    //hàm lấy số ngẫu nhiên từ a đến b
    jQuery.fn.randomBetween = function(a, b){
        return a + Math.floor(Math.random()*(b - a + 1));
    }

    //hàm trả về địa chỉ ô ngẫu nhiên trong ma trận 9x9
    jQuery.fn.randomTag = function(){
        var num1 = $().randomBetween(1, 9)+''; //cộng với '' là để chuyển sang string
        var num2 = $().randomBetween(1, 9)+'';
        return num1 + num2;
    }

    //hàm kiểm tra địa chỉ là hợp lệ
    jQuery.fn.checkAdd = function(a){
        var a1 = (a-a%10)/10;
        var a2 = a%10;
        if(a1 < 1||a1 > 9||a2 < 1||a2 > 9)return false;
        return true;
    }

    //hàm trả về màu của bóng trong ô , nếu không tồn tại bóng thì trả về -1, bóng nhỏ thì trả về 0, bóng to trả về màu bóng từ 1 đến 6, hàm này cũng dùng để check xem trong ô có bóng hay không
    jQuery.fn.getColor = function(tag){//tag ở đây là thẻ li, nếu không truyền thẻ tag thì tự dộng lấy từ this
        var img = null;
        if(tag != null)img = $('#line li[value='+tag+']').find('img');
        else img = $(this).find('img');
        
        if(img.length == 0)return -1;
        var clas = img.attr('class');
        if(clas[5] == 's')return 0;
        else return clas[11];
    }

    //hàm vẽ n quả bóng ngẫu nhiên vào n ô ngẫu nhiên chưa có bóng
    jQuery.fn.drawRandomBall = function(n, type){//type có giá trị là b(big) và s(small)
        var random_tag = 0;
        for(var i = 1; i <= n; i ++){
            if(taglist.length < 1)break;
            random_tag = $().randomBetween(0, taglist.length - 1);
            $('li[value='+taglist[random_tag]+']').drawBall(0,type);
        }
        if(type == 's'){//nếu là vẽ bóng nhỏ thi ta phải add các phàn tử trong small_list trở lại mảng taglist
            for(var j = 0; j < small_list.length; j ++){
                taglist[taglist.length] = small_list[j][0];
            }
        }
    }

    //hàm vẽ bóng ở bước tiếp theo - vẽ các quả bóng lưu trong mảng small_list
    jQuery.fn.drawNextBall = function(){
        for(var i = 0;i < small_list.length; i++){
            $('#line li[value='+small_list[i][0]+']').drawBall(small_list[i][1], 'b');
        }
        small_list = [];
    }

    //hàm di chuyển bóng theo đường thẳng từ a đến b
    jQuery.fn.moveTo = function(path, i, jumping_color){//i là vị trí trong mảng path chứa bóng cần di chuyển
        var a = path[i],b = path[i-1];
        var a1 = (a - a%10)/10;
        var a2 = a%10;
        var b1 = (b - b%10)/10;
        var b2 = b%10;
        if(a1 == b1){//di chuyển theo chiều ngang
            $('li[value='+path[path.length-1]+'] img').animate({
                left: '+='+52*(b2-a2)
            },10,function(){
                $().moveTo(path, i - 1, jumping_color);
            });
        }
        else if(a2 == b2){//di chuyển theo chiều dọc
            $('li[value='+path[path.length-1]+'] img').animate({
                top: '+='+52*(b1-a1)
            },10,function(){
                $().moveTo(path, i - 1, jumping_color);
            });
        }
        if(i == 1){//di chuyển đến ô cuối cùng
            $('li[value='+path[path.length-1]+']').deleteBall();
            var last_tag = $('li[value='+path[0]+']');
            if(last_tag.getColor() == 0){//ô di chuyển đến là một ô đã có bóng nhỏ
                var last_tag_value = parseInt(last_tag.attr('value'));
                for(var j = 0; j < small_list.length; j ++){
                    if(small_list[j][0] == last_tag_value){
                        small_list.splice(j, 1);
                        break;
                    }
                }
            }
            last_tag.drawBall(jumping_color,'b');
            
            //xóa ô di chuyển đến khỏi mảng taglist và thêm ô cũ vào
//            $().deleteElement(taglist, path[0]);
//            taglist[taglist.length] = path[path.length - 1];

            //vẽ các quả bóng to và bóng nhỏ tiếp theo
            if($.cookie('marked') == 0){//nếu ăn điểm thì không vẽ bóng nữa
//                alert(small_list.length+'-'+level);
                $().drawNextBall();
                $().drawRandomBall(level, 's');
            }
        }
    }

    //hàm di chuyển bóng giữa 2 vị trí bất kỳ a , b
    jQuery.fn.move = function(a, b){
        var jumping = $.cookie('jumping');
        var jumping_color = $.cookie('jumping_color');
        var path = $().dijkstra(a, b);
        if(path != null){
            $('#line li[value='+jumping+']').stopJumping();
            $().moveTo(path, path.length - 1, jumping_color);
        }

        //di chuyển xong thì dừng lại
        $.cookie('jumping', 0);
        $.cookie('jumping_color', 0);

        //nếu chỉ còn một ô trống thì kết thúc game
        if(taglist.length == 1)$().endGame();
    }

    //hàm xử lý khi click vào bóng
    jQuery.fn.ballClick = function(){
        var jumping = $.cookie('jumping');
        if(jumping != 0){
            $('#line li[value='+jumping+']').stopJumping();
        }
        $.cookie("jumping", $(this).attr("value"));
        $.cookie("jumping_color", $(this).getColor());
        $(this).jump();

        //debug
//        alert(taglist.length);
    }

    /*các hàm cho giải thuật tìm đường*/

    //hàm kiểm tra các ô tiếp theo có thể đi từ ô a, trả về mảng các phần tử , chưa xét xem ô có thể đi đã nằm trong mảng c hay chưa
    jQuery.fn.checkStep = function(a){
        var arr = new Array();
        var top = a - 10,right = a + 1,bottom = a + 10,left = a - 1;
        if($().checkAdd(top) == true && $('#line li[value='+top+']').getColor() <= 0)arr[arr.length] = top;//trên
        if($().checkAdd(right) == true && $('#line li[value='+right+']').getColor() <= 0)arr[arr.length] = right;//phải
        if($().checkAdd(bottom) == true && $('#line li[value='+bottom+']').getColor() <= 0)arr[arr.length] = bottom;//dưới
        if($().checkAdd(left) == true && $('#line li[value='+left+']').getColor() <= 0){arr[arr.length] = left;}//trái
        return arr;
    }

    //hàm kiểm tra xem ô a đã nằm trong mảng c hay chưa, nếu chưa thì trả về -1, ngược lại trả về vị trí của a trong mảng c
    jQuery.fn.checkC = function(c, a){
        for(var i = 0; i < c.length; i ++){
            if(c[i][0] == a)return i;
        }
        return -1;
    }
    //hàm thêm một ô vào mảng c
    jQuery.fn.pushC = function(c, a, prev, length){//a là ô cần thêm vào, prev là ô trước đó trên đường đi ngắn nhất, length là độ dài của đường đi ngắn nhất - hai ô kề nhau có length = 1
        var c_length = c.length;
        c[c_length] = new Array();
        c[c_length][0] = a;
        c[c_length][1] = prev;
        c[c_length][2] = length;
    }

    //giải thuật dijkstra tìm đường đi ngắn nhất giữa 2 ô , có xét đến sự tồn tại của các quả bóng khác
    jQuery.fn.dijkstra = function(a, b){//a và b là tọa độ của 2 điểm bất kỳ trên ma trận 9x9
        var c = new Array();//mảng này 2 chiều
        var note = 0;//lưu vị trí của phần tử trong mảng c đang xét
        $().pushC(c, a, a, 0);
        while(note <= c.length){
            if(c[note][0] == b){//tìm thấy b
                var path = new Array();
                var back_note = note;
                while(1){
                    path[path.length] = parseInt(c[back_note][0]);
                    if(c[back_note][0] == a)return path;
                    back_note = $().checkC(c, c[back_note][1]);
                }
            }
            var arr = $().checkStep(c[note][0]);
            for(var i = 0; i < arr.length; i ++){
                var check_value = $().checkC(c, arr[i]);
                if(check_value == -1){
                    $().pushC(c, arr[i], c[note][0], c[note][2] + 1);
                }
                else{
                    if(c[note][2] + 1 < c[check_value][2]){
                        c[check_value][1] = c[note][0];
                        c[check_value][2] = c[note][2] + 1;
                    }
                }
            }
            note ++;
        }
        return null;
    }

    /*các hàm phục vụ tính điểm*/
    //hàm tính điểm theo các đường xung quanh điểm
    jQuery.fn.getMark = function(tag, tag_color, step){//step là sô sẽ cộng vào để nhảy tới quả bóng tiếp theo trên đường thẳng
        var arr = new Array();
        var a = tag - step,b = tag + step;
        while($().checkAdd(a) == true){
            if($().getColor(a) == tag_color)arr[arr.length] = a;
            else break;
            a = a - step;
        }
        while($().checkAdd(b) == true){
            if($().getColor(b) == tag_color)arr[arr.length] = b;
            else break;
            b = b + step;
        }
//        alert('minhbkpro');
        if(arr.length >= 4)return arr;//4 là vì còn ô tag đang xét là 5
        else return null;
    }

    //hàm tính điểm
    jQuery.fn.mark = function(tag, tag_color){//tính điểm bắt đầu từ thẻ tag
        tag = parseInt(tag);//chuyển sang int cho chắc ăn, vì tham số đầu vào có thể ở dạng string
        tag_color = parseInt(tag_color);

//        alert('tag:'+tag+'-color:'+tag_color);

        var array = new Array();
        var mark = 0;

        var a = $().getMark(tag, tag_color, 10);//tính điểm theo đường thẳng đứng
        var b = $().getMark(tag, tag_color, 9);//tính điểm theo đường xiên phải
        var c = $().getMark(tag, tag_color, 11);//tính điểm theo đường xiên trái
        var d = $().getMark(tag, tag_color, 1);//tính điểm theo đường ngang

        if(a != null){
//            if(a.length >= 8)mark += 2;//ăn theo cả 2 phía
//            else mark += 1;
            mark += a.length;
            for(var i = 0; i < a.length; i++){
                $().deleteBall(a[i]);
            }
        }
        if(b != null){
//            if(b.length >= 8)mark += 2;//ăn theo cả 2 phía
//            else mark += 1;
            mark += b.length;
            for(var i = 0; i < b.length; i++){
                $().deleteBall(b[i]);
            }
        }
        if(c != null){
//            if(c.length >= 8)mark += 2;//ăn theo cả 2 phía
//            else mark += 1;
            mark += c.length;
            for(var i = 0; i < c.length; i++){
                $().deleteBall(c[i]);
            }
        }
        if(d != null){
//            if(d.length >= 8)mark += 2;//ăn theo cả 2 phía
//            else mark += 1;
            mark += d.length;
            for(var i = 0; i < d.length; i++){
                $().deleteBall(d[i]);
            }
        }

        if(mark != 0){
            $().deleteBall(tag);
            $.cookie('marked', 1);
            mark += 1;
        }
        else $.cookie('marked', 0);

        mark = (mark - 4)*mark;

        var old_mark = parseInt($('#mark').html());

        mark = mark + 0 + old_mark;

        $('#mark').html(mark);
    }

    //debug
    jQuery.fn.debug = function(){
        alert('Mảng taglist có '+taglist.length+' phần tử . mảng small_list có '+small_list.length+' phần tử :'+small_list[0]+'-'+small_list[1]+'-'+small_list[2]);
    }

    //new game
    jQuery.fn.newGame = function(){
        //resest
        time = 0;
        small_list = [];
        $.cookie('jumping', 0);
        $.cookie('jumping_color', 0);
        $.cookie('marked', 0);//biến lưu giá trị 1 khi ăn điểm
        taglist = [];
        for(var i = 1; i <= 9; i++){
            for(var j = 1; j <= 9; j++){
                taglist[taglist.length] = i + '' + j + '';
            }
        }

        level = parseInt($('#level input:checked').attr('value'));
        $('#line li img').remove();
        $().drawRandomBall(level, 'b');
        $().drawRandomBall(level, 's');

        $('#time').stop(true).stopTime();

        $().clock();
    }

    //end game
    jQuery.fn.endGame = function(){
        var mark = $('#mark').html();
        var time = $('#time').html();
        $('#time').stop(true).stopTime();
        alert('Game over ! điểm số : '+mark+' thời gian : '+time);
        $('#line li img').remove();
        $('#time').html('00:00:00');
        time = 0;
        taglist = [];
        $('#play').removeClass().addClass('pause');
    }

    //play
    jQuery.fn.play = function(){
        $().clock();
        $('#play').removeClass().addClass('pause');
        $('#line li img').show();
    }

    //pause
    jQuery.fn.pause = function(){
        $('#play').removeClass().addClass('play');
        $('#line li img').hide();
        $('#time').stop(true).stopTime();
    }

    //clock
    jQuery.fn.clock = function(){
        $('#time').everyTime(1000,function(){
            time += 1;
            var second = time%60;if(second < 10)second = '0'+second;
            var minute = ((time - second)/60)%60;if(minute < 10)minute = '0'+minute;
            var hour = ((time - second)/60 - minute)/60;if(hour < 10)hour = '0'+hour;
            $('#time').html(hour+':'+minute+':'+second);
        });
    }
});