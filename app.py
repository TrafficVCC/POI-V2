from flask import Flask
from flask_mysqldb import MySQL
from flask import render_template, request, jsonify
import models
import json

app = Flask(__name__)
app.config.from_object('config')
mysql = MySQL(app)

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/area', methods=['GET', 'POST'])
def area():
    # 获取Get数据
    xzqh = request.args.get('xzqh', None)
    res = []
    print(xzqh)
    if xzqh is None:
        return res
    elif xzqh == 'all':
        res = models.getAllArea()
    else:
        res = models.getAreaByName(xzqh)
    print(len(res))
    return jsonify(res)

@app.route('/poi', methods=['GET', 'POST'])
def poi():
    # 获取poi数据
    xzqh = request.args.get('xzqh', None)
    if xzqh is None:
        return
    res = models.getPoiByArea(xzqh)
    print(len(res))
    return jsonify(res)

@app.route("/typepoi", methods=['GET', 'POST'])
def typepoi():
    type = request.args.get('type', None)
    xzqh = request.args.get('xzqh', None)
    area = request.args.get('area', None)
    if xzqh is None or type is None:
        return
    print(xzqh)
    print(type)
    res = models.poiType(xzqh, area, type)
    return jsonify(res)

@app.route('/geojson', methods=['GET', 'POST'])
def geojson():
    #存储geojson文件
    path = "./static/geojsondata/"
    data = json.loads(request.form.get('data'))
    filename = request.form.get('filename') + ".geojson"
    print(data)
    with open(path+filename, 'w') as f:
        f.write(json.dumps(data, indent=2, ensure_ascii=False))
    return str("success")

if __name__ == '__main__':
    app.run(debug=True)