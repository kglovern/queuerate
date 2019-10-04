# To install dependencies
1) activate your virtual env
2) run "pip install -r requirements.txt"

# To run application
1) run the command "python run.py"
2) Application is available on localhost:8080

# To run migrations

1) Make sure you're in your virtualenv
2) run "flask db migrate" to generate updated migrations.  
3) run "flask db upgrade" to apply those migrations to the database