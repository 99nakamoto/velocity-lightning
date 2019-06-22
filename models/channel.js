// 模块引入
var mysql = require('mysql')
var config = require('../common/config.js')

// 建立连接池
var pool = mysql.createPool({
	host : config.database.HOST,
	user : config.database.USERNAME,
	password : config.database.PASSWORD,
	database : config.database.DATABASE,
})

let query = function(sql, values) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection) {
			if (err) {
				reject(err)
			} else {
				connection.query(sql, values, (err, rows) => {
					if (err) {
						reject(err)
					} else {
						resolve(rows)
					}
					connection.release()
				})
			}
		})
	})
}

// 通道数据添加
let insertData = function(value) {
	let sql = "insert into channels(channel_name, channel_sponsor_id, channel_receive_id, channel_add_time, channel_status,"+
	" channel_sponsor_amount, channel_receive_amount, channel_sponsor_version_pubkey, channel_sponsor_version_secret_key,"+
	" channel_sponsor_ratchet_pubkey, channel_sponsor_ratchet_secret_key, channel_receive_version_pubkey, channel_receive_version_secret_key,"+
	" channel_receive_ratchet_pubkey, channel_receive_ratchet_secret_key, channel_receive_deposit, channel_sponsor_deposit) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
	return query(sql, value)
}

// 通过ID查找通道
let findDataById = function(value) {
	let sql = `select * from channels where channel_id = ?;`
	return query(sql, value)
}

// 通过ID查找通道数量
let findDataCountById = function(value) {
	let sql = `select count(*) as count from channels where channel_sponsor_id = ${value} or channel_receive_id = ${value};`
	return query(sql, value)
}

// 通道列表
let listData = function(value) {
	let sql = `select * from channels where channel_sponsor_id = ${value[1]} or channel_receive_id = ${value[1]} order by channel_id desc limit ${(value[0]-1)*10},10;`
	return query(sql)
}

module.exports = {
	insertData,
	findDataById,
	findDataCountById,
	listData,
}
