cur_date=$(date +'%Y-%m-%d')
echo "$cur_date: Running database backup"
sqlite3 db.sqlite3 ".backup /home/pickolzi/Ebay-Inventory-Management/backend/instance/backups/$cur_date.sqlite3"