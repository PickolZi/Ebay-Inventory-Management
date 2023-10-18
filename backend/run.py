from inventory_management_system import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')

    with app.app_context():
        db.create_all()