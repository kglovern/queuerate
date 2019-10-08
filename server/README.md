# To install dependencies
1) activate your virtual env
2) run "pip install -r requirements.txt"

# To run application
1) run the command "python run.py"
2) Application is available on localhost:8080

# To create/run migrations

1) Remove the migrations folder if desired
2) Make sure you're in your virtualenv
3) run "flask db init" if migrations folder does not exist
4) run "flask db migrate" to generate updated migrations.  
5) run "flask db upgrade" to apply those migrations to the database

Most migration problems can be solved by removing the *.db and migrations folder and regenerating them