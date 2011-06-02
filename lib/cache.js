(function() {
    
    fu.lib.createCache = function(name, options) {
        var tableName = name.toString();
        var cache = fu.config.cache.merge(options);
                
        function log(message) {
    		if(cache.logEnabled) {
    			Ti.API.info('TiFu Cache - '+message);
    		}
    	}
    	
    	function logError(error) {
    	    Ti.API.error('TiFu cache - '+JSON.stringify(error));
    	}
        
		function init() {
			var db = getDB();
			db.execute('CREATE TABLE IF NOT EXISTS '+tableName+' (key TEXT PRIMARY KEY, value TEXT, expires_at INTEGER)');
			db.close();
			log('Initialized '+tableName+' cache');
			// set cache expiration task
			if (cache.sweepIntervalSeconds) {
			    setInterval(doExpiration, cache.sweepIntervalSeconds * 1000);
    			log('Will expire objects every ' + cache.sweepIntervalSeconds + ' seconds');
			}
		};
		
		function destroy() {
		    var db;
		    try {
		        db = getDB();
		        db.execute('DROP TABLE '+tableName);
		        log('Destroyed ' + tableName + ' cache');
		    } catch (e) {
		        logError(e);
		    } finally {
		        if (db) {
		            db.close();
		        }
		    }
		};
		
		function doExpiration() {
		    var db;
		    try {
		        db = getDB();
    			db.execute('DELETE FROM '+tableName+' WHERE expires_at <= ?', currentTimestamp());
				if(db.rowsAffected > 0) {
	    			log('Expiration removed ' + db.rowsAffected + ' expired objects');
				}
		    } catch (e) {
		        logError(e);
		    } finally {
		        if (db) {
		            db.close();
		        }
		    }
		}
		
    	function getDB() {
    	    return Titanium.Database.open('tifu_cache');
    	}
		
		function currentTimestamp() {
		    return Math.floor(new Date().getTime() / 1000);
		}
		
		cache.put = function(key, value, expiration_seconds) {
		    var db;
		    var jsonValue = JSON.stringify(value);
		    var expiration = currentTimestamp() + fu.lib.defined(expiration_seconds,cache.expirationSeconds);
		    try {
		        db = getDB();
		        db.execute('INSERT OR REPLACE INTO '+tableName+'(key,value,expires_at) VALUES(?,?,?)', key, jsonValue, expiration);
    		    log('Put key: '+key+'. Will expire at '+expiration);
		    } catch (e) {
		        logError(e);
		    } finally {
		        if (db) {
		            db.close();
		        }
		    }
		};
		
		cache.get = function(key) {
		    var db;
		    var found = null; 
			var resultSet;
			try {
			    db = getDB();
			    resultSet = db.execute('SELECT value FROM '+tableName+' WHERE key = ?', key);
    			if (resultSet.isValidRow()) {
    			    log('GET found '+key);
    			    found = JSON.parse(resultSet.fieldByName('value'));
    			} else {
    			    log('GET no record for '+key);				
    			}
			} catch (e) {
			    logError(e);
			} finally {
			    if (resultSet) {
			        resultSet.close();
			    }
			    if (db) {
			        db.close();
			    }
			}
			return found;
		};
		
		cache.remove = function(key) {
		    var db;
		    try {
		        db = getDB();
		        db.execute('DELETE FROM '+tableName+' WHERE key GLOB ?', key);
    		    log('Removed ' + db.rowsAffected + ' objects matching ' + key);
		    } catch (e) {
		        logError(e);
		    } finally {
		        if (db) {
		            db.close();
		        }
		    }
		};
		
		cache.expire = function() {
		    doExpiration();
		};
		
		cache.reset = function() {
		    destroy();
            init();
		};
		
        init();
        return cache;
    };
    
})();