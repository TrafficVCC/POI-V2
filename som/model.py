from som import MysqlUtil
import json
import config

mysqlHelper = MysqlUtil.MysqlUtil('127.0.0.1', 'root', 'asdf', 'vccp')
pois = config.get_pois()
radius = config.get_radius()
precise = config.get_precise()

def getAllArea():
    """
    查询所有事故点
    :return: [{},{},...]
    """
    conn, cur = mysqlHelper.getConnect()
    sql = "select xzqhms, sgdd, lng_bmap as lng, lat_bmap as lat, count(*) as count from ybsg \
           where precise = 1 group by xzqhms, sgdd, lng_bmap, lat_bmap"
    rv = mysqlHelper.fetchall(sql)
    mysqlHelper.close(conn, cur)
    return rv

def getAreaByName(name):
    """
    根据行政区划名称查询
    :param name:
    :return:
    """
    conn, cur = mysqlHelper.getConnect()
    sql = "select xzqhms, sgdd, lng_bmap as lng, lat_bmap as lat, count(*) as count from ybsg \
              where xzqhms = %s and precise = 1 group by xzqhms, sgdd, lng_bmap, lat_bmap"
    rv = mysqlHelper.fetchall(sql, name)
    mysqlHelper.close(conn, cur)
    return rv

def _getPoiBySgdd(sgdd, xzqh):
    """
    根据事故地点获取其附近POI
    :param sgdd:
    :return:
    """
    conn, cur = mysqlHelper.getConnect()
    sql = "select type, distance from poi where sgdd = %s and xzqhms = %s \
           and type in %s and distance <= %s"
    rv = mysqlHelper.fetchall(sql, (sgdd, xzqh, pois, radius))
    mysqlHelper.close(conn, cur)
    return rv

def getPoiByArea(xzqh):
    """
    获取行政区划下事故地点的POI
    :param xzqh:
    :return: [{'center': {'sgdd': 'aa', 'lng': 11, 'lat': 22, count: 4},
               'poi': [{'type': xx, 'dis': 123}, {}, ...] }]
    """
    sgdd_list = getAreaByName(xzqh)
    poi_list = []
    count = 0   #有的事故地点没有poi点
    for item in sgdd_list:
        sgdd = item['sgdd']
        rv = _getPoiBySgdd(sgdd, xzqh)
        pp = {}
        if rv:
            pp['center'] = {'sgdd': sgdd, 'lng': item['lng'], 'lat': item['lat'], 'count': item['count']}
            pp['poi'] = rv
            poi_list.append(pp)
            print(pp)
        else:
            count += 1
    print(count)
    return poi_list

def _updateSomType(data):
    conn, cur = mysqlHelper.getConnect()
    sql = "update ybsg set type = %s \
           where xzqhms = %s and sgdd = %s and lng_bmap = %s and lat_bmap = %s"

    count = mysqlHelper.update(sql, data, batch=1)
    conn.commit()
    mysqlHelper.close(conn, cur)
    return count

def storeSom(path, xzqh):
    """
    存储som的分类结果到数据库
    :param path:
    :param xzqh:
    :return:
    """
    data = []
    with open(path, 'r', encoding='UTF-8') as load_f:
        data = json.load(load_f)
        for d in data:
            somType = d['class']
            print("class: " + str(somType))
            li = []
            for point in d['points']:
                sgdd = point['sgdd']
                lng = point['lng']
                lat = point['lat']
                item = (somType, xzqh, sgdd, lng, lat)
                li.append(item)
                print(item)
            count = _updateSomType(li)
            print(count)

if __name__ == '__main__':
    base = "../static/clusterdata/"
    fileName = "yaohaiquClusters.json"
    xzqh = "瑶海区"
    path = base + fileName
    #storeSom(path, xzqh)
    getPoiByArea('市辖区')