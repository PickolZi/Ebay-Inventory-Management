echo "Running database backup"
cur_date=$(date +'%Y-%m-%d')
sqlite3 db.sqlite3 ".backup ./backups/$cur_date.sqlite3"