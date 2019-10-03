from flask import Flask, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
# Module imports
from app.category.controllers import category_controller as category_module



app = Flask(__name__)
app.config.from_object('config')

# Database configuration
db = SQLAlchemy(app)
migrate = Migrate(app, db)
# import models so the migration util will pick them up
from app import models

main = Blueprint("main", __name__)


@main.route('/')
def index():
    """
    Landing page for the user
    :return:
    """
    return "Hello World"


app.register_blueprint(main, url_prefix='/')
app.register_blueprint(category_module, url_prefix='/categories')
