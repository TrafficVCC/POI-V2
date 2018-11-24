/**
 * 定义整个系统的交互方式
 */

$(".custom-select").on('change', function() {
    window.cur_area = this.value;
    var text = "当前区域-" + $(this).find("option:selected").text();
    $(".area").html(text);

    //update view
    drawHeatMap(window.clusterdataPath + xzqh[window.cur_area]['cluster']);
});